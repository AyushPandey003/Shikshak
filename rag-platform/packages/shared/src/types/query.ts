import type { Modality } from './chunk.js';

/**
 * Query Request
 */
export interface QueryRequest {
    question: string;
    jobIds?: string[]; // Query specific documents
    filters?: QueryFilters;
    options?: QueryOptions;
}

/**
 * Query Filters
 */
export interface QueryFilters {
    modality?: Modality;
    dateRange?: {
        start?: string;
        end?: string;
    };
    tags?: string[];
    courseId?: string;
    userId?: string;
}

/**
 * Query Options
 */
export interface QueryOptions {
    maxResults?: number;
    includeContext?: boolean;
    streamResponse?: boolean;
    temperature?: number;
}

/**
 * Query Result
 */
export interface QueryResult {
    answer: string;
    sources: QuerySource[];
    confidence: number;
    processingTime: number;
}

/**
 * Query Source
 */
export interface QuerySource {
    chunkId: string;
    text: string;
    score: number;
    modality: Modality;
    sourceInfo: {
        fileId: string;
        page?: number;
        timestamp?: string;
    };
    timestamp?: string;
}

/**
 * Stream Chunk
 */
export interface StreamChunk {
    type: 'status' | 'sources' | 'answer' | 'done';
    content: string;
}
