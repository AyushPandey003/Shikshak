import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { createError } from '../middlewares/error-handler.js';
import { RagService } from '../services/rag.service.js';

const router = Router();

/**
 * GET /summary/:jobId
 * Get the generated summary for a completed job
 */
router.get('/:jobId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobId } = req.params;
        const { format = 'full' } = req.query;

        if (!jobId) {
            throw createError('Job ID is required', 400, 'JOB_ID_REQUIRED');
        }

        const ragService = new RagService();
        const summary = await ragService.getSummary(jobId);

        if (!summary) {
            throw createError('Summary not found', 404, 'SUMMARY_NOT_FOUND');
        }

        if (summary.status !== 'completed') {
            throw createError(`Job is still ${summary.status}`, 400, 'JOB_NOT_COMPLETED');
        }

        logger.debug({ jobId, format }, 'Summary requested');

        // Return different formats based on request
        const responseData = format === 'executive'
            ? {
                jobId,
                title: summary.title,
                executiveSummary: summary.executiveSummary,
                keyPoints: summary.keyPoints,
                generatedAt: summary.generatedAt,
            }
            : {
                jobId,
                title: summary.title,
                executiveSummary: summary.executiveSummary,
                detailedSummary: summary.detailedSummary,
                keyPoints: summary.keyPoints,
                topics: summary.topics,
                timeline: summary.timeline,
                metadata: summary.metadata,
                generatedAt: summary.generatedAt,
            };

        res.json(responseData);

    } catch (error) {
        next(error);
    }
});

/**
 * POST /summary/:jobId/regenerate
 * Regenerate summary with different parameters
 */
router.post('/:jobId/regenerate', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobId } = req.params;
        const schema = z.object({
            style: z.enum(['concise', 'detailed', 'academic', 'casual']).optional(),
            maxLength: z.number().min(100).max(10000).optional(),
            focusAreas: z.array(z.string()).optional(),
            language: z.string().optional(),
        });

        const options = schema.parse(req.body);

        const ragService = new RagService();
        const result = await ragService.regenerateSummary(jobId, options);

        res.json({
            success: true,
            jobId,
            message: 'Summary regeneration started',
            newJobId: result.regenerationJobId,
        });

    } catch (error) {
        next(error);
    }
});

export { router as summaryRouter };
