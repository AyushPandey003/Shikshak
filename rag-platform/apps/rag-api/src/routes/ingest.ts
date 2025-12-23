import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { createError } from '../middlewares/error-handler.js';
import { RagService } from '../services/rag.service.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB max for videos
    },
});

// Request validation schema
const ingestMetadataSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    userId: z.string().optional(),
    courseId: z.string().optional(),
}).optional();

/**
 * POST /ingest
 * Upload any file for processing
 * Returns job_id for tracking
 */
router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw createError('No file provided', 400, 'FILE_REQUIRED');
        }

        const jobId = uuidv4();
        const metadata = ingestMetadataSchema.parse(req.body.metadata ? JSON.parse(req.body.metadata) : {});

        logger.info({
            jobId,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
        }, 'Starting file ingestion');

        // Queue the file for processing
        const ragService = new RagService();
        const job = await ragService.queueForIngestion({
            jobId,
            file: {
                buffer: req.file.buffer,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
            },
            metadata,
            requestId: req.requestId,
        });

        res.status(202).json({
            success: true,
            jobId: job.jobId,
            status: 'queued',
            message: 'File accepted for processing',
            estimatedTime: job.estimatedTime,
            statusUrl: `/status/${job.jobId}`,
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /ingest/url
 * Ingest content from a URL
 */
router.post('/url', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = z.object({
            url: z.string().url(),
            metadata: ingestMetadataSchema,
        });

        const { url, metadata } = schema.parse(req.body);
        const jobId = uuidv4();

        logger.info({
            jobId,
            url,
        }, 'Starting URL ingestion');

        const ragService = new RagService();
        const job = await ragService.queueUrlForIngestion({
            jobId,
            url,
            metadata,
            requestId: req.requestId,
        });

        res.status(202).json({
            success: true,
            jobId: job.jobId,
            status: 'queued',
            message: 'URL accepted for processing',
            estimatedTime: job.estimatedTime,
            statusUrl: `/status/${job.jobId}`,
        });

    } catch (error) {
        next(error);
    }
});

export { router as ingestRouter };
