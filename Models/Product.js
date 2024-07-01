import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  url: { type: String },
  companyImage: { type: String, required: true },
  servicesImages: { type: [String] },  // Allow multiple images
  description: { type: String, required: true },
  contactNumber: { type: String, required: true },
  aboutCompany: { type: String, required: true },
  companyCategory: { type: String, required: true },  
  userEmail: { type: String, required: true }, 
  status: { type: String, default: 'Not approved' },
  createdAt: { type: Date, default: Date.now },
});

export const Products = mongoose.model("Products", productSchema);
