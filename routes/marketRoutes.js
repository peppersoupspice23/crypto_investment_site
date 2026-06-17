import express from 'express';
import { getHistory, getPrices } from '../controllers/marketController.js';

const router = express.Router();

router.get('/prices', getPrices);
router.get('/history/:symbol', getHistory);

export default router;
