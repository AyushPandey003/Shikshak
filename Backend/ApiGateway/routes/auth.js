import { createProxyMiddleware } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
  target: "http://localhost:4001",
  changeOrigin: true,
  pathRewrite: {
    "^/auth": ""
  },
  onProxyReq(proxyReq, req) {
    console.log(`[AUTH] ${req.method} ${req.originalUrl}`);
  }
});

export default authProxy;
