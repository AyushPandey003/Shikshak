import express from "express";
import authRoutes from "./routes/courses.js";

const app = express();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Courses Service running 🚀");
});

// Courses routes
app.use("/", authRoutes);

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`Courses Service running on port ${PORT}`);
});
