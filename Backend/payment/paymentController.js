// paymentController.js
// Industry-grade Razorpay payment controller

import Razorpay from 'razorpay';
import crypto from 'crypto';

// ============================================================================
// CONFIGURATION (Lazy initialization to ensure env is loaded)
// ============================================================================

let razorpayInstance = null;

function getRazorpay() {
    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
}

const COURSES_SERVICE_URL = process.env.COURSES_SERVICE_URL || 'http://localhost:4002';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const MONGODB_ID_REGEX = /^[a-fA-F0-9]{24}$/;

function isValidMongoId(id) {
    return typeof id === 'string' && MONGODB_ID_REGEX.test(id);
}

function validateEnv() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
    }
}

// ============================================================================
// CREATE ORDER
// ============================================================================

export async function createOrder(req, res) {
    try {
        const { course_id, user_id, user_name, user_email } = req.body;

        // Validate inputs
        if (!isValidMongoId(course_id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid course_id format'
            });
        }
        if (!isValidMongoId(user_id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user_id format'
            });
        }

        // Fetch course details from Courses service
        const courseResponse = await fetch(`${COURSES_SERVICE_URL}/api/courses/get_course_by_id_general`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_id })
        });

        if (!courseResponse.ok) {
            console.error('[Payment] Failed to fetch course:', courseResponse.status);
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        const course = await courseResponse.json();

        if (!course.price || course.price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Course is free or has invalid price'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(course.price * 100), // Razorpay expects paise
            currency: 'INR',
            receipt: `rcpt_${course_id.slice(-8)}_${Date.now().toString(36)}`,
            notes: {
                course_id,
                user_id,
                course_name: course.name,
                user_email
            }
        };

        const order = await getRazorpay().orders.create(options);

        console.log(`[Payment] Order created: ${order.id} for course: ${course.name}`);

        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
            course_name: course.name,
            user_name,
            user_email,
            notes: {
                course_id,
                user_id
            }
        });

    } catch (error) {
        console.error('[Payment] Create order error:', error);
        console.error('[Payment] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        res.status(500).json({
            success: false,
            error: error?.message || 'Failed to create order'
        });
    }
}

// ============================================================================
// VERIFY PAYMENT
// ============================================================================

export async function verifyPayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            course_id,
            user_id
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: 'Missing payment verification parameters'
            });
        }

        if (!isValidMongoId(course_id) || !isValidMongoId(user_id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid course_id or user_id'
            });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('[Payment] Signature verification failed');
            return res.status(400).json({
                success: false,
                error: 'Payment verification failed'
            });
        }

        console.log(`[Payment] Payment verified: ${razorpay_payment_id} for order: ${razorpay_order_id}`);

        // Return success - the producer will be called separately
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            course_id,
            user_id
        });

    } catch (error) {
        console.error('[Payment] Verify payment error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Payment verification failed'
        });
    }
}

// ============================================================================
// COMPLETE PAYMENT (Verify + Produce Kafka Event)
// ============================================================================

import { producePaymentDone, disconnectProducer } from './infra/payment.producer.js';

export async function completePayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            course_id,
            user_id
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                error: 'Missing payment verification parameters'
            });
        }

        if (!isValidMongoId(course_id) || !isValidMongoId(user_id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid course_id or user_id'
            });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('[Payment] Signature verification failed');
            return res.status(400).json({
                success: false,
                error: 'Payment verification failed'
            });
        }

        console.log(`[Payment] Payment verified: ${razorpay_payment_id}`);

        // Produce Kafka event for payment_done
        await producePaymentDone(course_id, user_id, razorpay_payment_id);
        await disconnectProducer();

        console.log(`[Payment] Kafka event produced for course: ${course_id}, user: ${user_id}`);

        res.status(200).json({
            success: true,
            message: 'Payment completed successfully',
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id
        });

    } catch (error) {
        console.error('[Payment] Complete payment error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to complete payment'
        });
    }
}

