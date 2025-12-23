import type { IngestionJob } from './job.js';
import type { CanonicalChunk } from './chunk.js';

/**
 * Processing Result
 */
export interface ProcessingResult {
    success: boolean;
    progress: number;
    chunks?: number;
    error?: string;
}

/**
 * Content Pipeline Interface
 * All pipelines must implement this interface
 */
export interface ContentPipeline {
    /**
     * Initialize the pipeline
     */
    initialize(): Promise<void>;

    /**
     * Process a job and return canonical chunks
     */
    process(job: IngestionJob): Promise<ProcessingResult>;
}

/**
 * Pipeline Step
 */
export interface PipelineStep {
    name: string;
    progress: number;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: string;
    completedAt?: string;
    error?: string;
}

/**
 * Pipeline Config
 */
export interface PipelineConfig {
    maxRetries: number;
    timeout: number;
    chunkSize: number;
    overlapSize: number;
}
