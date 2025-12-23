# Azure Service Bus Queue Configuration
# This Terraform configuration creates the necessary queues

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

variable "servicebus_namespace_name" {
  description = "Name of the Service Bus namespace"
  type        = string
}

# Service Bus Namespace
resource "azurerm_servicebus_namespace" "rag" {
  name                = var.servicebus_namespace_name
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"  # Required for queues

  tags = {
    environment = "production"
    service     = "rag-platform"
  }
}

# Video Jobs Queue
resource "azurerm_servicebus_queue" "video_jobs" {
  name         = "video-jobs"
  namespace_id = azurerm_servicebus_namespace.rag.id

  # Configuration for reliable processing
  max_delivery_count                   = 3
  lock_duration                        = "PT5M"  # 5 minutes
  default_message_ttl                  = "P1D"   # 1 day
  dead_lettering_on_message_expiration = true
  enable_partitioning                  = true
  max_size_in_megabytes               = 5120
}

# Document Jobs Queue
resource "azurerm_servicebus_queue" "document_jobs" {
  name         = "document-jobs"
  namespace_id = azurerm_servicebus_namespace.rag.id

  max_delivery_count                   = 3
  lock_duration                        = "PT2M"  # 2 minutes
  default_message_ttl                  = "P1D"
  dead_lettering_on_message_expiration = true
  enable_partitioning                  = true
  max_size_in_megabytes               = 1024
}

# Audio Jobs Queue
resource "azurerm_servicebus_queue" "audio_jobs" {
  name         = "audio-jobs"
  namespace_id = azurerm_servicebus_namespace.rag.id

  max_delivery_count                   = 3
  lock_duration                        = "PT3M"  # 3 minutes
  default_message_ttl                  = "P1D"
  dead_lettering_on_message_expiration = true
  enable_partitioning                  = true
  max_size_in_megabytes               = 2048
}

# Image Jobs Queue
resource "azurerm_servicebus_queue" "image_jobs" {
  name         = "image-jobs"
  namespace_id = azurerm_servicebus_namespace.rag.id

  max_delivery_count                   = 3
  lock_duration                        = "PT1M"  # 1 minute
  default_message_ttl                  = "P1D"
  dead_lettering_on_message_expiration = true
  max_size_in_megabytes               = 256
}

# Dead Letter Queue Monitor (for alerting)
resource "azurerm_servicebus_queue" "dead_letter_monitor" {
  name         = "dead-letter-monitor"
  namespace_id = azurerm_servicebus_namespace.rag.id

  max_delivery_count    = 1
  lock_duration         = "PT30S"
  default_message_ttl   = "P7D"  # Keep for 7 days
  max_size_in_megabytes = 256
}

# Outputs
output "servicebus_connection_string" {
  value     = azurerm_servicebus_namespace.rag.default_primary_connection_string
  sensitive = true
}

output "servicebus_namespace_name" {
  value = azurerm_servicebus_namespace.rag.name
}
