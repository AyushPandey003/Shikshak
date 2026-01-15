# =============================================================================
# Resource Group
# =============================================================================

# Create new resource group if name not provided, otherwise use existing
resource "azurerm_resource_group" "main" {
  count    = var.resource_group_name == "" ? 1 : 0
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}

# Reference to the resource group (new or existing)
data "azurerm_resource_group" "main" {
  count = var.resource_group_name != "" ? 1 : 0
  name  = var.resource_group_name
}

locals {
  resource_group_name     = var.resource_group_name != "" ? data.azurerm_resource_group.main[0].name : azurerm_resource_group.main[0].name
  resource_group_location = var.resource_group_name != "" ? data.azurerm_resource_group.main[0].location : azurerm_resource_group.main[0].location
}
