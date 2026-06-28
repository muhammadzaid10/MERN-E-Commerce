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
// ==========================================
// Middlewares — these run before every request
// ==========================================

// CORS — only allow requests from permitted origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-e-commerce-6as7.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Origin is undefined for tools like Postman/curl
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

// Parse JSON body (for POST/PUT requests)
app.use(express.json());

// Parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse Cookies (JWT token will be stored in a cookie)
app.use(cookieParser());

// Morgan — log every API request (helpful for development)
app.use(morgan("dev"));

// ==========================================
// Cloudinary Configuration — For Image uploads
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
// Health Check — Check if the server is running
// ==========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🛒 Ecommerce API is running!",
  });
});

// ==========================================
// Global Error Handler — catches all unhandled errors
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
// Server Start — Connect to MongoDB FIRST, then start server
// ==========================================
const port = process.env.PORT || 5000;

// Function to start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDb();
    console.log("✅ Database connection successful!");

    // Start server in local development (listen on port)
    // This part is skipped on Vercel (serverless functions are used instead)
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`🚀 Server is running on: http://localhost:${port}`);
      });
    } else {
      console.log("🚀 Server ready for Vercel (serverless mode)");
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Crash the server if DB connection fails
  }
};

// Start the server
startServer();

// ==========================================
// Export app for Vercel (required for serverless functions)
// ==========================================
export default app;