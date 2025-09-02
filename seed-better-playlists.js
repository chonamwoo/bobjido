const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');
require('dotenv').config();

// 다양한 플레이리스트 커버 이미지 모음
const playlistImages = {
  '데이트코스': [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // 로맨틱 레스토랑
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800', // 캔들라이트 디너
    'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800', // 와인과 파스타
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800', // 분위기 있는 카페
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // 고급 레스토랑
  ],
  '혼밥': [
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', // 혼자 먹는 버거
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', // 라멘
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', // 일본식 정식
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800', // 혼밥 김밥
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800', // 샌드위치
  ],
  '가족모임': [
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800', // 한정식
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', // 바베큐
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800', // 가족 외식
    'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=800', // 한식 상차림
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800', // 레스토랑 테이블
  ],
  '친구모임': [
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800', // 친구들과 피자
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', // 파티 음식
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // 술집
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800', // 치킨과 맥주
    'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=800', // 그룹 다이닝
  ],
  '카페투어': [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', // 라떼 아트
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', // 카페 인테리어
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800', // 브런치 카페
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', // 디저트 카페
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800', // 아늑한 카페
  ],
  '맛집투어': [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // 맛집 외관
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', // 길거리 음식
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', // 현지 맛집
    'https://images.unsplash.com/photo-1584178639036-613ba57e5e39?w=800', // 전통 맛집
    'https://images.unsplash.com/photo-1560053608-13721e0d69e8?w=800', // 숨은 맛집
  ],
  '회식': [
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800', // 고기집
    'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800', // 회식 테이블
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', // 단체 룸
    'https://images.unsplash.com/photo-1562113546-b3be43dc1d48?w=800', // 한식당
    'https://images.unsplash.com/photo-1581954904847-8e5e52820be3?w=800', // 술집 분위기
  ]
};

// 카테고리별 맛집 추가 이유 템플릿
const reasonTemplates = {
  '한식': {
    '맛집투어': [
      '진짜 한국의 맛을 느낄 수 있는 곳',
      '어머니 손맛이 그리울 때 찾는 집',
      '전통의 맛을 현대적으로 재해석한 곳',
      '현지인들이 줄서서 먹는 진짜 맛집',
      '3대째 이어온 비법 레시피'
    ],
    '가족모임': [
      '어른들도 만족하는 정통 한식',
      '가족 모임에 딱 좋은 한정식',
      '부모님 모시고 가기 좋은 곳',
      '온 가족이 좋아하는 메뉴',
      '넓은 룸이 있어 가족모임에 최적'
    ],
    '혼밥': [
      '혼자서도 편하게 먹을 수 있는 분위기',
      '1인 메뉴가 잘 되어있는 곳',
      '빠르게 식사하기 좋은 한식당',
      '혼밥러들의 성지',
      '바 테이블이 있어 혼자서도 편해요'
    ]
  },
  '중식': {
    '맛집투어': [
      '화교가 운영하는 정통 중화요리',
      '불맛 제대로 나는 짜장면',
      '수타면의 쫄깃함이 일품',
      '마라 매니아들의 성지',
      '현지 맛 그대로 재현한 곳'
    ],
    '친구모임': [
      '여럿이서 나눠먹기 좋은 메뉴',
      '코스요리로 즐기기 좋은 곳',
      '단체 예약 가능한 중식당',
      '시끌벅적한 분위기가 좋은 곳',
      '다양한 요리를 맛볼 수 있는 곳'
    ],
    '회식': [
      '회식하기 좋은 룸이 있는 곳',
      '술과 잘 어울리는 중화요리',
      '대규모 단체도 수용 가능',
      '직장인들이 자주 찾는 곳',
      '가성비 좋은 코스 메뉴'
    ]
  },
  '일식': {
    '맛집투어': [
      '일본 현지 맛을 그대로',
      '신선한 재료만 사용하는 곳',
      '오마카세 맛집',
      '일본인 셰프가 운영하는 곳',
      '숨은 보석같은 일식당'
    ],
    '데이트코스': [
      '분위기 좋은 일식 다이닝',
      '조용하고 로맨틱한 분위기',
      '프라이빗한 공간이 있는 곳',
      '특별한 날에 가기 좋은 곳',
      '야경이 보이는 일식당'
    ],
    '혼밥': [
      '스시 카운터에서 혼자 즐기기',
      '런치 세트가 잘 되어있는 곳',
      '빠른 식사가 가능한 돈부리',
      '혼자서도 눈치 안 보이는 곳',
      '1인 오마카세 가능'
    ]
  },
  '양식': {
    '데이트코스': [
      '와인과 함께 즐기기 좋은 곳',
      '캔들라이트 디너가 가능한 곳',
      '분위기 있는 이탈리안 레스토랑',
      '프로포즈 장소로도 인기',
      '커플석이 따로 있는 곳'
    ],
    '맛집투어': [
      '본격 나폴리 피자',
      '수제 파스타 전문점',
      '미슐랭 가이드 선정 레스토랑',
      '현지 셰프가 운영하는 곳',
      '예약 필수인 인기 맛집'
    ],
    '친구모임': [
      '브런치 모임하기 좋은 곳',
      '파티 룸이 있는 레스토랑',
      '와인 리스트가 풍부한 곳',
      '다양한 메뉴 선택 가능',
      '인스타 감성 가득한 곳'
    ]
  },
  '카페': {
    '카페투어': [
      '스페셜티 커피 전문점',
      '로스터리 카페',
      '디저트가 맛있기로 유명한 곳',
      '인테리어가 예쁜 카페',
      '루프탑이 있는 카페'
    ],
    '데이트코스': [
      '조용한 분위기의 카페',
      '테라스가 예쁜 곳',
      '야경이 보이는 카페',
      '프라이빗한 공간이 있는 곳',
      '사진 찍기 좋은 포토존'
    ],
    '혼밥': [
      '노트북 작업하기 좋은 카페',
      '혼자 책 읽기 좋은 곳',
      '조용한 1인석이 있는 곳',
      '브런치도 함께 즐길 수 있는 곳',
      '24시간 운영하는 카페'
    ]
  },
  '패스트푸드': {
    '혼밥': [
      '빠르게 한 끼 해결하기',
      '키오스크로 편하게 주문',
      '혼자서도 부담 없는 곳',
      '테이크아웃하기 편한 곳',
      '24시간 운영으로 언제나 가능'
    ],
    '친구모임': [
      '가성비 좋은 세트 메뉴',
      '다양한 메뉴 조합 가능',
      '편하게 수다 떨기 좋은 곳',
      '늦은 시간까지 영업',
      '단체 주문 편리'
    ]
  },
  '디저트': {
    '카페투어': [
      '시그니처 디저트가 있는 곳',
      '수제 마카롱 전문점',
      '케이크가 예술인 곳',
      '계절 한정 메뉴가 있는 곳',
      '인스타 핫플레이스'
    ],
    '데이트코스': [
      '달콤한 디저트 데이트',
      '애프터눈 티 세트',
      '분위기 있는 디저트 카페',
      '커플 세트 메뉴',
      '선물용 디저트도 가능'
    ]
  }
};

// 랜덤하게 적절한 이유 선택하는 함수
function getReasonForRestaurant(restaurantCategory, playlistCategory, restaurantName) {
  const reasons = reasonTemplates[restaurantCategory]?.[playlistCategory];
  
  if (reasons && reasons.length > 0) {
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    return `${restaurantName} - ${randomReason}`;
  }
  
  // 기본 이유
  const defaultReasons = [
    `${restaurantName}의 시그니처 메뉴가 최고예요`,
    `${restaurantName}는 언제 가도 실망시키지 않아요`,
    `${restaurantName}의 분위기가 정말 좋아요`,
    `${restaurantName}는 가성비가 최고입니다`,
    `${restaurantName}의 서비스가 일품이에요`
  ];
  
  return defaultReasons[Math.floor(Math.random() * defaultReasons.length)];
}

// 플레이리스트별 이미지 선택 함수
function getPlaylistImage(category, index = 0) {
  const images = playlistImages[category] || playlistImages['맛집투어'];
  return images[index % images.length];
}

async function updatePlaylistsContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 모든 플레이리스트 조회
    const playlists = await Playlist.find({})
      .populate('restaurants.restaurant')
      .populate('createdBy');

    console.log(`${playlists.length}개의 플레이리스트 발견`);

    let imageIndex = 0;

    for (const playlist of playlists) {
      // 플레이리스트 카테고리에 맞는 이미지 업데이트
      const newCoverImage = getPlaylistImage(playlist.category, imageIndex++);
      playlist.coverImage = newCoverImage;

      // 각 레스토랑의 추가 이유 업데이트
      for (let i = 0; i < playlist.restaurants.length; i++) {
        const restaurantItem = playlist.restaurants[i];
        if (restaurantItem.restaurant) {
          const restaurant = restaurantItem.restaurant;
          const newReason = getReasonForRestaurant(
            restaurant.category, 
            playlist.category, 
            restaurant.name
          );
          playlist.restaurants[i].reason = newReason;
        }
      }

      await playlist.save();
      console.log(`✅ 업데이트: ${playlist.title}`);
    }

    console.log('\n✅ 모든 플레이리스트 업데이트 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

updatePlaylistsContent();