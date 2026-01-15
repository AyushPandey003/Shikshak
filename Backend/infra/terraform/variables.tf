# =============================================================================
# Input Variables for Shikshak Infrastructure
# =============================================================================

# -----------------------------------------------------------------------------
# General Settings
# -----------------------------------------------------------------------------
variable "project_name" {
  description = "Base name for all resources"
  type        = string
  default     = "shikshak"
}

variable "environment" {
  description = "Deployment environment (production, staging, dev)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging", "dev"], var.environment)
    error_message = "Environment must be one of: production, staging, dev"
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Name of the existing resource group (leave empty to create new)"
  type        = string
  default     = ""
}

variable "existing_container_app_environment_name" {
  description = "Name of an existing Container App Environment to use (avoids quota exceeded error)"
  type        = string
  default     = ""
}

variable "existing_container_app_environment_rg" {
  description = "Resource Group of the existing Container App Environment"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Container Apps Configuration
# -----------------------------------------------------------------------------
variable "container_image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "min_replicas" {
  description = "Minimum number of replicas (0 for scale-to-zero)"
  type        = number
  default     = 0
}

variable "max_replicas" {
  description = "Maximum number of replicas"
  type        = number
  default     = 10
}

# -----------------------------------------------------------------------------
# Service Configuration
# -----------------------------------------------------------------------------
variable "services" {
  description = "Configuration for each microservice"
  type = map(object({
    port         = number
    ingress      = string # "external" or "internal"
    command      = list(string)
    cpu          = number
    memory       = string
    min_replicas = optional(number, 0)
    max_replicas = optional(number, 10)
  }))

  default = {
    backend = {
      port         = 4000
      ingress      = "external"
      command      = ["node", "/app/ApiGateway/index.js"]
      cpu          = 0.5
      memory       = "1Gi"
      min_replicas = 0
      max_replicas = 10
    }
    auth = {
      port         = 3000
      ingress      = "internal"
      command      = ["node", "/app/Auth/dist/server.js"]
      cpu          = 0.5
      memory       = "1Gi"
      min_replicas = 0
      max_replicas = 10
    }
    courses = {
      port         = 4002
      ingress      = "internal"
      command      = ["node", "/app/Courses/index.js"]
      cpu          = 0.5
      memory       = "1Gi"
      min_replicas = 0
      max_replicas = 10
    }
    payment = {
      port         = 4003
      ingress      = "internal"
      command      = ["node", "/app/payment/index.js"]
      cpu          = 0.5
      memory       = "1Gi"
      min_replicas = 0
      max_replicas = 10
    }
  }
}

# -----------------------------------------------------------------------------
# External URLs
# -----------------------------------------------------------------------------
variable "frontend_url" {
  description = "Frontend application URL (for CORS)"
  type        = string
}

variable "api_gateway_url" {
  description = "Public URL of the API Gateway"
  type        = string
  default     = ""
}

variable "rag_service_url" {
  description = "URL of the RAG service"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Database Configuration
# -----------------------------------------------------------------------------
variable "mongo_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "redis_url" {
  description = "Redis connection URL"
  type        = string
  default     = ""
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Authentication Secrets
# -----------------------------------------------------------------------------
variable "better_auth_secret" {
  description = "Better Auth JWT secret"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}

variable "google_refresh_token" {
  description = "Google API refresh token (for Gmail)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "gmail_user_email" {
  description = "Gmail user email for sending emails"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Azure Event Hub Configuration
# -----------------------------------------------------------------------------
variable "eventhub_connection_string" {
  description = "Azure Event Hub connection string"
  type        = string
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Azure Storage Configuration
# -----------------------------------------------------------------------------
variable "azure_storage_connection_string" {
  description = "Azure Storage connection string (for EventHub checkpoints)"
  type        = string
  default     = ""
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Payment Gateway Configuration
# -----------------------------------------------------------------------------
variable "razorpay_key_id" {
  description = "Razorpay API Key ID"
  type        = string
  default     = ""
}

variable "razorpay_key_secret" {
  description = "Razorpay API Key Secret"
  type        = string
  default     = ""
  sensitive   = true
}

# -----------------------------------------------------------------------------
# External Base Infrastructure (Bypassing Lookup Issues)
# -----------------------------------------------------------------------------
variable "acr_login_server" {
  description = "ACR Login Server (Fetch via CLI)"
  type        = string
}

variable "acr_username" {
  description = "ACR Admin Username (Fetch via CLI)"
  type        = string
}

variable "acr_password" {
  description = "ACR Admin Password (Fetch via CLI)"
  type        = string
  sensitive   = true
}

variable "eventhub_namespace_name" {
  description = "EventHub Namespace Name"
  type        = string
}
