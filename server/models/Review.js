const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 종합 평점
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // 세부 평가 항목 (알고리즘에 사용)
  detailedRatings: {
    taste: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.3 } // 가중치
    },
    service: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.15 }
    },
    atmosphere: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.15 }
    },
    valueForMoney: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.2 }
    },
    cleanliness: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.1 }
    },
    portion: {
      score: { type: Number, min: 1, max: 5, required: true },
      weight: { type: Number, default: 0.1 }
    }
  },
  
  // 텍스트 리뷰
  title: {
    type: String,
    maxlength: 100,
    trim: true
  },
  content: {
    type: String,
    required: [true, '리뷰 내용을 입력해주세요'],
    minlength: [10, '리뷰는 최소 10자 이상 작성해주세요'],
    maxlength: [2000, '리뷰는 최대 2000자까지 작성 가능합니다']
  },
  
  // 추천 메뉴
  recommendedDishes: [{
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }],
  
  // 방문 정보
  visitInfo: {
    date: {
      type: Date,
      required: true
    },
    occasion: {
      type: String,
      enum: ['혼밥', '데이트', '가족모임', '친구모임', '비즈니스', '관광', '기념일', '일상', '기타'],
      required: true
    },
    groupSize: {
      type: Number,
      min: 1,
      max: 50,
      required: true
    },
    timeOfDay: {
      type: String,
      enum: ['아침', '브런치', '점심', '저녁', '야식'],
      required: true
    },
    waitTime: {
      type: Number, // 분 단위
      min: 0,
      max: 300
    },
    totalSpent: {
      type: Number,
      min: 0
    },
    revisitIntention: {
      type: Boolean,
      required: true
    }
  },
  
  // 맛 프로필 (알고리즘 학습용)
  tasteProfile: {
    spicyLevel: { type: Number, min: 0, max: 5 }, // 0: 전혀 안매움, 5: 매우 매움
    sweetLevel: { type: Number, min: 0, max: 5 },
    saltyLevel: { type: Number, min: 0, max: 5 },
    sourLevel: { type: Number, min: 0, max: 5 },
    bitterLevel: { type: Number, min: 0, max: 5 },
    umamiLevel: { type: Number, min: 0, max: 5 },
    oilyLevel: { type: Number, min: 0, max: 5 }
  },
  
  // 분위기 태그 (다중 선택)
  atmosphereTags: [{
    type: String,
    enum: ['조용한', '시끄러운', '로맨틱', '캐주얼', '포멀', '힙한', '전통적인', 
           '아늑한', '모던한', '빈티지', '야외석', '뷰맛집', '인스타그래머블']
  }],
  
  // 서비스 특징
  serviceFeatures: {
    staffFriendliness: { type: Boolean },
    quickService: { type: Boolean },
    knowledgeableStaff: { type: Boolean },
    specialRequests: { type: Boolean }, // 특별 요청 대응
    kidsAccommodation: { type: Boolean },
    petFriendly: { type: Boolean }
  },
  
  // 사진
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['음식', '인테리어', '외관', '메뉴판', '기타']
    }
  }],
  
  // 유용함 투표
  helpfulVotes: {
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    notHelpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // 리뷰 신뢰도 점수 (알고리즘 계산)
  credibilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // 감정 분석 결과 (NLP 처리 후 저장)
  sentiment: {
    score: { type: Number, min: -1, max: 1 }, // -1: 부정, 0: 중립, 1: 긍정
    confidence: { type: Number, min: 0, max: 1 }
  },
  
  // 키워드 추출 (NLP 처리 후 저장)
  extractedKeywords: [{
    keyword: String,
    frequency: Number,
    sentiment: { type: Number, min: -1, max: 1 }
  }],
  
  // 리뷰 상태
  status: {
    type: String,
    enum: ['active', 'hidden', 'reported', 'deleted'],
    default: 'active'
  },
  
  // 수정 이력
  editHistory: [{
    editedAt: Date,
    previousContent: String,
    reason: String
  }],
  
  // 플랫폼 정보
  source: {
    type: String,
    enum: ['app', 'web', 'mobile_web', 'api'],
    default: 'web'
  }
}, {
  timestamps: true
});

// 인덱스
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1, overallRating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ 'visitInfo.date': -1 });
reviewSchema.index({ credibilityScore: -1 });
reviewSchema.index({ status: 1 });

// 리뷰 신뢰도 점수 계산
reviewSchema.methods.calculateCredibilityScore = async function() {
  const User = mongoose.model('User');
  const user = await User.findById(this.user);
  
  let score = 0;
  
  // 사용자 신뢰도 (30%)
  score += user.trustScore * 0.3;
  
  // 리뷰 길이 (20%)
  const contentLength = this.content.length;
  if (contentLength >= 200) score += 20;
  else if (contentLength >= 100) score += 15;
  else if (contentLength >= 50) score += 10;
  else score += 5;
  
  // 사진 첨부 (15%)
  if (this.images.length >= 3) score += 15;
  else if (this.images.length >= 1) score += 10;
  
  // 세부 평가 완성도 (15%)
  const detailedRatingsComplete = Object.values(this.detailedRatings).every(
    rating => rating.score !== null && rating.score !== undefined
  );
  if (detailedRatingsComplete) score += 15;
  
  // 추천 메뉴 작성 (10%)
  if (this.recommendedDishes.length > 0) score += 10;
  
  // 유용함 투표 비율 (10%)
  const helpfulCount = this.helpfulVotes.helpful.length;
  const notHelpfulCount = this.helpfulVotes.notHelpful.length;
  if (helpfulCount + notHelpfulCount > 0) {
    const helpfulRatio = helpfulCount / (helpfulCount + notHelpfulCount);
    score += helpfulRatio * 10;
  }
  
  this.credibilityScore = Math.min(Math.round(score), 100);
  return this.credibilityScore;
};

// 가중 평균 계산
reviewSchema.methods.calculateWeightedRating = function() {
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [key, rating] of Object.entries(this.detailedRatings)) {
    if (rating.score) {
      weightedSum += rating.score * rating.weight;
      totalWeight += rating.weight;
    }
  }
  
  return totalWeight > 0 ? weightedSum / totalWeight : this.overallRating;
};

// 리뷰 요약 생성
reviewSchema.methods.generateSummary = function() {
  const summary = {
    rating: this.overallRating,
    weightedRating: this.calculateWeightedRating(),
    pros: [],
    cons: [],
    bestFor: []
  };
  
  // 장점 추출
  for (const [key, rating] of Object.entries(this.detailedRatings)) {
    if (rating.score >= 4) {
      summary.pros.push(key);
    } else if (rating.score <= 2) {
      summary.cons.push(key);
    }
  }
  
  // 추천 상황
  if (this.visitInfo.occasion) {
    summary.bestFor.push(this.visitInfo.occasion);
  }
  
  return summary;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;