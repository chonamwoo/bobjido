require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공\n');
    
    const User = require('./server/models/User');
    
    // 더 복잡한 비밀번호로 변경 (Chrome 경고 회피)
    const updates = [
      { userId: 'admin', newPassword: 'BobMap2025!Admin' },
      { userId: 'testbob', newPassword: 'BobMap2025!Test' }
    ];
    
    for (const update of updates) {
      const user = await User.findOne({ userId: update.userId });
      
      if (!user) {
        console.log(`❌ ${update.userId} 사용자를 찾을 수 없습니다`);
        continue;
      }
      
      // 비밀번호 업데이트 (모델이 자동으로 해싱)
      user.password = update.newPassword;
      await user.save();
      
      console.log(`✅ ${update.userId} 비밀번호 업데이트 완료`);
      console.log(`   새 비밀번호: ${update.newPassword}`);
      console.log('=' .repeat(50));
    }
    
    console.log('\n📌 새로운 로그인 정보:');
    console.log('=' .repeat(50));
    console.log('1. Admin 계정');
    console.log('   아이디: admin');
    console.log('   비밀번호: BobMap2025!Admin');
    console.log('');
    console.log('2. TestBob 계정');
    console.log('   아이디: testbob');
    console.log('   비밀번호: BobMap2025!Test');
    console.log('=' .repeat(50));
    console.log('\n💡 Chrome 비밀번호 유출 경고를 피하기 위해 복잡한 비밀번호를 사용합니다.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

updatePasswords();