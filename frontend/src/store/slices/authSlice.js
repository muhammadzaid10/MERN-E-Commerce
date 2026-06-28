// ==========================================
// Auth Slice — State for Login/Register/Logout
// ==========================================
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// ---- Register (create a new account) ----
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", formData);
      // Save token and user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ---- Login (email + password) ----
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ---- Logout ----
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// ---- Fetch profile ----
export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Profile load failed");
    }
  }
);

// ---- Admin: Get all users ----
export const fetchAllUsers = createAsyncThunk(
  "auth/allUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ---- Admin: Change user role ----
export const updateUserRole = createAsyncThunk(
  "auth/updateRole",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/auth/admin/users/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

let userFromStorage = null;
try {
  const item = localStorage.getItem("user");
  if (item && item !== "undefined") {
    userFromStorage = JSON.parse(item);
  }
} catch (e) {
  console.error("Error parsing user from localStorage:", e);
  localStorage.removeItem("user");
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    isAuthenticated: !!userFromStorage,
    loading: false,
    error: null,
    message: null,
    allUsers: [],
  },
  reducers: {
    // Clear error or message
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Register ----
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Login ----
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ---- Logout ----
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.message = "Logged out successfully";
      })
      // ---- Profile ----
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // ---- All Users (admin) ----
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload.users;
      })
      // ---- Update Role ----
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.message = action.payload.message;
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
