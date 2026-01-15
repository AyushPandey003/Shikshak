import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";
import path from "path";

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });


const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017/database");
const db = client.db();

const trustedOrigins = [
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}`,
    `${process.env.FRONTEND_URL}`,
    "https://mshikshak.vercel.app",
    "http://localhost:3001",
    "http://localhost:3000"
];
console.log("[DEBUG-AUTH] Trusted Origins:", trustedOrigins);

export const auth = betterAuth({
    // baseURL is just the domain - without path suffix
    // This allows basePath to control route mounting
    baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:4000",
    // basePath controls where routes are mounted internally
    // Gateway rewrites /authentication -> /api/auth, so we use /api/auth
    basePath: "/api/auth",
    trustedOrigins: trustedOrigins,
    database: mongodbAdapter(db,
        {
            // Optional: if you don't provide a client, database transactions won't be enabled.
            client
        }),
    experimental: { joins: true },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    // Cookie configuration for Cross-Site usage (Vercel <-> Azure)
    // ALL OAuth-related cookies MUST have SameSite=none and Secure=true
    advanced: {
        // Trust X-Forwarded-* headers from the API Gateway proxy
        trustedProxyHeaders: true,
        // Ensure cookies are secure in production (HTTPS only)
        useSecureCookies: process.env.NODE_ENV === "production",
        cookies: {
            // Session cookie - for authenticated sessions
            session_token: {
                name: "better-auth.session_token",
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                }
            },
            // STATE cookie - CRITICAL for OAuth CSRF protection
            // Must be SameSite=none for cross-domain OAuth callbacks
            state: {
                name: "better-auth.state",
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                }
            },
            // PKCE code verifier cookie - also needs cross-site support
            pkce_code_verifier: {
                name: "better-auth.pkce_code_verifier",
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/"
                }
            }
        }
    },
    // Redirect callback: after successful OAuth, redirect to frontend
    callbacks: {
        redirect: async ({ url, request }: { url: string; request: Request }) => {
            // If callbackURL is provided in the request, use it
            // Otherwise, redirect to the frontend
            const frontendUrl = process.env.FRONTEND_URL || "https://mshikshak.vercel.app";

            // Check if URL is already pointing to frontend
            if (url.startsWith(frontendUrl)) {
                return url;
            }

            // Default: redirect to frontend auth page
            return `${frontendUrl}/auth`;
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user"
            },
            phoneNumber: {
                type: "string",
                required: false
            }
        }
    }
});
