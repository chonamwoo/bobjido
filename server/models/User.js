const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, '아이디는 필수입니다'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [4, '아이디는 최소 4자 이상이어야 합니다'],
    maxlength: [20, '아이디는 최대 20자까지 가능합니다'],
    validate: {
      validator: function(v) {
        // 영문 소문자, 숫자, 언더스코어만 허용
        return /^[a-z0-9_]+$/.test(v);
      },
      message: '아이디는 영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다'
    }
  },
  username: {
    type: String,
    required: [true, '사용자명은 필수입니다'],
    trim: true,
    minlength: [2, '사용자명은 최소 2자 이상이어야 합니다'],
    maxlength: [30, '사용자명은 최대 30자까지 가능합니다']
  },
  email: {
    type: String,
    required: function() {
      // OAuth 로그인인 경우 이메일 필수 아님
      return !this.googleId && !this.kakaoId;
    },
    unique: true,
    sparse: true,  // null 값 허용
    lowercase: true,
    validate: {
      validator: function(v) {
        // OAuth 사용자이거나 이메일이 없는 경우 검증 통과
        if (this.googleId || this.kakaoId || !v) return true;
        // 일반 사용자만 이메일 형식 검증
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(v);
      },
      message: '유효한 이메일을 입력하세요'
    }
  },
  password: {
    type: String,
    required: function() {
      // OAuth 로그인인 경우 비밀번호 필수 아님
      return !this.googleId && !this.kakaoId;
    },
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다'],
    select: false
  },
  // OAuth 프로바이더 ID
  googleId: {
    type: String,
    sparse: true
  },
  kakaoId: {
    type: String,
    sparse: true
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, '자기소개는 최대 500자까지 가능합니다'],
    default: ''
  },
  tasteProfile: {
    // 새로운 프로필 시스템
    type: {
      type: String,
      enum: ['spicy_adventurer', 'trendy_explorer', 'comfort_lover', 'social_foodie', 
             'budget_gourmet', 'premium_diner', 'solo_explorer', 'traditional_taste']
    },
    scores: {
      spicy_adventurer: { type: Number, default: 0 },
      trendy_explorer: { type: Number, default: 0 },
      comfort_lover: { type: Number, default: 0 },
      social_foodie: { type: Number, default: 0 },
      budget_gourmet: { type: Number, default: 0 },
      premium_diner: { type: Number, default: 0 },
      solo_explorer: { type: Number, default: 0 },
      traditional_taste: { type: Number, default: 0 }
    },
    lastUpdated: { type: Date, default: Date.now },
    
    // 기존 필드들 (호환성을 위해 유지)
    spicyTolerance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    sweetPreference: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    pricePreference: {
      type: String,
      enum: ['저렴한', '보통', '고급', '상관없음'],
      default: '보통'
    },
    atmosphereStyle: [{
      type: String,
      enum: ['조용한', '활기찬', '로맨틱', '캐주얼', '고급스러운', '힙한', '전통적인']
    }],
    cuisineExpertise: [{
      type: String,
      enum: ['한식', '중식', '일식', '양식', '동남아', '카페', '디저트', '주점', '패스트푸드', '기타']
    }]
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  rankings: {
    type: Map,
    of: {
      rank: Number,
      score: Number
    },
    default: {}
  },
  // Enhanced social features
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  following: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Liked restaurants
  likedRestaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Saved restaurants
  savedRestaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // 매칭 관련 필드들
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  superLikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  blocked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    city: String,
    district: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  
  savedPlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  likedPlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  visitedRestaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    visitedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  // 카테고리별 방문 횟수 카운트
  categoryVisitCounts: {
    type: Map,
    of: Number,
    default: new Map()
  },
  // 음식 MBTI 게임 답변 기록
  foodMBTIAnswers: [{
    questionId: String,
    answer: String,
    answeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  // 음식 MBTI 타입
  foodMBTIType: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ userId: 1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'tasteProfile.cuisineExpertise': 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.calculateTrustScore = function() {
  let score = 0;
  
  if (this.profileImage) score += 5;
  if (this.bio && this.bio.length > 50) score += 5;
  if (this.tasteProfile.cuisineExpertise.length > 0) score += 10;
  
  const followerCount = this.followers.length;
  if (followerCount > 10) score += 10;
  if (followerCount > 50) score += 10;
  if (followerCount > 100) score += 10;
  
  const visitedCount = this.visitedRestaurants.length;
  if (visitedCount > 10) score += 10;
  if (visitedCount > 50) score += 15;
  if (visitedCount > 100) score += 15;
  
  this.trustScore = Math.min(score, 100);
  return this.trustScore;
};

// 카테고리 방문 횟수 업데이트
userSchema.methods.updateCategoryCount = function(category) {
  if (!category) return;
  
  const currentCount = this.categoryVisitCounts.get(category) || 0;
  this.categoryVisitCounts.set(category, currentCount + 1);
  return this.categoryVisitCounts;
};

// 음식 MBTI 답변 저장
userSchema.methods.addFoodMBTIAnswer = function(questionId, answer) {
  // 기존 답변이 있는지 확인
  const existingIndex = this.foodMBTIAnswers.findIndex(a => a.questionId === questionId);
  
  if (existingIndex !== -1) {
    // 기존 답변 업데이트
    this.foodMBTIAnswers[existingIndex].answer = answer;
    this.foodMBTIAnswers[existingIndex].answeredAt = new Date();
  } else {
    // 새 답변 추가
    this.foodMBTIAnswers.push({
      questionId,
      answer,
      answeredAt: new Date()
    });
  }
  
  return this.foodMBTIAnswers;
};

// 음식 MBTI 타입 계산
userSchema.methods.calculateFoodMBTIType = function() {
  // 답변이 10개 이상일 때만 타입 계산
  if (this.foodMBTIAnswers.length < 10) {
    return null;
  }
  
  // 간단한 예시 로직 (실제로는 더 복잡한 알고리즘 필요)
  const typeMap = {
    spicy: 0,
    mild: 0,
    adventurous: 0,
    traditional: 0,
    social: 0,
    solo: 0,
    premium: 0,
    budget: 0
  };
  
  // 답변에 따라 점수 계산
  this.foodMBTIAnswers.forEach(answer => {
    // 실제 구현에서는 각 질문과 답변에 따라 점수 부여
    // 예시 로직만 포함
    if (answer.answer === 'spicy') typeMap.spicy++;
    if (answer.answer === 'mild') typeMap.mild++;
    // ... 등등
  });
  
  // 최종 타입 결정 (예시)
  let mbtiType = '';
  mbtiType += typeMap.spicy > typeMap.mild ? 'S' : 'M'; // Spicy vs Mild
  mbtiType += typeMap.adventurous > typeMap.traditional ? 'A' : 'T'; // Adventurous vs Traditional
  mbtiType += typeMap.social > typeMap.solo ? 'G' : 'I'; // Group vs Individual
  mbtiType += typeMap.premium > typeMap.budget ? 'P' : 'B'; // Premium vs Budget
  
  this.foodMBTIType = mbtiType;
  return mbtiType;
};

// 가장 많이 방문한 카테고리 TOP N 가져오기
userSchema.methods.getTopCategories = function(limit = 5) {
  const categories = Array.from(this.categoryVisitCounts.entries());
  categories.sort((a, b) => b[1] - a[1]);
  return categories.slice(0, limit).map(([category, count]) => ({ category, count }));
};

userSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

userSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;