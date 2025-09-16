const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getUser,
  followUser,
  getUserPlaylists,
  getSavedPlaylists,
  updateProfileImage,
  updateProfile,
  deleteAccount,
  getFollowers,
  getFollowing,
  getUserProfile,
  getAvailableUsers,
} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'));
    }
  }
});

// 채팅 가능한 사용자 목록 (맨 위에 위치 - 더 구체적인 경로)
router.get('/available', optionalAuth, getAvailableUsers);

router.get('/:username', optionalAuth, getUser);
router.get('/:username/profile', optionalAuth, getUserProfile);
router.post('/:username/follow', protect, followUser);
router.get('/:username/playlists', optionalAuth, getUserPlaylists);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);
router.get('/saved/playlists', protect, getSavedPlaylists);
router.post('/profile-image', protect, upload.single('image'), updateProfileImage);
router.put('/profile', protect, updateProfile);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;