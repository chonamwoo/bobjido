const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');
require('dotenv').config();

const playlists = [
  {
    title: '퇴근 후 강남역 혼술 성지',
    description: '혼자서도 편하게 즐길 수 있는 강남역 술집들',
    category: '혼밥',
    tags: ['혼술', '강남', '퇴근후', '술집', '혼자'],
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
    isPublic: true,
    restaurants: [
      { name: '강남면옥', address: '서울 강남구 테헤란로 123', category: '한식', priceRange: '보통', coordinates: { lat: 37.5010, lng: 127.0396 }, averageRating: 4.7 },
      { name: '육전식당', address: '서울 강남구 강남대로 456', category: '한식', priceRange: '비싼', coordinates: { lat: 37.4995, lng: 127.0276 }, averageRating: 4.8 },
      { name: '스시오마카세', address: '서울 강남구 선릉로 789', category: '일식', priceRange: '매우비싼', coordinates: { lat: 37.5020, lng: 127.0250 }, averageRating: 4.9 },
      { name: '강남 와인바', address: '서울 강남구 테헤란로 234', category: '주점', priceRange: '비싼', coordinates: { lat: 37.5005, lng: 127.0285 }, averageRating: 4.6 },
      { name: '골목 포차', address: '서울 강남구 역삼로 567', category: '주점', priceRange: '보통', coordinates: { lat: 37.4985, lng: 127.0295 }, averageRating: 4.5 }
    ]
  },
  {
    title: '홍대 새벽 3시 야식 투어',
    description: '새벽까지 영업하는 홍대 맛집 모음',
    category: '맛집투어',
    tags: ['홍대', '야식', '심야', '새벽', '24시'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    isPublic: true,
    restaurants: [
      { name: '홍대닭갈비', address: '서울 마포구 와우산로 123', category: '한식', priceRange: '보통', coordinates: { lat: 37.5563, lng: 126.9240 }, averageRating: 4.6 },
      { name: '24시 설렁탕', address: '서울 마포구 홍익로 456', category: '한식', priceRange: '저렴한', coordinates: { lat: 37.5549, lng: 126.9235 }, averageRating: 4.4 },
      { name: '심야식당', address: '서울 마포구 어울마당로 789', category: '일식', priceRange: '보통', coordinates: { lat: 37.5571, lng: 126.9252 }, averageRating: 4.7 },
      { name: '홍대 곱창', address: '서울 마포구 양화로 234', category: '한식', priceRange: '비싼', coordinates: { lat: 37.5558, lng: 126.9245 }, averageRating: 4.8 },
      { name: '늦은밤 국수', address: '서울 마포구 서교동 567', category: '패스트푸드', priceRange: '저렴한', coordinates: { lat: 37.5566, lng: 126.9238 }, averageRating: 4.3 }
    ]
  },
  {
    title: '을지로 힙스터 술집 리스트',
    description: '요즘 핫한 을지로 숨은 술집들',
    category: '맛집투어',
    tags: ['을지로', '힙지로', '술집', '핫플', '숨은맛집'],
    coverImage: 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=800',
    isPublic: true,
    restaurants: [
      { name: '을지로포차', address: '서울 중구 을지로 456', category: '주점', priceRange: '저렴한', coordinates: { lat: 37.5660, lng: 126.9910 }, averageRating: 4.5 },
      { name: '힙지로술집', address: '서울 중구 삼일대로 789', category: '주점', priceRange: '보통', coordinates: { lat: 37.5668, lng: 126.9924 }, averageRating: 4.7 }
    ]
  },
  {
    title: '성수동 데이트 코스 완벽 가이드',
    description: '브런치부터 디너까지 성수동 데이트 코스',
    category: '데이트코스',
    tags: ['성수동', '데이트', '브런치', '카페', '디너'],
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    isPublic: true,
    restaurants: [
      { name: '성수브런치', address: '서울 성동구 서울숲로 123', category: '카페', priceRange: '비싼', coordinates: { lat: 37.5445, lng: 127.0557 }, averageRating: 4.6 },
      { name: '카페온더플랜트', address: '서울 성동구 성수이로 456', category: '카페', priceRange: '보통', coordinates: { lat: 37.5451, lng: 127.0564 }, averageRating: 4.7 },
      { name: '성수디너', address: '서울 성동구 뚝섬로 789', category: '양식', priceRange: '매우비싼', coordinates: { lat: 37.5438, lng: 127.0571 }, averageRating: 4.8 }
    ]
  },
  {
    title: '이태원 세계음식 여행',
    description: '이태원에서 떠나는 세계 미식 투어',
    category: '맛집투어',
    tags: ['이태원', '세계음식', '외국음식', '이국적', '다국적'],
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    isPublic: true,
    restaurants: [
      { name: '터키케밥', address: '서울 용산구 이태원로 123', category: '기타', priceRange: '보통', coordinates: { lat: 37.5341, lng: 126.9854 }, averageRating: 4.5 },
      { name: '멕시칸타코', address: '서울 용산구 녹사평대로 456', category: '기타', priceRange: '보통', coordinates: { lat: 37.5335, lng: 126.9861 }, averageRating: 4.6 },
      { name: '인도커리하우스', address: '서울 용산구 우사단로 789', category: '기타', priceRange: '비싼', coordinates: { lat: 37.5328, lng: 126.9868 }, averageRating: 4.7 }
    ]
  },
  {
    title: '망원시장 먹거리 탐방',
    description: '망원시장과 주변 숨은 맛집들',
    category: '맛집투어',
    tags: ['망원', '시장', '먹거리', '전통시장', '로컬'],
    coverImage: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
    isPublic: true,
    restaurants: [
      { name: '망원떡볶이', address: '서울 마포구 망원로 123', category: '패스트푸드', priceRange: '저렴한', coordinates: { lat: 37.5556, lng: 126.9019 }, averageRating: 4.4 },
      { name: '시장닭강정', address: '서울 마포구 포은로 456', category: '패스트푸드', priceRange: '저렴한', coordinates: { lat: 37.5549, lng: 126.9026 }, averageRating: 4.5 },
      { name: '망원칼국수', address: '서울 마포구 희우정로 789', category: '한식', priceRange: '저렴한', coordinates: { lat: 37.5542, lng: 126.9033 }, averageRating: 4.3 }
    ]
  },
  {
    title: '성시경이 극찬한 서울 맛집',
    description: '먹을텐데에 나온 성시경 추천 맛집',
    category: '맛집투어',
    tags: ['성시경', '먹을텐데', '방송맛집', '연예인맛집', '셀럽추천'],
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    isPublic: true,
    restaurants: [
      { name: '성시경파스타', address: '서울 강남구 도산대로 123', category: '양식', priceRange: '비싼', coordinates: { lat: 37.5172, lng: 127.0473 }, averageRating: 4.8 },
      { name: '성시경갈비집', address: '서울 종로구 삼일대로 456', category: '한식', priceRange: '매우비싼', coordinates: { lat: 37.5704, lng: 126.9898 }, averageRating: 4.9 },
      { name: '성시경단골집', address: '서울 마포구 연남로 789', category: '한식', priceRange: '보통', coordinates: { lat: 37.5627, lng: 126.9255 }, averageRating: 4.7 }
    ]
  },
  {
    title: '백종원의 3대천왕 맛집',
    description: '백종원이 인정한 진짜 맛집들',
    category: '맛집투어',
    tags: ['백종원', '3대천왕', '방송맛집', '맛있는녀석들', '백선생'],
    coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    isPublic: true,
    restaurants: [
      { name: '3대천왕국밥', address: '서울 중구 명동길 123', category: '한식', priceRange: '저렴한', coordinates: { lat: 37.5636, lng: 126.9869 }, averageRating: 4.6 },
      { name: '백종원짜장면', address: '서울 영등포구 여의대로 456', category: '중식', priceRange: '저렴한', coordinates: { lat: 37.5219, lng: 126.9245 }, averageRating: 4.5 },
      { name: '3대족발', address: '서울 종로구 종로 789', category: '한식', priceRange: '보통', coordinates: { lat: 37.5702, lng: 126.9847 }, averageRating: 4.7 }
    ]
  },
  {
    title: '맛있는 녀석들 서울 투어',
    description: '맛있는 녀석들이 다녀간 서울 맛집',
    category: '맛집투어',
    tags: ['맛있는녀석들', '유민상', '김준현', '문세윤', '방송맛집'],
    coverImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
    isPublic: true,
    restaurants: [
      { name: '맛녀석삼겹살', address: '서울 종로구 대학로 123', category: '한식', priceRange: '보통', coordinates: { lat: 37.5827, lng: 127.0028 }, averageRating: 4.6 },
      { name: '맛녀석해물탕', address: '서울 강남구 봉은사로 456', category: '한식', priceRange: '비싼', coordinates: { lat: 37.5138, lng: 127.0565 }, averageRating: 4.7 },
      { name: '맛녀석치킨', address: '서울 서초구 서초대로 789', category: '패스트푸드', priceRange: '보통', coordinates: { lat: 37.4947, lng: 127.0276 }, averageRating: 4.5 }
    ]
  },
  {
    title: '쯔양이 완판시킨 무한리필',
    description: '대식가 쯔양이 인정한 무한리필 맛집',
    category: '맛집투어',
    tags: ['쯔양', '무한리필', '먹방', '대식가', '유튜버맛집'],
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    isPublic: true,
    restaurants: [
      { name: '무한리필고기', address: '서울 구로구 디지털로 123', category: '한식', priceRange: '보통', coordinates: { lat: 37.4846, lng: 126.9016 }, averageRating: 4.4 },
      { name: '쯔양초밥', address: '서울 송파구 올림픽로 456', category: '일식', priceRange: '비싼', coordinates: { lat: 37.5145, lng: 127.1059 }, averageRating: 4.6 },
      { name: '대왕김밥', address: '서울 노원구 동일로 789', category: '패스트푸드', priceRange: '저렴한', coordinates: { lat: 37.6542, lng: 127.0568 }, averageRating: 4.3 }
    ]
  },
  {
    title: '연남동 브런치 카페 투어',
    description: '주말 브런치 맛집 총정리',
    category: '카페투어',
    tags: ['연남동', '브런치', '카페', '주말', '연트럴파크'],
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    isPublic: true,
    restaurants: [
      { name: '연남브런치', address: '서울 마포구 연남로 123', category: '카페', priceRange: '비싼', coordinates: { lat: 37.5627, lng: 126.9255 }, averageRating: 4.6 },
      { name: '주말카페', address: '서울 마포구 동교로 456', category: '카페', priceRange: '보통', coordinates: { lat: 37.5632, lng: 126.9261 }, averageRating: 4.5 },
      { name: '연남베이커리', address: '서울 마포구 성미산로 789', category: '카페', priceRange: '보통', coordinates: { lat: 37.5638, lng: 126.9267 }, averageRating: 4.7 }
    ]
  },
  {
    title: '한남동 미슐랭 레스토랑',
    description: '한남동 파인다이닝 완벽 가이드',
    category: '맛집투어',
    tags: ['한남동', '미슐랭', '파인다이닝', '고급', '특별한날'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    isPublic: true,
    restaurants: [
      { name: '미슐랭프렌치', address: '서울 용산구 독서당로 123', category: '양식', priceRange: '매우비싼', coordinates: { lat: 37.5346, lng: 127.0104 }, averageRating: 4.9 },
      { name: '한남스테이크', address: '서울 용산구 한남대로 456', category: '양식', priceRange: '매우비싼', coordinates: { lat: 37.5352, lng: 127.0110 }, averageRating: 4.8 },
      { name: '이탈리안다이닝', address: '서울 용산구 이태원로 789', category: '양식', priceRange: '매우비싼', coordinates: { lat: 37.5358, lng: 127.0116 }, averageRating: 4.7 }
    ]
  }
];

async function seedPlaylists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://masonchon:cksal0705@cluster0.w91ha.mongodb.net/bobmap?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB 연결 성공');

    // 기존 플레이리스트 삭제
    await Playlist.deleteMany({});
    console.log('기존 플레이리스트 삭제 완료');

    // admin 사용자 찾기 또는 생성
    let adminUser = await User.findOne({ email: 'admin@bobmap.com' });
    if (!adminUser) {
      adminUser = await User.create({
        username: 'BobMap',
        email: 'admin@bobmap.com',
        password: 'admin123!',
        tasteProfile: {
          type: 'comfort_lover',
          preferences: {
            spicyLevel: 3,
            sweetLevel: 3,
            priceRange: 3
          }
        },
        trustScore: 100
      });
      console.log('Admin 사용자 생성 완료');
    }

    // 플레이리스트 생성
    for (const playlistData of playlists) {
      // 맛집들 먼저 생성
      const restaurantIds = [];
      let orderIndex = 0;
      for (const restaurantData of playlistData.restaurants) {
        let restaurant = await Restaurant.findOne({ 
          name: restaurantData.name, 
          address: restaurantData.address 
        });
        
        if (!restaurant) {
          restaurant = await Restaurant.create({
            ...restaurantData,
            createdBy: adminUser._id,
            images: [{ 
              url: `https://source.unsplash.com/800x600/?food,${encodeURIComponent(restaurantData.category)}`,
              isMain: true 
            }],
            reviewCount: Math.floor(Math.random() * 100) + 10,
            viewCount: Math.floor(Math.random() * 1000) + 100
          });
        }
        
        restaurantIds.push({
          restaurant: restaurant._id,
          addedAt: new Date(),
          reason: `${playlistData.title}에 포함된 추천 맛집`,
          order: orderIndex++
        });
      }

      // 플레이리스트 생성
      const playlist = await Playlist.create({
        title: playlistData.title,
        description: playlistData.description,
        category: playlistData.category,
        tags: playlistData.tags,
        coverImage: playlistData.coverImage,
        isPublic: playlistData.isPublic,
        createdBy: adminUser._id,
        restaurants: restaurantIds,
        likeCount: Math.floor(Math.random() * 500) + 50,
        views: Math.floor(Math.random() * 5000) + 500
      });

      console.log(`✅ 플레이리스트 생성: ${playlist.title}`);
    }

    console.log('🎉 모든 플레이리스트 시딩 완료!');
    process.exit(0);
  } catch (error) {
    console.error('시딩 실패:', error);
    process.exit(1);
  }
}

seedPlaylists();