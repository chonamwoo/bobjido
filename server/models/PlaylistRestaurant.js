const mongoose = require('mongoose');

const playlistRestaurantSchema = new mongoose.Schema({
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalNote: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reasonForAdding: {
    type: String,
    maxlength: 500
  },
  visitStatus: {
    type: String,
    enum: ['visited', 'want_to_visit', 'visiting_soon'],
    default: 'want_to_visit'
  },
  tags: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 복합 인덱스 - 같은 플레이리스트에 같은 맛집 중복 방지
playlistRestaurantSchema.index({ playlist: 1, restaurant: 1 }, { unique: true });

const PlaylistRestaurant = mongoose.model('PlaylistRestaurant', playlistRestaurantSchema);

module.exports = PlaylistRestaurant;