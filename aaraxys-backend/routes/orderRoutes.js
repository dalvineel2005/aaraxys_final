import express from 'express';
import { createOrder, getMyOrders, getPortfolio } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getMyOrders);
router.route('/portfolio').get(protect, getPortfolio);

export default router;
