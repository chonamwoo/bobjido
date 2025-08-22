const GameAnswer = require('../models/GameAnswer');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// 게임 답변 저장 및 추천
const submitGameAnswers = async (req, res) => {
  try {
    const { gameType, answers, location } = req.body;
    const userId = req.user._id;

    // 답변 분석하여 선호도 파악
    const preferences = analyzeAnswers(answers);
    
    // 맞춤 레스토랑 추천
    const recommendations = await getPersonalizedRecommendations(
      preferences,
      location,
      userId
    );

    // 게임 결과 저장
    const gameAnswer = await GameAnswer.create({
      user: userId,
      gameType,
      answers,
      location,
      result: {
        mbtiType: preferences.mbtiType,
        recommendations: recommendations.map(r => r._id)
      }
    });

    // 사용자 프로필 업데이트
    await updateUserPreferences(userId, preferences);

    res.json({
      message: '게임 결과가 저장되었습니다',
      mbtiType: preferences.mbtiType,
      recommendations,
      preferences
    });
  } catch (error) {
    console.error('Submit game answers error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 답변 분석 함수
const analyzeAnswers = (answers) => {
  const preferences = {
    spicyLevel: 0,
    sweetLevel: 0,
    atmosphere: [],
    priceRange: '',
    cuisineTypes: [],
    features: [],
    mbtiType: ''
  };

  answers.forEach(answer => {
    // 매운맛 선호도
    if (answer.question.includes('매운') || answer.question.includes('spicy')) {
      if (answer.answer === '매운 음식') {
        preferences.spicyLevel += 2;
      } else if (answer.answer === '순한 음식') {
        preferences.spicyLevel -= 1;
      }
    }

    // 단맛 선호도
    if (answer.question.includes('디저트') || answer.question.includes('달콤')) {
      if (answer.answer.includes('디저트') || answer.answer.includes('달콤')) {
        preferences.sweetLevel += 2;
      }
    }

    // 분위기 선호도
    if (answer.question.includes('분위기')) {
      if (answer.answer.includes('조용')) {
        preferences.atmosphere.push('quiet');
      } else if (answer.answer.includes('활기')) {
        preferences.atmosphere.push('lively');
      } else if (answer.answer.includes('로맨틱')) {
        preferences.atmosphere.push('romantic');
      }
    }

    // 음식 종류
    if (answer.metadata?.category) {
      preferences.cuisineTypes.push(answer.metadata.category);
    }

    // 가격대
    if (answer.question.includes('가격') || answer.question.includes('예산')) {
      preferences.priceRange = answer.answer;
    }

    // 특징
    if (answer.metadata?.tags) {
      preferences.features.push(...answer.metadata.tags);
    }
  });

  // MBTI 타입 결정
  preferences.mbtiType = calculateMBTIType(preferences);

  return preferences;
};

// MBTI 타입 계산
const calculateMBTIType = (preferences) => {
  let type = '';
  
  // S(Spicy) vs M(Mild)
  type += preferences.spicyLevel > 0 ? 'S' : 'M';
  
  // A(Adventurous) vs T(Traditional)
  type += preferences.cuisineTypes.length > 3 ? 'A' : 'T';
  
  // G(Group) vs I(Individual)
  type += preferences.atmosphere.includes('lively') ? 'G' : 'I';
  
  // P(Premium) vs B(Budget)
  type += preferences.priceRange === '고급' ? 'P' : 'B';
  
  return type;
};

// 개인화된 추천
const getPersonalizedRecommendations = async (preferences, location, userId) => {
  try {
    let query = {};
    
    // 위치 기반 필터
    if (location?.district) {
      query.district = location.district;
    } else if (location?.city) {
      query.city = location.city;
    }

    // 음식 종류 필터
    if (preferences.cuisineTypes.length > 0) {
      query.category = { $in: preferences.cuisineTypes };
    }

    // 가격대 필터
    if (preferences.priceRange) {
      query.priceRange = preferences.priceRange;
    }

    // 레스토랑 조회
    let restaurants = await Restaurant.find(query)
      .limit(20)
      .lean();

    // 선호도 기반 점수 계산
    restaurants = restaurants.map(restaurant => {
      let score = 0;

      // 매운맛 선호도 매칭
      if (preferences.spicyLevel > 0 && restaurant.tags?.includes('매운맛')) {
        score += 3;
      }

      // 분위기 매칭
      preferences.atmosphere.forEach(atmo => {
        if (restaurant.features?.includes(atmo)) {
          score += 2;
        }
      });

      // 특징 매칭
      preferences.features.forEach(feature => {
        if (restaurant.features?.includes(feature)) {
          score += 1;
        }
      });

      // 평점 가중치
      score += (restaurant.averageRating || 0) * 0.5;

      return {
        ...restaurant,
        matchScore: score
      };
    });

    // 점수 기준 정렬
    restaurants.sort((a, b) => b.matchScore - a.matchScore);

    // 상위 10개 반환
    return restaurants.slice(0, 10);
  } catch (error) {
    console.error('Get personalized recommendations error:', error);
    return [];
  }
};

// 사용자 선호도 업데이트
const updateUserPreferences = async (userId, preferences) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 음식 MBTI 타입 업데이트
    user.foodMBTIType = preferences.mbtiType;

    // 방문 카테고리 업데이트
    preferences.cuisineTypes.forEach(cuisine => {
      user.updateCategoryCount(cuisine);
    });

    await user.save();
  } catch (error) {
    console.error('Update user preferences error:', error);
  }
};

// 게임 기록 조회
const getGameHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameType } = req.query;

    let query = { user: userId };
    if (gameType) {
      query.gameType = gameType;
    }

    const history = await GameAnswer.find(query)
      .populate('result.recommendations', 'name address category images averageRating')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      history,
      total: history.length
    });
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 추천 결과 기반 맛집 조회
const getRecommendedRestaurants = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 최근 게임 답변 조회
    const recentGames = await GameAnswer.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (recentGames.length === 0) {
      return res.json({
        message: '게임을 플레이하여 맞춤 추천을 받아보세요!',
        recommendations: []
      });
    }

    // 모든 추천 맛집 ID 수집
    const restaurantIds = new Set();
    recentGames.forEach(game => {
      game.result.recommendations.forEach(id => {
        restaurantIds.add(id.toString());
      });
    });

    // 맛집 정보 조회
    const restaurants = await Restaurant.find({
      _id: { $in: Array.from(restaurantIds) }
    }).populate('createdBy', 'username profileImage');

    res.json({
      recommendations: restaurants,
      basedOn: recentGames.length + ' 게임 결과'
    });
  } catch (error) {
    console.error('Get recommended restaurants error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

module.exports = {
  submitGameAnswers,
  getGameHistory,
  getRecommendedRestaurants
};