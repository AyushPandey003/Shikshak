import { createProxyMiddleware } from "http-proxy-middleware";

const ragProxy = createProxyMiddleware({
    target: process.env.RAG_SERVICE_URL || "http://localhost:4005",
    changeOrigin: true,
    pathRewrite: {
        "^/rag": "/api/rag"
    },
    onProxyReq(proxyReq, req) {
        console.log(`[RAG PROXY] ${req.method} ${req.originalUrl}`);
    }
});

export default ragProxy;