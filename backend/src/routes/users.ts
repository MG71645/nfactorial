import { Router } from 'express';
import { body } from 'express-validator';
import { getUser, updateUser, getUserPosts } from '../controllers/users.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Validation middleware
const updateUserValidation = [
  body('bio').optional().isLength({ max: 200 }).trim().escape()
];

// Routes
router.get('/:userId', getUser);
router.patch('/:userId', authMiddleware, updateUserValidation, updateUser);
router.get('/:userId/posts', getUserPosts);

export { router as userRoutes };
