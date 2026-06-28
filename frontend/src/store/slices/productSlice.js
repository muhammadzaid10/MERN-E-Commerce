// ==========================================
// Product Slice — Products ka state management
// ==========================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ---- Sab products lo (search, filter, sort, page) ----
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async ({ search = "", category = "", page = 1, sortByPrice = "" } = {}, { rejectWithValue }) => {
    try {
      let url = `/product/all?page=${page}`;
      if (search) url += `&search=${search}`;
      if (category) url += `&category=${category}`;
      if (sortByPrice) url += `&sortByPrice=${sortByPrice}`;

      const { data } = await api.get(url);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Products load fail");
    }
  }
);

// ---- Ek product ki detail lo ----
export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingle",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Product load fail");
    }
  }
);

// ---- Categories ki list lo ----
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/product/categories");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ---- Admin: Naya product banao ----
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/product/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Product create fail");
    }
  }
);

// ---- Admin: Product update karo ----
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Product update fail");
    }
  }
);

// ---- Admin: Product delete karo ----
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/product/${id}`);
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Product delete fail");
    }
  }
);

// ---- Review add karo ----
export const addReview = createAsyncThunk(
  "product/addReview",
  async ({ id, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/product/${id}/review`, { rating, comment });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Review add fail");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    relatedProducts: [],
    newProducts: [],
    categories: [],
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Fetch All Products ----
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProducts = action.payload.totalProducts;
        state.newProducts = action.payload.newProduct || [];
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Fetch Single Product ----
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.relatedProducts = action.payload.relatedProduct || [];
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Categories ----
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      })
      // ---- Create Product ----
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Update Product ----
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      // ---- Delete Product ----
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.products = state.products.filter((p) => p._id !== action.payload.id);
      })
      // ---- Add Review ----
      .addCase(addReview.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.product = action.payload.product;
      });
  },
});

export const { clearProductError, clearProductMessage } = productSlice.actions;
export default productSlice.reducer;
