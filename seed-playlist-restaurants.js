const mongoose = require('mongoose');
require('dotenv').config();

// 서울 주요 지역별 실제 맛집 데이터
const restaurantData = {
  // 강남 데이트 맛집
  date_spots: [
    {
      name: '정식당',
      category: '모던 한식',
      address: '서울 강남구 선릉로158길 11',
      coordinates: { lat: 37.523437, lng: 127.043891 },
      priceRange: '₩₩₩₩',
      description: '미쉐린 2스타, 모던 한식의 정수',
      rating: 4.8,
      phoneNumber: '02-517-4654'
    },
    {
      name: '밍글스',
      category: '컨템포러리',
      address: '서울 강남구 도산대로67길 19',
      coordinates: { lat: 37.524951, lng: 127.038426 },
      priceRange: '₩₩₩₩',
      description: '한국의 맛을 현대적으로 재해석한 파인다이닝',
      rating: 4.7,
      phoneNumber: '02-515-7306'
    },
    {
      name: '라망시크레',
      category: '프렌치',
      address: '서울 강남구 도산대로 318',
      coordinates: { lat: 37.522468, lng: 127.039183 },
      priceRange: '₩₩₩',
      description: '로맨틱한 분위기의 프렌치 비스트로',
      rating: 4.6,
      phoneNumber: '02-547-9100'
    },
    {
      name: '스시조',
      category: '일식',
      address: '서울 강남구 언주로153길 10',
      coordinates: { lat: 37.523789, lng: 127.034567 },
      priceRange: '₩₩₩₩',
      description: '도쿄 긴자 본점의 맛을 그대로',
      rating: 4.9,
      phoneNumber: '02-3445-1952'
    },
    {
      name: '테이블 포 포',
      category: '이탈리안',
      address: '서울 강남구 청담동 83-6',
      coordinates: { lat: 37.524123, lng: 127.042567 },
      priceRange: '₩₩₩',
      description: '청담동 숨은 이탈리안 레스토랑',
      rating: 4.5,
      phoneNumber: '02-543-4567'
    }
  ],

  // 혼밥 맛집
  solo_dining: [
    {
      name: '이치란 라멘 강남',
      category: '일식',
      address: '서울 강남구 강남대로 429',
      coordinates: { lat: 37.502035, lng: 127.026954 },
      priceRange: '₩₩',
      description: '1인 좌석 완비, 진한 돈코츠 라멘',
      rating: 4.4,
      phoneNumber: '02-6203-1947'
    },
    {
      name: '김밥천국 강남역점',
      category: '분식',
      address: '서울 강남구 강남대로 396',
      coordinates: { lat: 37.498095, lng: 127.028046 },
      priceRange: '₩',
      description: '24시간 운영, 빠르고 간편한 한끼',
      rating: 3.8,
      phoneNumber: '02-555-1234'
    },
    {
      name: '아비꼬 카레',
      category: '일식',
      address: '서울 종로구 율곡로 56',
      coordinates: { lat: 37.574124, lng: 126.985674 },
      priceRange: '₩',
      description: '일본식 카레 전문점, 카운터석 완비',
      rating: 4.3,
      phoneNumber: '02-765-5580'
    },
    {
      name: '육전식당',
      category: '한식',
      address: '서울 마포구 마포대로12길 17',
      coordinates: { lat: 37.549884, lng: 126.954673 },
      priceRange: '₩₩',
      description: '1인 고기 정식, 혼밥족 성지',
      rating: 4.5,
      phoneNumber: '02-332-2255'
    },
    {
      name: '혼밥하는남자 홍대점',
      category: '한식',
      address: '서울 마포구 홍익로 10',
      coordinates: { lat: 37.556789, lng: 126.923456 },
      priceRange: '₩₩',
      description: '1인 세트 메뉴 전문점',
      rating: 4.2,
      phoneNumber: '02-334-5678'
    }
  ],

  // 가성비 맛집
  budget_eats: [
    {
      name: '광장시장 마약김밥',
      category: '분식',
      address: '서울 종로구 창경궁로 88',
      coordinates: { lat: 37.570028, lng: 126.999669 },
      priceRange: '₩',
      description: '중독성 있는 미니 김밥',
      rating: 4.4,
      phoneNumber: '02-2267-0291'
    },
    {
      name: '신림동 백순대',
      category: '한식',
      address: '서울 관악구 신림로59길 14',
      coordinates: { lat: 37.484123, lng: 126.929456 },
      priceRange: '₩',
      description: '푸짐한 순대국밥',
      rating: 4.3,
      phoneNumber: '02-888-5678'
    },
    {
      name: '명동교자 본점',
      category: '한식',
      address: '서울 중구 명동10길 29',
      coordinates: { lat: 37.562678, lng: 126.985432 },
      priceRange: '₩',
      description: '칼국수와 만두의 정석',
      rating: 4.2,
      phoneNumber: '02-776-5348'
    },
    {
      name: '을지로 노가리 골목',
      category: '술집',
      address: '서울 중구 을지로13길',
      coordinates: { lat: 37.565789, lng: 126.991234 },
      priceRange: '₩',
      description: '저렴한 안주와 생맥주',
      rating: 4.1,
      phoneNumber: '02-2265-1234'
    },
    {
      name: '이대 엽기떡볶이',
      category: '분식',
      address: '서울 서대문구 이화여대길 52',
      coordinates: { lat: 37.559234, lng: 126.946789 },
      priceRange: '₩',
      description: '매운맛의 진수',
      rating: 4.0,
      phoneNumber: '02-364-5678'
    }
  ],

  // 디저트 카페
  dessert_cafes: [
    {
      name: '도레도레',
      category: '디저트',
      address: '서울 강남구 도산대로49길 39',
      coordinates: { lat: 37.523456, lng: 127.038901 },
      priceRange: '₩₩',
      description: '수플레 팬케이크 맛집',
      rating: 4.6,
      phoneNumber: '02-515-3369'
    },
    {
      name: '피에르 가니에르 디저트 바',
      category: '디저트',
      address: '서울 중구 소공로 119',
      coordinates: { lat: 37.565123, lng: 126.981234 },
      priceRange: '₩₩₩',
      description: '미쉐린 셰프의 디저트',
      rating: 4.7,
      phoneNumber: '02-317-7181'
    },
    {
      name: '루이스 해밀턴 도넛',
      category: '디저트',
      address: '서울 용산구 이태원로 244',
      coordinates: { lat: 37.534567, lng: 126.994567 },
      priceRange: '₩₩',
      description: '프리미엄 수제 도넛',
      rating: 4.5,
      phoneNumber: '02-797-2233'
    },
    {
      name: '레이어드 성수',
      category: '카페',
      address: '서울 성동구 성수이로7길 51',
      coordinates: { lat: 37.544567, lng: 127.055678 },
      priceRange: '₩₩',
      description: '성수동 감성 베이커리 카페',
      rating: 4.4,
      phoneNumber: '02-461-1945'
    },
    {
      name: '빌리엔젤 케이크',
      category: '디저트',
      address: '서울 강남구 논현로175길 81',
      coordinates: { lat: 37.522345, lng: 127.031234 },
      priceRange: '₩₩₩',
      description: '프리미엄 생크림 케이크',
      rating: 4.8,
      phoneNumber: '02-544-0807'
    }
  ],

  // 술집 추천
  bar_hopping: [
    {
      name: '찰스 H.',
      category: '바',
      address: '서울 강남구 도산대로67길 15',
      coordinates: { lat: 37.524678, lng: 127.039012 },
      priceRange: '₩₩₩₩',
      description: '아시아 50베스트 바',
      rating: 4.8,
      phoneNumber: '02-542-3141'
    },
    {
      name: '르 챔버',
      category: '바',
      address: '서울 강남구 선릉로152길 23',
      coordinates: { lat: 37.521234, lng: 127.040567 },
      priceRange: '₩₩₩',
      description: '스피크이지 칵테일 바',
      rating: 4.7,
      phoneNumber: '02-6339-3939'
    },
    {
      name: '앨리스 청담',
      category: '바',
      address: '서울 강남구 도산대로81길 6',
      coordinates: { lat: 37.525678, lng: 127.041234 },
      priceRange: '₩₩₩',
      description: '이상한 나라의 앨리스 컨셉 바',
      rating: 4.6,
      phoneNumber: '02-545-5678'
    },
    {
      name: '믹솔로지 살롱',
      category: '바',
      address: '서울 중구 을지로 30',
      coordinates: { lat: 37.567890, lng: 126.991234 },
      priceRange: '₩₩₩',
      description: '시그니처 칵테일 전문',
      rating: 4.5,
      phoneNumber: '02-2277-5678'
    },
    {
      name: '사우스사이드 팔러',
      category: '바',
      address: '서울 용산구 이태원로54길 8',
      coordinates: { lat: 37.534567, lng: 126.993456 },
      priceRange: '₩₩₩',
      description: '이태원 루프탑 바',
      rating: 4.4,
      phoneNumber: '02-749-7749'
    }
  ],

  // 채식 맛집
  vegetarian: [
    {
      name: '산촌',
      category: '사찰음식',
      address: '서울 종로구 인사동길 30-1',
      coordinates: { lat: 37.573456, lng: 126.985678 },
      priceRange: '₩₩₩',
      description: '전통 사찰음식 코스',
      rating: 4.6,
      phoneNumber: '02-735-0312'
    },
    {
      name: '플랜트',
      category: '비건',
      address: '서울 용산구 이태원로 46',
      coordinates: { lat: 37.533456, lng: 126.994567 },
      priceRange: '₩₩',
      description: '비건 버거와 샐러드',
      rating: 4.5,
      phoneNumber: '02-749-1981'
    },
    {
      name: '러빙헛',
      category: '비건',
      address: '서울 강남구 언주로30길 10',
      coordinates: { lat: 37.519012, lng: 127.033456 },
      priceRange: '₩₩',
      description: '국제 비건 체인 레스토랑',
      rating: 4.3,
      phoneNumber: '02-576-9637'
    },
    {
      name: '오세계향',
      category: '채식뷔페',
      address: '서울 종로구 율곡로 56',
      coordinates: { lat: 37.574567, lng: 126.985123 },
      priceRange: '₩₩',
      description: '채식 한식 뷔페',
      rating: 4.4,
      phoneNumber: '02-739-7171'
    },
    {
      name: '베제투스',
      category: '비건',
      address: '서울 마포구 와우산로29길 24',
      coordinates: { lat: 37.555678, lng: 126.924567 },
      priceRange: '₩₩',
      description: '홍대 비건 레스토랑',
      rating: 4.2,
      phoneNumber: '02-3141-1010'
    }
  ],

  // 브런치 맛집
  brunch: [
    {
      name: '빌즈',
      category: '브런치',
      address: '서울 강남구 논현로175길 82',
      coordinates: { lat: 37.522678, lng: 127.030123 },
      priceRange: '₩₩₩',
      description: '호주식 브런치, 리코타 팬케이크',
      rating: 4.5,
      phoneNumber: '02-541-1705'
    },
    {
      name: '더 플라잉 팬 블루',
      category: '브런치',
      address: '서울 용산구 이태원로27가길 46',
      coordinates: { lat: 37.532345, lng: 126.994567 },
      priceRange: '₩₩',
      description: '미국식 브런치 전문',
      rating: 4.4,
      phoneNumber: '02-792-1835'
    },
    {
      name: '브레드05',
      category: '베이커리',
      address: '서울 마포구 성미산로17길 66',
      coordinates: { lat: 37.555123, lng: 126.918901 },
      priceRange: '₩₩',
      description: '수제 빵과 브런치',
      rating: 4.3,
      phoneNumber: '02-325-0505'
    },
    {
      name: '카페 마마스',
      category: '브런치',
      address: '서울 중구 소공로 112',
      coordinates: { lat: 37.564567, lng: 126.981234 },
      priceRange: '₩₩',
      description: '리코타 샐러드로 유명',
      rating: 4.2,
      phoneNumber: '02-777-7007'
    },
    {
      name: '에그슬럿',
      category: '브런치',
      address: '서울 강남구 강남대로 452',
      coordinates: { lat: 37.503456, lng: 127.027890 },
      priceRange: '₩₩',
      description: 'LA 스타일 에그 샌드위치',
      rating: 4.4,
      phoneNumber: '02-6203-2030'
    }
  ],

  // 야식 추천
  late_night: [
    {
      name: '원조원할머니보쌈',
      category: '한식',
      address: '서울 종로구 대학로8가길 15',
      coordinates: { lat: 37.582345, lng: 127.002345 },
      priceRange: '₩₩',
      description: '새벽 2시까지, 족발보쌈',
      rating: 4.3,
      phoneNumber: '02-747-5859'
    },
    {
      name: '종로 포장마차',
      category: '포차',
      address: '서울 종로구 종로12길',
      coordinates: { lat: 37.570123, lng: 126.997890 },
      priceRange: '₩₩',
      description: '종로의 명물 포장마차 거리',
      rating: 4.0,
      phoneNumber: '없음'
    },
    {
      name: '용금옥',
      category: '한식',
      address: '서울 마포구 토정로37길 47',
      coordinates: { lat: 37.548901, lng: 126.955678 },
      priceRange: '₩₩',
      description: '24시간 추어탕',
      rating: 4.2,
      phoneNumber: '02-335-1110'
    },
    {
      name: '유가네 닭갈비',
      category: '한식',
      address: '서울 강남구 역삼로 146',
      coordinates: { lat: 37.495678, lng: 127.032345 },
      priceRange: '₩₩',
      description: '새벽까지 영업하는 닭갈비',
      rating: 4.1,
      phoneNumber: '02-568-1990'
    },
    {
      name: '한양 양꼬치',
      category: '중식',
      address: '서울 중구 을지로6가 18-21',
      coordinates: { lat: 37.566789, lng: 127.009012 },
      priceRange: '₩₩',
      description: '동대문 양꼬치 골목',
      rating: 4.0,
      phoneNumber: '02-2279-6789'
    }
  ],

  // 지역별 맛집 - 강남
  gangnam_best: [
    {
      name: '가로수길 미도인',
      category: '일식',
      address: '서울 강남구 압구정로10길 28',
      coordinates: { lat: 37.520123, lng: 127.022345 },
      priceRange: '₩₩₩',
      description: '가로수길 히든 일식당',
      rating: 4.5,
      phoneNumber: '02-3442-0071'
    },
    {
      name: '성일집',
      category: '한식',
      address: '서울 강남구 강남대로102길 34',
      coordinates: { lat: 37.504567, lng: 127.026789 },
      priceRange: '₩₩',
      description: '강남 직장인 점심 맛집',
      rating: 4.3,
      phoneNumber: '02-555-6688'
    },
    {
      name: '류니끄',
      category: '프렌치',
      address: '서울 강남구 도산대로 317',
      coordinates: { lat: 37.522901, lng: 127.039456 },
      priceRange: '₩₩₩₩',
      description: '미쉐린 1스타 프렌치',
      rating: 4.7,
      phoneNumber: '02-545-0117'
    },
    {
      name: '오복수산',
      category: '일식',
      address: '서울 강남구 봉은사로4길 24',
      coordinates: { lat: 37.503456, lng: 127.025678 },
      priceRange: '₩₩₩',
      description: '신선한 회와 스시',
      rating: 4.4,
      phoneNumber: '02-553-3181'
    },
    {
      name: '한일관',
      category: '한식',
      address: '서울 강남구 압구정로38길 14',
      coordinates: { lat: 37.526789, lng: 127.035678 },
      priceRange: '₩₩₩',
      description: '전통 불고기 전문',
      rating: 4.6,
      phoneNumber: '02-544-5959'
    }
  ],

  // 지역별 맛집 - 홍대
  hongdae_best: [
    {
      name: '연남동 감나무집',
      category: '한식',
      address: '서울 마포구 연남로1길 45',
      coordinates: { lat: 37.559012, lng: 126.925678 },
      priceRange: '₩₩',
      description: '연남동 한정식',
      rating: 4.4,
      phoneNumber: '02-332-3394'
    },
    {
      name: '홍대 조폭떡볶이',
      category: '분식',
      address: '서울 마포구 홍익로6길 12',
      coordinates: { lat: 37.554567, lng: 126.924567 },
      priceRange: '₩',
      description: '홍대 명물 떡볶이',
      rating: 4.2,
      phoneNumber: '02-337-8892'
    },
    {
      name: '메밀꽃필무렵',
      category: '한식',
      address: '서울 마포구 동교로27길 16',
      coordinates: { lat: 37.558901, lng: 126.923456 },
      priceRange: '₩₩',
      description: '막걸리와 파전',
      rating: 4.3,
      phoneNumber: '02-332-6966'
    },
    {
      name: '더 브레드 블루',
      category: '베이커리',
      address: '서울 마포구 와우산로21길 36',
      coordinates: { lat: 37.553456, lng: 126.922345 },
      priceRange: '₩₩',
      description: '수제 베이커리 카페',
      rating: 4.5,
      phoneNumber: '02-326-0203'
    },
    {
      name: '연남장',
      category: '이자카야',
      address: '서울 마포구 성미산로29안길 8',
      coordinates: { lat: 37.560123, lng: 126.924567 },
      priceRange: '₩₩',
      description: '연남동 이자카야',
      rating: 4.4,
      phoneNumber: '02-325-1230'
    }
  ]
};

// 플레이리스트와 맛집 매핑
const playlistRestaurantMapping = {
  '강남 데이트 코스 맛집 10선': 'date_spots',
  '혼밥하기 좋은 맛집 모음': 'solo_dining',
  '서울 가성비 맛집 TOP 20': 'budget_eats',
  '인스타 감성 디저트 카페': 'dessert_cafes',
  '금요일 밤 술집 추천': 'bar_hopping',
  '비건/채식 맛집 가이드': 'vegetarian',
  '브런치 맛집 컬렉션': 'brunch',
  '야식 맛집 리스트': 'late_night',
  '강남 맛집 완전정복': 'gangnam_best',
  '홍대 맛집 지도': 'hongdae_best',
  '미쉐린 가이드 서울': 'date_spots', // 고급 레스토랑
  '회식장소 추천 리스트': 'gangnam_best',
  '퇴근 후 한잔 맛집': 'bar_hopping',
  '주말 데이트 코스': 'date_spots',
  '성수동 핫플레이스': 'dessert_cafes',
  '이태원 맛집 탐방': 'brunch',
  '종로 노포 맛집': 'budget_eats',
  '마포구 맛집 지도': 'hongdae_best',
  '여의도 점심 맛집': 'gangnam_best',
  '망원동 맛집 투어': 'hongdae_best'
};

async function seedPlaylistRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Playlist = require('./server/models/Playlist');
    const Restaurant = require('./server/models/Restaurant');
    const User = require('./server/models/User');

    // 시스템 사용자 찾기 또는 생성
    let systemUser = await User.findOne({ username: 'system' });
    if (!systemUser) {
      systemUser = await User.create({
        username: 'system',
        email: 'system@bobmap.com',
        password: 'system123456',
        tasteProfile: {
          type: 'premium_diner',
          preferences: {
            spicyLevel: 3,
            sweetLevel: 3,
            priceRange: 3
          }
        }
      });
      console.log('✅ 시스템 사용자 생성 완료');
    }

    // 모든 플레이리스트 가져오기
    const playlists = await Playlist.find({});
    console.log(`📋 ${playlists.length}개의 플레이리스트 발견`);

    for (const playlist of playlists) {
      const mappingKey = playlistRestaurantMapping[playlist.title];
      
      if (!mappingKey) {
        console.log(`⚠️ "${playlist.title}"에 대한 매핑 없음, 건너뜀`);
        continue;
      }

      const restaurants = restaurantData[mappingKey];
      if (!restaurants) {
        console.log(`⚠️ "${mappingKey}"에 대한 레스토랑 데이터 없음`);
        continue;
      }

      console.log(`\n🍽️ "${playlist.title}"에 맛집 추가 중...`);
      
      const restaurantIds = [];
      for (const restaurantInfo of restaurants) {
        // 기존 레스토랑 확인
        let restaurant = await Restaurant.findOne({ 
          name: restaurantInfo.name,
          address: restaurantInfo.address 
        });

        if (!restaurant) {
          // 새 레스토랑 생성
          restaurant = await Restaurant.create({
            ...restaurantInfo,
            createdBy: systemUser._id,
            images: [
              `https://picsum.photos/400/300?random=${Math.random()}`,
              `https://picsum.photos/400/300?random=${Math.random()}`,
              `https://picsum.photos/400/300?random=${Math.random()}`
            ],
            tags: [restaurantInfo.category, restaurantInfo.priceRange, '인기'],
            viewCount: Math.floor(Math.random() * 1000) + 100,
            likeCount: Math.floor(Math.random() * 100) + 10,
            isVerified: true,
            operatingHours: {
              monday: '11:00 - 22:00',
              tuesday: '11:00 - 22:00',
              wednesday: '11:00 - 22:00',
              thursday: '11:00 - 22:00',
              friday: '11:00 - 23:00',
              saturday: '11:00 - 23:00',
              sunday: '11:00 - 21:00'
            }
          });
          console.log(`  ✅ "${restaurant.name}" 생성됨`);
        } else {
          console.log(`  ℹ️ "${restaurant.name}" 이미 존재함`);
        }

        restaurantIds.push(restaurant._id);
      }

      // 플레이리스트 업데이트
      playlist.restaurants = restaurantIds;
      playlist.restaurantCount = restaurantIds.length;
      await playlist.save();
      
      console.log(`  ✅ ${restaurantIds.length}개 맛집이 플레이리스트에 추가됨`);
    }

    console.log('\n✅ 모든 플레이리스트에 맛집 데이터 추가 완료!');
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedPlaylistRestaurants();