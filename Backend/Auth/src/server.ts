import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { auth } from './auth';
import { toNodeHandler } from "better-auth/node";
import { getUser, handleUpdateProfile } from './controllers/userController';
import { setCorsHeaders } from './utils/httpUtils';
import '../infra/startConsumer.js';

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../.config/.env') });

// Connect to Database
connectDB();

const PORT = process.env.PORT_AUTH || 3000;

const server = http.createServer(async (req, res) => {
    // Handle CORS for all requests first
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.url?.startsWith('/api/auth')) {
        console.log(`[DEBUG] Checking auth route: ${req.url}`);
        // Handle custom auth endpoints first (before Better Auth)
        if (req.url === '/api/auth/get_user') {
            console.log('[DEBUG] Routing to getUser');
            return getUser(req, res);
        }
        if (req.url === '/api/auth/user_detail') {
            console.log('[DEBUG] Routing to handleUpdateProfile');
            return handleUpdateProfile(req, res);
        }
        // Better Auth Handler for all other /api/auth routes
        console.log('[DEBUG] Routing to Better Auth');
        return toNodeHandler(auth)(req, res);
    } else if (req.url === '/user_detail') {
        // User Profile Update (direct access)
        return handleUpdateProfile(req, res);
    } else if (req.url === '/get_user') {
        // Get User (direct access)
        return getUser(req, res);
    }
    else {
        // Serve static files from public folder
        let filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(__dirname, '../public', filePath || '');

        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            const ext = path.extname(fullPath).toLowerCase();
            const mimeTypes: Record<string, string> = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.ico': 'image/x-icon',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(fullPath).pipe(res);
            return;
        }

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
