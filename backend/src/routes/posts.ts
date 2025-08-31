import { Router } from 'express';
import { body } from 'express-validator';
import { getPosts, createPost, getUserPosts } from '../controllers/posts.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Validation middleware
const createPostValidation = [
  body('content').isLength({ min: 1, max: 500 }).trim().escape()
];

// Routes
router.get('/', getPosts);
router.post('/', authMiddleware, createPostValidation, createPost);
router.get('/user/:userId', getUserPosts);

export { router as postRoutes };
