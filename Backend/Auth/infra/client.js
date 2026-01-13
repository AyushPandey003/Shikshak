// infra/client.js - Azure Event Hubs Consumer Client
const { EventHubConsumerClient } = require("@azure/event-hubs");

const connectionString = process.env.EVENTHUB_CONNECTION_STRING;

// Track active subscriptions for cleanup
const activeSubscriptions = [];

/**
 * Subscribe to events from an event hub
 * Creates a new consumer instance for each subscription to avoid conflicts
 * @param {string} eventHubName - Name of the event hub
 * @param {function} processEvent - Handler: async (event, context) => void
 * @param {function} processError - Error handler: async (err, context) => void
 * @param {string} consumerGroup - Consumer group (default: "$Default")
 */
async function subscribeToEvents(eventHubName, processEvent, processError, consumerGroup = "$Default") {
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
 * Close all consumer connections
 */
async function closeAllConsumers() {
  for (const { consumer, eventHubName } of activeSubscriptions) {
    await consumer.close();
    console.log(`✓ Closed consumer for ${eventHubName}`);
  }
  activeSubscriptions.length = 0;
}
