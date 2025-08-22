const { TasteType, UserTasteProfile } = require('../models/TasteProfile');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const TASTE_TYPES = [
  {
    name: 'adventurer',
    koreanName: '모험가',
    emoji: '🌏',
    description: '다양한 문화의 음식을 탐험하며 새로운 맛을 찾아다니는 미식 모험가',
    characteristics: [
      '이국적인 요리를 즐김',
      '새로운 맛집 발굴을 좋아함',
      '다양한 국가의 음식을 시도',
      '독특한 메뉴에 도전적'
    ],
    preferredCategories: ['동남아', '중식', '일식', '기타'],
    preferredAtmosphere: ['힙한', '활기찬', '캐주얼'],
    priceRange: '상관없음',
    spicyTolerance: { min: 3, max: 5 },
    adventurousness: 5
  },
  {
    name: 'traditionalist',
    koreanName: '전통주의자',
    emoji: '🍚',
    description: '한국의 전통 맛을 사랑하고 정통 한식당을 선호하는 클래식한 미식가',
    characteristics: [
      '전통 한식을 선호',
      '오래된 맛집을 좋아함',
      '계절 음식을 즐김',
      '집밥 스타일을 추구'
    ],
    preferredCategories: ['한식'],
    preferredAtmosphere: ['전통적인', '조용한', '캐주얼'],
    priceRange: '보통',
    spicyTolerance: { min: 2, max: 4 },
    adventurousness: 2
  },
  {
    name: 'trendsetter',
    koreanName: '트렌드세터',
    emoji: '📸',
    description: 'SNS에서 화제가 되는 핫플레이스를 찾아다니는 유행 선도자',
    characteristics: [
      'SNS 핫플레이스 방문',
      '비주얼이 예쁜 음식 선호',
      '신규 오픈 맛집 탐방',
      '분위기 좋은 곳 선호'
    ],
    preferredCategories: ['카페', '디저트', '양식'],
    preferredAtmosphere: ['힙한', '로맨틱', '고급스러운'],
    priceRange: '고급',
    spicyTolerance: { min: 1, max: 3 },
    adventurousness: 4
  },
  {
    name: 'comfort_seeker',
    koreanName: '편안함 추구자',
    emoji: '🍜',
    description: '익숙하고 편안한 맛을 찾아 단골집을 만들어가는 안정적인 미식가',
    characteristics: [
      '단골집이 많음',
      '편안한 분위기 선호',
      '가성비를 중시',
      '친숙한 메뉴 선택'
    ],
    preferredCategories: ['한식', '패스트푸드', '카페'],
    preferredAtmosphere: ['조용한', '캐주얼'],
    priceRange: '저렴한',
    spicyTolerance: { min: 2, max: 3 },
    adventurousness: 2
  },
  {
    name: 'gourmet',
    koreanName: '미식가',
    emoji: '🍷',
    description: '고급 레스토랑과 파인다이닝을 즐기는 세련된 미식가',
    characteristics: [
      '파인다이닝 경험 풍부',
      '음식의 질을 최우선시',
      '와인 페어링 즐김',
      '셰프 추천 메뉴 선호'
    ],
    preferredCategories: ['양식', '일식'],
    preferredAtmosphere: ['고급스러운', '로맨틱', '조용한'],
    priceRange: '고급',
    spicyTolerance: { min: 1, max: 3 },
    adventurousness: 3
  },
  {
    name: 'social_diner',
    koreanName: '소셜 다이너',
    emoji: '🍻',
    description: '친구들과 함께 즐거운 시간을 보내기 좋은 곳을 찾는 사교적인 미식가',
    characteristics: [
      '단체 모임 장소 선호',
      '분위기 좋은 술집 탐방',
      '나눠먹기 좋은 메뉴',
      '활기찬 분위기 선호'
    ],
    preferredCategories: ['주점', '한식', '중식'],
    preferredAtmosphere: ['활기찬', '캐주얼'],
    priceRange: '보통',
    spicyTolerance: { min: 2, max: 4 },
    adventurousness: 3
  },
  {
    name: 'sweet_tooth',
    koreanName: '디저트 러버',
    emoji: '🍰',
    description: '달콤한 디저트와 예쁜 카페를 사랑하는 스위트한 미식가',
    characteristics: [
      '디저트 카페 전문가',
      '베이커리 순례자',
      '커피 애호가',
      '브런치 즐기기'
    ],
    preferredCategories: ['카페', '디저트'],
    preferredAtmosphere: ['로맨틱', '조용한', '힙한'],
    priceRange: '보통',
    spicyTolerance: { min: 1, max: 2 },
    adventurousness: 3
  },
  {
    name: 'health_conscious',
    koreanName: '건강 지향',
    emoji: '🥗',
    description: '건강하고 균형잡힌 식사를 추구하는 웰빙 미식가',
    characteristics: [
      '샐러드바 자주 방문',
      '비건/채식 옵션 선호',
      '유기농 재료 중시',
      '칼로리 의식'
    ],
    preferredCategories: ['양식', '카페'],
    preferredAtmosphere: ['조용한', '캐주얼'],
    priceRange: '고급',
    spicyTolerance: { min: 1, max: 3 },
    adventurousness: 3
  }
];

const initializeTasteTypes = async () => {
  try {
    for (const type of TASTE_TYPES) {
      await TasteType.findOneAndUpdate(
        { name: type.name },
        type,
        { upsert: true, new: true }
      );
    }
    console.log('Taste types initialized successfully');
  } catch (error) {
    console.error('Error initializing taste types:', error);
  }
};

const analyzeUserTaste = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate('visitedRestaurants.restaurant');

    if (!user || user.visitedRestaurants.length < 5) {
      return {
        error: '취향 분석을 위해서는 최소 5개 이상의 맛집 방문 기록이 필요합니다.'
      };
    }

    const categoryCount = {};
    const atmosphereCount = {};
    const priceRanges = [];
    const spicyRatings = [];
    let totalRating = 0;
    const uniqueCategories = new Set();

    for (const visit of user.visitedRestaurants) {
      if (!visit.restaurant) continue;

      const restaurant = visit.restaurant;
      
      categoryCount[restaurant.category] = (categoryCount[restaurant.category] || 0) + 1;
      uniqueCategories.add(restaurant.category);
      
      if (restaurant.features) {
        restaurant.features.forEach(feature => {
          atmosphereCount[feature] = (atmosphereCount[feature] || 0) + 1;
        });
      }
      
      if (restaurant.priceRange) {
        priceRanges.push(restaurant.priceRange);
      }
      
      if (restaurant.dnaProfile?.spicyLevel) {
        spicyRatings.push(restaurant.dnaProfile.spicyLevel);
      }
      
      if (visit.rating) {
        totalRating += visit.rating;
      }
    }

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / user.visitedRestaurants.length) * 100
      }));

    const averageRating = totalRating / user.visitedRestaurants.filter(v => v.rating).length;
    const diversityScore = (uniqueCategories.size / user.visitedRestaurants.length) * 100;
    const averageSpicy = spicyRatings.length > 0 
      ? spicyRatings.reduce((a, b) => a + b) / spicyRatings.length 
      : 3;

    const mostCommonPriceRange = getMostCommon(priceRanges) || '보통';

    const typeScores = await calculateTypeScores({
      topCategories,
      atmosphereCount,
      priceRange: mostCommonPriceRange,
      spicyPreference: averageSpicy,
      diversityScore,
      visitCount: user.visitedRestaurants.length,
      loyaltyScore: calculateLoyaltyScore(user.visitedRestaurants),
      trendingScore: await calculateTrendingScore(user.visitedRestaurants),
      averageRating
    });

    // typeScores는 이미 정렬되어 있음
    const primaryType = typeScores[0];
    const secondaryType = typeScores[1];

    const profile = await UserTasteProfile.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        primaryType: primaryType.tasteType,
        secondaryType: secondaryType.tasteType,
        typeScores: typeScores,
        analysisData: {
          totalRestaurants: user.visitedRestaurants.length,
          topCategories,
          averagePriceRange: mostCommonPriceRange,
          averageRating,
          spicyPreference: averageSpicy,
          sweetPreference: user.tasteProfile?.sweetPreference || 3,
          diversityScore,
          loyaltyScore: calculateLoyaltyScore(user.visitedRestaurants),
          trendingScore: await calculateTrendingScore(user.visitedRestaurants),
          lastAnalyzedAt: new Date()
        }
      },
      { upsert: true, new: true }
    ).populate('primaryType secondaryType');

    return profile;
  } catch (error) {
    console.error('Error analyzing user taste:', error);
    throw error;
  }
};

const calculateTypeScores = async ({ 
  topCategories, 
  atmosphereCount, 
  priceRange, 
  spicyPreference, 
  diversityScore, 
  visitCount,
  loyaltyScore,
  trendingScore,
  averageRating 
}) => {
  const types = await TasteType.find();
  const rawScores = [];

  for (const type of types) {
    let score = 0;

    // 카테고리 매칭 (40% 가중치)
    let categoryScore = 0;
    topCategories.forEach(({ category, percentage }) => {
      if (type.preferredCategories.includes(category)) {
        categoryScore += percentage;
      }
    });
    score += categoryScore * 0.4;

    // 분위기 매칭 (20% 가중치)
    let atmosphereScore = 0;
    const totalAtmosphereCount = Object.values(atmosphereCount).reduce((a, b) => a + b, 0);
    Object.entries(atmosphereCount).forEach(([atmosphere, count]) => {
      if (type.preferredAtmosphere.includes(atmosphere)) {
        atmosphereScore += (count / totalAtmosphereCount) * 100;
      }
    });
    score += atmosphereScore * 0.2;

    // 가격대 매칭 (15% 가중치)
    if (type.priceRange === priceRange || type.priceRange === '상관없음') {
      score += 15;
    }

    // 매운맛 선호도 매칭 (10% 가중치)
    if (spicyPreference >= type.spicyTolerance.min && spicyPreference <= type.spicyTolerance.max) {
      const spicyMatch = 100 - Math.abs((type.spicyTolerance.min + type.spicyTolerance.max) / 2 - spicyPreference) * 20;
      score += Math.max(0, spicyMatch * 0.1);
    }

    // 모험심 매칭 (10% 가중치)
    const adventureScore = diversityScore / 20; // 0-5 스케일로 변환
    const adventureMatch = 100 - Math.abs(type.adventurousness - adventureScore) * 20;
    score += Math.max(0, adventureMatch * 0.1);

    // 추가 특성 점수 (5% 가중치)
    let bonusScore = 0;
    
    // 전통주의자는 충성도가 높을수록 점수 증가
    if (type.name === 'traditionalist') {
      bonusScore += loyaltyScore * 0.5;
    }
    
    // 트렌드세터는 트렌딩 점수가 높을수록 점수 증가  
    if (type.name === 'trendsetter') {
      bonusScore += trendingScore * 0.5;
    }
    
    // 미식가는 평점이 높을수록 점수 증가
    if (type.name === 'gourmet' && averageRating) {
      bonusScore += (averageRating - 3) * 20; // 3점 기준으로 가점
    }
    
    // 편안함 추구자는 충성도가 높고 다양성이 낮을수록 점수 증가
    if (type.name === 'comfort_seeker') {
      bonusScore += loyaltyScore * 0.3;
      bonusScore += Math.max(0, (50 - diversityScore) * 0.2);
    }

    // 모험가는 다양성이 높을수록 점수 증가
    if (type.name === 'adventurer') {
      bonusScore += Math.max(0, (diversityScore - 30) * 0.3);
    }

    score += bonusScore * 0.05;

    rawScores.push({
      type,
      rawScore: Math.max(0, score)
    });
  }

  // 점수 정규화 (모든 타입의 합이 100%가 되도록)
  const totalRawScore = rawScores.reduce((sum, item) => sum + item.rawScore, 0);
  
  const normalizedScores = rawScores.map(({ type, rawScore }) => {
    const percentage = totalRawScore > 0 ? (rawScore / totalRawScore) * 100 : 100 / rawScores.length;
    return {
      tasteType: type._id,
      typeName: type.name,
      typeKoreanName: type.koreanName,
      percentage: Math.round(percentage * 10) / 10, // 소수점 첫째자리까지
      rawScore,
      emoji: type.emoji
    };
  });

  // 퍼센티지 기준으로 정렬
  return normalizedScores.sort((a, b) => b.percentage - a.percentage);
};

const calculateSmartCompatibilityScore = (userProfile, otherProfile) => {
  if (!userProfile.typeScores || !otherProfile.typeScores) {
    return 0;
  }

  // 코사인 유사도 계산 (벡터 유사도)
  const userVector = userProfile.typeScores.map(score => score.percentage || 0);
  const otherVector = otherProfile.typeScores.map(score => score.percentage || 0);

  // 벡터의 내적 계산
  let dotProduct = 0;
  let userMagnitude = 0;
  let otherMagnitude = 0;

  for (let i = 0; i < Math.min(userVector.length, otherVector.length); i++) {
    dotProduct += userVector[i] * otherVector[i];
    userMagnitude += userVector[i] * userVector[i];
    otherMagnitude += otherVector[i] * otherVector[i];
  }

  userMagnitude = Math.sqrt(userMagnitude);
  otherMagnitude = Math.sqrt(otherMagnitude);

  if (userMagnitude === 0 || otherMagnitude === 0) {
    return 0;
  }

  // 코사인 유사도 (0-1)를 백분율로 변환
  const cosineSimilarity = dotProduct / (userMagnitude * otherMagnitude);
  let compatibilityScore = cosineSimilarity * 100;

  // 추가 보정 요소들
  if (userProfile.analysisData && otherProfile.analysisData) {
    // 가격대 유사도 보너스
    if (userProfile.analysisData.averagePriceRange === otherProfile.analysisData.averagePriceRange) {
      compatibilityScore += 5;
    }

    // 매운맛 선호도 유사도 보너스
    const spicyDiff = Math.abs(
      (userProfile.analysisData.spicyPreference || 3) - 
      (otherProfile.analysisData.spicyPreference || 3)
    );
    compatibilityScore += Math.max(0, 5 - spicyDiff);

    // 다양성 점수 유사도 보너스
    const diversityDiff = Math.abs(
      (userProfile.analysisData.diversityScore || 50) - 
      (otherProfile.analysisData.diversityScore || 50)
    );
    compatibilityScore += Math.max(0, 5 - diversityDiff / 10);

    // 평점 유사도 보너스
    const ratingDiff = Math.abs(
      (userProfile.analysisData.averageRating || 3.5) - 
      (otherProfile.analysisData.averageRating || 3.5)
    );
    compatibilityScore += Math.max(0, 3 - ratingDiff);
  }

  return Math.min(100, Math.max(0, Math.round(compatibilityScore * 10) / 10));
};

const findMatchingUsers = async (userId, limit = 10) => {
  try {
    const userProfile = await UserTasteProfile.findOne({ user: userId })
      .populate('typeScores.tasteType');
    
    if (!userProfile || !userProfile.typeScores) {
      return [];
    }

    // 모든 다른 사용자들의 프로필 가져오기
    const allProfiles = await UserTasteProfile.find({
      user: { $ne: userId },
      confirmedByUser: true,
      'typeScores.0': { $exists: true } // typeScores가 비어있지 않은 것만
    })
    .populate('user', 'username profileImage bio trustScore')
    .populate('typeScores.tasteType')
    .limit(limit * 3); // 더 많이 가져와서 정확한 매칭 가능

    const matchingUsers = allProfiles.map(profile => {
      const compatibilityScore = calculateSmartCompatibilityScore(userProfile, profile);
      
      // 공통 상위 타입 찾기 (15% 이상인 타입들)
      const userTopTypes = userProfile.typeScores
        .filter(score => score.percentage >= 15)
        .map(score => score.tasteType._id.toString());
      
      const otherTopTypes = profile.typeScores
        .filter(score => score.percentage >= 15)
        .map(score => score.tasteType._id.toString());

      const sharedTypes = userProfile.typeScores.filter(userScore => {
        return otherTopTypes.includes(userScore.tasteType._id.toString()) && 
               userScore.percentage >= 15;
      }).map(score => score.tasteType);

      // 취향 유사도 등급 계산
      let compatibilityGrade = 'C';
      if (compatibilityScore >= 85) compatibilityGrade = 'S';
      else if (compatibilityScore >= 75) compatibilityGrade = 'A';
      else if (compatibilityScore >= 65) compatibilityGrade = 'B';

      return {
        user: profile.user,
        compatibility: compatibilityScore,
        compatibilityGrade,
        sharedTypes: [...new Set(sharedTypes)],
        tasteVector: profile.typeScores.map(score => ({
          type: score.typeKoreanName || score.tasteType.koreanName,
          percentage: score.percentage
        }))
      };
    });

    return matchingUsers
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding matching users:', error);
    throw error;
  }
};

const getMostCommon = (arr) => {
  if (arr.length === 0) return null;
  const counts = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
};

const calculateLoyaltyScore = (visitedRestaurants) => {
  const restaurantVisits = {};
  visitedRestaurants.forEach(visit => {
    const id = visit.restaurant?._id?.toString();
    if (id) {
      restaurantVisits[id] = (restaurantVisits[id] || 0) + 1;
    }
  });
  
  const repeatVisits = Object.values(restaurantVisits).filter(count => count > 1).length;
  return (repeatVisits / Object.keys(restaurantVisits).length) * 100;
};

const calculateTrendingScore = async (visitedRestaurants) => {
  const recentVisits = visitedRestaurants.filter(visit => {
    const visitDate = new Date(visit.visitedAt);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return visitDate > threeMonthsAgo;
  });

  const trendingRestaurants = await Restaurant.find({
    _id: { $in: recentVisits.map(v => v.restaurant?._id).filter(Boolean) },
    createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
  });

  return (trendingRestaurants.length / Math.max(recentVisits.length, 1)) * 100;
};

module.exports = {
  initializeTasteTypes,
  analyzeUserTaste,
  findMatchingUsers,
  TASTE_TYPES
};