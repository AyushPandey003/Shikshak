import { createAuthClient } from "better-auth/react"
import { API_CONFIG } from "./api-config"

export const authClient = createAuthClient({
    baseURL: API_CONFIG.baseUrl,
    basePath: "/api/auth", // Must match server's basePath for Better Auth routes
    fetchOptions: {
        credentials: "include",
    }
})
