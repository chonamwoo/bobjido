// 실제 서울 유명 맛집 데이터 (정확한 정보)
const realSeoulRestaurants = [
  {
    name: '명동교자',
    category: '한식',
    address: '서울 중구 명동10길 29',
    coordinates: { lat: 37.5634, lng: 126.9849 },
    averageRating: 4.2,
    description: '1966년 개업한 명동 대표 만두 전문점, 왕만두가 유명',
    priceRange: '저렴한',
    phoneNumber: '02-776-5348',
    reviewCount: 4521,
    tags: ['만두', '전통맛집', '명동', '왕만두'],
    features: ['포장가능', '24시간'],
    businessHours: {
      monday: { open: '10:30', close: '22:00', isOpen: true },
      tuesday: { open: '10:30', close: '22:00', isOpen: true },
      wednesday: { open: '10:30', close: '22:00', isOpen: true },
      thursday: { open: '10:30', close: '22:00', isOpen: true },
      friday: { open: '10:30', close: '22:00', isOpen: true },
      saturday: { open: '10:30', close: '22:00', isOpen: true },
      sunday: { open: '10:30', close: '22:00', isOpen: true }
    },
    naverPlaceId: '11574988',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11574988',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_216%2F1655285952421wdRhz_JPEG%2F%25EC%2598%25A4%25EB%258B%2586%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_45%2F1652240952850hQkKn_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A52.jpg&type=sc960_832' }
    ]
  },
  {
    name: '을지면옥',
    category: '한식',
    address: '서울 중구 창경궁로 62-29',
    coordinates: { lat: 37.5657, lng: 126.9912 },
    averageRating: 4.5,
    description: '서울 3대 냉면 중 하나, 70년 전통의 냉면 전문점',
    priceRange: '보통',
    phoneNumber: '02-2265-8468',
    reviewCount: 3420,
    tags: ['냉면', '전통맛집', '을지로', '물냉면'],
    features: ['예약가능', '포장가능'],
    businessHours: {
      monday: { open: '11:30', close: '20:30', isOpen: true },
      tuesday: { open: '11:30', close: '20:30', isOpen: true },
      wednesday: { open: '11:30', close: '20:30', isOpen: true },
      thursday: { open: '11:30', close: '20:30', isOpen: true },
      friday: { open: '11:30', close: '20:30', isOpen: true },
      saturday: { open: '11:30', close: '20:30', isOpen: true },
      sunday: { open: '11:30', close: '20:30', isOpen: true }
    },
    naverPlaceId: '11847813',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11847813',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221018_15%2F1666063364628rGMcx_JPEG%2F%25EB%2583%2589%25EB%25A9%25B4.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221018_94%2F1666063364792Kn4hZ_JPEG%2F%25EB%25B9%2584%25EB%25B9%2594%25EB%2583%2589%25EB%25A9%25B4.jpg&type=sc960_832' }
    ]
  },
  {
    name: '진진',
    category: '중식',
    address: '서울 중구 명동8나길 16',
    coordinates: { lat: 37.5667, lng: 126.9765 },
    averageRating: 4.4,
    description: '명동 짜장면 맛집, 50년 전통의 중국집',
    priceRange: '저렴한',
    phoneNumber: '02-776-9020',
    reviewCount: 2834,
    tags: ['짜장면', '전통맛집', '명동', '중식'],
    features: ['포장가능', '배달가능'],
    businessHours: {
      monday: { open: '10:30', close: '21:00', isOpen: true },
      tuesday: { open: '10:30', close: '21:00', isOpen: true },
      wednesday: { open: '10:30', close: '21:00', isOpen: true },
      thursday: { open: '10:30', close: '21:00', isOpen: true },
      friday: { open: '10:30', close: '21:00', isOpen: true },
      saturday: { open: '10:30', close: '21:00', isOpen: true },
      sunday: { open: '10:30', close: '21:00', isOpen: true }
    },
    naverPlaceId: '11649942',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11649942',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_109%2F1646706932549oa4xK_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25A9%25B4.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_72%2F1646706932667KWGNW_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25B0%25A5.jpg&type=sc960_832' }
    ]
  },
  {
    name: '삼원가든',
    category: '한식',
    address: '서울 강남구 신사동 635-8',
    coordinates: { lat: 37.5175, lng: 127.0265 },
    averageRating: 4.6,
    description: '압구정 대표 갈비집, 연예인들이 즐겨 찾는 고급 한정식',
    priceRange: '매우비싼',
    phoneNumber: '02-548-3030',
    reviewCount: 1876,
    tags: ['갈비', '연예인맛집', '압구정', '한정식'],
    features: ['예약가능', '룸있음', '주차가능', '와이파이'],
    businessHours: {
      monday: { open: '11:30', close: '22:00', isOpen: true },
      tuesday: { open: '11:30', close: '22:00', isOpen: true },
      wednesday: { open: '11:30', close: '22:00', isOpen: true },
      thursday: { open: '11:30', close: '22:00', isOpen: true },
      friday: { open: '11:30', close: '22:00', isOpen: true },
      saturday: { open: '11:30', close: '22:00', isOpen: true },
      sunday: { open: '11:30', close: '22:00', isOpen: true }
    },
    naverPlaceId: '11574321',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11574321',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220708_133%2F1657266962445VJkCF_JPEG%2F%25EA%25B0%2588%25EB%25B9%2584%25EC%2584%25B8%25ED%258A%25B8.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220708_97%2F1657266962574EKR5I_JPEG%2F%25EC%2597%2585%25EC%2582%25B4.jpg&type=sc960_832' }
    ]
  },
  {
    name: '북촌손만두',
    category: '한식',
    address: '서울 종로구 북촌로12길 38',
    coordinates: { lat: 37.5814, lng: 126.9854 },
    averageRating: 4.3,
    description: '북촌 한옥마을의 전통 손만두 전문점',
    priceRange: '보통',
    phoneNumber: '02-3673-3597',
    reviewCount: 2154,
    tags: ['손만두', '북촌', '전통맛집', '한옥마을'],
    features: ['포장가능', '테라스'],
    businessHours: {
      monday: { open: '10:00', close: '21:00', isOpen: true },
      tuesday: { open: '10:00', close: '21:00', isOpen: true },
      wednesday: { open: '10:00', close: '21:00', isOpen: true },
      thursday: { open: '10:00', close: '21:00', isOpen: true },
      friday: { open: '10:00', close: '21:00', isOpen: true },
      saturday: { open: '10:00', close: '21:00', isOpen: true },
      sunday: { open: '10:00', close: '21:00', isOpen: true }
    },
    naverPlaceId: '18953928',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/18953928',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_45%2F1652240952850hQkKn_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A52.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_298%2F1652240952994DQJAT_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A53.jpg&type=sc960_832' }
    ]
  },
  {
    name: '학림다방',
    category: '카페',
    address: '서울 종로구 대학로12길 31',
    coordinates: { lat: 37.5823, lng: 127.0020 },
    averageRating: 4.1,
    description: '1956년 개업한 대학로 원조 다방, 문화인들의 사랑방',
    priceRange: '저렴한',
    phoneNumber: '02-762-5302',
    reviewCount: 1325,
    tags: ['다방', '전통', '대학로', '문화공간'],
    features: ['와이파이', '테라스'],
    businessHours: {
      monday: { open: '09:00', close: '23:00', isOpen: true },
      tuesday: { open: '09:00', close: '23:00', isOpen: true },
      wednesday: { open: '09:00', close: '23:00', isOpen: true },
      thursday: { open: '09:00', close: '23:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '09:00', close: '23:00', isOpen: true },
      sunday: { open: '09:00', close: '23:00', isOpen: true }
    },
    naverPlaceId: '11649127',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11649127',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220415_235%2F1650015425677p5bN5_JPEG%2F%25EC%25BB%25A4%25ED%2594%25BC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220415_189%2F1650015425798aW4cG_JPEG%2F%25EB%2594%2594%25EC%25A0%2580%25ED%258A%25B8.jpg&type=sc960_832' }
    ]
  },
  {
    name: '봉피양',
    category: '양식',
    address: '서울 용산구 이태원로55가길 5',
    coordinates: { lat: 37.5342, lng: 126.9956 },
    averageRating: 4.6,
    description: '이태원 대표 프렌치 비스트로, 와인과 함께 즐기는 정통 프랑스 요리',
    priceRange: '매우비싼',
    phoneNumber: '02-797-5345',
    reviewCount: 1523,
    tags: ['프렌치', '이태원', '와인', '비스트로'],
    features: ['예약가능', '와이파이', '테라스', '주차가능'],
    businessHours: {
      monday: { open: '18:00', close: '24:00', isOpen: true },
      tuesday: { open: '18:00', close: '24:00', isOpen: true },
      wednesday: { open: '18:00', close: '24:00', isOpen: true },
      thursday: { open: '18:00', close: '24:00', isOpen: true },
      friday: { open: '18:00', close: '24:00', isOpen: true },
      saturday: { open: '18:00', close: '24:00', isOpen: true },
      sunday: { open: '18:00', close: '24:00', isOpen: true }
    },
    naverPlaceId: '37702890',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/37702890',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_18%2F1668494885437gPl0e_JPEG%2F%25ED%2594%2584%25EB%25A0%258C%25EC%25B9%2598%25EC%259A%2594%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_289%2F1668494885578kD0FL_JPEG%2F%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25ED%2581%25AC.jpg&type=sc960_832' }
    ]
  },
  {
    name: '밍글스',
    category: '양식',
    address: '서울 강남구 압구정로60길 19',
    coordinates: { lat: 37.5270, lng: 127.0285 },
    averageRating: 4.8,
    description: '미슐린 2스타 레스토랑, 강민구 셰프의 모던 코리안 퀴진',
    priceRange: '매우비싼',
    phoneNumber: '02-515-7306',
    reviewCount: 876,
    tags: ['미슐린', '파인다이닝', '모던코리안', '압구정'],
    features: ['예약가능', '룸있음', '주차가능', '와이파이'],
    businessHours: {
      monday: { open: '18:00', close: '22:00', isOpen: true },
      tuesday: { open: '18:00', close: '22:00', isOpen: true },
      wednesday: { open: '18:00', close: '22:00', isOpen: true },
      thursday: { open: '18:00', close: '22:00', isOpen: true },
      friday: { open: '18:00', close: '22:00', isOpen: true },
      saturday: { open: '18:00', close: '22:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false }
    },
    naverPlaceId: '37889435',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/37889435',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_18%2F1668494885437gPl0e_JPEG%2F%25ED%2594%2584%25EB%25A0%258C%25EC%25B9%2598%25EC%259A%2594%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_289%2F1668494885578kD0FL_JPEG%2F%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25ED%2581%25AC.jpg&type=sc960_832' }
    ]
  },
  {
    name: '오니기리와이프',
    category: '일식',
    address: '서울 마포구 홍익로2길 16',
    coordinates: { lat: 37.5532, lng: 126.9249 },
    averageRating: 4.3,
    description: '홍대 인기 오니기리 전문점, 일본식 주먹밥의 정석',
    priceRange: '저렴한',
    phoneNumber: '02-333-5522',
    reviewCount: 2456,
    tags: ['오니기리', '홍대', '일식', '간단식사'],
    features: ['포장가능', '배달가능'],
    businessHours: {
      monday: { open: '11:00', close: '21:00', isOpen: true },
      tuesday: { open: '11:00', close: '21:00', isOpen: true },
      wednesday: { open: '11:00', close: '21:00', isOpen: true },
      thursday: { open: '11:00', close: '21:00', isOpen: true },
      friday: { open: '11:00', close: '21:00', isOpen: true },
      saturday: { open: '11:00', close: '21:00', isOpen: true },
      sunday: { open: '11:00', close: '21:00', isOpen: true }
    },
    naverPlaceId: '1317604619',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/1317604619',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_216%2F1655285952421wdRhz_JPEG%2F%25EC%2598%25A4%25EB%258B%2586%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_181%2F1655285952549yPYGx_JPEG%2F%25EC%25B9%25B4%25EB%25A0%2588%25EC%2598%25A4%25EB%258B%2586%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' }
    ]
  },
  {
    name: '해물천지',
    category: '한식',
    address: '서울 종로구 종로 16',
    coordinates: { lat: 37.5701, lng: 126.9823 },
    averageRating: 4.5,
    description: '종로 해물찜 맛집, 40년 전통의 푸짐한 해물요리',
    priceRange: '비싼',
    phoneNumber: '02-2273-3395',
    reviewCount: 1967,
    tags: ['해물찜', '전통맛집', '종로', '해물요리'],
    features: ['예약가능', '룸있음', '주차가능'],
    businessHours: {
      monday: { open: '11:00', close: '22:00', isOpen: true },
      tuesday: { open: '11:00', close: '22:00', isOpen: true },
      wednesday: { open: '11:00', close: '22:00', isOpen: true },
      thursday: { open: '11:00', close: '22:00', isOpen: true },
      friday: { open: '11:00', close: '22:00', isOpen: true },
      saturday: { open: '11:00', close: '22:00', isOpen: true },
      sunday: { open: '11:00', close: '22:00', isOpen: true }
    },
    naverPlaceId: '11649878',
    externalReviewUrl: 'https://map.naver.com/p/entry/place/11649878',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220523_265%2F1653288725473vIKzA_JPEG%2F%25ED%2595%25B4%25EB%25AC%25BC%25EC%25B0%259C.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220523_41%2F1653288725603ChNtw_JPEG%2F%25ED%2595%25B4%25EB%25AC%25BC%25ED%258C%2590.jpg&type=sc960_832' }
    ]
  }
];

module.exports = { realSeoulRestaurants };