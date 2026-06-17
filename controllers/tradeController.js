// controllers/tradeController.js
import Wallet from "../models/wallet.js";
import Trade from "../models/trade.js";
import Transaction from "../models/transaction.js";
import { getLivePrice, isSupportedAsset } from "../services/marketService.js";

// 💰 Buy crypto
export const buyCrypto = async (req, res) => {
  try {
    const { crypto } = req.body;
    const amountUSD = Number(req.body.amountUSD);
    const symbol = String(crypto || '').toUpperCase();
    if (!isSupportedAsset(symbol)) return res.status(400).json({ message: "Invalid crypto" });
    if (amountUSD <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < amountUSD) return res.status(400).json({ message: "Insufficient funds" });

    const market = await getLivePrice(symbol);
    if (!market?.price) return res.status(502).json({ message: "Unable to fetch live price" });

    const cryptoAmount = amountUSD / market.price;

    // FIX: Update both balance field and holdings Map
    wallet.balance -= amountUSD;
    wallet.updateHolding("USD", -amountUSD);
    wallet.updateHolding(symbol, cryptoAmount);

    await wallet.save();

    const trade = await Trade.create({
      user: req.user._id,
      type: "buy",
      crypto: symbol,
      amountUSD,
      amountCrypto: cryptoAmount,
      priceAtTrade: market.price,
    });

    await Transaction.create({
      user: req.user._id,
      wallet: wallet._id,
      trade: trade._id,
      type: "buy",
      asset: symbol,
      crypto: symbol,
      amountUSD,
      amountCrypto: cryptoAmount,
      priceAtTrade: market.price,
      balanceBefore: wallet.balance + amountUSD,
      balanceAfter: wallet.balance,
      description: `Bought ${cryptoAmount} ${symbol}`,
      status: "completed",
    });

    res.status(200).json({
      message: "Buy successful",
      walletBalance: wallet.balance,
      priceSource: market.source,
      trade,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💸 Sell crypto
export const sellCrypto = async (req, res) => {
  try {
    const { crypto } = req.body;
    const amountCrypto = Number(req.body.amountCrypto);
    const symbol = String(crypto || '').toUpperCase();
    if (!isSupportedAsset(symbol)) return res.status(400).json({ message: "Invalid crypto" });
    if (amountCrypto <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    // FIX: Check holdings Map directly instead of re-tallying all trades
    if (!wallet.hasSufficient(symbol, amountCrypto)) {
      return res.status(400).json({ message: "Not enough crypto to sell" });
    }

    const market = await getLivePrice(symbol);
    if (!market?.price) return res.status(502).json({ message: "Unable to fetch live price" });

    const amountUSD = amountCrypto * market.price;

    // FIX: Update both balance field and holdings Map
    wallet.balance += amountUSD;
    wallet.updateHolding(symbol, -amountCrypto);
    wallet.updateHolding("USD", amountUSD);

    await wallet.save();

    const trade = await Trade.create({
      user: req.user._id,
      type: "sell",
      crypto: symbol,
      amountUSD,
      amountCrypto,
      priceAtTrade: market.price,
    });

    await Transaction.create({
      user: req.user._id,
      wallet: wallet._id,
      trade: trade._id,
      type: "sell",
      asset: symbol,
      crypto: symbol,
      amountCrypto,
      amountUSD,
      priceAtTrade: market.price,
      balanceBefore: wallet.balance - amountUSD,
      balanceAfter: wallet.balance,
      description: `Sold ${amountCrypto} ${symbol}`,
      status: "completed",
    });

    res.status(200).json({
      message: "Sell successful",
      walletBalance: wallet.balance,
      priceSource: market.source,
      trade,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📜 Get trade history
export const getTradeHistory = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const parsedLimit = Math.min(parseInt(limit, 10) || 50, 100);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const query = { user: req.user._id };
    const [trades, total] = await Promise.all([
      Trade.find(query).sort({ createdAt: -1 }).limit(parsedLimit).skip(skip),
      Trade.countDocuments(query),
    ]);

    res.status(200).json({
      trades,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trade history", error: error.message });
  }
};
