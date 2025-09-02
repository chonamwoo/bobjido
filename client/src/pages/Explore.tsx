import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { 
  MapPinIcon,
  FunnelIcon,
  FireIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import KoreanMap from '../components/KoreanMap';

interface Restaurant {
  _id: string;
  name: string;
  category: string;
  address: string;
  coordinates: { lat: number; lng: number };
  priceRange: string;
  description: string;
  tags: string[];
  averageRating?: number;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  likeCount?: number;
  images?: { url: string }[];
  popularMenu?: string[];
  noDelivery?: boolean;
  eldersVisit?: boolean;
  deliveryBikesWaiting?: boolean;
  localFavorite?: boolean;
  hardParking?: boolean;
  hiddenGem?: boolean;
}

interface ExpertUser {
  _id: string;
  username: string;
  profileImage?: string;
  tasteStats: {
    visitedCount: number;
    reviewCount: number;
    level: string;
  };
}

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState<ExpertUser[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedPriceRange, setSelectedPriceRange] = useState('전체');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'restaurants' | 'playlists'>('restaurants');

  // 찐맛집 필터 옵션
  const genuineFilters = [
    { id: 'noDelivery', label: '배달 안하는 집', icon: TruckIcon, description: '매장에서만 맛볼 수 있는 진짜' },
    { id: 'eldersVisit', label: '어르신도 리뷰 남긴 집', icon: UserGroupIcon, description: '모든 세대가 인정한' },
    { id: 'deliveryBikesWaiting', label: '배달 오토바이도 줄서는 집', icon: ClockIcon, description: '배달원도 기다리는' },
    { id: 'localFavorite', label: '현지인 단골 많은 집', icon: StarIcon, description: '동네 주민이 사랑하는' },
    { id: 'hardParking', label: '주차 어려운데도 붐비는 집', icon: BuildingStorefrontIcon, description: '불편해도 찾아가는' },
    { id: 'hiddenGem', label: '간판 없어도 찾아오는 집', icon: MapPinIcon, description: '아는 사람만 아는' }
  ];

  const categories = ['전체', '한식', '중식', '일식', '양식', '분식', '카페', '주점', '디저트'];
  const priceRanges = ['전체', '저렴한', '보통', '비싼', '매우비싼'];

  useEffect(() => {
    fetchRestaurants();
    fetchExperts();
    fetchPlaylists();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, selectedFilters, searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants from API...');
      const response = await axios.get('/api/restaurants');
      
      console.log('Restaurant API response:', response);
      
      // response.data.restaurants 형식으로 옴
      const restaurantData = response.data.restaurants || response.data || [];
      
      console.log('Restaurant data:', restaurantData);
      
      // 찐맛집 속성 랜덤 할당 (실제로는 DB에서 가져와야 함)
      const restaurantsWithFilters = restaurantData.map((restaurant: Restaurant) => ({
        ...restaurant,
        noDelivery: Math.random() > 0.6,
        eldersVisit: Math.random() > 0.7,
        deliveryBikesWaiting: Math.random() > 0.8,
        localFavorite: Math.random() > 0.5,
        hardParking: Math.random() > 0.7,
        hiddenGem: Math.random() > 0.85
      }));
      
      setRestaurants(restaurantsWithFilters);
      setLoading(false);
    } catch (error: any) {
      console.error('맛집 로드 실패 - 상세 에러:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 메시지:', error.message);
      toast.error('맛집을 불러오는데 실패했습니다');
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      // 임시 데이터 - 실제로는 API에서 가져와야 함
      const mockExperts = [
        {
          _id: '1',
          username: '서울맛잘알',
          profileImage: 'https://ui-avatars.com/api/?name=서울맛잘알&background=FF6B6B&color=fff',
          tasteStats: {
            visitedCount: 342,
            reviewCount: 128,
            level: '맛집 마스터'
          }
        },
        {
          _id: '2',
          username: '강남구르메',
          profileImage: 'https://ui-avatars.com/api/?name=강남구르메&background=4ECDC4&color=fff',
          tasteStats: {
            visitedCount: 289,
            reviewCount: 95,
            level: '맛집 전문가'
          }
        },
        {
          _id: '3',
          username: '홍대탐험가',
          profileImage: 'https://ui-avatars.com/api/?name=홍대탐험가&background=95E1D3&color=fff',
          tasteStats: {
            visitedCount: 256,
            reviewCount: 82,
            level: '맛집 헌터'
          }
        },
        {
          _id: '4',
          username: '을지로미식가',
          profileImage: 'https://ui-avatars.com/api/?name=을지로미식가&background=F38181&color=fff',
          tasteStats: {
            visitedCount: 198,
            reviewCount: 67,
            level: '맛집 큐레이터'
          }
        }
      ];
      setExperts(mockExperts);
    } catch (error) {
      console.error('전문가 로드 실패:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      // Handle both array and object response formats
      const playlistData = Array.isArray(response.data) ? response.data : (response.data.playlists || []);
      
      // Always use real data from backend
      setPlaylists(playlistData);
    } catch (error) {
      console.error('플레이리스트 로드 실패:', error);
      // Don't use mock data, just set empty array
      setPlaylists([]);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // 가격대 필터
    if (selectedPriceRange !== '전체') {
      filtered = filtered.filter(r => r.priceRange === selectedPriceRange);
    }

    // 찐맛집 필터
    selectedFilters.forEach(filter => {
      filtered = filtered.filter(r => r[filter as keyof Restaurant]);
    });

    // 정렬
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => ((b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0)));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'likes':
        filtered.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'views':
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }

    setFilteredRestaurants(filtered);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
    const [liked, setLiked] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const activeFilters = genuineFilters.filter(f => 
      restaurant[f.id as keyof Restaurant]
    );

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden"
      >
        <div className="relative">
          {/* 이미지/지도 토글 섹션 */}
          <div className="relative h-32 sm:h-40 md:h-48">
            {showMap ? (
              <div className="w-full h-full">
                <KoreanMap 
                  restaurants={[restaurant] as any}
                  className="w-full h-full"
                  zoom={15}
                />
              </div>
            ) : (
              <img
                src={restaurant.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                alt={restaurant.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              />
            )}
            
            {/* 지도 토글 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMap(!showMap);
              }}
              className="absolute top-1 left-1 sm:top-2 sm:left-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
            >
              <MapPinIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${showMap ? 'text-orange-500' : 'text-gray-600'}`} />
            </button>

            {/* 좋아요 버튼 */}
            <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className="p-1.5 sm:p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
              >
                {liked ? (
                  <HeartSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* 필터 배지 */}
            {activeFilters.length > 0 && (
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex flex-wrap gap-0.5 sm:gap-1">
                {activeFilters.slice(0, 2).map(filter => (
                  <span
                    key={filter.id}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-orange-500/90 backdrop-blur text-white text-[10px] sm:text-xs rounded-full"
                  >
                    {filter.label}
                  </span>
                ))}
                {activeFilters.length > 2 && (
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-800/90 backdrop-blur text-white text-[10px] sm:text-xs rounded-full">
                    +{activeFilters.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="p-2 sm:p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate(`/restaurant/${restaurant._id}`)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
            <h3 className="font-bold text-sm sm:text-base md:text-lg truncate pr-1">{restaurant.name}</h3>
            <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{restaurant.category}</span>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-1">{restaurant.address}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
              <span className="text-xs sm:text-sm font-semibold">{(restaurant.averageRating || restaurant.rating || 0).toFixed(1)}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">({restaurant.reviewCount || 0})</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">{restaurant.priceRange}</span>
          </div>

          {restaurant.popularMenu && restaurant.popularMenu.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {restaurant.popularMenu.slice(0, 2).map((menu, idx) => (
                <span key={idx} className="text-xs bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
                  {menu}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">맛집 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">둘러보기</h1>
              <p className="text-sm text-gray-600">
                {viewMode === 'restaurants' 
                  ? `총 ${filteredRestaurants.length}개의 맛집`
                  : `총 ${playlists.length}개의 플레이리스트`}
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>찐맛집 필터</span>
              {selectedFilters.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white text-orange-500 text-xs rounded-full">
                  {selectedFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={() => setViewMode('playlists')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'playlists'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlusIcon className="w-5 h-5 inline mr-2" />
              플레이리스트
            </button>
            <button
              onClick={() => setViewMode('restaurants')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                viewMode === 'restaurants'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BuildingStorefrontIcon className="w-5 h-5 inline mr-2" />
              맛집
            </button>
          </div>

          {/* 검색바 */}
          <div className="mt-4 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="맛집 이름, 지역, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* 필터 옵션들 */}
          <div className="mt-4 flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {priceRanges.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="rating">평점순</option>
              <option value="reviews">리뷰순</option>
              <option value="likes">좋아요순</option>
              <option value="views">조회순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 찐맛집 필터 패널 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">찐맛집 필터</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {genuineFilters.map(filter => {
                const Icon = filter.icon;
                const isActive = selectedFilters.includes(filter.id);
                
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-6 h-6 ${isActive ? 'text-orange-500' : 'text-gray-600'}`} />
                      <div className="text-left">
                        <p className={`font-semibold ${isActive ? 'text-orange-600' : 'text-gray-900'}`}>
                          {filter.label}
                        </p>
                        <p className="text-xs text-gray-500">{filter.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedFilters.length > 0 && (
              <button
                onClick={() => setSelectedFilters([])}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                필터 초기화
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 콘텐츠 그리드 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'playlists' ? (
          // 플레이리스트 뷰
          playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map(playlist => (
                <motion.div
                  key={playlist._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                >
                  <div className="relative h-48">
                    <img
                      src={playlist.coverImage || 'https://via.placeholder.com/400x300'}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{playlist.name}</h3>
                      <p className="text-sm opacity-90">{playlist.restaurantCount}개 맛집</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {playlist.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${playlist.createdBy.username}&background=random`}
                          alt={playlist.createdBy.username}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{playlist.createdBy.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HeartIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{playlist.followerCount}</span>
                      </div>
                    </div>
                    {playlist.tags && playlist.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {playlist.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PlusIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">플레이리스트가 없습니다</h3>
              <p className="text-gray-500">첫 번째 플레이리스트를 만들어보세요</p>
            </div>
          )
        ) : (
          // 맛집 뷰
          filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500">다른 필터를 선택해보세요</p>
            </div>
          )
        )}
      </div>

      {/* 맛잘알 추천 섹션 */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">
            <FireIcon className="w-6 h-6 inline mr-2 text-orange-500" />
            이 지역 맛잘알들
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {experts.map(expert => (
              <motion.div
                key={expert._id}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 cursor-pointer"
                onClick={() => navigate(`/profile/${expert.username}`)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={expert.profileImage}
                    alt={expert.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{expert.username}</p>
                    <p className="text-xs text-orange-600">{expert.tasteStats.level}</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600">
                  <div>
                    <p className="font-semibold">{expert.tasteStats.visitedCount}</p>
                    <p>방문</p>
                  </div>
                  <div>
                    <p className="font-semibold">{expert.tasteStats.reviewCount}</p>
                    <p>리뷰</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;