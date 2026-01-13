import { createProxyMiddleware } from "http-proxy-middleware";

const materialProxy = createProxyMiddleware({
  target: process.env.COURSES_SERVICE_URL || "http://shikshak-courses",
  changeOrigin: true,
  pathRewrite: {
    "^/material": "/api"
  },
  onProxyReq(proxyReq, req) {
    console.log(`[MATERIAL] ${req.method} ${req.originalUrl}`);
  }
});

export default materialProxy;
