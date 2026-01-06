# RAG Service API Usage Guide

## Backend/rag Service Integration

This guide shows how to integrate with the RAG service from your frontend application.

---

## Base URL

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:4005/api/rag` |
| Production | Your gateway URL + `/api/rag` |

---

## Endpoints

### 1. Ingest Document (Async)

**POST** `/api/rag/ingest`

Upload a document for processing. Returns immediately with a job ID.

#### Request (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✅ | PDF, DOCX, TXT, or video file |
| `course_id` | string | ✅ | Course identifier |
| `module_id` | string | ✅ | Module identifier |
| `source_type` | string | ✅ | `pdf`, `docx`, `txt`, `video`, or `notes` |
| `video_id` | string | ⚠️ | Required if `source_type` is `video` |
| `notes_id` | string | ⚠️ | Required if `source_type` is `notes` |

#### Response (202 Accepted)

```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "queued",
  "message": "Ingestion job queued for document.pdf",
  "blob_name": "abc123.pdf"
}
```

#### JavaScript Example

```javascript
async function ingestDocument(file, courseId, moduleId, sourceType) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('course_id', courseId);
  formData.append('module_id', moduleId);
  formData.append('source_type', sourceType);

  const response = await fetch('http://localhost:4005/api/rag/ingest', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  console.log('Job ID:', result.job_id);
  return result;
}
```

---

### 2. Check Job Status

**GET** `/api/rag/jobs/:jobId`

Check the status of an ingestion job.

#### Response

```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "message": "Job status tracking requires Redis integration with the hosted service"
}
```

#### JavaScript Example

```javascript
async function checkJobStatus(jobId) {
  const response = await fetch(`http://localhost:4005/api/rag/jobs/${jobId}`);
  return response.json();
}
```

---

### 3. Query RAG

**POST** `/api/rag/query`

Ask a question and get an AI-generated answer based on ingested documents.

#### Request Body (JSON)

```json
{
  "query": "What is machine learning?",
  "course_id": "15",
  "module_id": "7",
  "top_k": 5,
  "full_context": false,
  "include_sources": true
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | ✅ | - | Your question |
| `course_id` | string | ❌ | null | Filter by course |
| `module_id` | string | ❌ | null | Filter by module |
| `notes_id` | string | ❌ | null | Filter by notes |
| `video_id` | string | ❌ | null | Filter by video |
| `top_k` | number | ❌ | 5 | Number of chunks to retrieve |
| `full_context` | boolean | ❌ | false | Get ALL module chunks |
| `include_sources` | boolean | ❌ | true | Include source citations |

#### Response

```json
{
  "answer": "Machine learning is a subset of artificial intelligence...",
  "sources": [
    {
      "chunk_id": "abc123",
      "score": 0.92,
      "source_uri": "blob://course15/module7/lecture.pdf",
      "source_type": "pdf",
      "text_preview": "Machine learning algorithms learn from data..."
    }
  ],
  "debug": {
    "search_latency_ms": 45,
    "llm_latency_ms": 1200,
    "total_latency_ms": 1245,
    "chunks_retrieved": 5
  }
}
```

#### JavaScript Example

```javascript
async function queryRAG(question, courseId, moduleId) {
  const response = await fetch('http://localhost:4005/api/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: question,
      course_id: courseId,
      module_id: moduleId,
      top_k: 5
    })
  });

  return response.json();
}
```

---

### 4. Delete Chunks

**DELETE** `/api/rag/delete`

Remove ingested content by filter.

#### Request Body (JSON)

```json
{
  "video_id": "vid_123",
  "notes_id": "notes_456"
}
```

At least one filter must be provided.

#### Response

```json
{
  "status": "success",
  "message": "Successfully deleted 17 chunks",
  "deleted_count": 17
}
```

---

### 5. Health Check

**GET** `/api/rag/health`

Check service status.

#### Response

```json
{
  "status": "healthy",
  "ragService": { "status": "healthy", "qdrant_connected": true },
  "proxyService": "healthy",
  "queueService": "healthy"
}
```

---

## React Hook Example

```javascript
// hooks/useRAG.js
import { useState } from 'react';

const RAG_BASE_URL = 'http://localhost:4005/api/rag';

export function useRAG() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ingest = async (file, metadata) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('course_id', metadata.course_id);
      formData.append('module_id', metadata.module_id);
      formData.append('source_type', metadata.source_type);
      
      if (metadata.video_id) formData.append('video_id', metadata.video_id);
      if (metadata.notes_id) formData.append('notes_id', metadata.notes_id);

      const response = await fetch(`${RAG_BASE_URL}/ingest`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Ingestion failed');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const query = async (question, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${RAG_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: question,
          ...filters
        })
      });

      if (!response.ok) throw new Error('Query failed');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { ingest, query, loading, error };
}
```

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 202 | Accepted (job queued) |
| 400 | Bad request (missing/invalid parameters) |
| 404 | Not found |
| 500 | Server error |
| 503 | Service unavailable |
