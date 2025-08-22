const mongoose = require('mongoose');
require('dotenv').config();

const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');

// 플레이리스트 카테고리별 이유 템플릿
const reasonTemplates = {
  '유명인이 방문한 맛집': [
    '백종원이 극찬한 {category} 맛집! 방송 이후 줄이 끊이지 않는다고 해요',
    '성시경이 자주 찾는다는 단골집. {dish} 특히 추천하더라구요',
    '유재석이 촬영 중 우연히 발견한 숨은 맛집. 이제는 연예인 단골이 됐대요',
    'BTS 멤버들이 연습생 시절부터 다녔다는 추억의 장소',
    '손석구 배우가 인터뷰에서 언급한 인생 맛집. {atmosphere} 분위기도 최고',
    '아이유가 콘서트 스태프들과 회식했다는 곳. 예약 필수!',
    '박서준이 SNS에 올려서 화제가 된 {priceRange} 맛집',
    '이영자가 전참시에서 소개한 진짜 맛집. 양도 푸짐해요',
    '강호동이 아는형님에서 언급한 고기 맛집. 특별한 날 가기 좋아요',
    '김태리 배우가 드라마 촬영 중 자주 갔다는 근처 맛집'
  ],
  
  '강남 데이트 코스 맛집 10선': [
    '선릉역에서 가까워 접근성 좋고, 조용해서 대화하기 완벽한 곳',
    '루프탑에서 강남 야경 보면서 와인 한잔하기 좋은 분위기',
    '오픈 키친이라 요리 과정 보는 재미도 있고, 플레이팅도 예뻐요',
    '기념일에 가면 특별한 서비스 해주시는 센스있는 곳',
    '프라이빗 룸이 있어서 둘만의 시간 보내기 좋아요',
    '소믈리에가 있어서 와인 추천받기 좋은 레스토랑',
    '코스 요리인데 가격대비 구성이 알차고 맛있어요',
    '인테리어가 너무 예뻐서 사진 찍기도 좋고 분위기도 로맨틱',
    '예약하면 창가 자리 배정해주시는 세심한 서비스',
    '디저트까지 완벽한 풀코스 데이트 코스'
  ],
  
  '혼밥하기 좋은 맛집 모음': [
    '카운터석이 넓고 편해서 혼자 가도 전혀 어색하지 않아요',
    '1인 메뉴가 따로 있어서 부담없이 주문 가능한 곳',
    '태블릿 주문이라 직원 호출 부담없고 편하게 식사 가능',
    '바 테이블에서 요리하는 모습 보면서 먹는 재미가 있어요',
    '점심시간에 직장인들이 혼밥하러 많이 오는 곳',
    '24시간이라 새벽에 혼자 야식 먹기도 좋아요',
    '키오스크 주문이라 대기 시간도 짧고 효율적',
    '1인석 칸막이가 있어서 프라이버시 보장되는 곳',
    '책 읽으면서 천천히 식사하기 좋은 조용한 분위기',
    '테이크아웃도 가능해서 집에서 먹기도 좋아요'
  ],
  
  '서울 가성비 맛집 TOP 20': [
    '이 가격에 이 퀄리티면 정말 미친 가성비! 학생들 성지',
    '양이 정말 푸짐해서 남자도 배부르게 먹을 수 있어요',
    '기본 반찬만 10가지. 반찬 리필도 무제한!',
    '점심 특선 메뉴가 정말 저렴한데 맛은 고급 레스토랑급',
    '대학가 근처라 가격은 착한데 맛은 보장하는 곳',
    '무한리필인데 고기 질이 좋아서 자주 가는 곳',
    '세트 메뉴 시키면 가격 대비 구성이 정말 알차요',
    '쿠폰 적립하면 더 저렴하게 먹을 수 있는 혜자 맛집',
    '런치 할인이 40%라서 점심에 가면 진짜 이득',
    '양도 많고 맛도 좋은데 가격까지 착한 3박자'
  ],
  
  '인스타 감성 디저트 카페': [
    '시그니처 케이크가 너무 예뻐서 먹기 아까울 정도예요',
    '계절마다 메뉴가 바뀌어서 갈 때마다 새로운 디저트 맛볼 수 있어요',
    '플라워 카페라서 꽃과 디저트 조합이 정말 예뻐요',
    '수제 마카롱이 유명한데 선물용으로도 인기 많아요',
    '빈티지 인테리어가 독특해서 사진 찍기 정말 좋은 곳',
    '루프탑이 있어서 날씨 좋은 날 가면 최고예요',
    '바리스타 챔피언이 내려주는 커피가 일품',
    '비건 디저트도 있어서 다양한 취향 만족 가능',
    '신상 디저트 맛보러 일부러 찾아가는 카페',
    '시즌 한정 메뉴가 인기라서 빨리 가야 맛볼 수 있어요'
  ],
  
  '금요일 밤 술집 추천': [
    '칵테일 종류가 100가지가 넘어서 골라 마시는 재미가 있어요',
    '라이브 공연이 있어서 분위기가 정말 좋은 펍',
    '수제 맥주 종류가 다양하고 안주도 맛있는 곳',
    '와인 리스트가 풍부하고 소믈리에 추천이 정확해요',
    '야외 테라스가 있어서 선선한 날 가면 분위기 최고',
    '새벽 3시까지 영업해서 2차로 가기 좋은 곳',
    '위스키 바인데 입문자도 친절하게 설명해주셔요',
    '안주가 정말 맛있어서 술이 술술 들어가는 곳',
    'DJ가 있어서 금요일 밤 분위기 제대로 느낄 수 있어요',
    '프라이빗한 공간이 있어서 단체 모임하기도 좋아요'
  ],
  
  '비건/채식 맛집 가이드': [
    '고기 없이도 이렇게 맛있을 수 있다니! 비건 입문자 추천',
    '채소 본연의 맛을 살린 건강하고 맛있는 요리',
    '비건 치즈가 정말 맛있어서 일반 치즈랑 구분 안돼요',
    '글루텐프리 옵션도 있어서 알러지 있는 분들도 OK',
    '템페, 두부 요리를 이렇게 맛있게 하는 곳은 처음',
    '샐러드뿐만 아니라 파스타, 버거 등 메뉴가 다양해요',
    '유기농 재료만 사용해서 믿고 먹을 수 있는 곳',
    '비건 디저트가 특히 유명한 카페 레스토랑',
    '육식주의자도 만족할 만한 푸짐하고 맛있는 비건 요리',
    '제철 채소로 매일 메뉴가 바뀌는 신선한 맛집'
  ],
  
  '맛집투어': [
    '이 지역 오면 꼭 들러야 하는 필수 코스 맛집',
    '3대째 이어오는 전통 있는 노포 맛집',
    '현지인들만 아는 진짜 로컬 맛집',
    '줄 서서 기다려도 아깝지 않은 맛',
    'TV에 나온 후로 전국에서 찾아오는 명소',
    '재료 소진되면 조기 마감하는 인기 맛집',
    '미슐랭 가이드에 소개된 합리적인 가격의 맛집',
    '외국인 관광객들도 많이 찾는 한국 대표 맛집',
    '계절 메뉴가 특히 유명한 제철 요리 전문점',
    '이 집 하나 때문에 일부러 찾아가는 가치 있는 곳'
  ],
  
  '카페투어': [
    '로스팅을 직접 해서 커피 향이 정말 좋아요',
    '드립 커피 종류가 10가지 이상! 커피 마니아 추천',
    '브런치 메뉴가 푸짐하고 맛있어서 식사하기도 좋아요',
    '작업하기 좋은 조용한 카페. 콘센트도 많아요',
    '애견 동반 가능해서 강아지랑 함께 가기 좋은 곳',
    '북카페라서 책 읽으면서 여유롭게 시간 보내기 좋아요',
    '핸드드립 전문점인데 바리스타님이 정말 친절해요',
    '디저트 종류가 20가지가 넘어서 고르는 재미가 있어요',
    '2층, 3층 구조라 공간이 넓고 쾌적해요',
    '테라스 뷰가 정말 예쁜 감성 카페'
  ],
  
  '친구모임': [
    '단체석이 넓어서 10명 이상 모임도 가능한 곳',
    '시끄러워도 괜찮은 분위기라 편하게 수다 떨기 좋아요',
    '룸이 있어서 프라이빗하게 모임 가능',
    '게임기나 보드게임이 있어서 놀면서 먹기 좋아요',
    '늦은 시간까지 영업해서 오랜만에 만나 얘기하기 좋아요',
    '주차 공간이 넓어서 차 가져가기 편한 곳',
    '세트 메뉴가 있어서 여럿이 가면 가성비 좋아요',
    '예약하면 케이크 서비스 해주는 생일파티 맛집',
    '술 종류가 다양해서 각자 취향대로 마실 수 있어요',
    '2차로 가기 좋은 카페나 술집이 근처에 많아요'
  ],
  
  '가족모임': [
    '어르신 입맛에도 맞는 한식 정통 맛집',
    '아이 의자, 아이 메뉴가 있어서 가족 외식하기 좋아요',
    '개별 룸이 있어서 가족끼리 조용히 식사 가능',
    '주차가 편리해서 부모님 모시고 가기 좋은 곳',
    '좌식, 입식 선택 가능해서 편한 자리로 앉을 수 있어요',
    '코스 요리인데 어른 아이 모두 만족하는 구성',
    '한정식인데 가격이 합리적이고 정갈해요',
    '돌잔치, 가족 행사하기 좋은 넓은 공간',
    '전통 차도 있어서 식사 후 차 한잔하기 좋아요',
    '4대가 함께 가도 모두 만족할 만한 메뉴 구성'
  ],
  
  '회식': [
    '직장인 회식 장소로 인기 많은 검증된 곳',
    '2차까지 한 건물에서 해결 가능한 편리한 위치',
    '대형 룸이 있어서 부서 회식하기 적합',
    '고기 질이 좋고 직원분들이 구워주셔서 편해요',
    '주변에 대중교통이 편리해서 모이기 좋은 곳',
    '세트 메뉴 가성비가 좋아서 회식 예산에 적합',
    '분위기가 너무 격식있지 않아서 편하게 회식 가능',
    '채식주의자 메뉴도 있어서 모든 직원 배려 가능',
    '노래방이 가까워서 2차 가기 편한 위치',
    '예약하면 행사 진행도 도와주시는 친절한 곳'
  ],
  
  '출장/여행': [
    '역/공항에서 가까워서 시간 없을 때 들르기 좋아요',
    '지역 특산물로 만든 향토 음식 전문점',
    '여행자들 사이에서 입소문난 필수 코스',
    '영업시간이 길어서 늦은 도착에도 식사 가능',
    '테이크아웃 포장이 깔끔해서 이동 중 먹기 좋아요',
    '관광지 근처인데도 가격이 착한 양심 맛집',
    '그 지역 가면 꼭 먹어야 한다는 명물 맛집',
    '숙소에서 도보 5분 거리라 접근성 최고',
    '현지인 추천 맛집이라 믿고 갈 수 있어요',
    '조식부터 야식까지 시간대별로 메뉴가 있어 편리'
  ],
  
  '기타': [
    '새로 오픈한 핫플레이스! 요즘 SNS에서 화제',
    '숨은 맛집인데 아는 사람만 가는 곳',
    '특이한 퓨전 요리를 맛볼 수 있는 독특한 곳',
    '셰프님 이력이 화려해서 믿고 먹는 맛집',
    '매달 메뉴가 바뀌어서 갈 때마다 새로워요',
    '예약 필수! 워낙 인기가 많아서 웨이팅 길어요',
    '맛도 맛이지만 서비스가 정말 감동적인 곳',
    '가격은 좀 있지만 특별한 날 가기 좋은 곳',
    '콜라보 메뉴나 한정판 메뉴가 자주 나와요',
    '입소문만으로 10년째 장사하는 진짜 맛집'
  ]
};

// 다양한 추가 이유 (카테고리 무관)
const genericReasons = [
  '정말 오랜만에 감동받은 맛! 재방문 의사 100%',
  '서비스가 너무 좋아서 기분 좋게 식사했어요',
  '플레이팅이 예술이에요. 눈과 입이 모두 즐거운 곳',
  '웨이팅이 있지만 기다릴 가치가 충분한 맛집',
  '친구 소개로 갔는데 이제는 제가 다른 사람에게 추천해요',
  '가격 대비 만족도가 정말 높은 곳',
  '재료의 신선함이 느껴지는 정직한 맛',
  '주차도 편하고 위치도 좋아서 자주 가게 되는 곳',
  '특별한 날 가면 더 특별해지는 마법같은 곳',
  '음식 하나하나에 정성이 느껴지는 맛집'
];

async function updatePlaylistReasons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobsmap');
    console.log('✅ 데이터베이스 연결 성공');

    const playlists = await Playlist.find().populate('restaurants.restaurant');
    console.log(`\n📋 총 ${playlists.length}개의 플레이리스트 발견`);

    let totalUpdated = 0;

    for (const playlist of playlists) {
      console.log(`\n🎯 플레이리스트: ${playlist.title}`);
      
      // 카테고리에 맞는 이유 템플릿 선택
      let categoryReasons = reasonTemplates[playlist.title] || 
                           reasonTemplates[playlist.category] || 
                           genericReasons;

      // 플레이리스트의 각 레스토랑에 대해 고유한 이유 생성
      for (let i = 0; i < playlist.restaurants.length; i++) {
        const restaurantEntry = playlist.restaurants[i];
        
        if (!restaurantEntry.restaurant) continue;

        const restaurant = restaurantEntry.restaurant;
        
        // 사용할 이유 선택 (순환하면서 사용)
        let reasonTemplate = categoryReasons[i % categoryReasons.length];
        
        // 템플릿에 실제 정보 대입
        let personalNote = reasonTemplate
          .replace('{category}', restaurant.category || '한식')
          .replace('{dish}', getSignatureDish(restaurant.category))
          .replace('{atmosphere}', getAtmosphere(restaurant))
          .replace('{priceRange}', getPriceDescription(restaurant.priceRange));

        // 추가 디테일 랜덤 추가
        if (Math.random() > 0.5) {
          personalNote += getAdditionalDetail(restaurant);
        }

        // personalNote 업데이트
        playlist.restaurants[i].personalNote = personalNote;
        
        // mustTry 항목도 업데이트 (메뉴 추천)
        if (!playlist.restaurants[i].mustTry || playlist.restaurants[i].mustTry.length === 0) {
          playlist.restaurants[i].mustTry = getMustTryItems(restaurant.category);
        }
        
        totalUpdated++;
      }

      // 변경사항 저장
      await playlist.save();
      console.log(`  ✅ ${playlist.restaurants.length}개 레스토랑 이유 업데이트 완료`);
    }

    console.log(`\n🎉 총 ${totalUpdated}개의 레스토랑 추가 이유를 업데이트했습니다!`);

    // 샘플 출력
    console.log('\n📝 업데이트된 샘플:');
    const samplePlaylist = await Playlist.findOne().populate('restaurants.restaurant');
    if (samplePlaylist && samplePlaylist.restaurants.length > 0) {
      samplePlaylist.restaurants.slice(0, 3).forEach((r, idx) => {
        console.log(`\n${idx + 1}. ${r.restaurant?.name || 'Unknown'}:`);
        console.log(`   이유: ${r.personalNote}`);
      });
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 데이터베이스 연결 종료');
  }
}

// 헬퍼 함수들
function getSignatureDish(category) {
  const dishes = {
    '한식': ['김치찌개', '된장찌개', '갈비탕', '비빔밥', '불고기'],
    '중식': ['짜장면', '짬뽕', '탕수육', '마파두부', '깐풍기'],
    '일식': ['초밥', '라멘', '돈카츠', '우동', '사시미'],
    '양식': ['파스타', '스테이크', '리조또', '피자', '샐러드'],
    '동남아': ['쌀국수', '팟타이', '똠양꿍', '나시고렝', '반미'],
    '카페': ['아메리카노', '라떼', '크로플', '케이크', '브런치'],
    '디저트': ['티라미수', '마카롱', '초콜릿', '와플', '빙수'],
    '주점': ['안주', '치킨', '곱창', '전', '김치전'],
    '패스트푸드': ['버거', '치킨', '피자', '샌드위치', '타코']
  };
  const categoryDishes = dishes[category] || dishes['한식'];
  return categoryDishes[Math.floor(Math.random() * categoryDishes.length)];
}

function getAtmosphere(restaurant) {
  const atmospheres = ['아늑한', '모던한', '클래식한', '캐주얼한', '로맨틱한', '활기찬', '조용한', '세련된'];
  if (restaurant.dnaProfile?.atmosphere?.length > 0) {
    return restaurant.dnaProfile.atmosphere[0];
  }
  return atmospheres[Math.floor(Math.random() * atmospheres.length)];
}

function getPriceDescription(priceRange) {
  const descriptions = {
    '저렴한': '가성비 좋은',
    '보통': '합리적인 가격의',
    '비싼': '프리미엄',
    '매우비싼': '럭셔리'
  };
  return descriptions[priceRange] || '합리적인';
}

function getAdditionalDetail(restaurant) {
  const details = [
    ' 주말엔 웨이팅이 있으니 평일 방문 추천!',
    ' 예약은 필수예요.',
    ' 주차 공간도 넉넉해요.',
    ' 인스타에 올리기 좋은 포토스팟도 있어요.',
    ' 직원분들이 정말 친절하세요.',
    ' 재방문율 100%인 이유가 있어요.',
    ' 분위기도 좋고 음악 선곡도 센스있어요.',
    ' 화장실도 깨끗하고 관리가 잘 되어있어요.',
    ' 커플석이 따로 있어서 데이트하기 좋아요.',
    ' 야외 테라스도 있어서 날씨 좋은 날 최고!'
  ];
  return details[Math.floor(Math.random() * details.length)];
}

function getMustTryItems(category) {
  const mustTry = {
    '한식': ['김치찌개', '된장찌개', '제육볶음', '갈비탕', '순두부찌개'],
    '중식': ['짜장면', '짬뽕', '탕수육', '깐풍기', '유산슬'],
    '일식': ['특선초밥', '사시미', '우동', '돈카츠', '라멘'],
    '양식': ['스테이크', '파스타', '리조또', '그라탕', '샐러드'],
    '동남아': ['쌀국수', '팟타이', '똠양꿍', '분짜', '월남쌈'],
    '카페': ['시그니처 라떼', '크로플', '수제 케이크', '브런치', '에이드'],
    '디저트': ['티라미수', '초콜릿 케이크', '마카롱', '크레페', '젤라또'],
    '주점': ['모듬 안주', '치킨', '나초', '감바스', '파스타'],
    '패스트푸드': ['시그니처 버거', '치킨', '피자', '감자튀김', '샐러드']
  };
  
  const items = mustTry[category] || mustTry['한식'];
  // 2-3개 랜덤 선택
  const count = Math.floor(Math.random() * 2) + 2;
  const selected = [];
  const itemsCopy = [...items];
  
  for (let i = 0; i < count && itemsCopy.length > 0; i++) {
    const idx = Math.floor(Math.random() * itemsCopy.length);
    selected.push(itemsCopy[idx]);
    itemsCopy.splice(idx, 1);
  }
  
  return selected;
}

// 스크립트 실행
updatePlaylistReasons();