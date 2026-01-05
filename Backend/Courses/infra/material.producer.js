import { kafka } from "./client.js";

const producer = kafka.producer();
let isConnected = false;
let connectionPromise = null;

export async function connectProducer() {
  if (isConnected) return;

  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  connectionPromise = (async () => {
    console.log("Connecting Producer...");
    await producer.connect();
    isConnected = true;
    console.log("Producer Connected Successfully");
  })();

  await connectionPromise;
  connectionPromise = null;
}

export async function produceMaterialCreated(course_id, module_id, azureBlobUrl, video_id, note_id, eventtype) {
  await connectProducer();
  console.log("Producing Material Created...");
  await producer.send({
    topic: "materail_data",
    messages: [
      {
        key: video_id,
        value: JSON.stringify({ course_id, module_id, azureBlobUrl, video_id, note_id, eventtype }),
      },
    ],
  });
}

export async function disconnectMaterialProducer() {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("Producer Disconnected");
  }
}