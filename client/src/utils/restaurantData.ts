import { getRestaurantImage } from './restaurantImages';

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  priceRange: '₩' | '₩₩' | '₩₩₩' | '₩₩₩₩';
  address: string;
  district: string;
  city: string;
  country: string;
  description: string;
  specialties: string[];
  openHours: string;
  phone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  featured?: boolean;
}

// 도시별 레스토랑 데이터
const RESTAURANT_DATA: Record<string, Restaurant[]> = {
  // 한국 - 서울
  '서울': [
    {
      id: 'seoul-001',
      name: '미슐랭 가이드 강남점',
      category: 'korean',
      cuisine: '한식',
      rating: 4.8,
      reviewCount: 1247,
      priceRange: '₩₩₩₩',
      address: '서울 강남구 테헤란로 142',
      district: '강남구',
      city: '서울',
      country: '한국',
      description: '전통 한식을 현대적으로 재해석한 파인다이닝 레스토랑',
      specialties: ['한우 갈비', '전복죽', '궁중떡갈비'],
      openHours: '11:30-22:00',
      phone: '02-1234-5678',
      coordinates: { lat: 37.5665, lng: 127.0780 },
      images: [
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80',
        'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=800&q=80'
      ],
      tags: ['미슐랭', '파인다이닝', '데이트', '특별한날'],
      isPopular: true,
      featured: true
    },
    {
      id: 'seoul-002',
      name: '봉피양 강남본점',
      category: 'korean',
      cuisine: '한식',
      rating: 4.6,
      reviewCount: 892,
      priceRange: '₩₩',
      address: '서울 강남구 역삼동 735-1',
      district: '강남구',
      city: '서울',
      country: '한국',
      description: '전통 부대찌개와 김치찌개로 유명한 현지인 맛집',
      specialties: ['부대찌개', '김치찌개', '계란말이'],
      openHours: '10:00-24:00',
      coordinates: { lat: 37.5006, lng: 127.0366 },
      images: [
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80'
      ],
      tags: ['현지맛집', '부대찌개', '친구모임', '가성비'],
      isPopular: true
    },
    {
      id: 'seoul-003',
      name: '스시 오마카세 청담',
      category: 'japanese',
      cuisine: '일식',
      rating: 4.9,
      reviewCount: 634,
      priceRange: '₩₩₩₩',
      address: '서울 강남구 청담동 84-5',
      district: '강남구',
      city: '서울',
      country: '한국',
      description: '최고급 오마카세 스시 전문점, 일본 직송 재료 사용',
      specialties: ['오마카세', '참치뱃살', '성게'],
      openHours: '18:00-23:00 (예약제)',
      coordinates: { lat: 37.5206, lng: 127.0476 },
      images: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
        'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80'
      ],
      tags: ['오마카세', '고급', '데이트', '예약필수'],
      featured: true
    },
    {
      id: 'seoul-004',
      name: '파스타 부티크',
      category: 'italian',
      cuisine: '이탈리안',
      rating: 4.5,
      reviewCount: 567,
      priceRange: '₩₩₩',
      address: '서울 강남구 강남대로 382',
      district: '강남구',
      city: '서울',
      country: '한국',
      description: '정통 이탈리안 파스타와 리조또 전문점',
      specialties: ['트러플 파스타', '해산물 리조또', '부라타 치즈'],
      openHours: '11:30-22:00',
      coordinates: { lat: 37.4979, lng: 127.0276 },
      images: [
        'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
      ],
      tags: ['파스타', '이탈리안', '와인', '데이트'],
      isPopular: true
    },
    {
      id: 'seoul-005',
      name: '브런치 카페 논현',
      category: 'cafe',
      cuisine: '카페',
      rating: 4.4,
      reviewCount: 423,
      priceRange: '₩₩',
      address: '서울 강남구 논현동 237-8',
      district: '강남구',
      city: '서울',
      country: '한국',
      description: '아늑한 분위기의 브런치 전문 카페',
      specialties: ['아보카도 토스트', '에그베네딕트', '플랫화이트'],
      openHours: '08:00-22:00',
      coordinates: { lat: 37.5111, lng: 127.0222 },
      images: [
        'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
      ],
      tags: ['브런치', '카페', '인스타', '친구모임'],
      isNew: true
    }
  ],

  // 일본 - 도쿄
  '도쿄': [
    {
      id: 'tokyo-001',
      name: '스키야바시 지로',
      category: 'japanese',
      cuisine: '스시',
      rating: 4.9,
      reviewCount: 2341,
      priceRange: '₩₩₩₩',
      address: 'Tsukiji, Chuo City, Tokyo',
      district: 'Chuo',
      city: '도쿄',
      country: '일본',
      description: '세계적으로 유명한 스시 장인 지로의 스시집',
      specialties: ['오마카세', '참치', '우니'],
      openHours: '11:30-14:00, 17:00-20:00',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      images: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80'
      ],
      tags: ['미슐랭3스타', '전설적인곳', '예약필수', '최고급'],
      featured: true
    },
    {
      id: 'tokyo-002',
      name: '이치란 라멘 신주쿠점',
      category: 'japanese',
      cuisine: '라멘',
      rating: 4.3,
      reviewCount: 1876,
      priceRange: '₩',
      address: 'Shinjuku 3-34-11, Tokyo',
      district: 'Shinjuku',
      city: '도쿄',
      country: '일본',
      description: '유명한 톤코츠 라멘 체인점, 개인 부스 시스템',
      specialties: ['톤코츠 라멘', '차슈', '아지타마'],
      openHours: '24시간',
      coordinates: { lat: 35.6917, lng: 139.7036 },
      images: [
        'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80'
      ],
      tags: ['라멘', '24시간', '혼밥가능', '관광명소'],
      isPopular: true
    },
    {
      id: 'tokyo-003',
      name: '긴자 교자루',
      category: 'japanese',
      cuisine: '이자카야',
      rating: 4.6,
      reviewCount: 945,
      priceRange: '₩₩',
      address: 'Ginza 6-3-17, Tokyo',
      district: 'Ginza',
      city: '도쿄',
      country: '일본',
      description: '전통적인 이자카야 분위기의 교자 전문점',
      specialties: ['야키교자', '하이볼', '가라아게'],
      openHours: '17:00-02:00',
      coordinates: { lat: 35.6719, lng: 139.7649 },
      images: [
        'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80'
      ],
      tags: ['이자카야', '교자', '하이볼', '현지분위기'],
      isPopular: true
    }
  ],

  // 싱가포르
  '싱가포르': [
    {
      id: 'singapore-001',
      name: 'Maxwell Food Centre',
      category: 'seafood',
      cuisine: '호커푸드',
      rating: 4.7,
      reviewCount: 3421,
      priceRange: '₩',
      address: '1 Kadayanallur Street, Singapore',
      district: 'Chinatown',
      city: '싱가포르',
      country: '싱가포르',
      description: '싱가포르 대표 호커센터, 다양한 로컬 푸드',
      specialties: ['치킨 라이스', '락사', '차 궈 떼'],
      openHours: '08:00-22:00',
      coordinates: { lat: 1.2802, lng: 103.8431 },
      images: [
        'https://images.unsplash.com/photo-1559737558-a2b8d6d7a0cd?w=800&q=80',
        'https://images.unsplash.com/photo-1565680018434-b513d5e2fd47?w=800&q=80'
      ],
      tags: ['호커센터', '현지음식', '가성비', '관광명소'],
      isPopular: true,
      featured: true
    },
    {
      id: 'singapore-002',
      name: 'Jumbo Seafood',
      category: 'seafood',
      cuisine: '씨푸드',
      rating: 4.5,
      reviewCount: 2187,
      priceRange: '₩₩₩',
      address: '30 Merchant Road, Singapore',
      district: 'Clarke Quay',
      city: '싱가포르',
      country: '싱가포르',
      description: '싱가포르 대표 칠리크랩 맛집',
      specialties: ['칠리크랩', '블랙페퍼크랙', '세리얼 프라운'],
      openHours: '17:30-02:00',
      coordinates: { lat: 1.2884, lng: 103.8467 },
      images: [
        'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?w=800&q=80'
      ],
      tags: ['칠리크랩', '씨푸드', '강변뷰', '관광객'],
      featured: true
    }
  ],

  // 프랑스 - 파리
  '파리': [
    {
      id: 'paris-001',
      name: 'Le Grand Véfour',
      category: 'italian',
      cuisine: '프랑스',
      rating: 4.8,
      reviewCount: 1567,
      priceRange: '₩₩₩₩',
      address: '17 Rue de Beaujolais, 75001 Paris',
      district: '1구',
      city: '파리',
      country: '프랑스',
      description: '18세기부터 이어온 전통의 미슐랭 3스타 레스토랑',
      specialties: ['프아그라', '랍스터', '송로버섯 요리'],
      openHours: '12:30-13:30, 20:00-21:30',
      coordinates: { lat: 48.8635, lng: 2.3370 },
      images: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
      ],
      tags: ['미슐랭3스타', '역사적', '고급', '예약필수'],
      featured: true
    },
    {
      id: 'paris-002',
      name: 'Breizh Café',
      category: 'cafe',
      cuisine: '크레페리',
      rating: 4.4,
      reviewCount: 892,
      priceRange: '₩₩',
      address: '109 Rue Vieille du Temple, 75003 Paris',
      district: '3구',
      city: '파리',
      country: '프랑스',
      description: '모던한 브르타뉴 갈레트와 크레페 전문점',
      specialties: ['갈레트 콩플레', '시드르', '달콤한 크레페'],
      openHours: '11:30-23:00',
      coordinates: { lat: 48.8590, lng: 2.3616 },
      images: [
        'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80',
        'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80'
      ],
      tags: ['갈레트', '크레페', '브르타뉴', '브런치'],
      isPopular: true
    }
  ],

  // 미국 - 뉴욕
  '뉴욕': [
    {
      id: 'newyork-001',
      name: 'Peter Luger Steak House',
      category: 'italian',
      cuisine: '스테이크',
      rating: 4.7,
      reviewCount: 4521,
      priceRange: '₩₩₩₩',
      address: '178 Broadway, Brooklyn, NY',
      district: 'Williamsburg',
      city: '뉴욕',
      country: '미국',
      description: '1887년부터 이어온 뉴욕 최고의 스테이크하우스',
      specialties: ['포터하우스 스테이크', '베이컨', '크리스피 포테이토'],
      openHours: '17:45-21:45',
      coordinates: { lat: 40.7081, lng: -73.9571 },
      images: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'
      ],
      tags: ['스테이크', '전통', '역사적', '현금만가능'],
      featured: true
    },
    {
      id: 'newyork-002',
      name: 'Katz\'s Delicatessen',
      category: 'fastfood',
      cuisine: '델리',
      rating: 4.3,
      reviewCount: 8976,
      priceRange: '₩₩',
      address: '205 E Houston St, New York, NY',
      district: 'Lower East Side',
      city: '뉴욕',
      country: '미국',
      description: '1888년부터 운영중인 뉴욕 대표 델리카테센',
      specialties: ['파스트라미 샌드위치', '코르비프', '피클'],
      openHours: '08:00-22:45',
      coordinates: { lat: 40.7223, lng: -73.9878 },
      images: [
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80'
      ],
      tags: ['델리', '샌드위치', '관광명소', '역사적'],
      isPopular: true
    }
  ],

  // 바르셀로나
  '바르셀로나': [
    {
      id: 'barcelona-001',
      name: 'Cal Pep',
      category: 'seafood',
      cuisine: '타파스',
      rating: 4.6,
      reviewCount: 2134,
      priceRange: '₩₩₩',
      address: 'Plaça de les Olles, 8, 08003 Barcelona',
      district: 'El Born',
      city: '바르셀로나',
      country: '스페인',
      description: '바르셀로나 최고의 타파스 바 중 하나',
      specialties: ['해산물 타파스', '하몽 이베리코', '앞치마 회전'],
      openHours: '19:30-01:30 (화-토)',
      coordinates: { lat: 41.3851, lng: 2.1734 },
      images: [
        'https://images.unsplash.com/photo-1559737558-a2b8d6d7a0cd?w=800&q=80',
        'https://images.unsplash.com/photo-1565680018434-b513d5e2fd47?w=800&q=80'
      ],
      tags: ['타파스', '해산물', '현지맛집', '대기필수'],
      featured: true
    }
  ]
};

// 도시별 레스토랑 가져오기
export const getRestaurantsByCity = (cityName: string): Restaurant[] => {
  return RESTAURANT_DATA[cityName] || [];
};

// 모든 레스토랑 가져오기
export const getAllRestaurants = (): Restaurant[] => {
  return Object.values(RESTAURANT_DATA).flat();
};

// 카테고리별 레스토랑 필터링
export const getRestaurantsByCategory = (cityName: string, category: string): Restaurant[] => {
  const cityRestaurants = getRestaurantsByCity(cityName);
  if (category === 'all') return cityRestaurants;
  return cityRestaurants.filter(restaurant => restaurant.category === category);
};

// 인기 레스토랑 가져오기
export const getPopularRestaurants = (cityName: string): Restaurant[] => {
  return getRestaurantsByCity(cityName).filter(restaurant => restaurant.isPopular);
};

// 추천 레스토랑 가져오기 (featured)
export const getFeaturedRestaurants = (cityName: string): Restaurant[] => {
  return getRestaurantsByCity(cityName).filter(restaurant => restaurant.featured);
};

// 새로운 레스토랑 가져오기
export const getNewRestaurants = (cityName: string): Restaurant[] => {
  return getRestaurantsByCity(cityName).filter(restaurant => restaurant.isNew);
};

// 레스토랑 검색
export const searchRestaurants = (cityName: string, query: string): Restaurant[] => {
  const restaurants = getRestaurantsByCity(cityName);
  const lowerQuery = query.toLowerCase();
  
  return restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(lowerQuery) ||
    restaurant.cuisine.toLowerCase().includes(lowerQuery) ||
    restaurant.specialties.some(specialty => specialty.toLowerCase().includes(lowerQuery)) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    restaurant.description.toLowerCase().includes(lowerQuery)
  );
};

// 가격대별 레스토랑 필터링
export const getRestaurantsByPriceRange = (cityName: string, priceRange: string): Restaurant[] => {
  return getRestaurantsByCity(cityName).filter(restaurant => restaurant.priceRange === priceRange);
};

// 평점별 레스토랑 정렬
export const getRestaurantsByRating = (cityName: string, minRating: number = 0): Restaurant[] => {
  return getRestaurantsByCity(cityName)
    .filter(restaurant => restaurant.rating >= minRating)
    .sort((a, b) => b.rating - a.rating);
};

// 도시 통계 가져오기
export const getCityStats = (cityName: string) => {
  const restaurants = getRestaurantsByCity(cityName);
  
  // Set을 Array로 변환하는 안전한 방법
  const cuisineSet = new Set(restaurants.map(r => r.cuisine));
  const cuisineTypes = Array.from(cuisineSet);
  
  const priceSet = new Set(restaurants.map(r => r.priceRange));
  const priceRanges = Array.from(priceSet);
  
  return {
    totalRestaurants: restaurants.length,
    averageRating: restaurants.reduce((acc, r) => acc + r.rating, 0) / restaurants.length,
    totalReviews: restaurants.reduce((acc, r) => acc + r.reviewCount, 0),
    cuisineTypes: cuisineTypes,
    priceRanges: priceRanges,
    popularCount: restaurants.filter(r => r.isPopular).length,
    featuredCount: restaurants.filter(r => r.featured).length,
    newCount: restaurants.filter(r => r.isNew).length
  };
};

// 사용 가능한 도시 목록
export const getAvailableCities = (): string[] => {
  return Object.keys(RESTAURANT_DATA);
};

// 랜덤 레스토랑 추천
export const getRandomRestaurants = (cityName: string, count: number = 3): Restaurant[] => {
  const restaurants = getRestaurantsByCity(cityName);
  const shuffled = [...restaurants].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};