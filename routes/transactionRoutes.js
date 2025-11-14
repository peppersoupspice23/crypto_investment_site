import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getTransactionHistory } from "../controllers/transactionController.js";

const router = express.Router();

// Secure route
router.get("/", authMiddleware, getTransactionHistory);

export default router;
