import mongoose from "mongoose";

// ===================================================
// Global cache (Vercel serverless functions ke liye)
// ===================================================
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

const connectDb = async () => {
  // Agar pehle se connect hai to return kar do
  if (cached.conn) {
    console.log(" Using cached MongoDB connection");
    return cached.conn;
  }

  // ===================================================
  // Environment variable se MongoDB URI lao
  // ===================================================
  // Vercel mein set karne ke liye: MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;

  // Agar URI nahi mila
  if (!mongoUri) {
    const error = new Error(
      "❌ MONGODB_URI environment variable not found"
    );
    console.error(error.message);
    throw error;
  }

  try {
    console.log(" 🔄 connecting to MongoDB");

    // Mongoose ke sath connect kar
    cached.conn = await mongoose.connect(mongoUri, {
      dbName: "ecommerce",
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB successfully connected!");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);

    // Agar connection fail ho to clear kar
    cached.conn = null;

    // Error throw kar so server start nahi hoga
    throw error;
  }
};

export default connectDb;