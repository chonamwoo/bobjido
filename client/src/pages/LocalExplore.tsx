import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getRestaurantImage } from '../utils/restaurantImages';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  area: string;
  tags: string[];
  distance?: string;
  isHot?: boolean;
  matchingUsers?: number;
  image?: string;
}

const LocalExplore: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState('강남');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 지역별 맛집 데이터
  const restaurantsByArea: Record<string, Restaurant[]> = {
    '강남': [
      { id: '1', name: '스시 오마카세 긴자', category: '일식', rating: 4.8, reviews: 342, priceRange: '$$$$', area: '청담동', tags: ['오마카세', '예약필수', '데이트'], isHot: true, matchingUsers: 18, image: getRestaurantImage('스시 오마카세') },
      { id: '2', name: '육즙가득 한우집', category: '한식', rating: 4.7, reviews: 567, priceRange: '$$$', area: '역삼동', tags: ['한우', '점심특선', '회식'], matchingUsers: 24, image: getRestaurantImage('한우집') },
      { id: '3', name: '파스타 부티크', category: '양식', rating: 4.6, reviews: 289, priceRange: '$$', area: '신사동', tags: ['파스타', '와인', '분위기'], matchingUsers: 15, image: getRestaurantImage('파스타') },
      { id: '4', name: '김치찌개 맛집', category: '한식', rating: 4.5, reviews: 892, priceRange: '$', area: '강남역', tags: ['김치찌개', '24시간', '혼밥'], isHot: true, matchingUsers: 31, image: getRestaurantImage('김치찌개') },
      { id: '5', name: '베트남 쌀국수', category: '아시안', rating: 4.4, reviews: 445, priceRange: '$', area: '선릉역', tags: ['쌀국수', '분짜', '가성비'], matchingUsers: 12, image: getRestaurantImage('쌀국수') },
      { id: '6', name: '수제버거 브루클린', category: '양식', rating: 4.6, reviews: 623, priceRange: '$$', area: '압구정', tags: ['수제버거', '맥주', '테라스'], matchingUsers: 28, image: getRestaurantImage('수제버거') }
    ],
    '홍대': [
      { id: '7', name: '라멘 야로', category: '일식', rating: 4.7, reviews: 778, priceRange: '$$', area: '연남동', tags: ['라멘', '츠케멘', '줄서는집'], isHot: true, matchingUsers: 42, image: getRestaurantImage('라멘') },
      { id: '8', name: '브런치 카페 데이지', category: '카페', rating: 4.5, reviews: 556, priceRange: '$$', area: '상수동', tags: ['브런치', '에그베네딕트', '루프탑'], matchingUsers: 35, image: getRestaurantImage('브런치') },
      { id: '9', name: '감자탕 24시', category: '한식', rating: 4.4, reviews: 901, priceRange: '$', area: '합정역', tags: ['감자탕', '24시간', '해장'], matchingUsers: 19, image: getRestaurantImage('감자탕') },
      { id: '10', name: '타코 멕시칸', category: '멕시칸', rating: 4.6, reviews: 334, priceRange: '$$', area: '홍대입구', tags: ['타코', '부리또', '데킬라'], isHot: true, matchingUsers: 27, image: getRestaurantImage('타코') },
      { id: '11', name: '수제 피자하우스', category: '양식', rating: 4.5, reviews: 445, priceRange: '$$', area: '연남동', tags: ['화덕피자', '크래프트비어', '데이트'], matchingUsers: 21, image: getRestaurantImage('피자') }
    ],
    '이태원': [
      { id: '12', name: '바베큐 플래터', category: '양식', rating: 4.8, reviews: 223, priceRange: '$$$', area: '이태원역', tags: ['BBQ', '스테이크', '외국인'], isHot: true, matchingUsers: 38, image: getRestaurantImage('바베큐') },
      { id: '13', name: '인도 커리하우스', category: '인도', rating: 4.6, reviews: 412, priceRange: '$$', area: '녹사평', tags: ['커리', '난', '채식옵션'], matchingUsers: 16, image: getRestaurantImage('커리') },
      { id: '14', name: '터키 케밥', category: '중동', rating: 4.5, reviews: 298, priceRange: '$', area: '이태원로', tags: ['케밥', '할랄', '테이크아웃'], matchingUsers: 11, image: getRestaurantImage('케밥') },
      { id: '15', name: '프렌치 비스트로', category: '양식', rating: 4.7, reviews: 187, priceRange: '$$$$', area: '한남동', tags: ['프렌치', '와인', '미쉐린'], matchingUsers: 9, image: getRestaurantImage('프렌치') }
    ],
    '성수': [
      { id: '16', name: '베이커리 카페 밀', category: '카페', rating: 4.6, reviews: 667, priceRange: '$$', area: '성수역', tags: ['베이커리', '커피', '인스타'], isHot: true, matchingUsers: 45, image: getRestaurantImage('베이커리') },
      { id: '17', name: '갈비탕 전문점', category: '한식', rating: 4.7, reviews: 543, priceRange: '$$', area: '뚝섬역', tags: ['갈비탕', '설렁탕', '전통'], matchingUsers: 22, image: getRestaurantImage('갈비탕') },
      { id: '18', name: '수제 맥주 펍', category: '펍', rating: 4.5, reviews: 389, priceRange: '$$', area: '서울숲', tags: ['크래프트비어', '안주', '라이브'], matchingUsers: 33, image: getRestaurantImage('맥주') },
      { id: '19', name: '비건 레스토랑', category: '비건', rating: 4.4, reviews: 234, priceRange: '$$$', area: '성수동', tags: ['비건', '유기농', '건강식'], matchingUsers: 14, image: getRestaurantImage('비건') }
    ],
    '종로': [
      { id: '20', name: '전통 한정식', category: '한식', rating: 4.8, reviews: 456, priceRange: '$$$$', area: '인사동', tags: ['한정식', '전통', '예약필수'], matchingUsers: 8, image: getRestaurantImage('한정식') },
      { id: '21', name: '북촌 순두부', category: '한식', rating: 4.6, reviews: 789, priceRange: '$', area: '북촌', tags: ['순두부', '김치', '전통맛'], isHot: true, matchingUsers: 29, image: getRestaurantImage('순두부') },
      { id: '22', name: '광장시장 마약김밥', category: '분식', rating: 4.5, reviews: 1234, priceRange: '$', area: '광장시장', tags: ['김밥', '떡볶이', '시장'], matchingUsers: 51, image: getRestaurantImage('김밥') },
      { id: '23', name: '종로 설렁탕', category: '한식', rating: 4.7, reviews: 902, priceRange: '$$', area: '종각', tags: ['설렁탕', '100년전통', '아침식사'], matchingUsers: 17, image: getRestaurantImage('설렁탕') }
    ]
  };

  const areas = ['강남', '홍대', '이태원', '성수', '종로'];
  const categories = ['전체', '한식', '일식', '양식', '중식', '아시안', '카페', '펍'];

  const currentRestaurants = selectedCategory === '전체' 
    ? restaurantsByArea[selectedArea] || []
    : (restaurantsByArea[selectedArea] || []).filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">지역별 맛집 탐색</h1>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FunnelIcon className="w-5 h-5" />
              <span>필터</span>
            </button>
          </div>

          {/* Area Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedArea === area
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pt-3 mt-3 border-t">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`${selectedArea}에서 맛집 검색...`}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">현재 {selectedArea} 지역</p>
              <p className="text-2xl font-bold">{currentRestaurants.length}개 맛집</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">매칭 중인 사용자</p>
              <p className="text-2xl font-bold">
                {currentRestaurants.reduce((sum, r) => sum + (r.matchingUsers || 0), 0)}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.isHot && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FireIcon className="w-3 h-3" />
                    HOT
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                  {restaurant.priceRange}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.category} · {restaurant.area}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({restaurant.reviews})</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {restaurant.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Matching Users */}
                {restaurant.matchingUsers && restaurant.matchingUsers > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium text-orange-500">{restaurant.matchingUsers}명</span>이 관심있어해요
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalExplore;