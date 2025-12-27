import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dotenv from "dotenv";
import path from "path";

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });


const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017/database");
const db = client.db();

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:4000", "http://localhost:3001", "http://localhost:3000"],
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
    // Map custom fields if better-auth supports it directly, 
    // otherwise we handle them via update-profile endpoint
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
