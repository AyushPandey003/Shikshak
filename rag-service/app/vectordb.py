"""Qdrant vector database client with multi-tenant support."""

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    PayloadSchemaType,
)
from typing import List, Optional
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Initialize Qdrant client with timeout and retry for reliability
client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None,
    timeout=30,  # 30 second timeout
    prefer_grpc=False,  # HTTP is more reliable for cloud
)


def ensure_collection_exists() -> bool:
    """Ensure the collection exists with correct vector configuration.

    Returns:
        True if collection exists/created, False on error
    """
    try:
        collections = client.get_collections().collections
        collection_names = [c.name for c in collections]

        if settings.COLLECTION_NAME not in collection_names:
            client.create_collection(
                collection_name=settings.COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=settings.VECTOR_DIMENSION, distance=Distance.COSINE
                ),
            )
            logger.info(f"Created collection: {settings.COLLECTION_NAME}")

        # Ensure payload indexes exist for filtering
        _ensure_payload_indexes()

        # Verify dimension matches
        collection_info = client.get_collection(settings.COLLECTION_NAME)
        current_size = collection_info.config.params.vectors.size
        if current_size != settings.VECTOR_DIMENSION:
            logger.warning(
                f"Collection dimension mismatch: {current_size} vs {settings.VECTOR_DIMENSION}. "
                "Consider recreating collection."
            )
        return True
    except Exception as e:
        logger.error(f"Failed to ensure collection: {e}")
        return False


def _ensure_payload_indexes():
    """Create payload indexes for filtering if they don't exist."""
    index_fields = ["course_id", "module_id", "source_type"]

    for field in index_fields:
        try:
            client.create_payload_index(
                collection_name=settings.COLLECTION_NAME,
                field_name=field,
                field_schema=PayloadSchemaType.KEYWORD,
            )
            logger.info(f"Created payload index for: {field}")
        except Exception as e:
            # Index might already exist, which is fine
            if "already exists" not in str(e).lower():
                logger.debug(f"Index creation note for {field}: {e}")


def upsert_chunks(chunks: List[dict], batch_size: int = 100) -> int:
    """Upsert chunks with embeddings to Qdrant in batches.

    Args:
        chunks: List of dicts with 'id', 'vector', 'payload'
        batch_size: Number of chunks per batch (default 100 to prevent timeouts)

    Returns:
        Number of chunks upserted
    """
    import time
    
    if not chunks:
        return 0

    points = [
        PointStruct(id=chunk["id"], vector=chunk["vector"], payload=chunk["payload"])
        for chunk in chunks
    ]

    total_upserted = 0
    total_batches = (len(points) + batch_size - 1) // batch_size
    
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        batch_num = (i // batch_size) + 1
        
        try:
            client.upsert(collection_name=settings.COLLECTION_NAME, points=batch)
            total_upserted += len(batch)
            logger.info(f"Upserted batch {batch_num}/{total_batches} ({len(batch)} points)")
            
            # Small delay between batches to prevent overwhelming the connection
            if i + batch_size < len(points):
                time.sleep(0.3)
                
        except Exception as e:
            logger.error(f"Failed to upsert batch {batch_num}: {e}")
            # Retry once after a longer delay
            time.sleep(1)
            try:
                client.upsert(collection_name=settings.COLLECTION_NAME, points=batch)
                total_upserted += len(batch)
                logger.info(f"Retry successful for batch {batch_num}")
            except Exception as retry_e:
                logger.error(f"Retry failed for batch {batch_num}: {retry_e}")
                raise

    return total_upserted


def search_chunks(
    query_vector: List[float],
    course_id: Optional[str] = None,
    module_id: Optional[str] = None,
    top_k: int = 5,
    score_threshold: float = 0.0,
) -> List[dict]:
    """Search for similar chunks with optional metadata filtering.

    Args:
        query_vector: Query embedding
        course_id: Filter by course
        module_id: Filter by module
        top_k: Number of results
        score_threshold: Minimum similarity score

    Returns:
        List of matching chunks with scores
    """
    # Build filter conditions
    filter_conditions = []

    if course_id:
        filter_conditions.append(
            FieldCondition(key="course_id", match=MatchValue(value=course_id))
        )

    if module_id:
        filter_conditions.append(
            FieldCondition(key="module_id", match=MatchValue(value=module_id))
        )

    # Create filter if conditions exist
    query_filter = None
    if filter_conditions:
        query_filter = Filter(must=filter_conditions)

    logger.info(f"Searching Qdrant: collection={settings.COLLECTION_NAME}, top_k={top_k}, threshold={score_threshold}")
    if query_filter:
        logger.info(f"Filter conditions: course_id={course_id}, module_id={module_id}")

    # Execute search using query_points (newer API)
    results = client.query_points(
        collection_name=settings.COLLECTION_NAME,
        query=query_vector,
        query_filter=query_filter,
        limit=top_k,
        score_threshold=score_threshold,
    )

    logger.info(f"Qdrant returned {len(results.points)} results")
    if results.points:
        logger.info(f"Top result score: {results.points[0].score}")

    # Format results
    return [
        {"id": str(hit.id), "score": hit.score, "payload": hit.payload}
        for hit in results.points
    ]


def check_connection() -> bool:
    """Check if Qdrant is reachable.

    Returns:
        True if connected, False otherwise
    """
    try:
        client.get_collections()
        return True
    except Exception:
        return False


def get_all_chunks(
    course_id: str,
    module_id: Optional[str] = None,
    limit: int = 1000,
) -> List[dict]:
    """Get ALL chunks for a course/module (for full-context mode).

    Args:
        course_id: Course identifier
        module_id: Optional module identifier
        limit: Maximum chunks to retrieve

    Returns:
        List of all chunks sorted by chunk_index/start_time
    """
    # Build filter conditions
    filter_conditions = [
        FieldCondition(key="course_id", match=MatchValue(value=course_id))
    ]

    if module_id:
        filter_conditions.append(
            FieldCondition(key="module_id", match=MatchValue(value=module_id))
        )

    query_filter = Filter(must=filter_conditions)

    # Scroll through all matching points
    results, _ = client.scroll(
        collection_name=settings.COLLECTION_NAME,
        scroll_filter=query_filter,
        limit=limit,
        with_payload=True,
        with_vectors=False,
    )

    # Sort by start_time (for videos) or chunk_index
    sorted_results = sorted(
        results,
        key=lambda x: (
            x.payload.get("start_time_seconds", 0) or 0,
            x.payload.get("chunk_index", 0) or 0,
        ),
    )

    logger.info(f"Retrieved {len(sorted_results)} chunks for course={course_id}, module={module_id}")

    return [
        {"id": str(hit.id), "score": 1.0, "payload": hit.payload}
        for hit in sorted_results
    ]
