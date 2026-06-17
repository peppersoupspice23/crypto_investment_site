
// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    trade: { type: mongoose.Schema.Types.ObjectId, ref: "Trade" },
    type: { type: String, enum: ["deposit", "withdrawal", "buy", "sell"], required: true },
    asset: { type: String },
    crypto: { type: String },           // Only for buy/sell
    amountUSD: { type: Number },        // For all
    amountCrypto: { type: Number },     // Only for buy/sell
    priceAtTrade: { type: Number },     // Only for buy/sell
    balanceBefore: { type: Number },
    balanceAfter: { type: Number },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
