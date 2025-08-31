import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, dbGet, dbRun } from '../utils/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const toggleSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { userId: followingId } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot subscribe to yourself'
      });
    }

    // Check if user to follow exists
    const userToFollow = await dbGet('SELECT id FROM users WHERE id = ?', [followingId]);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already subscribed
    const existingSubscription = await dbGet(
      'SELECT id FROM subscriptions WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    if (existingSubscription) {
      // Unsubscribe
      await dbRun(
        'DELETE FROM subscriptions WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
      );

      res.json({
        success: true,
        message: 'Unsubscribed successfully',
        subscribed: false
      });
    } else {
      // Subscribe
      const subscriptionId = uuidv4();
      await dbRun(
        'INSERT INTO subscriptions (id, follower_id, following_id) VALUES (?, ?, ?)',
        [subscriptionId, followerId, followingId]
      );

      res.json({
        success: true,
        message: 'Subscribed successfully',
        subscribed: true
      });
    }
  } catch (error) {
    console.error('Error toggling subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
