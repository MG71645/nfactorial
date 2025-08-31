import { Router } from 'express';
import { body } from 'express-validator';
import { createComment } from '../controllers/comments.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Validation middleware
const createCommentValidation = [
  body('content').isLength({ min: 1, max: 500 }).trim().escape(),
  body('postId').notEmpty()
];

// Routes
router.post('/', authMiddleware, createCommentValidation, createComment);

export { router as commentRoutes };
