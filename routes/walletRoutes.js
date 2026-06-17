// routes/walletRoutes.js - MERGED VERSION
import express from "express";
import { 
  getWallet, 
  deposit, 
  withdraw,
  getHoldings,        // NEW
  getTransactions,    // NEW
  getPerformance      // NEW
} from "../controllers/walletController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ============================================
// EXISTING ROUTES (unchanged, backward compatible)
// ============================================
router.get("/", authMiddleware, getWallet);
router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);

// ============================================
// NEW ROUTES (additions, don't break existing)
// ============================================

// 📊 Get detailed holdings breakdown
router.get("/holdings", authMiddleware, getHoldings);

// 📋 Get transaction history with pagination
router.get("/transactions", authMiddleware, getTransactions);

// 📈 Get portfolio performance metrics
router.get("/performance", authMiddleware, getPerformance);

export default router;