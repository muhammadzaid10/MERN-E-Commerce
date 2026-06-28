// ==========================================
// Redux Store — App ka central state management
// ==========================================
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // User login/register ka state
    product: productReducer, // Products ka state
    cart: cartReducer, // Cart ka state
    order: orderReducer, // Orders ka state
  },
});

export default store;
