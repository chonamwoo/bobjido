const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// 취향 프로필 저장
router.post('/taste-profile', protect, async (req, res) => {
  try {
    console.log('=== 서버: 취향 프로필 저장 시작 ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);
    
    const { answers, profile } = req.body;
    
    if (!answers || !profile) {
      console.error('필수 데이터 누락 - answers:', !!answers, 'profile:', !!profile);
      return res.status(400).json({
        success: false,
        message: '필수 데이터가 누락되었습니다.',
      });
    }

    console.log('현재 사용자 정보:', req.user);
    
    // 취향 프로필 데이터 변환
    const tasteProfileData = convertAnswersToProfile(answers);
    const profileScores = calculateProfileScores(answers);
    
    console.log('변환된 취향 데이터:', tasteProfileData);
    console.log('계산된 점수:', profileScores);
    
    // 사용자 프로필 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        'tasteProfile': {
          ...req.user.tasteProfile,
          type: profile,
          scores: profileScores,
          lastUpdated: new Date(),
          ...tasteProfileData
        },
        onboardingCompleted: true
      },
      { new: true, runValidators: true }
    ).select('-password');

    console.log('업데이트된 사용자:', updatedUser);

    // TasteProfile 별도 저장 (상세 분석용)
    try {
      const { UserTasteProfile } = require('../models/TasteProfile');
      const tasteProfile = await UserTasteProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          user: req.user._id,
          analysisData: {
            totalRestaurants: 0,
            averagePriceRange: answers.dining_budget || 'moderate',
            spicyPreference: answers.spice_level === 'hot' ? 5 : answers.spice_level === 'medium' ? 3 : 1,
            lastAnalyzedAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
      console.log('별도 TasteProfile 저장됨:', tasteProfile);
    } catch (tasteProfileError) {
      console.error('TasteProfile 별도 저장 실패:', tasteProfileError);
      // 이 에러는 메인 기능에 영향주지 않으므로 계속 진행
    }

    res.json({
      success: true,
      message: '취향 프로필이 성공적으로 저장되었습니다.',
      data: {
        user: updatedUser,
        profile: profile
      }
    });
  } catch (error) {
    console.error('=== 서버: 취향 프로필 저장 실패 ===');
    console.error('Error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: '취향 프로필 저장에 실패했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 온보딩 건너뛰기
router.post('/skip', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { onboardingCompleted: true }
    );

    res.json({
      success: true,
      message: '온보딩을 건너뛰었습니다.'
    });
  } catch (error) {
    console.error('온보딩 건너뛰기 실패:', error);
    res.status(500).json({
      success: false,
      message: '온보딩 처리에 실패했습니다.'
    });
  }
});

// 온보딩 상태 확인
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('onboardingCompleted tasteProfile');

    res.json({
      success: true,
      data: {
        onboardingCompleted: user.onboardingCompleted,
        hasTasteProfile: !!user.tasteProfile?.type
      }
    });
  } catch (error) {
    console.error('온보딩 상태 확인 실패:', error);
    res.status(500).json({
      success: false,
      message: '온보딩 상태 확인에 실패했습니다.'
    });
  }
});

// 취향 프로필 업데이트 (동적 업데이트)
router.post('/update-profile', protect, async (req, res) => {
  try {
    const { newProfileType } = req.body;
    
    await User.findByIdAndUpdate(
      req.user._id,
      { 
        'tasteProfile.type': newProfileType,
        'tasteProfile.lastUpdated': new Date()
      }
    );

    res.json({
      success: true,
      message: '취향 프로필이 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('취향 프로필 업데이트 실패:', error);
    res.status(500).json({
      success: false,
      message: '취향 프로필 업데이트에 실패했습니다.'
    });
  }
});

// 취향 점수 조회
router.get('/taste-scores', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('tasteProfile');

    const scores = user.tasteProfile?.scores || {
      spicy_adventurer: 0,
      trendy_explorer: 0,
      comfort_lover: 0,
      social_foodie: 0,
      budget_gourmet: 0,
      premium_diner: 0,
      solo_explorer: 0,
      traditional_taste: 0
    };

    res.json({
      success: true,
      data: {
        currentProfile: user.tasteProfile?.type,
        scores: scores,
        lastUpdated: user.tasteProfile?.lastUpdated
      }
    });
  } catch (error) {
    console.error('취향 점수 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '취향 점수 조회에 실패했습니다.'
    });
  }
});

// 헬퍼 함수: 취향 점수 계산
function calculateProfileScores(answers) {
  const scores = {
    spicy_adventurer: 0,
    trendy_explorer: 0,
    comfort_lover: 0,
    social_foodie: 0,
    budget_gourmet: 0,
    premium_diner: 0,
    solo_explorer: 0,
    traditional_taste: 0
  };

  // 매운맛 선호도
  if (answers.spice_level === 'hot') scores.spicy_adventurer += 3;
  if (answers.spice_level === 'medium') scores.spicy_adventurer += 2;
  if (answers.spice_level === 'none') scores.comfort_lover += 2;

  // 예산 기반 점수
  if (answers.dining_budget === 'luxury') scores.premium_diner += 3;
  if (answers.dining_budget === 'premium') scores.premium_diner += 2;
  if (answers.dining_budget === 'budget') scores.budget_gourmet += 3;
  if (answers.dining_budget === 'moderate') scores.budget_gourmet += 1;

  // 모험심
  if (answers.food_adventure === 'adventurous') {
    scores.spicy_adventurer += 2;
    scores.trendy_explorer += 1;
  }
  if (answers.food_adventure === 'conservative') scores.comfort_lover += 2;

  // 분위기 선호
  if (answers.atmosphere === 'trendy') scores.trendy_explorer += 3;
  if (answers.atmosphere === 'cozy') scores.comfort_lover += 2;
  if (answers.atmosphere === 'lively') scores.social_foodie += 2;
  if (answers.atmosphere === 'casual') scores.comfort_lover += 1;

  // 음식 종류
  if (answers.cuisine_preference === 'korean') scores.traditional_taste += 3;
  if (answers.cuisine_preference === 'diverse') {
    scores.spicy_adventurer += 1;
    scores.trendy_explorer += 1;
  }

  // 식사 동반자
  if (answers.dining_company === 'alone') scores.solo_explorer += 3;
  if (answers.dining_company === 'friends') scores.social_foodie += 2;
  if (answers.dining_company === 'family') {
    scores.social_foodie += 1;
    scores.traditional_taste += 1;
  }
  if (answers.dining_company === 'date') scores.premium_diner += 1;

  // 맛집 발견 방식
  if (answers.food_discovery === 'sns') scores.trendy_explorer += 2;
  if (answers.food_discovery === 'exploration') scores.solo_explorer += 1;
  if (answers.food_discovery === 'recommendations') scores.social_foodie += 1;

  return scores;
}

// 헬퍼 함수: 답변을 프로필 데이터로 변환
function convertAnswersToProfile(answers) {
  const profile = {};

  // 매운맛 선호도
  const spiceLevelMap = { 'none': 1, 'mild': 2, 'medium': 3, 'hot': 5 };
  profile.spicyTolerance = spiceLevelMap[answers.spice_level] || 3;
  
  // 단맛 선호도 (기본값)
  profile.sweetPreference = 3;
  
  // 가격 선호도
  const budgetMap = { 'budget': '저렴한', 'moderate': '보통', 'premium': '고급', 'luxury': '고급' };
  profile.pricePreference = budgetMap[answers.dining_budget] || '보통';
  
  // 분위기 스타일
  profile.atmosphereStyle = [];
  if (answers.atmosphere === 'trendy') profile.atmosphereStyle.push('힙한');
  if (answers.atmosphere === 'lively') profile.atmosphereStyle.push('활기찬');
  if (answers.atmosphere === 'cozy') profile.atmosphereStyle.push('조용한');
  if (answers.atmosphere === 'casual') profile.atmosphereStyle.push('캐주얼');
  
  // 요리 전문성
  profile.cuisineExpertise = [];
  if (answers.cuisine_preference === 'korean') profile.cuisineExpertise.push('한식');
  if (answers.cuisine_preference === 'western') profile.cuisineExpertise.push('양식');
  if (answers.cuisine_preference === 'asian') {
    profile.cuisineExpertise.push('중식');
    profile.cuisineExpertise.push('일식');
  }
  if (answers.cuisine_preference === 'diverse') {
    profile.cuisineExpertise.push('한식');
    profile.cuisineExpertise.push('양식');
    profile.cuisineExpertise.push('기타');
  }

  return profile;
}

module.exports = router;