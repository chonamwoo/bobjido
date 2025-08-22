// 플레이리스트 데이터 타입 정의
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  priceRange: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  rating?: number;
  expertReview?: {
    summary: string;
    highlights: string[];
    recommendedDishes: string[];
    tips: string;
    visitDate?: string;
    rating?: {
      taste: number;
      atmosphere: number;
      service: number;
      cleanliness: number;
      valueForMoney: number;
    };
  };
  userRating?: number;
  userReviewCount?: number;
  isBookmarked?: boolean;
  authenticTags?: string[];
  businessHours?: {
    [key: string]: string;
  };
  phoneNumber?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  expertName: string;
  expertTitle?: string;
  expertAvatar?: string;
  createdAt?: string;
  updatedAt?: string;
  restaurants: Restaurant[];
  totalLikes?: number;
  totalSaves?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  tags?: string[];
  saves?: number;
  views?: number;
}

// 플레이리스트 데이터
export const playlistsData: Record<string, Playlist> = {
  '1': {
    id: '1',
    title: '퇴근 후 강남역 혼술 성지',
    description: '혼자서도 편하게 즐길 수 있는 강남역 술집들',
    expertName: '푸드파이터',
    expertTitle: '미식 모험가',
    expertAvatar: 'https://ui-avatars.com/api/?name=푸드파이터&size=150&background=FF6B6B&color=fff',
    createdAt: '2024-01-15',
    saves: 1234,
    views: 5678,
    restaurants: [
      { 
        id: 'r1', 
        name: '강남면옥', 
        coordinates: { lat: 37.5010, lng: 127.0396 },
        cuisine: '한식',
        priceRange: '₩₩',
        rating: 4.7,
        address: '서울 강남구 테헤란로 123',
        image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA0MTZfMTg3%2FMDAxNzEzMjU3MTY5NTQ3.8CsL1VX7RTUaGwzJCagNDfj_0OoUcE9UTwEeWtS3PTIg.h8uOCK0Q0JRJz2hdXJYiR7oCQLlp_Iz4PvXKA6aXa5Ig.JPEG%2FIMG_7590.jpg'
      },
      { 
        id: 'r2', 
        name: '육전식당', 
        coordinates: { lat: 37.4995, lng: 127.0276 },
        cuisine: '고기',
        priceRange: '₩₩₩',
        rating: 4.8,
        address: '서울 강남구 강남대로 456'
      },
      { 
        id: 'r3', 
        name: '스시오마카세', 
        coordinates: { lat: 37.5020, lng: 127.0250 },
        cuisine: '일식',
        priceRange: '₩₩₩₩',
        rating: 4.9,
        address: '서울 강남구 선릉로 789'
      },
      {
        id: 'r4',
        name: '강남 와인바',
        coordinates: { lat: 37.5005, lng: 127.0285 },
        cuisine: '와인바',
        priceRange: '₩₩₩',
        rating: 4.6,
        address: '서울 강남구 테헤란로 234'
      },
      {
        id: 'r5',
        name: '골목 포차',
        coordinates: { lat: 37.4985, lng: 127.0295 },
        cuisine: '포차',
        priceRange: '₩₩',
        rating: 4.5,
        address: '서울 강남구 역삼로 567'
      }
    ]
  },
  '2': {
    id: '2',
    title: '홍대 새벽 3시 야식 투어',
    description: '새벽까지 영업하는 홍대 맛집 모음',
    expertName: '맛잘알언니',
    expertTitle: '야식 전문가',
    expertAvatar: 'https://ui-avatars.com/api/?name=맛잘알언니&size=150&background=9333EA&color=fff',
    createdAt: '2024-02-10',
    saves: 987,
    views: 4321,
    restaurants: [
      { 
        id: 'r6', 
        name: '홍대닭갈비', 
        coordinates: { lat: 37.5563, lng: 126.9240 },
        cuisine: '한식',
        priceRange: '₩₩',
        rating: 4.6,
        address: '서울 마포구 와우산로 123'
      },
      { 
        id: 'r7', 
        name: '24시 설렁탕', 
        coordinates: { lat: 37.5549, lng: 126.9235 },
        cuisine: '탕류',
        priceRange: '₩',
        rating: 4.4,
        address: '서울 마포구 홍익로 456'
      },
      { 
        id: 'r8', 
        name: '심야식당', 
        coordinates: { lat: 37.5571, lng: 126.9252 },
        cuisine: '일식',
        priceRange: '₩₩',
        rating: 4.7,
        address: '서울 마포구 어울마당로 789'
      },
      {
        id: 'r9',
        name: '홍대 곱창',
        coordinates: { lat: 37.5558, lng: 126.9245 },
        cuisine: '고기',
        priceRange: '₩₩₩',
        rating: 4.8,
        address: '서울 마포구 양화로 234'
      },
      {
        id: 'r10',
        name: '늦은밤 국수',
        coordinates: { lat: 37.5566, lng: 126.9238 },
        cuisine: '분식',
        priceRange: '₩',
        rating: 4.3,
        address: '서울 마포구 서교동 567'
      }
    ]
  },
  '3': {
    id: '3',
    title: '을지로 힙스터 술집 리스트',
    description: '요즘 핫한 을지로 숨은 술집들',
    expertName: '술고래',
    expertTitle: '주류 전문가',
    expertAvatar: 'https://ui-avatars.com/api/?name=술고래&size=150&background=4F46E5&color=fff',
    createdAt: '2024-03-05',
    saves: 2456,
    views: 8901,
    restaurants: [
      { 
        id: 'r8', 
        name: '을지로포차', 
        coordinates: { lat: 37.5660, lng: 126.9910 },
        cuisine: '포차',
        priceRange: '₩',
        rating: 4.5,
        address: '서울 중구 을지로 456'
      },
      { 
        id: 'r9', 
        name: '힙지로술집', 
        coordinates: { lat: 37.5668, lng: 126.9924 },
        cuisine: '술집',
        priceRange: '₩₩',
        rating: 4.7,
        address: '서울 중구 을지로 789'
      },
      {
        id: 'r13',
        name: '을지로 와인바',
        coordinates: { lat: 37.5655, lng: 126.9920 },
        cuisine: '와인바',
        priceRange: '₩₩₩',
        rating: 4.8,
        address: '서울 중구 을지로 234'
      },
      {
        id: 'r14',
        name: '골목 이자카야',
        coordinates: { lat: 37.5670, lng: 126.9912 },
        cuisine: '일식',
        priceRange: '₩₩',
        rating: 4.5,
        address: '서울 중구 을지로 567'
      }
    ]
  }
};