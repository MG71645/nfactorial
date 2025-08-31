import { Router } from 'express';
import { toggleLike } from '../controllers/likes.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Routes
router.post('/:postId', authMiddleware, toggleLike);

export { router as likeRoutes };
