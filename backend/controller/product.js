import bufferGenerator from "../utlis/bufferGenerator.js";
import TryCatch from "../utlis/TryCatch.js";
import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/Product.js";

// ==========================================
// Helper: Upload stream to Cloudinary
// ==========================================
const uploadToCloudinary = (stream) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "ecommerce/products", // Folder in Cloudinary
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    // Send stream data directly to Cloudinary
    stream.pipe(uploadStream);
  });
};

// ==========================================
// CREATE PRODUCT — Create a new product (POST /api/product/new)
// Admin Only
// ==========================================
export const createProduct = TryCatch(async (req, res) => {
  // 1. Get fields from body
  const { title, description, category, price, stock } = req.body;

  // 2. Check files
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please upload at least one image",
    });
  }

  // 3. Stream and upload each file to Cloudinary
  const imageUploadPromises = files.map(async (file) => {
    const stream = bufferGenerator(file);
    const result = await uploadToCloudinary(stream);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  // 4. Wait for all uploads
  const uploadedImages = await Promise.all(imageUploadPromises);

  // 5. Save product in DB
  const product = await Product.create({
    title,
    description,
    stock,
    category,
    price,
    images: uploadedImages,
    seller: req.user._id, // Which admin created it
  });

  // 6. Send response
  res.status(201).json({
    success: true,
    message: "Product created successfully!",
    product,
  });
});

// ==========================================
// GET ALL PRODUCTS — Get all products (GET /api/product/all)
// Public — anyone can view
// ==========================================
export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  // Create filter object
  const filter = {};

  // If search query exists, find in title (case-insensitive)
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i", // "i" = case insensitive
    };
  }

  // If category filter exists
  if (category) {
    filter.category = category;
  }

  // Pagination — 8 products per page
  const limit = 8;
  const currentPage = Number(page) || 1;
  const skip = (currentPage - 1) * limit;

  // Sorting — price low to high, high to low, or default (newest first)
  let sortOption = { createdAt: -1 }; // default: newest first

  if (sortByPrice === "lowToHigh") {
    sortOption = { price: 1 };
  } else if (sortByPrice === "highToLow") {
    sortOption = { price: -1 };
  }

  // Find products with filter, sort, pagination
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  // List of all unique categories
  const categories = await Product.distinct("category");

  // Latest 4 products (for home page)
  const newProduct = await Product.find().sort("-createdAt").limit(4);

  // Total products count (for pagination)
  const countProduct = await Product.countDocuments(filter);
  const totalPages = Math.ceil(countProduct / limit);

  res.json({
    success: true,
    products,
    categories,
    totalPages,
    currentPage,
    totalProducts: countProduct,
    newProduct,
  });
});

// ==========================================
// GET SINGLE PRODUCT — Get single product details (GET /api/product/:id)
// Public
// ==========================================
export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name avatar"
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Related products — same category, excluding the current product
  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product._id }, // $ne = not equal
  }).limit(4);

  res.json({
    success: true,
    product,
    relatedProduct,
  });
});

// ==========================================
// UPDATE PRODUCT — Update a product (PUT /api/product/:id)
// Admin Only
// ==========================================
export const updateProduct = TryCatch(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product nahi mila",
    });
  }

  const { title, description, category, price, stock } = req.body;

  // Update fields if provided
  if (title) product.title = title;
  if (description) product.description = description;
  if (category) product.category = category;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  // If new images are uploaded
  const files = req.files;
  if (files && files.length > 0) {
    // First, delete old images from Cloudinary
    for (const img of product.images) {
      if (img.id) {
        await cloudinary.uploader.destroy(img.id);
      }
    }

    // Upload new images
    const imageUploadPromises = files.map(async (file) => {
      const stream = bufferGenerator(file);
      const result = await uploadToCloudinary(stream);
      return {
        id: result.public_id,
        url: result.secure_url,
      };
    });

    product.images = await Promise.all(imageUploadPromises);
  }

  await product.save();

  res.json({
    success: true,
    message: "Product updated successfully!",
    product,
  });
});

// ==========================================
// DELETE PRODUCT — Delete a product (DELETE /api/product/:id)
// Admin Only
// ==========================================
export const deleteProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product nahi mila",
    });
  }

  // Delete images from Cloudinary
  for (const img of product.images) {
    if (img.id) {
      await cloudinary.uploader.destroy(img.id);
    }
  }

  // Delete product from MongoDB
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Product deleted successfully!",
  });
});

// ==========================================
// GET CATEGORIES — All unique categories (GET /api/product/categories)
// Public
// ==========================================
export const getCategories = TryCatch(async (req, res) => {
  const categories = await Product.distinct("category");

  res.json({
    success: true,
    categories,
  });
});

// ==========================================
// ADD/UPDATE REVIEW (POST /api/product/:id/review)
// Logged in user
// ==========================================
export const addReview = TryCatch(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product nahi mila",
    });
  }

  // Check if the user has already submitted a review
  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    // If a review already exists, update it
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
    if (!existingReview.name) existingReview.name = req.user.name || "Anonymous";
  } else {
    // Add a new review
    product.reviews.push({
      user: req.user._id,
      name: req.user.name || "Anonymous",
      rating: Number(rating),
      comment,
    });
  }

  // Fix broken reviews (where name is missing)
  product.reviews.forEach((review) => {
    if (!review.name) {
      review.name = "Anonymous";
    }
  });

  // Calculate the average rating
  product.numReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((total, review) => total + review.rating, 0) /
    product.reviews.length;

  await product.save();

  res.json({
    success: true,
    message: existingReview ? "Review updated successfully" : "Review added successfully",
    product,
  });
});

// ==========================================
// DELETE REVIEW (DELETE /api/product/:id/review)
// Logged in user — can delete their own review
// ==========================================
export const deleteReview = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product nahi mila",
    });
  }

  // User can only delete their own review
  product.reviews = product.reviews.filter(
    (review) => review.user.toString() !== req.user._id.toString()
  );

  // Recalculate ratings
  product.numReviews = product.reviews.length;
  product.ratings =
    product.reviews.length > 0
      ? product.reviews.reduce((total, review) => total + review.rating, 0) /
        product.reviews.length
      : 0;

  await product.save();

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});
