import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),

    // Azure Storage
    azure: z.object({
        storage: z.object({
            connectionString: z.string().optional(),
            accountName: z.string().optional(),
            accountKey: z.string().optional(),
            containers: z.object({
                raw: z.string().default('raw-videos'),
                processed: z.string().default('processed'),
                transcripts: z.string().default('transcripts'),
                summaries: z.string().default('summaries'),
                embeddings: z.string().default('embeddings'),
            }),
        }),
        serviceBus: z.object({
            connectionString: z.string().optional(),
            queues: z.object({
                video: z.string().default('video-jobs'),
                document: z.string().default('document-jobs'),
                audio: z.string().default('audio-jobs'),
            }),
        }),
        openai: z.object({
            endpoint: z.string().optional(),
            apiKey: z.string().optional(),
            deploymentName: z.string().default('gpt-4'),
            embeddingDeployment: z.string().default('text-embedding-ada-002'),
        }),
    }),

    // OpenAI fallback
    openai: z.object({
        apiKey: z.string().optional(),
    }),

    // Qdrant
    qdrant: z.object({
        url: z.string().default('http://localhost:6333'),
        apiKey: z.string().optional(),
        collectionName: z.string().default('rag-chunks'),
    }),

    // Processing
    processing: z.object({
        tempDir: z.string().default('/tmp/processing'),
        maxConcurrent: z.number().default(3),
        whisperModel: z.string().default('base'),
        whisperDevice: z.string().default('cpu'),
    }),

    // Logging
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

const rawConfig = {
    nodeEnv: process.env.NODE_ENV,
    azure: {
        storage: {
            connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
            accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
            accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
            containers: {
                raw: process.env.AZURE_STORAGE_CONTAINER_RAW,
                processed: process.env.AZURE_STORAGE_CONTAINER_PROCESSED,
                transcripts: process.env.AZURE_STORAGE_CONTAINER_TRANSCRIPTS,
                summaries: process.env.AZURE_STORAGE_CONTAINER_SUMMARIES,
                embeddings: process.env.AZURE_STORAGE_CONTAINER_EMBEDDINGS,
            },
        },
        serviceBus: {
            connectionString: process.env.AZURE_SERVICE_BUS_CONNECTION_STRING,
            queues: {
                video: process.env.AZURE_SERVICE_BUS_QUEUE_VIDEO,
                document: process.env.AZURE_SERVICE_BUS_QUEUE_DOCUMENT,
                audio: process.env.AZURE_SERVICE_BUS_QUEUE_AUDIO,
            },
        },
        openai: {
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            embeddingDeployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
        },
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
    },
    qdrant: {
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
    },
    processing: {
        tempDir: process.env.PROCESSING_TEMP_DIR,
        maxConcurrent: process.env.PROCESSING_MAX_CONCURRENT ? parseInt(process.env.PROCESSING_MAX_CONCURRENT) : 3,
        whisperModel: process.env.WHISPER_MODEL,
        whisperDevice: process.env.WHISPER_DEVICE,
    },
    logLevel: process.env.LOG_LEVEL,
};

export const config = configSchema.parse(rawConfig);
export type Config = z.infer<typeof configSchema>;
