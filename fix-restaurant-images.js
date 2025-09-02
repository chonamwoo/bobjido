require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./server/models/Restaurant');

// 카테고리별 실제 음식 이미지 URL
const categoryImages = {
  '한식': [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop', // 김치찌개
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&h=600&fit=crop', // 불고기
    'https://images.unsplash.com/photo-1580651614950-0bbc5f8a3e3e?w=800&h=600&fit=crop', // 비빔밥
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&h=600&fit=crop', // 삼겹살
    'https://images.unsplash.com/photo-1583224994076-ae951d0 19c7e?w=800&h=600&fit=crop'  // 김밥
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop', // 짜장면
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop', // 탕수육
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop', // 마라탕
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&h=600&fit=crop', // 딤섬
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop'  // 볶음밥
  ],
  '일식': [
    'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=600&fit=crop', // 초밥
    'https://images.unsplash.com/photo-1564436872-f6d81182df12?w=800&h=600&fit=crop', // 라멘
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop', // 돈카츠
    'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800&h=600&fit=crop', // 우동
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'  // 스시
  ],
  '양식': [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', // 스테이크
    'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=800&h=600&fit=crop', // 파스타
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', // 피자
    'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=800&h=600&fit=crop', // 햄버거
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop'  // 샐러드
  ],
  '카페': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop', // 커피
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop', // 케이크
    'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=800&h=600&fit=crop', // 브런치
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop', // 라떼
    'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&h=600&fit=crop'  // 디저트
  ],
  '패스트푸드': [
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=600&fit=crop', // 햄버거
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop', // 피자
    'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=800&h=600&fit=crop', // 치킨
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&h=600&fit=crop', // 프라이
    'https://images.unsplash.com/photo-1623174479496-0914bdb03612?w=800&h=600&fit=crop'  // 핫도그
  ],
  '디저트': [
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop', // 아이스크림
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop', // 케이크
    'https://images.unsplash.com/photo-1517093728432-a0440f8d45af?w=800&h=600&fit=crop', // 마카롱
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop', // 도넛
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop'  // 쿠키
  ],
  '주점': [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop', // 바
    'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&h=600&fit=crop', // 맥주
    'https://images.unsplash.com/photo-1536638317175-32449ceccf71?w=800&h=600&fit=crop', // 칵테일
    'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=800&h=600&fit=crop', // 포차
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop'  // 와인바
  ]
};

// 기본 이미지 (카테고리가 없는 경우)
const defaultImages = [
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop'
];

async function updateRestaurantImages() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('Connected to MongoDB');

    // 모든 레스토랑 가져오기
    const restaurants = await Restaurant.find({});
    console.log(`Found ${restaurants.length} restaurants to update`);

    let updatedCount = 0;
    
    for (const restaurant of restaurants) {
      // 카테고리에 맞는 이미지 배열 선택
      const imagePool = categoryImages[restaurant.category] || defaultImages;
      
      // 랜덤하게 이미지 선택
      const randomImage = imagePool[Math.floor(Math.random() * imagePool.length)];
      
      // 이미지 업데이트
      restaurant.images = [{
        url: randomImage,
        isMain: true
      }];
      
      await restaurant.save();
      updatedCount++;
      
      console.log(`Updated ${restaurant.name} with new image`);
    }

    console.log(`\nSuccessfully updated ${updatedCount} restaurants with proper images`);
    
  } catch (error) {
    console.error('Error updating restaurant images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// 스크립트 실행
updateRestaurantImages();