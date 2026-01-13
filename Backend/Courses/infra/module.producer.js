import { sendEvents } from "./client.js";

const EVENT_HUB_NAME = "module-created";

export async function produceModuleCreated(module_id, course_id) {
  console.log("Producing Module Created...");
  const eventtype = 'module_created';

  await sendEvents(EVENT_HUB_NAME, [
    {
      body: { module_id, course_id, eventtype },
      properties: { key: module_id }
    }
  ]);

  console.log(`✓ Module created event produced`);
}

// No-op for backwards compatibility
export async function connectProducer() { }
export async function disconnectProducer() { }