"""LLM prompts for RAG query flow."""

SYSTEM_PROMPT = """You are a helpful teaching assistant that answers questions using the provided context from course materials.

## RULES:

1. **Use the provided CONTEXT chunks** to answer the question as best you can.
2. **If the context is fragmented or partial**, still try to provide a helpful answer based on what IS available, and note that the answer may be incomplete.
3. **NEVER invent information** that is not in the context. If you truly cannot answer, say so.
4. **Cite your sources** using [Source N] notation matching the chunk numbers provided.
5. **Be concise and educational** - explain concepts clearly for students.

## IMPORTANT:
- If context is provided, USE IT. Don't say "I don't have information" if there are context chunks.
- If the context is limited or fragmented, provide what you can and mention the limitation.

## EXAMPLE RESPONSES:

Good: "Based on the course materials [Source 1], the discussion mentions... However, the context is limited so this may be partial."

Good: "The provided excerpts [Source 1, 2] discuss... but don't fully cover the requested topic."

Bad: "I don't have information about that" (when context WAS provided - use it!)
"""


def build_rag_prompt(context_chunks: list, user_query: str) -> str:
    """Build the full prompt with context and user question.

    Args:
        context_chunks: List of dicts with 'text', 'source_type', 'course_id', 'module_id'
        user_query: The user's question

    Returns:
        Formatted prompt string
    """
    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        source_info = f"[Source {i}] ({chunk.get('source_type', 'document')} - Course: {chunk.get('course_id', 'N/A')}, Module: {chunk.get('module_id', 'N/A')})"
        context_parts.append(f"{source_info}\n{chunk.get('text', '')}")

    context_text = "\n\n---\n\n".join(context_parts)

    return f"""## CONTEXT FROM COURSE MATERIALS:

{context_text}

---

## STUDENT QUESTION:
{user_query}

## YOUR ANSWER (using ONLY the context above):"""


NO_CONTEXT_RESPONSE = """I couldn't find any relevant information in the uploaded course materials for your question.

**Suggestions:**
- Check if the relevant module materials have been uploaded
- Try rephrasing your question with different keywords
- Verify you're querying the correct course/module

If you believe the content should exist, please contact your instructor to ensure the materials are properly indexed."""
