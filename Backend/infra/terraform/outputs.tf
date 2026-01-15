# =============================================================================
# Terraform Outputs
# =============================================================================

# -----------------------------------------------------------------------------
# Resource Group
# -----------------------------------------------------------------------------
output "resource_group_name" {
  description = "Name of the resource group"
  value       = local.resource_group_name
}

# -----------------------------------------------------------------------------
# Container Registry
# -----------------------------------------------------------------------------
output "acr_login_server" {
  description = "ACR login server URL"
  value       = var.acr_login_server
}

output "acr_admin_username" {
  description = "ACR admin username"
  value       = var.acr_username
}

output "acr_admin_password" {
  description = "ACR admin password"
  value       = var.acr_password
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Container Apps
# -----------------------------------------------------------------------------
output "container_apps_environment_name" {
  description = "Container Apps Environment name"
  value       = local.container_app_environment_name
}

output "backend_fqdn" {
  description = "API Gateway public FQDN"
  value       = azurerm_container_app.backend.ingress[0].fqdn
}

output "backend_url" {
  description = "API Gateway public URL"
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

output "auth_fqdn" {
  description = "Auth service internal FQDN"
  value       = azurerm_container_app.auth.ingress[0].fqdn
}

output "courses_fqdn" {
  description = "Courses service internal FQDN"
  value       = azurerm_container_app.courses.ingress[0].fqdn
}

output "payment_fqdn" {
  description = "Payment service internal FQDN"
  value       = azurerm_container_app.payment.ingress[0].fqdn
}

# -----------------------------------------------------------------------------
# Event Hub
# -----------------------------------------------------------------------------
output "eventhub_namespace" {
  description = "Event Hub namespace name"
  value       = var.eventhub_namespace_name
}

output "eventhub_connection_string" {
  description = "Event Hub connection string"
  value       = azurerm_eventhub_namespace_authorization_rule.main.primary_connection_string
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Storage
# -----------------------------------------------------------------------------
# Storage outputs removed to allow destroy

# -----------------------------------------------------------------------------
# GitHub Actions Secrets (convenience output)
# -----------------------------------------------------------------------------
output "github_secrets" {
  description = "Values to set as GitHub Actions secrets"
  value = {
    ACR_LOGIN_SERVER            = var.acr_login_server
    ACR_USERNAME                = var.acr_username
    AZURE_RESOURCE_GROUP        = local.resource_group_name
    CONTAINER_APPS_ENVIRONMENT  = local.container_app_environment_name
    NEXT_PUBLIC_API_GATEWAY_URL = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
  }
}
