import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Post } from '../../../shared/types'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'

interface PostCardProps {
  post: Post
  onUpdate: () => void
}

const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  // Инициализируем состояние лайка при загрузке
  useEffect(() => {
    // Здесь можно добавить проверку, лайкнул ли пользователь этот пост
    // Пока оставляем как есть
  }, [post.id])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) return

    try {
      const response = await fetch(`/api/likes/${post.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const newLikeState = !isLiked
        setIsLiked(newLikeState)
        
        // Обновляем счетчик лайков
        if (newLikeState) {
          setLikeCount(prev => prev + 1)
        } else {
          setLikeCount(prev => Math.max(0, prev - 1))
        }
        
        // Вызываем callback для обновления родительского компонента
        onUpdate()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !comment.trim()) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          content: comment.trim(),
        }),
      })

      if (response.ok) {
        setComment('')
        onUpdate()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInMinutes < 1) return t('time.now')
    if (diffInMinutes < 60) return t('time.minutesAgo', diffInMinutes)
    if (diffInHours < 24) return t('time.hoursAgo', diffInHours)
    if (diffInDays < 7) return t('time.daysAgo', diffInDays)
    
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="post-card"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {post.author.username}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </div>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <MoreHorizontal size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 dark:text-white leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            type="button"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            type="button"
            className="flex items-center space-x-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <MessageCircle size={20} />
            <span>{post.comments || 0}</span>
          </button>

          {/* Share Button */}
          <button 
            type="button"
            className="flex items-center space-x-2 px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <Share2 size={20} />
            <span>{t('posts.share')}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          {/* Add Comment */}
          {user && (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('posts.comment')}
                  className="flex-1 input-field"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('posts.comment')}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {/* Placeholder for comments */}
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t('posts.comments')} {t('common.loading')}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PostCard
