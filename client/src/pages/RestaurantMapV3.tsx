import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import KoreanMap from '../components/KoreanMap';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  PhoneIcon, 
  PlusIcon, 
  XMarkIcon, 
  BuildingStorefrontIcon, 
  TrashIcon, 
  StarIcon,
  FunnelIcon,
  ChevronDownIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  BookmarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid';
import { Restaurant } from '../types';
import { realRestaurants } from '../data/realRestaurants';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const RestaurantMapV3: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    minRating: 0,
    minTaste: 0,
    minService: 0,
    minCleanliness: 0,
    minPrice: 0
  });

  const [newRestaurantForm, setNewRestaurantForm] = useState({
    name: '',
    category: '',
    address: '',
    phoneNumber: '',
    priceRange: ''
  });

  const [requestForm, setRequestForm] = useState({
    name: '',
    category: '',
    address: '',
    reason: '',
    contact: ''
  });

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // DB에서 맛집 데이터 가져오기
  const { data: dbRestaurants, isLoading: isLoadingDB } = useQuery({
    queryKey: ['restaurants', 'map'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/restaurants');
        return response.data.restaurants || [];
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        return [];
      }
    },
  });

  // 검색 API 호출
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['restaurants', 'search', searchKeyword],
    queryFn: async () => {
      if (!searchKeyword) return null;
      try {
        const response = await axios.get('/api/restaurants/search', {
          params: { query: searchKeyword }
        });
        return response.data.restaurants || [];
      } catch (error) {
        console.error('Search failed:', error);
        return [];
      }
    },
    enabled: !!searchKeyword,
  });

  // 맛집 등록 mutation
  const createRestaurantMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/restaurants', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('맛집이 등록되었습니다!');
      setShowAddModal(false);
      setNewRestaurantForm({
        name: '',
        category: '',
        address: '',
        phoneNumber: '',
        priceRange: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '맛집 등록에 실패했습니다.');
    },
  });

  // 맛집 삭제 mutation
  const deleteRestaurantMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/restaurants/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('맛집이 삭제되었습니다!');
      setSelectedRestaurant(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '맛집 삭제에 실패했습니다.');
    },
  });

  // 필터링된 레스토랑 데이터
  const restaurants = useMemo(() => {
    let result: Restaurant[] = [];
    
    // 검색 결과가 있으면 그것을 사용
    if (searchKeyword && searchResults) {
      result = searchResults;
    } else {
      // DB 데이터와 실제 맛집 데이터 합치기
      const dbData = dbRestaurants || [];
      result = [...dbData, ...realRestaurants].filter((restaurant: Restaurant, index: number, self: Restaurant[]) =>
        index === self.findIndex((r) => r._id === restaurant._id)
      );
    }
    
    // 검색어 필터 (이름에 포함된 것만)
    if (searchKeyword) {
      result = result.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    // 카테고리 필터
    if (filters.category) {
      result = result.filter(restaurant => restaurant.category === filters.category);
    }
    
    // 가격대 필터
    if (filters.priceRange) {
      result = result.filter(restaurant => restaurant.priceRange === filters.priceRange);
    }
    
    // 평점 필터
    if (filters.minRating > 0) {
      result = result.filter(restaurant => 
        (restaurant.averageRating || 0) >= filters.minRating
      );
    }
    
    // 세부 평점 필터
    if (filters.minTaste > 0) {
      result = result.filter(restaurant => 
        (restaurant.detailedAverages?.taste || 0) >= filters.minTaste
      );
    }
    
    if (filters.minService > 0) {
      result = result.filter(restaurant => 
        (restaurant.detailedAverages?.service || 0) >= filters.minService
      );
    }
    
    if (filters.minCleanliness > 0) {
      result = result.filter(restaurant => 
        (restaurant.detailedAverages?.cleanliness || 0) >= filters.minCleanliness
      );
    }
    
    if (filters.minPrice > 0) {
      result = result.filter(restaurant => 
        (restaurant.detailedAverages?.price || 0) >= filters.minPrice
      );
    }
    
    return result;
  }, [searchKeyword, searchResults, dbRestaurants, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput.trim());
  };

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
  }, []);

  const handleSubmitRestaurant = async () => {
    if (!newRestaurantForm.name || !newRestaurantForm.category) {
      toast.error('맛집 이름과 카테고리는 필수입니다.');
      return;
    }

    if (!clickedLocation) {
      toast.error('위치 정보가 없습니다.');
      return;
    }

    createRestaurantMutation.mutate({
      ...newRestaurantForm,
      coordinates: {
        lat: clickedLocation.lat,
        lng: clickedLocation.lng
      }
    });
  };

  const handleDeleteRestaurant = (id: string) => {
    if (window.confirm('정말로 이 맛집을 삭제하시겠습니까?')) {
      deleteRestaurantMutation.mutate(id);
    }
  };

  const saveRestaurantMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      const response = await axios.post(`/api/restaurants/${restaurantId}/save`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success(data.saved ? '맛집이 저장되었습니다!' : '저장이 취소되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '저장에 실패했습니다.');
    },
  });

  const handleSaveRestaurant = useCallback((restaurantId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    saveRestaurantMutation.mutate(restaurantId);
  }, [saveRestaurantMutation, user]);

  const handleSubmitRequest = async () => {
    if (!requestForm.name || !requestForm.category || !requestForm.address) {
      toast.error('필수 정보를 모두 입력해주세요.');
      return;
    }
    
    try {
      const response = await axios.post('/api/restaurants/request', {
        name: requestForm.name,
        category: requestForm.category,
        address: requestForm.address,
        description: requestForm.reason,
        reason: requestForm.reason,
        contactInfo: requestForm.contact
      });
      
      toast.success('맛집 추가 요청이 전송되었습니다. 관리자 검토 후 반영될 예정입니다.');
      setShowRequestModal(false);
      setRequestForm({
        name: '',
        category: '',
        address: '',
        reason: '',
        contact: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '요청 전송에 실패했습니다.');
    }
  };

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const categories = ['한식', '중식', '일식', '양식', '카페', '디저트', '분식', '패스트푸드', '치킨', '피자'];
  const priceRanges = [
    { value: '$', label: '1만원 이하' },
    { value: '$$', label: '1-3만원' },
    { value: '$$$', label: '3-5만원' },
    { value: '$$$$', label: '5만원 이상' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
            🗺️ 실시간 맛집 지도
          </h1>
          <p className="text-gray-600 text-lg">근처 맛집을 실시간으로 찾아보세요</p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="맛집 이름으로 검색..."
                className="w-full px-6 py-4 text-lg border-2 border-primary-200 rounded-2xl focus:border-primary-400 focus:outline-none shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-white p-3 rounded-xl hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 shadow-lg"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* 필터 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              필터
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 필터 드롭다운 */}
          {showFilters && (
            <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 카테고리 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">전체</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* 가격대 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가격대</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">전체</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* 최소 총평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">최소 총평점</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">⭐ 3점 이상</option>
                    <option value="3.5">⭐ 3.5점 이상</option>
                    <option value="4">⭐ 4점 이상</option>
                    <option value="4.5">⭐ 4.5점 이상</option>
                  </select>
                </div>

                {/* 맛 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">맛 평점</label>
                  <select
                    value={filters.minTaste}
                    onChange={(e) => setFilters({ ...filters, minTaste: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">3점 이상</option>
                    <option value="4">4점 이상</option>
                    <option value="4.5">4.5점 이상</option>
                  </select>
                </div>

                {/* 서비스 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">서비스 평점</label>
                  <select
                    value={filters.minService}
                    onChange={(e) => setFilters({ ...filters, minService: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">3점 이상</option>
                    <option value="4">4점 이상</option>
                    <option value="4.5">4.5점 이상</option>
                  </select>
                </div>

                {/* 청결도 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">청결도 평점</label>
                  <select
                    value={filters.minCleanliness}
                    onChange={(e) => setFilters({ ...filters, minCleanliness: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">3점 이상</option>
                    <option value="4">4점 이상</option>
                    <option value="4.5">4.5점 이상</option>
                  </select>
                </div>

                {/* 가격 평점 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">가격 평점</label>
                  <select
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">3점 이상</option>
                    <option value="4">4점 이상</option>
                    <option value="4.5">4.5점 이상</option>
                  </select>
                </div>
              </div>

              {/* 필터 초기화 버튼 */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    category: '',
                    priceRange: '',
                    minRating: 0,
                    minTaste: 0,
                    minService: 0,
                    minCleanliness: 0,
                    minPrice: 0
                  })}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 지도와 정보 섹션 */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl relative">
              <div className="relative w-full h-[600px]">
                <KoreanMap
                  restaurants={restaurants}
                  onRestaurantClick={handleRestaurantClick}
                  onMapClick={handleMapClick}
                  className="w-full h-full rounded-3xl"
                  markerSize="small" // 마커 크기 축소
                />
                
                {/* 플로팅 액션 버튼 */}
                <div className="absolute bottom-8 right-8" style={{ zIndex: 1000 }}>
                  <div className="relative">
                    <button
                      onClick={() => setShowAdminMenu(!showAdminMenu)}
                      className="group bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
                    >
                      <PlusIcon className="w-8 h-8" />
                    </button>
                    
                    {/* Admin/사용자 메뉴 */}
                    {showAdminMenu && (
                      <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[200px]">
                        {(user as any)?.isAdmin ? (
                          <>
                            <button
                              onClick={() => {
                                setShowAddModal(true);
                                setShowAdminMenu(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                            >
                              <PlusIcon className="w-5 h-5 text-green-600" />
                              <span>맛집 추가</span>
                            </button>
                            {selectedRestaurant && (
                              <button
                                onClick={() => {
                                  handleDeleteRestaurant(selectedRestaurant._id);
                                  setShowAdminMenu(false);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                              >
                                <TrashIcon className="w-5 h-5 text-red-600" />
                                <span>선택한 맛집 삭제</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setShowRequestModal(true);
                              setShowAdminMenu(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                          >
                            <PaperAirplaneIcon className="w-5 h-5 text-blue-600" />
                            <span>맛집 추가 요청</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 현재 등록된 맛집 수 표시 */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg" style={{ zIndex: 1000 }}>
                  <span className="text-sm font-medium text-gray-700">
                    <BuildingStorefrontIcon className="w-4 h-4 inline mr-1" />
                    {restaurants.length}개 맛집
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드 패널 - 선택된 맛집 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 h-[600px] overflow-y-auto">
              {selectedRestaurant ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name}</h2>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <TagIcon className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedRestaurant.category}</span>
                      {selectedRestaurant.priceRange && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{selectedRestaurant.priceRange}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                      <span className="flex-1">{selectedRestaurant.address}</span>
                    </div>

                    {selectedRestaurant.phoneNumber && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <PhoneIcon className="w-5 h-5 text-gray-400" />
                        <span>{selectedRestaurant.phoneNumber}</span>
                      </div>
                    )}

                    {selectedRestaurant.averageRating > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(selectedRestaurant.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-lg text-gray-900">
                            {selectedRestaurant.averageRating.toFixed(1)}
                          </span>
                          <span className="text-gray-500">
                            ({selectedRestaurant.reviewCount || 0}개 리뷰)
                          </span>
                        </div>

                        {/* 세부 평점 */}
                        {selectedRestaurant.detailedAverages && (
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">맛</span>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(selectedRestaurant.detailedAverages?.taste || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{(selectedRestaurant.detailedAverages?.taste || 0).toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">청결도</span>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(selectedRestaurant.detailedAverages?.cleanliness || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{(selectedRestaurant.detailedAverages?.cleanliness || 0).toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">서비스</span>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(selectedRestaurant.detailedAverages?.service || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{(selectedRestaurant.detailedAverages?.service || 0).toFixed(1)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">가격</span>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(selectedRestaurant.detailedAverages?.price || 0)
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">{(selectedRestaurant.detailedAverages?.price || 0).toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 저장한 사용자 목록 */}
                    {selectedRestaurant.savedBy && selectedRestaurant.savedBy.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserGroupIcon className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-700">
                            {selectedRestaurant.savedBy.length}명이 저장함
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRestaurant.savedBy.slice(0, 5).map((save: any) => (
                            <div
                              key={save.user?._id || save.user}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200"
                            >
                              {save.user?.profileImage && (
                                <img
                                  src={save.user.profileImage}
                                  alt={save.user?.username}
                                  className="w-5 h-5 rounded-full"
                                />
                              )}
                              <span className="text-sm text-gray-600">
                                {save.user?.username || '익명'}
                              </span>
                            </div>
                          ))}
                          {selectedRestaurant.savedBy.length > 5 && (
                            <span className="text-sm text-gray-500 py-1.5">
                              +{selectedRestaurant.savedBy.length - 5}명
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => handleSaveRestaurant(selectedRestaurant._id)}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          selectedRestaurant.savedBy?.some((s: any) => s.user?._id === user?._id || s.user === user?._id)
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                            : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {selectedRestaurant.savedBy?.some((s: any) => s.user?._id === user?._id || s.user === user?._id) ? (
                          <>
                            <BookmarkSolidIcon className="w-5 h-5" />
                            <span>저장됨</span>
                          </>
                        ) : (
                          <>
                            <BookmarkIcon className="w-5 h-5" />
                            <span>저장하기</span>
                          </>
                        )}
                      </button>

                      {(user as any)?.isAdmin && (
                        <button
                          onClick={() => {
                            handleDeleteRestaurant(selectedRestaurant._id);
                            setSelectedRestaurant(null);
                          }}
                          className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
                        >
                          <TrashIcon className="w-5 h-5" />
                          <span>삭제</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MapPinIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">맛집을 선택해주세요</h3>
                  <p className="text-sm text-gray-500">지도에서 마커를 클릭하면<br />상세 정보를 확인할 수 있습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Admin 맛집 등록 모달 */}
        {showAddModal && (user as any)?.isAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">새 맛집 등록</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    맛집 이름 *
                  </label>
                  <input
                    type="text"
                    value={newRestaurantForm.name}
                    onChange={(e) => setNewRestaurantForm({ ...newRestaurantForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="예: 홍대 맛집"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <select
                    value={newRestaurantForm.category}
                    onChange={(e) => setNewRestaurantForm({ ...newRestaurantForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">선택하세요</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    value={newRestaurantForm.address}
                    onChange={(e) => setNewRestaurantForm({ ...newRestaurantForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="예: 서울시 마포구 홍대"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  <input
                    type="text"
                    value={newRestaurantForm.phoneNumber}
                    onChange={(e) => setNewRestaurantForm({ ...newRestaurantForm, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="예: 02-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가격대
                  </label>
                  <select
                    value={newRestaurantForm.priceRange}
                    onChange={(e) => setNewRestaurantForm({ ...newRestaurantForm, priceRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">선택하세요</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {clickedLocation && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    위치: {clickedLocation.lat.toFixed(6)}, {clickedLocation.lng.toFixed(6)}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitRestaurant}
                  disabled={createRestaurantMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {createRestaurantMutation.isPending ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 일반 사용자 맛집 추가 요청 모달 */}
        {showRequestModal && !(user as any)?.isAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">맛집 추가 요청</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                관리자가 검토 후 맛집을 추가해드립니다.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    맛집 이름 *
                  </label>
                  <input
                    type="text"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 홍대 맛집"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 *
                  </label>
                  <select
                    value={requestForm.category}
                    onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소 *
                  </label>
                  <input
                    type="text"
                    value={requestForm.address}
                    onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 서울시 마포구 홍대"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    추가 이유
                  </label>
                  <textarea
                    value={requestForm.reason}
                    onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="이 맛집을 추가하고 싶은 이유를 적어주세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 (선택)
                  </label>
                  <input
                    type="text"
                    value={requestForm.contact}
                    onChange={(e) => setRequestForm({ ...requestForm, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="답변 받을 연락처"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  요청 전송
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMapV3;