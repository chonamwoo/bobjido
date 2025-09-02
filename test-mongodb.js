const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB URI의 비밀번호 부분만 마스킹하여 출력
const uri = process.env.MONGODB_URI;
const maskedUri = uri ? uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@') : 'URI not found';
console.log('MongoDB URI (masked):', maskedUri);

// mongoose 6+ 버전에서는 대부분의 옵션이 기본값으로 설정됨
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB 연결 성공!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB 연결 실패:', error.message);
  console.error('전체 에러:', error);
  process.exit(1);
});