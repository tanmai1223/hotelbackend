import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  orderItem: [
    {
      name: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  averageTime: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  dineIn: { type: Boolean, default: false },
  status: { type: String, default: "processing" },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef" }, 
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
