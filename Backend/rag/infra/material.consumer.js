// infra/email.consumer.js
import { kafka } from "./client.js";
import { deleteBlobFromAzure } from "../utils/azureStorage.js";
import axios from "axios";

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
            // axios.post('http://localhost:4005/api/rag/ingest', {
            //   course_id,
            //   module_id,
            //   azureBlobUrl,
            //   video_id
            // })


          }
          else if (eventtype === 'note_created') {
            const { course_id, module_id, azureBlobUrl, note_id } = payload;
            // axios.post('http://localhost:4005/api/rag/ingest', {
            //   course_id,
            //   module_id,
            //   azureBlobUrl,
            //   note_id
            // })



          }
          else if (eventtype === 'video_deleted') {

            const { video_id, azureBlobUrl } = payload;
            console.log(video_id, "video_id")
            try {
              /* Correct Pattern */
              axios.delete('http://localhost:4005/api/rag/delete', {
                data: { video_id }, // Body goes here
                withCredentials: true
              })
              console.log("Mai chal gaya hu")
            } catch (error) {
              console.log(error, "I am coming from kafka")
            }
            console.log("going for M2")
            deleteBlobFromAzure(azureBlobUrl)
          }
          else if (eventtype === 'note_deleted') {

            const { note_id, azureBlobUrl } = payload;
            console.log(note_id, "note_id")
            console.log(azureBlobUrl, "azureBlobUrl")
            const notes_id = note_id;
            try {
              axios.delete('http://localhost:4005/api/rag/delete', {
                data: { notes_id },
                withCredentials: true
              })
            }
            catch (error) {
              console.log(error, "I am coming from kafka")
            }
            deleteBlobFromAzure(azureBlobUrl[0])



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