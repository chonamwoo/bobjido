import { getUniquePlaylistImage } from './playlistImages';

// 음식 카테고리별 기본 이미지 매핑
const FOOD_CATEGORY_IMAGES = {
  '한식': [
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop&q=80', // 김치찌개
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop&q=80', // 비빔밥
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&q=80', // 불고기
  ],
  '중식': [
    'https://images.unsplash.com/photo-1563379091339-03246963d94a?w=400&h=300&fit=crop&q=80', // 중식
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=80', // 면
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop&q=80', // 중식요리
  ],
  '일식': [
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop&q=80', // 스시
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop&q=80', // 라멘
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&q=80', // 일식
  ],
  '양식': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&q=80', // 피자
    'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop&q=80', // 스테이크
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80', // 파스타
  ],
  '카페': [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80', // 커피
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop&q=80', // 디저트
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80', // 카페
  ],
  '디저트': [
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop&q=80', // 케이크
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&q=80', // 아이스크림
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&q=80', // 디저트
  ],
  '동남아': [
    'https://images.unsplash.com/photo-1552566651-6fd4ac422717?w=400&h=300&fit=crop&q=80', // 동남아요리
    'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=300&fit=crop&q=80', // 태국음식
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&q=80', // 아시안
  ],
  '주점': [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&q=80', // 치킨
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop&q=80', // 안주
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&q=80', // 주점
  ],
  '패스트푸드': [
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop&q=80', // 버거
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=80', // 패스트푸드
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop&q=80', // 피자
  ],
  '기타': [
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80', // 음식
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80', // 레스토랑
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80', // 식당
  ]
};

// 지역별 대표 이미지
const LOCATION_IMAGES = {
  '명동': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&q=80', // 명동거리
  '중구': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop&q=80', // 서울중구
  '강남': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80', // 강남거리
  '강남구': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
  '홍대': 'https://images.unsplash.com/photo-1589395937259-2c74b55e3e9b?w=400&h=300&fit=crop&q=80', // 홍대거리
  '마포구': 'https://images.unsplash.com/photo-1589395937259-2c74b55e3e9b?w=400&h=300&fit=crop&q=80',
  '이태원': 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=300&fit=crop&q=80', // 이태원
  '압구정': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80', // 압구정
  '신사': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80', // 신사동
  '삼성': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80', // 삼성동
  '종로': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&q=80', // 종로
  '종로구': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&q=80',
  '동대문': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&q=80', // 동대문
  '을지로': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop&q=80', // 을지로
  '서울': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80', // 서울 일반
};

// 플레이리스트 배경 그라디언트
const PLAYLIST_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple-Blue
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink-Red
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-Cyan
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-Teal
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-Yellow
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Mint-Pink
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Coral-Pink
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Purple-Pink
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', // Peach-Lavender
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', // Cream-Orange
  'linear-gradient(135deg, #ff8a80 0%, #ffb74d 100%)', // Red-Orange
  'linear-gradient(135deg, #81c784 0%, #aed581 100%)', // Green-Lime
];

// 테마별 이미지
const THEME_IMAGES = {
  '데이트': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&q=80',
  '데이트 코스': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&q=80',
  '혼밥': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80',
  '혼밥 맛집': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80',
  '모임': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80',
  '회식': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&q=80',
  '브런치': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&q=80',
  '디너': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
  '점심': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&q=80',
  '저녁': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
  '술집': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&q=80',
  '카페': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&q=80',
  '미슐린': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
  '파인다이닝': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&q=80',
};

// 식당 이미지 가져오기 (외부 URL 실패 시 대체 이미지)
export const getRestaurantImage = (restaurant: any): string => {
  // 1. 식당에 이미지가 있으면 시도
  if (restaurant.images && restaurant.images.length > 0) {
    const imageUrl = restaurant.images[0].url || restaurant.images[0];
    if (imageUrl) {
      return imageUrl;
    }
  }
  
  // 2. 카테고리 기반 이미지
  const categoryImages = FOOD_CATEGORY_IMAGES[restaurant.category as keyof typeof FOOD_CATEGORY_IMAGES];
  if (categoryImages) {
    const randomIndex = Math.abs(restaurant._id?.slice(-1).charCodeAt(0) || 0) % categoryImages.length;
    return categoryImages[randomIndex];
  }
  
  // 3. 기본 이미지
  return 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80';
};

// 플레이리스트 커버 이미지 생성 로직
export const getPlaylistCoverImage = (playlist: any): string => {
  // 1. 사용자가 직접 설정한 커버 이미지가 있으면 사용
  if (playlist.coverImage) {
    return playlist.coverImage;
  }
  
  // 2. 새로운 플레이리스트 이미지 시스템 사용
  return getUniquePlaylistImage(playlist);
};

// 플레이리스트 배경 그라디언트 가져오기
export const getPlaylistGradient = (playlist: any): string => {
  if (!playlist._id) return PLAYLIST_GRADIENTS[0];
  
  // 플레이리스트 ID를 기반으로 일관된 그라디언트 선택
  const hash = playlist._id.split('').reduce((acc: number, char: string) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return PLAYLIST_GRADIENTS[hash % PLAYLIST_GRADIENTS.length];
};

// 이미지 로드 에러 핸들링
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackImage?: string) => {
  const img = e.currentTarget;
  const currentSrc = img.src;
  
  // 이미 fallback 이미지인 경우 더 이상 시도하지 않음
  if (currentSrc.includes('images.unsplash.com')) {
    return;
  }
  
  // fallback 이미지로 변경
  img.src = fallbackImage || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80';
};