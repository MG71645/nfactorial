import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Post } from '../../../shared/types'

interface CreatePostProps {
  onPostCreated: (post: Post) => void
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        setContent('')
        onPostCreated(data.data)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts with the world..."
            rows={3}
            className="input-field resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {content.length}/500 characters
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={20} />
            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default CreatePost
