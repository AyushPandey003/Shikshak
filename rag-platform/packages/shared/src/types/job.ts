/**
 * Job Status
 */
export type JobStatusType = 'queued' | 'processing' | 'completed' | 'failed';

/**
 * File Type
 */
export type FileType = 'video' | 'audio' | 'document' | 'image' | 'unknown';

/**
 * Job Status Details
 */
export interface JobStatus {
    status: JobStatusType;
    progress: number;
    currentStep: string;
    steps: string[];
    startedAt: string;
    completedAt?: string;
    error?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Job Log Entry
 */
export interface JobLog {
    timestamp: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    message: string;
    step?: string;
    data?: Record<string, unknown>;
}

/**
 * Ingestion Job
 */
export interface IngestionJob {
    jobId: string;
    fileType: FileType;
    filePath: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    priority?: number;
}

/**
 * File Upload Request
 */
export interface IngestRequest {
    jobId: string;
    file: {
        buffer: Buffer;
        originalName: string;
        mimeType: string;
        size: number;
    };
    metadata?: {
        title?: string;
        description?: string;
        tags?: string[];
        userId?: string;
        courseId?: string;
    };
    requestId: string;
}

/**
 * URL Ingest Request
 */
export interface UrlIngestRequest {
    jobId: string;
    url: string;
    metadata?: {
        title?: string;
        description?: string;
        tags?: string[];
        userId?: string;
        courseId?: string;
    };
    requestId: string;
}
