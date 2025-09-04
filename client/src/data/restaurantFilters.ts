// 카테고리 계층 구조
export const categoryHierarchy = {
  '한식': [
    '국밥/해장국', '찌개/전골', '구이/고기', '한정식', '백반/한식뷔페', 
    '냉면', '삼계탕', '족발/보쌈', '전통주점', '분식'
  ],
  '중식': [
    '짜장면/짬뽕', '탕수육', '마라탕/마라샹궈', '훠궈', '양꼬치', 
    '딤섬', '북경오리', '사천요리', '광동요리'
  ],
  '일식': [
    '초밥', '라멘', '돈카츠', '우동/소바', '이자카야', 
    '덮밥', '오마카세', '야키토리', '텐동'
  ],
  '양식': [
    '파스타', '피자', '스테이크', '햄버거', '브런치', 
    '리조또', '샐러드', '수제버거', '와인바'
  ],
  '아시안': [
    '태국음식', '베트남음식', '인도음식', '터키음식', '팔라펠',
    '쌀국수', '똠양꿍', '커리', '케밥'
  ],
  '카페/디저트': [
    '커피전문점', '베이커리', '브런치카페', '디저트카페', '차전문점',
    '아이스크림', '와플/팬케이크', '마카롱', '케이크'
  ],
  '주점': [
    '호프/맥주', '와인바', '칵테일바', '전통주점', '이자카야',
    '포차', '막걸리', '위스키바', '루프탑바'
  ],
  '패스트푸드': [
    '버거', '치킨', '피자', '샌드위치', '토스트',
    '김밥천국', '편의점', '분식', '도시락'
  ]
};

// 생활중심 필터
export const lifestyleFilters = {
  '오늘 저녁 데이트': {
    categories: ['양식', '일식', '카페/디저트', '주점'],
    atmosphere: ['로맨틱', '조용한', '뷰맛집', '분위기좋은'],
    priceRange: ['보통', '비싼'],
    features: ['예약가능', '주차가능', '프라이빗룸'],
    time: '17:00-22:00'
  },
  '회식 장소': {
    categories: ['한식', '중식', '주점', '고기집'],
    atmosphere: ['활기찬', '넓은', '단체석'],
    features: ['주차가능', '프라이빗룸', '대관가능', '흡연구역'],
    priceRange: ['보통', '비싼']
  },
  '혼밥 맛집': {
    categories: ['한식', '일식', '분식', '패스트푸드'],
    atmosphere: ['편안한', '빠른', '카운터석'],
    features: ['혼밥가능', '빠른회전율', '키오스크'],
    priceRange: ['저렴한', '보통']
  },
  '브런치': {
    categories: ['카페/디저트', '양식'],
    atmosphere: ['밝은', '모던한', '인스타감성'],
    time: '09:00-14:00',
    features: ['테라스', '펫프렌들리', '주차가능']
  },
  '술한잔': {
    categories: ['주점', '이자카야', '와인바', '포차'],
    atmosphere: ['편안한', '활기찬', '음악좋은'],
    time: '18:00-02:00',
    features: ['심야영업', '테라스', '라이브음악']
  }
};

// 거리 기반 필터
export const distanceFilters = [
  { label: '걸어서 5분', value: 400, unit: 'm' },
  { label: '걸어서 10분', value: 800, unit: 'm' },
  { label: '자전거 5분', value: 1500, unit: 'm' },
  { label: '차로 5분', value: 3000, unit: 'm' },
  { label: '차로 10분', value: 6000, unit: 'm' },
  { label: '지하철 2정거장', value: 2000, unit: 'm' }
];

// 편의시설 필터
export const convenienceFeatures = [
  { id: 'parking', label: '주차가능', icon: '🚗' },
  { id: 'valet', label: '발렛파킹', icon: '🎩' },
  { id: 'corkage', label: '콜키지프리', icon: '🍷' },
  { id: 'noKids', label: '노키즈존', icon: '👶' },
  { id: 'petFriendly', label: '펫프렌들리', icon: '🐕' },
  { id: 'wheelchair', label: '휠체어접근', icon: '♿' },
  { id: 'privateRoom', label: '룸/개별공간', icon: '🚪' },
  { id: 'terrace', label: '테라스/루프탑', icon: '🏖️' },
  { id: 'wifi', label: '와이파이', icon: '📶' },
  { id: 'reservation', label: '예약가능', icon: '📅' },
  { id: 'delivery', label: '배달가능', icon: '🛵' },
  { id: 'takeout', label: '포장가능', icon: '🥡' },
  { id: 'open24', label: '24시간', icon: '🕐' },
  { id: 'lateNight', label: '심야영업', icon: '🌙' },
  { id: 'breakfast', label: '아침식사', icon: '☀️' }
];

// 분위기 필터
export const atmosphereFilters = [
  { id: 'cozy', label: '아늑한', emoji: '🏠' },
  { id: 'lively', label: '활기찬', emoji: '🎉' },
  { id: 'quiet', label: '조용한', emoji: '🤫' },
  { id: 'romantic', label: '로맨틱', emoji: '💕' },
  { id: 'modern', label: '모던한', emoji: '✨' },
  { id: 'traditional', label: '전통적인', emoji: '🏛️' },
  { id: 'hipster', label: '힙한', emoji: '😎' },
  { id: 'casual', label: '캐주얼', emoji: '👕' },
  { id: 'formal', label: '격식있는', emoji: '🤵' },
  { id: 'instagrammable', label: '인스타감성', emoji: '📸' },
  { id: 'viewPoint', label: '뷰맛집', emoji: '🌆' },
  { id: 'vintage', label: '빈티지', emoji: '📻' }
];

// 가격대 필터
export const priceRanges = [
  { id: 'cheap', label: '1만원 이하', symbol: '₩', count: 1 },
  { id: 'moderate', label: '1-2만원', symbol: '₩₩', count: 2 },
  { id: 'expensive', label: '2-4만원', symbol: '₩₩₩', count: 3 },
  { id: 'veryExpensive', label: '4만원 이상', symbol: '₩₩₩₩', count: 4 }
];

// 미디어/프로그램 인증 필터
export const mediaCertifications = [
  { 
    id: 'michelin',
    name: '미쉐린',
    icon: '⭐',
    color: 'red',
    weight: 10
  },
  {
    id: 'blacknwhite',
    name: '흑백요리사',
    icon: '👨‍🍳',
    color: 'black',
    weight: 9
  },
  {
    id: 'wednesday',
    name: '수요미식회',
    icon: '🍽️',
    color: 'blue',
    weight: 8
  },
  {
    id: 'baekjongwon',
    name: '백종원의 3대천왕',
    icon: '👑',
    color: 'gold',
    weight: 7
  },
  {
    id: 'lifemaster',
    name: '생활의달인',
    icon: '🏆',
    color: 'purple',
    weight: 8
  },
  {
    id: 'foodfighters',
    name: '맛있는녀석들',
    icon: '🍖',
    color: 'orange',
    weight: 6
  },
  {
    id: 'sungsikyung',
    name: '성시경의 먹을텐데',
    icon: '🎤',
    color: 'green',
    weight: 7
  },
  {
    id: 'heoymans',
    name: '허영만의 백반기행',
    icon: '🍚',
    color: 'brown',
    weight: 7
  },
  {
    id: 'centurystore',
    name: '백년가게',
    icon: '💯',
    color: 'indigo',
    weight: 9
  },
  {
    id: 'choijaroad',
    name: '최자로드',
    icon: '🛣️',
    color: 'teal',
    weight: 6
  },
  {
    id: 'koreanstable',
    name: '한국인의밥상',
    icon: '🍱',
    color: 'amber',
    weight: 6
  },
  {
    id: 'alleyrestaurant',
    name: '백종원의 골목식당',
    icon: '🏘️',
    color: 'cyan',
    weight: 5
  },
  {
    id: 'hiddeneatery',
    name: '숨은맛집',
    icon: '🔍',
    color: 'pink',
    weight: 5
  }
];

// 찐맛집 필터 개선
export const authenticFilters = [
  { id: 'noDelivery', label: '배달 없는 집', desc: '직접 가야만 먹을 수 있는' },
  { id: 'eldersChoice', label: '어르신도 극찬', desc: '나이 상관없이 인정하는' },
  { id: 'deliveryLineup', label: '배달기사도 줄서는', desc: '프로들도 인정한' },
  { id: 'localFavorite', label: '현지인 단골', desc: '동네 사람들이 아는' },
  { id: 'parkingHell', label: '주차지옥인데 붐비는', desc: '불편해도 찾아가는' },
  { id: 'noMarketing', label: '홍보 안하는 집', desc: '입소문으로만 유명한' },
  { id: 'generational', label: '2대째 운영', desc: '오래된 전통의' },
  { id: 'oneMenu', label: '단일메뉴 집', desc: '한 가지만 파는' }
];

// 영업시간 헬퍼 함수
export function isOpenNow(openingHours: { [key: string]: string } | undefined): boolean {
  if (!openingHours) return true; // 정보 없으면 기본 true
  
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const todayHours = openingHours[dayNames[day]];
  
  if (!todayHours || todayHours === '휴무') return false;
  if (todayHours === '24시간') return true;
  
  const [open, close] = todayHours.split('-').map(time => {
    const [h, m] = time.split(':').map(Number);
    return h * 100 + m;
  });
  
  // 자정 넘어가는 경우 처리
  if (close < open) {
    return currentTime >= open || currentTime <= close;
  }
  
  return currentTime >= open && currentTime <= close;
}