"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = require("./auth");
const node_1 = require("better-auth/node");
const userController_1 = require("./controllers/userController");
const httpUtils_1 = require("./utils/httpUtils");
dotenv_1.default.config();
// Connect to Database
(0, db_1.default)();
const PORT = process.env.PORT;
const server = http_1.default.createServer(async (req, res) => {
    // Handle CORS for all requests first
    (0, httpUtils_1.setCorsHeaders)(res);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.url?.startsWith('/api/auth')) {
        // Better Auth Handler
        return (0, node_1.toNodeHandler)(auth_1.auth)(req, res);
    }
    else if (req.url === '/api/user/update-profile') {
        // User Profile Update
        return (0, userController_1.handleUpdateProfile)(req, res);
    }
    else {
        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
    // Simple logging duration
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] Request completed in ${duration}ms`);
    });
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
