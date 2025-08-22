const mongoose = require('mongoose');

const tasteTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  koreanName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  characteristics: [{
    type: String
  }],
  preferredCategories: [{
    type: String,
    enum: ['한식', '중식', '일식', '양식', '동남아', '카페', '디저트', '주점', '패스트푸드', '기타']
  }],
  preferredAtmosphere: [{
    type: String,
    enum: ['조용한', '활기찬', '로맨틱', '캐주얼', '고급스러운', '힙한', '전통적인']
  }],
  priceRange: {
    type: String,
    enum: ['저렴한', '보통', '고급', '상관없음']
  },
  spicyTolerance: {
    min: { type: Number, min: 1, max: 5 },
    max: { type: Number, min: 1, max: 5 }
  },
  adventurousness: {
    type: Number,
    min: 1,
    max: 5
  }
});

const userTasteProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  primaryType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TasteType'
  },
  secondaryType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TasteType'
  },
  typeScores: [{
    tasteType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TasteType'
    },
    typeName: String,
    typeKoreanName: String,
    emoji: String,
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    rawScore: Number
  }],
  analysisData: {
    totalRestaurants: Number,
    topCategories: [{
      category: String,
      count: Number,
      percentage: Number
    }],
    averagePriceRange: String,
    averageRating: Number,
    spicyPreference: Number,
    sweetPreference: Number,
    diversityScore: Number,
    loyaltyScore: Number,
    trendingScore: Number,
    lastAnalyzedAt: Date
  },
  matchingUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    compatibility: {
      type: Number,
      min: 0,
      max: 100
    },
    compatibilityGrade: {
      type: String,
      enum: ['S', 'A', 'B', 'C'],
      default: 'C'
    },
    sharedTypes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TasteType'
    }],
    tasteVector: [{
      type: String,
      percentage: Number
    }]
  }],
  confirmedByUser: {
    type: Boolean,
    default: false
  },
  confirmedAt: Date,
  sharePreference: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

userTasteProfileSchema.index({ user: 1 });
userTasteProfileSchema.index({ primaryType: 1 });
userTasteProfileSchema.index({ 'matchingUsers.compatibility': -1 });

const TasteType = mongoose.model('TasteType', tasteTypeSchema);
const UserTasteProfile = mongoose.model('UserTasteProfile', userTasteProfileSchema);

module.exports = { TasteType, UserTasteProfile };