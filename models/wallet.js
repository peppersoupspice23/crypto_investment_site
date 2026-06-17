import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    
    // KEEP for backward compatibility
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    
    // NEW: Store all crypto holdings
    holdings: {
      type: Map,
      of: Number,
      default: function() {
        return new Map([['USD', this.balance || 0]]);
      }
    },
    
    // NEW: Portfolio metadata
    name: {
      type: String,
      default: 'Main Wallet'
    },
    
    type: {
      type: String,
      enum: ['demo', 'live'],
      default: 'demo'
    },
    
    isActive: {
      type: Boolean,
      default: true
    },
    
    totalValueUSD: {
      type: Number,
      default: 0
    },
    
    initialCapital: {
      type: Number,
      default: 10000
    }
  },
  { timestamps: true }
);

// Virtual for easy access to USD balance
walletSchema.virtual('balanceUSD').get(function() {
  return this.holdings?.get('USD') || this.balance || 0;
});

// Method: Get holding for specific crypto
walletSchema.methods.getHolding = function(asset) {
  return this.holdings?.get(asset) || 0;
};

// Method: Update holding
walletSchema.methods.updateHolding = function(asset, amount) {
  if (!this.holdings) {
    this.holdings = new Map();
  }
  const current = this.holdings.get(asset) || 0;
  this.holdings.set(asset, current + amount);
  
  // Keep balance field synced for USD
  if (asset === 'USD') {
    this.balance = this.holdings.get('USD');
  }
};

// Method: Check if has sufficient balance
walletSchema.methods.hasSufficient = function(asset, amount) {
  const holding = this.holdings?.get(asset) || 0;
  return holding >= amount;
};

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;