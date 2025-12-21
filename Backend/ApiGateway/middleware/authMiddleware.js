import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Public routes
  if (
    req.originalUrl.startsWith("/api/auth") ||
    req.originalUrl.startsWith("/auth/api/user") ||
    req.originalUrl.startsWith("/auth/login") ||
    req.originalUrl.startsWith("/auth/logout")
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
