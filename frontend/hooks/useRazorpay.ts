// hooks/useRazorpay.ts
// Custom hook for Razorpay payment integration

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';
import { API_CONFIG } from '@/lib/api-config';

const API_BASE = API_CONFIG.baseUrl;

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentOptions {
    courseId: string;
    courseName?: string;
    amount?: number;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export function useRazorpay() {
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const { user, profile } = useAppStore();

    // Load Razorpay script
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => console.error('Failed to load Razorpay script');
            document.body.appendChild(script);
        } else if (window.Razorpay) {
            setScriptLoaded(true);
        }
    }, []);

    const initiatePayment = useCallback(async ({
        courseId,
        courseName,
        onSuccess,
        onError
    }: PaymentOptions) => {
        if (!user?.id) {
            onError?.({ message: 'Please login to purchase this course' });
            return;
        }

        if (!scriptLoaded) {
            onError?.({ message: 'Payment system is loading. Please try again.' });
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create order
            const orderResponse = await axios.post(
                `${API_BASE}/payment/create-order`,
                {
                    course_id: courseId,
                    user_id: user.id,
                    user_name: user.name || profile?.name || 'Student',
                    user_email: user.email || ''
                },
                { withCredentials: true }
            );

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.error || 'Failed to create order');
            }

            const { order_id, amount, key, course_name, user_name, user_email, notes } = orderResponse.data;

            // Step 2: Open Razorpay checkout
            const options = {
                key,
                amount,
                currency: 'INR',
                name: 'Shikshak',
                description: course_name || courseName || 'Course Enrollment',
                order_id,
                handler: async function (response: RazorpayResponse) {
                    try {
                        // Step 3: Verify payment
                        const verifyResponse = await axios.post(
                            `${API_BASE}/payment/complete-payment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                course_id: notes.course_id,
                                user_id: notes.user_id
                            },
                            { withCredentials: true }
                        );

                        if (verifyResponse.data.success) {
                            onSuccess?.({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                courseId: notes.course_id
                            });
                        } else {
                            throw new Error(verifyResponse.data.error || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment verification error:', error);
                        onError?.({ message: error.message || 'Payment verification failed' });
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user_name,
                    email: user_email,
                },
                notes: {
                    course_id: notes.course_id,
                    user_id: notes.user_id
                },
                theme: {
                    color: '#4f46e5' // Indigo theme to match UI
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        console.log('Payment modal dismissed');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                onError?.({
                    message: response.error.description || 'Payment failed',
                    code: response.error.code
                });
                setLoading(false);
            });

            razorpay.open();

        } catch (error: any) {
            console.error('Payment initiation error:', error);
            onError?.({ message: error.response?.data?.error || error.message || 'Failed to initiate payment' });
            setLoading(false);
        }
    }, [user, profile, scriptLoaded]);

    return {
        initiatePayment,
        loading,
        scriptLoaded,
        isLoggedIn: !!user?.id
    };
}
