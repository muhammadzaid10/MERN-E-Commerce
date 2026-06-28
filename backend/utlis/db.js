import mongoose from "mongoose";

// Function to connect to MongoDB
// MONGO_URL comes from .env file via dotenv
const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!mongoUri) {
      console.log("❌ MongoDB Connection Error: MONGO_URI is missing in environment variables!");
      return;
    }
    
    await mongoose.connect(mongoUri, {
      dbName: "ecommerce",
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed:", error.message);
    // We do not use process.exit(1) in Vercel Serverless functions, otherwise it crashes
  }
};

export default connectDb;
