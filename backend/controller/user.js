import { OTP } from "../models/Otp.js";
import TryCatch from "../utlis/TryCatch.js";
import sendOtp from "../utlis/sendOtp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ==========================================
// Helper: Generate JWT Token and set it in a cookie
// ==========================================
const sendToken = (user, res, statusCode, message) => {
  // Create token — encode user _id, valid for 7 days
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Cookie options — secure and httpOnly
  const cookieOptions = {
    httpOnly: true, // Cannot be accessed via JavaScript (XSS protection)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    sameSite: "none", // For cross-origin requests (frontend on different port)
    secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
  };

  // Remove password from the response
  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

// ==========================================
// REGISTER — Create a new user (POST /api/auth/register)
// ==========================================
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check that all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  // 2. Check if this email is already registered
  let existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered. Please login.",
    });
  }

  // 3. Create new user — password will be automatically hashed (pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 4. Generate token and send response
  sendToken(user, res, 201, "Account created successfully!");
});

// ==========================================
// LOGIN — Email + Password se login (POST /api/auth/login)
// ==========================================
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check that email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // 2. Find user — "+password" includes the password field (select:false by default)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if no password is saved in the database (e.g., OTP-only user or legacy data)
  if (!user.password) {
    return res.status(400).json({
      success: false,
      message: "No password is set for this account. Please login with OTP.",
    });
  }

  // 3. Compare password (bcrypt will match the hash)
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // 4. Generate token and send response
  sendToken(user, res, 200, `Welcome back ${user.name}!`);
});

// ==========================================
// LOGOUT — Clear the cookie (GET /api/auth/logout)
// ==========================================
export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ==========================================
// MY PROFILE — Get logged in user details (GET /api/auth/profile)
// ==========================================
export const myProfile = TryCatch(async (req, res) => {
  // req.user was set by the isAuth middleware
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
});

// ==========================================
// UPDATE PROFILE — Update name or email (PUT /api/auth/profile)
// ==========================================
export const updateProfile = TryCatch(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// ==========================================
// OTP LOGIN — Send OTP to email (POST /api/auth/otp/send)
// ==========================================
// Legacy OTP system — kept as a backup login option
export const sendOtpLogin = TryCatch(async (req, res) => {
  const { email } = req.body;

  const subject = "Ecommerce App — OTP Verification";
  const otp = Math.floor(100000 + Math.random() * 900000);

  // If a previous OTP exists, delete it
  const preOtp = await OTP.findOne({ email });
  if (preOtp) {
    await OTP.deleteOne({ email });
  }

  // Send email with OTP
  await sendOtp({ email, subject, otp });

  // Save OTP in the database
  await OTP.create({ email, otp });

  res.json({
    success: true,
    message: "OTP has been sent to your email",
  });
});

// ==========================================
// VERIFY OTP — Verify the OTP (POST /api/auth/otp/verify)
// ==========================================
export const verifyOtpLogin = TryCatch(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find OTP in the database
  const haveOtp = await OTP.findOne({ email, otp });

  if (!haveOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP is invalid or has expired",
    });
  }

  // OTP has been used — delete it
  await OTP.deleteOne({ email });

  // Find the user or create a new one
  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    // If user not found via OTP login, we don't auto-register
    // User must register first with a password-based account
    return res.status(400).json({
      success: false,
      message: "Account not found. Please register first.",
    });
  }

  if (newPassword) {
    user.password = newPassword;
    // Fallback to prevent validation error if name is missing in legacy test accounts
    if (!user.name) user.name = "Store User";
    await user.save();
    return sendToken(user, res, 200, "Password changed successfully!");
  }

  // Generate token
  sendToken(user, res, 200, "OTP verified. Login successful!");
});

// ==========================================
// ADMIN: Get All Users (GET /api/auth/admin/users)
// ==========================================
export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find();

  res.json({
    success: true,
    users,
  });
});

// ==========================================
// ADMIN: Update User Role (PUT /api/auth/admin/users/:id)
// ==========================================
export const updateUserRole = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Toggle role — user becomes admin, admin becomes user
  if (user.role === "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }

  await user.save();

  res.json({
    success: true,
    message: `User role updated to ${user.role}`,
    user,
  });
});
