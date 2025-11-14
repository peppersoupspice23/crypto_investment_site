// controllers/tradeController.js
import Wallet from "../models/Wallet.js";
import Trade from "../models/trade.js";
import Transaction from "../models/transaction.js";

// Dummy crypto prices (replace with real API later)
const CRYPTO_PRICES = {
  BTC: 30000,
  ETH: 2000,
};

// 💰 Buy crypto
export const buyCrypto = async (req, res) => {
  try {
    const { crypto, amountUSD } = req.body;
    if (!CRYPTO_PRICES[crypto]) return res.status(400).json({ message: "Invalid crypto" });
    if (amountUSD <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < amountUSD) return res.status(400).json({ message: "Insufficient funds" });

    const cryptoAmount = amountUSD / CRYPTO_PRICES[crypto];
    wallet.balance -= amountUSD;
    await wallet.save();

       // Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "buy",
      crypto,
      amountUSD,
      amountCrypto: cryptoAmount,
      priceAtTrade: CRYPTO_PRICES[crypto]
    });

    const trade = await Trade.create({
      user: req.user._id,
      type: "buy",
      crypto,
      amountUSD,
      amountCrypto: cryptoAmount,
      priceAtTrade: CRYPTO_PRICES[crypto],
    });

    res.status(200).json({
      message: "Buy successful",
      walletBalance: wallet.balance,
      trade,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💸 Sell crypto
export const sellCrypto = async (req, res) => {
  try {
    const { crypto, amountCrypto } = req.body;
    if (!CRYPTO_PRICES[crypto]) return res.status(400).json({ message: "Invalid crypto" });
    if (amountCrypto <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // Calculate total crypto owned
    const trades = await Trade.find({ user: req.user._id, crypto });
    const totalBought = trades.filter(t => t.type === "buy").reduce((acc, t) => acc + t.amountCrypto, 0);
    const totalSold = trades.filter(t => t.type === "sell").reduce((acc, t) => acc + t.amountCrypto, 0);
    const cryptoOwned = totalBought - totalSold;

    if (cryptoOwned < amountCrypto) return res.status(400).json({ message: "Not enough crypto to sell" });

    const amountUSD = amountCrypto * CRYPTO_PRICES[crypto];
    wallet.balance += amountUSD;
    await wallet.save();
    
     // Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "sell",
      crypto,
      amountUSD,
      amountCrypto,
      priceAtTrade: CRYPTO_PRICES[crypto]
    });


    const trade = await Trade.create({
      user: req.user._id,
      type: "sell",
      crypto,
      amountCrypto,
      amountUSD,
      priceAtTrade: CRYPTO_PRICES[crypto],
    });

    res.status(200).json({
      message: "Sell successful",
      walletBalance: wallet.balance,
      trade,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 📜 Get trade history
export const getTradeHistory = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (!trades.length)
      return res.status(404).json({ message: "No trades found for this user" });

    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trade history", error: error.message });
  }
};
