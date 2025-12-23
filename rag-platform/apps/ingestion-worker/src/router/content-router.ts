import { logger } from '../utils/logger.js';
import { VideoPipeline } from '../pipelines/video.pipeline.js';
import { AudioPipeline } from '../pipelines/audio.pipeline.js';
import { DocumentPipeline } from '../pipelines/document.pipeline.js';
import { ImagePipeline } from '../pipelines/image.pipeline.js';
import type { IngestionJob, ProcessingResult, ContentPipeline } from 'shared';

/**
 * Content Router
 * Routes content to the appropriate processing pipeline based on file type
 * This is the "plug-and-play" magic - automatically detects and processes any file
 */
export class ContentRouter {
    private pipelines: Map<string, ContentPipeline> = new Map();

    /**
     * Initialize all pipelines
     */
    async initialize(): Promise<void> {
        logger.info('Initializing content pipelines');

        // Register all pipelines
        this.pipelines.set('video', new VideoPipeline());
        this.pipelines.set('audio', new AudioPipeline());
        this.pipelines.set('document', new DocumentPipeline());
        this.pipelines.set('image', new ImagePipeline());

        // Initialize each pipeline
        for (const [name, pipeline] of this.pipelines) {
            await pipeline.initialize();
            logger.info({ pipeline: name }, 'Pipeline initialized');
        }

        logger.info(`Registered ${this.pipelines.size} content pipelines`);
    }

    /**
     * Process a job by routing to the correct pipeline
     */
    async process(job: IngestionJob): Promise<ProcessingResult> {
        const pipeline = this.pipelines.get(job.fileType);

        if (!pipeline) {
            // Try to detect file type again or fallback
            const detectedType = await this.detectFileType(job);
            const fallbackPipeline = this.pipelines.get(detectedType);

            if (!fallbackPipeline) {
                return {
                    success: false,
                    progress: 0,
                    error: `No pipeline available for file type: ${job.fileType}`,
                };
            }

            return fallbackPipeline.process(job);
        }

        return pipeline.process(job);
    }

    /**
     * Detect file type from job metadata
     */
    private async detectFileType(job: IngestionJob): Promise<string> {
        const mimeType = job.metadata?.mimeType as string;
        const fileName = job.metadata?.fileName as string;

        // Check MIME type first
        if (mimeType) {
            if (mimeType.startsWith('video/')) return 'video';
            if (mimeType.startsWith('audio/')) return 'audio';
            if (mimeType.startsWith('image/')) return 'image';
            if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
        }

        // Check file extension
        if (fileName) {
            const ext = fileName.split('.').pop()?.toLowerCase();
            if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext ?? '')) return 'video';
            if (['mp3', 'wav', 'm4a', 'flac', 'ogg'].includes(ext ?? '')) return 'audio';
            if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext ?? '')) return 'image';
            if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'md'].includes(ext ?? '')) return 'document';
        }

        return 'unknown';
    }

    /**
     * Get list of supported file types
     */
    getSupportedTypes(): string[] {
        return Array.from(this.pipelines.keys());
    }
}
