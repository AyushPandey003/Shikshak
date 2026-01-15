# =============================================================================
# Container Apps Environment
# =============================================================================

# -----------------------------------------------------------------------------
# Option 1: Create New Environment (if no existing name provided)
# -----------------------------------------------------------------------------

# Log Analytics Workspace (only created if we are creating a new env)
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.existing_container_app_environment_name == "" ? 1 : 0
  name                = "${local.resource_prefix}-logs-${local.unique_suffix}"
  resource_group_name = local.resource_group_name
  location            = local.resource_group_location
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.common_tags
}

# Container Apps Environment (New)
resource "azurerm_container_app_environment" "main" {
  count                      = var.existing_container_app_environment_name == "" ? 1 : 0
  name                       = "${local.resource_prefix}-env"
  resource_group_name        = local.resource_group_name
  location                   = local.resource_group_location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main[0].id

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Option 2: Use Existing Environment
# -----------------------------------------------------------------------------
data "azurerm_container_app_environment" "existing" {
  count               = var.existing_container_app_environment_name != "" ? 1 : 0
  name                = var.existing_container_app_environment_name
  resource_group_name = var.existing_container_app_environment_rg
}

# -----------------------------------------------------------------------------
# Local helper to pick the right ID
# -----------------------------------------------------------------------------
locals {
  container_app_environment_id = var.existing_container_app_environment_name != "" ? data.azurerm_container_app_environment.existing[0].id : azurerm_container_app_environment.main[0].id

  # If using existing environment, use its location, otherwise use resource group location
  container_apps_location = var.existing_container_app_environment_name != "" ? data.azurerm_container_app_environment.existing[0].location : local.resource_group_location

  container_app_environment_name = var.existing_container_app_environment_name != "" ? data.azurerm_container_app_environment.existing[0].name : azurerm_container_app_environment.main[0].name
}
