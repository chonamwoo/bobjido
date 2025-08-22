const mongoose = require('mongoose');

const gameAnswerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['food_mbti', 'mood_food', 'food_vs', 'lunch_recommendation'],
    required: true
  },
  answers: [{
    questionId: String,
    question: String,
    answer: String,
    metadata: {
      category: String,
      preference: String,
      tags: [String]
    }
  }],
  result: {
    type: String,
    mbtiType: String,
    recommendations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }]
  },
  location: {
    city: String,
    district: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }
}, {
  timestamps: true
});

// 인덱스
gameAnswerSchema.index({ user: 1, gameType: 1, createdAt: -1 });

const GameAnswer = mongoose.model('GameAnswer', gameAnswerSchema);

module.exports = GameAnswer;