import { logger } from '../utils/logger.js';
import type { ContentRouter } from '../router/content-router.js';
import type { IngestionJob } from 'shared';

/**
 * Queue Consumer
 * Consumes jobs from Azure Service Bus (or mock in development)
 */
export class QueueConsumer {
    private router: ContentRouter;
    private isRunning: boolean = false;
    private processingJobs: Map<string, Promise<void>> = new Map();

    constructor(router: ContentRouter) {
        this.router = router;
    }

    /**
     * Start consuming jobs
     */
    async start(): Promise<void> {
        this.isRunning = true;
        logger.info('Queue consumer started');

        // In production, this would connect to Azure Service Bus
        // For development, we'll poll a local queue or use a mock
        await this.consumeLoop();
    }

    /**
     * Stop consuming jobs gracefully
     */
    async stop(): Promise<void> {
        this.isRunning = false;

        // Wait for all in-flight jobs to complete
        if (this.processingJobs.size > 0) {
            logger.info({ count: this.processingJobs.size }, 'Waiting for in-flight jobs to complete');
            await Promise.all(this.processingJobs.values());
        }

        logger.info('Queue consumer stopped');
    }

    /**
     * Main consume loop
     */
    private async consumeLoop(): Promise<void> {
        while (this.isRunning) {
            try {
                // Fetch next job from queue
                const job = await this.receiveJob();

                if (job) {
                    // Process job in background
                    const jobPromise = this.processJob(job);
                    this.processingJobs.set(job.jobId, jobPromise);

                    // Clean up when done
                    jobPromise.finally(() => {
                        this.processingJobs.delete(job.jobId);
                    });
                } else {
                    // No job available, wait before polling again
                    await this.sleep(1000);
                }
            } catch (error) {
                logger.error({ error }, 'Error in consume loop');
                await this.sleep(5000); // Back off on error
            }
        }
    }

    /**
     * Receive a job from the queue
     */
    private async receiveJob(): Promise<IngestionJob | null> {
        // TODO: Implement Azure Service Bus receiver
        // ServiceBusClient connection and message receiving

        // For now, return null (no jobs in mock mode)
        return null;
    }

    /**
     * Process a single job
     */
    private async processJob(job: IngestionJob): Promise<void> {
        const jobLogger = logger.child({ jobId: job.jobId });

        try {
            jobLogger.info({ fileType: job.fileType }, 'Starting job processing');

            // Update status to processing
            await this.updateJobStatus(job.jobId, 'processing', 0);

            // Route to appropriate pipeline
            const result = await this.router.process(job);

            if (result.success) {
                await this.updateJobStatus(job.jobId, 'completed', 100);
                jobLogger.info('Job completed successfully');
            } else {
                await this.updateJobStatus(job.jobId, 'failed', result.progress, result.error);
                jobLogger.error({ error: result.error }, 'Job failed');
            }

        } catch (error) {
            jobLogger.error({ error }, 'Unhandled error processing job');
            await this.updateJobStatus(job.jobId, 'failed', 0, String(error));
        }
    }

    /**
     * Update job status in storage
     */
    private async updateJobStatus(
        jobId: string,
        status: string,
        progress: number,
        error?: string
    ): Promise<void> {
        // TODO: Store in Redis/database
        logger.debug({ jobId, status, progress, error }, 'Job status updated');
    }

    /**
     * Helper to sleep
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
