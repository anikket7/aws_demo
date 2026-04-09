import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    type: { type: String, required: true, enum: ["income", "expense"] },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
