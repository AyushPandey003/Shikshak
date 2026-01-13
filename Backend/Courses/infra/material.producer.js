import { sendEvents } from "./client.js";

const EVENT_HUB_NAME = "material-data";

export async function produceMaterialCreated(course_id, module_id, azureBlobUrl, video_id, note_id, eventtype) {
  console.log("Producing Material Created...");

  await sendEvents(EVENT_HUB_NAME, [
    {
      body: { course_id, module_id, azureBlobUrl, video_id, note_id, eventtype },
      properties: { key: video_id || note_id }
    }
  ]);

  console.log(`✓ Material event produced: ${eventtype}`);
}

// No-op for backwards compatibility
export async function connectProducer() { }
export async function disconnectMaterialProducer() { }