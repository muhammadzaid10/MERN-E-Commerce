// ==========================================
// Admin Login Page — Dedicated Secure Portal
// ==========================================
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, logoutUser } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShield, FiLock, FiMail } from "react-icons/fi";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        toast.success("Welcome to the Admin Portal");
        navigate("/admin/dashboard");
      } else {
        // If normal user tries to login here, log them out
        dispatch(logoutUser());
        toast.error("Access Denied: You do not have admin privileges.");
      }
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    dispatch(loginUser({ email: email.trim().toLowerCase(), password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 font-[Inter,sans-serif] px-4 py-12 relative overflow-hidden">
      
      {/* Dark Mode Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-900/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-900/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 p-8 sm:p-12 shadow-2xl relative z-10 rounded-3xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <FiShield className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-indigo-200 text-sm">Secure sign-in for authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail className="text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiLock className="text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 focus:outline-none transition-all duration-300 disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg hover:shadow-indigo-500/30"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-400 text-sm hover:text-white transition-colors"
          >
            ← Back to Main Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
