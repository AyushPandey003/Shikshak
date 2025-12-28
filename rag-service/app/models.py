"""Pydantic models for API contracts."""

from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field
import uuid


# ============== Ingestion Models ==============


class IngestRequest(BaseModel):
    """Request model for file ingestion."""

    course_id: str = Field(..., description="Course identifier for multi-tenancy")
    module_id: str = Field(..., description="Module identifier within the course")
    source_type: Literal["pdf", "video", "notes", "docx", "txt"] = Field(
        ..., description="Type of source document"
    )
    video_id: Optional[str] = Field(
        None, description="Video identifier if source is video"
    )
    notes_id: Optional[str] = Field(
        None, description="Notes identifier if source is notes"
    )


class IngestResponse(BaseModel):
    """Response model for ingestion endpoint."""

    job_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: Literal["queued", "processing", "completed", "failed"] = "queued"
    message: str = "Ingestion job queued successfully"
    chunks_count: Optional[int] = None


# ============== Query Models ==============


class SourceInfo(BaseModel):
    """Information about a source chunk."""

    chunk_id: str
    score: float
    source_uri: str
    source_type: str
    text_preview: str = Field(..., max_length=200)
    start_time_seconds: Optional[int] = None
    end_time_seconds: Optional[int] = None


class DebugInfo(BaseModel):
    """Debug information for query response."""

    search_latency_ms: float
    llm_latency_ms: float
    total_latency_ms: float
    chunks_retrieved: int
    tokens_used: Optional[int] = None
    cache_hit: bool = False


class QueryRequest(BaseModel):
    """Request model for RAG query."""

    query: str = Field(..., description="User question")
    course_id: Optional[str] = Field(None, description="Filter by course")
    module_id: Optional[str] = Field(None, description="Filter by module")
    top_k: int = Field(5, ge=1, le=100, description="Number of chunks to retrieve")
    full_context: bool = Field(
        False, 
        description="If true, retrieve ALL chunks for the module instead of top-k similar ones"
    )
    include_sources: bool = Field(
        True,
        description="If false, don't return source chunks in response (useful for full_context mode)"
    )


class QueryResponse(BaseModel):
    """Response model for RAG query."""

    answer: str
    sources: List[SourceInfo]
    debug: DebugInfo


# ============== Chunk Models ==============


class ChunkMetadata(BaseModel):
    """Metadata stored with each chunk in vector DB."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    module_id: str
    source_type: str
    source_uri: str
    video_id: Optional[str] = None
    notes_id: Optional[str] = None
    chunk_text: str
    chunk_index: int = 0
    page_number: Optional[int] = None
    start_time_seconds: Optional[int] = None
    end_time_seconds: Optional[int] = None
    content_hash: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Chunk(BaseModel):
    """A text chunk with metadata."""

    text: str
    metadata: ChunkMetadata
    embedding: Optional[List[float]] = None


# ============== Health Check ==============


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "healthy"
    version: str = "1.0.0"
    qdrant_connected: bool = False
    redis_connected: bool = False
