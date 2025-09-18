const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['review', 'question', 'tip', 'discussion', 'meetup'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  images: [{
    type: String
  }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  location: {
    type: String
  },
  tags: [{
    type: String
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  saves: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  uniqueViewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 가상 필드 - 좋아요 수
communityPostSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// 가상 필드 - 저장 수
communityPostSchema.virtual('saveCount').get(function() {
  return this.saves ? this.saves.length : 0;
});

// 가상 필드 - 댓글 수
communityPostSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// toJSON 옵션에 가상 필드 포함
communityPostSchema.set('toJSON', {
  virtuals: true
});

// 인덱스 설정
communityPostSchema.index({ author: 1, createdAt: -1 });
communityPostSchema.index({ type: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ restaurant: 1 });
communityPostSchema.index({ 'likes.user': 1 });
communityPostSchema.index({ 'saves.user': 1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);