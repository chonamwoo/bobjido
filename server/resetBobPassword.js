const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function resetBobPassword() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI가 설정되지 않았습니다');
      return;
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결 성공');
    
    // 새 비밀번호 설정
    const newPassword = 'bob123';  // 원하는 비밀번호로 변경하세요
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Bob 비밀번호 업데이트
    const result = await User.updateOne(
      { username: 'Bob' },
      { password: hashedPassword }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Bob의 비밀번호가 재설정되었습니다');
      console.log('📝 새 로그인 정보:');
      console.log('   Username: Bob');
      console.log(`   Password: ${newPassword}`);
    } else {
      console.log('❌ 비밀번호 업데이트 실패');
    }
    
    await mongoose.disconnect();
    console.log('✅ 완료');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

resetBobPassword();