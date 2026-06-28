import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  markAsPaid,
} from "../controller/order.js";

const router = express.Router();

// ==========================================
// Order Routes — /api/order/...
// ==========================================

// User routes — login is required
router.post("/order/new", isAuth, createOrder); // Place a new order
router.get("/order/myorders", isAuth, getMyOrders); // View all my orders
router.get("/order/:id", isAuth, getSingleOrder); // View single order details

// Admin routes — admin only
router.get("/order/admin/all", isAuth, isAdmin, getAllOrders); // All orders (admin)
router.put("/order/:id/status", isAuth, isAdmin, updateOrderStatus); // Update order status
router.put("/order/:id/pay", isAuth, isAdmin, markAsPaid); // Mark payment as complete

export default router;
