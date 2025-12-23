import express from "express";
import RazorpayService from "../utils/razorpay.service.js";

const router = express.Router();

/**
 * Razorpay Payment Routes
 * 
 * Plug-and-play payment integration with:
 * - Order creation
 * - Payment verification  
 * - Webhook handling
 * 
 * Required ENV variables:
 * - RAZORPAY_KEY_ID
 * - RAZORPAY_KEY_SECRET
 * - RAZORPAY_WEBHOOK_SECRET (optional, for webhooks)
 */

/**
 * @route   GET /payment/health
 * @desc    Health check for payment service
 * @access  Public
 */
router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "razorpay-payments",
        ready: RazorpayService.isReady(),
        timestamp: new Date().toISOString(),
    });
});

/**
 * @route   GET /payment/config
 * @desc    Get public Razorpay config for frontend
 * @access  Public
 */
router.get("/config", (req, res) => {
    const keyId = RazorpayService.getPublicKey();

    if (!keyId) {
        return res.status(503).json({
            success: false,
            error: "Payment service not configured",
        });
    }

    res.json({
        success: true,
        keyId,
        currency: "INR",
    });
});

/**
 * @route   POST /payment/create-order
 * @desc    Create a new Razorpay order
 * @access  Public (add auth middleware in production)
 * @body    { amount: number (in rupees), currency?: string, receipt?: string, notes?: object }
 */
router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency = "INR", receipt, notes = {} } = req.body;

        // Validation
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid amount. Provide positive number in rupees.",
            });
        }

        // Convert rupees to paise (smallest unit)
        const amountInPaise = Math.round(amount * 100);

        // Create order with idempotent receipt
        const order = await RazorpayService.createOrder({
            amount: amountInPaise,
            currency,
            receipt: receipt || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            notes,
        });

        res.status(201).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                amountInRupees: order.amount / 100,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status,
            },
            keyId: RazorpayService.getPublicKey(),
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to create order",
        });
    }
});

/**
 * @route   POST /payment/verify
 * @desc    Verify payment signature after successful payment
 * @access  Public (add auth middleware in production)
 * @body    { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Validation
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: "Missing required payment verification fields",
            });
        }

        // Verify signature
        const isValid = RazorpayService.verifyPaymentSignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: "Invalid payment signature",
                verified: false,
            });
        }

        // Optionally fetch payment details for confirmation
        const payment = await RazorpayService.fetchPayment(razorpay_payment_id);

        res.json({
            success: true,
            verified: true,
            payment: {
                id: payment.id,
                orderId: payment.order_id,
                amount: payment.amount,
                amountInRupees: payment.amount / 100,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                email: payment.email,
                contact: payment.contact,
                createdAt: new Date(payment.created_at * 1000).toISOString(),
            },
        });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Payment verification failed",
        });
    }
});

/**
 * @route   POST /payment/webhook
 * @desc    Handle Razorpay webhooks for async payment events
 * @access  Razorpay servers only (validated by signature)
 */
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
        const signature = req.headers["x-razorpay-signature"];
        const body = req.body.toString();

        // Verify webhook signature
        const isValid = RazorpayService.verifyWebhookSignature(body, signature);

        if (!isValid) {
            console.warn("Invalid webhook signature received");
            return res.status(400).json({ error: "Invalid signature" });
        }

        const event = JSON.parse(body);
        const { event: eventType, payload } = event;

        console.log(`📥 Webhook received: ${eventType}`);

        // Handle different event types
        switch (eventType) {
            case "payment.captured":
                // Payment successful - fulfill order
                console.log("✅ Payment captured:", payload.payment.entity.id);
                // TODO: Add your business logic here
                // e.g., update order status, send confirmation email
                break;

            case "payment.failed":
                // Payment failed
                console.log("❌ Payment failed:", payload.payment.entity.id);
                // TODO: Handle failed payment
                break;

            case "refund.created":
                // Refund initiated
                console.log("💸 Refund created:", payload.refund.entity.id);
                break;

            case "order.paid":
                // Order fully paid
                console.log("✅ Order paid:", payload.order.entity.id);
                break;

            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        // Always respond 200 to acknowledge receipt
        res.json({ received: true, event: eventType });
    } catch (error) {
        console.error("Webhook processing error:", error);
        // Still return 200 to prevent retries for processing errors
        res.status(200).json({ received: true, error: "Processing error" });
    }
});

/**
 * @route   POST /payment/refund
 * @desc    Initiate a refund for a payment
 * @access  Private (add auth middleware)
 * @body    { paymentId: string, amount?: number (optional, for partial refund in rupees) }
 */
router.post("/refund", async (req, res) => {
    try {
        const { paymentId, amount, notes } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                error: "Payment ID is required",
            });
        }

        const refundOptions = {};
        if (amount) {
            refundOptions.amount = Math.round(amount * 100); // Convert to paise
        }
        if (notes) {
            refundOptions.notes = notes;
        }

        const refund = await RazorpayService.createRefund(paymentId, refundOptions);

        res.json({
            success: true,
            refund: {
                id: refund.id,
                paymentId: refund.payment_id,
                amount: refund.amount,
                amountInRupees: refund.amount / 100,
                status: refund.status,
                createdAt: new Date(refund.created_at * 1000).toISOString(),
            },
        });
    } catch (error) {
        console.error("Refund error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Refund failed",
        });
    }
});

/**
 * @route   GET /payment/order/:orderId
 * @desc    Get order details
 * @access  Public
 */
router.get("/order/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await RazorpayService.fetchOrder(orderId);

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                amountInRupees: order.amount / 100,
                currency: order.currency,
                receipt: order.receipt,
                status: order.status,
                attempts: order.attempts,
                createdAt: new Date(order.created_at * 1000).toISOString(),
            },
        });
    } catch (error) {
        console.error("Fetch order error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch order",
        });
    }
});

export default router;
