"use client";

import { useState } from "react";
import RazorpayPayment, { PaymentResult } from "@/components/RazorpayPayment";

/**
 * Payment Demo Page
 * 
 * Showcases the RazorpayPayment component usage with different configurations.
 * This is meant to demonstrate how to integrate the payment component.
 */
export default function PaymentDemoPage() {
    const [paymentResults, setPaymentResults] = useState<PaymentResult[]>([]);

    const handleSuccess = (result: PaymentResult) => {
        console.log("Payment Success:", result);
        setPaymentResults((prev) => [result, ...prev]);
    };

    const handleError = (error: PaymentResult) => {
        console.error("Payment Error:", error);
        setPaymentResults((prev) => [error, ...prev]);
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Header */}
                <header style={styles.header}>
                    <h1 style={styles.title}>💳 Razorpay Payment Demo</h1>
                    <p style={styles.subtitle}>
                        Test the payment integration with different configurations
                    </p>
                </header>

                {/* Payment Options */}
                <div style={styles.grid}>
                    {/* Basic Usage */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Basic Usage</h2>
                        <p style={styles.cardDesc}>Simple payment button with minimal config</p>
                        <div style={styles.codeBlock}>
                            <code>{`<RazorpayPayment
  amount={499}
  name="Course Purchase"
  onSuccess={handleSuccess}
/>`}</code>
                        </div>
                        <div style={styles.buttonWrapper}>
                            <RazorpayPayment
                                amount={499}
                                name="Course Purchase"
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        </div>
                    </div>

                    {/* With Prefill */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>With Customer Details</h2>
                        <p style={styles.cardDesc}>Pre-filled customer information</p>
                        <div style={styles.codeBlock}>
                            <code>{`<RazorpayPayment
  amount={1999}
  name="Premium Plan"
  description="Annual subscription"
  prefill={{
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210"
  }}
  themeColor="#10b981"
/>`}</code>
                        </div>
                        <div style={styles.buttonWrapper}>
                            <RazorpayPayment
                                amount={1999}
                                name="Premium Plan"
                                description="Annual subscription"
                                prefill={{
                                    name: "John Doe",
                                    email: "john@example.com",
                                    phone: "9876543210",
                                }}
                                themeColor="#10b981"
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />
                        </div>
                    </div>

                    {/* Custom Button */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>Custom Button Render</h2>
                        <p style={styles.cardDesc}>Use your own button component</p>
                        <div style={styles.codeBlock}>
                            <code>{`<RazorpayPayment
  amount={2499}
  name="Enterprise"
  renderButton={({ onClick, loading }) => (
    <button onClick={onClick}>
      {loading ? "..." : "Custom Pay"}
    </button>
  )}
/>`}</code>
                        </div>
                        <div style={styles.buttonWrapper}>
                            <RazorpayPayment
                                amount={2499}
                                name="Enterprise Plan"
                                description="Custom styled payment"
                                themeColor="#8b5cf6"
                                onSuccess={handleSuccess}
                                onError={handleError}
                                renderButton={({ onClick, loading, disabled }) => (
                                    <button
                                        onClick={onClick}
                                        disabled={disabled || loading}
                                        style={{
                                            padding: "14px 28px",
                                            background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "12px",
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            cursor: loading ? "wait" : "pointer",
                                            boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                                            transition: "transform 0.2s",
                                        }}
                                    >
                                        {loading ? "⏳ Processing..." : "🚀 Upgrade to Enterprise - ₹2,499"}
                                    </button>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Results */}
                {paymentResults.length > 0 && (
                    <div style={styles.resultsSection}>
                        <h2 style={styles.resultsTitle}>Payment Results</h2>
                        <div style={styles.resultsList}>
                            {paymentResults.map((result, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.resultCard,
                                        borderColor: result.success ? "#10b981" : "#ef4444",
                                        backgroundColor: result.success
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(239, 68, 68, 0.1)",
                                    }}
                                >
                                    <div style={styles.resultHeader}>
                                        <span style={{ fontSize: "24px" }}>
                                            {result.success ? "✅" : "❌"}
                                        </span>
                                        <span
                                            style={{
                                                fontWeight: 600,
                                                color: result.success ? "#10b981" : "#ef4444",
                                            }}
                                        >
                                            {result.success ? "Payment Successful" : "Payment Failed"}
                                        </span>
                                    </div>
                                    <pre style={styles.resultJson}>
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Usage Instructions */}
                <div style={styles.instructions}>
                    <h2 style={styles.instructionsTitle}>📋 Quick Setup</h2>
                    <ol style={styles.instructionsList}>
                        <li>
                            <strong>Add environment variables:</strong>
                            <code style={styles.envCode}>
                                RAZORPAY_KEY_ID=your_key_id{"\n"}
                                RAZORPAY_KEY_SECRET=your_key_secret
                            </code>
                        </li>
                        <li>
                            <strong>Import the component:</strong>
                            <code style={styles.envCode}>
                                {`import RazorpayPayment from '@/components/RazorpayPayment';`}
                            </code>
                        </li>
                        <li>
                            <strong>Use in your page:</strong>
                            <code style={styles.envCode}>
                                {`<RazorpayPayment
  amount={499}
  name="Product Name"
  onSuccess={(result) => console.log(result)}
/>`}
                            </code>
                        </li>
                    </ol>
                </div>

                {/* Test Card Info */}
                <div style={styles.testInfo}>
                    <h3 style={styles.testTitle}>🧪 Test Card Details</h3>
                    <div style={styles.testGrid}>
                        <div>
                            <strong>Card Number:</strong> 4111 1111 1111 1111
                        </div>
                        <div>
                            <strong>Expiry:</strong> Any future date
                        </div>
                        <div>
                            <strong>CVV:</strong> Any 3 digits
                        </div>
                        <div>
                            <strong>OTP:</strong> 123456 (for test mode)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Inline styles for the demo page
 */
const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "40px 20px",
    },
    wrapper: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        textAlign: "center",
        marginBottom: "48px",
    },
    title: {
        fontSize: "36px",
        fontWeight: 700,
        color: "#f8fafc",
        marginBottom: "12px",
    },
    subtitle: {
        fontSize: "18px",
        color: "#94a3b8",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
        marginBottom: "48px",
    },
    card: {
        background: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #334155",
    },
    cardTitle: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#f8fafc",
        marginBottom: "8px",
    },
    cardDesc: {
        fontSize: "14px",
        color: "#94a3b8",
        marginBottom: "16px",
    },
    codeBlock: {
        background: "#0f172a",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "12px",
        color: "#a5b4fc",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        overflow: "auto",
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "center",
    },
    resultsSection: {
        marginBottom: "48px",
    },
    resultsTitle: {
        fontSize: "24px",
        fontWeight: 600,
        color: "#f8fafc",
        marginBottom: "16px",
    },
    resultsList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    resultCard: {
        background: "#1e293b",
        borderRadius: "12px",
        padding: "16px",
        border: "2px solid",
    },
    resultHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
    },
    resultJson: {
        fontSize: "12px",
        color: "#94a3b8",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        margin: 0,
        overflow: "auto",
    },
    instructions: {
        background: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid #334155",
    },
    instructionsTitle: {
        fontSize: "20px",
        fontWeight: 600,
        color: "#f8fafc",
        marginBottom: "16px",
    },
    instructionsList: {
        color: "#e2e8f0",
        lineHeight: 2,
        paddingLeft: "20px",
    },
    envCode: {
        display: "block",
        background: "#0f172a",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "8px",
        marginBottom: "16px",
        fontSize: "13px",
        color: "#a5b4fc",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
    },
    testInfo: {
        background: "rgba(251, 191, 36, 0.1)",
        border: "1px solid #fbbf24",
        borderRadius: "12px",
        padding: "20px",
    },
    testTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#fbbf24",
        marginBottom: "12px",
    },
    testGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
        color: "#fef3c7",
        fontSize: "14px",
    },
};
