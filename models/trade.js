// models/Trade.js
import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    // 👤 Reference to the user who made the trade
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 💱 Type of trade: buy or sell
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },

    // 🪙 The cryptocurrency involved (e.g., "BTC", "ETH")
    crypto: {
      type: String,
      required: true,
    },

    // 💵 USD amount involved (required for buy)
    amountUSD: {
      type: Number,
    },

    // 🧮 Crypto amount involved (required for sell)
    amountCrypto: {
      type: Number,
    },

    // 📊 Price of the crypto at the time of trade
    priceAtTrade: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// 🧠 Conditional validation: enforce field presence by trade type
tradeSchema.pre("validate", function (next) {
  if (this.type === "buy" && !this.amountUSD) {
    return next(new Error("Buy trades must include amountUSD"));
  }
  if (this.type === "sell" && !this.amountCrypto) {
    return next(new Error("Sell trades must include amountCrypto"));
  }
  next();
});

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;
