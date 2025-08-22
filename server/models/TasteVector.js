const mongoose = require('mongoose');

const tasteVectorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // 맛 선호도 벡터 (0-10 scale)
  flavorProfile: {
    spicy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    sweet: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    salty: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    sour: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    bitter: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    umami: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    oily: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    crispy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    chewy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    creamy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 요리 스타일 선호도 벡터
  cuisineVector: {
    korean: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    chinese: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    japanese: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    western: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    italian: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    french: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    southeast_asian: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    indian: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    mexican: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    fusion: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 분위기 선호도 벡터
  atmosphereVector: {
    quiet: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    lively: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    romantic: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    casual: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    formal: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    trendy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    traditional: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    cozy: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    modern: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    outdoor: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 상황별 선호도 벡터
  contextVector: {
    solo: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    date: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    family: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    friends: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    business: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    celebration: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    quick_meal: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    leisurely: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 가격 민감도 벡터
  priceVector: {
    budget: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    moderate: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    premium: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    luxury: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 행동 패턴 벡터
  behaviorVector: {
    adventurous: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    habitual: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    social_influenced: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    review_dependent: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    spontaneous: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    planner: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 시간대별 선호도
  timePreference: {
    breakfast: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    brunch: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    lunch: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    dinner: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    late_night: { value: { type: Number, min: 0, max: 10, default: 5 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 특별 선호도
  dietaryPreferences: {
    vegetarian: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    vegan: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    halal: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    kosher: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    gluten_free: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    low_carb: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } },
    organic: { value: { type: Number, min: 0, max: 10, default: 0 }, confidence: { type: Number, min: 0, max: 1, default: 0.5 } }
  },
  
  // 학습 메타데이터
  metadata: {
    totalDataPoints: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    learningRate: { type: Number, default: 0.1 },
    decayFactor: { type: Number, default: 0.95 },
    minConfidence: { type: Number, default: 0.3 },
    maxConfidence: { type: Number, default: 0.95 }
  },
  
  // 벡터 임베딩 (딥러닝 모델용)
  embedding: {
    vector: [Number], // 128차원 벡터
    model: String,
    version: String,
    generatedAt: Date
  }
}, {
  timestamps: true
});

// 인덱스
tasteVectorSchema.index({ user: 1 }, { unique: true });
tasteVectorSchema.index({ 'metadata.lastUpdated': -1 });

// 벡터 업데이트 메서드
tasteVectorSchema.methods.updateFromReview = function(review) {
  const learningRate = this.metadata.learningRate;
  const confidenceBoost = 0.05;
  
  // 맛 프로필 업데이트
  if (review.tasteProfile) {
    for (const [flavor, level] of Object.entries(review.tasteProfile)) {
      if (this.flavorProfile[flavor] && level !== null && level !== undefined) {
        const currentValue = this.flavorProfile[flavor].value;
        const currentConfidence = this.flavorProfile[flavor].confidence;
        
        // 가중 평균으로 값 업데이트
        this.flavorProfile[flavor].value = currentValue * (1 - learningRate) + level * learningRate;
        
        // 신뢰도 증가
        this.flavorProfile[flavor].confidence = Math.min(
          currentConfidence + confidenceBoost,
          this.metadata.maxConfidence
        );
      }
    }
  }
  
  // 분위기 선호도 업데이트
  if (review.atmosphereTags && review.atmosphereTags.length > 0) {
    const atmosphereMap = {
      '조용한': 'quiet',
      '시끄러운': 'lively',
      '로맨틱': 'romantic',
      '캐주얼': 'casual',
      '포멀': 'formal',
      '힙한': 'trendy',
      '전통적인': 'traditional',
      '아늑한': 'cozy',
      '모던한': 'modern',
      '야외석': 'outdoor'
    };
    
    review.atmosphereTags.forEach(tag => {
      const vectorKey = atmosphereMap[tag];
      if (vectorKey && this.atmosphereVector[vectorKey]) {
        const ratingMultiplier = review.overallRating / 3; // 평점에 따라 가중치 조정
        const currentValue = this.atmosphereVector[vectorKey].value;
        
        this.atmosphereVector[vectorKey].value = Math.min(10, 
          currentValue + learningRate * ratingMultiplier
        );
        this.atmosphereVector[vectorKey].confidence = Math.min(
          this.atmosphereVector[vectorKey].confidence + confidenceBoost,
          this.metadata.maxConfidence
        );
      }
    });
  }
  
  // 상황별 선호도 업데이트
  if (review.visitInfo && review.visitInfo.occasion) {
    const occasionMap = {
      '혼밥': 'solo',
      '데이트': 'date',
      '가족모임': 'family',
      '친구모임': 'friends',
      '비즈니스': 'business',
      '기념일': 'celebration'
    };
    
    const vectorKey = occasionMap[review.visitInfo.occasion];
    if (vectorKey && this.contextVector[vectorKey]) {
      const ratingMultiplier = review.overallRating / 3;
      const currentValue = this.contextVector[vectorKey].value;
      
      this.contextVector[vectorKey].value = Math.min(10,
        currentValue + learningRate * ratingMultiplier
      );
      this.contextVector[vectorKey].confidence = Math.min(
        this.contextVector[vectorKey].confidence + confidenceBoost,
        this.metadata.maxConfidence
      );
    }
  }
  
  // 메타데이터 업데이트
  this.metadata.totalDataPoints++;
  this.metadata.lastUpdated = new Date();
  
  // 학습률 감소 (시간이 지날수록 변화량 감소)
  this.metadata.learningRate *= this.metadata.decayFactor;
  this.metadata.learningRate = Math.max(0.01, this.metadata.learningRate);
  
  return this.save();
};

// 벡터 유사도 계산
tasteVectorSchema.methods.calculateSimilarity = function(otherVector) {
  let similarity = 0;
  let totalWeight = 0;
  
  // 각 벡터 카테고리별 유사도 계산
  const categories = [
    { name: 'flavorProfile', weight: 0.3 },
    { name: 'cuisineVector', weight: 0.25 },
    { name: 'atmosphereVector', weight: 0.15 },
    { name: 'contextVector', weight: 0.15 },
    { name: 'priceVector', weight: 0.1 },
    { name: 'behaviorVector', weight: 0.05 }
  ];
  
  categories.forEach(category => {
    let categorySimilarity = 0;
    let categoryItems = 0;
    
    for (const key in this[category.name]) {
      if (otherVector[category.name][key]) {
        const diff = Math.abs(
          this[category.name][key].value - otherVector[category.name][key].value
        );
        const confidence = (
          this[category.name][key].confidence + otherVector[category.name][key].confidence
        ) / 2;
        
        categorySimilarity += (1 - diff / 10) * confidence;
        categoryItems++;
      }
    }
    
    if (categoryItems > 0) {
      similarity += (categorySimilarity / categoryItems) * category.weight;
      totalWeight += category.weight;
    }
  });
  
  return totalWeight > 0 ? similarity / totalWeight : 0;
};

// 추천 점수 계산
tasteVectorSchema.methods.calculateRecommendationScore = function(restaurant) {
  let score = 0;
  
  // 요리 스타일 매칭
  const cuisineMap = {
    '한식': 'korean',
    '중식': 'chinese',
    '일식': 'japanese',
    '양식': 'western',
    '동남아': 'southeast_asian'
  };
  
  const cuisineKey = cuisineMap[restaurant.category];
  if (cuisineKey && this.cuisineVector[cuisineKey]) {
    score += this.cuisineVector[cuisineKey].value * this.cuisineVector[cuisineKey].confidence * 0.3;
  }
  
  // 가격대 매칭
  const priceMap = {
    '저렴한': 'budget',
    '보통': 'moderate',
    '비싼': 'premium',
    '매우비싼': 'luxury'
  };
  
  const priceKey = priceMap[restaurant.priceRange];
  if (priceKey && this.priceVector[priceKey]) {
    score += this.priceVector[priceKey].value * this.priceVector[priceKey].confidence * 0.2;
  }
  
  // 분위기 매칭
  if (restaurant.dnaProfile && restaurant.dnaProfile.atmosphere) {
    const atmosphereMap = {
      '조용한': 'quiet',
      '활기찬': 'lively',
      '로맨틱': 'romantic',
      '캐주얼': 'casual',
      '고급스러운': 'formal',
      '힙한': 'trendy',
      '전통적인': 'traditional',
      '아늑한': 'cozy'
    };
    
    let atmosphereScore = 0;
    let atmosphereCount = 0;
    
    restaurant.dnaProfile.atmosphere.forEach(atmo => {
      const key = atmosphereMap[atmo];
      if (key && this.atmosphereVector[key]) {
        atmosphereScore += this.atmosphereVector[key].value * this.atmosphereVector[key].confidence;
        atmosphereCount++;
      }
    });
    
    if (atmosphereCount > 0) {
      score += (atmosphereScore / atmosphereCount) * 0.15;
    }
  }
  
  // 정규화 (0-100 scale)
  return Math.min(100, Math.max(0, score * 10));
};

// 신뢰도 감소 (시간 경과에 따른)
tasteVectorSchema.methods.decayConfidence = function(days = 30) {
  const decayRate = Math.exp(-days / 90); // 90일 반감기
  
  const vectorCategories = [
    'flavorProfile', 'cuisineVector', 'atmosphereVector',
    'contextVector', 'priceVector', 'behaviorVector'
  ];
  
  vectorCategories.forEach(category => {
    for (const key in this[category]) {
      if (this[category][key].confidence) {
        this[category][key].confidence = Math.max(
          this.metadata.minConfidence,
          this[category][key].confidence * decayRate
        );
      }
    }
  });
  
  return this.save();
};

const TasteVector = mongoose.model('TasteVector', tasteVectorSchema);

module.exports = TasteVector;