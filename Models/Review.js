import mongoose from "mongoose";

const reviewSchema =  new mongoose.Schema({
  Name: { type: String, required: true },
  userEmail: { type: String, required: true },
  productId: { type: String, required: true },
  avatarImage: { type: String,required: true  },
  ratingCount: { type: Number, required: true },
  description: { type: String},
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model("Review", reviewSchema);