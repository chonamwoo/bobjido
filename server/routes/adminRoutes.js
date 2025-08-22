const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getPlaylists,
  deletePlaylist,
  getRestaurants,
  verifyRestaurant,
} = require('../controllers/adminController');
const { adminProtect, requirePermission } = require('../middleware/adminAuth');

// 어드민 로그인 (인증 불필요)
router.post('/login', adminLogin);

// 모든 어드민 라우트는 인증 필요
router.use(adminProtect);

// 대시보드
router.get('/dashboard', getDashboardStats);

// 사용자 관리
router.get('/users', requirePermission('user_management'), getUsers);
router.put('/users/:userId/status', requirePermission('user_management'), updateUserStatus);

// 플레이리스트 관리
router.get('/playlists', requirePermission('playlist_management'), getPlaylists);
router.delete('/playlists/:playlistId', requirePermission('playlist_management'), deletePlaylist);

// 맛집 관리
router.get('/restaurants', requirePermission('restaurant_management'), getRestaurants);
router.put('/restaurants/:restaurantId/verify', requirePermission('restaurant_management'), verifyRestaurant);

module.exports = router;