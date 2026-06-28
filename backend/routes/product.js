import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import uploadFiles from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addReview,
  deleteReview,
} from "../controller/product.js";

const router = express.Router();

// ==========================================
// Product Routes — /api/product/...
// ==========================================

// Public routes — accessible without login
router.get("/product/categories", getCategories); // List all categories
router.get("/product/all", getAllProducts); // All products (search, filter, pagination)
router.get("/product/:id", getSingleProduct); // Single product details

// Admin routes — only admins can create/edit/delete products
router.post("/product/new", isAuth, isAdmin, uploadFiles, createProduct); // Create new product
router.put("/product/:id", isAuth, isAdmin, uploadFiles, updateProduct); // Update a product
router.delete("/product/:id", isAuth, isAdmin, deleteProduct); // Delete a product

// Review routes — logged in users can leave reviews
router.post("/product/:id/review", isAuth, addReview); // Add or update a review
router.delete("/product/:id/review", isAuth, deleteReview); // Delete your review

export default router;
