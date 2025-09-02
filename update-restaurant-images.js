const mongoose = require('mongoose');
require('dotenv').config();

// 카테고리별 음식 이미지 URL
const foodImages = {
  '한식': [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', // 김치찌개
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800', // 비빔밥
    'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=800', // 불고기
    'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800', // 삼겹살
    'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800', // 갈비
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', // 짜장면
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', // 짬뽕
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800', // 탕수육
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', // 중국요리
  ],
  '일식': [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', // 스시
    'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800', // 라멘
    'https://images.unsplash.com/photo-1564489969458-5a01c9d5bdf1?w=800', // 우동
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', // 일본요리
  ],
  '양식': [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // 스테이크
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800', // 파스타
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', // 햄버거
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', // 피자
  ],
  '분식': [
    'https://images.unsplash.com/photo-1607370720782-8d84562dbf51?w=800', // 떡볶이
    'https://images.unsplash.com/photo-1590301157284-ab2f8707bdc1?w=800', // 김밥
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800', // 튀김
  ],
  '카페': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', // 커피
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', // 디저트
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // 카페
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800', // 케이크
  ],
  '브런치': [
    'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=800', // 브런치
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800', // 샌드위치
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800', // 토스트
  ],
  '술집': [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // 바
    'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800', // 맥주
    'https://images.unsplash.com/photo-1536638317175-32449deccfc0?w=800', // 와인
  ],
  '이자카야': [
    'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=800', // 이자카야
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', // 사케
  ],
  '디저트': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800', // 케이크
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', // 마카롱
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800', // 아이스크림
  ],
  '베이커리': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', // 빵
    'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800', // 크로와상
  ],
  '바': [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // 칵테일바
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', // 칵테일
  ],
  '포차': [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', // 포차
    'https://images.unsplash.com/photo-1608949621244-aa2c34858acc?w=800', // 안주
  ],
  '사찰음식': [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // 채식
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800', // 사찰음식
  ],
  '비건': [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // 샐러드
    'https://images.unsplash.com/photo-1540914124281-342587941389?w=800', // 비건
  ],
  '채식뷔페': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', // 뷔페
  ],
  // 기본값
  'default': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // 일반 음식
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', // 그릴요리  
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // 파인다이닝
  ]
};

function getRandomImages(category, count = 3) {
  // 카테고리별 이미지 선택
  let images = foodImages[category] || foodImages.default;
  
  // 카테고리 키워드로 매칭 시도
  for (const key in foodImages) {
    if (category.includes(key)) {
      images = foodImages[key];
      break;
    }
  }
  
  // 랜덤하게 이미지 선택
  const selectedImages = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * images.length);
    selectedImages.push({
      url: images[randomIndex],
      uploadedAt: new Date()
    });
  }
  
  return selectedImages;
}

async function updateRestaurantImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Restaurant = require('./server/models/Restaurant');
    
    // 모든 레스토랑 가져오기
    const restaurants = await Restaurant.find({});
    console.log(`📸 ${restaurants.length}개 레스토랑의 이미지 업데이트 시작...`);
    
    let updateCount = 0;
    
    for (const restaurant of restaurants) {
      // 카테고리에 맞는 음식 이미지 3개 선택
      const newImages = getRandomImages(restaurant.category, 3);
      
      restaurant.images = newImages;
      await restaurant.save();
      
      updateCount++;
      console.log(`  ✅ [${updateCount}/${restaurants.length}] ${restaurant.name} - ${restaurant.category} 이미지 업데이트`);
    }
    
    console.log(`\n✅ 총 ${updateCount}개 레스토랑 이미지 업데이트 완료!`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

updateRestaurantImages();