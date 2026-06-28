// ==========================================
// Axios Instance — For communicating with the backend
// ==========================================
// The baseURL is automatically added to every API call
// withCredentials sends cookies along with requests (for JWT token)

import axios from "axios";

const baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : "");

if (!baseURL) {
  throw new Error(
    "VITE_BACKEND_URL is missing. Set it in Vercel → Project Settings → Environment Variables."
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // Required for sending cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// Request Interceptor — Attach token before every request
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (fallback if cookie doesn't work)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor — If 401 received, logout
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired — clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
