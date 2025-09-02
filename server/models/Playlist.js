const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '플레이리스트 제목은 필수입니다'],
    trim: true,
    maxlength: [100, '플레이리스트 제목은 최대 100자까지 가능합니다']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, '설명은 최대 1000자까지 가능합니다']
  },
  coverImage: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['editor', 'viewer'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  restaurants: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    personalNote: {
      type: String,
      maxlength: [500, '개인 메모는 최대 500자까지 가능합니다']
    },
    mustTry: [{
      type: String
    }],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['데이트코스', '혼밥', '가족모임', '친구모임', '출장/여행', '회식', '카페투어', '맛집투어', '기타'],
    required: true
  },
  theme: {
    type: String,
    default: null
  },
  targetAudience: [{
    type: String,
    enum: ['20대', '30대', '40대', '50대이상', '학생', '직장인', '가족', '커플', '혼자', '친구']
  }],
  estimatedCost: {
    min: Number,
    max: Number,
    perPerson: {
      type: Boolean,
      default: true
    }
  },
  estimatedDuration: {
    type: Number,
    default: null
  },
  region: {
    city: String,
    district: String,
    neighborhood: String
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  saves: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    visitedRestaurants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }]
  }],
  shareCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // 상세한 조회수 트래킹
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
  
  // 인기도 점수 (조회수, 좋아요, 저장 등 종합)
  popularityScore: { type: Number, default: 0, index: true },
  trendingScore: { type: Number, default: 0, index: true },
  commentCount: {
    type: Number,
    default: 0
  },
  remixedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    default: null
  },
  remixes: [{
    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Playlist'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  route: {
    type: {
      type: String,
      enum: ['walking', 'transit', 'driving'],
      default: 'walking'
    },
    totalDistance: Number,
    totalDuration: Number,
    waypoints: [{
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
      },
      arrivalTime: String,
      departureTime: String
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

playlistSchema.index({ title: 'text', description: 'text' });
playlistSchema.index({ createdBy: 1 });
playlistSchema.index({ category: 1 });
playlistSchema.index({ tags: 1 });
playlistSchema.index({ 'region.city': 1, 'region.district': 1 });
playlistSchema.index({ isPublic: 1, createdAt: -1 });
playlistSchema.index({ 'likes.length': -1 });
playlistSchema.index({ viewCount: -1 });
playlistSchema.index({ popularityScore: -1 });
playlistSchema.index({ trendingScore: -1 });
playlistSchema.index({ 'views.total': -1 });

playlistSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

playlistSchema.virtual('saveCount').get(function() {
  return this.saves.length;
});

playlistSchema.virtual('completionCount').get(function() {
  return this.completions.length;
});

playlistSchema.virtual('restaurantCount').get(function() {
  return this.restaurants.length;
});

playlistSchema.methods.addRestaurant = async function(restaurantId, personalNote, addedBy) {
  const existingIndex = this.restaurants.findIndex(
    r => r.restaurant.toString() === restaurantId.toString()
  );
  
  if (existingIndex !== -1) {
    throw new Error('이미 플레이리스트에 추가된 맛집입니다');
  }
  
  const order = this.restaurants.length + 1;
  
  this.restaurants.push({
    restaurant: restaurantId,
    order,
    personalNote,
    addedBy
  });
  
  return this.save();
};

playlistSchema.methods.removeRestaurant = async function(restaurantId) {
  const index = this.restaurants.findIndex(
    r => r.restaurant.toString() === restaurantId.toString()
  );
  
  if (index === -1) {
    throw new Error('플레이리스트에 없는 맛집입니다');
  }
  
  this.restaurants.splice(index, 1);
  
  this.restaurants.forEach((r, idx) => {
    r.order = idx + 1;
  });
  
  return this.save();
};

playlistSchema.methods.reorderRestaurants = async function(newOrder) {
  if (newOrder.length !== this.restaurants.length) {
    throw new Error('잘못된 순서 정보입니다');
  }
  
  const reorderedRestaurants = [];
  
  newOrder.forEach((restaurantId, index) => {
    const restaurant = this.restaurants.find(
      r => r.restaurant.toString() === restaurantId.toString()
    );
    
    if (!restaurant) {
      throw new Error('플레이리스트에 없는 맛집입니다');
    }
    
    restaurant.order = index + 1;
    reorderedRestaurants.push(restaurant);
  });
  
  this.restaurants = reorderedRestaurants;
  return this.save();
};

playlistSchema.methods.toggleLike = async function(userId) {
  const likeIndex = this.likes.findIndex(
    like => like.user.toString() === userId.toString()
  );
  
  if (likeIndex === -1) {
    this.likes.push({ user: userId });
  } else {
    this.likes.splice(likeIndex, 1);
  }
  
  return this.save();
};

playlistSchema.methods.toggleSave = async function(userId) {
  const saveIndex = this.saves.findIndex(
    save => save.user.toString() === userId.toString()
  );
  
  if (saveIndex === -1) {
    this.saves.push({ user: userId });
  } else {
    this.saves.splice(saveIndex, 1);
  }
  
  return this.save();
};

playlistSchema.methods.addCollaborator = async function(userId, role = 'viewer') {
  const existingCollaborator = this.collaborators.find(
    c => c.user.toString() === userId.toString()
  );
  
  if (existingCollaborator) {
    existingCollaborator.role = role;
  } else {
    this.collaborators.push({ user: userId, role });
  }
  
  return this.save();
};

playlistSchema.methods.removeCollaborator = async function(userId) {
  this.collaborators = this.collaborators.filter(
    c => c.user.toString() !== userId.toString()
  );
  
  return this.save();
};

playlistSchema.methods.canEdit = function(userId) {
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  const collaborator = this.collaborators.find(
    c => c.user.toString() === userId.toString()
  );
  
  return collaborator && collaborator.role === 'editor';
};

playlistSchema.methods.canView = function(userId) {
  if (this.isPublic) return true;
  if (this.createdBy.toString() === userId.toString()) return true;
  
  return this.collaborators.some(
    c => c.user.toString() === userId.toString()
  );
};

// 조회수 증가 메서드
playlistSchema.methods.incrementView = async function(userId = null) {
  // 전체 조회수 증가
  this.viewCount += 1;
  this.views.total += 1;
  
  // 로그인한 사용자의 경우 유니크 조회수 트래킹
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
    if (userId) {
      const isNewToday = !this.views.uniqueUsers.some(
        v => v.user && v.user.toString() === userId.toString() && 
        v.viewedAt >= today
      );
      if (isNewToday) todayStats.uniqueViews += 1;
    }
  } else {
    this.views.dailyStats.push({
      date: today,
      views: 1,
      uniqueViews: userId ? 1 : 0
    });
  }
  
  // 주간/월간 조회수 업데이트
  this.updatePeriodViews();
  
  // 인기도 점수 재계산
  this.calculatePopularityScore();
  
  return this.save();
};

// 주간/월간 조회수 계산
playlistSchema.methods.updatePeriodViews = function() {
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  
  this.views.weeklyViews = this.views.dailyStats
    .filter(stat => stat.date >= weekAgo)
    .reduce((sum, stat) => sum + stat.views, 0);
    
  this.views.monthlyViews = this.views.dailyStats
    .filter(stat => stat.date >= monthAgo)
    .reduce((sum, stat) => sum + stat.views, 0);
};

// 인기도 점수 계산
playlistSchema.methods.calculatePopularityScore = function() {
  const weights = {
    view: 1,
    like: 5,
    save: 10,
    completion: 20,
    share: 3,
    comment: 2
  };
  
  this.popularityScore = 
    (this.viewCount * weights.view) +
    (this.likes.length * weights.like) +
    (this.saves.length * weights.save) +
    (this.completions.length * weights.completion) +
    (this.shareCount * weights.share) +
    (this.commentCount * weights.comment);
    
  // 트렌딩 점수 (최근 활동에 가중치)
  const recentViews = this.views.weeklyViews || 0;
  const recentLikes = this.likes.filter(l => 
    l.likedAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  
  this.trendingScore = (recentViews * 2) + (recentLikes * 10);
};

playlistSchema.statics.getTrending = async function(limit = 10, days = 7) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  
  return this.find({
    isPublic: true,
    isActive: true,
    createdAt: { $gte: dateThreshold }
  })
  .sort('-viewCount -likeCount')
  .limit(limit)
  .populate('createdBy', 'username profileImage')
  .populate('restaurants.restaurant', 'name address images');
};

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;