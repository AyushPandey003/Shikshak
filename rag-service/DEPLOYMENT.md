# Local Testing & Azure Deployment Guide

## Part 1: Local Testing

### Step 1: Prerequisites

1. **Python 3.11+** installed
2. **Azure OpenAI resource** created in Azure Portal
3. **Qdrant Cloud account** (free tier available at https://cloud.qdrant.io)

---

### Step 2: Configure Environment

```powershell
# Navigate to project
cd c:\Users\ayush\Desktop\rag-service

# Copy environment template
copy .env.example .env
```

Edit `.env` with your credentials:

```env
# Qdrant (from Qdrant Cloud dashboard)
QDRANT_URL=https://your-cluster-id.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-api-key

# Azure OpenAI (from Azure Portal > Your OpenAI Resource > Keys and Endpoint)
AZURE_OPENAI_API_KEY=your-azure-openai-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-01

# Deployment names (from Azure Portal > Your OpenAI Resource > Deployments)
AZURE_EMBEDDING_DEPLOYMENT=text-embedding-ada-002
AZURE_LLM_DEPLOYMENT=gpt-4
```

---

### Step 3: Install Dependencies

```powershell
# Create virtual environment (recommended)
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

---

### Step 4: Run Locally

```powershell
# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

---

### Step 5: Test the API

**Health Check:**
```powershell
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"healthy","version":"1.0.0","qdrant_connected":true}
```

**Ingest a Document:**
```powershell
# Create a test file
echo "Machine learning is a subset of AI that enables systems to learn from data." > test.txt

# Ingest it
curl -X POST "http://localhost:8000/ingest" `
  -F "course_id=TEST101" `
  -F "module_id=M01" `
  -F "source_type=txt" `
  -F "file=@test.txt"
```

Expected response:
```json
{
  "job_id": "uuid-here",
  "status": "completed",
  "message": "Successfully ingested test.txt",
  "chunks_count": 1
}
```

**Query:**
```powershell
curl -X POST "http://localhost:8000/query" `
  -H "Content-Type: application/json" `
  -d '{"query": "What is machine learning?", "course_id": "TEST101"}'
```

Expected response:
```json
{
  "answer": "According to the course materials [Source 1], machine learning is a subset of AI...",
  "sources": [...],
  "debug": {"search_latency_ms": 45, "llm_latency_ms": 320, ...}
}
```

**Swagger UI:**
Open http://localhost:8000/docs in your browser for interactive API testing.

---

### Step 6: Run Unit Tests

```powershell
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app
```

---

## Part 2: Deploy to Azure

### Option A: Quick Deploy (GitHub Actions)

#### Step 1: Create Azure Resources

```powershell
# Login to Azure
az login

# Create resource group
az group create --name rg-rag-service --location eastus

# Create Container Registry
az acr create --resource-group rg-rag-service --name registryrag --sku Basic --admin-enabled true

# Get ACR credentials
az acr credential show --name registryrag
```

#### Step 2: Configure GitHub Secrets

Go to your GitHub repo > Settings > Secrets and variables > Actions

Add these secrets:
| Secret Name | Value |
|-------------|-------|
| `ACR_LOGIN_SERVER` | `registryrag.azurecr.io` |
| `ACR_USERNAME` | (from az acr credential show) |
| `ACR_PASSWORD` | (from az acr credential show) |
| `AZURE_CREDENTIALS` | (service principal JSON - see below) |
| `AZURE_RESOURCE_GROUP` | `rg-rag-service` |
| `QDRANT_URL` | Your Qdrant URL |
| `QDRANT_API_KEY` | Your Qdrant API key |
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI key |

**Create Service Principal for AZURE_CREDENTIALS:**
```powershell
az ad sp create-for-rbac --name "github-rag-service" --role contributor `
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-rag-service `
  --sdk-auth
```

Copy the entire JSON output and save as `AZURE_CREDENTIALS` secret.

#### Step 3: Push to GitHub

```powershell
git add .
git commit -m "Add RAG service"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run linting and tests
2. Build Docker image
3. Push to ACR
4. Deploy to Container Apps

---

### Option B: Manual Deploy (Terraform)

#### Step 1: Configure Terraform Variables

```powershell
cd infra
copy terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
project_name   = "ragservice"
location       = "eastus"
environment    = "dev"
qdrant_url     = "https://your-cluster.cloud.qdrant.io:6333"
qdrant_api_key = "your-qdrant-key"
google_api_key = "not-used"  # Keep for compatibility
```

#### Step 2: Deploy Infrastructure

```powershell
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply (type 'yes' when prompted)
terraform apply
```

#### Step 3: Push Docker Image

```powershell
# Get ACR login server from Terraform output
$ACR_SERVER = terraform output -raw acr_login_server

# Login to ACR
az acr login --name $ACR_SERVER

# Build and push image
docker build -t ${ACR_SERVER}/rag-service:latest ..
docker push ${ACR_SERVER}/rag-service:latest
```

#### Step 4: Verify Deployment

```powershell
# Get Container App URL
terraform output container_app_url

# Test the deployed API
curl https://your-container-app-url.azurecontainerapps.io/health
```

---

### Option C: Quick Docker Deploy

If you just want to run in Docker locally or on any VM:

```powershell
# Build image
docker build -t rag-service .

# Run with environment file
docker run -p 8000:8000 --env-file .env rag-service

# Or run with explicit env vars
docker run -p 8000:8000 `
  -e QDRANT_URL="your-url" `
  -e QDRANT_API_KEY="your-key" `
  -e AZURE_OPENAI_API_KEY="your-key" `
  -e AZURE_OPENAI_ENDPOINT="your-endpoint" `
  -e AZURE_EMBEDDING_DEPLOYMENT="text-embedding-ada-002" `
  -e AZURE_LLM_DEPLOYMENT="gpt-4" `
  rag-service
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `Qdrant connection failed` | Check QDRANT_URL and QDRANT_API_KEY in .env |
| `Azure OpenAI 401 error` | Verify AZURE_OPENAI_API_KEY and endpoint |
| `Deployment not found` | Check AZURE_EMBEDDING_DEPLOYMENT matches your Azure deployment name |
| `tiktoken encoding error` | Run `pip install tiktoken --upgrade` |

---

## Azure OpenAI Setup (If Not Done)

1. Go to [Azure Portal](https://portal.azure.com)
2. Create "Azure OpenAI" resource
3. Go to "Model deployments" > "Manage Deployments"
4. Create deployments:
   - `text-embedding-ada-002` (for embeddings)
   - `gpt-4` or `gpt-35-turbo` (for LLM)
5. Copy endpoint and key from "Keys and Endpoint"
