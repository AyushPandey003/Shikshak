import { sendEvents } from "./client.js";

const EVENT_HUB_NAME = "course";

export async function produceCourse(course_id, eventtype) {
  console.log("Producing Course Event...");

  await sendEvents(EVENT_HUB_NAME, [
    {
      body: { course_id, eventtype },
      properties: { key: course_id }
    }
  ]);

  console.log(`✓ Course event produced: ${eventtype}`);
}

// No-op for backwards compatibility (Event Hubs handles connections automatically)
export async function connectProducer() { }
export async function disconnectCourseProducer() { }