import mongoose from "mongoose";

// ==========================================
// Review Schema — Embedded inside Product
// ==========================================
// Each review belongs to a user who rates and comments on a product
const reviewSchema = new mongoose.Schema(
  {
    // Which user submitted the review — reference to User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // User's name — displayed on the frontend
    name: {
      type: String,
      required: true,
    },
    // Rating between 1 and 5
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    // Review comment
    comment: {
      type: String,
      required: [true, "Comment is required"],
    },
  },
  {
    timestamps: true, // When the review was submitted — createdAt
  }
);

// ==========================================
// Product Schema — Ecommerce product data
// ==========================================
const productSchema = new mongoose.Schema({
  // Product name
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
  },
  // Product description
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  // Product price
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  // How many are available in stock
  stock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  // Category — e.g. electronics, clothing, etc.
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  // Product images — array of Cloudinary URLs
  images: [
    {
      id: String, // Cloudinary public_id (used for deletion)
      url: String, // Cloudinary secure_url (used for display)
    },
  ],
  // How many products have been sold
  sold: {
    type: Number,
    default: 0,
  },
  // Seller — reference to User model
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // Overall average rating (average of all reviews)
  ratings: {
    type: Number,
    default: 0,
  },
  // Total review count
  numReviews: {
    type: Number,
    default: 0,
  },
  // Reviews array — embedded sub-documents
  reviews: [reviewSchema],
  // When the product was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", productSchema);