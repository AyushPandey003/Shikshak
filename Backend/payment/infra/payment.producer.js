import { sendEvents } from "./client.js";

const EVENT_HUB_NAME = "payment-done";

export async function connectProducer() {
  // No-op for backwards compatibility - Event Hubs handles connections automatically
}

export async function producePaymentDone(course_id, user_id, payment_id) {
  console.log("Producing Payment Done...");
  const eventtype = 'payment_done';

  await sendEvents(EVENT_HUB_NAME, [
    {
      body: { course_id, user_id, eventtype },
      properties: { key: payment_id }
    }
  ]);

  console.log(`✓ Payment event produced for course: ${course_id}, user: ${user_id}`);
}

export async function disconnectProducer() {
  // No-op for backwards compatibility
}