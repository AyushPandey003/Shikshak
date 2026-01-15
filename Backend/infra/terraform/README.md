# Terraform Azure Infrastructure for Shikshak

This directory contains Terraform configuration to deploy the Shikshak microservices to Azure Container Apps.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and logged in
- [Terraform](https://www.terraform.io/downloads) >= 1.5.0
- Azure subscription with appropriate permissions

## Quick Start

### 1. Login to Azure

```bash
az login
az account set --subscription "Your Subscription Name"
```

### 2. Initialize Terraform

```bash
cd Backend/infra/terraform
terraform init
```

### 3. Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Plan and Apply

```bash
# Preview changes
terraform plan

# Apply changes (will prompt for confirmation)
terraform apply
```

## Resources Created

| Resource | Description |
|----------|-------------|
| Resource Group | Container for all resources |
| Container Registry | Stores Docker images |
| Log Analytics Workspace | Monitoring for Container Apps |
| Container Apps Environment | Shared environment for all apps |
| Container App (Backend) | API Gateway - external facing |
| Container App (Auth) | Authentication service - internal |
| Container App (Courses) | Courses service - internal |
| Container App (Payment) | Payment service - internal |
| Event Hub Namespace | Event-driven messaging |
| Storage Account | EventHub checkpoints |

## Outputs

After `terraform apply`, you'll see:

- `backend_url` - Public API Gateway URL
- `acr_login_server` - ACR URL for pushing images
- `github_secrets` - Values to set in GitHub Actions

## Update GitHub Secrets

After initial deployment, update these GitHub secrets:

```bash
# Get output values
terraform output -json github_secrets

# Update in GitHub:
# Settings → Secrets → Actions → Update secrets
```

## Cost Optimization

- All Container Apps scale to zero when idle
- Using Basic SKU for ACR (cheapest option)
- Standard SKU for Event Hub (required for partitions)
- LRS storage (cheapest replication)

## Destroy Infrastructure

```bash
terraform destroy
```

## File Structure

```
terraform/
├── main.tf                  # Provider configuration
├── variables.tf             # Input variables
├── outputs.tf               # Output values
├── resource-group.tf        # Resource group
├── acr.tf                   # Container Registry
├── container-apps-env.tf    # Container Apps Environment
├── container-apps.tf        # All microservices
├── eventhub.tf              # Event Hub
├── storage.tf               # Storage Account
├── terraform.tfvars.example # Example variables
└── README.md                # This file
```
