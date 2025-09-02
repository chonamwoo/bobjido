const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');
require('dotenv').config();

// 더 다양한 플레이리스트 커버 이미지 (카테고리별 10개 이상)
const playlistImages = {
  '데이트코스': [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // 로맨틱 레스토랑
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800', // 캔들라이트 디너
    'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800', // 와인과 파스타
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800', // 분위기 있는 카페
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // 고급 레스토랑
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800', // 루프탑 다이닝
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800', // 예쁜 디저트
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', // 브런치 데이트
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', // 커플 디너
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800', // 테라스 카페
  ],
  '혼밥': [
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', // 혼자 먹는 버거
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800', // 라멘
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800', // 일본식 정식
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800', // 혼밥 김밥
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800', // 샌드위치
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800', // 혼자 카페
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', // 돈부리
    'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800', // 1인 피자
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800', // 간단한 식사
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800', // 패스트푸드
  ],
  '가족모임': [
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800', // 한정식
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', // 바베큐
    'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800', // 가족 외식
    'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=800', // 한식 상차림
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800', // 레스토랑 테이블
    'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=800', // 대가족 모임
    'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=800', // 전통 음식
    'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800', // 가족 단체석
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // 한식당
    'https://images.unsplash.com/photo-1517456837005-d757b959ae2b?w=800', // 중화요리
  ],
  '친구모임': [
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800', // 친구들과 피자
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', // 파티 음식
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // 술집
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800', // 치킨과 맥주
    'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=800', // 그룹 다이닝
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', // 포차
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // BBQ 파티
    'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800', // 이자카야
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800', // 단체 모임
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', // 파티룸
  ],
  '카페투어': [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', // 라떼 아트
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', // 카페 인테리어
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800', // 브런치 카페
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', // 디저트 카페
    'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800', // 아늑한 카페
    'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800', // 커피 로스터리
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', // 스페셜티 커피
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800', // 북카페
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800', // 베이커리 카페
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', // 테라스 카페
  ],
  '맛집투어': [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // 맛집 외관
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', // 길거리 음식
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', // 현지 맛집
    'https://images.unsplash.com/photo-1584178639036-613ba57e5e39?w=800', // 전통 맛집
    'https://images.unsplash.com/photo-1560053608-13721e0d69e8?w=800', // 숨은 맛집
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // 노포
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // 미슐랭
    'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800', // 맛집 탐방
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800', // 로컬 맛집
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', // 줄서는 집
  ],
  '회식': [
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800', // 고기집
    'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800', // 회식 테이블
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', // 단체 룸
    'https://images.unsplash.com/photo-1562113546-baf3e43dc1d48?w=800', // 한식당
    'https://images.unsplash.com/photo-1581954904847-8e5e52820be3?w=800', // 술집 분위기
    'https://images.unsplash.com/photo-1553163147-622ab57be156?w=800', // 삼겹살집
    'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800', // 회 전문점
    'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800', // 대형 식당
    'https://images.unsplash.com/photo-1558030006-450675393462?w=800', // 치킨집
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // BBQ
  ],
  '브런치': [
    'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800', // 에그 베네딕트
    'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800', // 팬케이크
    'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=800', // 아보카도 토스트
    'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800', // 브런치 플레이트
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // 풀 브렉퍼스트
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800', // 프렌치 토스트
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800', // 브런치 카페
    'https://images.unsplash.com/photo-1459789034005-ba29c5783491?w=800', // 와플
    'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=800', // 베이글
    'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800', // 스무디볼
  ],
  '야식': [
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=800', // 치킨
    'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=800', // 족발
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', // 피자
    'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800', // 라면
    'https://images.unsplash.com/photo-1583224994076-ae951d019af7?w=800', // 떡볶이
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800', // 보쌈
    'https://images.unsplash.com/photo-1609501676063-e0fb3c5e8f0f?w=800', // 포장마차
    'https://images.unsplash.com/photo-1562967915-92ae0c320a01?w=800', // 곱창
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800', // 햄버거
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800', // 짜파게티
  ]
};

// 카테고리별 맛집 추가 이유 템플릿 (더 구체적이고 다양하게)
const reasonTemplates = {
  '한식': {
    '맛집투어': [
      '{restaurant}의 {signature}은(는) 정말 최고예요',
      '{restaurant}에서 먹은 {dish}가 아직도 생각나요',
      '진짜 한국의 맛을 느끼려면 {restaurant} 강추',
      '{restaurant}는 현지인들이 줄서서 먹는 진짜 맛집',
      '3대째 이어온 {restaurant}의 비법 레시피',
      '{restaurant}의 반찬만 먹어도 밥 한 공기 뚝딱'
    ],
    '가족모임': [
      '{restaurant}는 어른들도 만족하는 정통 한식',
      '가족 모임엔 역시 {restaurant}가 최고',
      '{restaurant}의 한정식은 부모님이 좋아하세요',
      '온 가족이 좋아하는 {restaurant}의 메뉴',
      '{restaurant}는 넓은 룸이 있어 가족모임에 최적',
      '할머니가 해주시던 맛이 나는 {restaurant}'
    ],
    '혼밥': [
      '{restaurant}는 혼자서도 편하게 먹을 수 있어요',
      '1인 메뉴가 잘 되어있는 {restaurant}',
      '빠르게 식사하기 좋은 {restaurant}',
      '{restaurant}는 혼밥러들의 성지',
      '{restaurant}의 바 테이블에서 편하게 혼밥',
      '혼자 가도 눈치 안 보이는 {restaurant}'
    ]
  },
  '중식': {
    '맛집투어': [
      '{restaurant}의 불맛은 정말 예술이에요',
      '화교가 운영하는 {restaurant}는 진짜 중국맛',
      '{restaurant}의 수타면은 쫄깃함이 일품',
      '마라 매니아라면 {restaurant} 필수',
      '{restaurant}는 현지 맛 그대로 재현',
      '짜장면 맛집하면 역시 {restaurant}'
    ],
    '친구모임': [
      '{restaurant}는 여럿이서 나눠먹기 좋아요',
      '코스요리로 즐기는 {restaurant}',
      '{restaurant}는 단체 예약하기 좋은 곳',
      '시끌벅적한 분위기의 {restaurant}',
      '{restaurant}에서 다양한 요리를 맛보세요',
      '친구들과 {restaurant}의 마라탕 도전!'
    ],
    '회식': [
      '{restaurant}는 회식하기 좋은 룸이 있어요',
      '술과 잘 어울리는 {restaurant}의 요리',
      '{restaurant}는 대규모 단체도 수용 가능',
      '직장인들이 자주 찾는 {restaurant}',
      '{restaurant}의 가성비 좋은 코스 메뉴',
      '회식 2차로 {restaurant}의 양꼬치'
    ]
  },
  '일식': {
    '맛집투어': [
      '{restaurant}는 일본 현지 맛 그대로',
      '신선한 재료만 사용하는 {restaurant}',
      '{restaurant}의 오마카세는 예약 필수',
      '일본인 셰프가 운영하는 {restaurant}',
      '숨은 보석같은 {restaurant}',
      '{restaurant}의 스시는 입에서 녹아요'
    ],
    '데이트코스': [
      '{restaurant}는 분위기 좋은 일식 다이닝',
      '조용하고 로맨틱한 {restaurant}',
      '{restaurant}의 프라이빗한 공간',
      '특별한 날엔 {restaurant}',
      '{restaurant}는 야경이 보이는 일식당',
      '프로포즈하기 좋은 {restaurant}'
    ],
    '혼밥': [
      '{restaurant}의 스시 카운터에서 혼자 즐기기',
      '런치 세트가 잘 되어있는 {restaurant}',
      '{restaurant}의 돈부리는 빠른 식사에 좋아요',
      '혼자서도 눈치 안 보이는 {restaurant}',
      '{restaurant}는 1인 오마카세 가능',
      '조용히 혼밥하기 좋은 {restaurant}'
    ]
  },
  '양식': {
    '데이트코스': [
      '{restaurant}는 와인과 함께 즐기기 좋아요',
      '캔들라이트 디너는 {restaurant}에서',
      '분위기 있는 {restaurant}',
      '{restaurant}는 프로포즈 장소로도 인기',
      '커플석이 따로 있는 {restaurant}',
      '{restaurant}의 코스 요리는 특별한 날에'
    ],
    '맛집투어': [
      '{restaurant}의 본격 나폴리 피자',
      '수제 파스타 전문점 {restaurant}',
      '미슐랭 가이드 선정 {restaurant}',
      '{restaurant}는 현지 셰프가 운영',
      '예약 필수인 {restaurant}',
      '{restaurant}의 스테이크는 최고'
    ],
    '브런치': [
      '{restaurant}의 브런치 메뉴는 인스타 감성',
      '주말 브런치는 {restaurant}에서',
      '{restaurant}의 에그 베네딕트 강추',
      '팬케이크가 맛있는 {restaurant}',
      '{restaurant}는 브런치 세트가 알차요',
      '분위기 좋은 {restaurant}에서 브런치'
    ]
  },
  '카페': {
    '카페투어': [
      '{restaurant}는 스페셜티 커피 전문',
      '로스터리 카페 {restaurant}',
      '{restaurant}의 디저트는 꼭 먹어봐야 해요',
      '인테리어가 예쁜 {restaurant}',
      '{restaurant}는 루프탑이 있어요',
      '사진 찍기 좋은 {restaurant}'
    ],
    '데이트코스': [
      '{restaurant}는 조용한 분위기',
      '테라스가 예쁜 {restaurant}',
      '{restaurant}에서 보는 야경',
      '프라이빗한 공간의 {restaurant}',
      '{restaurant}는 포토존이 많아요',
      '커플들이 좋아하는 {restaurant}'
    ],
    '혼밥': [
      '{restaurant}는 노트북 작업하기 좋아요',
      '혼자 책 읽기 좋은 {restaurant}',
      '{restaurant}는 조용한 1인석이 있어요',
      '브런치도 먹을 수 있는 {restaurant}',
      '{restaurant}는 24시간 운영',
      '혼자 시간 보내기 좋은 {restaurant}'
    ]
  },
  '패스트푸드': {
    '혼밥': [
      '{restaurant}에서 빠르게 한 끼',
      '키오스크로 편하게 주문하는 {restaurant}',
      '{restaurant}는 혼자서도 부담 없어요',
      '테이크아웃하기 편한 {restaurant}',
      '{restaurant}는 24시간 운영',
      '급할 때는 {restaurant}'
    ],
    '친구모임': [
      '{restaurant}는 가성비 좋은 세트',
      '다양한 메뉴의 {restaurant}',
      '{restaurant}에서 편하게 수다',
      '늦은 시간까지 영업하는 {restaurant}',
      '{restaurant}는 단체 주문 편리',
      '학생들이 좋아하는 {restaurant}'
    ],
    '야식': [
      '{restaurant}는 야식으로 최고',
      '배달 빠른 {restaurant}',
      '{restaurant}의 세트 메뉴 강추',
      '술안주로도 좋은 {restaurant}',
      '새벽에도 열려있는 {restaurant}',
      '야식엔 역시 {restaurant}'
    ]
  },
  '디저트': {
    '카페투어': [
      '{restaurant}의 시그니처 디저트',
      '수제 마카롱은 {restaurant}',
      '{restaurant}의 케이크는 예술',
      '계절 한정 메뉴가 있는 {restaurant}',
      '{restaurant}는 인스타 핫플',
      '디저트 맛집 {restaurant}'
    ],
    '데이트코스': [
      '{restaurant}에서 달콤한 데이트',
      '애프터눈 티는 {restaurant}',
      '분위기 있는 {restaurant}',
      '{restaurant}의 커플 세트',
      '선물용 디저트도 있는 {restaurant}',
      '특별한 날엔 {restaurant}'
    ]
  },
  '분식': {
    '맛집투어': [
      '{restaurant}의 떡볶이는 전설',
      '줄서서 먹는 {restaurant}',
      '{restaurant}는 40년 전통',
      '김밥 맛집 {restaurant}',
      '{restaurant}의 순대는 최고',
      '학창시절 추억의 {restaurant}'
    ],
    '혼밥': [
      '{restaurant}에서 간단히 한 끼',
      '혼자 먹기 좋은 {restaurant}',
      '{restaurant}는 1인분도 OK',
      '빠른 식사는 {restaurant}',
      '{restaurant}의 김밥 추천',
      '가성비 최고 {restaurant}'
    ],
    '야식': [
      '{restaurant}의 떡볶이는 야식 필수',
      '포장 가능한 {restaurant}',
      '{restaurant}는 늦게까지 영업',
      '매운 걸 땡길 때 {restaurant}',
      '{restaurant}의 튀김도 맛있어요',
      '야식엔 {restaurant} 떡볶이'
    ]
  }
};

// 시그니처 메뉴 예시
const signatureDishes = {
  '한식': ['김치찌개', '된장찌개', '갈비탕', '냉면', '비빔밥', '삼계탕', '불고기', '갈비', '잡채', '전'],
  '중식': ['짜장면', '짬뽕', '탕수육', '마파두부', '깐풍기', '양장피', '팔보채', '유린기', '마라탕', '훠궈'],
  '일식': ['스시', '사시미', '라멘', '우동', '돈부리', '가라아게', '돈카츠', '오코노미야끼', '타코야키', '덴푸라'],
  '양식': ['파스타', '피자', '스테이크', '리조또', '샐러드', '수프', '햄버거', '샌드위치', '그라탕', '라자냐'],
  '카페': ['아메리카노', '라떼', '카푸치노', '플랫화이트', '케이크', '마카롱', '크로플', '베이글', '샌드위치', '브런치'],
  '패스트푸드': ['버거', '치킨', '피자', '핫도그', '타코', '샌드위치', '감자튀김', '너겟', '콜라', '아이스크림'],
  '디저트': ['케이크', '마카롱', '타르트', '푸딩', '젤라또', '와플', '크레페', '도넛', '쿠키', '브라우니'],
  '분식': ['떡볶이', '김밥', '순대', '튀김', '어묵', '라면', '만두', '쫄면', '라볶이', '김치볶음밥']
};

// 랜덤하게 적절한 이유 선택하는 함수 (더 구체적으로)
function getReasonForRestaurant(restaurant, playlistCategory) {
  const restaurantCategory = restaurant.category;
  const reasons = reasonTemplates[restaurantCategory]?.[playlistCategory];
  
  if (reasons && reasons.length > 0) {
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    const dishes = signatureDishes[restaurantCategory] || ['특별 메뉴'];
    const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
    
    // 템플릿 문자열 치환
    return randomReason
      .replace(/{restaurant}/g, restaurant.name)
      .replace(/{signature}/g, randomDish)
      .replace(/{dish}/g, randomDish);
  }
  
  // 기본 이유 (더 다양하게)
  const defaultReasons = [
    `${restaurant.name}의 시그니처 메뉴가 최고예요`,
    `${restaurant.name}는 언제 가도 실망시키지 않아요`,
    `${restaurant.name}의 분위기가 정말 좋아요`,
    `${restaurant.name}는 가성비가 최고입니다`,
    `${restaurant.name}의 서비스가 일품이에요`,
    `${restaurant.name}는 재방문 의사 100%`,
    `${restaurant.name}에서 먹은 음식이 아직도 생각나요`,
    `${restaurant.name}는 웨이팅해도 아깝지 않아요`,
    `${restaurant.name}의 음식은 정성이 느껴져요`,
    `${restaurant.name}는 숨은 맛집이에요`
  ];
  
  return defaultReasons[Math.floor(Math.random() * defaultReasons.length)];
}

// 플레이리스트별 이미지 선택 함수 (순환하면서 다양하게)
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

    let imageIndex = {};

    for (const playlist of playlists) {
      // 카테고리별 이미지 인덱스 관리 (다양한 이미지 사용)
      if (!imageIndex[playlist.category]) {
        imageIndex[playlist.category] = 0;
      }
      
      // 플레이리스트 카테고리에 맞는 이미지 업데이트
      const newCoverImage = getPlaylistImage(playlist.category, imageIndex[playlist.category]++);
      playlist.coverImage = newCoverImage;

      // 각 레스토랑의 추가 이유 업데이트 (더 구체적으로)
      for (let i = 0; i < playlist.restaurants.length; i++) {
        const restaurantItem = playlist.restaurants[i];
        if (restaurantItem.restaurant) {
          const restaurant = restaurantItem.restaurant;
          const newReason = getReasonForRestaurant(restaurant, playlist.category);
          playlist.restaurants[i].reason = newReason;
        }
      }

      await playlist.save();
      console.log(`✅ 업데이트: ${playlist.title} (이미지 인덱스: ${imageIndex[playlist.category] - 1})`);
    }

    console.log('\n✅ 모든 플레이리스트 업데이트 완료!');
    console.log('이미지 사용 통계:', imageIndex);
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

updatePlaylistsContent();