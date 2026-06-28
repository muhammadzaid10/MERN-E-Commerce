import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema — Data structure for ecommerce users
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    // User's email — must be unique
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    // Password — stored as a hash (not plain text)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // When using User.find(), password is excluded by default
    },
    // Role — "user" or "admin"
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Avatar / Profile picture
    avatar: {
      id: String, // Cloudinary public_id
      url: {
        type: String,
        default: "https://res.cloudinary.com/demo/image/upload/v1/default-avatar.png",
      },
    },
  },
  {
    timestamps: true, // createdAt and updatedAt are automatically generated
  }
);

// ==========================================
// MIDDLEWARE: Hash password before saving
// ==========================================
// Runs whenever a new user is created or the password is changed
userSchema.pre("save", async function () {
  // If password was not modified, skip (e.g. when only the name was changed)
  if (!this.isModified("password")) return;

  // Hash the password with bcrypt — 10 rounds of salt
  this.password = await bcrypt.hash(this.password, 10);
});

// ==========================================
// METHOD: Compare passwords (during login)
// ==========================================
// When user logs in, plain password vs hashed password is compared
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;