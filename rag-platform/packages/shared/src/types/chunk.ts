/**
 * Content Modality
 */
export type Modality = 'video' | 'document' | 'audio' | 'image';

/**
 * Canonical Chunk
 * The universal format for all content after processing
 * RAG only sees these chunks, never raw content
 */
export interface CanonicalChunk {
    chunkId: string;
    text: string;
    modality: Modality;
    source: {
        fileId: string;
        page?: number; // For documents
        timestamp?: string; // For video/audio (e.g., "05:23")
    };
    visualContext?: string; // Description of visual elements
    confidence: number; // 0-1 confidence score
    embedding?: number[]; // Stored after embedding generation
    metadata?: Record<string, unknown>;
}

/**
 * Stored Chunk (after vector DB storage)
 */
export interface StoredChunk extends CanonicalChunk {
    vectorId: string;
    storedAt: string;
}
