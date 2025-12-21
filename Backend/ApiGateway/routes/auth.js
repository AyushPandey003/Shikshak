import { createProxyMiddleware } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
  target: "http://localhost:3000",
  changeOrigin: true,
  // Cookie handling for session management
  cookieDomainRewrite: "localhost",
  cookiePathRewrite: {
    "/api/auth": "/authentication"
  },
  pathRewrite: {
    "^/authentication": "/api/auth"
  },
  onProxyReq(proxyReq, req) {
    console.log(`[AUTH PROXY] Incoming: ${req.method} ${req.originalUrl}`);
    console.log(`[AUTH PROXY] Proxying to: ${proxyReq.path}`);
    // Forward cookies
    if (req.headers.cookie) {
      console.log(`[AUTH PROXY] Forwarding cookies`);
    }
  },
  onProxyRes(proxyRes, req, res) {
    console.log(`[AUTH PROXY] Response: ${proxyRes.statusCode} for ${req.originalUrl}`);
    // Log if there are set-cookie headers
    if (proxyRes.headers['set-cookie']) {
      console.log(`[AUTH PROXY] Set-Cookie headers present`);
    }
  },
  onError(err, req, res) {
    console.error(`[AUTH PROXY] Error: ${err.message}`);
  }
});

export default authProxy;
