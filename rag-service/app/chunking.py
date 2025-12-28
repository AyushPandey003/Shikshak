"""Token-based text chunking with overlap using tiktoken."""

import hashlib
from typing import List, Optional
import tiktoken

from app.models import Chunk, ChunkMetadata


# Initialize tiktoken encoder for Azure OpenAI models
# cl100k_base is used by gpt-4, gpt-3.5-turbo, text-embedding-ada-002, text-embedding-3-small/large
_encoder = tiktoken.get_encoding("cl100k_base")


def count_tokens(text: str) -> int:
    """Count tokens using tiktoken (production-grade tokenizer).

    Uses cl100k_base encoding compatible with Azure OpenAI models.

    Args:
        text: Text to count tokens for

    Returns:
        Token count
    """
    return len(_encoder.encode(text))


def chunk_text(
    text: str,
    chunk_size_tokens: int = 500,
    overlap_tokens: int = 50,
    source_metadata: Optional[dict] = None,
) -> List[Chunk]:
    """Split text into overlapping chunks with metadata using tiktoken.

    Args:
        text: Full text to chunk
        chunk_size_tokens: Target chunk size in tokens
        overlap_tokens: Overlap between chunks
        source_metadata: Base metadata to attach to each chunk

    Returns:
        List of Chunk objects with metadata

    Raises:
        ValueError: If overlap_tokens >= chunk_size_tokens
    """
    # Validate parameters to prevent infinite loops
    if overlap_tokens >= chunk_size_tokens:
        raise ValueError(
            f"overlap_tokens ({overlap_tokens}) must be less than "
            f"chunk_size_tokens ({chunk_size_tokens})"
        )

    if source_metadata is None:
        source_metadata = {}

    # Clean the text
    text = text.strip()
    if not text:
        return []

    # Tokenize the entire text
    tokens = _encoder.encode(text)
    total_tokens = len(tokens)

    if total_tokens == 0:
        return []

    chunks = []
    start_token = 0
    chunk_index = 0

    # Safety: max iterations to prevent infinite loops
    max_iterations = total_tokens + 100
    iterations = 0

    while start_token < total_tokens:
        iterations += 1
        if iterations > max_iterations:
            raise RuntimeError(
                f"Infinite loop detected in chunk_text after {iterations} iterations"
            )

        # Calculate end position
        end_token = min(start_token + chunk_size_tokens, total_tokens)

        # Extract chunk tokens and decode back to text
        chunk_tokens = tokens[start_token:end_token]
        chunk_text_str = _encoder.decode(chunk_tokens)

        # Try to find a natural break point if not at the end
        if end_token < total_tokens:
            # Look for sentence boundaries in the last 20% of the chunk
            search_start = int(len(chunk_text_str) * 0.8)
            search_region = chunk_text_str[search_start:]

            best_break = None
            for delimiter in ["\n\n", "\n", ". ", "! ", "? "]:
                pos = search_region.rfind(delimiter)
                if pos != -1:
                    best_break = search_start + pos + len(delimiter)
                    break

            if best_break and best_break > len(chunk_text_str) * 0.5:
                chunk_text_str = chunk_text_str[:best_break].strip()
                # Recalculate actual token count for overlap
                actual_tokens = count_tokens(chunk_text_str)
                end_token = start_token + actual_tokens

        chunk_text_str = chunk_text_str.strip()

        if chunk_text_str:
            # Generate content hash for deduplication
            content_hash = hashlib.md5(chunk_text_str.encode()).hexdigest()

            # Create chunk metadata
            metadata = ChunkMetadata(
                course_id=source_metadata.get("course_id", ""),
                module_id=source_metadata.get("module_id", ""),
                source_type=source_metadata.get("source_type", "text"),
                source_uri=source_metadata.get("source_uri", ""),
                video_id=source_metadata.get("video_id"),
                notes_id=source_metadata.get("notes_id"),
                chunk_text=chunk_text_str,
                chunk_index=chunk_index,
                page_number=source_metadata.get("page_number"),
                start_time_seconds=source_metadata.get("start_time_seconds"),
                end_time_seconds=source_metadata.get("end_time_seconds"),
                content_hash=content_hash,
            )

            chunks.append(Chunk(text=chunk_text_str, metadata=metadata))
            chunk_index += 1

        # Calculate next start position

        # If we're at the end, break
        if end_token >= total_tokens:
            break

        # Ensure we always advance by at least 1 token to prevent infinite loops
        next_start = max(end_token - overlap_tokens, start_token + 1)
        start_token = next_start

    return chunks


def chunk_extracted_content(
    extracted_contents: list,
    chunk_size_tokens: int = 500,
    overlap_tokens: int = 50,
    base_metadata: Optional[dict] = None,
) -> List[Chunk]:
    """Chunk multiple extracted content pieces (e.g., from multi-page PDF).

    Args:
        extracted_contents: List of ExtractedContent objects
        chunk_size_tokens: Target chunk size
        overlap_tokens: Overlap between chunks
        base_metadata: Base metadata to include

    Returns:
        List of Chunk objects
    """
    if base_metadata is None:
        base_metadata = {}

    all_chunks = []

    for content in extracted_contents:
        # Merge base metadata with content-specific metadata
        metadata = {**base_metadata}
        if content.page_number:
            metadata["page_number"] = content.page_number
        if content.start_time_seconds is not None:
            metadata["start_time_seconds"] = content.start_time_seconds
        if content.end_time_seconds is not None:
            metadata["end_time_seconds"] = content.end_time_seconds
        if content.metadata:
            metadata.update(content.metadata)

        # Chunk this content
        chunks = chunk_text(
            content.text,
            chunk_size_tokens=chunk_size_tokens,
            overlap_tokens=overlap_tokens,
            source_metadata=metadata,
        )
        all_chunks.extend(chunks)

    # Re-index chunks sequentially
    for i, chunk in enumerate(all_chunks):
        chunk.metadata.chunk_index = i

    return all_chunks
