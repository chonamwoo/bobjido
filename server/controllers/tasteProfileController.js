const { TasteType, UserTasteProfile } = require('../models/TasteProfile');
const { analyzeUserTaste, findMatchingUsers, initializeTasteTypes } = require('../utils/tasteAnalyzer');
const User = require('../models/User');

const analyzeTaste = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const profile = await analyzeUserTaste(userId);
    
    if (profile.error) {
      return res.status(400).json({ message: profile.error });
    }

    res.json({
      profile,
      message: '취향 분석이 완료되었습니다!'
    });
  } catch (error) {
    console.error('Error in taste analysis:', error);
    res.status(500).json({ message: '취향 분석 중 오류가 발생했습니다' });
  }
};

const getTasteProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const profile = await UserTasteProfile.findOne({ user: userId })
      .populate('primaryType secondaryType')
      .populate('typeScores.tasteType')
      .populate('matchingUsers.user', 'username profileImage bio trustScore')
      .populate('matchingUsers.sharedTypes');

    if (!profile) {
      return res.status(404).json({ 
        message: '아직 취향 분석을 하지 않았습니다. 맛집을 더 방문해보세요!' 
      });
    }

    const user = await User.findById(userId).select('username profileImage bio');

    res.json({
      user,
      profile
    });
  } catch (error) {
    console.error('Error getting taste profile:', error);
    res.status(500).json({ message: '프로필을 불러오는 중 오류가 발생했습니다' });
  }
};

const confirmTasteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { confirm, sharePreference } = req.body;

    const profile = await UserTasteProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: '취향 프로필을 찾을 수 없습니다' });
    }

    profile.confirmedByUser = confirm;
    profile.confirmedAt = confirm ? new Date() : null;
    
    if (sharePreference) {
      profile.sharePreference = sharePreference;
    }

    await profile.save();

    if (confirm) {
      const matchingUsers = await findMatchingUsers(userId);
      profile.matchingUsers = matchingUsers;
      await profile.save();
    }

    res.json({
      profile,
      message: confirm 
        ? '취향 프로필이 확정되었습니다! 비슷한 취향의 사용자들을 찾아드릴게요.' 
        : '취향 프로필 확정이 취소되었습니다.'
    });
  } catch (error) {
    console.error('Error confirming taste profile:', error);
    res.status(500).json({ message: '프로필 확정 중 오류가 발생했습니다' });
  }
};

const getMatchingUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const profile = await UserTasteProfile.findOne({ user: userId });

    if (!profile || !profile.confirmedByUser) {
      return res.status(400).json({ 
        message: '먼저 취향 분석을 완료하고 확정해주세요' 
      });
    }

    const matchingUsers = await findMatchingUsers(userId, parseInt(limit));

    res.json({
      matchingUsers,
      userType: profile.primaryType
    });
  } catch (error) {
    console.error('Error getting matching users:', error);
    res.status(500).json({ message: '매칭 사용자를 찾는 중 오류가 발생했습니다' });
  }
};

const getAllTasteTypes = async (req, res) => {
  try {
    const types = await TasteType.find();
    res.json(types);
  } catch (error) {
    console.error('Error getting taste types:', error);
    res.status(500).json({ message: '취향 타입을 불러오는 중 오류가 발생했습니다' });
  }
};

const getRecommendationsByTaste = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const profile = await UserTasteProfile.findOne({ user: userId })
      .populate('primaryType secondaryType');

    if (!profile || !profile.confirmedByUser) {
      return res.status(400).json({ 
        message: '취향 기반 추천을 받으려면 먼저 취향 분석을 완료해주세요' 
      });
    }

    const Restaurant = require('../models/Restaurant');
    
    const primaryType = profile.primaryType;
    const secondaryType = profile.secondaryType;

    let query = {
      $or: []
    };

    if (primaryType) {
      query.$or.push({ category: { $in: primaryType.preferredCategories } });
    }
    if (secondaryType) {
      query.$or.push({ category: { $in: secondaryType.preferredCategories } });
    }

    if (profile.analysisData.averagePriceRange) {
      query.priceRange = profile.analysisData.averagePriceRange;
    }

    const recommendedRestaurants = await Restaurant.find(query)
      .sort({ averageRating: -1, verifiedBy: -1 })
      .limit(20)
      .populate('createdBy', 'username profileImage');

    const matchingUsersWithSimilarTaste = await UserTasteProfile.find({
      user: { $ne: userId },
      primaryType: profile.primaryType,
      confirmedByUser: true
    })
    .populate('user', 'username profileImage visitedRestaurants')
    .limit(5);

    const friendsRestaurants = [];
    for (const friend of matchingUsersWithSimilarTaste) {
      const User = require('../models/User');
      const friendUser = await User.findById(friend.user._id)
        .populate({
          path: 'visitedRestaurants.restaurant',
          select: 'name address category priceRange averageRating images'
        });
      
      if (friendUser && friendUser.visitedRestaurants.length > 0) {
        const topRestaurants = friendUser.visitedRestaurants
          .filter(v => v.rating >= 4)
          .slice(0, 3)
          .map(v => ({
            ...v.restaurant.toObject(),
            recommendedBy: {
              username: friendUser.username,
              profileImage: friendUser.profileImage
            }
          }));
        
        friendsRestaurants.push(...topRestaurants);
      }
    }

    res.json({
      userType: {
        primary: primaryType,
        secondary: secondaryType
      },
      recommendedRestaurants,
      friendsRecommendations: friendsRestaurants.slice(0, 10),
      matchingUsers: matchingUsersWithSimilarTaste.map(m => m.user)
    });
  } catch (error) {
    console.error('Error getting taste-based recommendations:', error);
    res.status(500).json({ message: '취향 기반 추천을 가져오는 중 오류가 발생했습니다' });
  }
};

const initTypes = async (req, res) => {
  try {
    await initializeTasteTypes();
    res.json({ message: '취향 타입이 초기화되었습니다' });
  } catch (error) {
    console.error('Error initializing types:', error);
    res.status(500).json({ message: '타입 초기화 중 오류가 발생했습니다' });
  }
};

module.exports = {
  analyzeTaste,
  getTasteProfile,
  confirmTasteProfile,
  getMatchingUsers,
  getAllTasteTypes,
  getRecommendationsByTaste,
  initTypes
};