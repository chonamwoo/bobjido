const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['follow', 'playlist_like', 'restaurant_review', 'comment', 'mention', 'playlist_save'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedPlaylist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  relatedRestaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 인덱스 추가
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ sender: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;