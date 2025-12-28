"""FastAPI application for RAG microservice."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from app.config import settings
from app.models import (
    IngestRequest,
    IngestResponse,
    QueryRequest,
    QueryResponse,
    HealthResponse,
)
from app.ingest import ingest_document
from app.query import query_rag
from app.vectordb import ensure_collection_exists, check_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    logger.info("Starting RAG Service...")
    ensure_collection_exists()
    logger.info(f"Qdrant collection '{settings.COLLECTION_NAME}' ready")
    yield
    # Shutdown
    logger.info("Shutting down RAG Service...")


app = FastAPI(
    title="RAG Microservice",
    description="Multi-tenant RAG service with course/module filtering",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - configure for your frontend domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============== Health Check ==============


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check service health and Qdrant connectivity."""
    from app.cache import check_redis_connection
    
    qdrant_ok = check_connection()
    redis_ok = check_redis_connection()
    
    status = "healthy"
    if not qdrant_ok:
        status = "degraded"
    elif not redis_ok:
        status = "degraded"  # Redis optional but degrades performance
    
    return HealthResponse(
        status=status,
        version="1.0.0",
        qdrant_connected=qdrant_ok,
        redis_connected=redis_ok,
    )


# ============== UI (Development) ==============


@app.get("/", response_class=HTMLResponse, tags=["UI"])
async def read_root():
    """Serve simple test UI."""
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r") as f:
            return f.read()
    return """
    <html>
        <head><title>RAG Service</title></head>
        <body>
            <h1>RAG Microservice</h1>
            <p>API Docs: <a href="/docs">/docs</a></p>
        </body>
    </html>
    """


# ============== Ingestion API ==============


@app.post("/ingest", response_model=IngestResponse, tags=["Ingestion"])
async def ingest(
    file: UploadFile = File(..., description="File to ingest (PDF, DOCX, TXT, MP4)"),
    course_id: str = Form(..., description="Course identifier"),
    module_id: str = Form(..., description="Module identifier"),
    source_type: str = Form(
        ..., description="Source type: pdf, docx, txt, video, notes"
    ),
    video_id: str = Form(None, description="Video ID (if applicable)"),
    notes_id: str = Form(None, description="Notes ID (if applicable)"),
):
    """
    Ingest a document into the RAG system.
    
    Accepts PDF, DOCX, TXT, or video files. Extracts text, chunks it,
    generates embeddings, and stores in Qdrant with course/module metadata.
    
    **Example Request:**
    ```
    curl -X POST "http://localhost:8000/ingest" \
      -F "course_id=DL101" \
      -F "module_id=M03" \
      -F "source_type=pdf" \
      -F "file=@lecture_notes.pdf"
    ```
    """
    # Validate source type
    valid_types = ["pdf", "docx", "txt", "video", "notes"]
    if source_type.lower() not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source_type. Must be one of: {valid_types}",
        )

    request = IngestRequest(
        course_id=course_id,
        module_id=module_id,
        source_type=source_type.lower(),
        video_id=video_id,
        notes_id=notes_id,
    )

    return await ingest_document(file, request)


# ============== Query API ==============


@app.post("/query", response_model=QueryResponse, tags=["Query"])
async def query(request: QueryRequest):
    """
    Query the RAG system with optional course/module filtering.

    Returns an answer based ONLY on retrieved context (no hallucination),
    along with source citations and debug metrics.

    **Example Request:**
    ```json
    {
      "query": "Explain attention mechanism",
      "course_id": "DL101",
      "module_id": "M03",
      "top_k": 5
    }
    ```

    **Response includes:**
    - `answer`: LLM response based on context
    - `sources`: List of chunks used with scores
    - `debug`: Latency and retrieval metrics
    """
    return query_rag(request)


# ============== Legacy Endpoints (Backward Compatibility) ==============


@app.post("/ingest/simple", tags=["Legacy"])
async def ingest_simple(file: UploadFile = File(...)):
    """Legacy simple ingestion without metadata (deprecated)."""
    request = IngestRequest(course_id="default", module_id="default", source_type="txt")
    return await ingest_document(file, request)


@app.post("/query/simple", tags=["Legacy"])
async def query_simple(question: str):
    """Legacy simple query without filters (deprecated)."""
    request = QueryRequest(query=question)
    return query_rag(request)
