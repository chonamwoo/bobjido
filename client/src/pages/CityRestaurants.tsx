import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ClockIcon,
  PhoneIcon,
  TagIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import {
  Restaurant,
  getRestaurantsByCity,
  getRestaurantsByCategory,
  getPopularRestaurants,
  getFeaturedRestaurants,
  getNewRestaurants,
  searchRestaurants,
  getCityStats
} from '../utils/restaurantData';
import { getDefaultRestaurantImage } from '../utils/restaurantImages';

interface LocationState {
  cityData?: any;
  restaurants?: Restaurant[];
  isGlobalExploration?: boolean;
}

const CityRestaurants: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedRestaurants, setLikedRestaurants] = useState<Set<string>>(new Set());

  const decodedCityName = decodeURIComponent(cityName || '');
  const cityData = state?.cityData;
  const isGlobalExploration = state?.isGlobalExploration;

  useEffect(() => {
    if (state?.restaurants) {
      setRestaurants(state.restaurants);
      setFilteredRestaurants(state.restaurants);
    } else {
      const cityRestaurants = getRestaurantsByCity(decodedCityName);
      setRestaurants(cityRestaurants);
      setFilteredRestaurants(cityRestaurants);
    }
  }, [decodedCityName, state]);

  useEffect(() => {
    let filtered = restaurants;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = getRestaurantsByCategory(decodedCityName, selectedCategory);
    }

    // 추가 필터
    switch (selectedFilter) {
      case 'popular':
        filtered = filtered.filter(r => r.isPopular);
        break;
      case 'featured':
        filtered = filtered.filter(r => r.featured);
        break;
      case 'new':
        filtered = filtered.filter(r => r.isNew);
        break;
      case 'high-rated':
        filtered = filtered.filter(r => r.rating >= 4.5);
        break;
      case 'budget':
        filtered = filtered.filter(r => r.priceRange === '₩' || r.priceRange === '₩₩');
        break;
      case 'luxury':
        filtered = filtered.filter(r => r.priceRange === '₩₩₩₩');
        break;
    }

    // 검색 필터
    if (searchQuery) {
      filtered = searchRestaurants(decodedCityName, searchQuery).filter(r => 
        filtered.includes(r)
      );
    }

    setFilteredRestaurants(filtered);
  }, [selectedCategory, selectedFilter, searchQuery, restaurants, decodedCityName]);

  const categories = [
    { id: 'all', name: '전체', emoji: '🍽️' },
    { id: 'korean', name: '한식', emoji: '🍚' },
    { id: 'japanese', name: '일식', emoji: '🍣' },
    { id: 'chinese', name: '중식', emoji: '🥟' },
    { id: 'italian', name: '양식', emoji: '🍝' },
    { id: 'cafe', name: '카페', emoji: '☕' },
    { id: 'seafood', name: '해산물', emoji: '🦐' },
    { id: 'fastfood', name: '패스트푸드', emoji: '🍔' },
    { id: 'bar', name: '술집', emoji: '🍻' },
    { id: 'dessert', name: '디저트', emoji: '🧁' }
  ];

  const filters = [
    { id: 'all', name: '전체', icon: ListBulletIcon },
    { id: 'featured', name: '추천', icon: StarIcon },
    { id: 'popular', name: '인기', icon: FireIcon },
    { id: 'new', name: '신규', icon: SparklesIcon },
    { id: 'high-rated', name: '고평점', icon: StarSolid },
    { id: 'budget', name: '가성비', icon: TagIcon },
    { id: 'luxury', name: '고급', icon: StarSolid }
  ];

  const handleLikeRestaurant = (restaurantId: string) => {
    setLikedRestaurants(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(restaurantId)) {
        newLiked.delete(restaurantId);
      } else {
        newLiked.add(restaurantId);
      }
      return newLiked;
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="relative">
        {i < Math.floor(rating) ? (
          <StarSolid className="w-4 h-4 text-yellow-400" />
        ) : i < rating ? (
          <div className="relative">
            <StarIcon className="w-4 h-4 text-gray-300" />
            <StarSolid 
              className="w-4 h-4 text-yellow-400 absolute top-0 left-0"
              style={{ clipPath: `inset(0 ${100 - (rating - i) * 100}% 0 0)` }}
            />
          </div>
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </div>
    ));
  };

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <GlobeAltIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            {decodedCityName} 레스토랑 정보 준비 중
          </h2>
          <p className="text-gray-500 mb-4">곧 더 많은 맛집 정보를 제공할 예정입니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const stats = getCityStats(decodedCityName);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              {cityData?.flag && <span className="text-2xl">{cityData.flag}</span>}
              <div>
                <h1 className="text-lg font-bold">{decodedCityName} 맛집</h1>
                <p className="text-xs text-gray-500">
                  {stats.totalRestaurants}개 레스토랑 · 평균 ★{stats.averageRating.toFixed(1)}
                </p>
              </div>
            </div>
            {isGlobalExploration && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                글로벌 탐험
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 도시 정보 배너 */}
      {cityData && (
        <div 
          className="h-48 relative bg-gradient-to-br from-blue-400 to-purple-500"
          style={{
            backgroundImage: `url(${cityData.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{cityData.flag}</span>
              <h2 className="text-2xl font-bold">{decodedCityName}</h2>
              <span className="text-lg opacity-80">{cityData.country}</span>
            </div>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>{stats.totalRestaurants}곳의 맛집</span>
              <span>평균 {cityData.avgBudget}</span>
              <span>★ {stats.averageRating.toFixed(1)}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {stats.cuisineTypes.slice(0, 4).map(cuisine => (
                <span key={cuisine} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="레스토랑, 음식 종류 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border'
                }`}
              >
                <span>{category.emoji}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* 추가 필터 및 뷰 모드 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-sm ${
                    selectedFilter === filter.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`}
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 결과 헤더 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filteredRestaurants.length}</span>개의 레스토랑을 찾았습니다
            {searchQuery && <span> "{searchQuery}" 검색 결과</span>}
          </p>
        </div>

        {/* 레스토랑 목록 */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredRestaurants.map(restaurant => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                viewMode === 'list' ? 'flex gap-4 p-4' : 'overflow-hidden'
              }`}
            >
              {/* 이미지 */}
              <div className={viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48 w-full'}>
                <img
                  src={restaurant.images[0] || getDefaultRestaurantImage(restaurant.name)}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {restaurant.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                    추천
                  </div>
                )}
                {restaurant.isNew && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                    신규
                  </div>
                )}
              </div>

              {/* 정보 */}
              <div className={viewMode === 'list' ? 'flex-1 py-1' : 'p-4'}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeRestaurant(restaurant.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {likedRestaurants.has(restaurant.id) ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>

                {/* 평점 */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {getRatingStars(restaurant.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                  <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                </div>

                {/* 위치 및 가격 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{restaurant.district}</span>
                  </div>
                  <span className="font-medium text-blue-600">{restaurant.priceRange}</span>
                </div>

                {/* 특산 음식 */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {restaurant.specialties.slice(0, 3).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* 영업시간 */}
                {viewMode === 'list' && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span>{restaurant.openHours}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityRestaurants;