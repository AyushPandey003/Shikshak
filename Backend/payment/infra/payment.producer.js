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

export async function producePaymentDone(course_id, user_id, payment_id) {
  await connectProducer();
  console.log("Producing Payment Done...");
  const eventtype = 'payment_done';
  await producer.send({
    topic: "payment_done",
    messages: [
      {
        key: payment_id,
        value: JSON.stringify({ course_id, user_id, eventtype }),
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