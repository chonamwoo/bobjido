const mongoose = require('mongoose');
const User = require('./server/models/User');
const Restaurant = require('./server/models/Restaurant');
const Playlist = require('./server/models/Playlist');
require('dotenv').config();

// 카테고리별 맛집 데이터
const restaurantsByCategory = {
  korean: [
    { name: '진주회관', category: '한식', address: '서울 중구 세종대로11길 26', priceRange: '보통', rating: 4.7 },
    { name: '명동교자', category: '한식', address: '서울 중구 명동10길 29', priceRange: '보통', rating: 4.5 },
    { name: '곰바위', category: '한식', address: '서울 강남구 도산대로67길 17', priceRange: '비싼', rating: 4.8 },
    { name: '북창손두부', category: '한식', address: '서울 중구 북창동 104-7', priceRange: '저렴한', rating: 4.3 },
    { name: '육회자매집', category: '한식', address: '서울 마포구 백범로1길 5', priceRange: '보통', rating: 4.6 }
  ],
  chinese: [
    { name: '홍콩반점', category: '중식', address: '서울 중구 퇴계로 67', priceRange: '보통', rating: 4.4 },
    { name: '야래향', category: '중식', address: '서울 강남구 테헤란로83길 25', priceRange: '비싼', rating: 4.7 },
    { name: '샤오바오', category: '중식', address: '서울 용산구 이태원로 253', priceRange: '보통', rating: 4.5 },
    { name: '목란', category: '중식', address: '서울 중구 명동길 43', priceRange: '비싼', rating: 4.6 }
  ],
  japanese: [
    { name: '미도인', category: '일식', address: '서울 강남구 봉은사로4길 17', priceRange: '매우비싼', rating: 4.9 },
    { name: '하코야', category: '일식', address: '서울 용산구 이태원로54길 28', priceRange: '비싼', rating: 4.6 },
    { name: '스시효', category: '일식', address: '서울 강남구 도산대로53길 11', priceRange: '매우비싼', rating: 4.8 },
    { name: '라멘히로시', category: '일식', address: '서울 마포구 와우산로29다길 11', priceRange: '보통', rating: 4.5 }
  ],
  western: [
    { name: '브레드메스타', category: '양식', address: '서울 용산구 이태원로27가길 46', priceRange: '보통', rating: 4.5 },
    { name: '라뜰리에', category: '양식', address: '서울 강남구 선릉로158길 11', priceRange: '매우비싼', rating: 4.8 },
    { name: '비스트로드욘트빌', category: '양식', address: '서울 강남구 도산대로67길 14', priceRange: '비싼', rating: 4.6 },
    { name: '더플레이스', category: '양식', address: '서울 중구 소공로 106', priceRange: '비싼', rating: 4.4 }
  ],
  cafe: [
    { name: '블루보틀', category: '카페', address: '서울 강남구 압구정로10길 26', priceRange: '보통', rating: 4.3 },
    { name: '앤트러사이트', category: '카페', address: '서울 용산구 이태원로240', priceRange: '보통', rating: 4.5 },
    { name: '커피리브레', category: '카페', address: '서울 마포구 성미산로 161-10', priceRange: '저렴한', rating: 4.7 },
    { name: '테라로사', category: '카페', address: '서울 강남구 강남대로102길 34', priceRange: '보통', rating: 4.4 }
  ],
  fastfood: [
    { name: '피자헛', category: '패스트푸드', address: '서울 강남구 테헤란로 142', priceRange: '보통', rating: 4.2 },
    { name: '도미노피자', category: '패스트푸드', address: '서울 마포구 양화로 165', priceRange: '보통', rating: 4.1 },
    { name: '버거킹', category: '패스트푸드', address: '서울 중구 명동길 53', priceRange: '저렴한', rating: 4.0 },
    { name: '맥도날드', category: '패스트푸드', address: '서울 강남구 강남대로 452', priceRange: '저렴한', rating: 4.1 },
    { name: 'KFC', category: '패스트푸드', address: '서울 종로구 종로 94', priceRange: '보통', rating: 4.2 }
  ],
  dessert: [
    { name: '설빙', category: '디저트', address: '서울 중구 명동8가길 23', priceRange: '저렴한', rating: 4.2 },
    { name: '레이어드', category: '디저트', address: '서울 강남구 논현로175길 82', priceRange: '보통', rating: 4.6 },
    { name: '도레도레', category: '디저트', address: '서울 마포구 독막로9길 28', priceRange: '보통', rating: 4.5 },
    { name: '카페노티드', category: '디저트', address: '서울 강남구 도산대로51길 20', priceRange: '보통', rating: 4.7 }
  ]
};

// 카테고리별 이미지 URL
const categoryImages = {
  '한식': [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800'
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800'
  ],
  '일식': [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800'
  ],
  '양식': [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800'
  ],
  '카페': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
  ],
  '패스트푸드': [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800'
  ],
  '디저트': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'
  ]
};

async function seedUserRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 모든 사용자 조회
    const users = await User.find({});
    console.log(`${users.length}명의 사용자 찾음`);

    for (const user of users) {
      console.log(`\n사용자 ${user.username}의 데이터 생성 중...`);

      // 사용자별 맛집 리스트 생성 (3-5개)
      const numPlaylists = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numPlaylists; i++) {
        // 랜덤 카테고리 선택
        const categories = Object.keys(restaurantsByCategory);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const categoryRestaurants = restaurantsByCategory[randomCategory];

        // 플레이리스트 제목 생성
        const playlistTitles = {
          korean: ['나의 한식 맛집', '전통 한식 베스트', '한식 소울푸드'],
          chinese: ['중식당 탐방', '짜장면 맛집 모음', '마라탕 성지순례'],
          japanese: ['일식 맛집 리스트', '라멘 투어', '스시 오마카세'],
          western: ['양식 레스토랑', '파스타 맛집', '스테이크하우스'],
          cafe: ['카페 투어', '디저트 카페', '브런치 카페'],
          fastfood: ['패스트푸드 맛집', '피자 체인점', '버거 프랜차이즈'],
          dessert: ['디저트 맛집', '빙수 전문점', '케이크 맛집']
        };

        const titleOptions = playlistTitles[randomCategory] || ['맛집 리스트'];
        const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

        // 플레이리스트 카테고리 선택 (카테고리에 따라 적절한 플레이리스트 카테고리 매핑)
        const playlistCategoryMap = {
          korean: '맛집투어',
          chinese: '맛집투어',
          japanese: '맛집투어',
          western: '맛집투어',
          cafe: '카페투어',
          fastfood: '혼밥',
          dessert: '카페투어'
        };

        // 플레이리스트 생성
        const playlist = new Playlist({
          title: `${user.username}의 ${title}`,
          description: `${user.username}님이 추천하는 ${title}입니다.`,
          category: playlistCategoryMap[randomCategory] || '기타',
          coverImage: categoryImages[categoryRestaurants[0].category] ? categoryImages[categoryRestaurants[0].category][0] : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
          createdBy: user._id,
          restaurants: [],
          tags: [randomCategory, '맛집', '추천'],
          isPublic: true,
          likeCount: Math.floor(Math.random() * 50),
          saveCount: Math.floor(Math.random() * 30),
          viewCount: Math.floor(Math.random() * 200)
        });

        // 맛집 추가 (3-5개)
        const numRestaurants = Math.floor(Math.random() * 3) + 3;
        const selectedRestaurants = categoryRestaurants
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(numRestaurants, categoryRestaurants.length));

        let order = 1;
        for (const restaurantData of selectedRestaurants) {
          // 맛집이 이미 존재하는지 확인
          let restaurant = await Restaurant.findOne({ 
            name: restaurantData.name, 
            address: restaurantData.address 
          });

          if (!restaurant) {
            // 새 맛집 생성
            const [lat, lng] = [37.5665 + (Math.random() - 0.5) * 0.1, 126.9780 + (Math.random() - 0.5) * 0.1];
            
            const imageUrls = categoryImages[restaurantData.category] || [];
            restaurant = new Restaurant({
              name: restaurantData.name,
              address: restaurantData.address,
              category: restaurantData.category,
              priceRange: restaurantData.priceRange,
              coordinates: { lat, lng },
              images: imageUrls.map(url => ({
                url: url,
                uploadedBy: user._id,
                uploadedAt: new Date()
              })),
              averageRating: restaurantData.rating,
              reviewCount: Math.floor(Math.random() * 100) + 10,
              phoneNumber: `02-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
              businessHours: {
                monday: { open: '11:00', close: '22:00', isOpen: true },
                tuesday: { open: '11:00', close: '22:00', isOpen: true },
                wednesday: { open: '11:00', close: '22:00', isOpen: true },
                thursday: { open: '11:00', close: '22:00', isOpen: true },
                friday: { open: '11:00', close: '23:00', isOpen: true },
                saturday: { open: '11:00', close: '23:00', isOpen: true },
                sunday: { open: '11:00', close: '21:00', isOpen: true }
              },
              tags: [restaurantData.category],
              features: ['주차가능', '예약가능', '배달가능'].filter(() => Math.random() > 0.5),
              createdBy: user._id
            });

            await restaurant.save();
          }

          // 플레이리스트에 맛집 추가
          playlist.restaurants.push({
            restaurant: restaurant._id,
            addedBy: user._id,
            reason: `${restaurantData.category} 중에서 최고입니다!`,
            addedAt: new Date(),
            order: order++
          });
        }

        await playlist.save();
        console.log(`  - 플레이리스트 생성: ${playlist.title}`);
      }

      // 사용자 플레이리스트 카운트 업데이트
      user.playlistCount = numPlaylists;
      user.visitedRestaurantsCount = Math.floor(Math.random() * 100) + 20;
      await user.save();
    }

    console.log('\n✅ 사용자 맛집 데이터 생성 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

seedUserRestaurants();