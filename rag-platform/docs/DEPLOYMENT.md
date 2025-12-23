# 🚀 Azure Deployment Guide - RAG Platform

> Complete step-by-step manual deployment to Azure Container Apps

---

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Azure account with active subscription (₹17,000 credits)
- [ ] Azure CLI installed ([Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
- [ ] Docker Desktop installed and running
- [ ] Node.js 20+ and pnpm installed locally
- [ ] Git installed

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Cloud                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   RAG API    │    │   Worker     │    │   Qdrant     │       │
│  │ (Container   │◄──►│ (Container   │◄──►│ (Container   │       │
│  │   App)       │    │   App)       │    │   App)       │       │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘       │
│         │                    │                                   │
│         ▼                    ▼                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Azure Blob   │    │ Service Bus  │    │  Key Vault   │       │
│  │   Storage    │    │   Queues     │    │   Secrets    │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Azure OpenAI Service                     │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📍 Step 0: Login to Azure

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account list --output table
az account set --subscription "Your-Subscription-Name"

# Verify you're in the right subscription
az account show
```

---

## 📍 Step 1: Create Resource Group

```bash
# Variables (CUSTOMIZE THESE)
RESOURCE_GROUP="rg-rag-platform"
LOCATION="eastus"  # Use a region close to you

# Create Resource Group
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

# Verify
az group show --name $RESOURCE_GROUP
```

**Expected Output:**
```json
{
  "id": "/subscriptions/.../resourceGroups/rg-rag-platform",
  "location": "eastus",
  "name": "rg-rag-platform",
  ...
}
```

---

## 📍 Step 2: Create Azure Container Registry (ACR)

This stores your Docker images.

```bash
# Variables
ACR_NAME="ragplatformacr"  # Must be globally unique, lowercase, no dashes

# Create ACR (Basic tier is cost-effective)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Get login credentials (save these!)
az acr credential show --name $ACR_NAME

# Login to ACR
az acr login --name $ACR_NAME
```

**Save these credentials:**
- Registry URL: `ragplatformacr.azurecr.io`
- Username: (from the credential show command)
- Password: (from the credential show command)

---

## 📍 Step 3: Create Azure Blob Storage

```bash
# Variables
STORAGE_ACCOUNT="ragplatformstorage"  # Must be globally unique, lowercase

# Create Storage Account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2

# Get connection string (SAVE THIS!)
az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --output tsv
```

**Create containers:**

```bash
# Get storage key
STORAGE_KEY=$(az storage account keys list \
  --account-name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query '[0].value' -o tsv)

# Create containers
az storage container create --name raw-videos --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY
az storage container create --name processed --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY
az storage container create --name transcripts --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY
az storage container create --name summaries --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY
az storage container create --name embeddings --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY

# Verify
az storage container list --account-name $STORAGE_ACCOUNT --account-key $STORAGE_KEY --output table
```

---

## 📍 Step 4: Create Azure Service Bus

```bash
# Variables
SERVICEBUS_NAMESPACE="ragplatform-servicebus"  # Must be globally unique

# Create Service Bus Namespace (Standard tier for queues)
az servicebus namespace create \
  --resource-group $RESOURCE_GROUP \
  --name $SERVICEBUS_NAMESPACE \
  --location $LOCATION \
  --sku Standard

# Create Queues
az servicebus queue create --resource-group $RESOURCE_GROUP --namespace-name $SERVICEBUS_NAMESPACE --name video-jobs
az servicebus queue create --resource-group $RESOURCE_GROUP --namespace-name $SERVICEBUS_NAMESPACE --name audio-jobs
az servicebus queue create --resource-group $RESOURCE_GROUP --namespace-name $SERVICEBUS_NAMESPACE --name document-jobs
az servicebus queue create --resource-group $RESOURCE_GROUP --namespace-name $SERVICEBUS_NAMESPACE --name image-jobs

# Get connection string (SAVE THIS!)
az servicebus namespace authorization-rule keys list \
  --resource-group $RESOURCE_GROUP \
  --namespace-name $SERVICEBUS_NAMESPACE \
  --name RootManageSharedAccessKey \
  --query primaryConnectionString \
  --output tsv
```

---

## 📍 Step 5: Create Azure OpenAI Service

```bash
# Check if Azure OpenAI is available in your subscription
az cognitiveservices account list-kinds | grep OpenAI

# Create Azure OpenAI resource
az cognitiveservices account create \
  --name "ragplatform-openai" \
  --resource-group $RESOURCE_GROUP \
  --kind OpenAI \
  --sku S0 \
  --location "eastus" \
  --custom-domain "ragplatform-openai"

# Get the endpoint and key (SAVE THESE!)
az cognitiveservices account show \
  --name "ragplatform-openai" \
  --resource-group $RESOURCE_GROUP \
  --query "properties.endpoint" -o tsv

az cognitiveservices account keys list \
  --name "ragplatform-openai" \
  --resource-group $RESOURCE_GROUP \
  --query "key1" -o tsv
```

### Deploy Models in Azure OpenAI Studio

1. Go to [Azure OpenAI Studio](https://oai.azure.com/)
2. Select your resource: `ragplatform-openai`
3. Go to **Deployments** → **Create new deployment**
4. Deploy these models:

| Model | Deployment Name | Use For |
|-------|-----------------|---------|
| gpt-4 | `gpt-4` | Summaries, Q&A |
| text-embedding-ada-002 | `text-embedding-ada-002` | Embeddings |

**Save:** 
- Endpoint: `https://ragplatform-openai.openai.azure.com/`
- API Key: (from the keys list command)
- Deployment names: `gpt-4`, `text-embedding-ada-002`

---

## 📍 Step 6: Create Container Apps Environment

```bash
# Variables
ENVIRONMENT_NAME="ragplatform-env"

# Create Container Apps Environment
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Verify
az containerapp env show \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP
```

---

## 📍 Step 7: Build and Push Docker Images

### 7.1 Build RAG API Image

```bash
# Navigate to project root
cd rag-platform

# Build the RAG API image
docker build \
  -t $ACR_NAME.azurecr.io/rag-api:v1 \
  -f apps/rag-api/Dockerfile \
  .

# Push to ACR
docker push $ACR_NAME.azurecr.io/rag-api:v1

# Verify in ACR
az acr repository list --name $ACR_NAME --output table
```

### 7.2 Build Ingestion Worker Image

```bash
# Build the Worker image
docker build \
  -t $ACR_NAME.azurecr.io/ingestion-worker:v1 \
  -f apps/ingestion-worker/Dockerfile \
  .

# Push to ACR
docker push $ACR_NAME.azurecr.io/ingestion-worker:v1
```

---

## 📍 Step 8: Deploy Qdrant (Vector Database)

```bash
# Deploy Qdrant
az containerapp create \
  --name qdrant \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image qdrant/qdrant:latest \
  --target-port 6333 \
  --ingress internal \
  --min-replicas 1 \
  --max-replicas 1 \
  --cpu 0.5 \
  --memory 2Gi

# Get the internal URL (SAVE THIS!)
az containerapp show \
  --name qdrant \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" -o tsv
```

**Qdrant Internal URL:** `https://qdrant.internal.<environment-id>.eastus.azurecontainerapps.io`

---

## 📍 Step 9: Deploy RAG API

```bash
# Get ACR credentials
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

# Get Qdrant URL
QDRANT_URL="https://qdrant.internal.$(az containerapp env show --name $ENVIRONMENT_NAME --resource-group $RESOURCE_GROUP --query 'properties.defaultDomain' -o tsv)"

# Deploy RAG API
az containerapp create \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_NAME.azurecr.io/rag-api:v1 \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 3001 \
  --ingress external \
  --min-replicas 0 \
  --max-replicas 10 \
  --cpu 0.5 \
  --memory 1Gi \
  --env-vars \
    NODE_ENV=production \
    PORT=3001 \
    QDRANT_URL=$QDRANT_URL \
    AZURE_OPENAI_ENDPOINT="https://ragplatform-openai.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="YOUR_OPENAI_KEY" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT="text-embedding-ada-002" \
    AZURE_STORAGE_CONNECTION_STRING="YOUR_STORAGE_CONNECTION_STRING"

# Get the public URL
az containerapp show \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" -o tsv
```

**🎉 Your API is now live at:** `https://rag-api.<id>.eastus.azurecontainerapps.io`

---

## 📍 Step 10: Deploy Ingestion Worker

```bash
# Deploy Ingestion Worker
az containerapp create \
  --name ingestion-worker \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_NAME.azurecr.io/ingestion-worker:v1 \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --min-replicas 0 \
  --max-replicas 5 \
  --cpu 1.0 \
  --memory 2Gi \
  --env-vars \
    NODE_ENV=production \
    QDRANT_URL=$QDRANT_URL \
    AZURE_OPENAI_ENDPOINT="https://ragplatform-openai.openai.azure.com/" \
    AZURE_OPENAI_API_KEY="YOUR_OPENAI_KEY" \
    AZURE_STORAGE_CONNECTION_STRING="YOUR_STORAGE_CONNECTION_STRING" \
    AZURE_SERVICE_BUS_CONNECTION_STRING="YOUR_SERVICEBUS_CONNECTION_STRING"
```

---

## 📍 Step 11: Test Your Deployment

### Health Check

```bash
# Get API URL
API_URL=$(az containerapp show --name rag-api --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)

# Test health endpoint
curl https://$API_URL/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-22T...",
  "version": "1.0.0"
}
```

### Test File Upload

```bash
# Upload a test file
curl -X POST https://$API_URL/ingest \
  -F "file=@test.pdf" \
  -H "Content-Type: multipart/form-data"
```

**Expected Response:**
```json
{
  "success": true,
  "jobId": "abc123...",
  "status": "queued",
  "statusUrl": "/status/abc123..."
}
```

---

## 📍 Step 12: Configure Custom Domain (Optional)

```bash
# Add custom domain
az containerapp hostname add \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --hostname api.yourdomain.com

# Configure certificate
az containerapp ssl upload \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --hostname api.yourdomain.com \
  --certificate-file your-cert.pfx \
  --certificate-password "your-password"
```

---

## 💰 Cost Monitoring

### Check Current Spending

```bash
# View cost analysis
az consumption usage list \
  --start-date 2024-12-01 \
  --end-date 2024-12-31 \
  --query "[?contains(instanceName, 'ragplatform')].{Name:instanceName, Cost:pretaxCost}" \
  --output table
```

### Set Budget Alert

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Cost Management + Billing"
3. Click **Budgets** → **Add**
4. Set amount: ₹15,000 (leave buffer)
5. Add alert at 80% and 100%

---

## 🔄 Update Deployments

When you update code:

```bash
# Build new version
docker build -t $ACR_NAME.azurecr.io/rag-api:v2 -f apps/rag-api/Dockerfile .
docker push $ACR_NAME.azurecr.io/rag-api:v2

# Update container app
az containerapp update \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/rag-api:v2
```

---

## 🛑 Cleanup (When Done Testing)

To avoid charges:

```bash
# Delete entire resource group (DELETES EVERYTHING!)
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

---

## 📝 Quick Reference - All Variables

Save these values in a secure location:

```
# Resource Names
RESOURCE_GROUP=rg-rag-platform
LOCATION=eastus
ACR_NAME=ragplatformacr
STORAGE_ACCOUNT=ragplatformstorage
SERVICEBUS_NAMESPACE=ragplatform-servicebus
ENVIRONMENT_NAME=ragplatform-env

# Connection Strings (KEEP SECRET!)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_SERVICE_BUS_CONNECTION_STRING=Endpoint=sb://...

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://ragplatform-openai.openai.azure.com/
AZURE_OPENAI_API_KEY=...

# URLs
RAG_API_URL=https://rag-api.<id>.eastus.azurecontainerapps.io
QDRANT_INTERNAL_URL=https://qdrant.internal.<id>.eastus.azurecontainerapps.io
```

---

## ✅ Deployment Checklist

- [ ] Resource Group created
- [ ] Container Registry created
- [ ] Storage Account with containers created
- [ ] Service Bus with queues created
- [ ] Azure OpenAI with models deployed
- [ ] Container Apps Environment created
- [ ] Docker images built and pushed
- [ ] Qdrant deployed
- [ ] RAG API deployed
- [ ] Ingestion Worker deployed
- [ ] Health check passing
- [ ] Budget alert configured

---

## 🆘 Troubleshooting

### Container won't start

```bash
# Check logs
az containerapp logs show \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --follow
```

### Connection errors

```bash
# Verify environment variables
az containerapp show \
  --name rag-api \
  --resource-group $RESOURCE_GROUP \
  --query "properties.template.containers[0].env"
```

### ACR authentication issues

```bash
# Re-authenticate
az acr login --name $ACR_NAME

# Check if admin is enabled
az acr update --name $ACR_NAME --admin-enabled true
```

---

**🎉 Congratulations! Your RAG platform is now deployed on Azure!**
