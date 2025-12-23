import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';
import { createError } from '../middlewares/error-handler.js';
import { RagService } from '../services/rag.service.js';

const router = Router();

/**
 * GET /status/:jobId
 * Get the processing status of a job
 */
router.get('/:jobId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            throw createError('Job ID is required', 400, 'JOB_ID_REQUIRED');
        }

        const ragService = new RagService();
        const status = await ragService.getJobStatus(jobId);

        if (!status) {
            throw createError('Job not found', 404, 'JOB_NOT_FOUND');
        }

        logger.debug({ jobId, status: status.status }, 'Job status requested');

        res.json({
            jobId,
            status: status.status,
            progress: status.progress,
            currentStep: status.currentStep,
            steps: status.steps,
            startedAt: status.startedAt,
            completedAt: status.completedAt,
            error: status.error,
            result: status.status === 'completed' ? {
                summaryUrl: `/summary/${jobId}`,
                queryUrl: `/query`,
            } : undefined,
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /status/:jobId/logs
 * Get detailed processing logs for a job
 */
router.get('/:jobId/logs', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { jobId } = req.params;
        const { limit = '100', offset = '0' } = req.query;

        const ragService = new RagService();
        const logs = await ragService.getJobLogs(jobId, {
            limit: parseInt(limit as string, 10),
            offset: parseInt(offset as string, 10),
        });

        res.json({
            jobId,
            logs,
            pagination: {
                limit: parseInt(limit as string, 10),
                offset: parseInt(offset as string, 10),
                hasMore: logs.length === parseInt(limit as string, 10),
            },
        });

    } catch (error) {
        next(error);
    }
});

export { router as statusRouter };
