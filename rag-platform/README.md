# RAG Platform - Industry-Grade Multimodal RAG System

> **Plug-and-Play RAG**: Upload any file (video, PDF, image, audio) → Get summaries, Q&A, and search capabilities.

## 🏗️ Architecture Overview

```
Next.js Frontend
      ↓
API Gateway (Auth + Rate Limit)
      ↓
RAG API (Container Apps)
      ↓
Async Workers (Container Apps)
      ↓
Azure Blob Storage
      ↓
Vector DB (Qdrant)
      ↓
Azure OpenAI / OpenAI
```

## 📁 Project Structure

```
rag-platform/
├── apps/
│   ├── rag-api/           # Public API (query, summary, Q&A)
│   ├── ingestion-worker/  # Async processing (heavy jobs)
│   └── frontend/          # Next.js (consumer)
├── packages/
│   ├── shared/            # Shared types & utilities
│   ├── prompts/           # Versioned prompts
│   └── config/            # Environment schemas
├── infra/
│   ├── container-apps/    # Azure Container Apps YAML
│   ├── service-bus/       # Queue configurations
│   ├── storage/           # Blob container configs
│   └── key-vault/         # Secrets management
├── scripts/               # Development & deployment scripts
└── docker-compose.yml     # Local development
```

## 🔌 Plug-and-Play Design

### Single Upload Endpoint
```
POST /ingest
Content-Type: multipart/form-data
file=<any file>
```

### Supported File Types
- **Video**: MP4, MOV, AVI, MKV, WebM
- **Audio**: MP3, WAV, M4A, FLAC
- **Documents**: PDF, DOCX, PPTX, TXT, MD
- **Images**: PNG, JPG, WEBP, GIF

### Auto-Detection Flow
```
Upload → Auto-Detect → Route to Pipeline → Normalize → Embed → Store
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- pnpm

### Local Development
```bash
# Install dependencies
pnpm install

# Start all services
docker-compose up

# Access services
# RAG API: http://localhost:3001
# Qdrant: http://localhost:6333
```

## 🔥 Key Features

- ✅ **Async Processing** - Video processing never blocks API
- ✅ **Content Router** - Extensible file type handling
- ✅ **Canonical Chunks** - Modality-agnostic RAG
- ✅ **Prompt Versioning** - A/B test and rollback prompts
- ✅ **Azure Native** - Container Apps, Blob Storage, Service Bus
- ✅ **Cost Optimized** - Scale-to-zero, tiered model usage

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ingest` | POST | Upload any file for processing |
| `/status/:job_id` | GET | Check processing status |
| `/summary/:job_id` | GET | Get generated summary |
| `/query` | POST | Ask questions about content |

## 💰 Azure Cost Allocation (₹17,000 Budget)

| Service | Approx Cost |
|---------|-------------|
| Container Apps | ₹2,500 |
| Blob Storage | ₹1,000 |
| Qdrant Disk | ₹1,500 |
| Azure OpenAI | ₹8,000 |
| Service Bus | ₹1,000 |
| Monitoring | ₹1,000 |
| Buffer | ₹2,000 |

## 🔐 Security

- Managed Identity for Blob Storage
- Secrets in Azure Key Vault
- JWT + Rate limiting on API
- Private networking (production)

## 📖 Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Development Guide](./docs/development.md)

## License

MIT
