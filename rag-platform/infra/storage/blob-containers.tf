# Azure Blob Storage Configuration
# This Terraform configuration creates storage containers

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus"
}

variable "storage_account_name" {
  description = "Name of the storage account"
  type        = string
}

# Storage Account
resource "azurerm_storage_account" "rag" {
  name                     = var.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"  # Locally redundant (cost-effective)
  
  # Security
  min_tls_version                 = "TLS1_2"
  enable_https_traffic_only       = true
  allow_nested_items_to_be_public = false

  blob_properties {
    # Enable versioning for safety
    versioning_enabled = true
    
    # Soft delete for recovery
    delete_retention_policy {
      days = 7
    }
    
    container_delete_retention_policy {
      days = 7
    }
  }

  tags = {
    environment = "production"
    service     = "rag-platform"
  }
}

# Raw Files Container (uploaded videos, docs, etc.)
resource "azurerm_storage_container" "raw" {
  name                  = "raw-videos"
  storage_account_name  = azurerm_storage_account.rag.name
  container_access_type = "private"
}

# Processed Files Container (audio, frames, etc.)
resource "azurerm_storage_container" "processed" {
  name                  = "processed"
  storage_account_name  = azurerm_storage_account.rag.name
  container_access_type = "private"
}

# Transcripts Container
resource "azurerm_storage_container" "transcripts" {
  name                  = "transcripts"
  storage_account_name  = azurerm_storage_account.rag.name
  container_access_type = "private"
}

# Summaries Container
resource "azurerm_storage_container" "summaries" {
  name                  = "summaries"
  storage_account_name  = azurerm_storage_account.rag.name
  container_access_type = "private"
}

# Embeddings Container (backup of vector data)
resource "azurerm_storage_container" "embeddings" {
  name                  = "embeddings"
  storage_account_name  = azurerm_storage_account.rag.name
  container_access_type = "private"
}

# Lifecycle Management Policy
resource "azurerm_storage_management_policy" "rag" {
  storage_account_id = azurerm_storage_account.rag.id

  rule {
    name    = "move-to-cool-storage"
    enabled = true
    
    filters {
      prefix_match = ["processed/", "transcripts/"]
      blob_types   = ["blockBlob"]
    }
    
    actions {
      base_blob {
        tier_to_cool_after_days_since_modification_greater_than = 30
      }
    }
  }

  rule {
    name    = "archive-old-raw-files"
    enabled = true
    
    filters {
      prefix_match = ["raw-videos/"]
      blob_types   = ["blockBlob"]
    }
    
    actions {
      base_blob {
        tier_to_archive_after_days_since_modification_greater_than = 90
      }
    }
  }
}

# Outputs
output "storage_account_name" {
  value = azurerm_storage_account.rag.name
}

output "storage_connection_string" {
  value     = azurerm_storage_account.rag.primary_connection_string
  sensitive = true
}

output "storage_account_key" {
  value     = azurerm_storage_account.rag.primary_access_key
  sensitive = true
}
