// infra/delete_course.consumer.js - Azure Event Hubs version
import { subscribeToEvents, closeAllConsumers } from "./client.js";

// Event Hub topic
const COURSE_HUB = "course";

async function processDeleteCourseEvent(event, context) {
  try {
    console.log("\n📨 NEW EVENT RECEIVED:");
    console.log("─".repeat(50));

    const payload = event.body;
    const eventtype = payload.eventtype;

    console.log(`Event Hub: ${context.eventHubName}`);
    console.log(`Partition: ${context.partitionId}`);
    console.log(`Event Type: ${eventtype}`);

    if (eventtype === 'course_deleted') {
      const { course_id } = payload;
      console.log(`Course ID: ${course_id}`);

      // TODO: delete course id from user schema

      console.log(`✅ Course deleted event processed for course_id=${course_id}`);
    } else {
      console.warn(`⚠️ Unknown event type: ${eventtype}`);
    }

    console.log("─".repeat(50));
  } catch (error) {
    console.error("❌ Error processing event:", error);
  }
}

async function processError(err, context) {
  console.error(`[Delete Course Consumer] Error on partition ${context.partitionId}:`, err.message);
}

async function startConsumer() {
  try {
    console.log("🚀 Starting Delete Course Consumer Service...");

    await subscribeToEvents(COURSE_HUB, processDeleteCourseEvent, processError);
    console.log(`✓ Subscribed to ${COURSE_HUB}`);

    console.log("🚀 Delete Course Consumer is running and waiting for events...");
  } catch (error) {
    console.error("❌ Fatal error starting consumer:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down delete course consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down delete course consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

// Auto-start when imported
startConsumer().catch((error) => {
  console.error("Failed to start delete course consumer:", error);
  process.exit(1);
});