import { Router } from 'express';
import { getHistory } from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all history routes
router.use(authMiddleware);

router.get('/', getHistory);

export default router;
