require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공');
    
    // User 모델 가져오기
    const User = require('./server/models/User');

    // 기존 admin 계정 확인
    const existingAdmin = await User.findOne({ $or: [{ userId: 'admin' }, { email: 'admin@bobmap.com' }] });
    
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
      
      const newAdmin = new User({
        userId: 'admin',
        username: 'Administrator',
        email: 'admin@bobmap.com',
        password: hashedPassword,
        bio: '시스템 관리자',
        onboardingCompleted: true
      });
      
      await newAdmin.save();
      
      console.log('✅ Admin 계정이 생성되었습니다!');
      console.log('=====================================');
      console.log('UserId (로그인ID): admin');
      console.log('Email: admin@bobmap.com');
      console.log('Password: admin123');
      console.log('Username: Administrator');
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