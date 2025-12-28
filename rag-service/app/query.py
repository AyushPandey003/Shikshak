"""RAG query flow with metadata filtering and strict context-only answers."""

import logging
import time

from openai import AzureOpenAI

from app.config import settings
from app.models import QueryRequest, QueryResponse, SourceInfo, DebugInfo
from app.embeddings import get_query_embedding
from app.vectordb import search_chunks
from app.prompts import SYSTEM_PROMPT, build_rag_prompt, NO_CONTEXT_RESPONSE

logger = logging.getLogger(__name__)

# Initialize Azure OpenAI client for LLM
client = AzureOpenAI(
    api_key=settings.AZURE_OPENAI_API_KEY,
    api_version=settings.AZURE_OPENAI_API_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
)


def query_rag(request: QueryRequest) -> QueryResponse:
    """Execute RAG query with metadata filtering.

    Args:
        request: Query request with filters

    Returns:
        QueryResponse with answer, sources, and debug info
    """
    import time
    from app.cache import get_cached_query, cache_query_result
    
    start_time = time.time()
    
    # Check cache first (include full_context in cache key)
    cache_key_top_k = -1 if request.full_context else request.top_k
    cached = get_cached_query(
        request.query, 
        request.course_id, 
        request.module_id, 
        cache_key_top_k
    )
    if cached:
        cached_time = time.time()
        # Return cached response with updated timing
        return QueryResponse(
            answer=cached["answer"],
            sources=[SourceInfo(**s) for s in cached["sources"]],
            debug=DebugInfo(
                search_latency_ms=0,
                llm_latency_ms=0,
                total_latency_ms=(cached_time - start_time) * 1000,
                chunks_retrieved=len(cached["sources"]),
                tokens_used=None,
                cache_hit=True,
            ),
        )

    # 1. Get chunks - either full context or semantic search
    from app.vectordb import get_all_chunks
    
    if request.full_context and request.course_id:
        # Full context mode: get ALL chunks for the module
        search_results = get_all_chunks(
            course_id=request.course_id,
            module_id=request.module_id,
        )
        search_time = time.time()
        search_latency_ms = (search_time - start_time) * 1000
    else:
        # Standard RAG: embed query and search
        query_embedding = get_query_embedding(request.query)
        embed_time = time.time()

        search_results = search_chunks(
            query_vector=query_embedding,
            course_id=request.course_id,
            module_id=request.module_id,
            top_k=request.top_k,
            score_threshold=settings.SCORE_THRESHOLD,
        )
        search_time = time.time()
        search_latency_ms = (search_time - embed_time) * 1000

    # 2. Handle no results case
    if not search_results:
        total_time = time.time()
        return QueryResponse(
            answer=NO_CONTEXT_RESPONSE,
            sources=[],
            debug=DebugInfo(
                search_latency_ms=search_latency_ms,
                llm_latency_ms=0,
                total_latency_ms=(total_time - start_time) * 1000,
                chunks_retrieved=0,
            ),
        )

    # 4. Prepare context chunks for prompt
    context_chunks = [
        {
            "text": result["payload"].get("text", ""),
            "source_type": result["payload"].get("source_type", "document"),
            "course_id": result["payload"].get("course_id", ""),
            "module_id": result["payload"].get("module_id", ""),
        }
        for result in search_results
    ]

    # 5. Build RAG prompt
    user_prompt = build_rag_prompt(context_chunks, request.query)

    # 6. Call Azure OpenAI with low temperature for deterministic output
    llm_start = time.time()
    tokens_used = None

    try:
        response = client.chat.completions.create(
            model=settings.AZURE_LLM_DEPLOYMENT,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=settings.LLM_TEMPERATURE,
            max_tokens=settings.LLM_MAX_TOKENS,
        )
        answer = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else None

    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        answer = f"Error generating answer: {str(e)}"

    llm_time = time.time()
    llm_latency_ms = (llm_time - llm_start) * 1000

    # 7. Format sources (skip if include_sources=False)
    sources = []
    if request.include_sources:
        for result in search_results:
            payload = result["payload"]
            source_uri = payload.get("source_uri", "")

            # Add page/time reference to URI if available
            if payload.get("page_number"):
                source_uri += f"#page={payload['page_number']}"
            elif payload.get("start_time_seconds"):
                source_uri += f"#t={payload['start_time_seconds']}"

            sources.append(
                SourceInfo(
                    chunk_id=result["id"],
                    score=result["score"],
                    source_uri=source_uri,
                    source_type=payload.get("source_type", "document"),
                    text_preview=payload.get("text", "")[:200],
                    start_time_seconds=payload.get("start_time_seconds"),
                    end_time_seconds=payload.get("end_time_seconds"),
                )
            )

    total_time = time.time()

    # Cache successful response
    cache_query_result(
        request.query,
        request.course_id,
        request.module_id,
        cache_key_top_k,
        {
            "answer": answer,
            "sources": [s.model_dump() for s in sources],
        }
    )

    return QueryResponse(
        answer=answer,
        sources=sources,
        debug=DebugInfo(
            search_latency_ms=search_latency_ms,
            llm_latency_ms=llm_latency_ms,
            total_latency_ms=(total_time - start_time) * 1000,
            chunks_retrieved=len(search_results),
            tokens_used=tokens_used,
            cache_hit=False,
        ),
    )


# Legacy function for backward compatibility
def ask_question(question: str) -> dict:
    """Legacy query function (deprecated - use query_rag instead)."""
    request = QueryRequest(query=question)
    response = query_rag(request)
    return {"answer": response.answer}
