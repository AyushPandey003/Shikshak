// infra/client.js - Azure Event Hubs Consumer Client
import { EventHubConsumerClient } from "@azure/event-hubs";

const connectionString = process.env.EVENTHUB_CONNECTION_STRING;

// Cache consumer instances
const consumers = new Map();

/**
 * Create or get a consumer for the specified event hub
 * @param {string} eventHubName - Name of the event hub (topic)
 * @param {string} consumerGroup - Consumer group (default: "$Default")
 * @returns {EventHubConsumerClient}
 */
export function getConsumer(eventHubName, consumerGroup = "$Default") {
  const key = `${eventHubName}:${consumerGroup}`;
  if (!consumers.has(key)) {
    if (!connectionString) {
      throw new Error("EVENTHUB_CONNECTION_STRING environment variable is not set");
    }
    consumers.set(key, new EventHubConsumerClient(consumerGroup, connectionString, eventHubName));
  }
  return consumers.get(key);
}

/**
 * Subscribe to events from an event hub
 * @param {string} eventHubName - Name of the event hub
 * @param {function} processEvent - Handler: async (event, context) => void
 * @param {function} processError - Error handler: async (err, context) => void
 * @param {string} consumerGroup - Consumer group (default: "$Default")
 */
export async function subscribeToEvents(eventHubName, processEvent, processError, consumerGroup = "$Default") {
  const consumer = getConsumer(eventHubName, consumerGroup);

  console.log(`✓ Subscribing to Event Hub: ${eventHubName} (group: ${consumerGroup})`);

  consumer.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        await processEvent(event, context);
      }
    },
    processError: processError || (async (err, context) => {
      console.error(`[${eventHubName}] Error:`, err.message);
    }),
  });
}

/**
 * Close all consumer connections
 */
export async function closeAllConsumers() {
  for (const [name, consumer] of consumers) {
    await consumer.close();
    console.log(`✓ Closed consumer for ${name}`);
  }
  consumers.clear();
}
