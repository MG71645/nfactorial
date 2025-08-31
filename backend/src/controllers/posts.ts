import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { dbGet, dbAll, dbRun } from '../utils/database-hybrid.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPosts = async (req: Request, res: Response) => {
  try {
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
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

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
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const postId = uuidv4();
    
    await dbRun(
      'INSERT INTO posts (id, content, author_id) VALUES (?, ?, ?)',
      [postId, content, userId]
    );

    // Get the created post with author info
    const post = await dbGet(`
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
        u.updated_at as user_updated_at
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `, [postId]);

    const formattedPost = {
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
      likes: 0,
      comments: 0,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    };

    res.status(201).json({
      success: true,
      data: formattedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
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
