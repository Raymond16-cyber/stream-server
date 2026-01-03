const authMiddleware = (req, res, next) => {
  console.log("authorizing user...");
  // Assuming you have a function to verify JWT tokens
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("user not authorized");
    return res.status(401).json({ error: "Not authorized" });
  }
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    req.user = decoded; // Attach user info to request
    console.log("user  authorized");
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
