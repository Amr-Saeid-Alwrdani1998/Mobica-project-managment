import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    city: String,
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
