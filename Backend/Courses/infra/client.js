import { EventHubProducerClient } from "@azure/event-hubs";

const connectionString = process.env.EVENTHUB_CONNECTION_STRING;

// Cache producer instances for reuse
const producers = new Map();

/**
 * Get or create a producer for the specified event hub
 * @param {string} eventHubName - Name of the event hub
 * @returns {EventHubProducerClient}
 */
export function getProducer(eventHubName) {
  if (!producers.has(eventHubName)) {
    if (!connectionString) {
      throw new Error("EVENTHUB_CONNECTION_STRING environment variable is not set");
    }
    producers.set(eventHubName, new EventHubProducerClient(connectionString, eventHubName));
  }
  return producers.get(eventHubName);
}

/**
 * Send events to an event hub
 * @param {string} eventHubName - Name of the event hub
 * @param {Array<{body: any, properties?: object}>} events - Events to send
 */
export async function sendEvents(eventHubName, events) {
  const producer = getProducer(eventHubName);
  const batch = await producer.createBatch();

  for (const event of events) {
    if (!batch.tryAdd(event)) {
      throw new Error(`Event too large to fit in batch: ${JSON.stringify(event)}`);
    }
  }

  await producer.sendBatch(batch);
  console.log(`✓ Sent ${events.length} event(s) to ${eventHubName}`);
}

/**
 * Close all producer connections
 */
export async function closeAllProducers() {
  for (const [name, producer] of producers) {
    await producer.close();
    console.log(`✓ Closed producer for ${name}`);
  }
  producers.clear();
}
