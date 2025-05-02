import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
export default mongoose.models?.Budget ||
  mongoose.model("Budget", BudgetSchema);
