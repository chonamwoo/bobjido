const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Playlist = require('../models/Playlist');

// 카테고리별 맛잘알 랭킹 조회
exports.getCategoryRankings = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // 특정 카테고리의 전문가 점수가 있는 사용자들 조회
    const users = await User.find({
      [`expertiseScores.${category}`]: { $exists: true }
    })
    .select('username userId profileImage bio expertiseScores preferredFoods')
    .sort({ [`expertiseScores.${category}.level`]: -1 })
    .limit(Number(limit))
    .skip(skip);

    // 랭킹 데이터 포맷팅
    const rankings = users.map((user, index) => {
      const categoryScore = user.expertiseScores.get(category) || {};
      return {
        rank: skip + index + 1,
        userId: user.userId,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        level: categoryScore.level || 0,
        points: categoryScore.points || 0,
        restaurantsAdded: categoryScore.restaurantsAdded || 0,
        listsCreated: categoryScore.listsCreated || 0,
        totalLikes: categoryScore.totalLikes || 0,
        totalSaves: categoryScore.totalSaves || 0,
        badges: getBadgesForLevel(categoryScore.level || 0, category)
      };
    });

    // 전체 카운트
    const totalCount = await User.countDocuments({
      [`expertiseScores.${category}`]: { $exists: true }
    });

    res.json({
      success: true,
      category,
      rankings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('카테고리 랭킹 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '랭킹을 불러오는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 전체 카테고리 랭킹 요약
exports.getAllCategoryRankings = async (req, res) => {
  try {
    const categories = [
      '한식', '중식', '일식', '양식', '카페', '디저트',
      '분식', '치킨', '피자', '버거', '아시안', '돈가스',
      '회/초밥', '고기', '찜/탕', '면요리', '해물', '술집',
      '카레', '냉면', '제육', '떡볶이', '김치찌개', '삼겹살',
      '족발', '보쌈'
    ];

    const rankingSummary = {};

    for (const category of categories) {
      // 각 카테고리별 상위 5명만 가져오기
      const topUsers = await User.find({
        [`expertiseScores.${category}.level`]: { $gt: 0 }
      })
      .select('username userId profileImage expertiseScores')
      .sort({ [`expertiseScores.${category}.level`]: -1 })
      .limit(5);

      if (topUsers.length > 0) {
        rankingSummary[category] = topUsers.map((user, index) => {
          const categoryScore = user.expertiseScores.get(category) || {};
          return {
            rank: index + 1,
            userId: user.userId,
            username: user.username,
            profileImage: user.profileImage,
            level: categoryScore.level || 0,
            points: categoryScore.points || 0
          };
        });
      }
    }

    res.json({
      success: true,
      rankings: rankingSummary
    });
  } catch (error) {
    console.error('전체 랭킹 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '랭킹을 불러오는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자의 카테고리별 전문성 점수 업데이트
exports.updateExpertiseScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, action, value = 1 } = req.body;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 현재 카테고리 점수 가져오기
    let categoryScore = user.expertiseScores.get(category) || {
      level: 0,
      points: 0,
      restaurantsAdded: 0,
      listsCreated: 0,
      totalLikes: 0,
      totalSaves: 0
    };

    // 액션에 따른 점수 업데이트
    switch (action) {
      case 'ADD_RESTAURANT':
        categoryScore.points += 10;
        categoryScore.restaurantsAdded += 1;
        break;
      case 'CREATE_LIST':
        categoryScore.points += 15;
        categoryScore.listsCreated += 1;
        break;
      case 'RECEIVE_LIKE':
        categoryScore.points += 2;
        categoryScore.totalLikes += value;
        break;
      case 'RECEIVE_SAVE':
        categoryScore.points += 3;
        categoryScore.totalSaves += value;
        break;
      default:
        break;
    }

    // 레벨 계산 (100포인트당 1레벨)
    categoryScore.level = Math.floor(categoryScore.points / 100);

    // 업데이트된 점수 저장
    user.expertiseScores.set(category, categoryScore);
    await user.save();

    // 해당 카테고리의 전체 순위 업데이트
    await updateCategoryRanks(category);

    res.json({
      success: true,
      category,
      expertiseScore: categoryScore
    });
  } catch (error) {
    console.error('전문성 점수 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '점수 업데이트 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 사용자의 선호 음식 업데이트
exports.updatePreferredFoods = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferredFoods } = req.body;

    if (!Array.isArray(preferredFoods) || preferredFoods.length === 0) {
      return res.status(400).json({
        success: false,
        message: '최소 1개 이상의 선호 음식을 선택해주세요.'
      });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { preferredFoods },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '선호 음식이 업데이트되었습니다.',
      preferredFoods: user.preferredFoods
    });
  } catch (error) {
    console.error('선호 음식 업데이트 오류:', error);
    res.status(500).json({
      success: false,
      message: '선호 음식 업데이트 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 선호 음식 기반 추천 리스트 조회
exports.getRecommendedByPreferences = async (req, res) => {
  try {
    const { userId } = req.user;
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ userId });
    if (!user || !user.preferredFoods || user.preferredFoods.length === 0) {
      return res.json({
        success: true,
        message: '선호 음식을 설정하면 맞춤 추천을 받을 수 있습니다.',
        playlists: [],
        restaurants: []
      });
    }

    // 선호 음식 카테고리에 해당하는 플레이리스트 조회
    const playlists = await Playlist.find({
      $or: [
        { category: { $in: user.preferredFoods } },
        { 'restaurants.restaurant.category': { $in: user.preferredFoods } }
      ],
      isPublic: true
    })
    .populate('createdBy', 'username profileImage')
    .sort({ likeCount: -1, createdAt: -1 })
    .limit(Number(limit))
    .skip(skip);

    // 선호 음식 카테고리에 해당하는 레스토랑 조회
    const restaurants = await Restaurant.find({
      category: { $in: user.preferredFoods }
    })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(Number(limit))
    .skip(skip);

    res.json({
      success: true,
      preferredFoods: user.preferredFoods,
      playlists,
      restaurants
    });
  } catch (error) {
    console.error('추천 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '추천을 불러오는 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 헬퍼 함수들
function getBadgesForLevel(level, category) {
  const badges = [];

  if (level >= 1) badges.push({ name: `${category} 입문자`, icon: '🌱' });
  if (level >= 5) badges.push({ name: `${category} 애호가`, icon: '❤️' });
  if (level >= 10) badges.push({ name: `${category} 전문가`, icon: '⭐' });
  if (level >= 20) badges.push({ name: `${category} 마스터`, icon: '👑' });
  if (level >= 50) badges.push({ name: `${category} 레전드`, icon: '🏆' });

  return badges;
}

async function updateCategoryRanks(category) {
  try {
    // 해당 카테고리의 모든 사용자를 점수 순으로 정렬
    const users = await User.find({
      [`expertiseScores.${category}`]: { $exists: true }
    })
    .select('_id expertiseScores')
    .sort({ [`expertiseScores.${category}.level`]: -1 });

    // 순위 업데이트
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const categoryScore = user.expertiseScores.get(category);
      if (categoryScore) {
        categoryScore.rank = i + 1;
        user.expertiseScores.set(category, categoryScore);
        await user.save();
      }
    }
  } catch (error) {
    console.error('카테고리 순위 업데이트 오류:', error);
  }
}

