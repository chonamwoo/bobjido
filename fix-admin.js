const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User 스키마 직접 정의
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function fixAdmin() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB 연결 성공');
    
    // 모든 사용자 확인
    const allUsers = await User.find({});
    console.log('\n현재 사용자 목록:');
    allUsers.forEach(user => {
      console.log(`- ${user.userId} (${user.email}) - isAdmin: ${user.isAdmin}`);
    });
    
    // admin 계정 찾기 또는 생성
    let adminUser = await User.findOne({ userId: 'admin' });
    
    if (adminUser) {
      console.log('\n✅ Admin 계정이 이미 존재합니다.');
      
      // 비밀번호 업데이트
      const newPassword = 'admin123';
      adminUser.password = await bcrypt.hash(newPassword, 10);
      adminUser.isAdmin = true;
      await adminUser.save();
      
      console.log('✅ Admin 계정 비밀번호가 재설정되었습니다!');
    } else {
      console.log('\n❌ Admin 계정이 없습니다. 새로 생성합니다...');
      
      const newPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
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
    
    console.log('\n=====================================');
    console.log('✅ Admin 계정 정보:');
    console.log('아이디: admin');
    console.log('비밀번호: admin123');
    console.log('이메일: admin@bobmap.com');
    console.log('=====================================\n');
    
    // 연결 종료
    await mongoose.connection.close();
    console.log('MongoDB 연결 종료');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n네트워크 연결을 확인해주세요.');
      console.log('MongoDB Atlas에 접속할 수 없습니다.');
    }
    process.exit(1);
  }
}

fixAdmin();