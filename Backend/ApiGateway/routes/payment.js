import { createProxyMiddleware } from "http-proxy-middleware";

const paymentProxy = createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL || "http://localhost:4003",
    changeOrigin: true,
    pathRewrite: {
        "^/payment": ""
    },
    onProxyReq(proxyReq, req) {
        console.log(`[PAYMENT PROXY] ${req.method} ${req.originalUrl}`);
    }
});

export default paymentProxy;