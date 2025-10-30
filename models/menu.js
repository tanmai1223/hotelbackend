import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  image: String,
  name: String,
  description: String,
  price: Number,
  averageTime: Number,
  category: String,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
