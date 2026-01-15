import { createAuthClient } from "better-auth/react"
import { API_CONFIG } from "./api-config"

export const authClient = createAuthClient({
    baseURL: API_CONFIG.baseUrl,
    basePath: "/authentication", // Maps to /api/auth on backend via API Gateway
    fetchOptions: {
        credentials: "include",
    }
})
