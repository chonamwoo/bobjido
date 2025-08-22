const User = require('../models/User');

/**
 * 동적 취향 업데이트 시스템
 * 사용자의 맛집 등록, 리뷰, 방문 기록을 통해 취향 프로필을 조금씩 업데이트
 */

// 취향 점수 가중치
const TASTE_WEIGHTS = {
  RESTAURANT_REGISTRATION: 0.3,  // 맛집 등록시 가중치
  REVIEW_SUBMISSION: 0.2,        // 리뷰 작성시 가중치
  RESTAURANT_VISIT: 0.1,         // 맛집 방문시 가중치
  PLAYLIST_CREATION: 0.15,       // 플레이리스트 생성시 가중치
  SAVE_RESTAURANT: 0.05          // 맛집 저장시 가중치
};

// 음식 카테고리별 취향 프로필 매핑
const CATEGORY_TASTE_MAPPING = {
  // 한식
  '한식': { traditional_taste: 2, comfort_lover: 1 },
  '김치찌개': { traditional_taste: 2, spicy_adventurer: 1 },
  '불고기': { traditional_taste: 2, social_foodie: 1 },
  '삼겹살': { traditional_taste: 1, social_foodie: 2 },
  
  // 매운 음식
  '마라탕': { spicy_adventurer: 3, trendy_explorer: 1 },
  '떡볶이': { spicy_adventurer: 2, comfort_lover: 1 },
  '매운족발': { spicy_adventurer: 2, social_foodie: 1 },
  '매운닭갈비': { spicy_adventurer: 2, traditional_taste: 1 },
  
  // 양식/이탈리안
  '이탈리안': { premium_diner: 2, trendy_explorer: 1 },
  '파스타': { premium_diner: 1, comfort_lover: 1 },
  '피자': { social_foodie: 2, comfort_lover: 1 },
  '스테이크': { premium_diner: 3, traditional_taste: 1 },
  
  // 카페/디저트
  '카페': { trendy_explorer: 2, solo_explorer: 1 },
  '디저트': { trendy_explorer: 2, comfort_lover: 1 },
  '브런치': { trendy_explorer: 2, premium_diner: 1 },
  
  // 예산 친화적
  '분식': { budget_gourmet: 2, comfort_lover: 1 },
  '치킨': { social_foodie: 2, comfort_lover: 1 },
  '버거': { budget_gourmet: 1, social_foodie: 1 },
  
  // 고급 요리
  '파인다이닝': { premium_diner: 3, trendy_explorer: 1 },
  '오마카세': { premium_diner: 3, traditional_taste: 1 },
  '와인바': { premium_diner: 2, social_foodie: 1 }
};

// 가격대별 취향 프로필 매핑
const PRICE_TASTE_MAPPING = {
  '저렴': { budget_gourmet: 2, comfort_lover: 1 },
  '보통': { budget_gourmet: 1, social_foodie: 1 },
  '비싼': { premium_diner: 2, trendy_explorer: 1 },
  '매우비싼': { premium_diner: 3, trendy_explorer: 1 }
};

// 분위기별 취향 프로필 매핑
const ATMOSPHERE_TASTE_MAPPING = {
  '힙한': { trendy_explorer: 2, social_foodie: 1 },
  '아늑한': { comfort_lover: 2, solo_explorer: 1 },
  '캐주얼': { social_foodie: 2, comfort_lover: 1 },
  '고급스러운': { premium_diner: 2, trendy_explorer: 1 },
  '활기찬': { social_foodie: 2, trendy_explorer: 1 },
  '조용한': { solo_explorer: 2, comfort_lover: 1 }
};

/**
 * 사용자의 행동을 바탕으로 취향 점수 업데이트
 * @param {string} userId - 사용자 ID
 * @param {string} actionType - 행동 타입 (restaurant_registration, review, visit, etc.)
 * @param {Object} restaurantData - 맛집 데이터
 */
async function updateTasteProfile(userId, actionType, restaurantData) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // 현재 취향 프로필 점수 가져오기 (없으면 초기화)
    let tasteScores = user.tasteProfile?.scores || {
      spicy_adventurer: 0,
      trendy_explorer: 0,
      comfort_lover: 0,
      social_foodie: 0,
      budget_gourmet: 0,
      premium_diner: 0,
      solo_explorer: 0,
      traditional_taste: 0
    };

    // 행동별 가중치
    const weight = TASTE_WEIGHTS[actionType.toUpperCase()] || 0.1;
    
    // 맛집 데이터를 바탕으로 점수 계산
    const scoreChanges = calculateScoreChanges(restaurantData, weight);
    
    // 점수 업데이트 (소수점으로 누적)
    Object.keys(scoreChanges).forEach(profileType => {
      tasteScores[profileType] = (tasteScores[profileType] || 0) + scoreChanges[profileType];
    });

    // 주요 취향 프로필 결정 (가장 높은 점수)
    const mainProfile = Object.entries(tasteScores).reduce((a, b) => 
      tasteScores[a[0]] > tasteScores[b[0]] ? a : b
    )[0];

    // 사용자 프로필 업데이트
    await User.findByIdAndUpdate(userId, {
      'tasteProfile.type': mainProfile,
      'tasteProfile.scores': tasteScores,
      'tasteProfile.lastUpdated': new Date()
    });

    console.log(`✅ 취향 프로필 업데이트: ${user.username} -> ${mainProfile}`);
    
    return { success: true, newProfile: mainProfile, scores: tasteScores };
  } catch (error) {
    console.error('❌ 취향 프로필 업데이트 실패:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 맛집 데이터를 바탕으로 점수 변화량 계산
 * @param {Object} restaurantData - 맛집 정보
 * @param {number} weight - 가중치
 * @returns {Object} - 각 취향 프로필별 점수 변화량
 */
function calculateScoreChanges(restaurantData, weight) {
  const scoreChanges = {
    spicy_adventurer: 0,
    trendy_explorer: 0,
    comfort_lover: 0,
    social_foodie: 0,
    budget_gourmet: 0,
    premium_diner: 0,
    solo_explorer: 0,
    traditional_taste: 0
  };

  // 1. 카테고리 기반 점수
  if (restaurantData.category) {
    const categoryMapping = CATEGORY_TASTE_MAPPING[restaurantData.category];
    if (categoryMapping) {
      Object.entries(categoryMapping).forEach(([profile, points]) => {
        scoreChanges[profile] += points * weight;
      });
    }
  }

  // 2. 가격대 기반 점수
  if (restaurantData.priceRange) {
    const priceMapping = PRICE_TASTE_MAPPING[restaurantData.priceRange];
    if (priceMapping) {
      Object.entries(priceMapping).forEach(([profile, points]) => {
        scoreChanges[profile] += points * weight;
      });
    }
  }

  // 3. 분위기 기반 점수 (dnaProfile.atmosphere 배열)
  if (restaurantData.dnaProfile?.atmosphere) {
    restaurantData.dnaProfile.atmosphere.forEach(atmosphere => {
      const atmosphereMapping = ATMOSPHERE_TASTE_MAPPING[atmosphere];
      if (atmosphereMapping) {
        Object.entries(atmosphereMapping).forEach(([profile, points]) => {
          scoreChanges[profile] += points * weight * 0.5; // 분위기는 절반 가중치
        });
      }
    });
  }

  // 4. 특별한 태그들 기반 점수
  if (restaurantData.tags) {
    restaurantData.tags.forEach(tag => {
      if (tag.includes('매운')) {
        scoreChanges.spicy_adventurer += 1 * weight;
      }
      if (tag.includes('힙한') || tag.includes('트렌디')) {
        scoreChanges.trendy_explorer += 1 * weight;
      }
      if (tag.includes('가성비') || tag.includes('저렴')) {
        scoreChanges.budget_gourmet += 1 * weight;
      }
      if (tag.includes('고급') || tag.includes('프리미엄')) {
        scoreChanges.premium_diner += 1 * weight;
      }
      if (tag.includes('혼밥')) {
        scoreChanges.solo_explorer += 1 * weight;
      }
      if (tag.includes('단체') || tag.includes('모임')) {
        scoreChanges.social_foodie += 1 * weight;
      }
    });
  }

  return scoreChanges;
}

/**
 * 리뷰 내용을 분석하여 취향 점수 업데이트
 * @param {string} userId - 사용자 ID
 * @param {string} reviewContent - 리뷰 내용
 * @param {number} rating - 평점
 */
async function updateTasteFromReview(userId, reviewContent, rating) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    let tasteScores = user.tasteProfile?.scores || {};
    const weight = TASTE_WEIGHTS.REVIEW_SUBMISSION;

    // 리뷰 내용 키워드 분석
    const reviewAnalysis = analyzeReviewContent(reviewContent);
    
    // 평점 기반 가중치 조정 (높은 평점일수록 더 강한 취향 반영)
    const ratingWeight = rating >= 4 ? 1.2 : rating <= 2 ? 0.8 : 1.0;
    
    Object.entries(reviewAnalysis).forEach(([profile, points]) => {
      tasteScores[profile] = (tasteScores[profile] || 0) + (points * weight * ratingWeight);
    });

    // 주요 취향 프로필 재계산
    const mainProfile = Object.entries(tasteScores).reduce((a, b) => 
      tasteScores[a[0]] > tasteScores[b[0]] ? a : b
    )[0];

    await User.findByIdAndUpdate(userId, {
      'tasteProfile.type': mainProfile,
      'tasteProfile.scores': tasteScores,
      'tasteProfile.lastUpdated': new Date()
    });

    return { success: true, newProfile: mainProfile };
  } catch (error) {
    console.error('❌ 리뷰 기반 취향 업데이트 실패:', error);
    return { success: false };
  }
}

/**
 * 리뷰 내용 키워드 분석
 * @param {string} content - 리뷰 내용
 * @returns {Object} - 취향 프로필별 점수
 */
function analyzeReviewContent(content) {
  const analysis = {
    spicy_adventurer: 0,
    trendy_explorer: 0,
    comfort_lover: 0,
    social_foodie: 0,
    budget_gourmet: 0,
    premium_diner: 0,
    solo_explorer: 0,
    traditional_taste: 0
  };

  const lowerContent = content.toLowerCase();

  // 매운맛 키워드
  if (lowerContent.includes('매운') || lowerContent.includes('맵다') || lowerContent.includes('얼큰')) {
    analysis.spicy_adventurer += 2;
  }

  // 트렌디 키워드
  if (lowerContent.includes('힙한') || lowerContent.includes('분위기') || lowerContent.includes('인스타')) {
    analysis.trendy_explorer += 2;
  }

  // 편안함 키워드
  if (lowerContent.includes('편안') || lowerContent.includes('아늑') || lowerContent.includes('따뜻')) {
    analysis.comfort_lover += 2;
  }

  // 소셜 키워드
  if (lowerContent.includes('친구') || lowerContent.includes('모임') || lowerContent.includes('함께')) {
    analysis.social_foodie += 2;
  }

  // 가성비 키워드
  if (lowerContent.includes('가성비') || lowerContent.includes('저렴') || lowerContent.includes('합리적')) {
    analysis.budget_gourmet += 2;
  }

  // 프리미엄 키워드
  if (lowerContent.includes('고급') || lowerContent.includes('프리미엄') || lowerContent.includes('품격')) {
    analysis.premium_diner += 2;
  }

  // 혼밥 키워드
  if (lowerContent.includes('혼자') || lowerContent.includes('혼밥') || lowerContent.includes('조용')) {
    analysis.solo_explorer += 2;
  }

  // 전통 키워드
  if (lowerContent.includes('전통') || lowerContent.includes('한식') || lowerContent.includes('집밥')) {
    analysis.traditional_taste += 2;
  }

  return analysis;
}

module.exports = {
  updateTasteProfile,
  updateTasteFromReview,
  TASTE_WEIGHTS,
  CATEGORY_TASTE_MAPPING
};