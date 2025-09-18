const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  getHomeData,
  togglePlaylistLike,
  togglePlaylistSave,
  incrementPlaylistView,
  getRealtimeStats
} = require('../controllers/homeController');

// Get home page data (certified, friends, community)
router.get('/data', optionalAuth, getHomeData);

// Playlist interactions
router.post('/playlists/:playlistId/like', optionalAuth, togglePlaylistLike);
router.post('/playlists/:playlistId/save', optionalAuth, togglePlaylistSave);
router.post('/playlists/:playlistId/view', incrementPlaylistView);

// Real-time statistics
router.get('/stats', getRealtimeStats);

module.exports = router;