import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  myProfile,
  updateProfile,
  sendOtpLogin,
  verifyOtpLogin,
  getAllUsers,
  updateUserRole,
} from "../controller/user.js";
import { isAuth } from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// ==========================================
// Auth Routes — /api/auth/...
// ==========================================

// Public routes — accessible without login
router.post("/auth/register", registerUser); // Create a new account
router.post("/auth/login", loginUser); // Login with email + password

// OTP routes — backup login method
router.post("/auth/otp/send", sendOtpLogin); // Send OTP to email
router.post("/auth/otp/verify", verifyOtpLogin); // Verify the OTP

// Protected routes — login is required
router.get("/auth/logout", isAuth, logoutUser); // Logout
router.get("/auth/profile", isAuth, myProfile); // View your profile
router.put("/auth/profile", isAuth, updateProfile); // Update your profile

// Admin routes — only admins can access
router.get("/auth/admin/users", isAuth, isAdmin, getAllUsers); // View all users
router.put("/auth/admin/users/:id", isAuth, isAdmin, updateUserRole); // Change user role

export default router;
