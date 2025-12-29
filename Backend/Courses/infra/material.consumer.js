// infra/email.consumer.js
import { kafka } from "./client.js";

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

          console.log(`Topic: ${topic}`);
          console.log(`Partition: ${partition}`);
          console.log(`Offset: ${message.offset}`);
          console.log(`Key: ${message.key?.toString()}`);
          console.log(`Event Type: ${eventtype}`);

          if (eventtype === 'video_created') {
            const { material_id, module_id, course_id, azure_id } = payload;
            console.log(`Module ID: ${module_id}`);
            console.log(`Video ID: ${material_id}`);

            try {
              const { ingestVideoToRag } = await import("../utils/ragClient.js");
              const transcript = await ingestVideoToRag({
                course_id: course_id,
                module_id: module_id,
                video_id: uuidv4(),
                blob_name: azure_id
              });

              console.log(`Transcript: ${transcript}`);
              await video.updateOne({
                _id: material_id,
                $set: { transcript: transcript }
              })


            } catch (err) {
              console.error("Error in video_created handler:", err);
            }

            console.log(`✅ Video created for module_id=${module_id}`);

          } else if (eventtype === 'note_created') {
            const { material_id, module_id, course_id } = payload;
            try {
              const { ingestNotesToRag } = await import("../utils/notesClient.js");
              await ingestNotesToRag({
                course_id: course_id,
                module_id: module_id,
                notes_id: uuidv4(),
                blob_name: azure_id
              });
            } catch (err) {
              console.error("Error in note_created handler:", err);
            }

            console.log(`✅ Note created for module_id=${module_id}`);

          } else {
            console.warn(`⚠️ Unknown event type: ${eventtype}`);
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