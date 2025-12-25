import express from "express";
import { producePaymentDone, disconnectProducer } from "./infra/payment.producer.js";

const app = express();

app.use(express.json());

// Health check
app.get("/api/health", async (req, res) => {
  console.log("[PAYMENT] Health check");
  await producePaymentDone("1", "1", "1");
  await disconnectProducer();
  res.send("Payment Service running 🚀");
});


const PORT = 4003;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
