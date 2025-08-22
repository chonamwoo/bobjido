const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['restaurant', 'playlist', 'user', 'review'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  
  // 상호작용 타입
  interactionType: {
    type: String,
    enum: [
      'view',           // 조회
      'click',          // 클릭
      'hover',          // 호버 (관심도)
      'save',           // 저장
      'unsave',         // 저장 취소
      'like',           // 좋아요
      'unlike',         // 좋아요 취소
      'share',          // 공유
      'comment',        // 댓글
      'search',         // 검색
      'filter',         // 필터 적용
      'scroll',         // 스크롤
      'time_spent',     // 체류 시간
      'map_view',       // 지도에서 확인
      'call',           // 전화
      'direction',      // 길찾기
      'menu_view',      // 메뉴 조회
      'photo_view',     // 사진 확대 보기
      'photo_zoom',     // 사진 줌
      'review_read',    // 리뷰 읽기
      'playlist_add',   // 플레이리스트 추가
      'playlist_remove' // 플레이리스트 제거
    ],
    required: true
  },
  
  // 상호작용 컨텍스트
  context: {
    // 어디서 발생했는지
    source: {
      type: String,
      enum: ['home', 'search', 'explore', 'profile', 'playlist', 'map', 'recommendation', 'trending', 'nearby'],
      required: true
    },
    
    // 검색 관련
    searchQuery: String,
    searchFilters: {
      category: String,
      priceRange: String,
      rating: Number,
      distance: Number,
      features: [String]
    },
    
    // 추천 관련
    recommendationReason: String,
    recommendationScore: Number,
    recommendationRank: Number,
    
    // 세션 정보
    sessionId: String,
    previousPage: String,
    nextPage: String,
    
    // 디바이스 정보
    device: {
      type: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
      os: String,
      browser: String
    },
    
    // 위치 정보
    location: {
      lat: Number,
      lng: Number,
      accuracy: Number
    },
    
    // 시간 정보
    dayOfWeek: Number, // 0-6
    hourOfDay: Number, // 0-23
    isWeekend: Boolean,
    isHoliday: Boolean
  },
  
  // 상호작용 값
  value: {
    // 체류 시간 (초)
    duration: Number,
    
    // 스크롤 깊이 (%)
    scrollDepth: Number,
    
    // 클릭 위치
    clickPosition: {
      x: Number,
      y: Number
    },
    
    // 평점 (해당하는 경우)
    rating: Number,
    
    // 텍스트 (검색어, 댓글 등)
    text: String,
    
    // 불리언 값
    boolean: Boolean,
    
    // 숫자 값
    number: Number
  },
  
  // 상호작용 결과
  result: {
    // 전환 여부
    converted: Boolean,
    
    // 전환 타입
    conversionType: {
      type: String,
      enum: ['visit', 'review', 'save', 'share', 'call', 'direction']
    },
    
    // 전환까지 걸린 시간 (초)
    conversionTime: Number,
    
    // 바운스 여부
    bounced: Boolean,
    
    // 다음 액션
    nextAction: String
  },
  
  // 점수 계산용 (알고리즘)
  scores: {
    // 관심도 점수 (0-100)
    interestScore: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // 긍정/부정 점수 (-100 ~ 100)
    sentimentScore: {
      type: Number,
      min: -100,
      max: 100
    },
    
    // 영향력 점수 (이 상호작용이 추천에 미치는 영향)
    influenceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // A/B 테스트
  experiment: {
    id: String,
    variant: String,
    success: Boolean
  }
}, {
  timestamps: true
});

// 인덱스
userInteractionSchema.index({ user: 1, createdAt: -1 });
userInteractionSchema.index({ user: 1, targetType: 1, targetId: 1 });
userInteractionSchema.index({ user: 1, interactionType: 1 });
userInteractionSchema.index({ 'context.source': 1 });
userInteractionSchema.index({ 'context.sessionId': 1 });
userInteractionSchema.index({ createdAt: -1 });

// TTL 인덱스 (오래된 view 이벤트는 자동 삭제)
userInteractionSchema.index(
  { createdAt: 1 },
  { 
    expireAfterSeconds: 90 * 24 * 60 * 60, // 90일 후 삭제
    partialFilterExpression: { interactionType: 'view' }
  }
);

// 관심도 점수 계산
userInteractionSchema.methods.calculateInterestScore = function() {
  let score = 0;
  
  // 상호작용 타입별 기본 점수
  const typeScores = {
    'view': 10,
    'click': 20,
    'hover': 5,
    'save': 50,
    'like': 40,
    'share': 60,
    'comment': 70,
    'time_spent': 30,
    'map_view': 35,
    'call': 80,
    'direction': 75,
    'menu_view': 25,
    'photo_view': 15,
    'review_read': 20,
    'playlist_add': 55
  };
  
  score = typeScores[this.interactionType] || 0;
  
  // 체류 시간 보너스
  if (this.value.duration) {
    if (this.value.duration > 300) score += 20; // 5분 이상
    else if (this.value.duration > 120) score += 15; // 2분 이상
    else if (this.value.duration > 60) score += 10; // 1분 이상
  }
  
  // 스크롤 깊이 보너스
  if (this.value.scrollDepth) {
    score += Math.floor(this.value.scrollDepth / 20) * 5; // 20%마다 5점
  }
  
  // 전환 보너스
  if (this.result.converted) {
    score += 30;
  }
  
  this.scores.interestScore = Math.min(score, 100);
  return this.scores.interestScore;
};

// 감정 점수 계산
userInteractionSchema.methods.calculateSentimentScore = function() {
  let score = 0;
  
  // 긍정적 상호작용
  const positiveActions = ['like', 'save', 'share', 'playlist_add', 'call', 'direction'];
  const negativeActions = ['unlike', 'unsave', 'playlist_remove'];
  
  if (positiveActions.includes(this.interactionType)) {
    score = 50;
    if (this.value.rating) {
      score += (this.value.rating - 3) * 20; // 평점에 따라 조정
    }
  } else if (negativeActions.includes(this.interactionType)) {
    score = -50;
  }
  
  // 바운스는 부정적 신호
  if (this.result.bounced) {
    score -= 30;
  }
  
  // 짧은 체류 시간은 부정적 신호
  if (this.interactionType === 'view' && this.value.duration < 10) {
    score -= 20;
  }
  
  this.scores.sentimentScore = Math.max(-100, Math.min(score, 100));
  return this.scores.sentimentScore;
};

// 영향력 점수 계산
userInteractionSchema.methods.calculateInfluenceScore = function() {
  // 최근 상호작용일수록 높은 점수
  const daysSinceInteraction = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  let recencyScore = Math.max(0, 100 - daysSinceInteraction * 2);
  
  // 관심도와 감정 점수 결합
  const interestScore = this.scores.interestScore || 0;
  const sentimentScore = Math.abs(this.scores.sentimentScore || 0);
  
  this.scores.influenceScore = Math.round((recencyScore * 0.3 + interestScore * 0.5 + sentimentScore * 0.2));
  return this.scores.influenceScore;
};

// 상호작용 집계
userInteractionSchema.statics.aggregateUserPreferences = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          targetType: '$targetType',
          targetId: '$targetId'
        },
        totalInteractions: { $sum: 1 },
        avgInterestScore: { $avg: '$scores.interestScore' },
        avgSentimentScore: { $avg: '$scores.sentimentScore' },
        lastInteraction: { $max: '$createdAt' },
        interactionTypes: { $addToSet: '$interactionType' }
      }
    },
    {
      $sort: { avgInterestScore: -1 }
    }
  ]);
};

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;