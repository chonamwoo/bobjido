const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
require('dotenv').config();

async function resetAdminPassword() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
    
    // Admin 계정 찾기
    const adminUser = await User.findOne({ userId: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Admin 계정을 찾을 수 없습니다.');
      process.exit(1);
    }
    
    // 새 비밀번호 설정
    const newPassword = 'BobMap2025!Admin';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    adminUser.password = hashedPassword;
    await adminUser.save();
    
    console.log('✅ Admin 계정 비밀번호가 재설정되었습니다!');
    console.log('=====================================');
    console.log('아이디: admin');
    console.log('비밀번호: BobMap2025!Admin');
    console.log('=====================================');
    
    process.exit(0);
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
}

resetAdminPassword();
