```javascript
import { QueueClient } from "@azure/storage-queue";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const QUEUE_NAME = process.env.AZURE_QUEUE_NAME || "ingestion-jobs";

if (!AZURE_STORAGE_CONNECTION_STRING) {
    console.warn("⚠️ AZURE_STORAGE_CONNECTION_STRING is missing in .env");
}

let queueClient;

export const initQueueClient = async () => {
    if (queueClient) return queueClient;

    try {
        // Initialize QueueClient without policy (we will manually encode)
        queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, QUEUE_NAME);
        
        // Ensure queue exists
        await queueClient.createIfNotExists();
        return queueClient;
    } catch (error) {
        console.error("Error initializing Queue Client:", error.message);
        throw error;
    }
};

export const enqueueIngestionJob = async (jobData) => {
    try {
        const client = await initQueueClient();

        // Message format must match what worker.py expects (JSON)
        const messageString = JSON.stringify(jobData);
        
        // Manual Base64 encoding to match Python's BinaryBase64DecodePolicy expectation
        // Node's QueueClient (default) sends XML text. Python worker expects that text to be Base64.
        const messageBase64 = Buffer.from(messageString).toString('base64');
        
        // Send message
        const sendMessageResponse = await client.sendMessage(messageBase64);

        return {
            success: true,
            messageId: sendMessageResponse.messageId,
            popReceipt: sendMessageResponse.popReceipt
        };
    } catch (error) {
        console.error("Error sending message to queue:", error.message);
        throw error;
    }
};
