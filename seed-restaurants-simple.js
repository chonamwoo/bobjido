const mongoose = require('mongoose');
require('dotenv').config();

// 간단한 맛집 데이터 (Restaurant 모델 스키마에 맞춤)
const restaurantsData = [
  // 데이트 맛집
  {
    name: '정식당',
    category: '한식',
    address: '서울 강남구 선릉로158길 11',
    coordinates: { lat: 37.523437, lng: 127.043891 },
    priceRange: '매우비싼',
    description: '미쉐린 2스타, 모던 한식의 정수',
    phoneNumber: '02-517-4654',
    tags: ['미쉐린', '파인다이닝', '데이트', '특별한날']
  },
  {
    name: '밍글스',
    category: '양식',
    address: '서울 강남구 도산대로67길 19',
    coordinates: { lat: 37.524951, lng: 127.038426 },
    priceRange: '매우비싼',
    description: '한국의 맛을 현대적으로 재해석한 파인다이닝',
    phoneNumber: '02-515-7306',
    tags: ['미쉐린', '컨템포러리', '데이트']
  },
  {
    name: '라망시크레',
    category: '양식',
    address: '서울 강남구 도산대로 318',
    coordinates: { lat: 37.522468, lng: 127.039183 },
    priceRange: '비싼',
    description: '로맨틱한 분위기의 프렌치 비스트로',
    phoneNumber: '02-547-9100',
    tags: ['프렌치', '와인', '데이트']
  },
  {
    name: '스시조',
    category: '일식',
    address: '서울 강남구 언주로153길 10',
    coordinates: { lat: 37.523789, lng: 127.034567 },
    priceRange: '매우비싼',
    description: '도쿄 긴자 본점의 맛을 그대로',
    phoneNumber: '02-3445-1952',
    tags: ['스시', '오마카세', '특별한날']
  },
  {
    name: '테이블 포 포',
    category: '양식',
    address: '서울 강남구 청담동 83-6',
    coordinates: { lat: 37.524123, lng: 127.042567 },
    priceRange: '비싼',
    description: '청담동 숨은 이탈리안 레스토랑',
    phoneNumber: '02-543-4567',
    tags: ['이탈리안', '파스타', '와인']
  },
  
  // 혼밥 맛집
  {
    name: '이치란 라멘 강남',
    category: '일식',
    address: '서울 강남구 강남대로 429',
    coordinates: { lat: 37.502035, lng: 127.026954 },
    priceRange: '보통',
    description: '1인 좌석 완비, 진한 돈코츠 라멘',
    phoneNumber: '02-6203-1947',
    tags: ['라멘', '혼밥', '1인석']
  },
  {
    name: '아비꼬 카레',
    category: '일식',
    address: '서울 종로구 율곡로 56',
    coordinates: { lat: 37.574124, lng: 126.985674 },
    priceRange: '저렴한',
    description: '일본식 카레 전문점, 카운터석 완비',
    phoneNumber: '02-765-5580',
    tags: ['카레', '혼밥', '카운터석']
  },
  {
    name: '육전식당',
    category: '한식',
    address: '서울 마포구 마포대로12길 17',
    coordinates: { lat: 37.549884, lng: 126.954673 },
    priceRange: '보통',
    description: '1인 고기 정식, 혼밥족 성지',
    phoneNumber: '02-332-2255',
    tags: ['고기', '정식', '혼밥']
  },
  
  // 가성비 맛집
  {
    name: '광장시장 마약김밥',
    category: '한식',
    address: '서울 종로구 창경궁로 88',
    coordinates: { lat: 37.570028, lng: 126.999669 },
    priceRange: '저렴한',
    description: '중독성 있는 미니 김밥',
    phoneNumber: '02-2267-0291',
    tags: ['김밥', '시장', '가성비']
  },
  {
    name: '신림동 백순대',
    category: '한식',
    address: '서울 관악구 신림로59길 14',
    coordinates: { lat: 37.484123, lng: 126.929456 },
    priceRange: '저렴한',
    description: '푸짐한 순대국밥',
    phoneNumber: '02-888-5678',
    tags: ['순대', '국밥', '가성비']
  },
  {
    name: '명동교자 본점',
    category: '한식',
    address: '서울 중구 명동10길 29',
    coordinates: { lat: 37.562678, lng: 126.985432 },
    priceRange: '저렴한',
    description: '칼국수와 만두의 정석',
    phoneNumber: '02-776-5348',
    tags: ['칼국수', '만두', '명동']
  },
  
  // 디저트 카페
  {
    name: '도레도레',
    category: '디저트',
    address: '서울 강남구 도산대로49길 39',
    coordinates: { lat: 37.523456, lng: 127.038901 },
    priceRange: '보통',
    description: '수플레 팬케이크 맛집',
    phoneNumber: '02-515-3369',
    tags: ['팬케이크', '디저트', '카페']
  },
  {
    name: '레이어드 성수',
    category: '카페',
    address: '서울 성동구 성수이로7길 51',
    coordinates: { lat: 37.544567, lng: 127.055678 },
    priceRange: '보통',
    description: '성수동 감성 베이커리 카페',
    phoneNumber: '02-461-1945',
    tags: ['베이커리', '카페', '성수동']
  },
  {
    name: '빌리엔젤 케이크',
    category: '디저트',
    address: '서울 강남구 논현로175길 81',
    coordinates: { lat: 37.522345, lng: 127.031234 },
    priceRange: '비싼',
    description: '프리미엄 생크림 케이크',
    phoneNumber: '02-544-0807',
    tags: ['케이크', '디저트', '선물']
  },
  
  // 술집
  {
    name: '찰스 H.',
    category: '주점',
    address: '서울 강남구 도산대로67길 15',
    coordinates: { lat: 37.524678, lng: 127.039012 },
    priceRange: '매우비싼',
    description: '아시아 50베스트 바',
    phoneNumber: '02-542-3141',
    tags: ['칵테일', '바', '50베스트']
  },
  {
    name: '르 챔버',
    category: '주점',
    address: '서울 강남구 선릉로152길 23',
    coordinates: { lat: 37.521234, lng: 127.040567 },
    priceRange: '비싼',
    description: '스피크이지 칵테일 바',
    phoneNumber: '02-6339-3939',
    tags: ['칵테일', '스피크이지', '바']
  },
  {
    name: '믹솔로지 살롱',
    category: '주점',
    address: '서울 중구 을지로 30',
    coordinates: { lat: 37.567890, lng: 126.991234 },
    priceRange: '비싼',
    description: '시그니처 칵테일 전문',
    phoneNumber: '02-2277-5678',
    tags: ['칵테일', '시그니처', '을지로']
  },
  
  // 브런치
  {
    name: '빌즈',
    category: '양식',
    address: '서울 강남구 논현로175길 82',
    coordinates: { lat: 37.522678, lng: 127.030123 },
    priceRange: '비싼',
    description: '호주식 브런치, 리코타 팬케이크',
    phoneNumber: '02-541-1705',
    tags: ['브런치', '팬케이크', '호주']
  },
  {
    name: '더 플라잉 팬 블루',
    category: '양식',
    address: '서울 용산구 이태원로27가길 46',
    coordinates: { lat: 37.532345, lng: 126.994567 },
    priceRange: '보통',
    description: '미국식 브런치 전문',
    phoneNumber: '02-792-1835',
    tags: ['브런치', '이태원', '미국식']
  },
  {
    name: '에그슬럿',
    category: '양식',
    address: '서울 강남구 강남대로 452',
    coordinates: { lat: 37.503456, lng: 127.027890 },
    priceRange: '보통',
    description: 'LA 스타일 에그 샌드위치',
    phoneNumber: '02-6203-2030',
    tags: ['브런치', '샌드위치', '에그']
  },
  
  // 야식
  {
    name: '원조원할머니보쌈',
    category: '한식',
    address: '서울 종로구 대학로8가길 15',
    coordinates: { lat: 37.582345, lng: 127.002345 },
    priceRange: '보통',
    description: '새벽 2시까지, 족발보쌈',
    phoneNumber: '02-747-5859',
    tags: ['보쌈', '족발', '야식']
  },
  {
    name: '용금옥',
    category: '한식',
    address: '서울 마포구 토정로37길 47',
    coordinates: { lat: 37.548901, lng: 126.955678 },
    priceRange: '보통',
    description: '24시간 추어탕',
    phoneNumber: '02-335-1110',
    tags: ['추어탕', '24시간', '야식']
  },
  {
    name: '유가네 닭갈비',
    category: '한식',
    address: '서울 강남구 역삼로 146',
    coordinates: { lat: 37.495678, lng: 127.032345 },
    priceRange: '보통',
    description: '새벽까지 영업하는 닭갈비',
    phoneNumber: '02-568-1990',
    tags: ['닭갈비', '야식', '강남']
  },
  
  // 홍대 맛집
  {
    name: '연남동 감나무집',
    category: '한식',
    address: '서울 마포구 연남로1길 45',
    coordinates: { lat: 37.559012, lng: 126.925678 },
    priceRange: '보통',
    description: '연남동 한정식',
    phoneNumber: '02-332-3394',
    tags: ['한정식', '연남동', '홍대']
  },
  {
    name: '홍대 조폭떡볶이',
    category: '한식',
    address: '서울 마포구 홍익로6길 12',
    coordinates: { lat: 37.554567, lng: 126.924567 },
    priceRange: '저렴한',
    description: '홍대 명물 떡볶이',
    phoneNumber: '02-337-8892',
    tags: ['떡볶이', '홍대', '분식']
  },
  {
    name: '메밀꽃필무렵',
    category: '한식',
    address: '서울 마포구 동교로27길 16',
    coordinates: { lat: 37.558901, lng: 126.923456 },
    priceRange: '보통',
    description: '막걸리와 파전',
    phoneNumber: '02-332-6966',
    tags: ['막걸리', '파전', '전통주']
  }
];

// 플레이리스트별 맛집 인덱스 매핑
const playlistMapping = {
  '강남 데이트 코스 맛집 10선': [0, 1, 2, 3, 4],
  '혼밥하기 좋은 맛집 모음': [5, 6, 7],
  '서울 가성비 맛집 TOP 20': [8, 9, 10],
  '인스타 감성 디저트 카페': [11, 12, 13],
  '금요일 밤 술집 추천': [14, 15, 16],
  '브런치 맛집 컬렉션': [17, 18, 19],
  '야식 맛집 리스트': [20, 21, 22],
  '강남 맛집 완전정복': [0, 1, 3, 4, 22],
  '홍대 맛집 지도': [23, 24, 25],
  '비건/채식 맛집 가이드': [] // 비건 데이터 없음
};

async function seedRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Restaurant = require('./server/models/Restaurant');
    const Playlist = require('./server/models/Playlist');
    const User = require('./server/models/User');

    // 시스템 사용자 찾기
    const systemUser = await User.findOne({ username: 'system' });
    if (!systemUser) {
      console.error('❌ 시스템 사용자를 찾을 수 없습니다');
      process.exit(1);
    }

    // 기존 레스토랑 삭제
    console.log('🗑️ 기존 레스토랑 삭제 중...');
    await Restaurant.deleteMany({});

    // 레스토랑 생성
    console.log('🍽️ 레스토랑 생성 중...');
    const createdRestaurants = [];
    
    for (const data of restaurantsData) {
      const restaurant = await Restaurant.create({
        ...data,
        createdBy: systemUser._id,
        images: [
          { url: `https://picsum.photos/400/300?random=${Math.random()}` },
          { url: `https://picsum.photos/400/300?random=${Math.random()}` },
          { url: `https://picsum.photos/400/300?random=${Math.random()}` }
        ],
        averageRating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 100) + 10,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        likeCount: Math.floor(Math.random() * 100) + 10,
        isVerified: true
      });
      createdRestaurants.push(restaurant);
      console.log(`  ✅ "${restaurant.name}" 생성 완료`);
    }

    // 플레이리스트에 레스토랑 추가
    console.log('\n📋 플레이리스트에 레스토랑 추가 중...');
    const playlists = await Playlist.find({});
    
    for (const playlist of playlists) {
      const restaurantIndices = playlistMapping[playlist.title] || [];
      const restaurantData = [];
      
      for (let i = 0; i < restaurantIndices.length; i++) {
        const index = restaurantIndices[i];
        if (createdRestaurants[index]) {
          restaurantData.push({
            restaurant: createdRestaurants[index]._id,
            order: i + 1,
            addedBy: systemUser._id
          });
        }
      }
      
      if (restaurantData.length > 0) {
        playlist.restaurants = restaurantData;
        playlist.restaurantCount = restaurantData.length;
        await playlist.save();
        console.log(`  ✅ "${playlist.title}"에 ${restaurantData.length}개 맛집 추가`);
      } else {
        console.log(`  ⚠️ "${playlist.title}"에 추가할 맛집 없음`);
      }
    }

    console.log('\n✅ 모든 작업 완료!');
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedRestaurants();