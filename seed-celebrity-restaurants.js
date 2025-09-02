const mongoose = require('mongoose');
require('dotenv').config();

async function seedCelebrityRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Restaurant = require('./server/models/Restaurant');
    const Playlist = require('./server/models/Playlist');
    const User = require('./server/models/User');

    // 관리자 계정 찾기
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('⚠️ admin 계정이 없어 시스템 계정 사용');
      adminUser = await User.findOne({ username: 'system' });
    }
    
    if (!adminUser) {
      console.error('❌ 관리자 계정을 찾을 수 없습니다');
      process.exit(1);
    }

    console.log('👤 관리자 계정 사용:', adminUser.username);

    // 유명인 방문 맛집 데이터
    const celebrityRestaurants = [
      // 성시경의 먹을텐데
      {
        name: '원조쌈밥집',
        category: '한식',
        address: '서울 강동구 천호대로 1006',
        coordinates: { lat: 37.537708, lng: 127.126760 },
        priceRange: '보통',
        description: '성시경이 극찬한 쌈밥 맛집, 제육쌈밥과 오리쌈밥이 유명',
        phoneNumber: '02-474-5567',
        tags: ['성시경', '먹을텐데', '쌈밥', '제육볶음'],
        popularMenu: ['제육쌈밥', '오리쌈밥', '된장찌개'],
        celebrityVisited: ['성시경']
      },
      {
        name: '순희네 빈대떡',
        category: '한식',
        address: '서울 종로구 종로32길 5',
        coordinates: { lat: 37.569972, lng: 126.991080 },
        priceRange: '저렴한',
        description: '성시경의 광장시장 단골집, 바삭한 빈대떡',
        phoneNumber: '02-2267-0883',
        tags: ['성시경', '광장시장', '빈대떡', '육회'],
        popularMenu: ['녹두빈대떡', '육회', '마약김밥'],
        celebrityVisited: ['성시경']
      },
      {
        name: '봉추찜닭',
        category: '한식',
        address: '서울 종로구 종로12길 15',
        coordinates: { lat: 37.570536, lng: 126.985022 },
        priceRange: '보통',
        description: '성시경이 자주 찾는 안동찜닭 맛집',
        phoneNumber: '02-765-4559',
        tags: ['성시경', '찜닭', '안동찜닭'],
        popularMenu: ['안동찜닭', '찜닭볶음밥'],
        celebrityVisited: ['성시경']
      },
      {
        name: '을지로 노가리 골목',
        category: '주점',
        address: '서울 중구 을지로13길 18',
        coordinates: { lat: 37.566321, lng: 126.991856 },
        priceRange: '저렴한',
        description: '성시경이 추천하는 을지로 노가리 골목',
        phoneNumber: '02-2268-9943',
        tags: ['성시경', '노가리', '맥주', '을지로'],
        popularMenu: ['노가리', '오징어', '생맥주'],
        celebrityVisited: ['성시경']
      },

      // 맛있는 녀석들 (마트쓰부장)
      {
        name: '을지로 골뱅이',
        category: '한식',
        address: '서울 중구 을지로 129',
        coordinates: { lat: 37.566420, lng: 126.991356 },
        priceRange: '보통',
        description: '맛있는 녀석들이 극찬한 골뱅이 무침',
        phoneNumber: '02-2272-7745',
        tags: ['맛있는녀석들', '골뱅이', '을지로'],
        popularMenu: ['골뱅이무침', '골뱅이소면', '계란말이'],
        celebrityVisited: ['맛있는녀석들']
      },
      {
        name: '광장시장 육회',
        category: '한식',
        address: '서울 종로구 창경궁로 88',
        coordinates: { lat: 37.570028, lng: 126.999594 },
        priceRange: '보통',
        description: '맛있는 녀석들 육회 맛집',
        phoneNumber: '02-2267-0291',
        tags: ['맛있는녀석들', '육회', '광장시장'],
        popularMenu: ['육회', '육사시미', '연어'],
        celebrityVisited: ['맛있는녀석들']
      },
      {
        name: '평양면옥',
        category: '한식',
        address: '서울 중구 장충단로 207',
        coordinates: { lat: 37.559899, lng: 127.002128 },
        priceRange: '비싼',
        description: '맛있는 녀석들이 인정한 평양냉면',
        phoneNumber: '02-2267-7784',
        tags: ['맛있는녀석들', '평양냉면', '불고기'],
        popularMenu: ['평양냉면', '불고기', '만두'],
        celebrityVisited: ['맛있는녀석들']
      },
      {
        name: '곱창의 전설',
        category: '한식',
        address: '서울 종로구 돈화문로11길 28',
        coordinates: { lat: 37.572134, lng: 126.990234 },
        priceRange: '보통',
        description: '맛있는 녀석들 곱창 맛집',
        phoneNumber: '02-742-5525',
        tags: ['맛있는녀석들', '곱창', '막창'],
        popularMenu: ['모듬곱창', '막창', '볶음밥'],
        celebrityVisited: ['맛있는녀석들']
      },

      // 쯔양
      {
        name: '돈까스클럽',
        category: '일식',
        address: '서울 마포구 어울마당로 35',
        coordinates: { lat: 37.554234, lng: 126.922084 },
        priceRange: '비싼',
        description: '쯔양이 도전한 왕돈까스 맛집',
        phoneNumber: '02-332-3311',
        tags: ['쯔양', '돈까스', '왕돈까스', '먹방'],
        popularMenu: ['왕돈까스', '치즈돈까스', '매운돈까스'],
        celebrityVisited: ['쯔양']
      },
      {
        name: '홍대 무한리필 고기집',
        category: '한식',
        address: '서울 마포구 홍익로 20',
        coordinates: { lat: 37.556901, lng: 126.923629 },
        priceRange: '보통',
        description: '쯔양의 무한리필 도전',
        phoneNumber: '02-338-2299',
        tags: ['쯔양', '무한리필', '삼겹살', '먹방'],
        popularMenu: ['삼겹살 무한리필', '목살 무한리필'],
        celebrityVisited: ['쯔양']
      },
      {
        name: '왕십리 곱창',
        category: '한식',
        address: '서울 성동구 왕십리로 410',
        coordinates: { lat: 37.564087, lng: 127.029404 },
        priceRange: '비싼',
        description: '쯔양이 완판시킨 곱창집',
        phoneNumber: '02-2299-8876',
        tags: ['쯔양', '곱창', '막창', '대창'],
        popularMenu: ['모듬곱창', '막창', '대창'],
        celebrityVisited: ['쯔양']
      },
      {
        name: '신논현 양꼬치',
        category: '중식',
        address: '서울 강남구 강남대로 476',
        coordinates: { lat: 37.504567, lng: 127.025678 },
        priceRange: '보통',
        description: '쯔양이 100인분 먹은 양꼬치집',
        phoneNumber: '02-553-7788',
        tags: ['쯔양', '양꼬치', '양갈비', '먹방'],
        popularMenu: ['양꼬치', '양갈비', '마라탕'],
        celebrityVisited: ['쯔양']
      },

      // 백종원
      {
        name: '종로3가 포장마차',
        category: '한식',
        address: '서울 종로구 종로 125',
        coordinates: { lat: 37.570234, lng: 126.991567 },
        priceRange: '보통',
        description: '백종원이 추천한 포장마차 거리',
        phoneNumber: '02-2277-8899',
        tags: ['백종원', '포장마차', '닭꼬치', '어묵'],
        popularMenu: ['닭꼬치', '어묵', '떡볶이'],
        celebrityVisited: ['백종원']
      },
      {
        name: '을지로 생고기 제작소',
        category: '한식',
        address: '서울 중구 을지로 158',
        coordinates: { lat: 37.566789, lng: 126.993456 },
        priceRange: '비싼',
        description: '백종원의 3대천왕 출연 맛집',
        phoneNumber: '02-2265-0815',
        tags: ['백종원', '생고기', '한우', '3대천왕'],
        popularMenu: ['생갈비', '육회', '한우구이'],
        celebrityVisited: ['백종원']
      }
    ];

    // 레스토랑 저장
    console.log('\n🌟 유명인 방문 맛집 추가 중...');
    const createdRestaurants = [];
    
    for (const restaurantData of celebrityRestaurants) {
      const restaurant = new Restaurant({
        ...restaurantData,
        createdBy: adminUser._id,
        images: [
          { url: `https://picsum.photos/400/300?random=${Math.random()}` },
          { url: `https://picsum.photos/400/300?random=${Math.random()}` }
        ],
        averageRating: 4.3 + Math.random() * 0.6, // 4.3-4.9
        reviewCount: Math.floor(Math.random() * 1000) + 500,
        viewCount: Math.floor(Math.random() * 5000) + 2000,
        likeCount: Math.floor(Math.random() * 500) + 200,
        isVerified: true
      });
      
      await restaurant.save();
      createdRestaurants.push(restaurant);
      console.log(`  ✅ "${restaurant.name}" 추가 완료`);
    }

    // 유명인별 플레이리스트 생성
    console.log('\n📋 유명인 플레이리스트 생성 중...');
    
    const celebrityPlaylists = [
      {
        title: '성시경의 먹을텐데 맛집',
        description: '성시경이 방문하고 극찬한 서울 맛집 모음',
        category: '맛집투어',
        tags: ['성시경', '먹을텐데', '연예인맛집', '방송맛집'],
        isPublic: true,
        restaurantNames: ['원조쌈밥집', '순희네 빈대떡', '봉추찜닭', '을지로 노가리 골목']
      },
      {
        title: '맛있는 녀석들 추천 맛집',
        description: '맛있는 녀석들이 방문한 서울 맛집 리스트',
        category: '맛집투어',
        tags: ['맛있는녀석들', '마트쓰부장', '방송맛집'],
        isPublic: true,
        restaurantNames: ['을지로 골뱅이', '광장시장 육회', '평양면옥', '곱창의 전설']
      },
      {
        title: '쯔양의 대식 도전 맛집',
        description: '먹방 유튜버 쯔양이 도전한 대용량 맛집',
        category: '맛집투어',
        tags: ['쯔양', '먹방', '대식가', '무한리필', '유튜버맛집'],
        isPublic: true,
        restaurantNames: ['돈까스클럽', '홍대 무한리필 고기집', '왕십리 곱창', '신논현 양꼬치']
      },
      {
        title: '백종원 추천 숨은 맛집',
        description: '백종원이 추천한 서울의 숨은 맛집들',
        category: '맛집투어',
        tags: ['백종원', '3대천왕', '골목식당'],
        isPublic: true,
        restaurantNames: ['종로3가 포장마차', '을지로 생고기 제작소']
      }
    ];

    for (const playlistData of celebrityPlaylists) {
      // 플레이리스트에 해당하는 레스토랑 찾기
      const restaurantDocs = [];
      for (const restaurantName of playlistData.restaurantNames) {
        const restaurant = createdRestaurants.find(r => r.name === restaurantName);
        if (restaurant) {
          restaurantDocs.push({
            restaurant: restaurant._id,
            order: restaurantDocs.length + 1,
            addedBy: adminUser._id,
            personalNote: `${playlistData.tags[0]}이(가) 방문한 맛집`,
            mustTry: restaurant.popularMenu || []
          });
        }
      }

      const playlist = new Playlist({
        title: playlistData.title,
        description: playlistData.description,
        category: playlistData.category,
        tags: playlistData.tags,
        isPublic: playlistData.isPublic,
        createdBy: adminUser._id,
        restaurants: restaurantDocs,
        restaurantCount: restaurantDocs.length,
        viewCount: Math.floor(Math.random() * 10000) + 5000,
        likeCount: Math.floor(Math.random() * 1000) + 300,
        saveCount: Math.floor(Math.random() * 500) + 100
      });

      await playlist.save();
      console.log(`  ✅ "${playlist.title}" 생성 완료 (${restaurantDocs.length}개 맛집)`);
    }

    console.log('\n✨ 유명인 맛집 데이터 추가 완료!');
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedCelebrityRestaurants();