import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  companyWebsite: { type: String },
  role: { type: String, default: 'businessuser' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
