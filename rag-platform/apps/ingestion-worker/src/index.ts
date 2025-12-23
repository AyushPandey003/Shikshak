import { logger } from './utils/logger.js';
import { ContentRouter } from './router/content-router.js';
import { QueueConsumer } from './queue/consumer.js';
import { config } from './config/index.js';

/**
 * Ingestion Worker
 * Processes files asynchronously using content-aware pipelines
 */
async function main() {
    logger.info('🚀 Starting Ingestion Worker');
    logger.info(`📊 Environment: ${config.nodeEnv}`);

    // Initialize content router with all pipelines
    const router = new ContentRouter();
    await router.initialize();

    // Initialize queue consumer
    const consumer = new QueueConsumer(router);

    // Set up graceful shutdown
    const shutdown = async (signal: string) => {
        logger.info({ signal }, 'Received shutdown signal');
        await consumer.stop();
        logger.info('Worker stopped gracefully');
        process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Start consuming jobs
    try {
        await consumer.start();
        logger.info('✅ Worker is ready and processing jobs');
    } catch (error) {
        logger.error({ error }, 'Failed to start worker');
        process.exit(1);
    }
}

main().catch((error) => {
    logger.error({ error }, 'Unhandled error in main');
    process.exit(1);
});
