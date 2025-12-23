import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { createError } from '../middlewares/error-handler.js';
import { RagService } from '../services/rag.service.js';

const router = Router();

// Query request schema
const querySchema = z.object({
    question: z.string().min(1).max(1000),
    jobIds: z.array(z.string()).optional(), // Optional: query specific documents
    filters: z.object({
        modality: z.enum(['video', 'document', 'audio', 'image']).optional(),
        dateRange: z.object({
            start: z.string().datetime().optional(),
            end: z.string().datetime().optional(),
        }).optional(),
        tags: z.array(z.string()).optional(),
        courseId: z.string().optional(),
    }).optional(),
    options: z.object({
        maxResults: z.number().min(1).max(20).optional(),
        includeContext: z.boolean().optional(),
        streamResponse: z.boolean().optional(),
    }).optional(),
});

/**
 * POST /query
 * Ask questions about ingested content
 * Uses RAG to retrieve relevant chunks and generate answers
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, jobIds, filters, options } = querySchema.parse(req.body);

        logger.info({
            question: question.substring(0, 100),
            jobIds,
            filters,
        }, 'Query received');

        const ragService = new RagService();
        const result = await ragService.query({
            question,
            jobIds,
            filters,
            options: {
                maxResults: options?.maxResults ?? 5,
                includeContext: options?.includeContext ?? true,
            },
        });

        res.json({
            success: true,
            question,
            answer: result.answer,
            sources: result.sources.map(source => ({
                chunkId: source.chunkId,
                text: source.text,
                score: source.score,
                metadata: {
                    modality: source.modality,
                    source: source.sourceInfo,
                    timestamp: source.timestamp,
                },
            })),
            confidence: result.confidence,
            processingTime: result.processingTime,
        });

    } catch (error) {
        next(error);
    }
});

/**
 * POST /query/stream
 * Stream the response for real-time UI updates
 */
router.post('/stream', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, jobIds, filters } = querySchema.parse(req.body);

        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const ragService = new RagService();

        // Stream the response
        for await (const chunk of ragService.queryStream({ question, jobIds, filters })) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        next(error);
    }
});

/**
 * GET /query/suggestions
 * Get suggested questions based on content
 */
router.get('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobId, count = '5' } = req.query;

        const ragService = new RagService();
        const suggestions = await ragService.getSuggestedQuestions(
            jobId as string,
            parseInt(count as string, 10)
        );

        res.json({
            success: true,
            suggestions,
        });

    } catch (error) {
        next(error);
    }
});

export { router as queryRouter };
