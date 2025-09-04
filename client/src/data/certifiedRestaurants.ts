// 미디어/프로그램 인증 맛집 데이터
export const certifiedRestaurants = [
  // 미쉐린 가이드
  {
    id: 'michelin-001',
    name: '라연',
    category: '한식',
    subcategory: '한정식',
    address: '서울 중구 동호로 249 신라호텔',
    certification: ['michelin'],
    priceRange: 'veryExpensive',
    rating: 4.8,
    description: '미쉐린 3스타, 한국 전통의 맛을 현대적으로 재해석',
    atmosphere: ['formal', 'quiet', 'traditional'],
    features: ['parking', 'valet', 'reservation', 'privateRoom'],
    openingHours: { 
      월: '12:00-15:00, 18:00-22:00',
      화: '12:00-15:00, 18:00-22:00',
      수: '12:00-15:00, 18:00-22:00',
      목: '12:00-15:00, 18:00-22:00',
      금: '12:00-15:00, 18:00-22:00',
      토: '12:00-15:00, 18:00-22:00',
      일: '휴무'
    }
  },
  {
    id: 'michelin-002',
    name: '정식당',
    category: '한식',
    subcategory: '모던한식',
    address: '서울 강남구 선릉로158길 11',
    certification: ['michelin'],
    priceRange: 'veryExpensive',
    rating: 4.7,
    description: '미쉐린 2스타, 모던 코리안 파인다이닝',
    atmosphere: ['modern', 'quiet', 'instagrammable'],
    features: ['parking', 'reservation', 'privateRoom', 'wifi'],
    openingHours: {
      월: '휴무',
      화: '12:00-15:00, 18:00-22:00',
      수: '12:00-15:00, 18:00-22:00',
      목: '12:00-15:00, 18:00-22:00',
      금: '12:00-15:00, 18:00-22:00',
      토: '12:00-15:00, 18:00-22:00',
      일: '12:00-15:00, 18:00-22:00'
    }
  },

  // 흑백요리사 출연 맛집
  {
    id: 'blacknwhite-001',
    name: '진진',
    category: '중식',
    subcategory: '짜장면/짬뽕',
    address: '서울 종로구 돈화문로11길 30',
    certification: ['blacknwhite'],
    priceRange: 'moderate',
    rating: 4.6,
    description: '흑백요리사 우승자 중식당, 전통 짜장면의 정석',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['reservation', 'takeout', 'delivery'],
    openingHours: {
      월: '11:00-21:00',
      화: '11:00-21:00',
      수: '11:00-21:00',
      목: '11:00-21:00',
      금: '11:00-21:00',
      토: '11:00-21:00',
      일: '11:00-20:00'
    }
  },
  {
    id: 'blacknwhite-002',
    name: '팔색삼겹살',
    category: '한식',
    subcategory: '구이/고기',
    address: '서울 마포구 와우산로 35',
    certification: ['blacknwhite'],
    priceRange: 'expensive',
    rating: 4.5,
    description: '흑백요리사 출연, 8가지 맛의 삼겹살 전문점',
    atmosphere: ['lively', 'modern', 'casual'],
    features: ['reservation', 'parking', 'lateNight'],
    openingHours: {
      월: '16:00-02:00',
      화: '16:00-02:00',
      수: '16:00-02:00',
      목: '16:00-02:00',
      금: '16:00-04:00',
      토: '16:00-04:00',
      일: '16:00-00:00'
    }
  },

  // 수요미식회
  {
    id: 'wednesday-001',
    name: '을지로 골뱅이',
    category: '한식',
    subcategory: '안주',
    address: '서울 중구 을지로12길 15',
    certification: ['wednesday'],
    priceRange: 'moderate',
    rating: 4.4,
    description: '수요미식회 출연, 40년 전통 골뱅이 무침',
    atmosphere: ['vintage', 'lively', 'casual'],
    features: ['lateNight', 'takeout'],
    openingHours: {
      월: '15:00-01:00',
      화: '15:00-01:00',
      수: '15:00-01:00',
      목: '15:00-01:00',
      금: '15:00-02:00',
      토: '15:00-02:00',
      일: '휴무'
    }
  },
  {
    id: 'wednesday-002',
    name: '광화문국밥',
    category: '한식',
    subcategory: '국밥/해장국',
    address: '서울 종로구 새문안로 9',
    certification: ['wednesday'],
    priceRange: 'cheap',
    rating: 4.3,
    description: '수요미식회 선정, 직장인들의 점심 성지',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['breakfast', 'takeout'],
    openingHours: {
      월: '07:00-21:00',
      화: '07:00-21:00',
      수: '07:00-21:00',
      목: '07:00-21:00',
      금: '07:00-21:00',
      토: '09:00-16:00',
      일: '휴무'
    }
  },

  // 백종원의 3대천왕
  {
    id: 'baekjongwon-001',
    name: '원조 서울 불백',
    category: '한식',
    subcategory: '구이/고기',
    address: '서울 종로구 종로 200-12',
    certification: ['baekjongwon'],
    priceRange: 'moderate',
    rating: 4.4,
    description: '백종원의 3대천왕 1위, 불고기백반 원조',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['parking', 'takeout', 'delivery'],
    openingHours: {
      월: '10:00-22:00',
      화: '10:00-22:00',
      수: '10:00-22:00',
      목: '10:00-22:00',
      금: '10:00-22:00',
      토: '10:00-22:00',
      일: '10:00-21:00'
    }
  },
  {
    id: 'baekjongwon-002',
    name: '명동교자',
    category: '한식',
    subcategory: '만두',
    address: '서울 중구 명동10길 29',
    certification: ['baekjongwon'],
    priceRange: 'cheap',
    rating: 4.2,
    description: '백종원의 3대천왕, 명동 칼국수 만두 맛집',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['takeout'],
    openingHours: {
      월: '10:30-21:30',
      화: '10:30-21:30',
      수: '10:30-21:30',
      목: '10:30-21:30',
      금: '10:30-21:30',
      토: '10:30-21:30',
      일: '10:30-21:30'
    }
  },

  // 생활의달인
  {
    id: 'lifemaster-001',
    name: '대구식당',
    category: '한식',
    subcategory: '백반',
    address: '서울 마포구 마포대로 12',
    certification: ['lifemaster'],
    priceRange: 'cheap',
    rating: 4.5,
    description: '생활의달인, 40년 전통 백반집',
    atmosphere: ['traditional', 'cozy', 'casual'],
    features: ['breakfast', 'parking'],
    openingHours: {
      월: '06:00-21:00',
      화: '06:00-21:00',
      수: '06:00-21:00',
      목: '06:00-21:00',
      금: '06:00-21:00',
      토: '06:00-15:00',
      일: '휴무'
    }
  },
  {
    id: 'lifemaster-002',
    name: '황금족발',
    category: '한식',
    subcategory: '족발/보쌈',
    address: '서울 은평구 통일로 654',
    certification: ['lifemaster'],
    priceRange: 'moderate',
    rating: 4.6,
    description: '생활의달인 족발 달인, 비법 소스의 족발',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['parking', 'delivery', 'takeout', 'lateNight'],
    openingHours: {
      월: '15:00-02:00',
      화: '15:00-02:00',
      수: '15:00-02:00',
      목: '15:00-02:00',
      금: '15:00-04:00',
      토: '15:00-04:00',
      일: '15:00-00:00'
    }
  },

  // 성시경의 먹을텐데
  {
    id: 'sungsikyung-001',
    name: '성수동 갈비집',
    category: '한식',
    subcategory: '구이/고기',
    address: '서울 성동구 왕십리로 96',
    certification: ['sungsikyung'],
    priceRange: 'expensive',
    rating: 4.7,
    description: '성시경이 극찬한 숙성 갈비',
    atmosphere: ['modern', 'cozy', 'romantic'],
    features: ['parking', 'valet', 'reservation', 'privateRoom'],
    openingHours: {
      월: '11:30-22:00',
      화: '11:30-22:00',
      수: '11:30-22:00',
      목: '11:30-22:00',
      금: '11:30-23:00',
      토: '11:30-23:00',
      일: '11:30-21:00'
    }
  },
  {
    id: 'sungsikyung-002',
    name: '제주 흑돼지',
    category: '한식',
    subcategory: '구이/고기',
    address: '서울 강남구 논현로 153길 24',
    certification: ['sungsikyung'],
    priceRange: 'expensive',
    rating: 4.5,
    description: '성시경 추천, 제주직송 흑돼지 전문점',
    atmosphere: ['modern', 'lively', 'casual'],
    features: ['parking', 'reservation', 'wifi'],
    openingHours: {
      월: '17:00-00:00',
      화: '17:00-00:00',
      수: '17:00-00:00',
      목: '17:00-00:00',
      금: '17:00-01:00',
      토: '17:00-01:00',
      일: '17:00-23:00'
    }
  },

  // 맛있는 녀석들
  {
    id: 'foodfighters-001',
    name: '부산어묵',
    category: '한식',
    subcategory: '분식',
    address: '서울 종로구 종로3길 32',
    certification: ['foodfighters'],
    priceRange: 'cheap',
    rating: 4.3,
    description: '맛있는 녀석들 출연, 부산직송 어묵',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['takeout', 'delivery'],
    openingHours: {
      월: '10:00-22:00',
      화: '10:00-22:00',
      수: '10:00-22:00',
      목: '10:00-22:00',
      금: '10:00-22:00',
      토: '10:00-22:00',
      일: '10:00-21:00'
    }
  },
  {
    id: 'foodfighters-002',
    name: '치킨매니아',
    category: '패스트푸드',
    subcategory: '치킨',
    address: '서울 강서구 화곡로 176',
    certification: ['foodfighters'],
    priceRange: 'moderate',
    rating: 4.4,
    description: '맛있는 녀석들 치킨 특집 1위',
    atmosphere: ['casual', 'lively', 'modern'],
    features: ['delivery', 'takeout', 'lateNight', 'parking'],
    openingHours: {
      월: '15:00-02:00',
      화: '15:00-02:00',
      수: '15:00-02:00',
      목: '15:00-02:00',
      금: '15:00-03:00',
      토: '15:00-03:00',
      일: '15:00-01:00'
    }
  },

  // 허영만의 백반기행
  {
    id: 'heoymans-001',
    name: '시골밥상',
    category: '한식',
    subcategory: '백반/한식뷔페',
    address: '서울 노원구 동일로 1229',
    certification: ['heoymans'],
    priceRange: 'cheap',
    rating: 4.6,
    description: '허영만 백반기행, 시골 집밥의 정석',
    atmosphere: ['traditional', 'cozy', 'quiet'],
    features: ['parking', 'breakfast'],
    openingHours: {
      월: '07:00-20:00',
      화: '07:00-20:00',
      수: '07:00-20:00',
      목: '07:00-20:00',
      금: '07:00-20:00',
      토: '07:00-15:00',
      일: '휴무'
    }
  },
  {
    id: 'heoymans-002',
    name: '할매순대국',
    category: '한식',
    subcategory: '국밥/해장국',
    address: '서울 구로구 구로동로 28',
    certification: ['heoymans'],
    priceRange: 'cheap',
    rating: 4.4,
    description: '허영만이 인정한 순대국밥',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['open24', 'parking', 'takeout'],
    openingHours: {
      월: '24시간',
      화: '24시간',
      수: '24시간',
      목: '24시간',
      금: '24시간',
      토: '24시간',
      일: '24시간'
    }
  },

  // 백년가게
  {
    id: 'centurystore-001',
    name: '평양면옥',
    category: '한식',
    subcategory: '냉면',
    address: '서울 중구 장충단로 207',
    certification: ['centurystore'],
    priceRange: 'moderate',
    rating: 4.7,
    description: '백년가게, 3대째 이어온 평양냉면',
    atmosphere: ['traditional', 'quiet', 'formal'],
    features: ['parking', 'reservation', 'privateRoom'],
    openingHours: {
      월: '11:00-21:30',
      화: '11:00-21:30',
      수: '11:00-21:30',
      목: '11:00-21:30',
      금: '11:00-21:30',
      토: '11:00-21:30',
      일: '11:00-21:00'
    }
  },
  {
    id: 'centurystore-002',
    name: '하동관',
    category: '한식',
    subcategory: '곰탕',
    address: '서울 중구 명동9길 12',
    certification: ['centurystore'],
    priceRange: 'moderate',
    rating: 4.5,
    description: '백년가게, 1939년 창업 곰탕 전문점',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['breakfast', 'takeout'],
    openingHours: {
      월: '07:00-16:00',
      화: '07:00-16:00',
      수: '07:00-16:00',
      목: '07:00-16:00',
      금: '07:00-16:00',
      토: '07:00-16:00',
      일: '휴무'
    }
  },

  // 최자로드
  {
    id: 'choijaroad-001',
    name: '통영 굴국밥',
    category: '한식',
    subcategory: '국밥/해장국',
    address: '서울 송파구 백제고분로 435',
    certification: ['choijaroad'],
    priceRange: 'cheap',
    rating: 4.3,
    description: '최자로드 추천, 통영식 굴국밥',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['parking', 'breakfast'],
    openingHours: {
      월: '08:00-21:00',
      화: '08:00-21:00',
      수: '08:00-21:00',
      목: '08:00-21:00',
      금: '08:00-21:00',
      토: '08:00-21:00',
      일: '08:00-20:00'
    }
  },
  {
    id: 'choijaroad-002',
    name: '대전 칼국수',
    category: '한식',
    subcategory: '칼국수',
    address: '서울 강동구 천호대로 1006',
    certification: ['choijaroad'],
    priceRange: 'cheap',
    rating: 4.2,
    description: '최자 추천, 대전식 칼국수',
    atmosphere: ['traditional', 'casual', 'lively'],
    features: ['parking', 'takeout'],
    openingHours: {
      월: '10:00-21:00',
      화: '10:00-21:00',
      수: '10:00-21:00',
      목: '10:00-21:00',
      금: '10:00-21:00',
      토: '10:00-21:00',
      일: '10:00-20:00'
    }
  },

  // 한국인의 밥상
  {
    id: 'koreanstable-001',
    name: '전주콩나물국밥',
    category: '한식',
    subcategory: '국밥/해장국',
    address: '서울 종로구 종로35길 16',
    certification: ['koreanstable'],
    priceRange: 'cheap',
    rating: 4.4,
    description: '한국인의 밥상 출연, 전주식 콩나물국밥',
    atmosphere: ['traditional', 'casual', 'cozy'],
    features: ['breakfast', 'open24'],
    openingHours: {
      월: '24시간',
      화: '24시간',
      수: '24시간',
      목: '24시간',
      금: '24시간',
      토: '24시간',
      일: '24시간'
    }
  },
  {
    id: 'koreanstable-002',
    name: '안동찜닭',
    category: '한식',
    subcategory: '찜/조림',
    address: '서울 동대문구 왕산로 274',
    certification: ['koreanstable'],
    priceRange: 'moderate',
    rating: 4.3,
    description: '한국인의 밥상, 원조 안동찜닭',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['parking', 'delivery', 'takeout'],
    openingHours: {
      월: '11:00-22:00',
      화: '11:00-22:00',
      수: '11:00-22:00',
      목: '11:00-22:00',
      금: '11:00-22:00',
      토: '11:00-22:00',
      일: '11:00-21:00'
    }
  },

  // 백종원의 골목식당
  {
    id: 'alleyrestaurant-001',
    name: '홍제동 닭한마리',
    category: '한식',
    subcategory: '닭요리',
    address: '서울 서대문구 통일로 442',
    certification: ['alleyrestaurant'],
    priceRange: 'moderate',
    rating: 4.2,
    description: '백종원 골목식당 출연, 진한 국물의 닭한마리',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['parking', 'reservation'],
    openingHours: {
      월: '11:00-23:00',
      화: '11:00-23:00',
      수: '11:00-23:00',
      목: '11:00-23:00',
      금: '11:00-23:00',
      토: '11:00-23:00',
      일: '11:00-22:00'
    }
  },
  {
    id: 'alleyrestaurant-002',
    name: '포방터시장 떡볶이',
    category: '한식',
    subcategory: '분식',
    address: '서울 송파구 백제고분로41길 47',
    certification: ['alleyrestaurant'],
    priceRange: 'cheap',
    rating: 4.0,
    description: '골목식당 개선 후 대박난 떡볶이',
    atmosphere: ['traditional', 'lively', 'casual'],
    features: ['takeout', 'delivery'],
    openingHours: {
      월: '10:00-21:00',
      화: '10:00-21:00',
      수: '10:00-21:00',
      목: '10:00-21:00',
      금: '10:00-21:00',
      토: '10:00-21:00',
      일: '휴무'
    }
  },

  // 숨은 맛집 (다코)
  {
    id: 'hiddeneatery-001',
    name: '마포 숨은 갈비',
    category: '한식',
    subcategory: '구이/고기',
    address: '서울 마포구 토정로 313',
    certification: ['hiddeneatery'],
    priceRange: 'expensive',
    rating: 4.5,
    description: '다코 숨은맛집, 숙성 갈비 전문',
    atmosphere: ['quiet', 'cozy', 'traditional'],
    features: ['parking', 'reservation', 'privateRoom'],
    openingHours: {
      월: '17:00-23:00',
      화: '17:00-23:00',
      수: '17:00-23:00',
      목: '17:00-23:00',
      금: '17:00-00:00',
      토: '17:00-00:00',
      일: '17:00-22:00'
    }
  },
  {
    id: 'hiddeneatery-002',
    name: '서촌 손만두',
    category: '한식',
    subcategory: '만두',
    address: '서울 종로구 필운대로5길 28',
    certification: ['hiddeneatery'],
    priceRange: 'cheap',
    rating: 4.6,
    description: '다코 선정, 수제 만두 전문점',
    atmosphere: ['traditional', 'quiet', 'cozy'],
    features: ['takeout'],
    openingHours: {
      월: '11:00-20:00',
      화: '11:00-20:00',
      수: '휴무',
      목: '11:00-20:00',
      금: '11:00-20:00',
      토: '11:00-20:00',
      일: '11:00-19:00'
    }
  }
];

// 인증 맛집을 일반 맛집 형식으로 변환하는 헬퍼 함수
export function transformCertifiedToRestaurant(certified: any): any {
  return {
    _id: certified.id,
    name: certified.name,
    category: certified.category,
    subcategory: certified.subcategory,
    address: certified.address,
    priceRange: certified.priceRange,
    averageRating: certified.rating,
    reviewCount: Math.floor(Math.random() * 500) + 100,
    certifications: certified.certification,
    tags: [
      ...certified.atmosphere,
      ...certified.features,
      ...certified.certification.map((cert: string) => 
        certifiedPrograms[cert]?.name || cert
      )
    ],
    dnaProfile: {
      atmosphere: certified.atmosphere,
      features: certified.features,
      certifications: certified.certification,
      description: certified.description
    },
    openingHours: certified.openingHours,
    images: [{ url: `/api/placeholder/400/300?text=${encodeURIComponent(certified.name)}` }]
  };
}

// 프로그램 정보 매핑
const certifiedPrograms: { [key: string]: { name: string, icon: string } } = {
  michelin: { name: '미쉐린', icon: '⭐' },
  blacknwhite: { name: '흑백요리사', icon: '👨‍🍳' },
  wednesday: { name: '수요미식회', icon: '🍽️' },
  baekjongwon: { name: '백종원의3대천왕', icon: '👑' },
  lifemaster: { name: '생활의달인', icon: '🏆' },
  foodfighters: { name: '맛있는녀석들', icon: '🍖' },
  sungsikyung: { name: '성시경의먹을텐데', icon: '🎤' },
  heoymans: { name: '허영만의백반기행', icon: '🍚' },
  centurystore: { name: '백년가게', icon: '💯' },
  choijaroad: { name: '최자로드', icon: '🛣️' },
  koreanstable: { name: '한국인의밥상', icon: '🍱' },
  alleyrestaurant: { name: '백종원의골목식당', icon: '🏘️' },
  hiddeneatery: { name: '숨은맛집', icon: '🔍' }
};