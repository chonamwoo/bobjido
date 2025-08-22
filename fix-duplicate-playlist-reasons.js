const mongoose = require('mongoose');
require('dotenv').config();

const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');

// 레스토랑별 플레이리스트 이유 템플릿
const restaurantReasonTemplates = {
  default: {
    '유명인이 방문한 맛집': [
      '연예인들 사이에서 입소문난 맛집. SNS에 자주 올라와요',
      '방송 출연 후 대기가 길어졌지만 그만한 가치가 있어요',
      '유명 셰프가 극찬한 곳. 시그니처 메뉴는 꼭 드셔보세요',
      '스타들의 단골집. 운 좋으면 연예인도 만날 수 있어요'
    ],
    '데이트코스': [
      '분위기가 로맨틱해서 특별한 날 오기 좋아요',
      '조용하고 아늑해서 대화하기 좋은 곳',
      '야경이 멋진 곳. 저녁 시간대 추천',
      '프라이빗한 공간이 있어서 둘만의 시간을 보낼 수 있어요'
    ],
    '혼밥': [
      '1인석이 편하게 마련되어 있어요',
      '혼자 와도 눈치 안 보이는 편안한 분위기',
      '빠르게 나와서 점심시간에 딱이에요',
      '조용해서 혼자 생각 정리하기 좋은 곳'
    ],
    '가성비': [
      '이 가격에 이런 퀄리티는 정말 찾기 힘들어요',
      '양이 푸짐하고 가격도 착해서 자주 가게 돼요',
      '학생들에게 인기 만점. 가성비 최고',
      '세트 메뉴가 정말 알차고 저렴해요'
    ],
    '카페': [
      '커피맛이 일품. 원두를 직접 로스팅해요',
      '디저트가 맛있기로 유명한 곳',
      '인테리어가 예뻐서 사진 찍기 좋아요',
      '조용해서 작업하거나 책 읽기 좋은 곳'
    ],
    '술집': [
      '안주가 정말 맛있어서 술이 술술 들어가요',
      '분위기 좋고 음악 선곡도 센스있는 곳',
      '다양한 술이 구비되어 있어 골라 마시는 재미가 있어요',
      '늦게까지 영업해서 2차로 가기 좋아요'
    ]
  }
};

// 카테고리별 특화 이유
const categorySpecificReasons = {
  '한식': {
    generic: [
      '한국인의 입맛에 딱 맞는 정통 한식',
      '어머니 손맛이 느껴지는 집밥 스타일',
      '반찬이 정갈하고 맛있어요',
      '김치가 특히 맛있는 집'
    ],
    premium: [
      '고급스러운 한정식 코스',
      '전통과 현대의 조화가 멋진 곳',
      '정성스런 상차림이 인상적',
      '제철 재료로 만든 특별한 한식'
    ]
  },
  '일식': {
    generic: [
      '신선한 재료로 만든 정통 일식',
      '일본 현지의 맛을 그대로 재현',
      '초밥이 입에서 살살 녹아요',
      '사시미가 정말 신선해요'
    ],
    premium: [
      '오마카세 코스가 일품',
      '계절마다 메뉴가 바뀌는 곳',
      '셰프님의 설명이 재미있어요',
      '에도마에 스타일의 정통 스시'
    ]
  },
  '중식': {
    generic: [
      '불맛 제대로 나는 중국요리',
      '현지인도 인정하는 맛',
      '짜장면이 특히 맛있는 집',
      '탕수육이 바삭하고 소스도 일품'
    ],
    premium: [
      '고급 중식의 정수를 보여주는 곳',
      '딤섬이 특히 유명한 레스토랑',
      '베이징덕이 일품인 곳',
      '광동요리 전문점'
    ]
  },
  '양식': {
    generic: [
      '파스타가 정말 맛있는 이탈리안',
      '스테이크가 부드럽고 육즙이 풍부',
      '피자 도우가 쫄깃하고 토핑도 푸짐',
      '리조또가 크리미하고 맛있어요'
    ],
    premium: [
      '미슐랭 출신 셰프의 레스토랑',
      '와인 페어링이 훌륭한 곳',
      '프렌치 코스 요리 전문',
      '트러플 요리가 일품'
    ]
  },
  '카페': {
    generic: [
      '커피가 정말 맛있는 전문점',
      '브런치 메뉴가 다양하고 맛있어요',
      '수제 디저트가 유명한 곳',
      '분위기가 아늑하고 좋아요'
    ],
    premium: [
      '스페셜티 커피 전문점',
      '핸드드립 전문 바리스타',
      '시그니처 음료가 특별한 곳',
      '로스터리 카페'
    ]
  },
  '디저트': {
    generic: [
      '달콤한 디저트가 가득한 곳',
      '케이크가 정말 맛있어요',
      '마카롱이 유명한 디저트 카페',
      '빙수가 일품인 곳'
    ],
    premium: [
      '프랑스 정통 디저트',
      '파티시에가 직접 만드는 수제 디저트',
      '계절 한정 디저트가 특별해요',
      '비건 디저트도 맛있는 곳'
    ]
  }
};

// 시간대별 이유
const timeBasedReasons = {
  morning: [
    '아침 일찍부터 영업해서 좋아요',
    '모닝 커피 마시기 좋은 곳',
    '조식 메뉴가 푸짐해요'
  ],
  lunch: [
    '점심 특선이 가성비 좋아요',
    '직장인 점심 맛집',
    '런치 세트가 알차요'
  ],
  dinner: [
    '저녁 분위기가 특히 좋은 곳',
    '디너 코스가 훌륭해요',
    '저녁 시간대 뷰가 멋져요'
  ],
  latenight: [
    '늦은 시간까지 영업하는 곳',
    '야식으로 딱이에요',
    '새벽까지 영업해서 좋아요'
  ]
};

// 위치별 이유
const locationBasedReasons = {
  '강남': [
    '강남역에서 가까워 접근성이 좋아요',
    '강남의 핫플레이스',
    '강남 직장인들의 단골집'
  ],
  '홍대': [
    '홍대의 숨은 맛집',
    '젊은 감각이 돋보이는 곳',
    '홍대 특유의 힙한 분위기'
  ],
  '이태원': [
    '이국적인 분위기가 매력적',
    '외국인들도 많이 찾는 곳',
    '이태원의 명소'
  ],
  '성수': [
    '성수동 감성이 물씬',
    '공장을 개조한 독특한 인테리어',
    '성수동 카페거리의 핫플'
  ],
  '종로': [
    '전통이 살아있는 노포',
    '종로의 숨은 보석',
    '역사가 깊은 맛집'
  ]
};

async function fixDuplicateReasons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobsmap');
    console.log('✅ 데이터베이스 연결 성공');

    // 모든 레스토랑 가져오기
    const restaurants = await Restaurant.find();
    console.log(`\n📊 총 ${restaurants.length}개의 레스토랑 발견`);

    let totalUpdated = 0;
    let restaurantsWithMultiplePlaylists = 0;

    for (const restaurant of restaurants) {
      // 이 레스토랑이 포함된 모든 플레이리스트 찾기
      const playlists = await Playlist.find({
        'restaurants.restaurant': restaurant._id
      });

      if (playlists.length > 1) {
        restaurantsWithMultiplePlaylists++;
        console.log(`\n🍴 ${restaurant.name} - ${playlists.length}개 플레이리스트에 포함`);

        // 각 플레이리스트에 대해 고유한 이유 생성
        for (let i = 0; i < playlists.length; i++) {
          const playlist = playlists[i];
          const restaurantIndex = playlist.restaurants.findIndex(
            r => r.restaurant.toString() === restaurant._id.toString()
          );

          if (restaurantIndex !== -1) {
            // 플레이리스트 카테고리에 맞는 이유 선택
            let reason = generateUniqueReason(
              restaurant,
              playlist,
              i,
              playlists.length
            );

            // 이유 업데이트
            playlist.restaurants[restaurantIndex].personalNote = reason;
            
            // mustTry 업데이트
            if (!playlist.restaurants[restaurantIndex].mustTry || 
                playlist.restaurants[restaurantIndex].mustTry.length === 0) {
              playlist.restaurants[restaurantIndex].mustTry = generateMustTryItems(restaurant);
            }

            await playlist.save();
            totalUpdated++;
            
            console.log(`  ✅ ${playlist.title}: ${reason.substring(0, 50)}...`);
          }
        }
      } else if (playlists.length === 1) {
        // 단일 플레이리스트인 경우에도 더 나은 이유로 업데이트
        const playlist = playlists[0];
        const restaurantIndex = playlist.restaurants.findIndex(
          r => r.restaurant.toString() === restaurant._id.toString()
        );

        if (restaurantIndex !== -1) {
          const currentReason = playlist.restaurants[restaurantIndex].personalNote;
          
          // 너무 짧거나 generic한 이유면 업데이트
          if (!currentReason || currentReason.length < 20) {
            const newReason = generateUniqueReason(restaurant, playlist, 0, 1);
            playlist.restaurants[restaurantIndex].personalNote = newReason;
            await playlist.save();
            totalUpdated++;
          }
        }
      }
    }

    console.log(`\n📈 통계:`);
    console.log(`- 여러 플레이리스트에 포함된 레스토랑: ${restaurantsWithMultiplePlaylists}개`);
    console.log(`- 업데이트된 항목: ${totalUpdated}개`);

    // 검증
    console.log('\n🔍 검증 중...');
    const sampleRest = await Restaurant.findOne({ name: '스시조' });
    if (sampleRest) {
      const samplePlaylists = await Playlist.find({
        'restaurants.restaurant': sampleRest._id
      }).select('title restaurants');
      
      console.log(`\n샘플: ${sampleRest.name}`);
      samplePlaylists.forEach(p => {
        const entry = p.restaurants.find(r => r.restaurant.toString() === sampleRest._id.toString());
        console.log(`- ${p.title}: ${entry.personalNote.substring(0, 60)}...`);
      });
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 데이터베이스 연결 종료');
  }
}

function generateUniqueReason(restaurant, playlist, index, totalCount) {
  const category = restaurant.category || '기타';
  const priceRange = restaurant.priceRange || '보통';
  const playlistCategory = playlist.category;
  const playlistTitle = playlist.title;
  
  // 기본 이유 배열 준비
  let reasons = [];
  
  // 1. 플레이리스트 제목에 맞는 이유
  if (playlistTitle.includes('유명인')) {
    reasons = restaurantReasonTemplates.default['유명인이 방문한 맛집'];
  } else if (playlistTitle.includes('데이트')) {
    reasons = restaurantReasonTemplates.default['데이트코스'];
  } else if (playlistTitle.includes('혼밥')) {
    reasons = restaurantReasonTemplates.default['혼밥'];
  } else if (playlistTitle.includes('가성비')) {
    reasons = restaurantReasonTemplates.default['가성비'];
  } else if (playlistTitle.includes('카페') || playlistTitle.includes('디저트')) {
    reasons = restaurantReasonTemplates.default['카페'];
  } else if (playlistTitle.includes('술') || playlistTitle.includes('한잔')) {
    reasons = restaurantReasonTemplates.default['술집'];
  }
  
  // 2. 카테고리별 특화 이유 추가
  if (categorySpecificReasons[category]) {
    const categoryReasons = priceRange === '비싼' || priceRange === '매우비싼' 
      ? categorySpecificReasons[category].premium 
      : categorySpecificReasons[category].generic;
    reasons = [...reasons, ...categoryReasons];
  }
  
  // 3. 위치 기반 이유 추가
  if (restaurant.region && restaurant.region.district) {
    const district = restaurant.region.district;
    for (const [key, value] of Object.entries(locationBasedReasons)) {
      if (district.includes(key)) {
        reasons = [...reasons, ...value];
        break;
      }
    }
  }
  
  // 4. 시간대별 이유 추가
  if (playlist.title.includes('브런치') || playlist.title.includes('아침')) {
    reasons = [...reasons, ...timeBasedReasons.morning];
  } else if (playlist.title.includes('점심')) {
    reasons = [...reasons, ...timeBasedReasons.lunch];
  } else if (playlist.title.includes('저녁') || playlist.title.includes('디너')) {
    reasons = [...reasons, ...timeBasedReasons.dinner];
  } else if (playlist.title.includes('야식') || playlist.title.includes('새벽')) {
    reasons = [...reasons, ...timeBasedReasons.latenight];
  }
  
  // 5. 레스토랑 특징 기반 이유
  if (restaurant.features && restaurant.features.length > 0) {
    const featureReasons = {
      '주차가능': '주차가 편리해서 차로 방문하기 좋아요',
      '와이파이': '와이파이가 빵빵해서 작업하기도 좋아요',
      '예약가능': '예약이 가능해서 대기 없이 편하게 방문할 수 있어요',
      '배달가능': '배달도 되니까 집에서도 즐길 수 있어요',
      '24시간': '24시간 영업이라 언제든 갈 수 있어요',
      '룸있음': '프라이빗 룸이 있어서 모임하기 좋아요',
      '테라스': '테라스가 있어서 날씨 좋은 날 최고예요',
      '키즈존': '아이와 함께 가기 좋은 패밀리 레스토랑',
      '반려동물동반': '강아지와 함께 갈 수 있는 펫프렌들리 맛집'
    };
    
    restaurant.features.forEach(feature => {
      if (featureReasons[feature]) {
        reasons.push(featureReasons[feature]);
      }
    });
  }
  
  // 6. 평점 기반 이유
  if (restaurant.averageRating >= 4.5) {
    reasons.push('평점이 높아서 믿고 가는 맛집');
    reasons.push('리뷰가 좋아서 실패 없는 선택');
  }
  
  // 고유한 이유 선택 (index를 활용하여 다른 이유 선택)
  if (reasons.length === 0) {
    // 기본 이유들
    reasons = [
      '맛과 분위기 모두 만족스러운 곳',
      '재방문 의사 100%인 나의 단골집',
      '특별한 날 가기 좋은 레스토랑',
      '친구들에게 자신있게 추천하는 맛집',
      '음식 퀄리티가 일정하게 좋은 곳',
      '서비스가 친절해서 기분 좋게 식사할 수 있어요',
      '메뉴 구성이 다양해서 선택의 폭이 넓어요',
      '항상 신선한 재료를 사용하는 믿을 수 있는 곳'
    ];
  }
  
  // index와 totalCount를 활용하여 다른 이유 선택
  const reasonIndex = (index + Math.floor(Math.random() * reasons.length)) % reasons.length;
  let selectedReason = reasons[reasonIndex] || reasons[0];
  
  // 추가 디테일 랜덤 추가 (30% 확률)
  if (Math.random() < 0.3) {
    const details = [
      ' 특히 주말에 인기가 많아요.',
      ' 예약은 필수!',
      ' 웨이팅이 있을 수 있어요.',
      ' 재료 소진시 조기 마감될 수 있어요.',
      ' SNS에서 핫한 곳이에요.',
      ' 최근 리모델링해서 더 좋아졌어요.',
      ' 사장님이 정말 친절하세요.',
      ' 매달 새로운 메뉴가 나와요.',
      ' 단골 손님이 많은 곳이에요.',
      ' 숨은 맛집이라 아는 사람만 가요.'
    ];
    selectedReason += details[Math.floor(Math.random() * details.length)];
  }
  
  return selectedReason;
}

function generateMustTryItems(restaurant) {
  const mustTryByCategory = {
    '한식': ['김치찌개', '된장찌개', '제육볶음', '불고기', '비빔밥', '갈비탕', '삼겹살'],
    '일식': ['초밥 세트', '사시미', '우동', '돈카츠', '라멘', '규동', '텐동'],
    '중식': ['짜장면', '짬뽕', '탕수육', '깐풍기', '마파두부', '유산슬', '팔보채'],
    '양식': ['스테이크', '파스타', '리조또', '피자', '샐러드', '수프', '그라탕'],
    '카페': ['아메리카노', '라떼', '에이드', '스무디', '케이크', '크로플', '샌드위치'],
    '디저트': ['티라미수', '치즈케이크', '마카롱', '크레페', '와플', '빙수', '젤라또'],
    '동남아': ['쌀국수', '팟타이', '똠양꿍', '나시고렝', '분짜', '반미', '월남쌈'],
    '주점': ['치킨', '골뱅이', '나초', '감바스', '모듬안주', '파전', '어묵탕'],
    '패스트푸드': ['버거', '치킨', '피자', '감자튀김', '너겟', '샐러드', '콜라'],
    '기타': ['시그니처 메뉴', '오늘의 특선', '셰프 추천', '베스트셀러']
  };
  
  const items = mustTryByCategory[restaurant.category] || mustTryByCategory['기타'];
  const selectedCount = Math.floor(Math.random() * 2) + 2; // 2-3개 선택
  const selected = [];
  
  for (let i = 0; i < selectedCount && i < items.length; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
    if (!selected.includes(items[randomIndex])) {
      selected.push(items[randomIndex]);
    }
  }
  
  return selected;
}

// 스크립트 실행
fixDuplicateReasons();