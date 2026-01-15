# resource "azurerm_storage_account" "main" {
#   name                     = "${var.project_name}storage${local.unique_suffix}"
#   resource_group_name      = local.resource_group_name
#   location                 = local.resource_group_location
#   account_tier             = "Standard"
#   account_replication_type = "LRS"
#   min_tls_version          = "TLS1_2"
# 
#   tags = local.common_tags
# }
# 
# # Blob container for EventHub checkpoints
# resource "azurerm_storage_container" "eventhub_checkpoints" {
#   name                  = "eventhub-checkpoints"
#   storage_account_name  = "shikshakstoragem1hfot" # was azurerm_storage_account.main.name
#   container_access_type = "private"
# }
# Actually I am disabling the container too because I can't reference the account name easily/consistently if I remove the account resource and I don't want to mix managed/unmanaged.
# I will create it via CLI if needed.

