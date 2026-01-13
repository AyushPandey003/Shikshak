import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load centralized environment configuration
dotenv.config({ path: path.resolve(__dirname, '../../.config/.env') });
import express from "express";
import cors from "cors";
import { createOrder, completePayment } from "./paymentController.js";
import { producePaymentDone, disconnectProducer } from "./infra/payment.producer.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3001", `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}`],
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  console.log("[PAYMENT] Health check");
  res.send("Payment Service running 🚀");
});

// Test payment (for development only)
app.get("/api/test-payment", async (req, res) => {
  console.log("[PAYMENT] Test payment trigger");
  const course_id = req.query.course_id || "694bb6e81164ba8bc54c4c19";
  const user_id = req.query.user_id || "6947d464c1f259e51f97b374";
  const payment_id = "test-payment-" + Date.now();

  await producePaymentDone(course_id, user_id, payment_id);
  await disconnectProducer();
  res.json({ success: true, message: "Test payment sent", course_id, user_id });
});

// ============================================================================
// PAYMENT ROUTES
// ============================================================================

// Create Razorpay order
app.post("/create-order", createOrder);

// Complete payment (verify + produce Kafka event)
app.post("/complete-payment", completePayment);

// ============================================================================
// SERVER
// ============================================================================

const PORT = process.env.PORT_PAYMENT || 4003;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
