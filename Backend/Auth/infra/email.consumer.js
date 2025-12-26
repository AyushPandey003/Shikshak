// infra/email.consumer.js
import { kafka } from "./client.js";
import { getCourseData, getUserAndCourseData, sendModuleNotification, sendPaymentConfirmation } from "./emailService.js";

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
    console.log("Subscribing to topics: module_created, payment_done");
    await consumer.subscribe({
      topics: ["module_created", "payment_done"],
      fromBeginning: false
    });
    console.log("✓ Subscribed to topics: module_created, payment_done");
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


          if (eventtype === 'module_created') {
            const { module_id, course_id } = payload;
            console.log(`Module ID: ${module_id}`);
            console.log(`Course ID: ${course_id}`);

            // Fetch data
            const data = await getCourseData(module_id);
            if (data) {
              const { students, module, course } = data;
              if (students && students.length > 0) {
                await sendModuleNotification(students, module, course);
                console.log(`✅ Email sent for module_id=${module_id} to ${students.length} students`);
              } else {
                console.log(`ℹ️ No students to notify for module_id=${module_id}`);
              }
            } else {
              console.warn(`⚠️ Could not fetch data for module_id=${module_id}`);
            }

          } else if (eventtype === 'payment_done') {
            const { course_id, user_id } = payload;
            console.log(`Course ID: ${course_id}`);
            console.log(`User ID: ${user_id}`);

            // Fetch data
            const data = await getUserAndCourseData(user_id, course_id);
            if (data) {
              const { user, course } = data;
              await sendPaymentConfirmation(user, course);
              console.log(`✅ Payment email processed for user_id=${user_id}`);
            } else {
              console.warn(`⚠️ Could not fetch data for payment: user_id=${user_id}, course_id=${course_id}`);
            }

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