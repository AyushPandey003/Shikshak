# RAG Service API Documentation

Complete API reference for the RAG (Retrieval-Augmented Generation) Microservice.

**Base URL:** `https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io`  
**Local Development:** `http://localhost:8000`

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Ingest Document](#ingest-document)
  - [Query RAG](#query-rag)
  - [Delete Chunks](#delete-chunks)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)

---

## Authentication

Currently, the API does not require authentication. For production deployments, consider implementing:
- API key authentication
- JWT tokens
- Azure AD integration

---

## Endpoints

### Health Check

Check service health and database connectivity.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "qdrant_connected": true,
  "redis_connected": true
}
```

**Status Values:**
- `healthy` - All services operational
- `degraded` - Some services unavailable (Qdrant/Redis)

**Example:**

```bash
curl https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/health
```

---

### Ingest Document

Upload and process documents into the RAG system. Supports PDF, DOCX, TXT, and video files.

**Endpoint:** `POST /ingest`

**Content-Type:** `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | ✅ Yes | Document file (PDF, DOCX, TXT, MP4) |
| `course_id` | string | ✅ Yes | Course identifier for multi-tenancy |
| `module_id` | string | ✅ Yes | Module identifier within the course |
| `source_type` | string | ✅ Yes | Type: `pdf`, `docx`, `txt`, `video`, `notes` |
| `video_id` | string | ❌ No | Video identifier (required if `source_type=video`) |
| `notes_id` | string | ❌ No | Notes identifier (required if `source_type=notes`) |

#### Response

```json
{
  "job_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "completed",
  "message": "Ingestion job queued successfully",
  "chunks_count": 42,
  "transcript": "Full transcript text here..." 
}
```

**Fields:**
- `job_id` - Unique identifier for the ingestion job
- `status` - Job status: `queued`, `processing`, `completed`, `failed`
- `message` - Human-readable status message
- `chunks_count` - Number of text chunks created (nullable)
- `transcript` - Full transcript for video files (nullable, only for videos)

#### Examples

**PDF Ingestion:**

```bash
curl -X POST "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/ingest" \
  -F "course_id=15" \
  -F "module_id=7" \
  -F "source_type=pdf" \
  -F "file=@lecture_notes.pdf"
```

**Video Ingestion:**

```bash
curl -X POST "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/ingest" \
  -F "course_id=15" \
  -F "module_id=9" \
  -F "source_type=video" \
  -F "video_id=vid_12345" \
  -F "file=@lecture.mp4"
```

**Python Example:**

```python
import requests

with open("document.pdf", "rb") as f:
    response = requests.post(
        "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/ingest",
        files={"file": f},
        data={
            "course_id": "15",
            "module_id": "7",
            "source_type": "pdf"
        }
    )
print(response.json())
```

---

### Query RAG

Query the RAG system with optional filtering by course/module. Returns AI-generated answers based on retrieved context.

**Endpoint:** `POST /query`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "query": "Explain attention mechanism",
  "course_id": "15",
  "module_id": "9",
  "notes_id": "4",
  "top_k": 5,
  "full_context": false,
  "include_sources": true
}
```

**Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | - | User question |
| `course_id` | string | ❌ No | null | Filter by course |
| `module_id` | string | ❌ No | null | Filter by module |
| `notes_id` | string | ❌ No | null | Filter by notes |
| `video_id` | string | ❌ No | null | Filter by video |
| `top_k` | integer | ❌ No | 5 | Number of chunks to retrieve (1-100) |
| `full_context` | boolean | ❌ No | false | If true, retrieve ALL chunks for the module instead of top-k similar ones |
| `include_sources` | boolean | ❌ No | true | If false, don't return source chunks in response |

#### Response

```json
{
  "answer": "Attention mechanism is a technique that allows...",
  "sources": [
    {
      "chunk_id": "abc123",
      "score": 0.89,
      "source_uri": "blob://course15/module9/lecture.pdf",
      "source_type": "pdf",
      "text_preview": "Attention mechanisms compute weighted representations...",
      "start_time_seconds": null,
      "end_time_seconds": null
    }
  ],
  "debug": {
    "search_latency_ms": 45.2,
    "llm_latency_ms": 1230.5,
    "total_latency_ms": 1275.7,
    "chunks_retrieved": 5,
    "tokens_used": 1200,
    "cache_hit": false
  }
}
```

**Response Fields:**
- `answer` - AI-generated answer based on retrieved context
- `sources` - List of source chunks used for generating the answer
  - `chunk_id` - Unique chunk identifier
  - `score` - Relevance score (0.0 - 1.0)
  - `source_uri` - URI of the source document
  - `source_type` - Type of source (`pdf`, `video`, `notes`, etc.)
  - `text_preview` - Preview of chunk text (max 200 chars)
  - `start_time_seconds` - Start timestamp for video chunks
  - `end_time_seconds` - End timestamp for video chunks
- `debug` - Performance metrics
  - `search_latency_ms` - Vector search time
  - `llm_latency_ms` - LLM generation time
  - `total_latency_ms` - Total query time
  - `chunks_retrieved` - Number of chunks retrieved
  - `tokens_used` - LLM tokens consumed (nullable)
  - `cache_hit` - Whether response was served from cache

#### Examples

**Basic Query:**

```bash
curl -X POST "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is machine learning?",
    "course_id": "15",
    "module_id": "7"
  }'
```

**Full Context Query:**

```bash
curl -X POST "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Generate questions on the chapter",
    "course_id": "15",
    "module_id": "9",
    "notes_id": "4",
    "full_context": true,
    "include_sources": true
  }'
```

**Python Example:**

```python
import requests

response = requests.post(
    "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/query",
    json={
        "query": "Generate some questions on the chapter?",
        "course_id": "15",
        "module_id": "9",
        "notes_id": "4",
        "full_context": True,
        "include_sources": True
    }
)

data = response.json()
print(f"Answer: {data['answer']}")
print(f"Sources: {len(data['sources'])} chunks used")
print(f"Latency: {data['debug']['total_latency_ms']}ms")
```

**Query Modes:**

1. **Semantic Search** (`full_context=false`): Retrieves top-k most relevant chunks based on semantic similarity
2. **Full Context** (`full_context=true`): Retrieves all chunks from the specified module/notes for comprehensive context

---

### Delete Chunks

Remove chunks from the vector database by filter. Useful for removing outdated content.

**Endpoint:** `DELETE /delete`

**Content-Type:** `application/json`

#### Request Body

```json
{
  "source_uri": "blob://course15/module9/video.mp4",
  "video_id": "vid_12345",
  "notes_id": "notes_456"
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source_uri` | string | ❌ No* | Blob URI to filter (e.g., `blob://course/module/file.mp4`) |
| `video_id` | string | ❌ No* | Video ID to filter |
| `notes_id` | string | ❌ No* | Notes ID to filter |

**At least one filter must be provided.* All provided filters are combined with AND logic.

#### Response

```json
{
  "status": "success",
  "message": "Successfully deleted 17 chunks",
  "deleted_count": 17
}
```

**Fields:**
- `status` - Operation status: `success` or `failed`
- `message` - Human-readable result message
- `deleted_count` - Number of chunks deleted

#### Examples

**Delete by Video ID:**

```bash
curl -X DELETE "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "vid_12345"
  }'
```

**Delete by Source URI and Video ID:**

```bash
curl -X DELETE "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/delete" \
  -H "Content-Type: application/json" \
  -d '{
    "source_uri": "blob://course15/module9/video.mp4",
    "video_id": "vid_12345"
  }'
```

**Python Example:**

```python
import requests

response = requests.delete(
    "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/delete",
    json={
        "video_id": "vid_12345",
        "notes_id": "notes_456"
    }
)

print(response.json())
```

---

## Data Models

### IngestRequest

```typescript
{
  course_id: string;           // Required
  module_id: string;           // Required
  source_type: "pdf" | "video" | "notes" | "docx" | "txt";  // Required
  video_id?: string;           // Optional
  notes_id?: string;           // Optional
}
```

### IngestResponse

```typescript
{
  job_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  message: string;
  chunks_count?: number;
  transcript?: string;
}
```

### QueryRequest

```typescript
{
  query: string;               // Required
  course_id?: string;
  module_id?: string;
  notes_id?: string;
  video_id?: string;
  top_k?: number;              // 1-100, default: 5
  full_context?: boolean;      // default: false
  include_sources?: boolean;   // default: true
}
```

### QueryResponse

```typescript
{
  answer: string;
  sources: SourceInfo[];
  debug: DebugInfo;
}
```

### SourceInfo

```typescript
{
  chunk_id: string;
  score: number;
  source_uri: string;
  source_type: string;
  text_preview: string;        // Max 200 chars
  start_time_seconds?: number;
  end_time_seconds?: number;
}
```

### DebugInfo

```typescript
{
  search_latency_ms: number;
  llm_latency_ms: number;
  total_latency_ms: number;
  chunks_retrieved: number;
  tokens_used?: number;
  cache_hit: boolean;
}
```

### DeleteRequest

```typescript
{
  source_uri?: string;
  video_id?: string;
  notes_id?: string;
}
```

### DeleteResponse

```typescript
{
  status: "success" | "failed";
  message: string;
  deleted_count: number;
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input parameters |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Errors

**400 - Invalid Source Type:**
```json
{
  "detail": "Invalid source_type. Must be one of: ['pdf', 'docx', 'txt', 'video', 'notes']"
}
```

**400 - Missing Filter:**
```json
{
  "detail": "At least one filter (source_uri, video_id, or notes_id) must be provided"
}
```

**422 - Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "top_k"],
      "msg": "ensure this value is less than or equal to 100",
      "type": "value_error.number.not_le"
    }
  ]
}
```

---

## Rate Limits

Currently, no rate limits are enforced. For production:
- Consider implementing rate limiting based on IP or API key
- Recommended limits: 100 requests/minute for queries, 10 requests/minute for ingestion

---

## Interactive API Documentation

**Swagger UI:** [https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/docs](https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/docs)

**ReDoc:** [https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/redoc](https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io/redoc)

---

## Integration Examples

### Complete Workflow Example

```python
import requests
import json

BASE_URL = "https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io"

# 1. Health check
health = requests.get(f"{BASE_URL}/health")
print(f"Service Status: {health.json()['status']}")

# 2. Ingest a document
with open("lecture.pdf", "rb") as f:
    ingest_response = requests.post(
        f"{BASE_URL}/ingest",
        files={"file": f},
        data={
            "course_id": "CS101",
            "module_id": "module1",
            "source_type": "pdf"
        }
    )
    print(f"Ingested {ingest_response.json()['chunks_count']} chunks")

# 3. Query the system
query_response = requests.post(
    f"{BASE_URL}/query",
    json={
        "query": "What is the main topic?",
        "course_id": "CS101",
        "module_id": "module1",
        "top_k": 5
    }
)
result = query_response.json()
print(f"Answer: {result['answer']}")
print(f"Used {result['debug']['chunks_retrieved']} chunks in {result['debug']['total_latency_ms']}ms")

# 4. Delete chunks (cleanup)
delete_response = requests.delete(
    f"{BASE_URL}/delete",
    json={
        "source_uri": "blob://CS101/module1/lecture.pdf"
    }
)
print(f"Deleted {delete_response.json()['deleted_count']} chunks")
```

---

## Performance Tips

1. **Use Full Context Wisely:** `full_context=true` retrieves all chunks for a module, which can be slow for large documents
2. **Enable Caching:** Redis caching reduces latency for repeated queries
3. **Optimize top_k:** Use smaller `top_k` values (3-5) for faster responses
4. **Batch Operations:** Ingest multiple documents in parallel for better throughput
5. **Filter Early:** Apply course/module/notes filters to reduce search space

---

## Support

For issues or questions:
- Check interactive docs at `/docs`
- Review logs for detailed error messages
- Verify Qdrant and Redis connectivity with `/health`

**Version:** 1.0.0  
**Last Updated:** December 2025
