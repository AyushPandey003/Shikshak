import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export interface RetrievedChunk {
    id: string;
    text: string;
    score: number;
    modality: 'video' | 'document' | 'audio' | 'image';
    sourceInfo: {
        fileId: string;
        page?: number;
        timestamp?: string;
    };
    timestamp?: string;
    visualContext?: string;
}

export interface SearchOptions {
    maxResults: number;
    filters?: {
        modality?: string;
        dateRange?: { start?: string; end?: string };
        tags?: string[];
        courseId?: string;
    };
    jobIds?: string[];
}

/**
 * Retrieval Service
 * Handles vector similarity search using Qdrant
 */
export class RetrievalService {
    private client: QdrantClient;
    private collectionName: string;

    constructor() {
        this.client = new QdrantClient({
            url: config.qdrant.url,
            apiKey: config.qdrant.apiKey,
        });
        this.collectionName = config.qdrant.collectionName;
    }

    /**
     * Initialize the collection if it doesn't exist
     */
    async ensureCollection(): Promise<void> {
        try {
            const collections = await this.client.getCollections();
            const exists = collections.collections.some(c => c.name === this.collectionName);

            if (!exists) {
                await this.client.createCollection(this.collectionName, {
                    vectors: {
                        size: 1536, // OpenAI text-embedding-ada-002
                        distance: 'Cosine',
                    },
                });

                logger.info({ collection: this.collectionName }, 'Created Qdrant collection');
            }
        } catch (error) {
            logger.error({ error }, 'Failed to ensure Qdrant collection');
            throw error;
        }
    }

    /**
     * Search for relevant chunks
     */
    async search(query: string, options: SearchOptions): Promise<RetrievedChunk[]> {
        try {
            // Generate embedding for the query
            const queryEmbedding = await this.generateEmbedding(query);

            // Build filter conditions
            const filter = this.buildFilter(options);

            // Search Qdrant
            const results = await this.client.search(this.collectionName, {
                vector: queryEmbedding,
                limit: options.maxResults,
                filter: filter,
                with_payload: true,
            });

            return results.map(result => ({
                id: result.id as string,
                text: result.payload?.text as string,
                score: result.score,
                modality: result.payload?.modality as RetrievedChunk['modality'],
                sourceInfo: {
                    fileId: result.payload?.fileId as string,
                    page: result.payload?.page as number | undefined,
                    timestamp: result.payload?.timestamp as string | undefined,
                },
                timestamp: result.payload?.timestamp as string | undefined,
                visualContext: result.payload?.visualContext as string | undefined,
            }));

        } catch (error) {
            logger.error({ error, query: query.substring(0, 100) }, 'Search failed');
            // Return empty results on error (graceful degradation)
            return [];
        }
    }

    /**
     * Store chunks with embeddings
     */
    async storeChunks(chunks: Array<{
        id: string;
        text: string;
        embedding: number[];
        metadata: Record<string, unknown>;
    }>): Promise<void> {
        try {
            await this.ensureCollection();

            const points = chunks.map(chunk => ({
                id: chunk.id,
                vector: chunk.embedding,
                payload: {
                    text: chunk.text,
                    ...chunk.metadata,
                },
            }));

            await this.client.upsert(this.collectionName, {
                points,
            });

            logger.info({ count: chunks.length }, 'Stored chunks in Qdrant');

        } catch (error) {
            logger.error({ error }, 'Failed to store chunks');
            throw error;
        }
    }

    /**
     * Delete chunks by job ID
     */
    async deleteByJobId(jobId: string): Promise<void> {
        try {
            await this.client.delete(this.collectionName, {
                filter: {
                    must: [
                        {
                            key: 'jobId',
                            match: { value: jobId },
                        },
                    ],
                },
            });

            logger.info({ jobId }, 'Deleted chunks for job');

        } catch (error) {
            logger.error({ error, jobId }, 'Failed to delete chunks');
            throw error;
        }
    }

    // Private methods

    private async generateEmbedding(text: string): Promise<number[]> {
        // TODO: Call OpenAI/Azure OpenAI embedding API
        // For now, return mock embedding
        logger.debug({ textLength: text.length }, 'Generating embedding');

        // Mock 1536-dimensional embedding
        return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    }

    private buildFilter(options: SearchOptions): Record<string, unknown> | undefined {
        const conditions: Array<Record<string, unknown>> = [];

        // Filter by modality
        if (options.filters?.modality) {
            conditions.push({
                key: 'modality',
                match: { value: options.filters.modality },
            });
        }

        // Filter by job IDs
        if (options.jobIds && options.jobIds.length > 0) {
            conditions.push({
                key: 'jobId',
                match: { any: options.jobIds },
            });
        }

        // Filter by course ID
        if (options.filters?.courseId) {
            conditions.push({
                key: 'courseId',
                match: { value: options.filters.courseId },
            });
        }

        // Filter by tags
        if (options.filters?.tags && options.filters.tags.length > 0) {
            conditions.push({
                key: 'tags',
                match: { any: options.filters.tags },
            });
        }

        if (conditions.length === 0) {
            return undefined;
        }

        return { must: conditions };
    }
}
