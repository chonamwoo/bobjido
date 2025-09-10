const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/auth');

// Follow a user
router.post('/follow/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    if (userId === currentUserId) {
      return res.status(400).json({ message: '자기 자신을 팔로우할 수 없습니다' });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(userId)
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // Check if already following
    const isFollowing = currentUser.following.some(f => f.user.toString() === userId);
    if (isFollowing) {
      return res.status(400).json({ message: '이미 팔로우하고 있습니다' });
    }

    // Add to following list
    currentUser.following.push({
      user: userId,
      followedAt: new Date()
    });

    // Add to target's followers list
    targetUser.followers.push({
      user: currentUserId,
      followedAt: new Date()
    });

    await Promise.all([
      currentUser.save(),
      targetUser.save()
    ]);

    res.json({
      message: '팔로우 성공',
      following: currentUser.following.length,
      targetFollowers: targetUser.followers.length
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Unfollow a user
router.delete('/unfollow/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(userId)
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      f => f.user.toString() !== userId
    );

    // Remove from target's followers list
    targetUser.followers = targetUser.followers.filter(
      f => f.user.toString() !== currentUserId
    );

    await Promise.all([
      currentUser.save(),
      targetUser.save()
    ]);

    res.json({
      message: '언팔로우 성공',
      following: currentUser.following.length,
      targetFollowers: targetUser.followers.length
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Get following list
router.get('/following', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('following.user', 'username profileImage bio tasteProfile')
      .lean();

    const following = user.following.map(f => ({
      ...f.user,
      followedAt: f.followedAt
    }));

    res.json({ following, total: following.length });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Get followers list
router.get('/followers', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('followers.user', 'username profileImage bio tasteProfile')
      .lean();

    const followers = user.followers.map(f => ({
      ...f.user,
      followedAt: f.followedAt
    }));

    res.json({ followers, total: followers.length });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Like a restaurant
router.post('/restaurants/:restaurantId/like', protect, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.userId;

    const [user, restaurant] = await Promise.all([
      User.findById(userId),
      Restaurant.findById(restaurantId)
    ]);

    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }

    // Check if already liked
    const isLiked = user.likedRestaurants.some(
      r => r.restaurant.toString() === restaurantId
    );

    if (isLiked) {
      // Unlike
      user.likedRestaurants = user.likedRestaurants.filter(
        r => r.restaurant.toString() !== restaurantId
      );
      restaurant.likes = Math.max(0, (restaurant.likes || 0) - 1);
    } else {
      // Like
      user.likedRestaurants.push({
        restaurant: restaurantId,
        likedAt: new Date()
      });
      restaurant.likes = (restaurant.likes || 0) + 1;
    }

    await Promise.all([
      user.save(),
      restaurant.save()
    ]);

    res.json({
      liked: !isLiked,
      totalLikes: restaurant.likes
    });
  } catch (error) {
    console.error('Like restaurant error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Save a restaurant
router.post('/restaurants/:restaurantId/save', protect, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.userId;

    const [user, restaurant] = await Promise.all([
      User.findById(userId),
      Restaurant.findById(restaurantId)
    ]);

    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }

    // Check if already saved
    const isSaved = user.savedRestaurants.some(
      r => r.restaurant.toString() === restaurantId
    );

    if (isSaved) {
      // Unsave
      user.savedRestaurants = user.savedRestaurants.filter(
        r => r.restaurant.toString() !== restaurantId
      );
    } else {
      // Save
      user.savedRestaurants.push({
        restaurant: restaurantId,
        savedAt: new Date()
      });
    }

    await user.save();

    res.json({
      saved: !isSaved
    });
  } catch (error) {
    console.error('Save restaurant error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Like a playlist
router.post('/playlists/:playlistId/like', protect, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.userId;

    const [user, playlist] = await Promise.all([
      User.findById(userId),
      Playlist.findById(playlistId)
    ]);

    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    // Check if already liked
    const isLiked = user.likedPlaylists.some(
      p => p.toString() === playlistId
    );

    if (isLiked) {
      // Unlike
      user.likedPlaylists = user.likedPlaylists.filter(
        p => p.toString() !== playlistId
      );
      playlist.likes = playlist.likes.filter(
        l => l.toString() !== userId
      );
    } else {
      // Like
      user.likedPlaylists.push(playlistId);
      playlist.likes.push(userId);
    }

    await Promise.all([
      user.save(),
      playlist.save()
    ]);

    res.json({
      liked: !isLiked,
      totalLikes: playlist.likes.length
    });
  } catch (error) {
    console.error('Like playlist error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Save a playlist
router.post('/playlists/:playlistId/save', protect, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    // Check if already saved
    const isSaved = user.savedPlaylists.some(
      p => p.toString() === playlistId
    );

    if (isSaved) {
      // Unsave
      user.savedPlaylists = user.savedPlaylists.filter(
        p => p.toString() !== playlistId
      );
    } else {
      // Save
      user.savedPlaylists.push(playlistId);
    }

    await user.save();

    res.json({
      saved: !isSaved
    });
  } catch (error) {
    console.error('Save playlist error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Get user's social stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('following followers likedRestaurants likedPlaylists savedRestaurants savedPlaylists')
      .lean();

    res.json({
      followingCount: user.following.length,
      followersCount: user.followers.length,
      likedRestaurantsCount: user.likedRestaurants.length,
      likedPlaylistsCount: user.likedPlaylists.length,
      savedRestaurantsCount: user.savedRestaurants.length,
      savedPlaylistsCount: user.savedPlaylists.length
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Get liked items
router.get('/likes', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('likedRestaurants.restaurant', 'name category location rating image')
      .populate('likedPlaylists', 'title description restaurants category')
      .lean();

    res.json({
      restaurants: user.likedRestaurants,
      playlists: user.likedPlaylists
    });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// Get saved items
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('savedRestaurants.restaurant', 'name category location rating image')
      .populate('savedPlaylists', 'title description restaurants category')
      .lean();

    res.json({
      restaurants: user.savedRestaurants,
      playlists: user.savedPlaylists
    });
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;