const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 추천 대상
  targetType: {
    type: String,
    enum: ['restaurant', 'playlist', 'user'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  
  // 추천 메타데이터
  recommendation: {
    // 추천 알고리즘 타입
    algorithmType: {
      type: String,
      enum: [
        'collaborative_filtering',  // 협업 필터링
        'content_based',           // 콘텐츠 기반
        'hybrid',                  // 하이브리드
        'matrix_factorization',    // 행렬 분해
        'deep_learning',           // 딥러닝
        'popularity',              // 인기도 기반
        'trending',                // 트렌딩
        'location_based',          // 위치 기반
        'time_based',              // 시간 기반
        'social',                  // 소셜 (친구 기반)
        'similar_users',           // 유사 사용자
        'taste_matching'           // 취향 매칭
      ],
      required: true
    },
    
    // 추천 점수
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    
    // 추천 순위
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    
    // 추천 이유 (사용자에게 표시)
    reason: {
      primary: String,      // 주 이유
      secondary: [String],  // 부가 이유들
      tags: [String]        // 관련 태그
    },
    
    // 추천 컨텍스트
    context: {
      location: {
        lat: Number,
        lng: Number
      },
      timeOfDay: String,
      dayOfWeek: Number,
      weather: String,
      occasion: String,
      userMood: String,
      groupSize: Number
    },
    
    // 모델 버전
    modelVersion: {
      type: String,
      required: true
    },
    
    // 추천 생성 시간
    generatedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    
    // 추천 만료 시간
    expiresAt: {
      type: Date,
      required: true
    }
  },
  
  // 추천 성능 추적
  performance: {
    // 노출 정보
    impression: {
      shown: { type: Boolean, default: false },
      shownAt: Date,
      position: Number,
      screenName: String
    },
    
    // 클릭 정보
    click: {
      clicked: { type: Boolean, default: false },
      clickedAt: Date,
      clickPosition: Number
    },
    
    // 전환 정보
    conversion: {
      converted: { type: Boolean, default: false },
      convertedAt: Date,
      conversionType: {
        type: String,
        enum: ['visit', 'save', 'like', 'review', 'share']
      },
      conversionValue: Number
    },
    
    // 피드백
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      helpful: Boolean,
      dismissed: Boolean,
      dismissReason: String,
      feedbackText: String,
      feedbackAt: Date
    },
    
    // 체류 시간
    engagement: {
      viewDuration: Number, // 초
      scrollDepth: Number,  // 백분율
      interactions: Number   // 상호작용 횟수
    }
  },
  
  // 추천 근거 데이터 (디버깅/분석용)
  evidence: {
    // 유사도 점수들
    similarities: {
      userSimilarity: Number,      // 사용자 간 유사도
      itemSimilarity: Number,      // 아이템 간 유사도
      tasteSimilarity: Number,     // 취향 유사도
      behaviorSimilarity: Number   // 행동 유사도
    },
    
    // 사용된 특징들
    features: {
      userFeatures: Map,      // 사용자 특징 벡터
      itemFeatures: Map,      // 아이템 특징 벡터
      contextFeatures: Map    // 컨텍스트 특징
    },
    
    // 관련 데이터 ID들
    relatedData: {
      similarUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      similarItems: [{ type: mongoose.Schema.Types.ObjectId }],
      userHistory: [{ type: mongoose.Schema.Types.ObjectId }],
      trendingItems: [{ type: mongoose.Schema.Types.ObjectId }]
    },
    
    // 계산 과정
    calculations: {
      collaborativeScore: Number,
      contentScore: Number,
      trendingScore: Number,
      locationScore: Number,
      socialScore: Number,
      personalizedScore: Number
    }
  },
  
  // A/B 테스트
  experiment: {
    id: String,
    variant: String,
    controlGroup: Boolean
  },
  
  // 상태
  status: {
    type: String,
    enum: ['active', 'expired', 'dismissed', 'converted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// 인덱스
recommendationSchema.index({ user: 1, status: 1, 'recommendation.generatedAt': -1 });
recommendationSchema.index({ user: 1, targetType: 1, targetId: 1 });
recommendationSchema.index({ 'recommendation.expiresAt': 1 });
recommendationSchema.index({ 'recommendation.algorithmType': 1 });
recommendationSchema.index({ 'performance.impression.shown': 1 });
recommendationSchema.index({ 'performance.click.clicked': 1 });
recommendationSchema.index({ 'performance.conversion.converted': 1 });

// TTL 인덱스 (만료된 추천 자동 삭제)
recommendationSchema.index(
  { 'recommendation.expiresAt': 1 },
  { expireAfterSeconds: 0 }
);

// 추천 성능 메트릭 계산
recommendationSchema.methods.calculateMetrics = function() {
  const metrics = {
    ctr: 0,      // Click-Through Rate
    cvr: 0,      // Conversion Rate
    engagement: 0 // Engagement Score
  };
  
  // CTR 계산
  if (this.performance.impression.shown) {
    metrics.ctr = this.performance.click.clicked ? 1 : 0;
  }
  
  // CVR 계산
  if (this.performance.click.clicked) {
    metrics.cvr = this.performance.conversion.converted ? 1 : 0;
  }
  
  // Engagement Score 계산
  if (this.performance.engagement.viewDuration) {
    const durationScore = Math.min(this.performance.engagement.viewDuration / 60, 1); // 1분 = 100%
    const scrollScore = (this.performance.engagement.scrollDepth || 0) / 100;
    const interactionScore = Math.min((this.performance.engagement.interactions || 0) / 5, 1);
    
    metrics.engagement = (durationScore * 0.4 + scrollScore * 0.3 + interactionScore * 0.3);
  }
  
  return metrics;
};

// 추천 이유 생성
recommendationSchema.methods.generateReasonText = function(language = 'ko') {
  const reasons = {
    ko: {
      collaborative_filtering: '비슷한 취향을 가진 사용자들이 좋아합니다',
      content_based: '평소 즐기시는 스타일과 비슷합니다',
      hybrid: '종합적인 분석 결과 추천드립니다',
      popularity: '현재 인기 급상승 중입니다',
      trending: '최근 많은 관심을 받고 있습니다',
      location_based: '현재 위치에서 가까운 추천 맛집입니다',
      time_based: '이 시간대에 인기있는 곳입니다',
      social: '친구들이 좋아하는 곳입니다',
      similar_users: '취향이 비슷한 사용자들의 선택입니다',
      taste_matching: '취향 프로필과 완벽하게 매칭됩니다'
    },
    en: {
      collaborative_filtering: 'Users with similar tastes love this',
      content_based: 'Similar to your usual preferences',
      hybrid: 'Recommended based on comprehensive analysis',
      popularity: 'Currently trending',
      trending: 'Getting lots of attention recently',
      location_based: 'Recommended nearby',
      time_based: 'Popular at this time',
      social: 'Your friends love this place',
      similar_users: 'Chosen by users with similar tastes',
      taste_matching: 'Perfect match for your taste profile'
    }
  };
  
  return reasons[language][this.recommendation.algorithmType] || this.recommendation.reason.primary;
};

// 추천 업데이트
recommendationSchema.methods.recordImpression = function(position, screenName) {
  this.performance.impression.shown = true;
  this.performance.impression.shownAt = new Date();
  this.performance.impression.position = position;
  this.performance.impression.screenName = screenName;
  return this.save();
};

recommendationSchema.methods.recordClick = function(position) {
  this.performance.click.clicked = true;
  this.performance.click.clickedAt = new Date();
  this.performance.click.clickPosition = position;
  return this.save();
};

recommendationSchema.methods.recordConversion = function(type, value) {
  this.performance.conversion.converted = true;
  this.performance.conversion.convertedAt = new Date();
  this.performance.conversion.conversionType = type;
  this.performance.conversion.conversionValue = value;
  this.status = 'converted';
  return this.save();
};

// 추천 배치 생성
recommendationSchema.statics.generateBatch = async function(userId, algorithms, limit = 20) {
  const recommendations = [];
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // 각 알고리즘별로 추천 생성
  for (const algorithm of algorithms) {
    const items = await this.generateByAlgorithm(user, algorithm, limit);
    recommendations.push(...items);
  }
  
  // 중복 제거 및 정렬
  const uniqueRecommendations = this.deduplicateAndSort(recommendations);
  
  // 상위 N개만 저장
  const topRecommendations = uniqueRecommendations.slice(0, limit);
  
  // DB에 저장
  return this.insertMany(topRecommendations);
};

// 알고리즘별 추천 생성 (실제 구현 필요)
recommendationSchema.statics.generateByAlgorithm = async function(user, algorithm, limit) {
  // 이 부분은 실제 추천 알고리즘 구현이 필요합니다
  // 여기서는 기본 구조만 제공합니다
  
  const recommendations = [];
  
  switch(algorithm) {
    case 'collaborative_filtering':
      // 협업 필터링 로직
      break;
    case 'content_based':
      // 콘텐츠 기반 로직
      break;
    case 'hybrid':
      // 하이브리드 로직
      break;
    default:
      break;
  }
  
  return recommendations;
};

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;