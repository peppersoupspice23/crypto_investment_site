
// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdrawal", "buy", "sell"], required: true },
    crypto: { type: String },           // Only for buy/sell
    amountUSD: { type: Number },        // For all
    amountCrypto: { type: Number },     // Only for buy/sell
    priceAtTrade: { type: Number },     // Only for buy/sell
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
