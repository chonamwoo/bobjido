import { getRestaurantImage } from '../utils/restaurantImageGenerator';

// Helper function to add images to restaurants
function addImagesToRestaurants(restaurants: any[]) {
  return restaurants.map(item => {
    if (item.restaurant && !item.restaurant.image) {
      return {
        ...item,
        restaurant: {
          ...item.restaurant,
          image: getRestaurantImage(item.restaurant.name, item.restaurant.category)
        }
      };
    }
    return item;
  });
}

export interface RestaurantList {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdBy: {
    _id: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  restaurants: Array<{
    restaurant: {
      _id: string;
      name: string;
      category: string;
      address: string;
      rating?: number;
      coordinates?: { lat: number; lng: number };
    };
    personalNote?: string;
    mustTry?: string[];
  }>;
  tags: string[];
  likeCount: number;
  saveCount: number;
  viewCount: number;
  createdAt: string;
  coverImage?: string;
  certification?: string;
  isPublic: boolean;
  restaurantCount: number;
  estimatedDuration?: number;
  estimatedCost?: {
    min?: number;
    max?: number;
    perPerson?: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  canEdit?: boolean;
}

const originalCertifiedRestaurantLists: RestaurantList[] = [
  {
    _id: 'list-black-white',
    title: '흑백요리사 출연 맛집',
    description: 'Netflix 흑백요리사에 출연한 셰프들의 레스토랑 모음',
    category: '미디어 인증',
    createdBy: {
      _id: 'user-black-white',
      username: '흑백요리사',
      isVerified: true
    },
    restaurants: [
      { 
        restaurant: { 
          _id: 'rest-imperial', 
          name: '임페리얼 트레져', 
          category: '중식', 
          address: '서울 강남구 테헤란로87길 46',
          rating: 4.8,
          coordinates: { lat: 37.5044, lng: 127.0399 }
        },
        personalNote: '흑백요리사 우승 셰프의 중식당',
        mustTry: ['마파두부', '깐풍기']
      },
      { 
        restaurant: { 
          _id: 'rest-neo', 
          name: '네오포차', 
          category: '주점', 
          address: '서울 마포구 와우산로29길 6',
          rating: 4.5,
          coordinates: { lat: 37.5564, lng: 126.9239 }
        },
        personalNote: '흑백요리사 출연 안주 맛집'
      },
      { 
        restaurant: { 
          _id: 'rest-sushi', 
          name: '스시조', 
          category: '일식', 
          address: '서울 강남구 도산대로 317',
          rating: 4.7,
          coordinates: { lat: 37.5274, lng: 127.0386 }
        },
        personalNote: '오마카세 전문점'
      },
      { 
        restaurant: { 
          _id: 'rest-jungsik', 
          name: '정식당', 
          category: '한식', 
          address: '서울 강남구 선릉로158길 11',
          rating: 4.9,
          coordinates: { lat: 37.5249, lng: 127.0475 }
        },
        personalNote: '모던 한식의 정수'
      }
    ],
    tags: ['흑백요리사', 'Netflix', '파인다이닝'],
    likeCount: 3421,
    saveCount: 892,
    viewCount: 15234,
    createdAt: '2024-11-01T00:00:00.000Z',
    coverImage: getRestaurantImage('흑백요리사', '중식'),
    certification: '흑백요리사',
    isPublic: true,
    restaurantCount: 4,
    estimatedDuration: 180,
    estimatedCost: {
      min: 50000,
      max: 150000,
      perPerson: true
    }
  },
  {
    _id: 'list-wednesday',
    title: '수요미식회 소개 맛집',
    description: '수요미식회에서 극찬한 전국 맛집 모음',
    category: '미디어 인증',
    createdBy: {
      _id: 'user-wednesday',
      username: '수요미식회',
      isVerified: true
    },
    restaurants: [
      { 
        restaurant: { 
          _id: 'rest-pyeongrae', 
          name: '평래옥', 
          category: '한식', 
          address: '서울 중구 마른내로 21-1',
          rating: 4.6,
          coordinates: { lat: 37.5665, lng: 126.9780 }
        },
        personalNote: '평양냉면의 진수',
        mustTry: ['평양냉면', '제육']
      },
      { 
        restaurant: { 
          _id: 'rest-linus', 
          name: '라이너스 바베큐', 
          category: '양식', 
          address: '서울 용산구 이태원로 135',
          rating: 4.7,
          coordinates: { lat: 37.5340, lng: 126.9940 }
        },
        personalNote: '정통 텍사스 바베큐'
      },
      { 
        restaurant: { 
          _id: 'rest-eulji', 
          name: '을지면옥', 
          category: '한식', 
          address: '서울 중구 충무로14길 2-1',
          rating: 4.5,
          coordinates: { lat: 37.5633, lng: 126.9910 }
        },
        personalNote: '숨은 냉면 맛집'
      },
      { 
        restaurant: { 
          _id: 'rest-urae', 
          name: '우래옥', 
          category: '한식', 
          address: '서울 중구 창경궁로 62-29',
          rating: 4.5,
          coordinates: { lat: 37.5712, lng: 127.0089 }
        },
        personalNote: '불고기 전문점'
      }
    ],
    tags: ['수요미식회', 'tvN', '맛집탐방'],
    likeCount: 2987,
    saveCount: 743,
    viewCount: 12456,
    createdAt: '2024-10-15T00:00:00.000Z',
    coverImage: getRestaurantImage('수요미식회', '한식'),
    certification: '수요미식회',
    isPublic: true,
    restaurantCount: 4,
    estimatedDuration: 120,
    estimatedCost: {
      min: 20000,
      max: 50000,
      perPerson: true
    }
  },
  {
    _id: 'list-michelin',
    title: '미쉐린 가이드 선정',
    description: '2024 미쉐린 가이드 서울 스타 레스토랑',
    category: '공식 인증',
    createdBy: {
      _id: 'user-michelin',
      username: '미쉐린가이드',
      isVerified: true
    },
    restaurants: [
      { 
        restaurant: { 
          _id: 'rest-mingles', 
          name: '밍글스', 
          category: '양식', 
          address: '서울 강남구 도산대로67길 19',
          rating: 4.9,
          coordinates: { lat: 37.5243, lng: 127.0422 }
        },
        personalNote: '미쉐린 2스타'
      },
      { 
        restaurant: { 
          _id: 'rest-gotgan', 
          name: '곳간', 
          category: '한식', 
          address: '서울 강남구 테헤란로87길 33',
          rating: 4.8,
          coordinates: { lat: 37.5089, lng: 127.0631 }
        },
        personalNote: '미쉐린 1스타'
      },
      { 
        restaurant: { 
          _id: 'rest-layeon', 
          name: '라연', 
          category: '한식', 
          address: '서울 중구 을지로 30',
          rating: 4.9,
          coordinates: { lat: 37.5663, lng: 126.9784 }
        },
        personalNote: '미쉐린 3스타'
      },
      { 
        restaurant: { 
          _id: 'rest-poom', 
          name: '품서울', 
          category: '한식', 
          address: '서울 강남구 선릉로 830',
          rating: 4.7,
          coordinates: { lat: 37.5182, lng: 127.0473 }
        },
        personalNote: '미쉐린 1스타'
      }
    ],
    tags: ['미쉐린', '파인다이닝', '스타레스토랑'],
    likeCount: 4567,
    saveCount: 1234,
    viewCount: 18976,
    createdAt: '2024-11-20T00:00:00.000Z',
    coverImage: getRestaurantImage('미쉐린', '양식'),
    certification: '미쉐린스타',
    isPublic: true,
    restaurantCount: 4,
    estimatedDuration: 240,
    estimatedCost: {
      min: 100000,
      max: 300000,
      perPerson: true
    }
  },
  {
    _id: 'list-baek-3kings',
    title: '백종원의 3대천왕',
    description: '백종원이 선정한 각 분야 최고의 3대 맛집',
    category: '미디어 인증',
    createdBy: {
      _id: 'user-baek',
      username: '백종원의3대천왕',
      isVerified: true
    },
    restaurants: [
      { 
        restaurant: { 
          _id: 'rest-jinjin', 
          name: '진진', 
          category: '중식', 
          address: '서울 마포구 포은로 6길 20',
          rating: 4.5,
          coordinates: { lat: 37.5597, lng: 126.9526 }
        },
        personalNote: '짜장면 3대천왕'
      },
      { 
        restaurant: { 
          _id: 'rest-hongtak', 
          name: '홍탁집', 
          category: '한식', 
          address: '서울 종로구 종로 40가길 17',
          rating: 4.3,
          coordinates: { lat: 37.5726, lng: 126.9945 }
        },
        personalNote: '순대국 3대천왕'
      },
      { 
        restaurant: { 
          _id: 'rest-hwanghae', 
          name: '황해면옥', 
          category: '한식', 
          address: '서울 중구 마른내로 35',
          rating: 4.4,
          coordinates: { lat: 37.5672, lng: 126.9768 }
        },
        personalNote: '냉면 3대천왕'
      },
      { 
        restaurant: { 
          _id: 'rest-gyodong', 
          name: '교동짬뽕', 
          category: '중식', 
          address: '서울 마포구 마포대로 12길 17',
          rating: 4.6,
          coordinates: { lat: 37.5448, lng: 126.9573 }
        },
        personalNote: '짬뽕 3대천왕'
      }
    ],
    tags: ['백종원', '3대천왕', 'SBS'],
    likeCount: 2234,
    saveCount: 567,
    viewCount: 9876,
    createdAt: '2024-10-25T00:00:00.000Z',
    coverImage: getRestaurantImage('백종원', '중식'),
    certification: '백종원의3대천왕',
    isPublic: true,
    restaurantCount: 4,
    estimatedDuration: 90,
    estimatedCost: {
      min: 10000,
      max: 30000,
      perPerson: true
    }
  },
  {
    _id: 'list-master',
    title: '생활의달인 인정 맛집',
    description: 'SBS 생활의달인이 인정한 장인의 맛집',
    category: '미디어 인증',
    createdBy: {
      _id: 'user-master',
      username: '생활의달인',
      isVerified: true
    },
    restaurants: [
      { 
        restaurant: { 
          _id: 'rest-yeonnam-gamja', 
          name: '연남동 감자탕', 
          category: '한식', 
          address: '서울 마포구 성미산로 190',
          rating: 4.4,
          coordinates: { lat: 37.5631, lng: 126.9248 }
        },
        personalNote: '감자탕 달인'
      },
      { 
        restaurant: { 
          _id: 'rest-sinlim-sundae', 
          name: '신림동 순대타운', 
          category: '한식', 
          address: '서울 관악구 신림로59길 14',
          rating: 4.3,
          coordinates: { lat: 37.4840, lng: 126.9295 }
        },
        personalNote: '순대볶음 달인'
      },
      { 
        restaurant: { 
          _id: 'rest-gwangjang-bindae', 
          name: '광장시장 빈대떡', 
          category: '한식', 
          address: '서울 종로구 종로32길 5',
          rating: 4.5,
          coordinates: { lat: 37.5704, lng: 126.9998 }
        },
        personalNote: '빈대떡 달인'
      },
      { 
        restaurant: { 
          _id: 'rest-tongin-tteokbokki', 
          name: '통인시장 기름떡볶이', 
          category: '분식', 
          address: '서울 종로구 자하문로15길 18',
          rating: 4.4,
          coordinates: { lat: 37.5808, lng: 126.9707 }
        },
        personalNote: '기름떡볶이 달인'
      }
    ],
    tags: ['생활의달인', 'SBS', '장인'],
    likeCount: 1876,
    saveCount: 432,
    viewCount: 7654,
    createdAt: '2024-11-05T00:00:00.000Z',
    coverImage: getRestaurantImage('생활의달인', '한식'),
    certification: '생활의달인',
    isPublic: true,
    restaurantCount: 4,
    estimatedDuration: 150,
    estimatedCost: {
      min: 15000,
      max: 40000,
      perPerson: true
    }
  }
];

// Export with images added to all restaurants
export const certifiedRestaurantLists: RestaurantList[] = originalCertifiedRestaurantLists.map(list => ({
  ...list,
  restaurants: addImagesToRestaurants(list.restaurants)
}));

// Helper functions
export const getTrendingLists = () => {
  return [...certifiedRestaurantLists]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 6);
};

export const getLatestLists = () => {
  return [...certifiedRestaurantLists]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
};

export const getListsByCategory = (category: string) => {
  return certifiedRestaurantLists.filter(list => list.category === category);
};