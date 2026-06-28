import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expireAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000,
    index: { expires: "5m" },
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
