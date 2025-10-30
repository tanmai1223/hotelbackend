import mongoose from "mongoose";

const TableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true ,unique:true},
  tableSize: {
    type: Number,
    enum: [2, 4, 6, 8], 
    required: true,
  },
  flag:{type:Boolean,default:false}
});

const Table = mongoose.models.Table || mongoose.model("Table", TableSchema);

export default Table;
