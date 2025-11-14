// routes/tradeRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { buyCrypto, sellCrypto, getTradeHistory } from "../controllers/tradeController.js";


const router = express.Router();

router.post("/buy", authMiddleware, buyCrypto);
router.post("/sell", authMiddleware, sellCrypto);
router.get("/history", authMiddleware, getTradeHistory);


export default router;
