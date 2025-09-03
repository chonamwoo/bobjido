require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공');
    
    const User = require('./server/models/User');
    
    // 계정 찾기 (userId를 매개변수로 받을 수 있도록)
    const userId = process.argv[2] || 'admin';
    const adminUser = await User.findOne({ userId });
    
    if (!adminUser) {
      console.log(`❌ ${userId} 계정을 찾을 수 없습니다`);
      process.exit(1);
    }
    
    // 비밀번호를 plain text로 설정 (모델이 자동으로 해싱함)
    const newPassword = process.argv[3] || 'admin123';
    adminUser.password = newPassword;
    await adminUser.save();
    
    console.log(`✅ ${userId} 비밀번호가 재설정되었습니다!`);
    console.log('=====================================');
    console.log(`UserId (로그인ID): ${userId}`);
    console.log(`새 비밀번호: ${newPassword}`);
    console.log('=====================================');
    
    // 비밀번호 검증 테스트
    const isValid = await bcrypt.compare(newPassword, adminUser.password);
    console.log('비밀번호 검증 테스트:', isValid ? '✅ 성공' : '❌ 실패');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();