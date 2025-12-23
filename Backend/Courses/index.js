import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import paymentRoutes from "./routes/payment.js";
import connectDB from "./db/index.js";
import coursesRoutes from "./routes/courses.js";
import moduleRoutes from "./routes/modules.js";
import reviewsRoutes from "./routes/reviews.js";

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true
}));

app.use(express.json());

connectDB();

// Health check
app.get("/api/health", (req, res) => {
  console.log("[COURSES] Health check");
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
app.use("/payment", paymentRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Courses Service running on port ${PORT}`);
});
