const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  addComment,
  deleteComment,
  getTrendingPosts,
  getUserPosts
} = require('../controllers/communityController');

// Public routes (with optional auth for user interactions)
router.get('/posts', optionalAuth, getPosts);
router.get('/posts/trending', optionalAuth, getTrendingPosts);
router.get('/posts/:id', optionalAuth, getPost);
router.get('/users/:username/posts', optionalAuth, getUserPosts);

// Protected routes (require authentication)
router.post('/posts', protect, createPost);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/save', protect, toggleSave);
router.post('/posts/:id/comments', protect, addComment);
router.delete('/posts/:id/comments/:commentId', protect, deleteComment);

module.exports = router;