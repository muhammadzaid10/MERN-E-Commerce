import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import connectDb from "./utlis/db.js";

// ==========================================
// Load Environment Variables (from .env file)
// ==========================================
dotenv.config();

const app = express();

// ==========================================
// Middlewares — ye har request se pehle chalenge
// ==========================================

// CORS — sirf permitted origins se requests allow kar
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-e-commerce-6as7.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Origin undefined hota hai Postman/curl ke liye
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`❌ CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// JSON body parse kar (POST/PUT requests ke liye)
app.use(express.json());

// URL-encoded data parse kar (form submissions ke liye)
app.use(express.urlencoded({ extended: true }));

// Cookies parse kar (JWT token cookie mein hoga)
app.use(cookieParser());

// Morgan — har request log kar (development mein helpful)
app.use(morgan("dev"));

// ==========================================
// Cloudinary Configuration — Image upload ke liye
// ==========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary validation
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn("⚠️ Cloudinary environment variables missing!");
}

// ==========================================
// Routes — API endpoints
// ==========================================
import userRouter from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";

app.use("/api", userRouter); // /api/auth/register, /api/auth/login, etc.
app.use("/api", productRoutes); // /api/product/all, /api/product/:id, etc.
app.use("/api", orderRoutes); // /api/order/new, /api/order/myorders, etc.

// ==========================================
// Health Check — Server check karne ke liye
// ==========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🛒 Ecommerce API is running!",
  });
});

// ==========================================
// Global Error Handler — koi bhi unhandled error yahan aayega
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "❌ File is too large — max 5MB allowed",
    });
  }

  // Multer file count error
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "❌ Too many files — max 5 allowed",
    });
  }

  // CORS errors
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// Server Start — PEHLE MongoDB connect, PHIR server start
// ==========================================
const port = process.env.PORT || 5000;

// Server ko start karne ke liye function
const startServer = async () => {
  try {
    // MongoDB se connect kar
    await connectDb();
    console.log("✅ Database connection successful!");

    // Local development mein server start kar (port pe)
    // Vercel pe ye nahi chalega (serverless functions use hote hain)
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`🚀 Server is running on: http://localhost:${port}`);
      });
    } else {
      console.log("🚀 Server ready for Vercel (serverless mode)");
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Server ko crash kar do
  }
};

// Server start kar
startServer();

// ==========================================
// Vercel ke liye export (serverless functions ke liye zaroori)
// ==========================================
export default app;