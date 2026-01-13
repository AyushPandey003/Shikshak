import { createProxyMiddleware } from "http-proxy-middleware";

const materialProxy = createProxyMiddleware({
  target: process.env.COURSES_SERVICE_URL || "http://localhost:4002",
  changeOrigin: true,
  pathRewrite: {
    "^/material": "/api"
  },
  onProxyReq(proxyReq, req) {
    console.log(`[MATERIAL] ${req.method} ${req.originalUrl}`);
  }
});

export default materialProxy;
