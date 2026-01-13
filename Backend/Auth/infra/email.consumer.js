const { subscribeToEvents, closeAllConsumers } = require("./client.js");
const { getCourseData, getUserAndCourseData, sendModuleNotification, sendPaymentConfirmation } = require("./emailService.js");

// Event Hub topics (must match producer topic names)
const MODULE_CREATED_HUB = "module-created";
const PAYMENT_DONE_HUB = "payment-done";

async function processEmailEvent(event, context) {
  try {
    console.log("\n📨 NEW EVENT RECEIVED:");
    console.log("─".repeat(50));

    const payload = event.body;
    const eventtype = payload.eventtype;

    console.log(`Event Hub: ${context.eventHubName}`);
    console.log(`Partition: ${context.partitionId}`);
    console.log(`Event Type: ${eventtype}`);
    console.log(`Payload:`, JSON.stringify(payload));

    if (eventtype === 'module_created') {
      const { module_id, course_id } = payload;
      console.log(`Module ID: ${module_id}`);
      console.log(`Course ID: ${course_id}`);

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
    console.error("❌ Error processing event:", error);
  }
}

async function processError(err, context) {
  console.error(`[Email Consumer] Error on partition ${context.partitionId}:`, err.message);
}

async function startConsumer() {
  try {
    console.log("🚀 Starting Email Consumer Service...");

    // Subscribe to module-created for module_created events
    await subscribeToEvents(MODULE_CREATED_HUB, processEmailEvent, processError);
    console.log(`✓ Subscribed to ${MODULE_CREATED_HUB}`);

    // Subscribe to payment-done for payment events
    await subscribeToEvents(PAYMENT_DONE_HUB, processEmailEvent, processError);
    console.log(`✓ Subscribed to ${PAYMENT_DONE_HUB}`);

    console.log("🚀 Email Consumer is running and waiting for events...");
  } catch (error) {
    console.error("❌ Fatal error starting consumer:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down email consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down email consumer gracefully...");
  await closeAllConsumers();
  process.exit(0);
});

// Auto-start when imported
startConsumer().catch((error) => {
  console.error("Failed to start email consumer:", error);
  process.exit(1);
});