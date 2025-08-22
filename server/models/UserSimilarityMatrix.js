const mongoose = require('mongoose');

const userSimilarityMatrixSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 유사도 점수들
  similarities: {
    // 전체 유사도 (0-1)
    overall: {
      score: { type: Number, min: 0, max: 1, required: true },
      confidence: { type: Number, min: 0, max: 1, default: 0.5 },
      lastCalculated: { type: Date, default: Date.now }
    },
    
    // 취향 기반 유사도
    taste: {
      score: { type: Number, min: 0, max: 1 },
      weight: { type: Number, default: 0.3 },
      components: {
        flavor: { type: Number, min: 0, max: 1 },
        cuisine: { type: Number, min: 0, max: 1 },
        atmosphere: { type: Number, min: 0, max: 1 },
        price: { type: Number, min: 0, max: 1 }
      }
    },
    
    // 행동 기반 유사도
    behavior: {
      score: { type: Number, min: 0, max: 1 },
      weight: { type: Number, default: 0.25 },
      components: {
        visitPattern: { type: Number, min: 0, max: 1 },
        reviewPattern: { type: Number, min: 0, max: 1 },
        timePattern: { type: Number, min: 0, max: 1 },
        locationPattern: { type: Number, min: 0, max: 1 }
      }
    },
    
    // 평점 기반 유사도 (Pearson/Cosine)
    rating: {
      score: { type: Number, min: -1, max: 1 }, // Pearson은 -1~1
      weight: { type: Number, default: 0.25 },
      method: { type: String, enum: ['pearson', 'cosine', 'jaccard'], default: 'pearson' },
      commonItems: { type: Number, default: 0 },
      significanceThreshold: { type: Number, default: 3 } // 최소 공통 아이템 수
    },
    
    // 소셜 유사도
    social: {
      score: { type: Number, min: 0, max: 1 },
      weight: { type: Number, default: 0.1 },
      components: {
        mutualFriends: { type: Number, default: 0 },
        mutualFollows: { type: Number, default: 0 },
        interaction: { type: Number, min: 0, max: 1 },
        groupActivities: { type: Number, default: 0 }
      }
    },
    
    // 인구통계 유사도
    demographic: {
      score: { type: Number, min: 0, max: 1 },
      weight: { type: Number, default: 0.1 },
      components: {
        age: { type: Number, min: 0, max: 1 },
        location: { type: Number, min: 0, max: 1 },
        lifestyle: { type: Number, min: 0, max: 1 }
      }
    }
  },
  
  // 공통 관심사
  commonInterests: {
    restaurants: [{
      restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      userARating: Number,
      userBRating: Number,
      difference: Number
    }],
    categories: [{
      category: String,
      userAFrequency: Number,
      userBFrequency: Number,
      similarity: Number
    }],
    playlists: [{
      playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
      bothLiked: Boolean,
      bothSaved: Boolean
    }]
  },
  
  // 추천 교환 기록
  recommendations: {
    fromAtoB: [{
      restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      score: Number,
      recommendedAt: Date,
      accepted: Boolean,
      feedback: String
    }],
    fromBtoA: [{
      restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      score: Number,
      recommendedAt: Date,
      accepted: Boolean,
      feedback: String
    }],
    successRate: { type: Number, min: 0, max: 1, default: 0 }
  },
  
  // 매칭 정보
  matching: {
    isMatched: { type: Boolean, default: false },
    matchedAt: Date,
    matchScore: { type: Number, min: 0, max: 100 },
    compatibility: {
      dining: { type: Number, min: 0, max: 100 },
      exploration: { type: Number, min: 0, max: 100 },
      budget: { type: Number, min: 0, max: 100 },
      schedule: { type: Number, min: 0, max: 100 }
    }
  },
  
  // 통계
  statistics: {
    calculationCount: { type: Number, default: 0 },
    lastFullCalculation: Date,
    averageDifference: Number,
    correlationCoefficient: Number,
    mutualInformationScore: Number
  },
  
  // 캐시 관리
  cache: {
    isValid: { type: Boolean, default: true },
    expiresAt: Date,
    version: String
  }
}, {
  timestamps: true
});

// 복합 유니크 인덱스 (userA < userB 보장)
userSimilarityMatrixSchema.index({ userA: 1, userB: 1 }, { unique: true });
userSimilarityMatrixSchema.index({ 'similarities.overall.score': -1 });
userSimilarityMatrixSchema.index({ 'cache.expiresAt': 1 });
userSimilarityMatrixSchema.index({ 'matching.isMatched': 1 });

// 사용자 쌍 정규화 (항상 userA < userB)
userSimilarityMatrixSchema.pre('save', function(next) {
  if (this.userA.toString() > this.userB.toString()) {
    const temp = this.userA;
    this.userA = this.userB;
    this.userB = temp;
    
    // 추천 기록도 스왑
    const tempRecs = this.recommendations.fromAtoB;
    this.recommendations.fromAtoB = this.recommendations.fromBtoA;
    this.recommendations.fromBtoA = tempRecs;
  }
  next();
});

// Pearson 상관계수 계산
userSimilarityMatrixSchema.methods.calculatePearsonCorrelation = async function() {
  const Review = mongoose.model('Review');
  
  // 두 사용자의 공통 리뷰 찾기
  const [userAReviews, userBReviews] = await Promise.all([
    Review.find({ user: this.userA }).select('restaurant overallRating'),
    Review.find({ user: this.userB }).select('restaurant overallRating')
  ]);
  
  // 공통 레스토랑 찾기
  const userAMap = new Map(userAReviews.map(r => [r.restaurant.toString(), r.overallRating]));
  const userBMap = new Map(userBReviews.map(r => [r.restaurant.toString(), r.overallRating]));
  
  const commonRestaurants = [];
  let sumA = 0, sumB = 0, sumA2 = 0, sumB2 = 0, sumAB = 0;
  
  for (const [restaurantId, ratingA] of userAMap) {
    if (userBMap.has(restaurantId)) {
      const ratingB = userBMap.get(restaurantId);
      commonRestaurants.push({
        restaurant: restaurantId,
        userARating: ratingA,
        userBRating: ratingB,
        difference: Math.abs(ratingA - ratingB)
      });
      
      sumA += ratingA;
      sumB += ratingB;
      sumA2 += ratingA * ratingA;
      sumB2 += ratingB * ratingB;
      sumAB += ratingA * ratingB;
    }
  }
  
  const n = commonRestaurants.length;
  this.similarities.rating.commonItems = n;
  
  if (n < this.similarities.rating.significanceThreshold) {
    this.similarities.rating.score = 0;
    return 0;
  }
  
  // Pearson 상관계수 계산
  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));
  
  if (denominator === 0) {
    this.similarities.rating.score = 0;
  } else {
    this.similarities.rating.score = numerator / denominator;
  }
  
  this.commonInterests.restaurants = commonRestaurants;
  
  return this.similarities.rating.score;
};

// Cosine 유사도 계산
userSimilarityMatrixSchema.methods.calculateCosineSimilarity = async function() {
  const TasteVector = mongoose.model('TasteVector');
  
  const [vectorA, vectorB] = await Promise.all([
    TasteVector.findOne({ user: this.userA }),
    TasteVector.findOne({ user: this.userB })
  ]);
  
  if (!vectorA || !vectorB) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  // 모든 벡터 차원에 대해 계산
  const dimensions = ['flavorProfile', 'cuisineVector', 'atmosphereVector'];
  
  dimensions.forEach(dim => {
    for (const key in vectorA[dim]) {
      if (vectorB[dim][key]) {
        const valA = vectorA[dim][key].value;
        const valB = vectorB[dim][key].value;
        
        dotProduct += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
      }
    }
  });
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  
  return denominator === 0 ? 0 : dotProduct / denominator;
};

// 전체 유사도 계산
userSimilarityMatrixSchema.methods.calculateOverallSimilarity = async function() {
  // 각 유사도 계산
  await Promise.all([
    this.calculateTasteSimilarity(),
    this.calculateBehaviorSimilarity(),
    this.calculatePearsonCorrelation(),
    this.calculateSocialSimilarity(),
    this.calculateDemographicSimilarity()
  ]);
  
  // 가중 평균 계산
  let weightedSum = 0;
  let totalWeight = 0;
  
  const similarityTypes = ['taste', 'behavior', 'rating', 'social', 'demographic'];
  
  similarityTypes.forEach(type => {
    if (this.similarities[type].score !== undefined && this.similarities[type].score !== null) {
      // rating score는 -1~1이므로 0~1로 정규화
      let score = this.similarities[type].score;
      if (type === 'rating') {
        score = (score + 1) / 2;
      }
      
      weightedSum += score * this.similarities[type].weight;
      totalWeight += this.similarities[type].weight;
    }
  });
  
  this.similarities.overall.score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  this.similarities.overall.lastCalculated = new Date();
  this.similarities.overall.confidence = Math.min(
    0.3 + (this.similarities.rating.commonItems / 10) * 0.7,
    1
  );
  
  // 통계 업데이트
  this.statistics.calculationCount++;
  this.statistics.lastFullCalculation = new Date();
  
  // 캐시 업데이트
  this.cache.isValid = true;
  this.cache.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일
  
  return this.similarities.overall.score;
};

// 취향 유사도 계산
userSimilarityMatrixSchema.methods.calculateTasteSimilarity = async function() {
  const TasteVector = mongoose.model('TasteVector');
  
  const [vectorA, vectorB] = await Promise.all([
    TasteVector.findOne({ user: this.userA }),
    TasteVector.findOne({ user: this.userB })
  ]);
  
  if (!vectorA || !vectorB) {
    this.similarities.taste.score = 0;
    return 0;
  }
  
  const similarity = vectorA.calculateSimilarity(vectorB);
  this.similarities.taste.score = similarity;
  
  return similarity;
};

// 행동 유사도 계산
userSimilarityMatrixSchema.methods.calculateBehaviorSimilarity = async function() {
  const UserInteraction = mongoose.model('UserInteraction');
  
  // 최근 30일 행동 패턴 분석
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const [interactionsA, interactionsB] = await Promise.all([
    UserInteraction.aggregate([
      { $match: { user: this.userA, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: '$interactionType',
        count: { $sum: 1 },
        avgScore: { $avg: '$scores.interestScore' }
      }}
    ]),
    UserInteraction.aggregate([
      { $match: { user: this.userB, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
        _id: '$interactionType',
        count: { $sum: 1 },
        avgScore: { $avg: '$scores.interestScore' }
      }}
    ])
  ]);
  
  // 행동 패턴 비교
  const behaviorMapA = new Map(interactionsA.map(i => [i._id, i]));
  const behaviorMapB = new Map(interactionsB.map(i => [i._id, i]));
  
  let similarity = 0;
  let commonBehaviors = 0;
  
  for (const [behavior, dataA] of behaviorMapA) {
    if (behaviorMapB.has(behavior)) {
      const dataB = behaviorMapB.get(behavior);
      const countDiff = Math.abs(dataA.count - dataB.count) / Math.max(dataA.count, dataB.count);
      const scoreDiff = Math.abs(dataA.avgScore - dataB.avgScore) / 100;
      
      similarity += (1 - countDiff) * 0.5 + (1 - scoreDiff) * 0.5;
      commonBehaviors++;
    }
  }
  
  this.similarities.behavior.score = commonBehaviors > 0 ? similarity / commonBehaviors : 0;
  
  return this.similarities.behavior.score;
};

// 소셜 유사도 계산
userSimilarityMatrixSchema.methods.calculateSocialSimilarity = async function() {
  const User = mongoose.model('User');
  
  const [userA, userB] = await Promise.all([
    User.findById(this.userA).select('followers following'),
    User.findById(this.userB).select('followers following')
  ]);
  
  if (!userA || !userB) {
    this.similarities.social.score = 0;
    return 0;
  }
  
  // 공통 팔로워/팔로잉 계산
  const followersA = new Set(userA.followers.map(f => f.toString()));
  const followersB = new Set(userB.followers.map(f => f.toString()));
  const followingA = new Set(userA.following.map(f => f.toString()));
  const followingB = new Set(userB.following.map(f => f.toString()));
  
  const mutualFollowers = [...followersA].filter(f => followersB.has(f)).length;
  const mutualFollowing = [...followingA].filter(f => followingB.has(f)).length;
  
  this.similarities.social.components.mutualFriends = mutualFollowers;
  this.similarities.social.components.mutualFollows = mutualFollowing;
  
  // Jaccard 계수 계산
  const unionSize = new Set([...followersA, ...followersB, ...followingA, ...followingB]).size;
  const intersectionSize = mutualFollowers + mutualFollowing;
  
  this.similarities.social.score = unionSize > 0 ? intersectionSize / unionSize : 0;
  
  return this.similarities.social.score;
};

// 인구통계 유사도 계산
userSimilarityMatrixSchema.methods.calculateDemographicSimilarity = async function() {
  const User = mongoose.model('User');
  
  const [userA, userB] = await Promise.all([
    User.findById(this.userA).select('age location'),
    User.findById(this.userB).select('age location')
  ]);
  
  if (!userA || !userB) {
    this.similarities.demographic.score = 0;
    return 0;
  }
  
  let totalScore = 0;
  let components = 0;
  
  // 나이 유사도
  if (userA.age && userB.age) {
    const ageDiff = Math.abs(userA.age - userB.age);
    this.similarities.demographic.components.age = Math.max(0, 1 - ageDiff / 20);
    totalScore += this.similarities.demographic.components.age;
    components++;
  }
  
  // 위치 유사도
  if (userA.location && userB.location) {
    if (userA.location.city === userB.location.city) {
      this.similarities.demographic.components.location = 1;
    } else if (userA.location.district === userB.location.district) {
      this.similarities.demographic.components.location = 0.5;
    } else {
      this.similarities.demographic.components.location = 0;
    }
    totalScore += this.similarities.demographic.components.location;
    components++;
  }
  
  this.similarities.demographic.score = components > 0 ? totalScore / components : 0;
  
  return this.similarities.demographic.score;
};

// 유사 사용자 찾기
userSimilarityMatrixSchema.statics.findSimilarUsers = async function(userId, limit = 10) {
  return this.find({
    $or: [
      { userA: userId },
      { userB: userId }
    ],
    'cache.isValid': true
  })
  .sort({ 'similarities.overall.score': -1 })
  .limit(limit)
  .populate('userA userB', 'username profileImage');
};

const UserSimilarityMatrix = mongoose.model('UserSimilarityMatrix', userSimilarityMatrixSchema);

module.exports = UserSimilarityMatrix;