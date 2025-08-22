const mongoose = require('mongoose');

const globalTasteConnectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  location: {
    country: String,
    city: String,
    region: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    timezone: String
  },
  travelHistory: [{
    country: String,
    city: String,
    visitedAt: Date,
    duration: Number, // 일 수
    favoriteRestaurants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }]
  }],
  globalPreferences: {
    openToTravelers: {
      type: Boolean,
      default: true
    },
    languages: [String], // ['ko', 'en', 'ja', ...]
    culturalAdventure: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    socialLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  localRecommendations: [{
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    },
    description: String,
    tags: [String], // ['hidden-gem', 'must-try', 'local-favorite']
    recommendedFor: [String] // 추천하는 취향 타입들
  }],
  connections: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    connectionType: {
      type: String,
      enum: ['taste-match', 'location-match', 'travel-buddy'],
      default: 'taste-match'
    },
    connectedAt: Date,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }],
  publicProfile: {
    shareLocation: {
      type: Boolean,
      default: true
    },
    shareRecommendations: {
      type: Boolean,
      default: true
    },
    shareTravelHistory: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

globalTasteConnectionSchema.index({ 'location.coordinates': '2dsphere' });
globalTasteConnectionSchema.index({ 'location.country': 1, 'location.city': 1 });
globalTasteConnectionSchema.index({ 'globalPreferences.openToTravelers': 1 });

const GlobalTasteConnection = mongoose.model('GlobalTasteConnection', globalTasteConnectionSchema);

module.exports = GlobalTasteConnection;