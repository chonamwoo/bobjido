const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '맛집 이름은 필수입니다'],
    trim: true,
    maxlength: [100, '맛집 이름은 최대 100자까지 가능합니다']
  },
  address: {
    type: String,
    required: [true, '주소는 필수입니다'],
    trim: true
  },
  roadAddress: {
    type: String,
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, '위도는 필수입니다'],
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: [true, '경도는 필수입니다'],
      min: -180,
      max: 180
    }
  },
  category: {
    type: String,
    required: [true, '카테고리는 필수입니다'],
    enum: ['한식', '중식', '일식', '양식', '동남아', '카페', '디저트', '주점', '패스트푸드', '기타']
  },
  subCategory: {
    type: String,
    default: null
  },
  priceRange: {
    type: String,
    required: [true, '가격대는 필수입니다'],
    enum: ['저렴한', '보통', '비싼', '매우비싼']
  },
  images: [{
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  phoneNumber: {
    type: String,
    default: null
  },
  businessHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } }
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  dnaProfile: {
    atmosphere: [{
      type: String,
      enum: ['조용한', '활기찬', '로맨틱', '캐주얼', '고급스러운', '힙한', '전통적인', '아늑한']
    }],
    foodStyle: [{
      type: String,
      enum: ['전통적인', '퓨전', '현대적인', '가정식', '실험적인', '정통']
    }],
    instagramability: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    dateSpot: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    groupFriendly: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    soloFriendly: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  similarRestaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    similarity: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  menuItems: [{
    name: String,
    price: Number,
    description: String,
    isPopular: {
      type: Boolean,
      default: false
    },
    category: String
  }],
  features: [{
    type: String,
    enum: ['주차가능', '와이파이', '예약가능', '배달가능', '포장가능', '24시간', '룸있음', '테라스', '키즈존', '반려동물동반']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verifiedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  saveCount: {
    type: Number,
    default: 0
  },
  
  // 상세한 조회수 및 활동 트래킹
  views: {
    total: { type: Number, default: 0 },
    uniqueUsers: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      viewedAt: { type: Date, default: Date.now },
      viewCount: { type: Number, default: 1 }
    }],
    dailyStats: [{
      date: { type: Date, required: true },
      views: { type: Number, default: 0 },
      uniqueViews: { type: Number, default: 0 }
    }],
    weeklyViews: { type: Number, default: 0 },
    monthlyViews: { type: Number, default: 0 }
  },
  
  // 사용자 활동 트래킹
  interactions: {
    likes: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      likedAt: { type: Date, default: Date.now }
    }],
    saves: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      savedAt: { type: Date, default: Date.now }
    }],
    shares: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sharedAt: { type: Date, default: Date.now },
      platform: String
    }]
  },
  
  // 인기도 점수
  popularityScore: { type: Number, default: 0, index: true },
  trendingScore: { type: Number, default: 0, index: true },
  region: {
    city: String,
    district: String,
    neighborhood: String
  },
  kakaoPlaceId: {
    type: String,
    default: null
  },
  naverPlaceId: {
    type: String,
    default: null
  },
  googlePlaceId: {
    type: String,
    default: null
  },
  externalReviewUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// restaurantSchema.index({ coordinates: '2dsphere' }); // 일반 좌표 형식 사용으로 인해 비활성화
restaurantSchema.index({ name: 'text', address: 'text' });
restaurantSchema.index({ category: 1 });
restaurantSchema.index({ priceRange: 1 });
restaurantSchema.index({ 'region.city': 1, 'region.district': 1 });
restaurantSchema.index({ averageRating: -1 });
restaurantSchema.index({ createdBy: 1 });
restaurantSchema.index({ popularityScore: -1 });
restaurantSchema.index({ trendingScore: -1 });
restaurantSchema.index({ 'views.total': -1 });

restaurantSchema.methods.updateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ restaurant: this._id });
  
  if (reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / reviews.length) * 10) / 10;
    this.reviewCount = reviews.length;
  }
  
  return this.save();
};

restaurantSchema.methods.findSimilarRestaurants = async function(limit = 5) {
  const query = {
    _id: { $ne: this._id },
    category: this.category,
    priceRange: this.priceRange,
    'region.city': this.region.city
  };
  
  const similarRestaurants = await this.constructor
    .find(query)
    .limit(limit)
    .select('name address averageRating category priceRange');
    
  return similarRestaurants;
};

// 조회수 증가 메서드
restaurantSchema.methods.incrementView = async function(userId = null) {
  this.viewCount += 1;
  this.views.total += 1;
  
  if (userId) {
    const existingView = this.views.uniqueUsers.find(
      v => v.user && v.user.toString() === userId.toString()
    );
    
    if (existingView) {
      existingView.viewCount += 1;
      existingView.viewedAt = new Date();
    } else {
      this.views.uniqueUsers.push({
        user: userId,
        viewedAt: new Date(),
        viewCount: 1
      });
    }
  }
  
  // 일일 통계 업데이트
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let todayStats = this.views.dailyStats.find(
    stat => stat.date.getTime() === today.getTime()
  );
  
  if (todayStats) {
    todayStats.views += 1;
    if (userId && !todayStats.uniqueUsers) todayStats.uniqueViews += 1;
  } else {
    this.views.dailyStats.push({
      date: today,
      views: 1,
      uniqueViews: userId ? 1 : 0
    });
  }
  
  this.calculatePopularityScore();
  return this.save();
};

// 인기도 점수 계산
restaurantSchema.methods.calculatePopularityScore = function() {
  const weights = {
    view: 1,
    review: 10,
    rating: 20,
    save: 5,
    share: 3
  };
  
  this.popularityScore = 
    (this.viewCount * weights.view) +
    (this.reviewCount * weights.review) +
    (this.averageRating * weights.rating) +
    ((this.interactions?.saves?.length || 0) * weights.save) +
    ((this.interactions?.shares?.length || 0) * weights.share);
    
  // 트렌딩 점수 (최근 7일 활동)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentViews = this.views.weeklyViews || 0;
  const recentSaves = (this.interactions?.saves || []).filter(s => 
    s.savedAt >= weekAgo
  ).length;
  
  this.trendingScore = (recentViews * 2) + (recentSaves * 10);
};

restaurantSchema.statics.searchNearby = async function(coordinates, maxDistance = 5000) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;