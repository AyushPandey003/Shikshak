import { createProxyMiddleware } from "http-proxy-middleware";

const ingestProxy = createProxyMiddleware({
    target: process.env.COURSES_SERVICE_URL || "http://shikshak-courses",
    changeOrigin: true,
    pathRewrite: {
        "^/rag/ingest": "/api/ingest"
    },
    onProxyReq(proxyReq, req) {
        console.log(`[INGEST PROXY] ${req.method} ${req.originalUrl} -> /api/ingest`);
    }
});

export default ingestProxy;
