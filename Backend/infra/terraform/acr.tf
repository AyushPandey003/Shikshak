# =============================================================================
# Azure Container Registry
# =============================================================================

# resource "azurerm_container_registry" "main" {
#   name                = "${var.project_name}acr${local.unique_suffix}"
#   resource_group_name = local.resource_group_name
#   location            = local.resource_group_location
#   sku                 = "Basic"
#   admin_enabled       = true # Required for GitHub Actions deployment
# 
#   tags = local.common_tags
# }

# data "azurerm_container_registry" "main" {
#   name                = "${var.project_name}acr${local.unique_suffix}"
#   resource_group_name = local.resource_group_name
# }
