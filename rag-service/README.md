# RAG Microservice

A production-ready, multi-tenant RAG (Retrieval Augmented Generation) microservice that ingests documents/videos, creates metadata-tagged embeddings, and answers course-specific queries with strict context-only responses.

## Features

- **📄 Multi-format Ingestion**: PDF, DOCX, TXT, and video files
- **🏷️ Multi-tenant**: Course/module level isolation with metadata filtering
- **🚫 No Hallucination**: Strict context-only answers with source citations
- **⚡ Fast Search**: Qdrant vector DB with HNSW indexing
- **📊 Observable**: Latency and token usage metrics in responses
- **🔒 Secure**: Non-root containers, managed identity support
- **🔄 CI/CD**: GitHub Actions with linting, testing, and Azure deployment done.

## Quick Start

### 1. Install Dependencies

```bash
# Using uv (recommended)
uv pip install -r requirements.txt

# Or using pip
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials:
# - QDRANT_URL and QDRANT_API_KEY
# - GOOGLE_API_KEY
```

### 3. Run Locally

```bash
uvicorn app.main:app --reload
```

### 4. Access API

- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Ingest Document

```bash
curl -X POST "http://localhost:8000/ingest" \
  -F "course_id=DL101" \
  -F "module_id=M03" \
  -F "source_type=pdf" \
  -F "file=@lecture_notes.pdf"
```

**Response:**
```json
{
  "job_id": "uuid",
  "status": "completed",
  "message": "Successfully ingested lecture_notes.pdf",
  "chunks_count": 42
}
```

### Query

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain attention mechanism",
    "course_id": "DL101",
    "module_id": "M03",
    "top_k": 5
  }'
```

**Response:**
```json
{
  "answer": "According to the course materials [Source 1]...",
  "sources": [
    {
      "chunk_id": "uuid",
      "score": 0.92,
      "source_uri": "blob://DL101/M03/lecture.pdf#page=5",
      "source_type": "pdf",
      "text_preview": "The attention mechanism allows..."
    }
  ],
  "debug": {
    "search_latency_ms": 45,
    "llm_latency_ms": 320,
    "total_latency_ms": 380,
    "chunks_retrieved": 5
  }
}
```

## Project Structure

```
rag-service/
├── app/
│   ├── main.py          # FastAPI application
│   ├── config.py        # Settings management
│   ├── models.py        # Pydantic models
│   ├── ingest.py        # Ingestion pipeline
│   ├── query.py         # RAG query flow
│   ├── embeddings.py    # Embedding generation
│   ├── vectordb.py      # Qdrant client
│   ├── extractors.py    # Document extraction
│   ├── chunking.py      # Text chunking
│   └── prompts.py       # LLM prompts
├── tests/               # Unit & integration tests
├── infra/               # Terraform IaC
├── .github/workflows/   # CI/CD pipeline
├── Dockerfile
├── requirements.txt
└── README.md
```

## Architecture

```
User → FastAPI → Qdrant (Vector Search) → Google Gemini (LLM)
         ↓
    Document Extraction → Chunking → Embeddings → Qdrant Upsert
```

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app
```

## Docker

```bash
# Build
docker build -t rag-service .

# Run
docker run -p 8000:8000 --env-file .env rag-service
```

## Deployment

See `infra/` for Terraform modules to deploy on Azure:
- Azure Container Apps
- Azure Blob Storage
- Azure Key Vault

## License

MIT
