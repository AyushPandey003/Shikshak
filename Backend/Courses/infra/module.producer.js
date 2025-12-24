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

export async function produceModuleCreated(module_id, course_id) {
  await connectProducer();
  console.log("Producing Module Created...");
  await producer.send({
    topic: "module_created",
    messages: [
      {
        key: module_id,
        value: JSON.stringify({ module_id, course_id }),
      },
    ],
  });
}

export async function disconnectProducer() {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("Producer Disconnected");
  }
}