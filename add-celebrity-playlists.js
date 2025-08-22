require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');

// 성시경 먹을텐데 맛집 리스트
const sungSiKyungRestaurants = [
  {
    name: '평양면옥',
    address: '서울 중구 장충단로 207',
    category: '한식',
    description: '성시경이 극찬한 평양냉면 맛집',
    tags: ['냉면', '평양냉면', '만두'],
    personalNote: '성시경이 "인생 냉면집"이라고 극찬한 곳. 육수가 깔끔하고 면발이 쫄깃함',
    mustTry: ['평양냉면', '만두']
  },
  {
    name: '을지로 골뱅이',
    address: '서울 중구 을지로12길 6',
    category: '한식',
    description: '성시경이 자주 찾는 골뱅이 무침 맛집',
    tags: ['골뱅이', '안주', '을지로'],
    personalNote: '성시경이 먹을텐데에서 소개한 을지로 숨은 맛집. 골뱅이 무침이 일품',
    mustTry: ['골뱅이무침', '계란말이']
  },
  {
    name: '광화문 국밥',
    address: '서울 종로구 새문안로3길 9',
    category: '한식',
    description: '성시경이 추천한 든든한 국밥집',
    tags: ['국밥', '순대국', '해장'],
    personalNote: '성시경이 "아침에 먹기 좋은 국밥"이라고 추천. 국물이 진하고 깔끔함',
    mustTry: ['순대국밥', '수육']
  },
  {
    name: '성수동 베이커리',
    address: '서울 성동구 성수이로 100',
    category: '카페',
    description: '성시경이 인정한 빵 맛집',
    tags: ['베이커리', '크로와상', '커피'],
    personalNote: '성시경이 "크로와상이 정말 맛있다"고 극찬한 베이커리',
    mustTry: ['크로와상', '아메리카노']
  },
  {
    name: '이태원 파스타',
    address: '서울 용산구 이태원로 145',
    category: '양식',
    description: '성시경이 단골로 다니는 파스타집',
    tags: ['파스타', '이탈리안', '와인'],
    personalNote: '성시경이 먹을텐데에서 "진짜 이탈리아 맛"이라고 소개한 곳',
    mustTry: ['까르보나라', '아라비아따']
  }
];

// 마츠다 부장 맛집 리스트
const matsudaRestaurants = [
  {
    name: '스시 오마카세 긴자',
    address: '서울 강남구 압구정로60길 21',
    category: '일식',
    description: '마츠다 부장이 극찬한 오마카세',
    tags: ['스시', '오마카세', '일식'],
    personalNote: '마츠다 부장이 "도쿄 수준의 스시"라고 인정한 오마카세',
    mustTry: ['오마카세 코스', '사케']
  },
  {
    name: '라멘 하카타',
    address: '서울 마포구 와우산로 48',
    category: '일식',
    description: '마츠다 부장이 추천하는 돈코츠 라멘',
    tags: ['라멘', '돈코츠', '일본'],
    personalNote: '마츠다 부장이 "일본 현지 맛 그대로"라고 극찬한 라멘집',
    mustTry: ['돈코츠라멘', '차슈동']
  },
  {
    name: '이자카야 노포',
    address: '서울 종로구 돈화문로11길 12',
    category: '일식',
    description: '마츠다 부장의 단골 이자카야',
    tags: ['이자카야', '사케', '안주'],
    personalNote: '마츠다 부장이 회식 때마다 가는 정통 이자카야. 분위기가 일본 현지 그대로',
    mustTry: ['야키토리', '사케']
  },
  {
    name: '우동 전문점',
    address: '서울 중구 을지로3길 5',
    category: '일식',
    description: '마츠다 부장이 인정한 우동 맛집',
    tags: ['우동', '일식', '면요리'],
    personalNote: '마츠다 부장이 "쫄깃한 면발이 일품"이라고 추천한 우동집',
    mustTry: ['가케우동', '튀김우동']
  },
  {
    name: '돈카츠 명가',
    address: '서울 서초구 강남대로 365',
    category: '일식',
    description: '마츠다 부장이 추천하는 돈카츠',
    tags: ['돈카츠', '일식', '튀김'],
    personalNote: '마츠다 부장이 "바삭함과 촉촉함의 조화"라고 극찬한 돈카츠 전문점',
    mustTry: ['로스카츠', '히레카츠']
  }
];

async function addCelebrityPlaylists() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chonamwoo08:Whskadnr09!@cluster0.zdacm.mongodb.net/bobmap?retryWrites=true&w=majority');
    console.log('MongoDB 연결 성공');

    // 시스템 사용자 찾기 또는 생성
    let systemUser = await User.findOne({ email: 'system@bobmap.com' });
    if (!systemUser) {
      systemUser = await User.create({
        username: 'BobMap',
        email: 'system@bobmap.com',
        password: 'system123!@#',
        tasteProfile: {
          preferredCategories: ['한식', '일식', '양식'],
          tasteType: '미식가'
        }
      });
      console.log('시스템 사용자 생성됨');
    }

    // 1. 성시경의 먹을텐데 플레이리스트 생성
    let sungSiKyungPlaylist = await Playlist.findOne({ 
      title: { $regex: '성시경.*먹을텐데', $options: 'i' }
    });

    if (!sungSiKyungPlaylist) {
      // 레스토랑 생성 또는 찾기
      const sungSiKyungRestaurantIds = [];
      
      for (const restaurantData of sungSiKyungRestaurants) {
        let restaurant = await Restaurant.findOne({ 
          name: restaurantData.name,
          address: restaurantData.address 
        });

        if (!restaurant) {
          restaurant = await Restaurant.create({
            ...restaurantData,
            coordinates: {
              lat: 37.5665 + Math.random() * 0.1,
              lng: 126.9780 + Math.random() * 0.1
            },
            priceRange: '보통',
            images: [{
              url: `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop&q=85`,
              uploadedBy: systemUser._id
            }],
            createdBy: systemUser._id,
            averageRating: 4.5 + Math.random() * 0.5,
            reviewCount: Math.floor(Math.random() * 500) + 100
          });
        }

        sungSiKyungRestaurantIds.push({
          restaurant: restaurant._id,
          personalNote: restaurantData.personalNote,
          mustTry: restaurantData.mustTry,
          addedAt: new Date(),
          order: sungSiKyungRestaurantIds.length + 1
        });
      }

      // 플레이리스트 생성
      sungSiKyungPlaylist = await Playlist.create({
        title: "성시경의 먹을텐데 맛집 컬렉션",
        description: "가수 성시경이 먹을텐데에서 극찬한 맛집들을 모았습니다. 믿고 먹는 성시경 픽!",
        category: "맛집투어",
        tags: ['성시경', '먹을텐데', '연예인맛집', '방송맛집', '셀럽추천'],
        restaurants: sungSiKyungRestaurantIds,
        coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=85',
        isPublic: true,
        createdBy: systemUser._id,
        estimatedCost: {
          min: 20000,
          max: 50000,
          perPerson: true
        },
        likes: [],
        saves: [],
        viewCount: Math.floor(Math.random() * 5000) + 1000
      });

      console.log('✅ 성시경의 먹을텐데 플레이리스트 생성 완료');
    } else {
      console.log('성시경의 먹을텐데 플레이리스트가 이미 존재합니다');
    }

    // 2. 마츠다 부장 맛집 플레이리스트 생성
    let matsudaPlaylist = await Playlist.findOne({ 
      title: { $regex: '마츠다.*부장', $options: 'i' }
    });

    if (!matsudaPlaylist) {
      // 레스토랑 생성 또는 찾기
      const matsudaRestaurantIds = [];
      
      for (const restaurantData of matsudaRestaurants) {
        let restaurant = await Restaurant.findOne({ 
          name: restaurantData.name,
          address: restaurantData.address 
        });

        if (!restaurant) {
          restaurant = await Restaurant.create({
            ...restaurantData,
            coordinates: {
              lat: 37.5665 + Math.random() * 0.1,
              lng: 126.9780 + Math.random() * 0.1
            },
            priceRange: '비싼',
            images: [{
              url: `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop&q=85`,
              uploadedBy: systemUser._id
            }],
            createdBy: systemUser._id,
            averageRating: 4.6 + Math.random() * 0.4,
            reviewCount: Math.floor(Math.random() * 300) + 50
          });
        }

        matsudaRestaurantIds.push({
          restaurant: restaurant._id,
          personalNote: restaurantData.personalNote,
          mustTry: restaurantData.mustTry,
          addedAt: new Date(),
          order: matsudaRestaurantIds.length + 1
        });
      }

      // 플레이리스트 생성
      matsudaPlaylist = await Playlist.create({
        title: "마츠다 부장의 일본 정통 맛집",
        description: "일본인 마츠다 부장이 인정한 서울의 진짜 일본 맛집. 현지인이 추천하는 정통 일식당!",
        category: "맛집투어",
        tags: ['마츠다부장', '일식', '일본맛집', '정통일식', '현지인추천'],
        restaurants: matsudaRestaurantIds,
        coverImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=85',
        isPublic: true,
        createdBy: systemUser._id,
        estimatedCost: {
          min: 30000,
          max: 100000,
          perPerson: true
        },
        likes: [],
        saves: [],
        viewCount: Math.floor(Math.random() * 3000) + 500
      });

      console.log('✅ 마츠다 부장 맛집 플레이리스트 생성 완료');
    } else {
      console.log('마츠다 부장 맛집 플레이리스트가 이미 존재합니다');
    }

    // 3. 유명인이 방문한 맛집 플레이리스트 확인/업데이트
    let celebrityPlaylist = await Playlist.findOne({ 
      title: { $regex: '유명인.*방문', $options: 'i' }
    });

    if (!celebrityPlaylist) {
      // 모든 유명인 맛집 레스토랑 ID 수집
      const allCelebrityRestaurants = [];
      
      // 성시경 맛집 추가
      if (sungSiKyungPlaylist) {
        allCelebrityRestaurants.push(...sungSiKyungPlaylist.restaurants.slice(0, 3));
      }
      
      // 마츠다 부장 맛집 추가
      if (matsudaPlaylist) {
        allCelebrityRestaurants.push(...matsudaPlaylist.restaurants.slice(0, 2));
      }

      celebrityPlaylist = await Playlist.create({
        title: "유명인이 방문한 맛집",
        description: "성시경, 마츠다 부장 등 유명인들이 극찬한 맛집 모음. TV와 유튜브에서 화제가 된 그 맛집들!",
        category: "맛집투어",
        tags: ['유명인맛집', '연예인맛집', '방송맛집', '성시경', '마츠다부장'],
        restaurants: allCelebrityRestaurants,
        coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
        isPublic: true,
        createdBy: systemUser._id,
        estimatedCost: {
          min: 20000,
          max: 80000,
          perPerson: true
        },
        likes: [],
        saves: [],
        viewCount: Math.floor(Math.random() * 10000) + 5000
      });

      console.log('✅ 유명인이 방문한 맛집 플레이리스트 생성 완료');
    } else {
      console.log('유명인이 방문한 맛집 플레이리스트가 이미 존재합니다');
    }

    console.log('\n모든 플레이리스트 생성 완료!');

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB 연결 종료');
  }
}

// 스크립트 실행
addCelebrityPlaylists();