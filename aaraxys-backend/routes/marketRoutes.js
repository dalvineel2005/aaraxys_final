import express from 'express';
import { getHistoricalData } from '../controllers/marketController.js';

const router = express.Router();

// GET /api/market/history/:symbol?timeframe=1D
router.get('/history/:symbol', getHistoricalData);

export default router;
