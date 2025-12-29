import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../.config/.env') });

import express from 'express';
import cors from 'cors';
import ragRoutes from './routes/rag.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

// Parse JSON bodies for query endpoints
app.use(express.json());

// Root health check
app.get('/', (req, res) => {
    res.json({
        message: 'RAG Microservice Proxy is running 🚀',
        endpoints: {
            health: 'GET /api/rag/health',
            ingest: 'POST /api/rag/ingest',
            query: 'POST /api/rag/query',
            sources: 'POST /api/rag/sources'
        }
    });
});

// RAG routes
app.use('/api/rag', ragRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[RAG] Error:', err.message);

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large. Maximum size is 500MB.' });
        }
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

const PORT = process.env.PORT_RAG || 4005;
app.listen(PORT, () => {
    console.log(`RAG Microservice running on port ${PORT}`);
    console.log(`Proxying to: ${process.env.RAG_SERVICE_URL || 'RAG_SERVICE_URL not set!'}`);
});
