require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const User = require('./server/models/User');
const Restaurant = require('./server/models/Restaurant');

const tvShowPlaylists = [
  {
    title: '흑백요리사 맛집',
    description: '넷플릭스 흑백요리사 출연 셰프들의 레스토랑',
    category: '방송맛집',
    tags: ['흑백요리사', '넷플릭스', '셰프추천']
  },
  {
    title: '다이닝코드 숨은맛집',
    description: '다이닝코드가 선정한 진짜 숨은 맛집들',
    category: '큐레이션',
    tags: ['다이닝코드', '숨은맛집', '현지인추천']
  },
  {
    title: '식객 허영만의 백반기행',
    description: '만화 식객 허영만이 다녀간 백반 맛집',
    category: '방송맛집',
    tags: ['식객', '허영만', '백반', '한정식']
  },
  {
    title: '수요미식회',
    description: '수요미식회가 극찬한 맛집 리스트',
    category: '방송맛집',
    tags: ['수요미식회', 'TV맛집', '미식']
  },
  {
    title: '생활의 달인',
    description: 'SBS 생활의 달인에 출연한 장인 맛집',
    category: '방송맛집',
    tags: ['생활의달인', '달인', '장인']
  },
  {
    title: '성시경의 먹을텐데',
    description: '성시경이 추천하는 진짜 맛집',
    category: '셀럽맛집',
    tags: ['성시경', '먹을텐데', '셀럽추천']
  },
  {
    title: '맛있는 녀석들',
    description: '맛있는 녀석들이 방문한 맛집',
    category: '방송맛집',
    tags: ['맛있는녀석들', 'TV맛집']
  },
  {
    title: '백종원의 3대천왕',
    description: '백종원의 3대천왕에 선정된 최강 맛집',
    category: '방송맛집',
    tags: ['백종원', '3대천왕', 'SBS']
  },
  {
    title: '백년가게',
    description: '3대 이상 이어온 전통 백년가게',
    category: '전통맛집',
    tags: ['백년가게', '전통', '3대맛집']
  },
  {
    title: '미쉐린 가이드',
    description: '미쉐린 가이드 선정 레스토랑',
    category: '미쉐린',
    tags: ['미쉐린', '파인다이닝', '고급']
  },
  {
    title: '최자로드',
    description: '최자가 다녀간 맛집 로드',
    category: '셀럽맛집',
    tags: ['최자', '최자로드', '셀럽추천']
  },
  {
    title: '전지적 참견 시점',
    description: '전참시 매니저들이 추천한 맛집',
    category: '방송맛집',
    tags: ['전참시', 'MBC', '매니저추천']
  },
  {
    title: '한국인의 밥상',
    description: 'KBS 한국인의 밥상에 소개된 전통 맛집',
    category: '방송맛집',
    tags: ['한국인의밥상', 'KBS', '전통음식']
  },
  {
    title: '백종원의 골목식당',
    description: '골목식당 솔루션 받은 맛집들',
    category: '방송맛집',
    tags: ['백종원', '골목식당', 'SBS']
  }
];

async function updatePlaylistsWithTVShows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
    
    // 시스템 유저 찾기
    let systemUser = await User.findOne({ username: 'BobMap' });
    if (!systemUser) {
      systemUser = await User.findOne({ username: 'system' });
    }
    
    // 기존 플레이리스트 모두 삭제
    await Playlist.deleteMany({});
    console.log('기존 플레이리스트 삭제 완료');
    
    // 레스토랑 샘플 가져오기
    const restaurants = await Restaurant.find().limit(200);
    console.log(`${restaurants.length}개 레스토랑 로드 완료`);
    
    // TV쇼 플레이리스트 생성
    for (const playlistData of tvShowPlaylists) {
      // 각 플레이리스트에 맞는 레스토랑 선택
      let selectedRestaurants = [];
      
      if (playlistData.title.includes('백종원')) {
        // 백종원 관련: 한식, 중식 위주
        selectedRestaurants = restaurants
          .filter(r => r.category === '한식' || r.category === '중식')
          .slice(0, 8);
      } else if (playlistData.title.includes('미쉐린')) {
        // 미쉐린: 고급 레스토랑
        selectedRestaurants = restaurants
          .filter(r => r.priceRange === '매우비싼' || r.priceRange === '비싼')
          .slice(0, 6);
      } else if (playlistData.title.includes('백반') || playlistData.title.includes('한국인의 밥상')) {
        // 백반, 한식: 전통 한식
        selectedRestaurants = restaurants
          .filter(r => r.category === '한식' && r.priceRange !== '매우비싼')
          .slice(0, 7);
      } else if (playlistData.title.includes('흑백요리사')) {
        // 흑백요리사: 다양한 고급 레스토랑
        selectedRestaurants = restaurants
          .filter(r => r.averageRating >= 4.0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);
      } else {
        // 기타: 랜덤 선택
        selectedRestaurants = restaurants
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
      }
      
      const playlist = new Playlist({
        title: playlistData.title,
        description: playlistData.description,
        category: playlistData.category,
        tags: playlistData.tags,
        createdBy: systemUser._id,
        restaurants: selectedRestaurants.map((r, idx) => ({
          restaurant: r._id,
          order: idx,
          reason: `${playlistData.title}에 소개된 맛집`,
          mustTry: r.tags?.slice(0, 2) || [],
          addedBy: systemUser._id,
          addedAt: new Date()
        })),
        coverImage: `https://images.unsplash.com/photo-${
          Math.random() > 0.5 ? '1504674900247-0877df9cc836' : '1555396273-eb8052c4862a'
        }?w=800&h=600&fit=crop`,
        isPublic: true,
        isPremium: playlistData.title.includes('미쉐린'),
        likeCount: Math.floor(Math.random() * 500) + 50,
        saveCount: Math.floor(Math.random() * 300) + 30,
        shareCount: Math.floor(Math.random() * 100) + 10,
        viewCount: Math.floor(Math.random() * 2000) + 100
      });
      
      await playlist.save();
      console.log(`✓ "${playlistData.title}" 플레이리스트 생성 완료`);
    }
    
    console.log(`\n✅ 총 ${tvShowPlaylists.length}개의 TV쇼 플레이리스트 생성 완료!`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updatePlaylistsWithTVShows();