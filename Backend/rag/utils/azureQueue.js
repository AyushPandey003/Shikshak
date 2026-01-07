import { QueueServiceClient } from "@azure/storage-queue";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const QUEUE_NAME = process.env.AZURE_QUEUE_NAME || "ingestion-jobs";

let queueClient = null;

/**
 * Initialize the Azure Queue Client
 */
async function initQueueClient() {
    if (queueClient) return queueClient;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set in environment variables");
    }

    try {
        // Create QueueServiceClient from connection string
        const queueServiceClient = QueueServiceClient.fromConnectionString(
            AZURE_STORAGE_CONNECTION_STRING
        );

        // Get the queue client
        queueClient = queueServiceClient.getQueueClient(QUEUE_NAME);

        // Ensure the queue exists
        await queueClient.createIfNotExists();
        console.log(`[AzureQueue] Queue '${QUEUE_NAME}' initialized successfully`);

        return queueClient;
    } catch (error) {
        console.error("[AzureQueue] Failed to initialize queue client:", error.message);
        throw error;
    }
}

/**
 * Push an ingestion job to the Azure Queue
 * 
 * @param {string} jobId - Unique job identifier
 * @param {string} blobUrl - SAS URL of the uploaded blob
 * @param {object} metadata - Job metadata (courseId, moduleId, sourceType, videoId, notesId)
 * @returns {Promise<object>} - Queue message response
 */
export const pushIngestionJob = async (jobId, blobUrl, metadata) => {
    const client = await initQueueClient();

    const message = {
        jobId,
        blobUrl,
        metadata: {
            courseId: metadata.course_id || metadata.courseId,
            moduleId: metadata.module_id || metadata.moduleId,
            sourceType: metadata.source_type || metadata.sourceType,
            videoId: metadata.video_id || metadata.videoId || null,
            notesId: metadata.notes_id || metadata.notesId || null
        }
    };

    try {
        // Azure Queue expects base64 encoded messages
        const messageText = JSON.stringify(message);
        const base64Message = Buffer.from(messageText).toString('base64');

        const response = await client.sendMessage(base64Message);

        console.log(`[AzureQueue] Job ${jobId} pushed to queue successfully`);
        console.log(`[AzureQueue] Message ID: ${response.messageId}`);

        return {
            success: true,
            messageId: response.messageId,
            jobId
        };
    } catch (error) {
        console.error(`[AzureQueue] Failed to push job ${jobId}:`, error.message);
        throw new Error(`Failed to queue ingestion job: ${error.message}`);
    }
};

/**
 * Check if the queue service is healthy
 * @returns {Promise<boolean>}
 */
export const checkQueueHealth = async () => {
    try {
        await initQueueClient();
        return true;
    } catch (error) {
        console.error("[AzureQueue] Health check failed:", error.message);
        return false;
    }
};

export default {
    pushIngestionJob,
    checkQueueHealth
};
