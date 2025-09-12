const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    const playlists = await Playlist.find({ createdBy: user._id, isPublic: true })
      .sort('-createdAt')
      .limit(10)
      .populate('restaurants.restaurant', 'name images');
    
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        rankings: user.rankings,
        trustScore: user.trustScore,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        followers: user.followers.slice(0, 10),
        following: user.following.slice(0, 10),
        visitedRestaurantsCount: user.visitedRestaurants.length,
        isFollowing: req.user ? user.followers.some(f => f._id.toString() === req.user._id.toString()) : false,
      },
      playlists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;
    
    const userToFollow = await User.findOne({ username });
    
    if (!userToFollow) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    if (userToFollow._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: '자기 자신을 팔로우할 수 없습니다' });
    }
    
    const currentUser = await User.findById(currentUserId);
    
    const isFollowing = userToFollow.followers.includes(currentUserId);
    
    if (isFollowing) {
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== currentUserId.toString()
      );
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToFollow._id.toString()
      );
    } else {
      userToFollow.followers.push(currentUserId);
      currentUser.following.push(userToFollow._id);
    }
    
    await userToFollow.save();
    await currentUser.save();
    
    res.json({
      isFollowing: !isFollowing,
      followerCount: userToFollow.followers.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getUserPlaylists = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    const query = { createdBy: user._id };
    
    if (!req.user || req.user._id.toString() !== user._id.toString()) {
      query.isPublic = true;
    }
    
    const playlists = await Playlist.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('restaurants.restaurant', 'name address images category')
      .populate('createdBy', 'username profileImage');
    
    const total = await Playlist.countDocuments(query);
    
    res.json({
      playlists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getSavedPlaylists = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedPlaylists',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
          sort: '-saves.savedAt',
        },
        populate: [
          { path: 'createdBy', select: 'username profileImage' },
          { path: 'restaurants.restaurant', select: 'name address images category' },
        ],
      });
    
    res.json({
      playlists: user.savedPlaylists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.savedPlaylists.length,
        pages: Math.ceil(user.savedPlaylists.length / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '이미지를 업로드해주세요' });
    }
    
    const user = await User.findById(req.user._id);
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();
    
    res.json({
      profileImage: user.profileImage,
      message: '프로필 이미지가 업데이트되었습니다',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const user = await User.findOne({ username })
      .populate({
        path: 'followers',
        select: 'username profileImage bio trustScore',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
        },
      });
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    res.json({
      followers: user.followers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.followers.length,
        pages: Math.ceil(user.followers.length / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const user = await User.findOne({ username })
      .populate({
        path: 'following',
        select: 'username profileImage bio trustScore',
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
        },
      });
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    res.json({
      following: user.following,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.following.length,
        pages: Math.ceil(user.following.length / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 프로필 정보 업데이트
const updateProfile = async (req, res) => {
  try {
    const { username, email, bio } = req.body;
    const userId = req.user._id;

    // 사용자명 중복 확인 (자신 제외)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 사용자명입니다' });
      }
    }

    // 이메일 중복 확인 (자신 제외)  
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ message: '이미 사용 중인 이메일입니다' });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: '프로필이 업데이트되었습니다',
      user: updatedUser
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 계정 삭제 
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;
    
    // password 필드를 포함하여 사용자 조회
    const userWithPassword = await User.findById(userId).select('+password');
    
    if (!userWithPassword) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // 소셜 로그인 사용자 확인 (googleId 또는 kakaoId가 있는 경우)
    const isOAuthUser = userWithPassword.googleId || userWithPassword.kakaoId || 
                       (userWithPassword.password && userWithPassword.password.startsWith('oauth-'));
    
    if (!isOAuthUser) {
      // 일반 사용자는 비밀번호 확인 필요
      if (!password) {
        return res.status(400).json({ message: '비밀번호를 입력해주세요' });
      }

      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: '비밀번호가 올바르지 않습니다' });
      }
    }

    console.log('🗑️ Deleting account:', {
      userId,
      username: userWithPassword.username,
      email: userWithPassword.email,
      kakaoId: userWithPassword.kakaoId,
      googleId: userWithPassword.googleId
    });

    // 관련 데이터 삭제
    const deleteResults = await Promise.all([
      // 사용자가 만든 플레이리스트 삭제
      Playlist.deleteMany({ createdBy: userId }),
      
      // 다른 사용자의 팔로워/팔로잉 목록에서 제거
      User.updateMany(
        { $or: [{ followers: userId }, { following: userId }] },
        { $pull: { followers: userId, following: userId } }
      ),
      
      // 사용자 계정 삭제
      User.findByIdAndDelete(userId)
    ]);

    console.log('✅ Account deleted successfully:', {
      userId,
      playlistsDeleted: deleteResults[0].deletedCount,
      userDeleted: deleteResults[2] ? 'Yes' : 'No'
    });

    res.json({
      success: true,
      message: '계정이 성공적으로 삭제되었습니다'
    });
  } catch (error) {
    console.error('계정 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 전체 프로필 정보 조회 (플레이리스트, 레스토랑 포함)
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    // 사용자 조회
    const user = await User.findOne({ username })
      .select('-password')
      .populate('followers', 'username profileImage')
      .populate('following', 'username profileImage');
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    // 사용자의 플레이리스트 조회 (레스토랑 정보 포함)
    const playlists = await Playlist.find({ 
      createdBy: user._id, 
      isPublic: true,
      isActive: true 
    })
    .populate({
      path: 'restaurants.restaurant',
      select: 'name address category images averageRating coordinates phoneNumber'
    })
    .sort('-createdAt')
    .limit(20);
    
    // 플레이리스트별 통계 추가
    const playlistsWithStats = playlists.map(playlist => ({
      _id: playlist._id,
      title: playlist.title,
      description: playlist.description,
      category: playlist.category,
      tags: playlist.tags,
      restaurants: playlist.restaurants,
      restaurantCount: playlist.restaurants.length,
      likeCount: playlist.likes?.length || 0,
      saveCount: playlist.saves?.length || 0,
      viewCount: playlist.viewCount || 0,
      createdAt: playlist.createdAt,
      coverImage: playlist.coverImage
    }));
    
    // 사용자가 등록한 레스토랑 조회
    const createdRestaurants = await Restaurant.find({ 
      createdBy: user._id 
    })
    .select('name address category images averageRating createdAt')
    .sort('-createdAt')
    .limit(10);
    
    // 팔로우 상태 확인
    let isFollowing = false;
    let isMutual = false;
    
    if (req.user) {
      isFollowing = user.followers.some(f => f._id.toString() === req.user._id.toString());
      const currentUser = await User.findById(req.user._id);
      isMutual = isFollowing && currentUser.followers.some(f => f._id.toString() === user._id.toString());
    }
    
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        rankings: user.rankings,
        trustScore: user.trustScore,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        visitedRestaurantsCount: user.visitedRestaurants?.length || 0,
        categoryVisitCounts: user.categoryVisitCounts,
        foodMBTIType: user.foodMBTIType,
        createdAt: user.createdAt
      },
      playlists: playlistsWithStats,
      createdRestaurants,
      isFollowing,
      isMutual,
      stats: {
        totalPlaylists: playlistsWithStats.length,
        totalRestaurantsInPlaylists: playlistsWithStats.reduce((sum, p) => sum + p.restaurantCount, 0),
        totalLikesReceived: playlistsWithStats.reduce((sum, p) => sum + p.likeCount, 0),
        totalSaves: playlistsWithStats.reduce((sum, p) => sum + p.saveCount, 0)
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

module.exports = {
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
};