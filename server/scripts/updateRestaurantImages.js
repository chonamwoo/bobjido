const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// 카테고리별 고품질 이미지 URL들
const categoryImages = {
  '한식': [
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop&q=80', // 김치찌개
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&q=80', // 비빔밥
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop&q=80', // 불고기
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop&q=80', // 한식
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563379091339-03246963d94a?w=800&h=600&fit=crop&q=80', // 중식
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=80', // 면
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop&q=80', // 중식요리
  ],
  '일식': [
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&q=80', // 스시
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop&q=80', // 라멘
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80', // 일식
  ],
  '양식': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80', // 피자
    'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&q=80', // 스테이크
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80', // 파스타
  ],
  '카페': [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80', // 커피
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80', // 디저트
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80', // 카페
  ],
  '디저트': [
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&h=600&fit=crop&q=80', // 케이크
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop&q=80', // 아이스크림
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop&q=80', // 디저트
  ],
  '기타': [
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80', // 음식
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80', // 레스토랑
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80', // 식당
  ]
};

async function clearFakeImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('MongoDB 연결 성공');

    // Unsplash 이미지를 사용하는 식당들 찾기 (가짜 이미지)
    const restaurants = await Restaurant.find({ 
      'images.url': { $regex: 'images.unsplash.com' }
    });

    console.log(`가짜 이미지를 사용하는 레스토랑 ${restaurants.length}개 발견`);

    for (const restaurant of restaurants) {
      // 가짜 이미지 제거
      restaurant.images = [];
      await restaurant.save();
      console.log(`${restaurant.name} 가짜 이미지 제거 완료`);
    }

    console.log('가짜 이미지 제거 완료');
    console.log('💡 이제 fetchRealRestaurantPhotos.js 스크립트를 실행해서 실제 사진을 가져오세요.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearFakeImages();