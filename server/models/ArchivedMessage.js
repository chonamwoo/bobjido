const mongoose = require('mongoose');

// 아카이브된 메시지 스키마 (기존 Message와 동일한 구조)
const archivedMessageSchema = new mongoose.Schema({
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
  restaurantData: {
    name: String,
    address: String,
    image: String,
    placeId: String
  },
  locationData: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  imageData: {
    url: String,
    filename: String,
    size: Number
  },
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
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArchivedMessage'
  },
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
  }],
  archivedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 인덱스
archivedMessageSchema.index({ chat: 1, createdAt: -1 });
archivedMessageSchema.index({ sender: 1 });
archivedMessageSchema.index({ archivedAt: 1 });

module.exports = mongoose.model('ArchivedMessage', archivedMessageSchema);