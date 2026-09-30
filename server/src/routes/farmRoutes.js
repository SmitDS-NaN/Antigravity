import { Router } from 'express';
import { getFarms, createFarm } from '../controllers/farmController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all farm routes
router.use(authMiddleware);

router.get('/', getFarms);
router.post('/', createFarm);

export default router;
