import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import KoreanMap from '../components/KoreanMap';
import { MagnifyingGlassIcon, MapPinIcon, PhoneIcon, PlusIcon, XMarkIcon, BuildingStorefrontIcon, StarIcon, BookmarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Restaurant } from '../types';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const RestaurantMapV2: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [placeSearchResults, setPlaceSearchResults] = useState<any[]>([]);
  const [isPlaceSearching, setIsPlaceSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  
  // 필터 상태
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [minRating, setMinRating] = useState(0);
  
  // 별점 모달
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [detailedRatings, setDetailedRatings] = useState({
    taste: 0,
    cleanliness: 0,
    service: 0,
    price: 0,
    location: 0
  });
  
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // DB에서 실제 맛집 데이터 가져오기
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
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '맛집 등록에 실패했습니다.');
    },
  });

  // 맛집 저장 mutation
  const saveRestaurantMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      const response = await axios.post(`/api/restaurants/${restaurantId}/save`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success(data.saved ? '맛집을 저장했습니다!' : '저장을 취소했습니다.');
    },
    onError: () => {
      toast.error('저장에 실패했습니다. 로그인이 필요합니다.');
    },
  });

  // 별점 등록 mutation
  const rateRestaurantMutation = useMutation({
    mutationFn: async ({ restaurantId, detailedRatings, review }: any) => {
      const response = await axios.post(`/api/restaurants/${restaurantId}/rate`, {
        detailedRatings,
        review
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('평점이 등록되었습니다!');
      setShowRatingModal(false);
      setUserRating(0);
      setUserReview('');
      setDetailedRatings({
        taste: 0,
        cleanliness: 0,
        service: 0,
        price: 0,
        location: 0
      });
    },
    onError: () => {
      toast.error('평점 등록에 실패했습니다. 로그인이 필요합니다.');
    },
  });

  // 네이버 API로 장소 검색
  const searchPlace = async () => {
    if (!placeSearchQuery.trim()) return;
    
    setIsPlaceSearching(true);
    try {
      const response = await axios.get('/api/restaurants/search/naver', {
        params: { query: placeSearchQuery }
      });
      setPlaceSearchResults(response.data || []);
    } catch (error) {
      console.error('Place search failed:', error);
      toast.error('장소 검색에 실패했습니다.');
    } finally {
      setIsPlaceSearching(false);
    }
  };

  // 장소 선택
  const handleSelectPlace = (place: any) => {
    setSelectedPlace(place);
  };

  // 폼 리셋
  const resetForm = () => {
    setPlaceSearchQuery('');
    setPlaceSearchResults([]);
    setSelectedPlace(null);
    setClickedLocation(null);
  };

  // 필터링된 레스토랑 데이터 (실제 DB 데이터만)
  const restaurants = useMemo(() => {
    let filtered = searchKeyword && searchResults ? searchResults : (dbRestaurants || []);
    
    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter((r: any) => r.category === selectedCategory);
    }
    
    // 가격대 필터
    if (selectedPriceRange) {
      filtered = filtered.filter((r: any) => r.priceRange === selectedPriceRange);
    }
    
    // 평점 필터
    if (minRating > 0) {
      filtered = filtered.filter((r: any) => r.averageRating >= minRating);
    }
    
    return filtered;
  }, [searchKeyword, searchResults, dbRestaurants, selectedCategory, selectedPriceRange, minRating]);
  
  const isLoading = isLoadingDB || isSearching;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchKeyword(searchInput.trim());
      
      // 검색 기록 추가 (중복 제거)
      const newHistory = [searchInput.trim(), ...searchHistory.filter(item => item !== searchInput.trim())].slice(0, 5);
      setSearchHistory(newHistory);
    }
  };

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (user) {
      setClickedLocation({ lat, lng });
      setShowAddModal(true);
    } else {
      toast.error('맛집을 등록하려면 로그인이 필요합니다.');
    }
  }, [user]);

  const [priceRange, setPriceRange] = useState('');

  const handleSubmitRestaurant = async () => {
    if (!selectedPlace) {
      toast.error('맛집을 검색하고 선택해주세요.');
      return;
    }
    
    createRestaurantMutation.mutate({
      name: selectedPlace.name,
      address: selectedPlace.address,
      roadAddress: selectedPlace.roadAddress,
      coordinates: selectedPlace.coordinates || clickedLocation,
      category: selectedPlace.category,
      phoneNumber: selectedPlace.phone,
      priceRange: priceRange,
      naverPlaceId: selectedPlace.id
    });
  };

  const quickSearches = ['치킨', '피자', '한식', '중식', '일식', '카페', '디저트', '회', '고기', '라면'];

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

        {/* 검색 섹션 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="맛집을 검색해보세요 (예: 강남 삼겹살)"
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

          {/* 빠른 검색 버튼들 & 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {quickSearches.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchInput(keyword);
                  setSearchKeyword(keyword);
                }}
                className="px-4 py-2 bg-white border border-primary-200 rounded-full text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {keyword}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <FunnelIcon className="w-4 h-4" />
              필터
            </button>
          </div>
          
          {/* 필터 패널 */}
          {showFilters && (
            <div className="max-w-2xl mx-auto mt-4 p-4 bg-white rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">전체</option>
                    <option value="한식">한식</option>
                    <option value="중식">중식</option>
                    <option value="일식">일식</option>
                    <option value="양식">양식</option>
                    <option value="카페">카페</option>
                    <option value="디저트">디저트</option>
                    <option value="주점">주점</option>
                    <option value="패스트푸드">패스트푸드</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">가격대</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">전체</option>
                    <option value="저렴한">저렴한 (₩)</option>
                    <option value="보통">보통 (₩₩)</option>
                    <option value="비싼">비싼 (₩₩₩)</option>
                    <option value="매우비싼">매우비싼 (₩₩₩₩)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">최소 평점</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="0">전체</option>
                    <option value="3">⭐ 3.0 이상</option>
                    <option value="3.5">⭐ 3.5 이상</option>
                    <option value="4">⭐ 4.0 이상</option>
                    <option value="4.5">⭐ 4.5 이상</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 지도와 정보 섹션 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl relative">
              <div className="relative w-full h-[600px]">
                <KoreanMap
                  restaurants={restaurants}
                  onRestaurantClick={handleRestaurantClick}
                  onMapClick={handleMapClick}
                  className="w-full h-full rounded-3xl"
                />
                
                {/* 맛집 추가 플로팅 버튼 - 더 크고 눈에 띄게 */}
                <div className="absolute bottom-8 right-8" style={{ zIndex: 1000 }}>
                  <button
                    onClick={() => {
                      if (user) {
                        setShowAddModal(true);
                      } else {
                        toast.error('맛집을 등록하려면 로그인이 필요합니다.');
                      }
                    }}
                    className="group bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative"
                    title="맛집 추가하기"
                  >
                    <PlusIcon className="w-8 h-8" />
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold text-gray-800 animate-pulse">
                      NEW
                    </span>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      맛집 추가하기
                    </div>
                  </button>
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

          {/* 선택된 식당 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 h-[600px] overflow-y-auto">
              {selectedRestaurant ? (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    {selectedRestaurant.name}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* 평점 및 저장 정보 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarSolidIcon
                            key={star}
                            className={`w-5 h-5 ${
                              star <= (selectedRestaurant.averageRating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedRestaurant.averageRating?.toFixed(1) || '0.0'} ({selectedRestaurant.reviewCount || 0}명)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BookmarkSolidIcon className="w-4 h-4 text-gray-400" />
                        {selectedRestaurant.saveCount || 0}명 저장
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500 mb-1">카테고리</p>
                      <p className="font-semibold text-primary-700">{selectedRestaurant.category}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500 mb-1">주소</p>
                      <p className="font-medium text-gray-700">{selectedRestaurant.address}</p>
                    </div>

                    {selectedRestaurant.phoneNumber && (
                      <div className="bg-accent-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500 mb-1">전화번호</p>
                        <p className="font-medium text-gray-700 flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {selectedRestaurant.phoneNumber}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => {
                          if (user) {
                            saveRestaurantMutation.mutate(selectedRestaurant._id);
                          } else {
                            toast.error('로그인이 필요합니다.');
                          }
                        }}
                        className="flex-1 bg-white border-2 border-primary-400 text-primary-600 py-3 rounded-2xl font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                      >
                        {selectedRestaurant.savedBy?.some((s: any) => s.user === user?._id) ? (
                          <>
                            <BookmarkSolidIcon className="w-5 h-5" />
                            저장됨
                          </>
                        ) : (
                          <>
                            <BookmarkIcon className="w-5 h-5" />
                            저장하기
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          if (user) {
                            setShowRatingModal(true);
                          } else {
                            toast.error('로그인이 필요합니다.');
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-2xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                      >
                        <StarIcon className="w-5 h-5" />
                        별점 주기
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="animate-pulse">
                    <div className="w-24 h-24 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-12 h-12 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">맛집을 검색해보세요</h3>
                    <p className="text-gray-500">지도에서 마커를 클릭하면<br />상세 정보를 확인할 수 있어요</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 맛집 등록 모달 */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">새 맛집 등록</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  🔍 네이버 지도에서 실제 맛집을 검색하여 등록해주세요.
                  실제 존재하는 맛집만 등록 가능합니다.
                </p>
              </div>

              <div className="space-y-4">
                  {/* 맛집 검색 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      맛집 검색 (네이버 지도 기반)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={placeSearchQuery}
                        onChange={(e) => setPlaceSearchQuery(e.target.value)}
                        placeholder="실제 맛집 이름을 검색하세요"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            searchPlace();
                          }
                        }}
                      />
                      <button
                        onClick={searchPlace}
                        disabled={isPlaceSearching || !placeSearchQuery.trim()}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPlaceSearching ? '검색 중...' : '검색'}
                      </button>
                    </div>
                  </div>

                  {/* 검색 결과 */}
                  {placeSearchResults.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        검색 결과 (실제 존재하는 맛집)
                      </label>
                      <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                        {placeSearchResults.map((place, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectPlace(place)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedPlace?.id === place.id
                                ? 'bg-orange-50 border border-orange-300'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="font-medium">{place.name}</div>
                            <div className="text-sm text-gray-600">{place.address}</div>
                            {place.category && (
                              <div className="text-xs text-gray-500 mt-1">{place.category}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 선택된 맛집 정보 */}
                  {selectedPlace && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold mb-2">선택된 맛집</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>이름:</strong> {selectedPlace.name}</p>
                        <p><strong>주소:</strong> {selectedPlace.address}</p>
                        {selectedPlace.category && <p><strong>카테고리:</strong> {selectedPlace.category}</p>}
                        {selectedPlace.phone && <p><strong>전화:</strong> {selectedPlace.phone}</p>}
                      </div>
                      
                      {/* 추가 정보 입력 */}
                      <div className="mt-3 pt-3 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          가격대 (선택)
                        </label>
                        <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">선택하세요</option>
                          <option value="₩">₩ (1만원 이하)</option>
                          <option value="₩₩">₩₩ (1-3만원)</option>
                          <option value="₩₩₩">₩₩₩ (3-5만원)</option>
                          <option value="₩₩₩₩">₩₩₩₩ (5만원 이상)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {!selectedPlace && placeSearchResults.length === 0 && placeSearchQuery && !isPlaceSearching && (
                    <div className="text-center py-4 text-gray-500">
                      <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>검색 결과가 없습니다.</p>
                      <p className="text-sm mt-1">다른 이름으로 검색해보세요.</p>
                    </div>
                  )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitRestaurant}
                  disabled={
                    createRestaurantMutation.isPending || !selectedPlace
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createRestaurantMutation.isPending ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 별점 모달 */}
        {showRatingModal && selectedRestaurant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedRestaurant.name} 평가하기</h3>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setUserRating(0);
                    setUserReview('');
                    setDetailedRatings({
                      taste: 0,
                      cleanliness: 0,
                      service: 0,
                      price: 0,
                      location: 0
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* 세부 평가 항목 */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-3">각 항목별로 평가해주세요</p>
                  
                  {/* 맛 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">맛 😋</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetailedRatings({...detailedRatings, taste: star})}
                          className="transition-transform hover:scale-110"
                        >
                          {star <= detailedRatings.taste ? (
                            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 청결도 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">청결도 🧹</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetailedRatings({...detailedRatings, cleanliness: star})}
                          className="transition-transform hover:scale-110"
                        >
                          {star <= detailedRatings.cleanliness ? (
                            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 서비스 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">서비스 👨‍🍳</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetailedRatings({...detailedRatings, service: star})}
                          className="transition-transform hover:scale-110"
                        >
                          {star <= detailedRatings.service ? (
                            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 가격 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">가격 💰</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetailedRatings({...detailedRatings, price: star})}
                          className="transition-transform hover:scale-110"
                        >
                          {star <= detailedRatings.price ? (
                            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 위치 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-20">위치 📍</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetailedRatings({...detailedRatings, location: star})}
                          className="transition-transform hover:scale-110"
                        >
                          {star <= detailedRatings.location ? (
                            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 전체 평점 표시 */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">전체 평점</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const avgRating = (detailedRatings.taste + detailedRatings.cleanliness + 
                                         detailedRatings.service + detailedRatings.price + 
                                         detailedRatings.location) / 5;
                        return (
                          <StarSolidIcon
                            key={star}
                            className={`w-8 h-8 ${star <= avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-lg font-bold text-gray-700">
                      {((detailedRatings.taste + detailedRatings.cleanliness + 
                         detailedRatings.service + detailedRatings.price + 
                         detailedRatings.location) / 5).toFixed(1) || '0.0'}점
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    리뷰 (선택)
                  </label>
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    rows={3}
                    placeholder="맛집에 대한 후기를 남겨주세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRatingModal(false);
                      setUserRating(0);
                      setUserReview('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      const allRated = detailedRatings.taste > 0 && detailedRatings.cleanliness > 0 &&
                                      detailedRatings.service > 0 && detailedRatings.price > 0 &&
                                      detailedRatings.location > 0;
                      if (allRated) {
                        rateRestaurantMutation.mutate({
                          restaurantId: selectedRestaurant._id,
                          detailedRatings,
                          review: userReview
                        });
                      } else {
                        toast.error('모든 평가 항목을 선택해주세요');
                      }
                    }}
                    disabled={!(detailedRatings.taste > 0 && detailedRatings.cleanliness > 0 &&
                               detailedRatings.service > 0 && detailedRatings.price > 0 &&
                               detailedRatings.location > 0) || rateRestaurantMutation.isPending}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {rateRestaurantMutation.isPending ? '등록 중...' : '평가하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMapV2;