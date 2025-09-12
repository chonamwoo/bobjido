const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
require('dotenv').config();

async function createOrResetAdmin() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
    
    // Admin 계정 찾기 (여러 조건으로)
    let adminUser = await User.findOne({ 
      $or: [
        { userId: 'admin' },
        { email: 'admin@bobmap.com' },
        { username: 'Administrator' }
      ]
    });
    
    const newPassword = 'BobMap2025!Admin';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    if (adminUser) {
      // 기존 계정 업데이트
      adminUser.userId = 'admin';
      adminUser.password = hashedPassword;
      adminUser.email = 'admin@bobmap.com';
      adminUser.username = 'Administrator';
      await adminUser.save();
      console.log('✅ Admin 계정이 업데이트되었습니다!');
    } else {
      // 새 계정 생성
      adminUser = new User({
        userId: 'admin',
        username: 'Administrator',
        email: 'admin@bobmap.com',
        password: hashedPassword,
        isAdmin: true
      });
      await adminUser.save();
      console.log('✅ Admin 계정이 생성되었습니다!');
    }
    
    console.log('=====================================');
    console.log('아이디: admin');
    console.log('비밀번호: BobMap2025!Admin');
    console.log('이메일: admin@bobmap.com');
    console.log('=====================================');
    
    process.exit(0);
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

createOrResetAdmin();
