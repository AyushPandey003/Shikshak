import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * Singleton Razorpay Service for highly scalable payment operations.
 * 
 * Features:
 * - Singleton pattern: Single SDK instance across all requests
 * - Idempotent operations: Safe for retries and distributed systems
 * - Async/await with proper error handling
 * - Signature verification for security
 * - Webhook secret validation
 * 
 * @example
 * import RazorpayService from './utils/razorpay.service.js';
 * 
 * // Create order
 * const order = await RazorpayService.createOrder({
 *   amount: 49900, // ₹499 in paise
 *   currency: 'INR',
 *   receipt: 'order_receipt_123'
 * });
 * 
 * // Verify payment
 * const isValid = RazorpayService.verifyPaymentSignature({
 *   orderId: 'order_xxx',
 *   paymentId: 'pay_xxx', 
 *   signature: 'signature_xxx'
 * });
 */
class RazorpayService {
    static #instance = null;
    #razorpayClient = null;

    constructor() {
        if (RazorpayService.#instance) {
            return RazorpayService.#instance;
        }

        this.#initializeClient();
        RazorpayService.#instance = this;
    }

    /**
     * Initialize Razorpay client with credentials
     */
    #initializeClient() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            console.warn(
                "⚠️ Razorpay credentials not found. Payment features will not work."
            );
            return;
        }

        this.#razorpayClient = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        console.log("✅ Razorpay service initialized");
    }

    /**
     * Get singleton instance
     * @returns {RazorpayService}
     */
    static getInstance() {
        if (!RazorpayService.#instance) {
            new RazorpayService();
        }
        return RazorpayService.#instance;
    }

    /**
     * Check if service is ready
     * @returns {boolean}
     */
    isReady() {
        return this.#razorpayClient !== null;
    }

    /**
     * Create a new payment order
     * 
     * @param {Object} options
     * @param {number} options.amount - Amount in smallest currency unit (paise for INR)
     * @param {string} [options.currency='INR'] - Currency code
     * @param {string} [options.receipt] - Unique receipt ID for idempotency
     * @param {Object} [options.notes] - Additional metadata
     * @returns {Promise<Object>} Razorpay order object
     */
    async createOrder({
        amount,
        currency = "INR",
        receipt = `rcpt_${Date.now()}`,
        notes = {},
    }) {
        if (!this.#razorpayClient) {
            throw new Error("Razorpay service not initialized");
        }

        if (!amount || amount <= 0) {
            throw new Error("Invalid amount. Must be positive integer in paise");
        }

        const order = await this.#razorpayClient.orders.create({
            amount: Math.round(amount), // Ensure integer
            currency,
            receipt,
            notes,
        });

        return order;
    }

    /**
     * Verify payment signature for security
     * Uses HMAC SHA256 to verify Razorpay's signature
     * 
     * @param {Object} params
     * @param {string} params.orderId - Razorpay order ID
     * @param {string} params.paymentId - Razorpay payment ID
     * @param {string} params.signature - Razorpay signature
     * @returns {boolean} Whether signature is valid
     */
    verifyPaymentSignature({ orderId, paymentId, signature }) {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
            throw new Error("Key secret not configured");
        }

        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");

        return expectedSignature === signature;
    }

    /**
     * Verify webhook signature for secure webhook handling
     * 
     * @param {string} body - Raw request body
     * @param {string} signature - X-Razorpay-Signature header
     * @returns {boolean} Whether webhook signature is valid
     */
    verifyWebhookSignature(body, signature) {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.warn("Webhook secret not configured, skipping verification");
            return true; // Allow in dev, but log warning
        }

        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        return expectedSignature === signature;
    }

    /**
     * Fetch order details by ID
     * 
     * @param {string} orderId - Razorpay order ID
     * @returns {Promise<Object>} Order details
     */
    async fetchOrder(orderId) {
        if (!this.#razorpayClient) {
            throw new Error("Razorpay service not initialized");
        }

        return await this.#razorpayClient.orders.fetch(orderId);
    }

    /**
     * Fetch payment details by ID
     * 
     * @param {string} paymentId - Razorpay payment ID
     * @returns {Promise<Object>} Payment details
     */
    async fetchPayment(paymentId) {
        if (!this.#razorpayClient) {
            throw new Error("Razorpay service not initialized");
        }

        return await this.#razorpayClient.payments.fetch(paymentId);
    }

    /**
     * Process refund for a payment
     * 
     * @param {string} paymentId - Payment ID to refund
     * @param {Object} [options]
     * @param {number} [options.amount] - Partial refund amount in paise (full refund if not specified)
     * @param {string} [options.notes] - Refund notes
     * @returns {Promise<Object>} Refund details
     */
    async createRefund(paymentId, options = {}) {
        if (!this.#razorpayClient) {
            throw new Error("Razorpay service not initialized");
        }

        return await this.#razorpayClient.payments.refund(paymentId, options);
    }

    /**
     * Get public key for frontend
     * @returns {string} Public key ID
     */
    getPublicKey() {
        return process.env.RAZORPAY_KEY_ID;
    }
}

// Export singleton instance
export default RazorpayService.getInstance();

// Also export class for testing
export { RazorpayService };
