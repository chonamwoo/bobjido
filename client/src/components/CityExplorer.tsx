import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GlobeAltIcon,
  MapPinIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  HeartIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getRestaurantsByCity, getCityStats } from '../utils/restaurantData';

interface CityData {
  name: string;
  country: string;
  flag: string;
  restaurantCount: number;
  matchedUsers: number;
  trending: boolean;
  hot?: boolean;
  category: 'asia' | 'europe' | 'americas' | 'oceania' | 'africa';
  image: string;
  specialties: string[];
  avgBudget: string;
}

const CityExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 실제 레스토랑 데이터를 기반으로 도시 정보 업데이트
  const getCityDataWithStats = (cityName: string, country: string, flag: string, category: 'asia' | 'europe' | 'americas' | 'oceania' | 'africa', image: string, trending = false, hot = false) => {
    const stats = getCityStats(cityName);
    const restaurants = getRestaurantsByCity(cityName);
    
    return {
      name: cityName,
      country,
      flag,
      restaurantCount: stats.totalRestaurants,
      matchedUsers: Math.floor(stats.totalReviews / 50), // 리뷰 수 기반으로 매칭 사용자 추정
      trending,
      hot,
      category,
      image,
      specialties: stats.cuisineTypes.slice(0, 3),
      avgBudget: stats.priceRanges.includes('₩₩₩₩') ? '₩₩₩₩' : stats.priceRanges.includes('₩₩₩') ? '₩₩₩' : '₩₩'
    };
  };

  const cities: CityData[] = [
    // 아시아
    getCityDataWithStats('도쿄', 'Japan', '🇯🇵', 'asia', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', true, true),
    getCityDataWithStats('서울', 'Korea', '🇰🇷', 'asia', 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400', true, false),
    getCityDataWithStats('싱가포르', 'Singapore', '🇸🇬', 'asia', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400', true, true),
    // 실제 데이터가 없는 도시들은 기존 방식으로 유지
    {
      name: '방콕',
      country: 'Thailand',
      flag: '🇹🇭',
      restaurantCount: 198,
      matchedUsers: 45,
      trending: false,
      category: 'asia',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400',
      specialties: ['스트릿푸드', '팟타이', '똠얌꿍'],
      avgBudget: '₩'
    },
    {
      name: '홍콩',
      country: 'Hong Kong',
      flag: '🇭🇰',
      restaurantCount: 223,
      matchedUsers: 78,
      trending: false,
      category: 'asia',
      image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400',
      specialties: ['딤섬', '완탕면', '에그타르트'],
      avgBudget: '₩₩₩'
    },
    // 유럽
    getCityDataWithStats('파리', 'France', '🇫🇷', 'europe', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', true, false),
    getCityDataWithStats('바르셀로나', 'Spain', '🇪🇸', 'europe', 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=400', true, true),
    {
      name: '런던',
      country: 'UK',
      flag: '🇬🇧',
      restaurantCount: 234,
      matchedUsers: 56,
      trending: false,
      category: 'europe',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
      specialties: ['펍', '피쉬앤칩스', '애프터눈티'],
      avgBudget: '₩₩₩'
    },
    {
      name: '로마',
      country: 'Italy',
      flag: '🇮🇹',
      restaurantCount: 276,
      matchedUsers: 81,
      trending: false,
      category: 'europe',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
      specialties: ['파스타', '피자', '젤라또'],
      avgBudget: '₩₩'
    },
    // 아메리카
    getCityDataWithStats('뉴욕', 'USA', '🇺🇸', 'americas', 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400', true, false),
    {
      name: '멕시코시티',
      country: 'Mexico',
      flag: '🇲🇽',
      restaurantCount: 167,
      matchedUsers: 38,
      trending: false,
      category: 'americas',
      image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400',
      specialties: ['타코', '부리또', '테킬라'],
      avgBudget: '₩'
    },
    // 오세아니아
    {
      name: '시드니',
      country: 'Australia',
      flag: '🇦🇺',
      restaurantCount: 198,
      matchedUsers: 54,
      trending: false,
      category: 'oceania',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400',
      specialties: ['브런치', '시푸드', 'BBQ'],
      avgBudget: '₩₩₩'
    }
  ];

  const categories = [
    { id: 'all', name: '전체', icon: GlobeAltIcon },
    { id: 'asia', name: '아시아', emoji: '🌏' },
    { id: 'europe', name: '유럽', emoji: '🌍' },
    { id: 'americas', name: '아메리카', emoji: '🌎' },
    { id: 'oceania', name: '오세아니아', emoji: '🏝️' }
  ];

  const filteredCities = cities.filter(city => {
    const matchesCategory = selectedCategory === 'all' || city.category === selectedCategory;
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCityClick = (city: CityData) => {
    const cityRestaurants = getRestaurantsByCity(city.name);
    
    if (cityRestaurants.length > 0) {
      // 실제 레스토랑 데이터가 있는 경우 - 도시별 레스토랑 페이지로 이동
      navigate(`/city-restaurants/${encodeURIComponent(city.name)}`, { 
        state: { 
          cityData: city,
          restaurants: cityRestaurants,
          isGlobalExploration: true
        }
      });
    } else {
      // 레스토랑 데이터가 없는 경우 - 기존 explore 페이지로 이동
      navigate('/explore', { 
        state: { 
          locationMode: 'global',
          selectedCity: city.name,
          selectedCountry: city.country 
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GlobeAltIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">도시별 맛집 탐험</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {filteredCities.length}개 도시
          </span>
        </div>
        
        {/* 검색 */}
        <div className="relative">
          <input
            type="text"
            placeholder="도시, 음식 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {category.emoji && <span className="text-lg">{category.emoji}</span>}
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* 인기 도시 TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filteredCities.filter(city => city.hot).slice(0, 3).map((city, index) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCityClick(city)}
            className="relative overflow-hidden rounded-xl cursor-pointer group"
          >
            <div className="aspect-w-16 aspect-h-9 relative h-32">
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* HOT 뱃지 */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <FireIcon className="w-3 h-3" />
                HOT
              </div>
              
              {/* 순위 */}
              <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
              </div>
              
              {/* 도시 정보 */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">{city.flag}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{city.name}</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {city.restaurantCount}곳
                      </span>
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-3 h-3" />
                        {city.matchedUsers}명
                      </span>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 도시 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredCities.map(city => (
          <motion.button
            key={city.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCityClick(city)}
            className="relative p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group bg-white"
          >
            {/* 트렌딩 뱃지 */}
            {city.trending && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" />
                인기
              </div>
            )}
            
            <div className="text-3xl mb-2">{city.flag}</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
              {city.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">{city.country}</p>
            
            {/* 특산 음식 */}
            <div className="flex flex-wrap gap-1 mb-2">
              {city.specialties.slice(0, 2).map((specialty, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {specialty}
                </span>
              ))}
            </div>
            
            {/* 통계 */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                <span className="font-medium text-gray-700">{city.restaurantCount}</span> 맛집
              </span>
              <span className="text-gray-500">
                {city.avgBudget}
              </span>
            </div>
            
            {/* 매칭된 사용자 */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(Math.min(3, Math.floor(city.matchedUsers / 30)))].map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-xs text-blue-600 font-medium">
                  {city.matchedUsers}명
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 더 많은 도시 추가 예정 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          더 많은 도시가 곧 추가될 예정입니다 🌏
        </p>
      </div>
    </div>
  );
};

export default CityExplorer;