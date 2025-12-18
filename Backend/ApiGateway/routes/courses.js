import { createProxyMiddleware } from "http-proxy-middleware";

const courseProxy = createProxyMiddleware({
  target: "http://localhost:4002",
  changeOrigin: true,
  pathRewrite: {
    "^/courses": ""
  },
  onProxyReq(proxyReq, req) {
    console.log(`[COURSES] ${req.method} ${req.originalUrl}`);
  }
});

export default courseProxy;
