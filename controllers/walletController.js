import Wallet from "../models/Wallet.js";
import Transaction from "../models/transaction.js";

// 🪙 Get wallet balance
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💵 Deposit money
export const deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    wallet.balance += amount;
    await wallet.save();

      // Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amountUSD: amount
    });

    res.json({ message: "Deposit successful", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💸 Withdraw money
export const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    wallet.balance -= amount;
    await wallet.save();

      // Log transaction
    await Transaction.create({
      user: req.user._id,
      type: "withdrawal",
      amountUSD: amount
    });


    res.json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
