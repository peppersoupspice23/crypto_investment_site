import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from "./routes/walletRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/transactions", transactionRoutes); 

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Crypto Investment API is running...');
});
// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
