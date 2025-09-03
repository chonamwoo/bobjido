require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공');
    
    const User = require('./server/models/User');
    const users = await User.find({}).select('userId username email password createdAt');
    
    console.log('\n📊 Total users:', users.length);
    console.log('=' .repeat(80));
    
    users.forEach(user => {
      console.log(`
ID: ${user._id}
UserId (로그인ID): ${user.userId || 'N/A'}
Username (닉네임): ${user.username}
Email: ${user.email}
Has Password: ${!!user.password}
Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString('ko-KR') : 'N/A'}
${'=' .repeat(80)}`);
    });
    
    // admin 계정이 있는지 확인
    const adminUser = await User.findOne({ $or: [{ userId: 'admin' }, { username: 'admin' }] });
    if (adminUser) {
      console.log('\n✅ Admin 계정 존재:', adminUser.userId || adminUser.username);
    } else {
      console.log('\n❌ Admin 계정이 없습니다. 생성하시겠습니까?');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

checkUsers();