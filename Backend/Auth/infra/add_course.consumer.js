// infra/add_course.consumer.js
// Handles payment_done events - adds user to course

import { kafka } from "./client.js";
import mongoose from "mongoose";

const consumer = kafka.consumer({
  groupId: "add_course-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

// MongoDB connection for updating courses
let mongoConnection = null;

async function getMongoConnection() {
  if (mongoConnection?.readyState === 1) {
    return mongoConnection;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI not configured');
  }

  mongoConnection = mongoose.createConnection(mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  await new Promise((resolve, reject) => {
    mongoConnection.once('open', resolve);
    mongoConnection.once('error', reject);
  });

  console.log('[AddCourse] MongoDB connected');
  return mongoConnection;
}

async function connectConsumer() {
  try {
    console.log("Connecting Consumer...");
    console.log("Broker: localhost:9092");
    await consumer.connect();
    console.log("✓ Consumer Connected Successfully");
  } catch (error) {
    console.error("❌ Failed to connect consumer:", error.message);
    throw error;
  }
}

async function subscribeToTopics() {
  try {
    console.log("Subscribing to topics: payment_done");
    await consumer.subscribe({
      topics: ["payment_done"],
      fromBeginning: false
    });
    console.log("✓ Subscribed to topics: payment_done");
  } catch (error) {
    console.error("❌ Failed to subscribe:", error.message);
    throw error;
  }
}

async function addUserToCourse(course_id, user_id) {
  try {
    const connection = await getMongoConnection();

    // Define schemas
    const courseSchema = new mongoose.Schema({
      students_id: [{
        id: String,
        name: String,
        email: String,
      }],
      student_count: Number,
      total_earned: Number,
      price: Number,
    });

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      courses: [String],
    }, { collection: 'user' });

    const Course = connection.models.Course || connection.model("Course", courseSchema);
    const User = connection.models.User || connection.model("User", userSchema);

    // Fetch user details
    const user = await User.findById(user_id).lean();
    if (!user) {
      console.error(`[AddCourse] User not found: ${user_id}`);
      return false;
    }

    // Check if user already enrolled
    const course = await Course.findById(course_id).lean();
    if (!course) {
      console.error(`[AddCourse] Course not found: ${course_id}`);
      return false;
    }

    const alreadyEnrolled = course.students_id?.some(s => s.id === user_id);
    if (alreadyEnrolled) {
      console.log(`[AddCourse] User ${user_id} already enrolled in course ${course_id}`);
      return true;
    }

    // Add user to course
    await Course.findByIdAndUpdate(course_id, {
      $push: {
        students_id: {
          id: user_id,
          name: user.name,
          email: user.email,
        }
      },
      $inc: {
        student_count: 1,
        total_earned: course.price || 0
      }
    });

    // Add course to user
    await User.findByIdAndUpdate(user_id, {
      $addToSet: { courses: course_id }
    });

    console.log(`[AddCourse] ✅ User ${user.name} (${user_id}) added to course ${course_id}`);
    return true;

  } catch (error) {
    console.error(`[AddCourse] Error adding user to course:`, error.message);
    return false;
  }
}

async function startConsumer() {
  try {
    await connectConsumer();
    await subscribeToTopics();

    console.log("🚀 Consumer is running and waiting for messages...");
    console.log("Press CTRL+C to stop\n");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log("\n📨 NEW MESSAGE RECEIVED:");
          console.log("─".repeat(50));

          const value = message.value.toString();
          console.log("Raw message:", value);

          const payload = JSON.parse(value);
          const { eventtype } = payload;

          console.log(`Topic: ${topic}`);
          console.log(`Partition: ${partition}`);
          console.log(`Offset: ${message.offset}`);
          console.log(`Key: ${message.key?.toString()}`);
          console.log(`Event Type: ${eventtype}`);

          if (eventtype === 'payment_done') {
            const { course_id, user_id } = payload;
            console.log(`Course ID: ${course_id}`);
            console.log(`User ID: ${user_id}`);

            const success = await addUserToCourse(course_id, user_id);

            if (success) {
              console.log(`✅ Course enrollment completed for user_id=${user_id}`);
            } else {
              console.error(`❌ Failed to enroll user_id=${user_id}`);
            }

          } else {
            console.warn(`⚠️ Unknown event type: ${eventtype}`);
          }

          console.log("─".repeat(50));
        } catch (error) {
          console.error("❌ Error processing message:", error);
          console.error("Message value:", message.value.toString());
        }
      },
    });
  } catch (error) {
    console.error("❌ Fatal error in consumer:", error);
    process.exit(1);
  }
}

async function disconnectConsumer() {
  try {
    await consumer.disconnect();
    if (mongoConnection) {
      await mongoConnection.close();
    }
    console.log("✓ Consumer Disconnected");
  } catch (error) {
    console.error("Error disconnecting consumer:", error);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\nShutting down consumer gracefully...");
  await disconnectConsumer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\nShutting down consumer gracefully...");
  await disconnectConsumer();
  process.exit(0);
});

// Auto-start when this file is imported
startConsumer().catch((error) => {
  console.error("Failed to start consumer:", error);
  process.exit(1);
});