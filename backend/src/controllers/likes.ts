import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, dbGet, dbRun } from '../utils/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Check if post exists
    const post = await dbGet('SELECT id FROM posts WHERE id = ?', [postId]);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = await dbGet(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLike) {
      // Unlike the post
      await dbRun(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );

      res.json({
        success: true,
        message: 'Post unliked successfully',
        liked: false
      });
    } else {
      // Like the post
      const likeId = uuidv4();
      await dbRun(
        'INSERT INTO likes (id, post_id, user_id) VALUES (?, ?, ?)',
        [likeId, postId, userId]
      );

      res.json({
        success: true,
        message: 'Post liked successfully',
        liked: true
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
