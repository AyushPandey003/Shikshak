// infra/material.consumer.js
import { kafka } from "./client.js";
import { deleteBlobFromAzure, uploadFileToAzure, generateSasUrl } from "../utils/azureStorage.js";
import { pushIngestionJob } from "../utils/azureQueue.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../../.config/.env') });

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;

const consumer = kafka.consumer({
  groupId: "material-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

async function connectConsumer() {
  try {
    console.log("Connecting Consumer...");
    console.log("Broker: localhost:9092");
    await consumer.connect();
    console.log("✓ Consumer Connected Successfully");
  } catch (error) {
    console.error("❌ Failed to connect consumer:", error.message);
    throw error;
  }
}

async function subscribeToTopics() {
  try {
    console.log("Subscribing to topics: material_data");
    await consumer.subscribe({
      topics: ["materail_data"],
      fromBeginning: true
    });
    console.log("✓ Subscribed to topics: material_data");
  } catch (error) {
    console.error("❌ Failed to subscribe:", error.message);
    throw error;
  }
}

async function startConsumer() {
  try {
    await connectConsumer();
    await subscribeToTopics();

    console.log("🚀 Consumer is running and waiting for messages...");
    console.log("Press CTRL+C to stop\n");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log("\n📨 NEW MESSAGE RECEIVED:");
          console.log("─".repeat(50));

          const value = message.value.toString();
          console.log("Raw message:", value);

          const payload = JSON.parse(value);
          const { eventtype } = payload;

          if (eventtype === 'video_created') {
            const { course_id, module_id, azureBlobUrl, video_id } = payload;

            // Generate a job ID
            const jobId = uuidv4();

            // Generate SAS URL from blob URL (extract blob name)
            const blobName = azureBlobUrl.split('/').pop().split('?')[0];
            const sasUrl = generateSasUrl(blobName);

            // Push to Azure Queue for processing by hosted worker
            const metadata = {
              courseId: course_id,
              moduleId: module_id,
              sourceType: 'video',
              videoId: video_id
            };

            await pushIngestionJob(jobId, sasUrl, metadata);
            console.log(`✓ Video ingestion job ${jobId} queued`);
          }
          else if (eventtype === 'note_created') {
            const { course_id, module_id, azureBlobUrl, note_id } = payload;

            // Generate a job ID
            const jobId = uuidv4();

            // Generate SAS URL from blob URL (extract blob name)
            const blobName = azureBlobUrl.split('/').pop().split('?')[0];
            const sasUrl = generateSasUrl(blobName);

            // Push to Azure Queue for processing by hosted worker
            const metadata = {
              courseId: course_id,
              moduleId: module_id,
              sourceType: 'notes',
              notesId: note_id
            };

            await pushIngestionJob(jobId, sasUrl, metadata);
            console.log(`✓ Note ingestion job ${jobId} queued`);
          }
          else if (eventtype === 'video_deleted') {
            const { video_id, azureBlobUrl } = payload;

            // Call hosted RAG service to delete chunks
            try {
              await axios.delete(`${RAG_SERVICE_URL}/delete`, {
                data: { video_id },
                headers: { 'Content-Type': 'application/json' }
              });
              console.log(`✓ Deleted RAG chunks for video ${video_id}`);
            } catch (err) {
              console.error(`❌ Failed to delete RAG chunks for video ${video_id}:`, err.message);
            }

            // Delete blob from storage
            try {
              const blobName = azureBlobUrl.split('/').pop().split('?')[0];
              await deleteBlobFromAzure(blobName);
              console.log(`✓ Deleted blob for video ${video_id}`);
            } catch (err) {
              console.error(`❌ Failed to delete blob:`, err.message);
            }
          }
          else if (eventtype === 'note_deleted') {
            const { note_id, azureBlobUrl } = payload;

            // Call hosted RAG service to delete chunks
            try {
              await axios.delete(`${RAG_SERVICE_URL}/delete`, {
                data: { notes_id: note_id },
                headers: { 'Content-Type': 'application/json' }
              });
              console.log(`✓ Deleted RAG chunks for note ${note_id}`);
            } catch (err) {
              console.error(`❌ Failed to delete RAG chunks for note ${note_id}:`, err.message);
            }

            // Delete blob from storage
            try {
              const blobName = azureBlobUrl.split('/').pop().split('?')[0];
              await deleteBlobFromAzure(blobName);
              console.log(`✓ Deleted blob for note ${note_id}`);
            } catch (err) {
              console.error(`❌ Failed to delete blob:`, err.message);
            }
          }
          else {
            console.log("Unknown event type:", eventtype);
          }

          console.log("─".repeat(50));
        } catch (error) {
          console.error("❌ Error processing message:", error);
          console.error("Message value:", message.value.toString());
        }
      },
    });
  } catch (error) {
    console.error("❌ Fatal error in consumer:", error);
    process.exit(1);
  }
}

async function disconnectConsumer() {
  try {
    await consumer.disconnect();
    console.log("✓ Consumer Disconnected");
  } catch (error) {
    console.error("Error disconnecting consumer:", error);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down consumer gracefully...");
  await disconnectConsumer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down consumer gracefully...");
  await disconnectConsumer();
  process.exit(0);
});

// Auto-start when this file is imported
startConsumer().catch((error) => {
  console.error("Failed to start consumer:", error);
  process.exit(1);
});