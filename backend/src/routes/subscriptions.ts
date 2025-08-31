import { Router } from 'express';
import { toggleSubscription } from '../controllers/subscriptions.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Routes
router.post('/:userId', authMiddleware, toggleSubscription);

export { router as subscriptionRoutes };
