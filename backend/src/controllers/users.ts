import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { db, dbGet, dbAll, dbRun } from '../utils/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await dbGet(
      'SELECT id, username, email, avatar, bio, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { userId } = req.params;
    const { bio } = req.body;
    const authenticatedUserId = req.user?.id;

    if (authenticatedUserId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own profile'
      });
    }

    await dbRun(
      'UPDATE users SET bio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [bio, userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await dbAll(`
      SELECT 
        p.id,
        p.content,
        p.author_id,
        p.created_at,
        p.updated_at,
        u.username,
        u.email,
        u.avatar,
        u.bio,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      authorId: post.author_id,
      author: {
        id: post.author_id,
        username: post.username,
        email: post.email,
        avatar: post.avatar,
        bio: post.bio,
        createdAt: post.user_created_at,
        updatedAt: post.user_updated_at
      },
      likes: post.likes,
      comments: post.comments,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }));

    res.json({
      success: true,
      data: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
