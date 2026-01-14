import { createProxyMiddleware } from "http-proxy-middleware";

const AUTH_TARGET = process.env.AUTH_SERVICE_URL || "http://shikshak-auth";
console.log(`[AUTH PROXY INIT] Target URL configured as: ${AUTH_TARGET}`);

const authProxy = createProxyMiddleware({
  target: AUTH_TARGET,
  changeOrigin: true,
  xfwd: true,
  // Cookie handling for session management
  // Cookie handling for session management
  cookieDomainRewrite: "shikshak-backend.whitetree-88f47ee0.eastus2.azurecontainerapps.io",
  cookiePathRewrite: {
    "/api/auth": "/api/auth"
  },
  pathRewrite: {
    "^/authentication": "/api/auth"
  },
  onProxyReq(proxyReq, req) {
    console.log(`[AUTH PROXY] Incoming: ${req.method} ${req.originalUrl}`);
    console.log(`[AUTH PROXY] Proxying to: ${proxyReq.path}`);
    // Forward cookies
    if (req.headers.cookie) {
      console.log(`[AUTH PROXY] Forwarding cookies:`, req.headers.cookie);
    } else {
      console.log(`[AUTH PROXY] No cookies found in request`);
    }
  },
  onProxyRes(proxyRes, req, res) {
    console.log(`[AUTH PROXY] Response: ${proxyRes.statusCode} for ${req.originalUrl}`);
    // Log if there are set-cookie headers
    if (proxyRes.headers['set-cookie']) {
      console.log(`[AUTH PROXY] Set-Cookie headers:`, JSON.stringify(proxyRes.headers['set-cookie']));
    }
  },
  onError(err, req, res) {
    console.error(`[AUTH PROXY] Error: ${err.message}`);
  }
});

export default authProxy;
