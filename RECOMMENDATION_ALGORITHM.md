# BobsMap 추천 알고리즘 문서

## 📋 목차
1. [개요](#개요)
2. [데이터 수집 체계](#데이터-수집-체계)
3. [추천 알고리즘 구조](#추천-알고리즘-구조)
4. [점수 계산 상세](#점수-계산-상세)
5. [MongoDB 스키마](#mongodb-스키마)
6. [실시간 컨텍스트](#실시간-컨텍스트)
7. [A/B 테스트 및 최적화](#ab-테스트-및-최적화)
8. [성능 최적화](#성능-최적화)

## 개요

BobsMap의 추천 시스템은 **다차원 하이브리드 추천 알고리즘**을 사용합니다. 사용자의 명시적 선호(게임, 좋아요)와 암묵적 행동(방문 패턴, 체류 시간)을 종합적으로 분석하여 개인화된 맛집을 추천합니다.

### 핵심 목표
- **정확도**: 사용자가 실제로 만족할 맛집 추천
- **다양성**: 새로운 발견의 기회 제공
- **실시간성**: 현재 상황에 맞는 즉각적 추천
- **설명가능성**: 추천 이유를 명확히 제시

## 데이터 수집 체계

### 1. 명시적 데이터 (Explicit Feedback)
```javascript
{
  // 게임을 통한 선호도 수집
  gameData: {
    foodVS: "매운음식 vs 안매운음식 선택 이력",
    foodMBTI: "음식 성향 테스트 결과",
    moodFood: "기분별 음식 선택 패턴"
  },
  
  // 직접적인 평가
  ratings: "1-5점 평가",
  likes: "좋아요/북마크",
  reviews: "텍스트 리뷰"
}
```

### 2. 암묵적 데이터 (Implicit Feedback)
```javascript
{
  // 행동 패턴 분석
  clickStream: "클릭/조회 이력",
  dwellTime: "페이지 체류 시간",
  scrollDepth: "스크롤 깊이",
  
  // 방문 패턴
  visitFrequency: "방문 빈도",
  revisitRate: "재방문율",
  visitDuration: "식당 체류 시간"
}
```

### 3. 컨텍스트 데이터 (Contextual Information)
```javascript
{
  temporal: {
    time: "현재 시간",
    day: "요일",
    season: "계절",
    weather: "날씨"
  },
  
  spatial: {
    location: "현재 위치",
    travelDistance: "이동 가능 거리"
  },
  
  social: {
    companion: "동행자 정보",
    groupSize: "인원수",
    occasion: "특별한 날/일상"
  }
}
```

## 추천 알고리즘 구조

### 점수 계산 공식
```
TotalScore = Σ(Wi × Si)

where:
  Wi = 가중치 (Weight)
  Si = 개별 점수 (Score)
```

### 가중치 배분 (총 100%)
| 요소 | 가중치 | 설명 |
|------|--------|------|
| 게임 선호도 | 20% | FoodVS, MBTI 등 게임 결과 |
| 방문 이력 | 15% | 과거 방문 패턴 분석 |
| 팔로우 큐레이터 | 15% | 신뢰하는 맛잘알 추천 |
| 좋아요 패턴 | 10% | 좋아요한 맛집 특성 |
| 소셜 영향 | 10% | 친구들의 선호도 |
| 시간 컨텍스트 | 10% | 현재 시간대 적합성 |
| 동행 컨텍스트 | 8% | 동행자별 선호 패턴 |
| 계절 컨텍스트 | 5% | 계절 메뉴 선호도 |
| 트렌딩 | 5% | 현재 인기도 |
| 거리 | 2% | 물리적 접근성 |

## 점수 계산 상세

### 1. 게임 선호도 점수 (Game Preference Score)
```javascript
function calculateGamePreferenceScore(restaurant, userPreference) {
  let score = 0;
  
  // 요리 타입 매칭 (0-40점)
  const cuisineMatch = userPreference.cuisineTypes[restaurant.cuisine] || 0;
  score += cuisineMatch * 10;
  
  // 가격대 매칭 (0-30점)
  const priceMatch = userPreference.priceRanges[restaurant.priceRange] || 0;
  score += priceMatch * 8;
  
  // 분위기 매칭 (0-20점)
  restaurant.atmospheres.forEach(atmo => {
    score += (userPreference.atmospheres[atmo] || 0) * 5;
  });
  
  // 매운맛 선호도 (한식 한정, 0-10점)
  if (restaurant.cuisine === 'korean') {
    const spicyDiff = Math.abs(userPreference.spicyLevel - restaurant.spicyLevel);
    score += Math.max(0, 10 - spicyDiff * 2);
  }
  
  return Math.min(100, score);
}
```

### 2. 방문 이력 점수 (Visit History Score)
```javascript
function calculateVisitHistoryScore(restaurant, visitHistory) {
  let score = 0;
  
  // 유사 카테고리 방문 빈도 (0-40점)
  const similarVisits = visitHistory.filter(v => 
    v.category === restaurant.category
  );
  score += Math.min(40, similarVisits.length * 5);
  
  // 재방문율 고려 (0-30점)
  const revisitedSimilar = similarVisits.filter(v => v.isRevisit);
  const revisitRate = revisitedSimilar.length / (similarVisits.length || 1);
  score += revisitRate * 30;
  
  // 평균 평점 고려 (0-30점)
  const avgRating = calculateAverageRating(similarVisits);
  score += (avgRating / 5) * 30;
  
  return Math.min(100, score);
}
```

### 3. 소셜 영향도 점수 (Social Influence Score)
```javascript
function calculateSocialScore(restaurant, socialData) {
  let score = 0;
  
  // 친구 추천 (0-50점)
  score += socialData.friendsLiked * 10;
  score += socialData.closeFriendsLiked * 20;
  
  // 그룹 방문 만족도 (0-30점)
  if (socialData.groupVisitSatisfaction) {
    score += socialData.groupVisitSatisfaction * 6;
  }
  
  // 소셜 트렌드 (0-20점)
  score += Math.min(20, socialData.trendingAmongFriends * 5);
  
  return Math.min(100, score);
}
```

### 4. 시간대 컨텍스트 점수 (Time Context Score)
```javascript
function calculateTimeContextScore(restaurant, currentTime) {
  let score = 0;
  const hour = currentTime.getHours();
  
  // 영업시간 체크 (0 or 50점)
  if (!isRestaurantOpen(restaurant, currentTime)) {
    return 0;
  }
  score += 50;
  
  // 시간대별 인기도 (0-30점)
  const mealTime = getMealTime(hour);
  score += restaurant.popularityByTime[mealTime] * 10;
  
  // 대기시간 예측 (0-20점)
  const expectedWait = predictWaitTime(restaurant, currentTime);
  score += Math.max(0, 20 - expectedWait);
  
  return Math.min(100, score);
}
```

## MongoDB 스키마

### UserPreference Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  
  // 게임 선호도
  gamePreferences: {
    cuisineTypes: {
      korean: 85,
      japanese: 70,
      western: 60,
      chinese: 45
    },
    priceRanges: {
      cheap: 30,
      moderate: 70,
      expensive: 50,
      luxury: 20
    },
    atmospheres: {
      casual: 80,
      romantic: 40,
      business: 20,
      trendy: 60
    },
    spicyLevel: 4,  // 1-5
    adventureLevel: 3  // 1-5
  },
  
  // 방문 이력
  visitHistory: [{
    restaurantId: ObjectId,
    visitDate: Date,
    rating: 4.5,
    spentAmount: 25000,
    visitDuration: 90,  // minutes
    companion: "friends",
    mealTime: "dinner",
    weatherCondition: "sunny",
    isRevisit: false,
    tags: ["맛있음", "분위기좋음"],
    menuOrdered: [
      { name: "파스타", liked: true },
      { name: "피자", liked: false }
    ]
  }],
  
  // 팔로우 정보
  followingPreferences: [{
    curatorId: ObjectId,
    curatorType: "influencer",
    trustScore: 85,
    interactionCount: 12,
    followedAt: Date
  }],
  
  // 좋아요/저장
  likedRestaurants: [{
    restaurantId: ObjectId,
    likedAt: Date,
    source: "search",
    tags: ["데이트", "분위기"],
    likeStrength: 3  // 1-3
  }],
  
  // 시간대별 선호도
  timePreferences: {
    breakfast: { 
      active: false, 
      preferredTime: "08:00-10:00" 
    },
    lunch: { 
      active: true, 
      preferredTime: "12:00-13:00" 
    },
    dinner: { 
      active: true, 
      preferredTime: "18:00-20:00" 
    },
    latenight: { 
      active: true, 
      preferredTime: "22:00-02:00" 
    }
  },
  
  // 동행 패턴
  companionPatterns: {
    alone: {
      frequency: 15,
      preferredTypes: ["ramen", "fastfood"],
      avgSpending: 12000
    },
    withDate: {
      frequency: 8,
      preferredTypes: ["italian", "wine_bar"],
      avgSpending: 60000
    },
    withFriends: {
      frequency: 20,
      preferredTypes: ["korean", "pub"],
      avgSpending: 25000,
      groupSize: 4
    }
  },
  
  // 리뷰 분석
  reviewAnalysis: {
    frequentKeywords: [
      { keyword: "맛있", count: 45, sentiment: "positive" },
      { keyword: "비싸", count: 12, sentiment: "negative" },
      { keyword: "분위기", count: 30, sentiment: "positive" }
    ],
    preferredMenuItems: ["파스타", "스테이크", "샐러드"],
    dislikedAspects: ["긴 대기시간", "시끄러운 분위기"],
    importantFactors: ["맛", "분위기", "서비스"]
  },
  
  // 계절별 선호도
  seasonalPreferences: {
    spring: { 
      preferredTypes: ["korean", "japanese"],
      specialMenus: ["봄나물", "딸기디저트"]
    },
    summer: { 
      preferredTypes: ["cold_noodles", "bingsu"],
      specialMenus: ["냉면", "빙수", "맥주"]
    },
    autumn: { 
      preferredTypes: ["korean", "bbq"],
      specialMenus: ["전골", "구이"]
    },
    winter: { 
      preferredTypes: ["soup", "hot_pot"],
      specialMenus: ["찌개", "탕", "전골"]
    }
  },
  
  // 재방문 패턴
  revisitPatterns: {
    highFrequencyRestaurants: [{
      restaurantId: ObjectId,
      visitCount: 8,
      avgInterval: 14,  // days
      lastVisit: Date
    }],
    revisitRate: 35,  // percentage
    loyaltyScore: 75  // 0-100
  },
  
  // 부정적 신호
  negativeSignals: {
    avoidCuisineTypes: ["indian"],
    avoidPriceRanges: ["luxury"],
    avoidAreas: ["이태원"],
    blockedRestaurants: [{
      restaurantId: ObjectId,
      reason: "bad_experience",
      blockedAt: Date
    }],
    lowRatedPatterns: {
      commonTags: ["시끄러움", "불친절"],
      commonReasons: ["위생문제", "가성비"]
    }
  },
  
  // 소셜 영향도
  socialInfluence: {
    friendsLikedRestaurants: [{
      restaurantId: ObjectId,
      friendCount: 5,
      closeFriendCount: 2
    }],
    groupVisitHistory: [{
      restaurantId: ObjectId,
      groupMembers: [ObjectId],
      visitDate: Date,
      groupSatisfaction: 4.2
    }]
  },
  
  // 실시간 컨텍스트
  currentContext: {
    lastLocation: {
      type: "Point",
      coordinates: [127.0276, 37.4979]  // [lng, lat]
    },
    recentSearches: [{
      query: "강남 파스타",
      timestamp: Date,
      resultClicked: true
    }],
    currentMood: "adventurous",
    currentWeather: "sunny",
    currentBudget: "moderate"
  },
  
  // 계산된 점수
  calculatedScores: {
    foodieLevel: 7,      // 1-10
    explorerLevel: 6,    // 1-10
    socialLevel: 8,      // 1-10
    trendSetter: false
  },
  
  lastUpdated: Date,
  createdAt: Date
}
```

## 실시간 컨텍스트

### 동적 가중치 조정
```javascript
function adjustWeightsByContext(baseWeights, context) {
  const adjustedWeights = {...baseWeights};
  
  // 시간대별 조정
  const hour = new Date().getHours();
  if (hour >= 11 && hour <= 13) {  // 점심시간
    adjustedWeights.distance *= 1.5;  // 거리 중요도 증가
    adjustedWeights.timeContext *= 1.3;  // 시간 중요도 증가
  }
  
  // 날씨별 조정
  if (context.weather === 'rainy') {
    adjustedWeights.distance *= 2;  // 비올 때 거리 매우 중요
    adjustedWeights.seasonalContext *= 1.5;  // 계절 음식 선호
  }
  
  // 동행별 조정
  if (context.companion === 'date') {
    adjustedWeights.socialInfluence *= 0.5;  // 소셜 영향 감소
    adjustedWeights.gamePreference *= 1.3;  // 개인 취향 중요
  }
  
  return normalizeWeights(adjustedWeights);
}
```

## A/B 테스트 및 최적화

### 성능 지표 (KPIs)
1. **Click-Through Rate (CTR)**: 추천 클릭률
2. **Conversion Rate**: 실제 방문 전환율
3. **User Satisfaction**: 방문 후 평점
4. **Diversity Score**: 추천 다양성
5. **Coverage**: 전체 레스토랑 커버리지

### 실험 설계
```javascript
{
  experimentId: "weight_optimization_v2",
  variants: [
    {
      name: "control",
      weights: { /* 기존 가중치 */ }
    },
    {
      name: "social_boost",
      weights: { /* 소셜 영향 강화 */ }
    },
    {
      name: "context_heavy",
      weights: { /* 컨텍스트 중심 */ }
    }
  ],
  metrics: ["ctr", "conversion", "satisfaction"],
  duration: 30, // days
  sampleSize: 10000
}
```

## 성능 최적화

### 1. 캐싱 전략
```javascript
// Redis 캐싱
const cacheKey = `recommendation:${userId}:${contextHash}`;
const cachedResult = await redis.get(cacheKey);

if (cachedResult) {
  return JSON.parse(cachedResult);
}

const recommendations = await calculateRecommendations();
await redis.setex(cacheKey, 300, JSON.stringify(recommendations)); // 5분 캐시
```

### 2. 배치 처리
```javascript
// 오프라인 계산
async function precomputeUserScores() {
  // 매일 새벽 2시 실행
  const users = await User.find({ active: true });
  
  for (const user of users) {
    const preference = await UserPreference.findOne({ userId: user._id });
    const baseScores = await calculateBaseScores(preference);
    
    // 사전 계산된 점수 저장
    await redis.hset(
      `user:${user._id}:scores`,
      baseScores
    );
  }
}
```

### 3. 인덱싱 전략
```javascript
// MongoDB 인덱스
db.userPreferences.createIndex({ userId: 1 });
db.userPreferences.createIndex({ "currentContext.lastLocation": "2dsphere" });
db.userPreferences.createIndex({ lastUpdated: -1 });

// 복합 인덱스
db.restaurants.createIndex({ 
  category: 1, 
  priceRange: 1, 
  averageRating: -1 
});
```

### 4. 점진적 로딩
```javascript
async function getProgressiveRecommendations(userId, context) {
  // 1단계: 빠른 추천 (캐시/인기 기반)
  const quickRecs = await getQuickRecommendations(userId, 5);
  yield quickRecs;
  
  // 2단계: 개인화 추천 (중간 정확도)
  const personalizedRecs = await getPersonalizedRecommendations(userId, 10);
  yield personalizedRecs;
  
  // 3단계: 정밀 추천 (높은 정확도)
  const preciseRecs = await getPreciseRecommendations(userId, context, 20);
  yield preciseRecs;
}
```

## 향후 개선 계획

### 1. 딥러닝 모델 도입
- **Collaborative Filtering**: 유사 사용자 기반 추천
- **Content-Based Filtering**: 맛집 특성 기반 추천
- **Hybrid Model**: CF + CBF 결합
- **Sequential Model**: 시간 순서 고려

### 2. 실시간 학습
- **Online Learning**: 실시간 피드백 반영
- **Contextual Bandit**: 탐색/활용 균형
- **Reinforcement Learning**: 장기 만족도 최적화

### 3. 설명 가능한 AI
- **Feature Importance**: 추천 요인 시각화
- **Counterfactual Explanation**: "만약 ~라면" 시나리오
- **Local Interpretability**: 개별 추천 설명

### 4. 다국어 지원
- **Cross-lingual Embeddings**: 언어 독립적 추천
- **Cultural Adaptation**: 문화별 선호도 반영

---

## 연락처
- 개발팀: dev@bobsmap.com
- 데이터 사이언스팀: ds@bobsmap.com
- 문서 업데이트: 2024-03-21