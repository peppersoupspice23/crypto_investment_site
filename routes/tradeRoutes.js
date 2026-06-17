import express from 'express';
import { 
  buyCrypto, 
  sellCrypto, 
  getTradeHistory
} from '../controllers/tradeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 💰 Buy crypto
router.post('/buy', authMiddleware, buyCrypto);

// 💸 Sell crypto
router.post('/sell', authMiddleware, sellCrypto);

// 📜 Get trade history
router.get('/history', authMiddleware, getTradeHistory);

export default router;