import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import { Post } from '../../../shared/types'
import { Edit3 } from 'lucide-react'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user?.bio || '')

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user])

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${user?.id}/posts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handleBioUpdate = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      })

      if (response.ok) {
        setIsEditing(false)
        // Update local user data
        if (user) {
          user.bio = bio
          localStorage.setItem('user', JSON.stringify(user))
        }
      }
    } catch (error) {
      console.error('Error updating bio:', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Bio */}
            <div className="mb-4">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="input-field resize-none"
                    maxLength={200}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBioUpdate}
                      className="btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setBio(user.bio || '')
                        setIsEditing(false)
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {bio || "No bio yet. Click 'Edit Profile' to add one!"}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex space-x-8 text-sm">
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{posts.length}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">0</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">0</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Create Post Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CreatePost onPostCreated={handlePostCreated} />
      </motion.div>

      {/* User Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Posts
        </h2>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="post-card animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-4">
              You haven't posted anything yet.
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first post above to get started!
            </p>
          </div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <PostCard post={post} onUpdate={fetchUserPosts} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}

export default Profile
