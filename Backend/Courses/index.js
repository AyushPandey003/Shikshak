import express from "express";
import authRoutes from "./routes/courses.js";
import uploadRoutes from "./routes/upload.js";
import connectDB from "./db/index.js";
const app = express();

app.use(express.json());

connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("Courses Service running 🚀");
});

// Courses routes
app.use("/", authRoutes);
app.use("/upload", uploadRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Courses Service running on port ${PORT}`);
});
