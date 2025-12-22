// Native fetch is used (Node 18+)
const authMiddleware = async (req, res, next) => {

  const path = req.path; // removes query params

  // Skip auth validation for public authentication routes
  // These routes either don't require auth or are part of the auth flow itself
  const publicAuthPaths = [
    "/authentication/get-session",
    "/authentication/sign-in",      // Better Auth sign-in routes
    "/authentication/signin",       // Legacy format
    "/authentication/sign-up",      // Sign-up routes
    "/authentication/signup",       // Legacy format
    "/authentication/sign-out",     // Sign-out routes
    "/authentication/signout",      // Legacy format
    "/authentication/callback",     // OAuth callbacks
    "/authentication/error",        // Auth error pages
  ];

  const isPublicAuthRoute = publicAuthPaths.some(p => path.startsWith(p)) || path.startsWith("/courses/upload");

  if (isPublicAuthRoute) {
    return next();
  }

  try {
    // We delegate the validation to the Auth Service.
    // The Auth Service at localhost:3000/api/auth/get_user checks the session cookie/token.
    // We verify the existence of the token implicitly by checking the response.

    // Construct headers to forward (Cookie is essential for session auth, Authorization for Bearer)
    const headers = {};
    if (req.headers.cookie) headers.cookie = req.headers.cookie;
    if (req.headers.authorization) headers.authorization = req.headers.authorization;

    // If no credentials at all, we can fail early or let the auth service decide.
    // Let's failing early if strictly no auth is present to save a request, 
    // BUT the user questioned "if its correct or wrong", implying they might send *something*.
    // So let's forward even empty to let Auth service decide (it will 401).

    const authServiceUrl = "http://localhost:3000/api/auth/get_user";
    console.log(`[AUTH MIDDLEWARE] Validating token via ${authServiceUrl}`);

    const response = await fetch(authServiceUrl, {
      method: "GET",
      headers: headers
    });

    if (response.ok) {
      // Session is valid
      const user = await response.json();
      req.user = user; // Attach user to request for downstream use
      console.log(`[AUTH MIDDLEWARE] User validated: ${user.email || user.id}`);
      return next();
    } else {
      console.log(`[AUTH MIDDLEWARE] Validation failed: ${response.status} ${response.statusText}`);
      return res.status(401).json({ message: "Unauthorized", details: "Invalid or expired session" });
    }

  } catch (err) {
    console.error(`[AUTH MIDDLEWARE] Error: ${err.message}`);
    return res.status(500).json({ message: "Internal Authentication Error" });
  }
};

export default authMiddleware;
