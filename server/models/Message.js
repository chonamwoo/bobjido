const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'location', 'restaurant', 'system'],
    default: 'text'
  },
  // 맛집 공유 메시지의 경우
  restaurantData: {
    name: String,
    address: String,
    image: String,
    placeId: String
  },
  // 위치 공유 메시지의 경우
  locationData: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  // 이미지 메시지의 경우
  imageData: {
    url: String,
    filename: String,
    size: Number
  },
  // 읽음 처리
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // 메시지 반응 (향후 기능)
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // 답장 메시지인 경우
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // 메시지 수정/삭제 처리
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// 인덱스 (성능 최적화)
messageSchema.index({ chat: 1, createdAt: -1 }); // 채팅방별 메시지 조회
messageSchema.index({ sender: 1 }); // 발신자별 메시지 조회
messageSchema.index({ 'readBy.user': 1 }); // 읽음 상태 조회
messageSchema.index({ chat: 1, sender: 1, createdAt: -1 }); // 복합 인덱스
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30일 후 자동 삭제 (선택적)

// 메시지 전송 전 검증
messageSchema.pre('save', function(next) {
  // 내용이 비어있는 경우 (시스템 메시지 제외)
  if (this.type !== 'system' && !this.content.trim()) {
    return next(new Error('메시지 내용이 필요합니다.'));
  }

  // 맛집 메시지의 경우 restaurantData 필수
  if (this.type === 'restaurant' && !this.restaurantData) {
    return next(new Error('맛집 정보가 필요합니다.'));
  }

  // 위치 메시지의 경우 locationData 필수
  if (this.type === 'location' && !this.locationData) {
    return next(new Error('위치 정보가 필요합니다.'));
  }

  next();
});

// 가상 필드: 읽지 않은 사용자 수
messageSchema.virtual('unreadCount').get(function() {
  // 채팅방 참여자 수에서 읽은 사용자 수를 뺀 값
  return this.populated('chat') ? 
    this.chat.participants.length - this.readBy.length : 0;
});

// JSON 출력시 가상 필드 포함
messageSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);