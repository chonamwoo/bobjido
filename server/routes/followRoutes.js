const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus
} = require('../controllers/followController');

// 모든 라우트는 인증 필요
router.use(protect);

router.post('/:userId/follow', followUser);
router.delete('/:userId/unfollow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/status', checkFollowStatus);

module.exports = router;