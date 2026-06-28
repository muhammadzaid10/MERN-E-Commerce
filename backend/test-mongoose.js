import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, select: false }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("TestUser", userSchema);

async function run() {
  await mongoose.connect("mongodb://localhost:27017/ecommerce-test");
  await User.deleteMany({});
  
  // Create user
  await User.create({ email: "test@test.com", password: "oldpassword" });
  
  // Find user without password selected
  const user = await User.findOne({ email: "test@test.com" });
  
  // Update password
  user.password = "newpassword";
  await user.save();
  
  // Find again with password and compare
  const userWithPass = await User.findOne({ email: "test@test.com" }).select("+password");
  const isCorrectOld = await userWithPass.comparePassword("oldpassword");
  const isCorrectNew = await userWithPass.comparePassword("newpassword");
  
  console.log("Is old password correct?", isCorrectOld);
  console.log("Is new password correct?", isCorrectNew);
  console.log("Hashed password stored:", userWithPass.password);
  
  process.exit(0);
}
run();
