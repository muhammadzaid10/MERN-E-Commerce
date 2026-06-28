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
// Middlewares — these will run before every request
// ==========================================

// CORS — only allow requests from permitted frontend origins
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
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Parse JSON body (data for POST/PUT requests)
app.use(express.json());

// Parse URL encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse Cookies (JWT token will be in a cookie)
app.use(cookieParser());

// Morgan — log every API request to the console (helpful in development)
app.use(morgan("dev"));

// ==========================================
// Cloudinary Configuration — For Image upload
// ==========================================
cloudinary.config({
  cloud_name: process.env.Cluadinary_cloud_name,
  api_key: process.env.Cluadinary_api_key,
  api_secret: process.env.Cluadinary_api_secret,
});

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
// Global Error Handler — Any unhandled error will come here
// ==========================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File is too large — max 5MB allowed",
    });
  }

  // Multer file count error
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "Too many files — max 5 allowed",
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================================
// Server Start — Connect to MongoDB FIRST, then start the server
// ==========================================
const port = process.env.PORT || 5000;

// First connect to DB, then start server
const startServer = async () => {
  await connectDb();

  // Only call app.listen() in local development (not on Vercel)
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    app.listen(port, () => {
      console.log(`🚀 Server is running: http://localhost:${port}`);
    });
  }
};

startServer();

// Exporting the app is required for Vercel Serverless
export default app;
