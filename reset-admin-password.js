const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./server/models/Admin');

async function resetAdminPassword() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // admin 계정 찾기
    const admin = await Admin.findOne({ email: 'admin@bobmap.com' });
    
    if (!admin) {
      console.log('❌ Admin 계정을 찾을 수 없습니다');
      process.exit(1);
    }
    
    // 비밀번호를 'admin123'으로 재설정
    admin.password = 'admin123';  // pre save hook이 자동으로 해싱함
    await admin.save();
    
    console.log('✅ Admin 비밀번호가 재설정되었습니다!');
    console.log('=====================================');
    console.log('Email: admin@bobmap.com');
    console.log('Password: admin123');
    console.log('Username:', admin.username);
    console.log('Role:', admin.role);
    console.log('=====================================');
    console.log('');
    console.log('Admin 로그인 URL: http://localhost:3001/admin/login');
    console.log('또는 API로 직접 로그인:');
    console.log('POST http://localhost:8889/api/admin/login');
    console.log('Body: { "email": "admin@bobmap.com", "password": "admin123" }');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

resetAdminPassword();