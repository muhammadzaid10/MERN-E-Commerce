// ==========================================
// Order Slice — Order state management
// ==========================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ---- Place a new order ----
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/order/new", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Could not place order"
      );
    }
  }
);

// ---- Get all my orders ----
export const fetchMyOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/order/myorders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ---- Single order detail ----
export const fetchOrderDetail = createAsyncThunk(
  "order/detail",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ---- Admin: Get all orders ----
export const fetchAllOrders = createAsyncThunk(
  "order/allOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/order/admin/all");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ---- Admin: Update order status ----
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/order/${id}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    order: null,
    allOrders: [],
    totalRevenue: 0,
    loading: false,
    error: null,
    message: null,
    orderPlaced: false,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderMessage: (state) => {
      state.message = null;
    },
    resetOrderPlaced: (state) => {
      state.orderPlaced = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Create Order ----
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.order = action.payload.order;
        state.orderPlaced = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- My Orders ----
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Order Detail ----
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      // ---- All Orders (admin) ----
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.orders;
        state.totalRevenue = action.payload.totalRevenue;
        state.loading = false;
      })
      // ---- Update Status ----
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.message = action.payload.message;
      });
  },
});

export const { clearOrderError, clearOrderMessage, resetOrderPlaced } =
  orderSlice.actions;
export default orderSlice.reducer;
