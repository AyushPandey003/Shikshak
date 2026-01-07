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

// CORS Middleware - Allow frontend access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/rag', ragRoutes);

app.listen(PORT, () => {
    console.log(`RAG Service running on port ${PORT}`);
}); 
