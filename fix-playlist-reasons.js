const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
require('dotenv').config();

// 카테고리별 & 플레이리스트별 정확한 이유 템플릿
const reasonTemplates = {
  '한식': {
    '맛집투어': [
      '{name}의 김치찌개는 진짜 엄마 손맛',
      '{name}에서 먹은 된장찌개가 최고였어요',
      '{name}의 불고기는 꼭 먹어봐야 해요',
      '{name} 삼겹살은 고기 질이 남다르네요',
      '{name}의 갈비탕 국물이 진국이에요',
      '{name} 냉면은 여름에 최고',
      '{name}의 비빔밥은 재료가 신선해요',
      '{name} 제육볶음은 매콤한게 중독성 있어요',
      '{name}의 김치전은 막걸리랑 완벽해요',
      '{name} 순두부찌개는 얼큰하고 시원해요'
    ],
    '가족모임': [
      '{name}의 한정식은 부모님이 좋아하세요',
      '{name}는 룸이 있어서 가족모임에 좋아요',
      '{name}의 갈비찜은 온 가족이 좋아해요',
      '{name} 보쌈은 가족 외식으로 최고',
      '{name}의 전골 메뉴가 푸짐해요',
      '{name}는 어른들 입맛에 딱이에요',
      '{name}의 불고기 전골은 아이들도 좋아해요',
      '{name} 삼계탕은 보양식으로 좋아요',
      '{name}의 한식 뷔페가 다양해요',
      '{name}는 주차가 편해서 가족모임에 좋아요'
    ],
    '혼밥': [
      '{name}는 1인 메뉴가 잘 되어있어요',
      '{name}의 김치찌개 백반 가성비 최고',
      '{name}에서 혼밥해도 눈치 안 보여요',
      '{name}는 카운터석이 있어 편해요',
      '{name}의 돌솥비빔밥 혼자 먹기 좋아요',
      '{name} 백반 메뉴가 알차요',
      '{name}는 빠르게 나와서 점심에 좋아요',
      '{name}의 국밥은 혼밥 최고 메뉴',
      '{name} 김밥천국 스타일로 편해요',
      '{name}는 24시간이라 언제든 혼밥 가능'
    ],
    '회식': [
      '{name}는 고기 질이 좋아서 회식에 딱',
      '{name}의 단체 룸이 넓어요',
      '{name} 삼겹살에 소주 조합 최고',
      '{name}는 직장인들이 많이 찾아요',
      '{name}의 갈비는 회식 대표 메뉴',
      '{name} 막걸리가 맛있어요',
      '{name}는 2차로 가기 좋은 위치',
      '{name}의 안주 메뉴가 다양해요',
      '{name} 대패삼겹살 무한리필',
      '{name}는 늦게까지 영업해서 회식에 좋아요'
    ],
    '데이트코스': [
      '{name}의 분위기가 로맨틱해요',
      '{name}는 조용해서 대화하기 좋아요',
      '{name}의 한옥 인테리어가 예뻐요',
      '{name} 전통차도 함께 즐길 수 있어요',
      '{name}는 야경이 보이는 자리가 있어요',
      '{name}의 코스 요리가 특별해요',
      '{name} 정원이 아름다워요',
      '{name}는 프라이빗한 공간이 있어요',
      '{name}의 전통 공연도 볼 수 있어요',
      '{name} 한복 대여도 가능해요'
    ]
  },
  '중식': {
    '맛집투어': [
      '{name}의 짜장면은 옛날 맛 그대로',
      '{name} 짬뽕 국물이 시원해요',
      '{name}의 탕수육이 바삭바삭',
      '{name} 마파두부가 정통 중국식',
      '{name}의 깐풍기가 일품이에요',
      '{name} 양장피 소스가 특별해요',
      '{name}의 고추잡채가 매콤달콤',
      '{name} 팔보채가 해산물이 신선해요',
      '{name}의 유린기가 부드러워요',
      '{name} 마라탕은 중독성 있어요'
    ],
    '친구모임': [
      '{name}는 요리를 나눠먹기 좋아요',
      '{name}의 코스 메뉴가 푸짐해요',
      '{name} 중국 술도 다양해요',
      '{name}는 단체 예약이 편해요',
      '{name}의 세트 메뉴가 가성비 좋아요',
      '{name} 개인 룸이 있어요',
      '{name}는 늦게까지 영업해요',
      '{name}의 양이 많아서 나눠먹기 좋아요',
      '{name} 냉면도 맛있어요',
      '{name}는 주차가 편해요'
    ],
    '가족모임': [
      '{name}의 코스요리가 푸짐해요',
      '{name}는 아이들 메뉴도 있어요',
      '{name} 개인 룸이 넓어요',
      '{name}의 요리가 MSG 없이 깔끔해요',
      '{name}는 어른들도 좋아하는 맛',
      '{name}의 중화냉채가 입맛 돋워요',
      '{name} 누룽지탕이 별미에요',
      '{name}는 가족 단위 세트가 있어요',
      '{name}의 딤섬이 다양해요',
      '{name} 북경오리가 특별한 날에 좋아요'
    ]
  },
  '일식': {
    '맛집투어': [
      '{name}의 스시가 신선해요',
      '{name} 사시미가 두툼해요',
      '{name}의 라멘 국물이 진해요',
      '{name} 우동 면발이 쫄깃해요',
      '{name}의 돈카츠가 바삭해요',
      '{name} 돈부리가 푸짐해요',
      '{name}의 덴푸라가 가벼워요',
      '{name} 오코노미야키가 정통이에요',
      '{name}의 가라아게가 육즙 가득',
      '{name} 규동이 부드러워요'
    ],
    '데이트코스': [
      '{name}의 오마카세가 특별해요',
      '{name}는 조용한 분위기가 좋아요',
      '{name}의 개인 룸이 프라이빗해요',
      '{name} 사케 종류가 다양해요',
      '{name}의 카이세키 요리가 예술이에요',
      '{name}는 바 좌석이 로맨틱해요',
      '{name}의 정원 뷰가 아름다워요',
      '{name} 셰프님과 대화도 즐거워요',
      '{name}는 기념일에 가기 좋아요',
      '{name}의 디저트도 특별해요'
    ],
    '혼밥': [
      '{name}의 라멘은 혼밥 최고',
      '{name} 돈부리 세트가 알차요',
      '{name}는 카운터석이 편해요',
      '{name}의 정식 메뉴가 가성비 좋아요',
      '{name} 우동이 빨리 나와요',
      '{name}는 1인 오마카세도 가능해요',
      '{name}의 벤또가 깔끔해요',
      '{name} 카레가 든든해요',
      '{name}는 혼밥족이 많아요',
      '{name}의 런치 세트가 인기'
    ]
  },
  '양식': {
    '데이트코스': [
      '{name}의 파스타가 알덴테로 완벽해요',
      '{name}는 와인 리스트가 훌륭해요',
      '{name}의 스테이크가 부드러워요',
      '{name} 리조또가 크리미해요',
      '{name}의 분위기가 로맨틱해요',
      '{name}는 야경이 멋져요',
      '{name}의 코스 메뉴가 구성이 좋아요',
      '{name} 디저트가 예술이에요',
      '{name}는 프로포즈 하기 좋아요',
      '{name}의 셰프 추천 메뉴가 특별해요'
    ],
    '브런치': [
      '{name}의 에그 베네딕트가 최고',
      '{name} 팬케이크가 폭신해요',
      '{name}의 프렌치 토스트가 달콤해요',
      '{name} 아보카도 토스트가 건강해요',
      '{name}의 브런치 플레이트가 푸짐해요',
      '{name}는 커피도 맛있어요',
      '{name}의 스무디볼이 인스타 감성',
      '{name} 베이글이 쫄깃해요',
      '{name}는 테라스가 예뻐요',
      '{name}의 오믈렛이 부드러워요'
    ],
    '맛집투어': [
      '{name}의 피자 도우가 쫄깃해요',
      '{name} 까르보나라가 진짜 이탈리아식',
      '{name}의 부라타 치즈가 신선해요',
      '{name} 뇨끼가 수제로 만들어요',
      '{name}의 티본 스테이크가 압권',
      '{name} 해산물 파스타가 싱싱해요',
      '{name}의 트러플 요리가 향긋해요',
      '{name} 라자냐가 층층이 맛있어요',
      '{name}의 포카치아가 담백해요',
      '{name} 티라미수가 정통이에요'
    ]
  },
  '카페': {
    '카페투어': [
      '{name}의 핸드드립이 향긋해요',
      '{name} 라떼 아트가 예뻐요',
      '{name}의 원두가 스페셜티',
      '{name} 디저트가 수제로 만들어요',
      '{name}의 인테리어가 감각적이에요',
      '{name}는 로스팅을 직접 해요',
      '{name}의 시그니처 음료가 특별해요',
      '{name} 크로플이 바삭해요',
      '{name}는 책 읽기 좋아요',
      '{name}의 테라스가 넓어요'
    ],
    '데이트코스': [
      '{name}는 분위기가 아늑해요',
      '{name}의 소파가 편해요',
      '{name} 음악 선곡이 좋아요',
      '{name}는 조용해서 대화하기 좋아요',
      '{name}의 케이크가 달지 않아요',
      '{name} 야경이 예뻐요',
      '{name}는 포토존이 많아요',
      '{name}의 플라워 카페 느낌',
      '{name} 루프탑이 로맨틱해요',
      '{name}는 프라이빗한 공간이 있어요'
    ],
    '혼밥': [
      '{name}는 와이파이가 빵빵해요',
      '{name}의 콘센트가 많아요',
      '{name} 1인석이 편해요',
      '{name}는 브런치도 맛있어요',
      '{name}의 샌드위치가 든든해요',
      '{name} 24시간 영업해요',
      '{name}는 조용해서 집중하기 좋아요',
      '{name}의 아메리카노가 진해요',
      '{name} 책이 많아요',
      '{name}는 혼자 오는 사람이 많아요'
    ]
  },
  '패스트푸드': {
    '혼밥': [
      '{name}는 키오스크로 빠른 주문',
      '{name}의 세트메뉴가 가성비 좋아요',
      '{name} 와이파이가 빠르네요',
      '{name}는 혼자 먹기 편해요',
      '{name}의 감자튀김이 바삭해요',
      '{name} 24시간 영업이라 편해요',
      '{name}는 드라이브 스루가 있어요',
      '{name}의 버거가 푸짐해요',
      '{name} 치킨이 촉촉해요',
      '{name}는 앱 주문이 편해요'
    ],
    '친구모임': [
      '{name}의 파티팩이 가성비 좋아요',
      '{name}는 단체 주문이 편해요',
      '{name}의 신메뉴가 맛있어요',
      '{name} 음료 리필이 돼요',
      '{name}는 넓어서 단체도 OK',
      '{name}의 디저트도 맛있어요',
      '{name} 할인 이벤트가 많아요',
      '{name}는 배달도 빨라요',
      '{name}의 양이 푸짐해요',
      '{name} 매장이 깨끗해요'
    ],
    '야식': [
      '{name}는 새벽 배달도 가능',
      '{name}의 치킨이 야식으로 최고',
      '{name} 버거 세트가 든든해요',
      '{name}는 맥주랑 잘 어울려요',
      '{name}의 핫윙이 매콤해요',
      '{name} 24시간 배달 가능',
      '{name}는 포장할인이 있어요',
      '{name}의 감자튀김이 중독성 있어요',
      '{name} 콜라가 시원해요',
      '{name}는 야식 메뉴가 다양해요'
    ]
  },
  '디저트': {
    '카페투어': [
      '{name}의 마카롱이 쫀득해요',
      '{name} 케이크가 비주얼 최고',
      '{name}의 크로와상이 버터 향 가득',
      '{name} 타르트가 상큼해요',
      '{name}의 푸딩이 부드러워요',
      '{name} 젤라또가 진짜 이탈리아식',
      '{name}의 도넛이 폭신해요',
      '{name} 쿠키가 바삭해요',
      '{name}는 계절 메뉴가 특별해요',
      '{name}의 브라우니가 진해요'
    ],
    '데이트코스': [
      '{name}의 케이크가 커플 세트로 좋아요',
      '{name}는 분위기가 달달해요',
      '{name}의 마카롱 선물세트가 예뻐요',
      '{name} 아이스크림이 수제에요',
      '{name}는 테라스가 로맨틱해요',
      '{name}의 와플이 인스타 감성',
      '{name} 초콜릿이 고급스러워요',
      '{name}는 커피와 페어링이 좋아요',
      '{name}의 밀크티가 달콤해요',
      '{name} 파르페가 비주얼 최고'
    ]
  },
  '분식': {
    '맛집투어': [
      '{name}의 떡볶이가 매콤달콤',
      '{name} 순대가 쫄깃해요',
      '{name}의 김밥이 속이 꽉 차있어요',
      '{name} 튀김이 바삭해요',
      '{name}의 라볶이가 중독성 있어요',
      '{name} 쫄면이 새콤달콤',
      '{name}의 어묵 국물이 시원해요',
      '{name} 만두가 속이 꽉 차있어요',
      '{name}는 40년 전통이에요',
      '{name}의 김치볶음밥이 맛있어요'
    ],
    '혼밥': [
      '{name}는 1인분도 부담없어요',
      '{name}의 김밥 한 줄이면 든든',
      '{name} 컵떡볶이가 간편해요',
      '{name}는 빨리 나와요',
      '{name}의 라면이 꼬들꼬들',
      '{name} 가격이 착해요',
      '{name}는 포장도 간편해요',
      '{name}의 세트메뉴가 알차요',
      '{name} 혼밥족이 많아요',
      '{name}는 24시간 영업이에요'
    ],
    '야식': [
      '{name}의 떡볶이는 야식 필수',
      '{name} 순대가 술안주로 좋아요',
      '{name}는 포장 가능해요',
      '{name}의 튀김이 맥주 안주로 최고',
      '{name} 라볶이가 해장에 좋아요',
      '{name}는 새벽까지 영업해요',
      '{name}의 오뎅탕이 속을 달래줘요',
      '{name} 김밥이 야식으로 부담없어요',
      '{name}는 배달도 가능해요',
      '{name}의 떡볶이가 매워서 술이 들어가요'
    ]
  }
};

// 카테고리가 없거나 매칭 안될 때 기본 템플릿
const defaultReasons = [
  '{name}는 정말 맛있어요',
  '{name}의 음식이 최고예요',
  '{name}는 꼭 가봐야 할 곳',
  '{name}의 분위기가 좋아요',
  '{name}는 서비스가 훌륭해요',
  '{name}의 가성비가 최고',
  '{name}는 재방문 의사 100%',
  '{name}의 메뉴가 다양해요',
  '{name}는 주차가 편해요',
  '{name}의 위치가 좋아요'
];

function getReasonForRestaurant(restaurant, playlistCategory) {
  // 레스토랑 카테고리와 플레이리스트 카테고리로 템플릿 찾기
  const templates = reasonTemplates[restaurant.category]?.[playlistCategory];
  
  if (templates && templates.length > 0) {
    // 랜덤하게 하나 선택
    const template = templates[Math.floor(Math.random() * templates.length)];
    // {name}을 실제 레스토랑 이름으로 치환
    return template.replace(/{name}/g, restaurant.name);
  }
  
  // 카테고리별 기본 템플릿이 없으면 전체 기본 템플릿 사용
  const defaultTemplate = defaultReasons[Math.floor(Math.random() * defaultReasons.length)];
  return defaultTemplate.replace(/{name}/g, restaurant.name);
}

async function fixPlaylistReasons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 모든 플레이리스트 조회
    const playlists = await Playlist.find({})
      .populate('restaurants.restaurant');

    console.log(`${playlists.length}개의 플레이리스트 발견`);

    let totalUpdated = 0;

    for (const playlist of playlists) {
      let updated = false;
      
      // 각 레스토랑의 추가 이유 업데이트
      for (let i = 0; i < playlist.restaurants.length; i++) {
        const restaurantItem = playlist.restaurants[i];
        if (restaurantItem.restaurant) {
          const restaurant = restaurantItem.restaurant;
          const oldReason = playlist.restaurants[i].reason;
          const newReason = getReasonForRestaurant(restaurant, playlist.category);
          
          if (oldReason !== newReason) {
            playlist.restaurants[i].reason = newReason;
            updated = true;
            console.log(`  - ${restaurant.name} (${restaurant.category}): ${newReason}`);
          }
        }
      }

      if (updated) {
        await playlist.save();
        totalUpdated++;
        console.log(`✅ 업데이트 완료: ${playlist.title}`);
      }
    }

    console.log(`\n✅ 총 ${totalUpdated}개 플레이리스트 업데이트 완료!`);
    
    // 샘플 확인
    console.log('\n📋 업데이트 샘플 확인:');
    const samplePlaylist = await Playlist.findOne({})
      .populate('restaurants.restaurant');
    
    if (samplePlaylist) {
      console.log(`플레이리스트: ${samplePlaylist.title} (${samplePlaylist.category})`);
      samplePlaylist.restaurants.slice(0, 3).forEach(item => {
        if (item.restaurant) {
          console.log(`  - ${item.restaurant.name} (${item.restaurant.category}): ${item.reason}`);
        }
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

fixPlaylistReasons();