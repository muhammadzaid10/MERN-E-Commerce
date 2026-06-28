// ==========================================
// Forgot Password / OTP Login Page — Premium UI
// ==========================================
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios"; // Axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/send", { email: email.trim().toLowerCase() });
      toast.success(data.message || "OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/otp/verify", { email: email.trim().toLowerCase(), otp, newPassword });
      toast.success(data.message || "Logged in successfully!");
      
      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Force reload to update Redux auth state globally
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Inter,sans-serif] px-4 py-12 relative overflow-hidden z-0">
      
      {/* Soft Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-8 sm:p-12 shadow-2xl shadow-gray-200/50 relative z-10 hover:shadow-indigo-100/50 transition-shadow duration-500 rounded-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight group cursor-default">
            {step === 1 ? "Reset Password" : "Change Password"}<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1 
              ? "Enter your email address and we will send you an OTP to login." 
              : `We sent a code to ${email}.`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full py-4 px-4 text-sm font-bold text-white bg-gray-900 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{loading ? "Sending..." : "Send OTP"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 text-center tracking-widest font-bold placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                maxLength={6}
              />
            </div>
            
            <div className="group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password (optional for just login)"
                className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full py-4 px-4 text-sm font-bold text-white bg-gray-900 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{loading ? "Verifying..." : "Verify & Change Password"}</span>
            </button>

            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Change Email
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-900 font-medium hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300 pb-0.5"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
