import TryCatch from "../utlis/TryCatch.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

// ==========================================
// CREATE ORDER — Place a new order (POST /api/order/new)
// Logged in user
// ==========================================
export const createOrder = TryCatch(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  // 1. Check if order items are provided
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty. Please add items.",
    });
  }

  // 2. Check stock for each item and calculate total
  let totalPrice = 0;

  for (const item of orderItems) {
    // Find product in database
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.title}`,
      });
    }

    // Check stock — is this much available?
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `${product.title} is low on stock — only ${product.stock} available.`,
      });
    }

    // Calculate total price
    totalPrice += item.price * item.quantity;
  }

  // 3. Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    totalPrice,
    // If COD, isPaid is false; if online payment, true
    isPaid: paymentMethod !== "COD",
    paidAt: paymentMethod !== "COD" ? Date.now() : undefined,
  });

  // 4. Update stock — reduce by ordered quantity
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  // 5. Send response
  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
  });
});

// ==========================================
// MY ORDERS — Orders of the logged in user (GET /api/order/myorders)
// ==========================================
export const getMyOrders = TryCatch(async (req, res) => {
  // Find all orders for the user — newest first
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");

  res.json({
    success: true,
    orders,
  });
});

// ==========================================
// SINGLE ORDER — Details of a single order (GET /api/order/:id)
// ==========================================
export const getSingleOrder = TryCatch(async (req, res) => {
  // Find order and populate user details
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if this order belongs to the user or if admin is viewing it
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to view this order",
    });
  }

  res.json({
    success: true,
    order,
  });
});

// ==========================================
// ADMIN: GET ALL ORDERS (GET /api/order/admin/all)
// ==========================================
export const getAllOrders = TryCatch(async (req, res) => {
  // Get all orders — populate user details
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  res.json({
    success: true,
    totalOrders: orders.length,
    totalRevenue,
    orders,
  });
});

// ==========================================
// ADMIN: UPDATE ORDER STATUS (PUT /api/order/:id/status)
// ==========================================
export const updateOrderStatus = TryCatch(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Admin can change status back from Delivered if they made a mistake

  const { status } = req.body;

  // Update status
  order.status = status;

  // If marked delivered, set delivery details
  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    // Mark payment for COD order when delivered
    if (order.paymentMethod === "COD") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
  } else {
    // If mistakenly marked delivered and admin is reverting
    order.isDelivered = false;
    order.deliveredAt = undefined;
    if (order.paymentMethod === "COD") {
      order.isPaid = false;
      order.paidAt = undefined;
    }
  }

  await order.save();

  res.json({
    success: true,
    message: `Order status updated to "${status}"`,
    order,
  });
});

// ==========================================
// MARK AS PAID — Mark payment (PUT /api/order/:id/pay)
// ==========================================
export const markAsPaid = TryCatch(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Set payment details
  order.isPaid = true;
  order.paidAt = Date.now();

  // If result received from payment gateway, save it
  if (req.body.paymentResult) {
    order.paymentResult = req.body.paymentResult;
  }

  await order.save();

  res.json({
    success: true,
    message: "Payment marked successfully",
    order,
  });
});
