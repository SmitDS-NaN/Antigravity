import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitAdvisory, getAdvisoryReport } from '../controllers/advisoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all advisory routes
router.use(authMiddleware);

// Rate limiter for AI advisory generation (protects Gemini quotas and billing)
const advisoryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each client to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate limit exceeded: You have submitted too many advisory requests. Please wait a few minutes before trying again.'
  }
});

router.post('/', advisoryRateLimiter, submitAdvisory);
router.get('/:id', getAdvisoryReport);

export default router;
