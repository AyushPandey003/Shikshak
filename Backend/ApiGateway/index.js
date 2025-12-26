import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authProxy from "./routes/auth.js";
import materialProxy from "./routes/material.js";

import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
// app.use(express.json()); // Removed to prevent body stream consumption before proxy

// 🔹 Global middleware
app.use(authMiddleware);

// 🔓 Public routes
// 🔓 Public routes - Manual check to ensure no path stripping
app.use((req, res, next) => {
  console.log(`[GATEWAY] Request received: ${req.method} ${req.url} (originalUrl: ${req.originalUrl})`);
  if (req.url.startsWith("/authentication")) {
    console.log(`[GATEWAY] Routing to auth proxy`);
    return authProxy(req, res, next);
  }
  if (req.url.startsWith("/material")) {
    console.log(`[GATEWAY] Routing to material proxy`);
    return materialProxy(req, res, next);
  }
  console.log(`[GATEWAY] Not matching /authentication, calling next()`);
  next();
});

// Health check
app.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
