const mongoose = require('mongoose');

// 사용자 선호도 스키마 - 추천 알고리즘의 핵심
const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // 1. 게임 기반 선호도 (FoodVS, 음식 MBTI 등에서 수집)
  gamePreferences: {
    cuisineTypes: {
      korean: { type: Number, default: 0 },
      chinese: { type: Number, default: 0 },
      japanese: { type: Number, default: 0 },
      western: { type: Number, default: 0 },
      asian: { type: Number, default: 0 },
      cafe: { type: Number, default: 0 },
      bar: { type: Number, default: 0 },
      fastfood: { type: Number, default: 0 },
      dessert: { type: Number, default: 0 }
    },
    priceRanges: {
      cheap: { type: Number, default: 0 },      // ₩ (1만원 이하)
      moderate: { type: Number, default: 0 },   // ₩₩ (1-3만원)
      expensive: { type: Number, default: 0 },  // ₩₩₩ (3-5만원)
      luxury: { type: Number, default: 0 }      // ₩₩₩₩ (5만원 이상)
    },
    atmospheres: {
      casual: { type: Number, default: 0 },
      romantic: { type: Number, default: 0 },
      business: { type: Number, default: 0 },
      family: { type: Number, default: 0 },
      trendy: { type: Number, default: 0 },
      traditional: { type: Number, default: 0 },
      quiet: { type: Number, default: 0 },
      lively: { type: Number, default: 0 }
    },
    spicyLevel: { type: Number, default: 3, min: 1, max: 5 }, // 1: 못먹음, 5: 매우 잘먹음
    adventureLevel: { type: Number, default: 3, min: 1, max: 5 } // 1: 보수적, 5: 모험적
  },

  // 2. 방문 이력 기반 데이터
  visitHistory: [{
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    visitDate: { type: Date, required: true },
    rating: { type: Number, min: 1, max: 5 },
    spentAmount: Number,
    visitDuration: Number, // 분 단위
    companion: {
      type: String,
      enum: ['alone', 'date', 'friends', 'family', 'business', 'group']
    },
    mealTime: {
      type: String,
      enum: ['breakfast', 'brunch', 'lunch', 'afternoon', 'dinner', 'latenight']
    },
    weatherCondition: String, // 날씨 정보
    isRevisit: { type: Boolean, default: false },
    tags: [String],
    menuOrdered: [{
      name: String,
      liked: Boolean
    }]
  }],

  // 3. 팔로우 정보
  followingPreferences: [{
    curatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    curatorType: {
      type: String,
      enum: ['youtuber', 'local', 'influencer', 'friend', 'expert']
    },
    trustScore: { type: Number, default: 50, min: 0, max: 100 }, // 신뢰도
    interactionCount: { type: Number, default: 0 }, // 상호작용 횟수
    followedAt: { type: Date, default: Date.now }
  }],

  // 4. 좋아요/저장 데이터
  likedRestaurants: [{
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    likedAt: { type: Date, default: Date.now },
    source: String, // 어디서 발견했는지 (playlist, search, recommendation 등)
    tags: [String],
    likeStrength: { type: Number, default: 1, min: 1, max: 3 } // 1: 좋아요, 2: 매우좋아요, 3: 최애
  }],

  // 5. 시간대별 선호도 (추가 데이터 포인트)
  timePreferences: {
    breakfast: { active: Boolean, preferredTime: String },
    lunch: { active: Boolean, preferredTime: String },
    dinner: { active: Boolean, preferredTime: String },
    latenight: { active: Boolean, preferredTime: String },
    weekend: { active: Boolean, preferredTypes: [String] }
  },

  // 6. 동행 패턴 분석
  companionPatterns: {
    alone: { 
      frequency: { type: Number, default: 0 },
      preferredTypes: [String],
      avgSpending: Number
    },
    withDate: {
      frequency: { type: Number, default: 0 },
      preferredTypes: [String],
      avgSpending: Number
    },
    withFriends: {
      frequency: { type: Number, default: 0 },
      preferredTypes: [String],
      avgSpending: Number,
      groupSize: Number
    },
    withFamily: {
      frequency: { type: Number, default: 0 },
      preferredTypes: [String],
      avgSpending: Number
    }
  },

  // 7. 리뷰 텍스트 분석 결과
  reviewAnalysis: {
    frequentKeywords: [{
      keyword: String,
      count: Number,
      sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] }
    }],
    preferredMenuItems: [String],
    dislikedAspects: [String],
    importantFactors: [String] // 맛, 서비스, 분위기, 가성비 등
  },

  // 8. 계절별 선호도
  seasonalPreferences: {
    spring: { preferredTypes: [String], specialMenus: [String] },
    summer: { preferredTypes: [String], specialMenus: [String] },
    autumn: { preferredTypes: [String], specialMenus: [String] },
    winter: { preferredTypes: [String], specialMenus: [String] }
  },

  // 9. 재방문 패턴
  revisitPatterns: {
    highFrequencyRestaurants: [{
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      visitCount: Number,
      avgInterval: Number, // 평균 재방문 간격 (일)
      lastVisit: Date
    }],
    revisitRate: { type: Number, default: 0 }, // 전체 재방문율 %
    loyaltyScore: { type: Number, default: 0 } // 단골 성향 점수
  },

  // 10. 부정적 신호 (비선호 패턴)
  negativeSignals: {
    avoidCuisineTypes: [String],
    avoidPriceRanges: [String],
    avoidAreas: [String],
    blockedRestaurants: [{
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      reason: String,
      blockedAt: Date
    }],
    lowRatedPatterns: {
      commonTags: [String],
      commonReasons: [String]
    }
  },

  // 11. 소셜 그래프 영향도
  socialInfluence: {
    friendsLikedRestaurants: [{
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      friendCount: Number,
      closeFriendCount: Number // 친한 친구 수
    }],
    groupVisitHistory: [{
      restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      visitDate: Date,
      groupSatisfaction: Number
    }]
  },

  // 12. 실시간 컨텍스트
  currentContext: {
    lastLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    },
    recentSearches: [{
      query: String,
      timestamp: Date,
      resultClicked: Boolean
    }],
    currentMood: String,
    currentWeather: String,
    currentBudget: String
  },

  // 메타데이터
  calculatedScores: {
    foodieLevel: { type: Number, default: 1, min: 1, max: 10 },
    explorerLevel: { type: Number, default: 1, min: 1, max: 10 },
    socialLevel: { type: Number, default: 1, min: 1, max: 10 },
    trendSetter: { type: Boolean, default: false }
  },

  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// 인덱스 설정
userPreferenceSchema.index({ userId: 1 });
userPreferenceSchema.index({ 'currentContext.lastLocation': '2dsphere' });
userPreferenceSchema.index({ lastUpdated: -1 });

// 메서드: 선호도 점수 업데이트
userPreferenceSchema.methods.updatePreferenceScore = function(category, type, score) {
  if (this.gamePreferences[category] && this.gamePreferences[category][type] !== undefined) {
    this.gamePreferences[category][type] += score;
    this.lastUpdated = new Date();
  }
};

// 메서드: 방문 기록 추가
userPreferenceSchema.methods.addVisit = function(visitData) {
  this.visitHistory.push(visitData);
  
  // 방문 패턴 업데이트
  if (visitData.companion) {
    const pattern = this.companionPatterns[visitData.companion === 'date' ? 'withDate' : visitData.companion];
    if (pattern) {
      pattern.frequency += 1;
      if (visitData.spentAmount) {
        pattern.avgSpending = (pattern.avgSpending * (pattern.frequency - 1) + visitData.spentAmount) / pattern.frequency;
      }
    }
  }
  
  this.lastUpdated = new Date();
};

// 메서드: 추천 점수 계산
userPreferenceSchema.methods.calculateRecommendationScore = function(restaurant, context = {}) {
  let score = 0;
  const breakdown = {};

  // 1. 요리 타입 매칭
  if (this.gamePreferences.cuisineTypes[restaurant.cuisine]) {
    breakdown.cuisineMatch = this.gamePreferences.cuisineTypes[restaurant.cuisine] * 10;
    score += breakdown.cuisineMatch;
  }

  // 2. 가격대 매칭
  const priceKey = this.getPriceRangeKey(restaurant.priceRange);
  if (this.gamePreferences.priceRanges[priceKey]) {
    breakdown.priceMatch = this.gamePreferences.priceRanges[priceKey] * 5;
    score += breakdown.priceMatch;
  }

  // 3. 시간대 매칭 (현재 시간 기준)
  if (context.currentTime) {
    const mealTime = this.getMealTime(context.currentTime);
    if (this.timePreferences[mealTime]?.active) {
      breakdown.timeMatch = 20;
      score += breakdown.timeMatch;
    }
  }

  // 4. 동행 매칭
  if (context.companion && this.companionPatterns[context.companion]) {
    const pattern = this.companionPatterns[context.companion];
    if (pattern.preferredTypes.includes(restaurant.cuisine)) {
      breakdown.companionMatch = 15;
      score += breakdown.companionMatch;
    }
  }

  // 5. 소셜 영향도
  const socialRestaurant = this.socialInfluence.friendsLikedRestaurants.find(
    r => r.restaurantId.toString() === restaurant._id.toString()
  );
  if (socialRestaurant) {
    breakdown.socialInfluence = socialRestaurant.friendCount * 3 + socialRestaurant.closeFriendCount * 5;
    score += breakdown.socialInfluence;
  }

  // 6. 부정적 신호 체크
  if (this.negativeSignals.avoidCuisineTypes.includes(restaurant.cuisine)) {
    breakdown.negativeSignal = -30;
    score += breakdown.negativeSignal;
  }

  return { totalScore: Math.max(0, score), breakdown };
};

// Helper 메서드들
userPreferenceSchema.methods.getPriceRangeKey = function(priceRange) {
  const mapping = {
    '₩': 'cheap',
    '₩₩': 'moderate',
    '₩₩₩': 'expensive',
    '₩₩₩₩': 'luxury'
  };
  return mapping[priceRange] || 'moderate';
};

userPreferenceSchema.methods.getMealTime = function(hour) {
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'dinner';
  return 'latenight';
};

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreference;