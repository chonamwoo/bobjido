const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '어드민 사용자명은 필수입니다'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, '어드민 이메일은 필수입니다'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력하세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다'],
    minlength: [8, '어드민 비밀번호는 최소 8자 이상이어야 합니다'],
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: [
      'user_management',
      'playlist_management', 
      'restaurant_management',
      'content_moderation',
      'analytics_view',
      'system_settings'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    loginAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;