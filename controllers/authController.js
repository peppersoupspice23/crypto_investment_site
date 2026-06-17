import User from '../models/userModel.js';
import Wallet from "../models/wallet.js";
import Transaction from "../models/transaction.js";

const DEMO_STARTING_BALANCE = 10000;

// 🧾 Register user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, email, password });
    const wallet = await Wallet.create({
      user: user._id,
      balance: DEMO_STARTING_BALANCE,
      holdings: new Map([['USD', DEMO_STARTING_BALANCE]]),
      initialCapital: DEMO_STARTING_BALANCE,
    });

    await Transaction.create({
      user: user._id,
      wallet: wallet._id,
      type: 'deposit',
      asset: 'USD',
      amountUSD: DEMO_STARTING_BALANCE,
      balanceBefore: 0,
      balanceAfter: DEMO_STARTING_BALANCE,
      description: 'Demo starting balance',
      status: 'completed',
    });
    const token = user.getJWT();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (err) {
    // Surface Mongoose validation errors clearly
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// 🔑 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isValid = await user.validatePassword(password);
    if (!isValid)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = user.getJWT();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
