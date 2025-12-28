"""Embedding generation using Azure OpenAI."""

from openai import AzureOpenAI
from typing import List
import logging
import time

from app.config import settings

logger = logging.getLogger(__name__)

# Single Azure OpenAI client for embeddings (same resource as LLM)
client = AzureOpenAI(
    api_key=settings.AZURE_OPENAI_API_KEY,
    api_version=settings.AZURE_OPENAI_API_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
)


def get_embedding(text: str) -> List[float]:
    """Generate embedding for a single text using Azure OpenAI.

    Args:
        text: Text to embed

    Returns:
        Embedding vector (1536 dimensions for ada-002)
    """
    from app.cache import get_cached_embedding, cache_embedding
    
    text = text.replace("\n", " ").strip()
    if not text:
        return [0.0] * settings.VECTOR_DIMENSION

    # Check cache first
    cached = get_cached_embedding(text)
    if cached:
        return cached

    # Generate new embedding
    response = client.embeddings.create(
        input=text,
        model=settings.AZURE_EMBEDDING_DEPLOYMENT,  # Uses embedding deployment
    )
    embedding = response.data[0].embedding
    
    # Cache for future use
    cache_embedding(text, embedding)
    
    return embedding


def get_query_embedding(text: str) -> List[float]:
    """Generate embedding for a query."""
    return get_embedding(text)


def get_document_embedding(text: str) -> List[float]:
    """Generate embedding for a document chunk."""
    return get_embedding(text)


def batch_embed_documents(
    texts: List[str], batch_size: int = 16, delay_seconds: float = 0.1
) -> List[List[float]]:
    """Batch embed multiple documents with rate limiting."""
    embeddings = []
    total = len(texts)

    for i in range(0, total, batch_size):
        batch = texts[i : i + batch_size]
        cleaned_batch = [
            t.replace("\n", " ").strip() if t.strip() else "empty" for t in batch
        ]

        try:
            response = client.embeddings.create(
                input=cleaned_batch, model=settings.AZURE_EMBEDDING_DEPLOYMENT
            )
            batch_embeddings = [item.embedding for item in response.data]
            embeddings.extend(batch_embeddings)
            logger.info(f"Embedded {min(i + batch_size, total)}/{total} chunks")

            if delay_seconds > 0 and i + batch_size < total:
                time.sleep(delay_seconds)

        except Exception as e:
            logger.error(f"Failed to embed batch starting at {i}: {e}")
            for _ in batch:
                embeddings.append([0.0] * settings.VECTOR_DIMENSION)

    return embeddings
