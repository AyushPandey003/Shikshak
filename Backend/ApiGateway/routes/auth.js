import { createProxyMiddleware } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
  target: "http://localhost:3000",
  changeOrigin: true,
  pathRewrite: {
    "^/auth": "/api/auth"
  },
  onProxyReq(proxyReq, req) {
    console.log(`[AUTH] ${req.method} ${req.originalUrl}`);
  }
});

export default authProxy;
