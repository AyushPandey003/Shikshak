import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { ingestRouter } from './routes/ingest.js';
import { statusRouter } from './routes/status.js';
import { summaryRouter } from './routes/summary.js';
import { queryRouter } from './routes/query.js';
import { errorHandler } from './middlewares/error-handler.js';
import { requestLogger } from './middlewares/request-logger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: config.cors.origins,
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// API Routes
app.use('/ingest', ingestRouter);
app.use('/status', statusRouter);
app.use('/summary', summaryRouter);
app.use('/query', queryRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`🚀 RAG API running on port ${PORT}`);
    logger.info(`📊 Environment: ${config.nodeEnv}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export { app };
