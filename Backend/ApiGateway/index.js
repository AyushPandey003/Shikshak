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
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile api or curl requests), or localhost:3001
    const allowedOrigins = ["http://localhost:3001", "null"];
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("file://")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
  console.log(`[GATEWAY] Not matching /authentication, calling next()`);
  next();
});

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
