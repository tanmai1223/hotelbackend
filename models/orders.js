import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true }, // ✅ unique for identifying existing client
  orderItem: [
    {
      name: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price:{type:Number,required:true},
    },
  ],
  averageTime: { type: Number, required: true },
  time: { type: Date, default: Date.now }, // ✅ automatically set when order is created
  dineIn: { type: Boolean, default: false },
  status: { type: String, default: "processing" }, // ✅ lowercase for consistency
  chef: String,
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" }, // ✅ references Table model
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
