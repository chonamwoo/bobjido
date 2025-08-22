const express = require('express');
const router = express.Router();
const { protect: auth } = require('../middleware/auth');
const recommendationService = require('../services/recommendationService');
const UserPreference = require('../models/UserPreference');

/**
 * @route   GET /api/recommendations
 * @desc    사용자 맞춤 추천 가져오기
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      lat, 
      lng, 
      companion, 
      mealTime, 
      mood, 
      weather,
      budget,
      limit = 20 
    } = req.query;

    // 현재 컨텍스트 구성
    const context = {
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null,
      currentTime: new Date(),
      companion,
      mealTime,
      mood,
      weather,
      budget
    };

    // 추천 생성
    const recommendations = await recommendationService.getRecommendations(
      userId,
      context,
      parseInt(limit)
    );

    // 사용자 컨텍스트 업데이트
    if (context.location) {
      await UserPreference.findOneAndUpdate(
        { userId },
        {
          'currentContext.lastLocation': {
            type: 'Point',
            coordinates: [context.location.lng, context.location.lat]
          },
          'currentContext.currentMood': mood,
          'currentContext.currentWeather': weather,
          'currentContext.currentBudget': budget,
          lastUpdated: new Date()
        }
      );
    }

    res.json({
      success: true,
      recommendations,
      context,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: '추천 생성 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/recommendations/feedback
 * @desc    추천 피드백 제출 (클릭, 방문, 평가 등)
 * @access  Private
 */
router.post('/feedback', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      restaurantId, 
      action, // 'click', 'visit', 'like', 'dislike', 'save'
      rating,
      source // 'recommendation', 'search', 'browse'
    } = req.body;

    const userPref = await UserPreference.findOne({ userId });
    if (!userPref) {
      return res.status(404).json({
        success: false,
        message: '사용자 선호도 정보를 찾을 수 없습니다.'
      });
    }

    // 피드백에 따른 선호도 업데이트
    switch (action) {
      case 'visit':
        userPref.visitHistory.push({
          restaurantId,
          visitDate: new Date(),
          rating,
          tags: [],
          isRevisit: userPref.visitHistory.some(v => 
            v.restaurantId.toString() === restaurantId
          )
        });
        break;

      case 'like':
        userPref.likedRestaurants.push({
          restaurantId,
          likedAt: new Date(),
          source,
          likeStrength: 1
        });
        break;

      case 'dislike':
        // 부정적 신호 추가
        if (!userPref.negativeSignals.blockedRestaurants.some(
          b => b.restaurantId.toString() === restaurantId
        )) {
          userPref.negativeSignals.blockedRestaurants.push({
            restaurantId,
            reason: 'user_dislike',
            blockedAt: new Date()
          });
        }
        break;
    }

    userPref.lastUpdated = new Date();
    await userPref.save();

    res.json({
      success: true,
      message: '피드백이 저장되었습니다.'
    });

  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: '피드백 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * @route   GET /api/recommendations/preferences
 * @desc    사용자 선호도 정보 조회
 * @access  Private
 */
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    let userPref = await UserPreference.findOne({ userId });
    
    // 선호도 정보가 없으면 생성
    if (!userPref) {
      userPref = await UserPreference.create({ userId });
    }

    res.json({
      success: true,
      preferences: userPref
    });

  } catch (error) {
    console.error('Preference Error:', error);
    res.status(500).json({
      success: false,
      message: '선호도 조회 중 오류가 발생했습니다.'
    });
  }
});

/**
 * @route   PUT /api/recommendations/preferences
 * @desc    사용자 선호도 업데이트
 * @access  Private
 */
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const userPref = await UserPreference.findOneAndUpdate(
      { userId },
      { 
        ...updates,
        lastUpdated: new Date()
      },
      { 
        new: true,
        upsert: true
      }
    );

    res.json({
      success: true,
      preferences: userPref
    });

  } catch (error) {
    console.error('Update Preference Error:', error);
    res.status(500).json({
      success: false,
      message: '선호도 업데이트 중 오류가 발생했습니다.'
    });
  }
});

/**
 * @route   POST /api/recommendations/game-result
 * @desc    게임 결과를 선호도에 반영
 * @access  Private
 */
router.post('/game-result', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      gameType, // 'foodVS', 'foodMBTI', 'moodFood'
      results 
    } = req.body;

    const userPref = await UserPreference.findOne({ userId }) || 
                     await UserPreference.create({ userId });

    // 게임 타입별 선호도 업데이트
    switch (gameType) {
      case 'foodVS':
        // 음식 대결 결과 반영
        results.forEach(result => {
          if (result.winner === 'spicy' && result.loser === 'mild') {
            userPref.gamePreferences.spicyLevel = Math.min(5, 
              userPref.gamePreferences.spicyLevel + 0.5
            );
          }
          // 다른 대결 결과도 처리...
        });
        break;

      case 'foodMBTI':
        // MBTI 결과를 선호도로 변환
        const mbtiMapping = {
          'E': { atmospheres: { lively: 10, quiet: -5 } },
          'I': { atmospheres: { quiet: 10, lively: -5 } },
          'S': { adventureLevel: -1 },
          'N': { adventureLevel: 1 },
          // ... 더 많은 매핑
        };
        
        results.mbti.split('').forEach(trait => {
          if (mbtiMapping[trait]) {
            Object.entries(mbtiMapping[trait]).forEach(([key, value]) => {
              if (key === 'atmospheres') {
                Object.entries(value).forEach(([atmo, score]) => {
                  userPref.gamePreferences.atmospheres[atmo] += score;
                });
              } else {
                userPref.gamePreferences[key] += value;
              }
            });
          }
        });
        break;

      case 'moodFood':
        // 기분별 음식 선택 반영
        if (results.mood && results.selectedFood) {
          const cuisineType = results.selectedFood.category;
          userPref.gamePreferences.cuisineTypes[cuisineType] = 
            (userPref.gamePreferences.cuisineTypes[cuisineType] || 0) + 10;
        }
        break;
    }

    userPref.lastUpdated = new Date();
    await userPref.save();

    res.json({
      success: true,
      message: '게임 결과가 선호도에 반영되었습니다.',
      preferences: userPref.gamePreferences
    });

  } catch (error) {
    console.error('Game Result Error:', error);
    res.status(500).json({
      success: false,
      message: '게임 결과 처리 중 오류가 발생했습니다.'
    });
  }
});

/**
 * @route   GET /api/recommendations/explain/:restaurantId
 * @desc    특정 레스토랑 추천 이유 설명
 * @access  Private
 */
router.get('/explain/:restaurantId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurantId } = req.params;

    const userPref = await UserPreference.findOne({ userId });
    if (!userPref) {
      return res.status(404).json({
        success: false,
        message: '사용자 선호도 정보를 찾을 수 없습니다.'
      });
    }

    const restaurant = await require('../models/Restaurant').findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: '레스토랑을 찾을 수 없습니다.'
      });
    }

    // 추천 점수 계산
    const score = await recommendationService.calculateTotalScore(
      restaurant,
      userPref,
      {}
    );

    // 상세 설명 생성
    const explanation = {
      totalScore: score.totalScore,
      breakdown: score.breakdown,
      reasons: recommendationService.generateExplanation(score.breakdown),
      confidence: recommendationService.calculateConfidence(score.totalScore),
      topFactors: Object.entries(score.breakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([factor, score]) => ({
          factor,
          score,
          percentage: (score / 100 * 100).toFixed(1) + '%'
        }))
    };

    res.json({
      success: true,
      restaurantId,
      explanation
    });

  } catch (error) {
    console.error('Explain Error:', error);
    res.status(500).json({
      success: false,
      message: '설명 생성 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;