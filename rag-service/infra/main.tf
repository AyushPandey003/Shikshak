# RAG Microservice Infrastructure
# Azure deployment using Terraform

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

# ============== Variables ==============

variable "project_name" {
  description = "Project name for resource naming"
  default     = "ragservice"
}

variable "location" {
  description = "Azure region"
  default     = "eastus"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  default     = "dev"
}

variable "qdrant_url" {
  description = "Qdrant Cloud URL"
  sensitive   = true
}

variable "qdrant_api_key" {
  description = "Qdrant API Key"
  sensitive   = true
}

variable "google_api_key" {
  description = "Google Gemini API Key"
  sensitive   = true
}

locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ============== Resource Group ==============

resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}"
  location = var.location
  tags     = local.tags
}

# ============== Storage Account ==============

resource "azurerm_storage_account" "main" {
  name                     = "${var.project_name}${var.environment}stor"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  blob_properties {
    versioning_enabled = true
  }
  
  tags = local.tags
}

resource "azurerm_storage_container" "documents" {
  name                  = "rag-documents"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}

# ============== Key Vault ==============

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "main" {
  name                       = "kv-${local.resource_prefix}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
  purge_protection_enabled   = false
  
  tags = local.tags
}

resource "azurerm_key_vault_access_policy" "terraform" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id
  
  secret_permissions = [
    "Get", "List", "Set", "Delete", "Purge"
  ]
}

# Secrets
resource "azurerm_key_vault_secret" "qdrant_url" {
  name         = "qdrant-url"
  value        = var.qdrant_url
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault_access_policy.terraform]
}

resource "azurerm_key_vault_secret" "qdrant_api_key" {
  name         = "qdrant-api-key"
  value        = var.qdrant_api_key
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault_access_policy.terraform]
}

resource "azurerm_key_vault_secret" "google_api_key" {
  name         = "google-api-key"
  value        = var.google_api_key
  key_vault_id = azurerm_key_vault.main.id
  depends_on   = [azurerm_key_vault_access_policy.terraform]
}

# ============== Container Registry ==============

resource "azurerm_container_registry" "main" {
  name                = "${var.project_name}${var.environment}acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
  
  tags = local.tags
}

# ============== Log Analytics ==============

resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-${local.resource_prefix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  
  tags = local.tags
}

# ============== Container Apps Environment ==============

resource "azurerm_container_app_environment" "main" {
  name                       = "cae-${local.resource_prefix}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  
  tags = local.tags
}

# ============== Container App ==============

resource "azurerm_container_app" "rag_service" {
  name                         = "ca-${local.resource_prefix}"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"
  
  template {
    container {
      name   = "rag-service"
      image  = "${azurerm_container_registry.main.login_server}/rag-service:latest"
      cpu    = 0.5
      memory = "1Gi"
      
      env {
        name        = "QDRANT_URL"
        secret_name = "qdrant-url"
      }
      
      env {
        name        = "QDRANT_API_KEY"
        secret_name = "qdrant-api-key"
      }
      
      env {
        name        = "GOOGLE_API_KEY"
        secret_name = "google-api-key"
      }
    }
    
    min_replicas = 1
    max_replicas = 3
  }
  
  secret {
    name  = "qdrant-url"
    value = var.qdrant_url
  }
  
  secret {
    name  = "qdrant-api-key"
    value = var.qdrant_api_key
  }
  
  secret {
    name  = "google-api-key"
    value = var.google_api_key
  }
  
  ingress {
    external_enabled = true
    target_port      = 8000
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = local.tags
}

# Grant Container App access to Key Vault
resource "azurerm_key_vault_access_policy" "container_app" {
  key_vault_id = azurerm_key_vault.main.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_container_app.rag_service.identity[0].principal_id
  
  secret_permissions = ["Get", "List"]
}

# ============== Outputs ==============

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "container_app_url" {
  value = "https://${azurerm_container_app.rag_service.ingress[0].fqdn}"
}

output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}

output "key_vault_uri" {
  value = azurerm_key_vault.main.vault_uri
}

output "storage_account_name" {
  value = azurerm_storage_account.main.name
}
