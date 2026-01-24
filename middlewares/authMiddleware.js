const authMiddleware = (req, res, next) => {
  console.log("authorizing user...");
  // Prioritize Authorization header, fall back to cookies
  const authHeader = req.headers.authorization?.split(" ")[1];
  const token = authHeader || req.cookies.token;
  
  if (!token) {
    console.log("user not authorized - no token found");
    return res.status(401).json({ error: "Not authorized" });
  }
  
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    req.user = decoded; // Attach user info to request
    console.log("user authorized with token:", token.substring(0, 20) + "...");
    next();
  } catch (error) {
    console.error("Token validation failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
