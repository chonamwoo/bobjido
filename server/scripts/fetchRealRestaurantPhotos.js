const mongoose = require('mongoose');
const { updateAllRestaurantPhotos } = require('../utils/googlePlacesApi');

// 환경변수 로드
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// MongoDB 연결
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

// 스크립트 실행
const runScript = async () => {
  console.log('실제 식당 사진 가져오기 스크립트 시작...');
  
  // Google Places API 키 확인
  if (!process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY === 'your_google_places_api_key_here') {
    console.log('⚠️  Google Places API 키가 설정되지 않았습니다.');
    console.log('📝 Google Cloud Console에서 Places API 키를 생성하고 .env 파일에 GOOGLE_PLACES_API_KEY로 설정하세요.');
    console.log('🔗 https://console.cloud.google.com/apis/credentials');
    process.exit(1);
  }
  
  await connectDB();
  await updateAllRestaurantPhotos();
  
  console.log('스크립트 완료');
  process.exit(0);
};

// 스크립트 실행
runScript().catch(error => {
  console.error('스크립트 실행 오류:', error);
  process.exit(1);
});