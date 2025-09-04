require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 테스트 사용자 정보
    const testUserData = {
      userId: 'testbob',
      username: '테스트밥',
      email: 'testbob@bobmap.com',
      password: 'test1234'
    };
    
    // 기존 사용자 확인
    const existing = await User.findOne({ 
      $or: [
        { userId: testUserData.userId },
        { email: testUserData.email }
      ]
    });
    
    if (existing) {
      console.log('Test user already exists');
      // 비밀번호 업데이트
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash(testUserData.password, salt);
      await existing.save();
      console.log('Password updated for test user');
      console.log('Login credentials:');
      console.log('  ID: testbob');
      console.log('  Email: testbob@bobmap.com');
      console.log('  Password: test1234');
    } else {
      // 새 사용자 생성
      const user = await User.create(testUserData);
      console.log('Test user created successfully');
      console.log('Login credentials:');
      console.log('  ID: testbob');
      console.log('  Email: testbob@bobmap.com');
      console.log('  Password: test1234');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestUser();