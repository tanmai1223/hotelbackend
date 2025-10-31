import mongoose from "mongoose";

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  activeOrders: { type: Number, required: true, default: 0 },
});

const Chef = mongoose.model("Chef", chefSchema);
export default Chef;
