"use client";

import { useState, useCallback, useEffect } from "react";

/**
 * Razorpay Types
 */
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    handler: (response: RazorpaySuccessResponse) => void;
    modal?: {
        ondismiss?: () => void;
        escape?: boolean;
        animation?: boolean;
    };
}

interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
    on: (event: string, handler: () => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

/**
 * Payment status and result types
 */
export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    orderId?: string;
    signature?: string;
    error?: string;
    verified?: boolean;
    payment?: {
        id: string;
        orderId: string;
        amount: number;
        amountInRupees: number;
        currency: string;
        status: string;
        method: string;
        email?: string;
        contact?: string;
    };
}

export type PaymentStatus = "idle" | "loading" | "processing" | "success" | "error";

/**
 * Component Props
 */
export interface RazorpayPaymentProps {
    /** Amount in rupees */
    amount: number;
    /** Currency code (default: INR) */
    currency?: string;
    /** Product/service name shown in checkout */
    name: string;
    /** Description shown in checkout */
    description?: string;
    /** Company logo URL */
    logo?: string;
    /** Pre-fill customer details */
    prefill?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    /** Additional metadata */
    notes?: Record<string, string>;
    /** Theme color for checkout */
    themeColor?: string;
    /** Button text */
    buttonText?: string;
    /** Custom button className */
    buttonClassName?: string;
    /** Disable button */
    disabled?: boolean;
    /** Backend API base URL */
    apiBaseUrl?: string;
    /** Callback on successful payment */
    onSuccess?: (result: PaymentResult) => void;
    /** Callback on payment failure */
    onError?: (error: PaymentResult) => void;
    /** Callback when modal is dismissed */
    onDismiss?: () => void;
    /** Custom render for button */
    renderButton?: (props: {
        onClick: () => void;
        loading: boolean;
        disabled: boolean;
    }) => React.ReactNode;
}

/**
 * Load Razorpay checkout script
 */
const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/**
 * RazorpayPayment Component
 * 
 * A plug-and-play Razorpay payment button component.
 * 
 * @example
 * ```tsx
 * <RazorpayPayment
 *   amount={499}
 *   name="Course Purchase"
 *   description="Premium Web Development Course"
 *   prefill={{ name: "John", email: "john@example.com" }}
 *   onSuccess={(result) => console.log('Paid!', result)}
 *   onError={(error) => console.error('Failed', error)}
 * />
 * ```
 */
export default function RazorpayPayment({
    amount,
    currency = "INR",
    name,
    description,
    logo,
    prefill,
    notes,
    themeColor = "#6366f1",
    buttonText,
    buttonClassName,
    disabled = false,
    apiBaseUrl = "http://localhost:4002",
    onSuccess,
    onError,
    onDismiss,
    renderButton,
}: RazorpayPaymentProps) {
    const [status, setStatus] = useState<PaymentStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Pre-load Razorpay script
    useEffect(() => {
        loadRazorpayScript();
    }, []);

    /**
     * Create order via backend API
     */
    const createOrder = useCallback(async () => {
        const response = await fetch(`${apiBaseUrl}/payment/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency, notes }),
        });

        if (!response.ok) {
            throw new Error("Failed to create order");
        }

        return response.json();
    }, [amount, currency, notes, apiBaseUrl]);

    /**
     * Verify payment via backend API
     */
    const verifyPayment = useCallback(
        async (response: RazorpaySuccessResponse): Promise<PaymentResult> => {
            const verifyResponse = await fetch(`${apiBaseUrl}/payment/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                }),
            });

            const result = await verifyResponse.json();

            if (!verifyResponse.ok || !result.verified) {
                throw new Error(result.error || "Payment verification failed");
            }

            return {
                success: true,
                verified: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                payment: result.payment,
            };
        },
        [apiBaseUrl]
    );

    /**
     * Handle payment button click
     */
    const handlePayment = useCallback(async () => {
        try {
            setStatus("loading");
            setErrorMessage("");

            // Load Razorpay script
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                throw new Error("Failed to load Razorpay SDK");
            }

            // Create order
            const orderData = await createOrder();
            if (!orderData.success) {
                throw new Error(orderData.error || "Failed to create order");
            }

            setStatus("processing");

            // Configure Razorpay options
            const options: RazorpayOptions = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name,
                description,
                image: logo,
                order_id: orderData.order.id,
                prefill: prefill
                    ? {
                        name: prefill.name,
                        email: prefill.email,
                        contact: prefill.phone,
                    }
                    : undefined,
                notes,
                theme: { color: themeColor },
                handler: async (response) => {
                    try {
                        const result = await verifyPayment(response);
                        setStatus("success");
                        onSuccess?.(result);
                    } catch (err) {
                        const errorResult: PaymentResult = {
                            success: false,
                            error: err instanceof Error ? err.message : "Verification failed",
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                        };
                        setStatus("error");
                        setErrorMessage(errorResult.error || "Payment verification failed");
                        onError?.(errorResult);
                    }
                },
                modal: {
                    ondismiss: () => {
                        if (status === "processing") {
                            setStatus("idle");
                            onDismiss?.();
                        }
                    },
                    escape: true,
                    animation: true,
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            const errorResult: PaymentResult = {
                success: false,
                error: err instanceof Error ? err.message : "Payment failed",
            };
            setStatus("error");
            setErrorMessage(errorResult.error || "Payment failed");
            onError?.(errorResult);
        }
    }, [
        name,
        description,
        logo,
        prefill,
        notes,
        themeColor,
        createOrder,
        verifyPayment,
        onSuccess,
        onError,
        onDismiss,
        status,
    ]);

    const isLoading = status === "loading" || status === "processing";
    const defaultButtonText =
        buttonText || `Pay ₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

    // Custom render
    if (renderButton) {
        return <>{renderButton({ onClick: handlePayment, loading: isLoading, disabled })}</>;
    }

    // Default button
    return (
        <div className="razorpay-payment-wrapper">
            <button
                onClick={handlePayment}
                disabled={disabled || isLoading}
                className={buttonClassName}
                style={
                    !buttonClassName
                        ? {
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#fff",
                            backgroundColor: isLoading ? "#94a3b8" : themeColor,
                            border: "none",
                            borderRadius: "8px",
                            cursor: disabled || isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            minWidth: "160px",
                        }
                        : undefined
                }
            >
                {isLoading && (
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ animation: "spin 1s linear infinite" }}
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="32"
                            strokeDashoffset="12"
                        />
                    </svg>
                )}
                {isLoading ? "Processing..." : defaultButtonText}
            </button>

            {status === "error" && errorMessage && (
                <p style={{ color: "#ef4444", fontSize: "14px", marginTop: "8px" }}>
                    {errorMessage}
                </p>
            )}

            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
}
