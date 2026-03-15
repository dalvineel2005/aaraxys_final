import express from 'express';
import { updateFunds } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/funds', protect, updateFunds);

export default router;
