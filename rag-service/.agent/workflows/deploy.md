# RAG Service Workflows

## Local Development

// turbo-all

### Start Development Server
```powershell
cd c:\Users\ayush\Desktop\rag-service
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Run Tests
```powershell
pytest tests/ -v
```

### Build Docker Image
```powershell
docker build -t rag-service .
docker run -p 8000:8000 --env-file .env rag-service
```

## Azure Deployment

### Deploy with Terraform
```powershell
cd infra
terraform init
terraform plan
terraform apply
```

### Push to ACR
```powershell
$ACR = "ragserviceacr.azurecr.io"
az acr login --name ragserviceacr
docker build -t ${ACR}/rag-service:latest .
docker push ${ACR}/rag-service:latest
```
