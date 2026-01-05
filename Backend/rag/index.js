import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ragRoutes from './routes/rag.js';
import './infra/startConsumer.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.config/.env') });

const app = express();
const PORT = process.env.PORT || process.env.PORT_RAG || 4005;

// Middleware
app.use(express.json());

// Routes
app.use('/api/rag', ragRoutes);

// Mock Health Route (since the actual health check is in routes/rag.js, but good to have a root one)

app.listen(PORT, () => {
    console.log(`RAG Service running on port ${PORT}`);
});
