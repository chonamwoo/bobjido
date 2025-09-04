export interface SignatureDish {
  id: string;
  name: string;
  category: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon?: string;
  signatureDishes: SignatureDish[];
}

export const foodCategories: FoodCategory[] = [
  {
    id: 'korean',
    name: '한식',
    icon: '🥘',
    signatureDishes: [
      { id: 'kimchi-stew', name: '김치찌개', category: 'korean' },
      { id: 'samgyeopsal', name: '삼겹살', category: 'korean' },
      { id: 'bibimbap', name: '비빔밥', category: 'korean' },
      { id: 'bulgogi', name: '불고기', category: 'korean' },
      { id: 'galbitang', name: '갈비탕', category: 'korean' },
      { id: 'naengmyeon', name: '냉면', category: 'korean' },
      { id: 'gamjatang', name: '감자탕', category: 'korean' },
      { id: 'budae-jjigae', name: '부대찌개', category: 'korean' },
      { id: 'dakgalbi', name: '닭갈비', category: 'korean' },
      { id: 'sundubu', name: '순두부찌개', category: 'korean' }
    ]
  },
  {
    id: 'japanese',
    name: '일식',
    icon: '🍱',
    signatureDishes: [
      { id: 'sushi', name: '초밥', category: 'japanese' },
      { id: 'sashimi', name: '사시미', category: 'japanese' },
      { id: 'ramen', name: '라멘', category: 'japanese' },
      { id: 'udon', name: '우동', category: 'japanese' },
      { id: 'donburi', name: '덮밥', category: 'japanese' },
      { id: 'tonkatsu', name: '돈까스', category: 'japanese' },
      { id: 'tempura', name: '튀김', category: 'japanese' },
      { id: 'yakitori', name: '야키토리', category: 'japanese' },
      { id: 'okonomiyaki', name: '오코노미야키', category: 'japanese' },
      { id: 'curry', name: '카레', category: 'japanese' }
    ]
  },
  {
    id: 'chinese',
    name: '중식',
    icon: '🥟',
    signatureDishes: [
      { id: 'jjajangmyeon', name: '짜장면', category: 'chinese' },
      { id: 'jjamppong', name: '짬뽕', category: 'chinese' },
      { id: 'tangsuyuk', name: '탕수육', category: 'chinese' },
      { id: 'mapo-tofu', name: '마파두부', category: 'chinese' },
      { id: 'fried-rice', name: '볶음밥', category: 'chinese' },
      { id: 'kung-pao', name: '깐풍기', category: 'chinese' },
      { id: 'dim-sum', name: '딤섬', category: 'chinese' },
      { id: 'peking-duck', name: '북경오리', category: 'chinese' },
      { id: 'wonton', name: '완탕', category: 'chinese' },
      { id: 'spring-rolls', name: '춘권', category: 'chinese' }
    ]
  },
  {
    id: 'western',
    name: '양식',
    icon: '🍝',
    signatureDishes: [
      { id: 'steak', name: '스테이크', category: 'western' },
      { id: 'pasta', name: '파스타', category: 'western' },
      { id: 'pizza', name: '피자', category: 'western' },
      { id: 'burger', name: '버거', category: 'western' },
      { id: 'risotto', name: '리조또', category: 'western' },
      { id: 'salad', name: '샐러드', category: 'western' },
      { id: 'sandwich', name: '샌드위치', category: 'western' },
      { id: 'soup', name: '수프', category: 'western' },
      { id: 'bbq-ribs', name: '바베큐', category: 'western' },
      { id: 'fish-chips', name: '피시앤칩스', category: 'western' }
    ]
  },
  {
    id: 'asian',
    name: '동남아',
    icon: '🍜',
    signatureDishes: [
      { id: 'pho', name: '쌀국수', category: 'asian' },
      { id: 'pad-thai', name: '팟타이', category: 'asian' },
      { id: 'tom-yum', name: '똠얌꿍', category: 'asian' },
      { id: 'banh-mi', name: '반미', category: 'asian' },
      { id: 'green-curry', name: '그린커리', category: 'asian' },
      { id: 'spring-roll', name: '월남쌈', category: 'asian' },
      { id: 'nasi-goreng', name: '나시고렝', category: 'asian' },
      { id: 'satay', name: '사테', category: 'asian' },
      { id: 'laksa', name: '락사', category: 'asian' },
      { id: 'bun-cha', name: '분짜', category: 'asian' }
    ]
  },
  {
    id: 'mexican',
    name: '멕시칸',
    icon: '🌮',
    signatureDishes: [
      { id: 'tacos', name: '타코', category: 'mexican' },
      { id: 'burrito', name: '부리토', category: 'mexican' },
      { id: 'quesadilla', name: '케사디아', category: 'mexican' },
      { id: 'nachos', name: '나초', category: 'mexican' },
      { id: 'fajitas', name: '파히타', category: 'mexican' },
      { id: 'enchiladas', name: '엔칠라다', category: 'mexican' },
      { id: 'guacamole', name: '과카몰리', category: 'mexican' },
      { id: 'churros', name: '츄러스', category: 'mexican' }
    ]
  },
  {
    id: 'indian',
    name: '인도',
    icon: '🍛',
    signatureDishes: [
      { id: 'tandoori', name: '탄두리치킨', category: 'indian' },
      { id: 'curry', name: '커리', category: 'indian' },
      { id: 'naan', name: '난', category: 'indian' },
      { id: 'biryani', name: '비리야니', category: 'indian' },
      { id: 'samosa', name: '사모사', category: 'indian' },
      { id: 'tikka-masala', name: '티카마살라', category: 'indian' },
      { id: 'dal', name: '달', category: 'indian' },
      { id: 'lassi', name: '라씨', category: 'indian' }
    ]
  },
  {
    id: 'dessert',
    name: '디저트',
    icon: '🍰',
    signatureDishes: [
      { id: 'cake', name: '케이크', category: 'dessert' },
      { id: 'ice-cream', name: '아이스크림', category: 'dessert' },
      { id: 'bingsu', name: '빙수', category: 'dessert' },
      { id: 'macaron', name: '마카롱', category: 'dessert' },
      { id: 'tiramisu', name: '티라미수', category: 'dessert' },
      { id: 'croissant', name: '크루아상', category: 'dessert' },
      { id: 'waffle', name: '와플', category: 'dessert' },
      { id: 'pancake', name: '팬케이크', category: 'dessert' },
      { id: 'donut', name: '도넛', category: 'dessert' },
      { id: 'pudding', name: '푸딩', category: 'dessert' }
    ]
  },
  {
    id: 'cafe',
    name: '카페',
    icon: '☕',
    signatureDishes: [
      { id: 'americano', name: '아메리카노', category: 'cafe' },
      { id: 'latte', name: '라떼', category: 'cafe' },
      { id: 'cappuccino', name: '카푸치노', category: 'cafe' },
      { id: 'espresso', name: '에스프레소', category: 'cafe' },
      { id: 'tea', name: '차', category: 'cafe' },
      { id: 'smoothie', name: '스무디', category: 'cafe' },
      { id: 'juice', name: '주스', category: 'cafe' },
      { id: 'brunch', name: '브런치', category: 'cafe' }
    ]
  },
  {
    id: 'bar',
    name: '주점',
    icon: '🍺',
    signatureDishes: [
      { id: 'beer', name: '맥주', category: 'bar' },
      { id: 'soju', name: '소주', category: 'bar' },
      { id: 'cocktail', name: '칵테일', category: 'bar' },
      { id: 'wine', name: '와인', category: 'bar' },
      { id: 'whiskey', name: '위스키', category: 'bar' },
      { id: 'makgeolli', name: '막걸리', category: 'bar' },
      { id: 'anju', name: '안주', category: 'bar' },
      { id: 'chicken', name: '치킨', category: 'bar' }
    ]
  }
];

export const contextFilters = {
  dateNight: {
    id: 'date-night',
    name: '오늘 저녁 데이트',
    description: '로맨틱한 분위기의 데이트 장소',
    criteria: {
      atmosphere: ['romantic', 'cozy', 'upscale'],
      priceRange: ['보통', '비싼', '매우비싼'],
      timeSlots: ['dinner', 'late-night'],
      categories: ['western', 'japanese', 'italian', 'french']
    }
  },
  businessMeeting: {
    id: 'business-meeting',
    name: '비즈니스 미팅',
    description: '조용하고 격식있는 비즈니스 장소',
    criteria: {
      atmosphere: ['formal', 'quiet', 'professional'],
      amenities: ['parking', 'private-room'],
      priceRange: ['비싼', '매우비싼'],
      categories: ['korean', 'japanese', 'western']
    }
  },
  familyDinner: {
    id: 'family-dinner',
    name: '가족 외식',
    description: '온 가족이 함께 즐길 수 있는 곳',
    criteria: {
      atmosphere: ['family-friendly', 'comfortable'],
      amenities: ['parking', 'kids-menu', 'high-chair'],
      priceRange: ['저렴한', '보통'],
      categories: ['korean', 'chinese', 'western']
    }
  },
  quickLunch: {
    id: 'quick-lunch',
    name: '빠른 점심',
    description: '30분 내외로 해결하는 점심',
    criteria: {
      serviceSpeed: 'fast',
      timeSlots: ['lunch'],
      priceRange: ['저렴한', '보통'],
      distance: ['5min-walk', '10min-walk']
    }
  },
  lateNight: {
    id: 'late-night',
    name: '심야 식사',
    description: '밤 늦게까지 영업하는 곳',
    criteria: {
      operatingHours: '24hr',
      timeSlots: ['late-night'],
      categories: ['korean', 'bar', 'fast-food']
    }
  },
  soloMeal: {
    id: 'solo-meal',
    name: '혼밥',
    description: '혼자서도 편하게 식사할 수 있는 곳',
    criteria: {
      atmosphere: ['casual', 'counter-seating'],
      soloFriendly: true,
      categories: ['japanese', 'korean', 'fast-food']
    }
  }
};

export const distanceFilters = [
  { id: '3min-walk', name: '도보 3분', distance: 250, unit: 'meters' },
  { id: '5min-walk', name: '도보 5분', distance: 400, unit: 'meters' },
  { id: '10min-walk', name: '도보 10분', distance: 800, unit: 'meters' },
  { id: '5min-drive', name: '차로 5분', distance: 2000, unit: 'meters' },
  { id: '10min-drive', name: '차로 10분', distance: 5000, unit: 'meters' },
  { id: '15min-drive', name: '차로 15분', distance: 8000, unit: 'meters' }
];

export const atmosphereFilters = [
  { id: 'trendy', name: '트렌디한', icon: '✨' },
  { id: 'cozy', name: '아늑한', icon: '🏠' },
  { id: 'romantic', name: '로맨틱한', icon: '💕' },
  { id: 'lively', name: '활기찬', icon: '🎉' },
  { id: 'quiet', name: '조용한', icon: '🤫' },
  { id: 'traditional', name: '전통적인', icon: '🏛️' },
  { id: 'modern', name: '모던한', icon: '🏢' },
  { id: 'casual', name: '캐주얼한', icon: '👕' },
  { id: 'upscale', name: '고급스러운', icon: '💎' },
  { id: 'value', name: '가성비', icon: '💰' },
  { id: 'instagrammable', name: '인스타감성', icon: '📸' },
  { id: 'local', name: '로컬맛집', icon: '🏘️' }
];

export const amenityFilters = [
  { id: 'parking', name: '주차가능', icon: '🚗' },
  { id: 'valet', name: '발렛파킹', icon: '🎩' },
  { id: 'corkage', name: '콜키지가능', icon: '🍷' },
  { id: '24hr', name: '24시간', icon: '🌙' },
  { id: 'delivery', name: '배달가능', icon: '🛵' },
  { id: 'takeout', name: '포장가능', icon: '📦' },
  { id: 'reservation', name: '예약가능', icon: '📅' },
  { id: 'waiting', name: '웨이팅', icon: '⏰' },
  { id: 'private-room', name: '룸있음', icon: '🚪' },
  { id: 'pet-friendly', name: '반려동물', icon: '🐕' },
  { id: 'wifi', name: '와이파이', icon: '📶' },
  { id: 'no-kids', name: '노키즈존', icon: '🔞' },
  { id: 'kids-menu', name: '키즈메뉴', icon: '👶' },
  { id: 'vegetarian', name: '채식메뉴', icon: '🥗' },
  { id: 'halal', name: '할랄', icon: '🕌' },
  { id: 'counter-seating', name: '바테이블', icon: '🪑' },
  { id: 'terrace', name: '테라스', icon: '☀️' },
  { id: 'view', name: '뷰맛집', icon: '🌃' }
];