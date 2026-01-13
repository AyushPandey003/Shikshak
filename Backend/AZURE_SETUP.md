# Azure Backend Deployment Setup Guide

This guide explains how to set up Azure resources and GitHub Actions for deploying the Shikshak backend services.

## Prerequisites

- Azure subscription
- GitHub repository with Actions enabled
- Azure CLI installed locally
- Aiven Kafka cluster (already configured)

## Azure Resources Required

### 1. Resource Group
```bash
az group create --name shikshak-backend-rg --location eastus
```

### 2. Azure Container Registry (ACR)
```bash
az acr create --resource-group shikshak-backend-rg --name shikshakacr --sku Basic
```

### 3. Azure Container Apps Environment
```bash
az containerapp env create \
  --name shikshak-env \
  --resource-group shikshak-backend-rg \
  --location eastus
```

### 4. Container Apps (one per service)
```bash
# Create each container app
for service in apigateway auth courses payment rag; do
  az containerapp create \
    --name $service \
    --resource-group shikshak-backend-rg \
    --environment shikshak-env \
    --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
    --target-port 3000 \
    --ingress 'external'
done
```

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `ACR_LOGIN_SERVER` | ACR login URL | `az acr show --name shikshakacr --query loginServer` |
| `ACR_USERNAME` | ACR admin username | `az acr credential show --name shikshakacr --query username` |
| `ACR_PASSWORD` | ACR admin password | `az acr credential show --name shikshakacr --query passwords[0].value` |
| `AZURE_CREDENTIALS` | Service principal JSON | See below |
| `AZURE_RESOURCE_GROUP` | Resource group name | `shikshak-backend-rg` |
| `KAFKA_BROKERS` | Aiven broker URL | From Aiven console |
| `KAFKA_SSL_CA` | CA certificate (base64) | `[Convert]::ToBase64String([IO.File]::ReadAllBytes("ca.pem"))` |
| `KAFKA_SSL_CERT` | Access cert (base64) | `[Convert]::ToBase64String([IO.File]::ReadAllBytes("service.cert"))` |
| `KAFKA_SSL_KEY` | Access key (base64) | `[Convert]::ToBase64String([IO.File]::ReadAllBytes("service.key"))` |

### Creating AZURE_CREDENTIALS

```bash
az ad sp create-for-rbac \
  --name "github-actions-shikshak" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/shikshak-backend-rg \
  --sdk-auth
```

Copy the entire JSON output as the `AZURE_CREDENTIALS` secret.

## Workflow Usage

### Automatic Deployment
Push to `main` branch with changes in `Backend/` directory triggers deployment of changed services only.

### Manual Deployment
1. Go to Actions → Deploy Backend Services
2. Click "Run workflow"
3. Enter services: `all` or comma-separated list like `auth,rag`

## Service Ports

| Service | Internal Port | Environment Variable |
|---------|---------------|---------------------|
| ApiGateway | 4000 | `PORT_GATEWAY` |
| Auth | 3000 | `PORT` |
| Courses | 4002 | `PORT_COURSES` |
| Payment | 4003 | `PORT` |
| RAG | 3000 | `PORT` |

## Autoscaling Configuration

The deployment uses KEDA-based HTTP autoscaling for pay-per-use billing:

| Service | CPU | Memory | Min Replicas | Max Replicas | Scale Trigger |
|---------|-----|--------|--------------|--------------|---------------|
| Backend (Unified) | 0.5 | 1Gi | 0 | 10 | 30 concurrent requests |
| RAG | 0.5 | 1Gi | 0 | 5 | 10 concurrent requests |

**Cost Optimization:**
- Scale-to-zero when idle (no traffic = no cost)
- Scales up automatically during traffic spikes
- Right-sized resources for actual workload

## Container App Environment Variables

Set environment variables for each container app:

```bash
az containerapp update \
  --name auth \
  --resource-group shikshak-backend-rg \
  --set-env-vars \
    "MONGO_URI=secretref:mongo-uri" \
    "KAFKA_BROKERS=secretref:kafka-brokers" \
    "KAFKA_SSL_CA=secretref:kafka-ssl-ca" \
    "KAFKA_SSL_CERT=secretref:kafka-ssl-cert" \
    "KAFKA_SSL_KEY=secretref:kafka-ssl-key"
```

## Troubleshooting

### Check Container App Logs
```bash
az containerapp logs show --name auth --resource-group shikshak-backend-rg
```

### Check Deployment Status
```bash
az containerapp revision list --name auth --resource-group shikshak-backend-rg
```
