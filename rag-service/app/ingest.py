"""Enhanced ingestion pipeline with document extraction and chunking."""

import logging
import uuid

from fastapi import UploadFile

from app.config import settings
from app.models import IngestRequest, IngestResponse
from app.extractors import BaseExtractor
from app.chunking import chunk_extracted_content
from app.embeddings import batch_embed_documents
from app.vectordb import ensure_collection_exists, upsert_chunks

logger = logging.getLogger(__name__)


async def ingest_document(file: UploadFile, request: IngestRequest) -> IngestResponse:
    """Ingest a document: extract text, chunk, embed, and store in Qdrant.

    Args:
        file: Uploaded file
        request: Ingestion request with metadata

    Returns:
        IngestResponse with job status
    """
    job_id = str(uuid.uuid4())

    try:
        # Ensure collection exists
        ensure_collection_exists()

        # Read file content
        file_content = await file.read()
        filename = file.filename or "unknown"

        logger.info(f"[{job_id}] Processing {filename} ({len(file_content)} bytes)")

        # 1. Extract text based on source type
        extractor = BaseExtractor.get_extractor(request.source_type)
        extracted_contents = extractor.extract(file_content, filename)

        if not extracted_contents:
            return IngestResponse(
                job_id=job_id,
                status="failed",
                message="No content could be extracted from the file",
            )

        logger.info(f"[{job_id}] Extracted {len(extracted_contents)} content blocks")

        # 2. Prepare base metadata
        source_uri = f"blob://{request.course_id}/{request.module_id}/{filename}"
        base_metadata = {
            "course_id": request.course_id,
            "module_id": request.module_id,
            "source_type": request.source_type,
            "source_uri": source_uri,
            "video_id": request.video_id,
            "notes_id": request.notes_id,
        }

        # 3. Chunk the extracted content
        chunks = chunk_extracted_content(
            extracted_contents,
            chunk_size_tokens=settings.CHUNK_SIZE_TOKENS,
            overlap_tokens=settings.CHUNK_OVERLAP_TOKENS,
            base_metadata=base_metadata,
        )

        if not chunks:
            return IngestResponse(
                job_id=job_id,
                status="failed",
                message="No chunks generated from content",
            )

        logger.info(f"[{job_id}] Created {len(chunks)} chunks")

        # 4. Generate embeddings for all chunks
        texts = [chunk.text for chunk in chunks]
        embeddings = batch_embed_documents(texts, delay_seconds=0.5)

        # 5. Prepare points for Qdrant
        points = []
        for chunk, embedding in zip(chunks, embeddings):
            point = {
                "id": chunk.metadata.id,
                "vector": embedding,
                "payload": {
                    "text": chunk.text,
                    "course_id": chunk.metadata.course_id,
                    "module_id": chunk.metadata.module_id,
                    "source_type": chunk.metadata.source_type,
                    "source_uri": chunk.metadata.source_uri,
                    "video_id": chunk.metadata.video_id,
                    "notes_id": chunk.metadata.notes_id,
                    "chunk_index": chunk.metadata.chunk_index,
                    "page_number": chunk.metadata.page_number,
                    "start_time_seconds": chunk.metadata.start_time_seconds,
                    "end_time_seconds": chunk.metadata.end_time_seconds,
                    "content_hash": chunk.metadata.content_hash,
                    "created_at": chunk.metadata.created_at.isoformat(),
                },
            }
            points.append(point)

        # 6. Upsert to Qdrant
        upserted_count = upsert_chunks(points)
        logger.info(f"[{job_id}] Upserted {upserted_count} chunks to Qdrant")

        return IngestResponse(
            job_id=job_id,
            status="completed",
            message=f"Successfully ingested {filename}",
            chunks_count=upserted_count,
        )

    except Exception as e:
        logger.exception(f"[{job_id}] Ingestion failed: {e}")
        return IngestResponse(
            job_id=job_id, status="failed", message=f"Ingestion failed: {str(e)}"
        )


# Legacy function for backward compatibility
def ingest_doc(file: UploadFile) -> dict:
    """Legacy sync ingestion (deprecated - use ingest_document instead)."""
    import asyncio

    # Create minimal request
    request = IngestRequest(course_id="default", module_id="default", source_type="txt")

    # Run async function
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(ingest_document(file, request))

    return {"status": result.status, "chunks": result.chunks_count}
