const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getPlaylists,
  getTrendingPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addRestaurantToPlaylist,
  removeRestaurantFromPlaylist,
  reorderPlaylistRestaurants,
  likePlaylist,
  savePlaylist,
  remixPlaylist,
  completePlaylist,
  getThemedCollections,
  getRecommendedPlaylists,
  uploadCoverImage,
  updateRestaurantRating,
  getRestaurantRatings,
  getPlaylistsByUser,
} = require('../controllers/playlistController');

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'playlist-cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  }
});

router.get('/', optionalAuth, getPlaylists);
router.get('/trending', optionalAuth, getTrendingPlaylists);
router.get('/themes', optionalAuth, getThemedCollections);
router.get('/recommended', optionalAuth, getRecommendedPlaylists);
router.get('/user/:userId', optionalAuth, getPlaylistsByUser);
router.get('/:id', optionalAuth, getPlaylist);
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/restaurants', protect, addRestaurantToPlaylist);
router.delete('/:id/restaurants/:restaurantId', protect, removeRestaurantFromPlaylist);
router.put('/:id/restaurants/reorder', protect, reorderPlaylistRestaurants);
router.put('/:id/restaurants/:restaurantId/rating', protect, updateRestaurantRating);
router.get('/:id/ratings', optionalAuth, getRestaurantRatings);
router.post('/:id/view', optionalAuth, async (req, res) => {
  try {
    const Playlist = require('../models/Playlist');
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // incrementView 메서드가 있으면 사용, 없으면 직접 증가
    if (playlist.incrementView) {
      await playlist.incrementView(req.user?._id);
    } else {
      playlist.viewCount = (playlist.viewCount || 0) + 1;
      await playlist.save();
    }

    res.json({ success: true, viewCount: playlist.viewCount });
  } catch (error) {
    console.error('View count increment error:', error);
    res.status(500).json({ message: 'Failed to increment view count' });
  }
});
router.post('/:id/like', protect, likePlaylist);
router.post('/:id/save', protect, savePlaylist);
router.post('/:id/remix', protect, remixPlaylist);
router.post('/:id/complete', protect, completePlaylist);
router.post('/:id/cover', protect, upload.single('coverImage'), uploadCoverImage);

module.exports = router;