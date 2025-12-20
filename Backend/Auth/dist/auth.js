"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const mongodb_1 = require("better-auth/adapters/mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, mongodb_1.mongodbAdapter)({
        usePlural: true,
        collectionName: "users", // Map to existing users collection if needed, or better-auth defaults
        // We use the mongoose connection client
        client: mongoose_1.default.connection.getClient(),
    }),
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
