import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// isAuth Middleware — Verify the token
// ==========================================
// This runs before every protected route
// Gets the token from the cookie or Authorization header

export const isAuth = async (req, res, next) => {
  try {
    // 1. Find the token — first in cookies, then in headers
    let token;

    // Get token from cookie (sent when frontend uses withCredentials:true)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Get token from header — "Bearer <token>" or direct token
    else if (req.headers.authorization) {
      // "Bearer abc123" — split to get only the token
      if (req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }
    // Legacy method — direct header.token (backward compatible)
    else if (req.headers.token) {
      token = req.headers.token;
    }

    // 2. If no token found, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    // 3. Verify the token — if expired or tampered, it will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Extract user ID from the token and find the user in the database
    req.user = await User.findById(decoded._id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token.",
      });
    }

    // 5. Everything is valid — proceed to the next handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired",
    });
  }
};