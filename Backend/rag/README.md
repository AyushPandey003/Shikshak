# RAG Microservice

A lightweight proxy microservice that connects the Shikshak frontend to the hosted RAG (Retrieval Augmented Generation) service.

## Overview

This service acts as a gateway between the frontend application and the deployed RAG service at:
```
https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io
```

## Endpoints

### Health Check
```
GET /api/rag/health
```
Check the health status of both the proxy and the RAG service.

### Ingest Document
```
POST /api/rag/ingest
Content-Type: multipart/form-data
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | PDF, DOCX, TXT, or video file |
| `course_id` | String | ✅ | Course identifier |
| `module_id` | String | ✅ | Module identifier |
| `source_type` | String | ✅ | `pdf`, `docx`, `txt`, `video`, or `notes` |
| `video_id` | String | ❌ | Required if source_type is `video` |
| `notes_id` | String | ❌ | Required if source_type is `notes` |

### Query RAG
```
POST /api/rag/query
Content-Type: application/json
```

**Body:**
```json
{
  "query": "Your question here",
  "course_id": "optional_course_id",
  "module_id": "optional_module_id",
  "top_k": 5,
  "full_context": false,
  "include_sources": true
}
```

### Get Sources Only
```
POST /api/rag/sources
Content-Type: application/json
```
Same body as `/query`, returns only source chunks without generating an answer.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. The service uses the centralized `.config/.env` file. Ensure these variables are set:
```env
PORT_RAG=4005
RAG_SERVICE_URL=https://rag-service.whitetree-88f47ee0.eastus2.azurecontainerapps.io
```

3. Run the service:
```bash
pnpm dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT_RAG` | 4005 | Port to run the service on |
| `RAG_SERVICE_URL` | (hosted URL) | URL of the RAG service |
| `FRONTEND_URL` | http://localhost:3001 | Allowed CORS origin |

## Usage from Frontend

### JavaScript/TypeScript Example

```javascript
// Ingest a document
const formData = new FormData();
formData.append('file', file);
formData.append('course_id', courseId);
formData.append('module_id', moduleId);
formData.append('source_type', 'pdf');
formData.append('notes_id', notesId);

const ingestResponse = await fetch('http://localhost:4005/api/rag/ingest', {
  method: 'POST',
  body: formData
});

// Query the RAG system
const queryResponse = await fetch('http://localhost:4005/api/rag/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Explain the concept of attention mechanisms',
    course_id: courseId,
    module_id: moduleId,
    top_k: 5
  })
});

const result = await queryResponse.json();
console.log(result.answer);
console.log(result.sources);
```
