# Azure Key Vault Configuration
# For secure secrets management

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

variable "key_vault_name" {
  description = "Name of the Key Vault"
  type        = string
}

variable "tenant_id" {
  description = "Azure AD tenant ID"
  type        = string
}

variable "admin_object_id" {
  description = "Object ID of the admin user/group"
  type        = string
}

# Key Vault
resource "azurerm_key_vault" "rag" {
  name                        = var.key_vault_name
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = var.tenant_id
  sku_name                    = "standard"
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false  # Set to true in production

  # Network access
  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices"
    # Add your IP ranges here
    ip_rules = []
  }

  tags = {
    environment = "production"
    service     = "rag-platform"
  }
}

# Admin Access Policy
resource "azurerm_key_vault_access_policy" "admin" {
  key_vault_id = azurerm_key_vault.rag.id
  tenant_id    = var.tenant_id
  object_id    = var.admin_object_id

  secret_permissions = [
    "Get",
    "List",
    "Set",
    "Delete",
    "Recover",
    "Backup",
    "Restore",
    "Purge",
  ]
}

# Secrets (you'll set actual values separately)
resource "azurerm_key_vault_secret" "openai_api_key" {
  name         = "azure-openai-api-key"
  value        = "placeholder"  # Replace with actual value
  key_vault_id = azurerm_key_vault.rag.id

  depends_on = [azurerm_key_vault_access_policy.admin]
}

resource "azurerm_key_vault_secret" "jwt_secret" {
  name         = "jwt-secret"
  value        = "placeholder"  # Replace with actual value
  key_vault_id = azurerm_key_vault.rag.id

  depends_on = [azurerm_key_vault_access_policy.admin]
}

resource "azurerm_key_vault_secret" "qdrant_api_key" {
  name         = "qdrant-api-key"
  value        = "placeholder"  # Replace with actual value
  key_vault_id = azurerm_key_vault.rag.id

  depends_on = [azurerm_key_vault_access_policy.admin]
}

# Outputs
output "key_vault_uri" {
  value = azurerm_key_vault.rag.vault_uri
}

output "key_vault_name" {
  value = azurerm_key_vault.rag.name
}
