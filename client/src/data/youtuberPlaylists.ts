// 유명 유튜버 플레이리스트 데이터
export interface YoutuberPlaylist {
  id: string;
  name: string;
  channel: string;
  avatar: string;
  subscribers: string;
  title: string;
  description?: string;
  restaurants: {
    id: string;
    name: string;
    area: string;
    address: string;
    cuisine: string;
    priceRange: string;
    rating: number;
    coordinates: { lat: number; lng: number };
    youtuberComment?: string;
    videoUrl?: string;
  }[];
}

export const youtuberPlaylists: YoutuberPlaylist[] = [
  {
    id: 'sung-si-kyung',
    name: '성시경',
    channel: '성시경 SUNG SI KYUNG',
    avatar: 'https://ui-avatars.com/api/?name=성시경&size=150&background=9333EA&color=fff',
    subscribers: '135만',
    title: '성시경이 극찬한 진짜 맛집',
    description: '먹을텐데 출연 맛집 & 개인 추천 맛집',
    restaurants: [
      {
        id: 'ssk-1',
        name: '성수동 갈비집',
        area: '성수',
        address: '서울 성동구 성수동2가 289-5',
        cuisine: '한식',
        priceRange: '₩₩₩',
        rating: 4.8,
        coordinates: { lat: 37.5447, lng: 127.0564 },
        youtuberComment: '갈비의 정석, 여기가 진짜다',
        videoUrl: 'https://youtube.com/...'
      },
      {
        id: 'ssk-2',
        name: '마포 순대국',
        area: '마포',
        address: '서울 마포구 도화동 173-2',
        cuisine: '한식',
        priceRange: '₩',
        rating: 4.7,
        coordinates: { lat: 37.5384, lng: 126.9514 },
        youtuberComment: '순대국은 여기가 최고, 새벽에도 먹고 싶은 맛'
      },
      {
        id: 'ssk-3',
        name: '서촌 해물탕',
        area: '서촌',
        address: '서울 종로구 통인동 16',
        cuisine: '한식',
        priceRange: '₩₩',
        rating: 4.6,
        coordinates: { lat: 37.5792, lng: 126.9718 },
        youtuberComment: '해물의 신선함이 다르다, 국물이 끝내줘'
      }
    ]
  },
  {
    id: 'matsuda',
    name: '마츠다상',
    channel: '밤도깨비 마츠다',
    avatar: 'https://ui-avatars.com/api/?name=마츠다&size=150&background=EF4444&color=fff',
    subscribers: '89만',
    title: '마츠다 극찬 한국 맛집',
    description: '일본인이 인정한 한국 맛집 리스트',
    restaurants: [
      {
        id: 'mat-1',
        name: '을지로 노가리',
        area: '을지로',
        address: '서울 중구 을지로3가 295',
        cuisine: '술집',
        priceRange: '₩₩',
        rating: 4.5,
        coordinates: { lat: 37.5660, lng: 126.9910 },
        youtuberComment: '이런 분위기는 일본에 없어요, 최고!',
      },
      {
        id: 'mat-2',
        name: '이태원 부대찌개',
        area: '이태원',
        address: '서울 용산구 이태원동 119-23',
        cuisine: '한식',
        priceRange: '₩',
        rating: 4.6,
        coordinates: { lat: 37.5340, lng: 126.9948 },
        youtuberComment: '부대찌개의 원조, 진짜 맛있어요'
      },
      {
        id: 'mat-3',
        name: '강남 미나리',
        area: '강남',
        address: '서울 강남구 역삼동 823-42',
        cuisine: '고기',
        priceRange: '₩₩₩₩',
        rating: 4.9,
        coordinates: { lat: 37.4995, lng: 127.0376 },
        youtuberComment: '한우의 최고봉, 녹는다 녹아'
      }
    ]
  },
  {
    id: 'tzuyang',
    name: '쯔양',
    channel: '쯔양 TZUYANG',
    avatar: 'https://ui-avatars.com/api/?name=쯔양&size=150&background=EC4899&color=fff',
    subscribers: '1020만',
    title: '쯔양이 인정한 양 많은 집',
    description: '푸짐한 양과 맛을 모두 잡은 맛집',
    restaurants: [
      {
        id: 'tzu-1',
        name: '광장시장 육회',
        area: '광장',
        address: '서울 종로구 예지동 6-1',
        cuisine: '한식',
        priceRange: '₩₩',
        rating: 4.7,
        coordinates: { lat: 37.5701, lng: 126.9998 },
        youtuberComment: '육회 비빔밥 3그릇도 거뜬해요'
      },
      {
        id: 'tzu-2',
        name: '종로 삼계탕',
        area: '종로',
        address: '서울 종로구 관훈동 16',
        cuisine: '한식',
        priceRange: '₩₩',
        rating: 4.8,
        coordinates: { lat: 37.5718, lng: 126.9858 },
        youtuberComment: '삼계탕 5그릇 클리어! 진짜 보양식'
      },
      {
        id: 'tzu-3',
        name: '신촌 떡볶이',
        area: '신촌',
        address: '서울 서대문구 창천동 52-94',
        cuisine: '분식',
        priceRange: '₩',
        rating: 4.5,
        coordinates: { lat: 37.5551, lng: 126.9358 },
        youtuberComment: '떡볶이 10인분도 문제없어요, 중독성 있는 맛'
      }
    ]
  },
  {
    id: 'paik-jong-won',
    name: '백종원',
    channel: 'paik의 요리비책',
    avatar: 'https://ui-avatars.com/api/?name=백종원&size=150&background=F59E0B&color=fff',
    subscribers: '555만',
    title: '백종원 추천 숨은 맛집',
    description: '골목식당 & 맛남의 광장 출연 맛집',
    restaurants: [
      {
        id: 'paik-1',
        name: '부암동 간장게장',
        area: '종로',
        address: '서울 종로구 부암동 208-2',
        cuisine: '한식',
        priceRange: '₩₩₩',
        rating: 4.9,
        coordinates: { lat: 37.5926, lng: 126.9664 },
        youtuberComment: '간장게장의 정석, 밥도둑이 따로 없네'
      },
      {
        id: 'paik-2',
        name: '서촌 명동찌개',
        area: '서촌',
        address: '서울 종로구 통인동 75-1',
        cuisine: '한식',
        priceRange: '₩',
        rating: 4.6,
        coordinates: { lat: 37.5788, lng: 126.9711 },
        youtuberComment: '김치찌개 하나로 승부하는 집'
      },
      {
        id: 'paik-3',
        name: '망원 한정식',
        area: '망원',
        address: '서울 마포구 망원동 394-48',
        cuisine: '한식',
        priceRange: '₩₩₩',
        rating: 4.8,
        coordinates: { lat: 37.5556, lng: 126.9097 },
        youtuberComment: '한정식의 가성비, 이 가격에 이 퀄리티?'
      }
    ]
  }
];

// 추천 알고리즘을 위한 데이터 타입 정의
export interface UserPreference {
  userId: string;
  // 게임 결과 기반
  gamePreferences: {
    cuisineTypes: Record<string, number>; // 선호 요리 타입별 점수
    priceRanges: Record<string, number>; // 선호 가격대별 점수
    atmospheres: Record<string, number>; // 선호 분위기별 점수
  };
  // 방문 기록 기반
  visitHistory: {
    restaurantId: string;
    visitDate: Date;
    rating?: number;
    tags: string[];
  }[];
  // 팔로우 정보 기반
  followingPreferences: {
    curatorId: string;
    curatorType: 'youtuber' | 'local' | 'influencer';
    trustScore: number; // 해당 큐레이터를 얼마나 신뢰하는지
  }[];
  // 좋아요/저장 기반
  likedRestaurants: {
    restaurantId: string;
    likedAt: Date;
    tags: string[];
  }[];
}

// 추천 점수 계산 알고리즘
export interface RecommendationScore {
  restaurantId: string;
  totalScore: number;
  scoreBreakdown: {
    gameScore: number; // 게임 선호도 기반 점수
    visitScore: number; // 방문 이력 기반 점수
    followScore: number; // 팔로우 큐레이터 기반 점수
    likeScore: number; // 좋아요 패턴 기반 점수
    trendScore: number; // 현재 트렌드 점수
    distanceScore: number; // 거리 기반 점수
  };
  explanation: string; // 추천 이유 설명
}

// 추천 알고리즘 가중치
export const RECOMMENDATION_WEIGHTS = {
  gamePreference: 0.25, // 25%
  visitHistory: 0.20, // 20%
  followingCurators: 0.20, // 20%
  likedPattern: 0.15, // 15%
  trending: 0.10, // 10%
  distance: 0.10, // 10%
};

// 추천 알고리즘 함수
export function calculateRecommendationScore(
  restaurant: any,
  userPreference: UserPreference,
  currentLocation?: { lat: number; lng: number }
): RecommendationScore {
  let gameScore = 0;
  let visitScore = 0;
  let followScore = 0;
  let likeScore = 0;
  let trendScore = 0;
  let distanceScore = 0;

  // 1. 게임 선호도 점수 계산
  if (userPreference.gamePreferences.cuisineTypes[restaurant.cuisine]) {
    gameScore += userPreference.gamePreferences.cuisineTypes[restaurant.cuisine] * 10;
  }
  if (userPreference.gamePreferences.priceRanges[restaurant.priceRange]) {
    gameScore += userPreference.gamePreferences.priceRanges[restaurant.priceRange] * 5;
  }

  // 2. 방문 이력 기반 점수 (비슷한 태그를 가진 식당 선호)
  const visitedTags = new Set(
    userPreference.visitHistory.flatMap(v => v.tags)
  );
  const matchingTags = restaurant.tags?.filter((tag: string) => visitedTags.has(tag)) || [];
  visitScore = matchingTags.length * 15;

  // 3. 팔로우 큐레이터 추천 점수
  const curatorRecommended = userPreference.followingPreferences.some(
    f => restaurant.recommendedBy?.includes(f.curatorId)
  );
  if (curatorRecommended) {
    followScore = 50;
  }

  // 4. 좋아요 패턴 점수
  const likedTags = new Set(
    userPreference.likedRestaurants.flatMap(l => l.tags)
  );
  const likeMatchingTags = restaurant.tags?.filter((tag: string) => likedTags.has(tag)) || [];
  likeScore = likeMatchingTags.length * 10;

  // 5. 트렌드 점수 (최근 인기도)
  trendScore = Math.min(restaurant.recentViews / 100, 50); // 최대 50점

  // 6. 거리 점수 (가까울수록 높은 점수)
  if (currentLocation && restaurant.coordinates) {
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );
    distanceScore = Math.max(50 - distance * 5, 0); // 1km당 5점 감소
  }

  // 총점 계산 (가중치 적용)
  const totalScore = 
    gameScore * RECOMMENDATION_WEIGHTS.gamePreference +
    visitScore * RECOMMENDATION_WEIGHTS.visitHistory +
    followScore * RECOMMENDATION_WEIGHTS.followingCurators +
    likeScore * RECOMMENDATION_WEIGHTS.likedPattern +
    trendScore * RECOMMENDATION_WEIGHTS.trending +
    distanceScore * RECOMMENDATION_WEIGHTS.distance;

  // 추천 이유 생성
  const reasons = [];
  if (gameScore > 30) reasons.push('당신이 좋아하는 스타일');
  if (visitScore > 30) reasons.push('자주 가는 곳과 비슷한 분위기');
  if (followScore > 0) reasons.push('팔로우한 맛잘알 추천');
  if (likeScore > 20) reasons.push('좋아요한 맛집과 유사');
  if (trendScore > 30) reasons.push('요즘 핫한 곳');
  if (distanceScore > 30) reasons.push('가까운 거리');

  return {
    restaurantId: restaurant.id,
    totalScore,
    scoreBreakdown: {
      gameScore,
      visitScore,
      followScore,
      likeScore,
      trendScore,
      distanceScore
    },
    explanation: reasons.join(', ') || '새로운 맛집 도전!'
  };
}

// 거리 계산 함수 (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // 거리 (km)
}