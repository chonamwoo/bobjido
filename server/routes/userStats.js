const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/auth');

// 음식 MBTI 답변 저장
router.post('/food-mbti/answer', protect, async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // 답변 저장
    user.addFoodMBTIAnswer(questionId, answer);
    
    // 10개 이상 답변하면 MBTI 타입 계산
    if (user.foodMBTIAnswers.length >= 10) {
      user.calculateFoodMBTIType();
    }

    await user.save();

    res.json({
      success: true,
      answersCount: user.foodMBTIAnswers.length,
      mbtiType: user.foodMBTIType
    });
  } catch (error) {
    console.error('Food MBTI answer error:', error);
    res.status(500).json({ message: '답변 저장 중 오류가 발생했습니다' });
  }
});

// 음식 MBTI 결과 조회
router.get('/food-mbti/result', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('foodMBTIAnswers foodMBTIType');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    res.json({
      mbtiType: user.foodMBTIType,
      answersCount: user.foodMBTIAnswers.length,
      answers: user.foodMBTIAnswers
    });
  } catch (error) {
    console.error('Food MBTI result error:', error);
    res.status(500).json({ message: '결과 조회 중 오류가 발생했습니다' });
  }
});

// 레스토랑 방문 기록 및 카테고리 카운트 업데이트
router.post('/visit-restaurant', protect, async (req, res) => {
  try {
    const { restaurantId, rating } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(404).json({ message: '사용자 또는 레스토랑을 찾을 수 없습니다' });
    }

    // 방문 기록 추가
    user.visitedRestaurants.push({
      restaurant: restaurantId,
      visitedAt: new Date(),
      rating: rating || null
    });

    // 카테고리 카운트 업데이트
    user.updateCategoryCount(restaurant.category);

    // 서브카테고리도 있으면 카운트
    if (restaurant.subCategory) {
      user.updateCategoryCount(restaurant.subCategory);
    }

    await user.save();

    res.json({
      success: true,
      visitedCount: user.visitedRestaurants.length,
      categoryStats: user.getTopCategories()
    });
  } catch (error) {
    console.error('Visit restaurant error:', error);
    res.status(500).json({ message: '방문 기록 저장 중 오류가 발생했습니다' });
  }
});

// 사용자 카테고리 통계 조회
router.get('/category-stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    const topCategories = user.getTopCategories(10);
    const totalVisits = user.visitedRestaurants.length;

    res.json({
      totalVisits,
      topCategories,
      allCategories: Object.fromEntries(user.categoryVisitCounts)
    });
  } catch (error) {
    console.error('Category stats error:', error);
    res.status(500).json({ message: '통계 조회 중 오류가 발생했습니다' });
  }
});

// 사용자 취향 프로필 업데이트 (카테고리 기반)
router.post('/update-taste-profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    // 카테고리 방문 데이터를 기반으로 취향 프로필 업데이트
    const topCategories = user.getTopCategories(5);
    
    // 카테고리에 따른 취향 타입 점수 업데이트
    const scoreUpdates = {
      spicy_adventurer: 0,
      trendy_explorer: 0,
      comfort_lover: 0,
      social_foodie: 0,
      budget_gourmet: 0,
      premium_diner: 0,
      solo_explorer: 0,
      traditional_taste: 0
    };

    topCategories.forEach(({ category, count }) => {
      // 카테고리별로 취향 점수 부여 (예시)
      switch(category) {
        case '한식':
          scoreUpdates.traditional_taste += count * 2;
          scoreUpdates.comfort_lover += count;
          break;
        case '일식':
        case '양식':
          scoreUpdates.premium_diner += count * 1.5;
          scoreUpdates.trendy_explorer += count;
          break;
        case '중식':
          scoreUpdates.social_foodie += count * 1.5;
          scoreUpdates.spicy_adventurer += count;
          break;
        case '카페':
        case '디저트':
          scoreUpdates.trendy_explorer += count * 2;
          scoreUpdates.solo_explorer += count;
          break;
        case '주점':
          scoreUpdates.social_foodie += count * 2;
          break;
        case '패스트푸드':
          scoreUpdates.budget_gourmet += count * 2;
          scoreUpdates.comfort_lover += count;
          break;
        default:
          scoreUpdates.spicy_adventurer += count * 0.5;
      }
    });

    // 기존 점수에 새로운 점수 추가
    Object.keys(scoreUpdates).forEach(key => {
      user.tasteProfile.scores[key] = (user.tasteProfile.scores[key] || 0) + scoreUpdates[key];
    });

    // 가장 높은 점수의 타입을 메인 타입으로 설정
    const maxScore = Math.max(...Object.values(user.tasteProfile.scores));
    const mainType = Object.keys(user.tasteProfile.scores).find(
      key => user.tasteProfile.scores[key] === maxScore
    );

    user.tasteProfile.type = mainType;
    user.tasteProfile.lastUpdated = new Date();

    await user.save();

    res.json({
      success: true,
      tasteProfile: user.tasteProfile,
      topCategories
    });
  } catch (error) {
    console.error('Update taste profile error:', error);
    res.status(500).json({ message: '취향 프로필 업데이트 중 오류가 발생했습니다' });
  }
});

module.exports = router;