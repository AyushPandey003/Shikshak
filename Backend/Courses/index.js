import express from "express";
import uploadRoutes from "./routes/upload.js";
import connectDB from "./db/index.js";
import coursesRoutes from "./routes/courses.js";
import moduleRoutes from "./routes/modules.js";
import reviewsRoutes from "./routes/reviews.js";
import { produceMaterialCreated } from "./infra/material.producer.js";
import { disconnectMaterialProducer } from "./infra/material.producer.js";
import "./infra/startConsumer.js";

const app = express();

app.use(express.json());

connectDB();

// Health check
app.get("/api/health", async (req, res) => {
  console.log("[COURSES] Health check");
  await produceMaterialCreated("1", "1", 'video_created');
  await disconnectMaterialProducer();
  res.send("Courses Service running 🚀");
});

// Courses routes
app.use("/api/courses", coursesRoutes);

// Upload routes
app.use("/api/upload", uploadRoutes);

// module routes
app.use("/api/module", moduleRoutes);

// reviews routes
app.use("/api/reviews", reviewsRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Courses Service running on port ${PORT}`);
});
