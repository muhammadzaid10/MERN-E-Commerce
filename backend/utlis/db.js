import mongoose from "mongoose";

// Global cache (Vercel ke liye zaroori)
let cached = global.mongoose || (global.mongoose = { conn: null });

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables!");
  }

  try {
    cached.conn = await mongoose.connect(mongoUri, {
      dbName: "ecommerce",
    });

    console.log("✅ MongoDB Connected");
    return cached.conn;
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export default connectDb;