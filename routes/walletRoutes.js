import express from "express";
import { getWallet, deposit, withdraw } from "../controllers/walletController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Protected routes
router.get("/", authMiddleware, getWallet);
router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);

export default router;
