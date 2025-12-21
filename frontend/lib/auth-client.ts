import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:4000", // Pointing to Backend Port 3000
    fetchOptions: {
        credentials: "include",
    }
})
