const mongoose = require('mongoose');

const restaurantRequestSchema = new mongoose.Schema({
  // 요청한 맛집 정보
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
  description: String,
  reason: String,
  
  // 요청자 정보
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  contactInfo: String,
  
  // 처리 상태
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'duplicate'],
    default: 'pending'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  adminNotes: String,
  rejectionReason: String,
  
  // 승인된 경우 생성된 맛집 ID
  createdRestaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
}, {
  timestamps: true
});

// 대기 중인 요청만 가져오기
restaurantRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: 'pending' })
    .populate('requestedBy', 'username email profileImage')
    .sort('-requestedAt');
};

module.exports = mongoose.model('RestaurantRequest', restaurantRequestSchema);