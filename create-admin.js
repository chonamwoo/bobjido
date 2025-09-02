const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin 모델 정의 (models/Admin.js와 동일한 스키마)
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['super_admin', 'admin', 'moderator'], default: 'admin' },
  permissions: [{
    type: String,
    enum: ['user_management', 'playlist_management', 'restaurant_management', 'system_settings']
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    loginAt: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 비밀번호 비교 메서드
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 기존 admin 계정 확인
    const existingAdmin = await Admin.findOne({ email: 'admin@bobmap.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin 계정이 이미 존재합니다');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      
      // 비밀번호 재설정 옵션
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('비밀번호를 재설정하시겠습니까? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          existingAdmin.password = hashedPassword;
          await existingAdmin.save();
          console.log('✅ 비밀번호가 재설정되었습니다');
          console.log('새 비밀번호: admin123');
        }
        rl.close();
        process.exit(0);
      });
    } else {
      // 새 admin 계정 생성
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = new Admin({
        username: 'admin',
        email: 'admin@bobmap.com',
        password: hashedPassword,
        role: 'super_admin',
        permissions: ['user_management', 'playlist_management', 'restaurant_management', 'system_settings'],
        isActive: true
      });
      
      await newAdmin.save();
      
      console.log('✅ Admin 계정이 생성되었습니다!');
      console.log('=====================================');
      console.log('Email: admin@bobmap.com');
      console.log('Password: admin123');
      console.log('Role: super_admin');
      console.log('=====================================');
      console.log('⚠️  보안을 위해 첫 로그인 후 비밀번호를 변경하세요!');
      
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

createAdmin();