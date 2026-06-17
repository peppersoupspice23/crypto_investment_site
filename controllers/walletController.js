// controllers/walletController.js - MERGED VERSION
import Wallet from "../models/wallet.js";
import Transaction from "../models/transaction.js";
import Trade from "../models/trade.js";
import { getLivePrices } from "../services/marketService.js";

const buildHoldings = async (wallet) => {
  const prices = await getLivePrices();
  const holdings = [];
  let totalValueUSD = 0;

  for (const [asset, amount] of wallet.holdings.entries()) {
    if (amount > 0) {
      const price = asset === 'USD' ? 1 : (prices[asset]?.price || 0);
      const valueUSD = amount * price;
      totalValueUSD += valueUSD;

      holdings.push({
        asset,
        amount,
        price,
        change24h: asset === 'USD' ? 0 : (prices[asset]?.change24h || 0),
        valueUSD,
        percentage: 0,
        source: asset === 'USD' ? 'cash' : (prices[asset]?.source || 'unknown'),
      });
    }
  }

  holdings.forEach(h => {
    h.percentage = totalValueUSD > 0 ? parseFloat(((h.valueUSD / totalValueUSD) * 100).toFixed(2)) : 0;
  });

  return { holdings, totalValueUSD };
};

// ============================================
// 🪙 Get wallet balance - ENHANCED VERSION
// ============================================
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // NEW: If wallet has holdings, return detailed breakdown
    if (wallet.holdings && wallet.holdings.size > 0) {
      const { holdings, totalValueUSD } = await buildHoldings(wallet);

      // Enhanced response with holdings
      return res.json({
        _id: wallet._id,
        user: wallet.user,
        balance: wallet.balance, // Keep for backward compatibility
        currency: wallet.currency,
        holdings, // NEW: Detailed breakdown
        totalValueUSD, // NEW: Total portfolio value
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      });
    }

    // OLD: If no holdings yet, return simple response (backward compatible)
    res.json(wallet);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 💵 Deposit money - ENHANCED VERSION
// ============================================
export const deposit = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const balanceBefore = wallet.balance;

    // Update balance (old way)
    wallet.balance += amount;

    // NEW: Also update holdings if they exist
    if (wallet.holdings && wallet.holdings instanceof Map) {
      wallet.updateHolding('USD', amount);
    } else {
      // Initialize holdings if not present
      wallet.holdings = new Map([['USD', wallet.balance]]);
    }

    await wallet.save();

    // Enhanced transaction logging
    await Transaction.create({
      user: req.user._id,
      wallet: wallet._id, // NEW: Link to wallet
      type: "deposit",
      asset: 'USD', // NEW: Specify asset
      amountUSD: amount,
      balanceBefore, // NEW: Track balance changes
      balanceAfter: wallet.balance,
      description: `Deposit $${amount}`, // NEW: Description
      status: 'completed' // NEW: Status tracking
    });

    res.json({ 
      message: "Deposit successful", 
      balance: wallet.balance,
      // NEW: Return holdings if they exist
      holdings: wallet.holdings ? Object.fromEntries(wallet.holdings) : undefined
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 💸 Withdraw money - ENHANCED VERSION
// ============================================
export const withdraw = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const balanceBefore = wallet.balance;

    // Update balance (old way)
    wallet.balance -= amount;

    // NEW: Also update holdings if they exist
    if (wallet.holdings && wallet.holdings instanceof Map) {
      wallet.updateHolding('USD', -amount);
    } else {
      // Initialize holdings if not present
      wallet.holdings = new Map([['USD', wallet.balance]]);
    }

    await wallet.save();

    // Enhanced transaction logging
    await Transaction.create({
      user: req.user._id,
      wallet: wallet._id, // NEW: Link to wallet
      type: "withdrawal",
      asset: 'USD', // NEW: Specify asset
      amountUSD: amount,
      balanceBefore, // NEW: Track balance changes
      balanceAfter: wallet.balance,
      description: `Withdrawal $${amount}`, // NEW: Description
      status: 'completed' // NEW: Status tracking
    });

    res.json({ 
      message: "Withdrawal successful", 
      balance: wallet.balance,
      // NEW: Return holdings if they exist
      holdings: wallet.holdings ? Object.fromEntries(wallet.holdings) : undefined
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// NEW ENDPOINTS BELOW
// ============================================

// 📊 Get detailed holdings breakdown
export const getHoldings = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (!wallet.holdings || wallet.holdings.size === 0) {
      return res.json({
        holdings: [{ asset: 'USD', amount: wallet.balance, price: 1, valueUSD: wallet.balance, percentage: 100 }],
        totalValueUSD: wallet.balance
      });
    }

    const { holdings, totalValueUSD } = await buildHoldings(wallet);

    res.json({ holdings, totalValueUSD });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || 50, 100);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const query = { user: req.user._id };
    if (type) query.type = type;

    const skip = (parsedPage - 1) * parsedLimit;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .skip(skip)
      .populate('trade', 'type crypto amountUSD amountCrypto');

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📈 Get portfolio performance
export const getPerformance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Calculate current total value
    let totalValueUSD = 0;
    if (wallet.holdings && wallet.holdings.size > 0) {
      totalValueUSD = (await buildHoldings(wallet)).totalValueUSD;
    } else {
      totalValueUSD = wallet.balance;
    }

    // Calculate deposits and withdrawals
    const transactions = await Transaction.find({ user: req.user._id });
    
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + (t.amountUSD || 0), 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + (t.amountUSD || 0), 0);

    const netDeposits = totalDeposits - totalWithdrawals;
    const profitLoss = totalValueUSD - netDeposits;
    const profitLossPercent = netDeposits > 0 
      ? ((profitLoss / netDeposits) * 100).toFixed(2)
      : 0;

    // Get trade statistics
    const trades = await Trade.find({ user: req.user._id });
    const totalTrades = trades.length;
    const totalTradeVolume = trades.reduce((sum, t) => sum + (t.amountUSD || 0), 0);

    res.json({
      currentValue: totalValueUSD,
      netDeposits,
      profitLoss,
      profitLossPercent,
      totalDeposits,
      totalWithdrawals,
      totalTrades,
      totalTradeVolume,
      accountAge: Math.floor((Date.now() - wallet.createdAt) / (1000 * 60 * 60 * 24)) // days
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
