// 실제 유명 맛집들의 정확한 좌표
export const realRestaurants: any[] = [
  // 강남역 맛집
  {
    _id: '1',
    name: '스시나루토',
    address: '서울 강남구 강남대로 390',
    coordinates: { lat: 37.4979, lng: 127.0276 },
    category: '일식',
    priceRange: '비싼',
    phoneNumber: '02-555-1234',
    averageRating: 4.6,
    reviewCount: 342,
    detailedAverages: {
      taste: 4.8,
      cleanliness: 4.5,
      service: 4.6,
      price: 4.2,
      location: 4.5
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '2',
    name: '진진',
    address: '서울 강남구 강남대로 374',
    coordinates: { lat: 37.4967, lng: 127.0285 },
    category: '중식',
    priceRange: '보통',
    phoneNumber: '02-555-2345',
    averageRating: 4.4,
    reviewCount: 289,
    detailedAverages: {
      taste: 4.5,
      cleanliness: 4.3,
      service: 4.4,
      price: 4.5,
      location: 4.4
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '3',
    name: '캐치테이블',
    address: '서울 서초구 강남대로 364',
    coordinates: { lat: 37.4955, lng: 127.0289 },
    category: '양식',
    priceRange: '비싼',
    phoneNumber: '02-555-3456',
    averageRating: 4.5,
    reviewCount: 456,
    detailedAverages: {
      taste: 4.6,
      cleanliness: 4.5,
      service: 4.7,
      price: 4.0,
      location: 4.6
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  
  // 홍대 맛집
  {
    _id: '4',
    name: '연남동 감자탕',
    address: '서울 마포구 연남로 1길 45',
    coordinates: { lat: 37.5585, lng: 126.9212 },
    category: '한식',
    priceRange: '보통',
    phoneNumber: '02-333-1111',
    averageRating: 4.3,
    reviewCount: 567,
    detailedAverages: {
      taste: 4.5,
      cleanliness: 4.2,
      service: 4.3,
      price: 4.4,
      location: 4.3
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '5',
    name: '미미네 베트남',
    address: '서울 마포구 와우산로 27길 40',
    coordinates: { lat: 37.5549, lng: 126.9239 },
    category: '동남아',
    priceRange: '저렴한',
    phoneNumber: '02-333-2222',
    averageRating: 4.4,
    reviewCount: 423,
    detailedAverages: {
      taste: 4.6,
      cleanliness: 4.3,
      service: 4.4,
      price: 4.7,
      location: 4.4
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '6',
    name: '쿠이신보',
    address: '서울 마포구 와우산로 23길 35',
    coordinates: { lat: 37.5553, lng: 126.9245 },
    category: '일식',
    priceRange: '비싼',
    phoneNumber: '02-333-3333',
    averageRating: 4.7,
    reviewCount: 334,
    detailedAverages: {
      taste: 4.8,
      cleanliness: 4.7,
      service: 4.6,
      price: 4.3,
      location: 4.7
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  
  // 이태원 맛집
  {
    _id: '7',
    name: '라이너스 바베큐',
    address: '서울 용산구 이태원로27가길 54',
    coordinates: { lat: 37.5347, lng: 126.9943 },
    category: '양식',
    priceRange: '비싼',
    phoneNumber: '02-790-1111',
    averageRating: 4.6,
    reviewCount: 892,
    detailedAverages: {
      taste: 4.7,
      cleanliness: 4.5,
      service: 4.6,
      price: 4.2,
      location: 4.5
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '8',
    name: '타코 아미고',
    address: '서울 용산구 이태원로 15길 18',
    coordinates: { lat: 37.5338, lng: 126.9926 },
    category: '양식',
    priceRange: '보통',
    phoneNumber: '02-790-2222',
    averageRating: 4.3,
    reviewCount: 445,
    detailedAverages: {
      taste: 4.4,
      cleanliness: 4.2,
      service: 4.3,
      price: 4.4,
      location: 4.3
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '9',
    name: '케세라세라',
    address: '서울 용산구 이태원로 146',
    coordinates: { lat: 37.5341, lng: 126.9955 },
    category: '양식',
    priceRange: '비싼',
    phoneNumber: '02-790-3333',
    averageRating: 4.5,
    reviewCount: 667,
    detailedAverages: {
      taste: 4.6,
      cleanliness: 4.4,
      service: 4.5,
      price: 4.1,
      location: 4.5
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  
  // 성수동 맛집
  {
    _id: '10',
    name: '대림창고',
    address: '서울 성동구 성수이로 78',
    coordinates: { lat: 37.5411, lng: 127.0557 },
    category: '카페',
    priceRange: '비싼',
    phoneNumber: '02-467-1111',
    averageRating: 4.2,
    reviewCount: 1234,
    detailedAverages: {
      taste: 4.3,
      cleanliness: 4.4,
      service: 4.1,
      price: 3.9,
      location: 4.4
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '11',
    name: '어니언 성수',
    address: '서울 성동구 아차산로 9길 8',
    coordinates: { lat: 37.5463, lng: 127.0565 },
    category: '카페',
    priceRange: '비싼',
    phoneNumber: '02-467-2222',
    averageRating: 4.4,
    reviewCount: 889,
    detailedAverages: {
      taste: 4.5,
      cleanliness: 4.5,
      service: 4.3,
      price: 4.0,
      location: 4.5
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '12',
    name: '밀도',
    address: '서울 성동구 연무장길 29-9',
    coordinates: { lat: 37.5427, lng: 127.0583 },
    category: '양식',
    priceRange: '매우비싼',
    phoneNumber: '02-467-3333',
    averageRating: 4.7,
    reviewCount: 234,
    detailedAverages: {
      taste: 4.8,
      cleanliness: 4.7,
      service: 4.8,
      price: 4.2,
      location: 4.6
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  
  // 을지로 맛집
  {
    _id: '13',
    name: '을지로 노가리',
    address: '서울 중구 을지로13길 6',
    coordinates: { lat: 37.5657, lng: 126.9913 },
    category: '주점',
    priceRange: '저렴한',
    phoneNumber: '02-222-1111',
    averageRating: 4.1,
    reviewCount: 778,
    detailedAverages: {
      taste: 4.2,
      cleanliness: 3.9,
      service: 4.0,
      price: 4.5,
      location: 4.2
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '14',
    name: '평래옥',
    address: '서울 중구 마른내로 21-1',
    coordinates: { lat: 37.5664, lng: 126.9898 },
    category: '한식',
    priceRange: '보통',
    phoneNumber: '02-222-2222',
    averageRating: 4.5,
    reviewCount: 1456,
    detailedAverages: {
      taste: 4.6,
      cleanliness: 4.4,
      service: 4.5,
      price: 4.4,
      location: 4.5
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  },
  {
    _id: '15',
    name: '을지면옥',
    address: '서울 중구 충무로14길 2-1',
    coordinates: { lat: 37.5651, lng: 126.9917 },
    category: '한식',
    priceRange: '저렴한',
    phoneNumber: '02-222-3333',
    averageRating: 4.3,
    reviewCount: 892,
    detailedAverages: {
      taste: 4.4,
      cleanliness: 4.1,
      service: 4.2,
      price: 4.6,
      location: 4.3
    },
    savedBy: [],
    createdBy: {} as any,
    images: []
  }
];