// ==========================================
// isAdmin Middleware
// ==========================================
// This checks if the user has admin privileges
// Apply this AFTER isAuth — because isAuth sets req.user

const isAdmin = (req, res, next) => {
  // If req.user is not set (isAuth did not run first)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  // If user role is not "admin", return 403 Forbidden
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  // If user is admin, proceed to the next handler
  next();
};

export default isAdmin;
