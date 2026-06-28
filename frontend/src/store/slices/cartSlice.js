// ==========================================
// Cart Slice — Shopping Cart state management
// ==========================================
// Cart data is saved in localStorage
// Cart won't be cleared on page refresh

import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const shippingFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: cartFromStorage,
    shippingAddress: shippingFromStorage,
    paymentMethod: "COD",
  },
  reducers: {
    // ---- Add item to cart ----
    addToCart: (state, action) => {
      const newItem = action.payload;
      // Check if this item is already in the cart
      const existingIndex = state.cartItems.findIndex(
        (item) => item.product === newItem.product
      );

      if (existingIndex >= 0) {
        // Already exists — update quantity
        state.cartItems[existingIndex].quantity = newItem.quantity;
      } else {
        // Add new item
        state.cartItems.push(newItem);
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    // ---- Remove item from cart ----
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== productId
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    // ---- Increase or decrease item quantity ----
    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === product);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    // ---- Save shipping address ----
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload));
    },

    // ---- Set payment method ----
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    // ---- Clear the cart (after order is placed) ----
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
