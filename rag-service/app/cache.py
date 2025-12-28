"""Redis caching utilities for embeddings and query results."""

import hashlib
import json
import logging
from typing import List, Optional, Any

import redis

from app.config import settings

logger = logging.getLogger(__name__)

# Redis client - lazy initialization
_redis_client: Optional[redis.Redis] = None

# Cache TTLs (seconds)
EMBEDDING_TTL = 86400  # 24 hours
QUERY_TTL = 3600  # 1 hour


def get_redis_client() -> Optional[redis.Redis]:
    """Get or create Redis client with connection pooling."""
    global _redis_client
    
    if _redis_client is None:
        try:
            redis_url = settings.REDIS_URL
            
            # Handle Redis Cloud / Upstash URL format
            if redis_url and redis_url.startswith(("redis://", "rediss://")):
                _redis_client = redis.from_url(
                    redis_url,
                    decode_responses=False,
                    socket_timeout=5,
                    socket_connect_timeout=5,
                    retry_on_timeout=True,
                )
            else:
                # Fallback: Use environment variables for explicit config
                import os
                _redis_client = redis.Redis(
                    host=os.getenv("REDIS_HOST", "localhost"),
                    port=int(os.getenv("REDIS_PORT", "6379")),
                    password=os.getenv("REDIS_PASSWORD", None),
                    username=os.getenv("REDIS_USERNAME", "default"),
                    decode_responses=False,
                    socket_timeout=5,
                    socket_connect_timeout=5,
                    retry_on_timeout=True,
                )
            
            # Test connection
            _redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Caching disabled.")
            _redis_client = None
    
    return _redis_client


def check_redis_connection() -> bool:
    """Check if Redis is reachable."""
    try:
        client = get_redis_client()
        if client:
            client.ping()
            return True
    except Exception:
        pass
    return False


def _hash_text(text: str) -> str:
    """Create a hash key from text."""
    return hashlib.sha256(text.encode()).hexdigest()[:32]


def _hash_query(query: str, course_id: Optional[str], module_id: Optional[str], top_k: int) -> str:
    """Create a hash key from query parameters."""
    key_parts = f"{query}|{course_id or ''}|{module_id or ''}|{top_k}"
    return hashlib.sha256(key_parts.encode()).hexdigest()[:32]


# ============== Embedding Cache ==============


def get_cached_embedding(text: str) -> Optional[List[float]]:
    """Get cached embedding for text."""
    client = get_redis_client()
    if not client:
        return None
    
    try:
        key = f"emb:{_hash_text(text)}"
        data = client.get(key)
        if data:
            logger.debug(f"Embedding cache hit: {key[:16]}...")
            return json.loads(data)
    except Exception as e:
        logger.warning(f"Redis get error: {e}")
    
    return None


def cache_embedding(text: str, embedding: List[float]) -> None:
    """Cache an embedding."""
    client = get_redis_client()
    if not client:
        return
    
    try:
        key = f"emb:{_hash_text(text)}"
        client.setex(key, EMBEDDING_TTL, json.dumps(embedding))
        logger.debug(f"Cached embedding: {key[:16]}...")
    except Exception as e:
        logger.warning(f"Redis set error: {e}")


# ============== Query Cache ==============


def get_cached_query(
    query: str, 
    course_id: Optional[str] = None, 
    module_id: Optional[str] = None,
    top_k: int = 5
) -> Optional[dict]:
    """Get cached query result."""
    client = get_redis_client()
    if not client:
        return None
    
    try:
        key = f"qry:{_hash_query(query, course_id, module_id, top_k)}"
        data = client.get(key)
        if data:
            logger.info(f"Query cache hit: {key[:16]}...")
            return json.loads(data)
    except Exception as e:
        logger.warning(f"Redis get error: {e}")
    
    return None


def cache_query_result(
    query: str,
    course_id: Optional[str],
    module_id: Optional[str],
    top_k: int,
    result: dict
) -> None:
    """Cache a query result."""
    client = get_redis_client()
    if not client:
        return
    
    try:
        key = f"qry:{_hash_query(query, course_id, module_id, top_k)}"
        client.setex(key, QUERY_TTL, json.dumps(result))
        logger.info(f"Cached query result: {key[:16]}...")
    except Exception as e:
        logger.warning(f"Redis set error: {e}")
