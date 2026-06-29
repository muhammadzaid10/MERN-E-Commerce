import app from "../app.js";
import connectDb from "../utlis/db.js";

// Vercel Serverless Function entry point
export default async (req, res) => {
  // Ensure DB is connected before processing the request
  await connectDb();
  
  // Let Express handle the request
  return app(req, res);
};
