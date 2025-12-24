// infra/email.consumer.js
import { kafka } from "./client.js";

const consumer = kafka.consumer({ 
  groupId: "email-group",
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
    console.log("Subscribing to topic: module_created");
    await consumer.subscribe({ 
      topic: "module_created", 
      fromBeginning: true 
    });
    console.log("✓ Subscribed to topic: module_created");
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
          
          const { module_id, course_id } = JSON.parse(value);
          
          console.log(`Topic: ${topic}`);
          console.log(`Partition: ${partition}`);
          console.log(`Offset: ${message.offset}`);
          console.log(`Key: ${message.key?.toString()}`);
          console.log(`Module ID: ${module_id}`);
          console.log(`Course ID: ${course_id}`);
          
          // Call your email function here
          // import { sendEmail } from "./emailService.js";
          // await sendEmail(module_id, course_id);
          
          console.log(`✅ Email sent for module_id=${module_id}`);
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