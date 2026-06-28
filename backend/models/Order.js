import mongoose from "mongoose";

// ==========================================
// Order Schema — User order data
// ==========================================
const orderSchema = new mongoose.Schema(
  {
    // Which user placed the order — reference to User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products in the order — array
    orderItems: [
      {
        // Product name
        title: {
          type: String,
          required: true,
        },
        // Number of items ordered
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        // Price per item
        price: {
          type: Number,
          required: true,
        },
        // Product image (for display)
        image: {
          type: String,
          required: true,
        },
        // Reference to Product model
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],

    // Shipping address — where to deliver
    shippingAddress: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        default: "Pakistan",
      },
      pinCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },

    // Payment method — COD or Online (Stripe/Razorpay)
    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Razorpay"],
      required: [true, "Payment method is required"],
      default: "COD",
    },

    // Payment result — when online payment is made
    paymentResult: {
      id: String, // Payment gateway transaction ID
      status: String, // Payment status
      update_time: String, // When the payment was made
      email_address: String, // Payer's email
    },

    // Total price (all items + shipping etc.)
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    // Has the payment been made?
    isPaid: {
      type: Boolean,
      default: false,
    },
    // When was the payment made
    paidAt: {
      type: Date,
    },

    // Has the order been delivered?
    isDelivered: {
      type: Boolean,
      default: false,
    },
    // When was it delivered
    deliveredAt: {
      type: Date,
    },

    // Current order status
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  {
    timestamps: true, // createdAt and updatedAt generated automatically
  }
);

export const Order = mongoose.model("Order", orderSchema);
