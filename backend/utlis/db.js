import mongoose from "mongoose";

// ===================================================
// Global cache (Required for Vercel serverless functions)
// ===================================================
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

const connectDb = async () => {
  // Return existing connection if already established
  if (cached.conn) {
    console.log(" Using cached MongoDB connection");
    return cached.conn;
  }

  // ===================================================
  // Load MongoDB URI from environment variables
  // ===================================================
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  // Throw error if URI is missing
  if (!mongoUri) {
    const error = new Error(
      "❌ MONGO_URI environment variable not found"
    );
    console.error(error.message);
    throw error;
  }

  try {
    console.log(" 🔄 Connecting to MongoDB...");

    // Establish new Mongoose connection
    cached.conn = await mongoose.connect(mongoUri, {
      dbName: "ecommerce",
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB successfully connected!");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);

    // Clear the cache if connection fails
    cached.conn = null;

    // Throw error to prevent server from starting without DB
    throw error;
  }
};

export default connectDb;