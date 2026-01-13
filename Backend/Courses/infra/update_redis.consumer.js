// infra/update_redis.consumer.js - Azure Event Hubs version
import { subscribeToEvents, closeAllConsumers } from "./client.js";
import { redis } from "./redis/redis.js";

// Event Hub topic
const COURSE_HUB = "course";

async function processRedisUpdateEvent(event, context) {
  try {
    console.log("\n📨 NEW EVENT RECEIVED:");
    console.log("─".repeat(50));

    const payload = event.body;
    const eventtype = payload.eventtype;

    console.log(`Event Hub: ${context.eventHubName}`);
    console.log(`Partition: ${context.partitionId}`);
    console.log(`Event Type: ${eventtype}`);

    if (eventtype === 'course_created') {
      const { course_id } = payload;
      console.log(`Course ID: ${course_id}`);

      await redis.del("courses:all");

      console.log(`✅ Redis cache invalidated for course_created (course_id=${course_id})`);

    } else if (eventtype === 'course_updated') {
      const { course_id } = payload;
      console.log(`Course ID: ${course_id}`);

      await redis.del("courses:all");

      console.log(`✅ Redis cache invalidated for course_updated (course_id=${course_id})`);

    } else if (eventtype === 'course_deleted') {
      const { course_id } = payload;
      console.log(`Course ID: ${course_id}`);

      await redis.del("courses:all");

      console.log(`✅ Redis cache invalidated for course_deleted (course_id=${course_id})`);

    } else {
      console.warn(`⚠️ Unknown event type: ${eventtype}`);
    }

    console.log("─".repeat(50));
  } catch (error) {
    console.error("❌ Error processing event:", error);
  }
}

async function processError(err, context) {
  console.error(`[Redis Update Consumer] Error on partition ${context.partitionId}:`, err.message);
}

async function startConsumer() {
  try {
    console.log("🚀 Starting Redis Update Consumer Service...");

    await subscribeToEvents(COURSE_HUB, processRedisUpdateEvent, processError);
    console.log(`✓ Subscribed to ${COURSE_HUB}`);

    console.log("🚀 Redis Update Consumer is running and waiting for events...");
  } catch (error) {
    console.error("❌ Fatal error starting consumer:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down redis update consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down redis update consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

// Auto-start when imported
startConsumer().catch((error) => {
  console.error("Failed to start redis update consumer:", error);
  process.exit(1);
});