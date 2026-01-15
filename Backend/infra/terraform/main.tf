# =============================================================================
# Terraform Configuration for Shikshak Microservices
# Deploys to Azure Container Apps
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Uncomment for remote state storage (recommended for teams)
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "tfstateshikshak"
  #   container_name       = "tfstate"
  #   key                  = "shikshak.tfstate"
  # }
}

# -----------------------------------------------------------------------------
# Providers
# -----------------------------------------------------------------------------
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
  skip_provider_registration = true
}

# -----------------------------------------------------------------------------
# Random suffix for unique naming
# -----------------------------------------------------------------------------
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# -----------------------------------------------------------------------------
# Local values for consistent naming
# -----------------------------------------------------------------------------
locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  unique_suffix   = random_string.suffix.result

  # Common tags applied to all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedAt   = timestamp()
  }
}
