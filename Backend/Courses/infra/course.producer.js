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

export async function produceCourse(course_id, eventtype) {
  await connectProducer();
  console.log("Producing Course Created...");
  await producer.send({
    topic: "module_created",
    messages: [
      {
        key: course_id,
        value: JSON.stringify({ course_id, eventtype }),
      },
    ],
  });
}

export async function disconnectCourseProducer() {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
    console.log("Producer Disconnected");
  }
}