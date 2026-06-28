// ==========================================
// Register Page — Shopify UI with Soft Animations
// ==========================================
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    dispatch(registerUser({ name, email: email.trim().toLowerCase(), password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-[Inter,sans-serif] px-4 py-12 relative overflow-hidden z-0">
      
      {/* Soft Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-20 -right-40 w-[600px] h-[600px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-8 sm:p-12 shadow-2xl shadow-gray-200/50 relative z-10 hover:shadow-indigo-100/50 transition-shadow duration-500">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-medium text-gray-900 mb-3 tracking-tight">
            Create account<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-gray-500 text-sm">Please fill in the information below:</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and Last Name"
              className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="block w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden w-full mt-6 py-4 px-4 text-sm font-bold text-white bg-gray-900 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">{loading ? "Please wait..." : "Create"}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Returning customer?{" "}
            <Link
              to="/login"
              className="text-gray-900 font-medium hover:text-indigo-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300 pb-0.5"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
