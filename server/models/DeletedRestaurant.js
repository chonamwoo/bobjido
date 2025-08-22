const mongoose = require('mongoose');

const deletedRestaurantSchema = new mongoose.Schema({
  // 원본 맛집 정보
  originalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  averageRating: {
    type: Number,
    default: 0
  },
  detailedAverages: {
    taste: { type: Number, default: 0 },
    cleanliness: { type: Number, default: 0 },
    service: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  },
  priceRange: String,
  images: [String],
  
  // 삭제 정보
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  deleteReason: {
    type: String,
    enum: ['duplicate', 'closed', 'inappropriate', 'spam', 'other'],
    default: 'other'
  },
  deleteNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('DeletedRestaurant', deletedRestaurantSchema);