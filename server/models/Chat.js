const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['personal', 'group'],
    required: true,
    default: 'personal'
  },
  name: {
    type: String,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  groupImage: {
    type: String
  },
  settings: {
    allowInvites: {
      type: Boolean,
      default: true
    },
    muteNotifications: {
      type: Boolean,
      default: false
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 인덱스
chatSchema.index({ participants: 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ updatedAt: -1 });

// 개인 채팅방의 경우 참여자는 정확히 2명이어야 함
chatSchema.pre('save', function(next) {
  if (this.type === 'personal' && this.participants.length !== 2) {
    return next(new Error('개인 채팅방은 정확히 2명의 참여자가 필요합니다.'));
  }
  next();
});

// 그룹 채팅방의 경우 이름이 필수
chatSchema.pre('save', function(next) {
  if (this.type === 'group' && !this.name) {
    return next(new Error('그룹 채팅방은 이름이 필요합니다.'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);