import { EventHubProducerClient, EventHubConsumerClient } from "@azure/event-hubs";

const connectionString = process.env.EVENTHUB_CONNECTION_STRING;

// Cache producer instances for reuse
const producers = new Map();
// Track active subscriptions for cleanup
const activeSubscriptions = [];

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
 * Subscribe to events from an event hub
 * Creates a new consumer instance for each subscription to avoid conflicts
 * @param {string} eventHubName - Name of the event hub
 * @param {function} processEvent - Handler: async (event, context) => void
 * @param {function} processError - Error handler: async (err, context) => void
 * @param {string} consumerGroup - Consumer group (default: "$Default")
 */
export async function subscribeToEvents(eventHubName, processEvent, processError, consumerGroup = "$Default") {
  if (!connectionString) {
    throw new Error("EVENTHUB_CONNECTION_STRING environment variable is not set");
  }

  // Create a NEW consumer for each subscription to avoid partition conflicts
  const consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

  console.log(`✓ Subscribing to Event Hub: ${eventHubName} (group: ${consumerGroup})`);

  const subscription = consumer.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        await processEvent(event, context);
      }
    },
    processError: processError || (async (err, context) => {
      console.error(`[${eventHubName}] Error:`, err.message);
    }),
  });

  activeSubscriptions.push({ consumer, subscription, eventHubName });
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

/**
 * Close all consumer connections
 */
export async function closeAllConsumers() {
  for (const { consumer, eventHubName } of activeSubscriptions) {
    await consumer.close();
    console.log(`✓ Closed consumer for ${eventHubName}`);
  }
  activeSubscriptions.length = 0;
}
