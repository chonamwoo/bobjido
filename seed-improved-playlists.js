const mongoose = require('mongoose');
require('dotenv').config();

// 실제 한국 사용자 이름 풀
const koreanUsernames = [
  '김맛집탐험가', '이푸디', '박먹방러', '최미식가', '정맛잘알',
  '강남맛집왕', '서울푸드', '한식당마스터', '윤셰프추천', '장맛집헌터',
  '임요리왕', '송미슐랭', '오맛집큐레이터', '배고픈청년', '문먹스타그램',
  '신맛집노트', '유푸드파이터', '권미식여행', '홍대맛집통', '나혼밥프로',
  '고맛집수집가', '조카페홀릭', '백종원따라잡기', '황금입맛', '서맛집지도'
];

// 플레이리스트 데이터 (이미지 URL과 설명 개선)
const improvedPlaylistsData = [
  {
    title: '유명인이 방문한 맛집',
    description: '연예인, 셰프, 인플루언서들이 직접 방문하고 인증한 맛집들',
    category: '맛집투어',
    tags: ['연예인맛집', '백종원', '성시경', '유명인'],
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // 고급 음식
    createdBy: '백종원따라잡기',
    isPublic: true,
    likeCount: 1234,
    saveCount: 2567,
    viewCount: 15678,
    restaurants: []
  },
  {
    title: '강남 데이트 코스 맛집 10선',
    description: '특별한 날, 특별한 사람과 함께하기 좋은 강남의 분위기 좋은 레스토랑',
    category: '데이트코스',
    tags: ['데이트', '강남', '분위기', '로맨틱'],
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // 고급 레스토랑
    createdBy: '강남맛집왕',
    isPublic: true,
    likeCount: 234,
    saveCount: 567,
    viewCount: 3456
  },
  {
    title: '혼밥하기 좋은 맛집 모음',
    description: '혼자서도 편하게 즐길 수 있는 1인 친화적인 맛집들',
    category: '혼밥',
    tags: ['혼밥', '1인', '편한', '카운터석'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // 카운터 좌석
    createdBy: '나혼밥프로',
    isPublic: true,
    likeCount: 456,
    saveCount: 890,
    viewCount: 5678
  },
  {
    title: '서울 가성비 맛집 TOP 20',
    description: '맛과 가격 모두 만족! 가성비 최고의 맛집 리스트',
    category: '맛집투어',
    tags: ['가성비', '저렴한', '푸짐한', '학생'],
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // 푸짐한 음식
    createdBy: '배고픈청년',
    isPublic: true,
    likeCount: 789,
    saveCount: 1234,
    viewCount: 8901
  },
  {
    title: '인스타 감성 디저트 카페',
    description: '사진 찍기 좋고 맛도 좋은 디저트 카페 모음',
    category: '카페투어',
    tags: ['디저트', '카페', '인스타', '케이크'],
    coverImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', // 디저트
    createdBy: '조카페홀릭',
    isPublic: true,
    likeCount: 567,
    saveCount: 901,
    viewCount: 4567
  },
  {
    title: '금요일 밤 술집 추천',
    description: '한 주를 마무리하며 한잔하기 좋은 분위기 있는 술집',
    category: '친구모임',
    tags: ['술집', '바', '칵테일', '와인'],
    coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // 바/술집
    createdBy: '서울푸드',
    isPublic: true,
    likeCount: 345,
    saveCount: 678,
    viewCount: 3456
  },
  {
    title: '비건/채식 맛집 가이드',
    description: '건강하고 맛있는 비건, 채식 레스토랑 모음',
    category: '기타',
    tags: ['비건', '채식', '건강식', '샐러드'],
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', // 샐러드
    createdBy: '권미식여행',
    isPublic: true,
    likeCount: 234,
    saveCount: 456,
    viewCount: 2345
  },
  {
    title: '브런치 맛집 컬렉션',
    description: '주말 늦은 아침을 특별하게 만들어줄 브런치 레스토랑',
    category: '카페투어',
    tags: ['브런치', '팬케이크', '에그베네딕트', '주말'],
    coverImage: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=800', // 브런치
    createdBy: '문먹스타그램',
    isPublic: true,
    likeCount: 456,
    saveCount: 789,
    viewCount: 4567
  },
  {
    title: '야식 맛집 리스트',
    description: '늦은 시간까지 영업하는 야식 맛집 모음',
    category: '맛집투어',
    tags: ['야식', '24시간', '심야', '배달'],
    coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', // 야식
    createdBy: '유푸드파이터',
    isPublic: true,
    likeCount: 678,
    saveCount: 1012,
    viewCount: 6789
  },
  {
    title: '강남 맛집 완전정복',
    description: '강남 지역 카테고리별 맛집 총정리',
    category: '맛집투어',
    tags: ['강남', '지역맛집', '회식', '모임'],
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // 강남 거리
    createdBy: '강남맛집왕',
    isPublic: true,
    likeCount: 890,
    saveCount: 1345,
    viewCount: 9012
  },
  {
    title: '홍대 맛집 지도',
    description: '홍대, 연남동, 상수 일대 핫플레이스',
    category: '맛집투어',
    tags: ['홍대', '연남동', '힙한', '젊은'],
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800', // 홍대 거리
    createdBy: '홍대맛집통',
    isPublic: true,
    likeCount: 567,
    saveCount: 890,
    viewCount: 5678
  },
  {
    title: '미쉐린 가이드 서울',
    description: '미쉐린 스타를 받은 서울의 파인다이닝 레스토랑',
    category: '맛집투어',
    tags: ['미쉐린', '파인다이닝', '고급', '특별한날'],
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // 고급 요리
    createdBy: '송미슐랭',
    isPublic: true,
    likeCount: 1567,
    saveCount: 2890,
    viewCount: 12345
  },
  {
    title: '회식장소 추천 리스트',
    description: '팀 회식, 단체 모임에 좋은 넓고 분위기 있는 맛집',
    category: '친구모임',
    tags: ['회식', '단체', '고기집', '룸'],
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // 고기
    createdBy: '한식당마스터',
    isPublic: true,
    likeCount: 456,
    saveCount: 789,
    viewCount: 4567
  },
  {
    title: '퇴근 후 한잔 맛집',
    description: '직장인들이 퇴근 후 가볍게 한잔하기 좋은 곳',
    category: '친구모임',
    tags: ['퇴근', '한잔', '직장인', '안주'],
    coverImage: 'https://images.unsplash.com/photo-1536638317175-32449deccfc0?w=800', // 맥주
    createdBy: '서맛집지도',
    isPublic: true,
    likeCount: 567,
    saveCount: 890,
    viewCount: 5678
  },
  {
    title: '주말 데이트 코스',
    description: '주말에 연인과 함께 돌아보기 좋은 맛집 코스',
    category: '데이트코스',
    tags: ['데이트', '주말', '커플', '로맨틱'],
    coverImage: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800', // 로맨틱 디너
    createdBy: '정맛잘알',
    isPublic: true,
    likeCount: 678,
    saveCount: 1012,
    viewCount: 6789
  },
  {
    title: '성수동 핫플레이스',
    description: '성수동의 트렌디한 카페와 레스토랑',
    category: '카페투어',
    tags: ['성수동', '핫플', '트렌디', '카페'],
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // 카페
    createdBy: '최미식가',
    isPublic: true,
    likeCount: 789,
    saveCount: 1234,
    viewCount: 7890
  },
  {
    title: '이태원 맛집 탐방',
    description: '이태원의 다양한 세계 각국 요리 맛집',
    category: '맛집투어',
    tags: ['이태원', '세계요리', '브런치', '이국적'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // 이태원 레스토랑
    createdBy: '오맛집큐레이터',
    isPublic: true,
    likeCount: 456,
    saveCount: 789,
    viewCount: 4567
  },
  {
    title: '종로 노포 맛집',
    description: '오래된 역사와 전통을 자랑하는 종로의 노포들',
    category: '맛집투어',
    tags: ['종로', '노포', '전통', '역사'],
    coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // 전통 음식점
    createdBy: '임요리왕',
    isPublic: true,
    likeCount: 345,
    saveCount: 567,
    viewCount: 3456
  },
  {
    title: '마포구 맛집 지도',
    description: '마포구 전 지역의 숨은 맛집들',
    category: '맛집투어',
    tags: ['마포', '망원', '합정', '상수'],
    coverImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // 마포 음식
    createdBy: '장맛집헌터',
    isPublic: true,
    likeCount: 567,
    saveCount: 890,
    viewCount: 5678
  },
  {
    title: '여의도 점심 맛집',
    description: '여의도 직장인들을 위한 점심 맛집 리스트',
    category: '맛집투어',
    tags: ['여의도', '점심', '직장인', '비즈니스'],
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', // 비즈니스 런치
    createdBy: '황금입맛',
    isPublic: true,
    likeCount: 678,
    saveCount: 1012,
    viewCount: 6789
  }
];

// 레스토랑별 맞춤형 리뷰/추가 이유
const restaurantReasons = {
  '한식': [
    '정갈한 반찬과 집밥 같은 편안한 맛이 일품입니다',
    '어머니 손맛이 느껴지는 진짜 한식당',
    '김치찌개의 깊은 맛이 일품이에요',
    '된장찌개가 정말 구수하고 맛있습니다',
    '제육볶음이 매콤달콤 중독성 있어요'
  ],
  '일식': [
    '신선한 회와 정성스런 스시가 인상적입니다',
    '돈코츠 라멘의 진한 국물이 일품이에요',
    '우동 면발이 쫄깃하고 국물이 시원합니다',
    '사시미 신선도가 최고예요',
    '일본 현지의 맛을 그대로 재현했습니다'
  ],
  '중식': [
    '짜장면이 불맛 가득하고 정말 맛있어요',
    '짬뽕 국물이 시원하고 해산물이 푸짐합니다',
    '탕수육이 바삭하고 소스가 일품이에요',
    '마라탕의 얼얼한 맛이 중독성 있습니다',
    '양꼬치와 칭따오의 조합이 최고예요'
  ],
  '양식': [
    '파스타 면이 알덴테로 완벽하게 삶아졌어요',
    '스테이크 굽기가 완벽하고 부드럽습니다',
    '리조또가 크리미하고 풍미가 좋아요',
    '피자 도우가 쫄깃하고 토핑이 신선합니다',
    '수프가 진하고 빵과 잘 어울려요'
  ],
  '카페': [
    '커피 향이 좋고 디저트가 맛있어요',
    '분위기가 아늑하고 사진 찍기 좋습니다',
    '브런치 메뉴가 다양하고 맛있어요',
    '케이크가 달지 않고 부드러워요',
    '시그니처 음료가 특별하고 맛있습니다'
  ],
  '분식': [
    '떡볶이가 매콤달콤 중독성 있어요',
    '김밥이 속이 꽉 차고 맛있습니다',
    '순대가 쫄깃하고 간이 딱 좋아요',
    '튀김이 바삭하고 기름지지 않아요',
    '라면 국물이 시원하고 면발이 쫄깃해요'
  ],
  '술집': [
    '안주가 푸짐하고 술과 잘 어울려요',
    '분위기가 좋고 친구들과 오기 좋습니다',
    '맥주가 시원하고 종류가 다양해요',
    '칵테일이 예쁘고 맛도 좋아요',
    '와인 셀렉션이 훌륭합니다'
  ],
  '디저트': [
    '마카롱이 쫀득하고 달지 않아 좋아요',
    '빙수가 푸짐하고 시원합니다',
    '와플이 바삭하고 크림이 부드러워요',
    '젤라또가 진짜 이탈리아 맛이에요',
    '크로플이 바삭하고 토핑이 맛있어요'
  ]
};

// 카테고리별 맞는 이유 가져오기
function getReasonForRestaurant(category) {
  // 카테고리를 단순화
  let simplifiedCategory = '한식'; // 기본값
  
  if (category.includes('한식') || category.includes('한정식') || category.includes('사찰')) {
    simplifiedCategory = '한식';
  } else if (category.includes('일식') || category.includes('일본') || category.includes('스시') || category.includes('라멘')) {
    simplifiedCategory = '일식';
  } else if (category.includes('중식') || category.includes('중국')) {
    simplifiedCategory = '중식';
  } else if (category.includes('양식') || category.includes('이탈리') || category.includes('프렌치') || category.includes('스테이크')) {
    simplifiedCategory = '양식';
  } else if (category.includes('카페') || category.includes('브런치') || category.includes('베이커리')) {
    simplifiedCategory = '카페';
  } else if (category.includes('분식')) {
    simplifiedCategory = '분식';
  } else if (category.includes('술') || category.includes('바') || category.includes('포차') || category.includes('이자카야')) {
    simplifiedCategory = '술집';
  } else if (category.includes('디저트')) {
    simplifiedCategory = '디저트';
  }
  
  const reasons = restaurantReasons[simplifiedCategory] || restaurantReasons['한식'];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

async function seedImprovedPlaylists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Playlist = require('./server/models/Playlist');
    const Restaurant = require('./server/models/Restaurant');
    const User = require('./server/models/User');

    // 기존 플레이리스트 모두 삭제
    console.log('🗑️ 기존 플레이리스트 삭제 중...');
    await Playlist.deleteMany({});

    // 사용자 생성 또는 찾기
    const users = [];
    const tasteTypes = ['spicy_adventurer', 'trendy_explorer', 'comfort_lover', 'social_foodie', 
                       'budget_gourmet', 'premium_diner', 'solo_explorer', 'traditional_taste'];
    
    for (const username of koreanUsernames) {
      let user = await User.findOne({ username });
      if (!user) {
        // 영어 알파벳으로 변환된 이메일 생성
        const emailName = `user${Math.floor(Math.random() * 10000)}`;
        user = await User.create({
          username,
          email: `${emailName}@bobmap.com`,
          password: 'password123456',
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=200&font-size=0.4&rounded=true&bold=true`,
          tasteProfile: {
            type: tasteTypes[Math.floor(Math.random() * tasteTypes.length)],
            spicyTolerance: Math.floor(Math.random() * 5) + 1,
            sweetPreference: Math.floor(Math.random() * 5) + 1,
            pricePreference: ['저렴한', '보통', '고급', '상관없음'][Math.floor(Math.random() * 4)]
          },
          onboardingCompleted: true
        });
        console.log(`👤 사용자 "${username}" 생성됨`);
      }
      users.push(user);
    }

    console.log('\n📋 개선된 플레이리스트 생성 중...');
    
    // 기존 레스토랑 가져오기
    const allRestaurants = await Restaurant.find({});
    console.log(`🍽️ ${allRestaurants.length}개의 레스토랑 발견`);

    for (const playlistData of improvedPlaylistsData) {
      // 랜덤 사용자 선택
      const randomUser = users.find(u => u.username === playlistData.createdBy) || users[Math.floor(Math.random() * users.length)];
      
      // 플레이리스트에 맞는 레스토랑 선택 (5-10개)
      const numRestaurants = Math.floor(Math.random() * 6) + 5;
      const selectedRestaurants = [];
      
      for (let i = 0; i < numRestaurants && i < allRestaurants.length; i++) {
        const restaurant = allRestaurants[Math.floor(Math.random() * allRestaurants.length)];
        if (!selectedRestaurants.find(r => r._id.toString() === restaurant._id.toString())) {
          selectedRestaurants.push(restaurant);
        }
      }

      // 플레이리스트 생성
      const playlist = await Playlist.create({
        title: playlistData.title,
        description: playlistData.description,
        category: playlistData.category,
        tags: playlistData.tags,
        coverImage: playlistData.coverImage,
        createdBy: randomUser._id,
        restaurants: selectedRestaurants.map((r, index) => ({
          restaurant: r._id,
          order: index + 1,
          personalNote: getReasonForRestaurant(r.category),
          addedBy: randomUser._id,
          addedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        })),
        isPublic: playlistData.isPublic,
        viewCount: playlistData.viewCount,
        likes: Array(playlistData.likeCount).fill(null).map(() => ({
          user: users[Math.floor(Math.random() * users.length)]._id,
          likedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        })),
        saves: Array(playlistData.saveCount).fill(null).map(() => ({
          user: users[Math.floor(Math.random() * users.length)]._id,
          savedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
        }))
      });

      console.log(`  ✅ "${playlist.title}" by ${randomUser.username} - ${selectedRestaurants.length}개 맛집 추가`);
    }

    console.log('\n✅ 모든 개선된 플레이리스트 생성 완료!');
    
    // 통계 출력
    const totalPlaylists = await Playlist.countDocuments();
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 최종 통계:`);
    console.log(`  - 총 플레이리스트: ${totalPlaylists}개`);
    console.log(`  - 총 사용자: ${totalUsers}명`);
    console.log(`  - 총 레스토랑: ${allRestaurants.length}개`);
    
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedImprovedPlaylists();