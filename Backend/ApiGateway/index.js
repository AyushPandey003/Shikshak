import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authProxy from "./routes/auth.js";
import courseProxy from "./routes/courses.js";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// 🔹 Global middleware
app.use(authMiddleware);

// 🔓 Public routes
app.use("/auth", authProxy);

// 🔐 Protected routes
app.use("/courses", courseProxy);

// Health check
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
