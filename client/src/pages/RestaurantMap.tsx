import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import KoreanMap from '../components/KoreanMap';
import { MagnifyingGlassIcon, MapPinIcon, PhoneIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Restaurant } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';
import toast from 'react-hot-toast';

const RestaurantMap: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'restaurants' | 'playlists'>('restaurants');
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);

  // 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 모든 맛집 가져오기
      const restaurantRes = await axios.get('/api/restaurants');
      const restaurantData = restaurantRes.data.restaurants || restaurantRes.data || [];
      setAllRestaurants(restaurantData);

      // 모든 플레이리스트 가져오기
      const playlistRes = await axios.get('/api/playlists');
      const playlistData = playlistRes.data.playlists || playlistRes.data || [];
      setAllPlaylists(playlistData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // 필터링된 레스토랑 데이터
  const restaurants = useMemo(() => {
    if (viewMode === 'playlists' && selectedPlaylist) {
      // 선택된 플레이리스트의 맛집들만 표시
      return selectedPlaylist.restaurants?.map((r: any) => r.restaurant || r) || [];
    }
    if (!searchKeyword) return allRestaurants;
    // 검색 기능
    return allRestaurants.filter((restaurant: any) => 
      restaurant.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      restaurant.category?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, viewMode, selectedPlaylist, allRestaurants]);
  
  const isLoading = false;

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
    if (isMobile) {
      setShowMobileDetail(true);
    }
  }, [isMobile]);

  const quickSearches = ['치킨', '피자', '한식', '중식', '일식', '카페', '디저트', '회', '고기', '라면'];

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 헤더와 토글 버튼 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">맛집 지도</h1>
          <div className="flex bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-1 shadow-md">
            <button
              onClick={() => {
                setViewMode('restaurants');
                setSelectedPlaylist(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                viewMode === 'restaurants'
                  ? 'bg-white text-orange-600 shadow-lg'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              맛집
            </button>
            <button
              onClick={() => setViewMode('playlists')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                viewMode === 'playlists'
                  ? 'bg-white text-orange-600 shadow-lg'
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              플레이리스트
            </button>
          </div>
        </div>

        {/* 지도 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          <KoreanMap
            restaurants={restaurants}
            onRestaurantClick={handleRestaurantClick}
            className={`w-full ${isMobile ? 'h-[40vh]' : 'h-[500px]'}`}
          />
        </div>

        {/* 데스크톱에서만 선택된 식당 정보 표시 */}
        {!isMobile && (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {/* 맛집 리스트 */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold text-lg mb-3">맛집 목록</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {restaurants.map((restaurant: any, index: number) => (
                    <div
                      key={restaurant._id || index}
                      onClick={() => handleRestaurantClick(restaurant)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                          <p className="text-sm text-gray-500">{restaurant.category} • {restaurant.address}</p>
                        </div>
                      </div>
                      {restaurant.averageRating && (
                        <div className="flex items-center text-sm">
                          <span className="text-yellow-500">⭐</span>
                          <span className="ml-1 font-medium">{restaurant.averageRating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 선택된 식당 정보 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              {selectedRestaurant ? (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    {selectedRestaurant.name}
                  </h3>
                  
                  <div className="space-y-4">
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
                        <a href={`tel:${selectedRestaurant.phoneNumber}`} className="font-medium text-accent-600 hover:underline">
                          {selectedRestaurant.phoneNumber}
                        </a>
                      </div>
                    )}

                    {selectedRestaurant.averageRating && (
                      <div className="bg-yellow-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500 mb-1">평점</p>
                        <div className="flex items-center">
                          <span className="text-2xl text-yellow-500">⭐</span>
                          <span className="ml-2 text-xl font-bold text-gray-800">{selectedRestaurant.averageRating}</span>
                          <span className="ml-2 text-sm text-gray-500">/ 5.0</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
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
        )}
      </div>

      {/* 모바일 맛집 리스트 - 하단 고정 */}
      {isMobile && viewMode === 'restaurants' && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t z-30">
          <div className="px-4 py-3 border-b bg-white">
            <h3 className="font-bold text-base">맛집 목록 ({restaurants.length})</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 120px)' }}>
            {restaurants.map((restaurant: any, index: number) => (
              <div
                key={restaurant._id || index}
                onClick={() => handleRestaurantClick(restaurant)}
                className="flex items-center p-4 border-b hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-bold text-orange-500 mr-2">{index + 1}</span>
                    <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{restaurant.category}</p>
                  <p className="text-xs text-gray-500">{restaurant.address}</p>
                  {(restaurant as any).famousReason && (
                    <p className="text-xs text-orange-600 mt-1">{(restaurant as any).famousReason}</p>
                  )}
                </div>
                <div className="flex flex-col items-end ml-3">
                  {restaurant.averageRating && (
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1 font-semibold">{restaurant.averageRating}</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('플레이리스트에 저장됨!');
                    }}
                    className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full"
                  >
                    저장
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모바일 맛집 상세 팝업 - 개선된 디자인 */}
      {isMobile && showMobileDetail && selectedRestaurant && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-end"
          onClick={() => setShowMobileDetail(false)} // 배경 클릭 시 닫기
        >
          <div 
            className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭은 막기
          >
            <div className="sticky top-0 bg-white p-4 border-b z-10">
              {/* 드래그 핸들 */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
              <div className="flex items-center justify-center">
                <h2 className="text-lg font-bold">{selectedRestaurant.name}</h2>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* 이미지 (있을 경우) */}
              {selectedRestaurant.images && selectedRestaurant.images.length > 0 && (
                <img
                  src={typeof selectedRestaurant.images[0] === 'string' 
                    ? selectedRestaurant.images[0] 
                    : selectedRestaurant.images[0].url}
                  alt={selectedRestaurant.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {/* 유명한 이유 */}
              {(selectedRestaurant as any).famousReason && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-sm font-medium text-gray-800">
                    {(selectedRestaurant as any).famousReason}
                  </p>
                </div>
              )}

              {/* 기본 정보 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedRestaurant.category}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      영업중
                    </span>
                  </div>
                  {selectedRestaurant.averageRating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1 font-semibold">{selectedRestaurant.averageRating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 주소 */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start">
                  <MapPinIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-700">{selectedRestaurant.address}</p>
                  </div>
                </div>
              </div>

              {/* 전화번호 */}
              {selectedRestaurant.phoneNumber && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <a href={`tel:${selectedRestaurant.phoneNumber}`} className="text-sm text-blue-600">
                      {selectedRestaurant.phoneNumber}
                    </a>
                  </div>
                </div>
              )}
              
              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toast.success('플레이리스트에 저장했습니다!');
                    setShowMobileDetail(false);
                  }}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium"
                >
                  플레이리스트에 저장
                </button>
                <button
                  onClick={() => {
                    toast.success('즐겨찾기에 추가했습니다!');
                    setShowMobileDetail(false);
                  }}
                  className="px-4 py-3 bg-gray-100 rounded-lg"
                >
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 모바일 플레이리스트 목록 */}
      {isMobile && viewMode === 'playlists' && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t z-30">
          <div className="px-4 py-3 border-b bg-white">
            <h3 className="font-bold text-base">
              {selectedPlaylist ? `${selectedPlaylist.title} 맛집들` : '인기 플레이리스트'}
            </h3>
            {selectedPlaylist && (
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-xs text-orange-600 mt-1"
              >
                ← 플레이리스트 목록으로
              </button>
            )}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(50vh - 120px)' }}>
            {/* 플레이리스트 선택 상태에 따른 표시 */}
            {selectedPlaylist ? (
              // 선택된 플레이리스트의 맛집들 표시
              (selectedPlaylist.restaurants?.map((r: any) => r.restaurant || r) || []).map((restaurant: any, index: number) => (
                <div
                  key={restaurant._id || index}
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="flex items-center p-4 border-b hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-bold text-orange-500 mr-2">{index + 1}</span>
                      <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{restaurant.category}</p>
                    <p className="text-xs text-gray-500">{restaurant.address}</p>
                    {(restaurant as any).famousReason && (
                      <p className="text-xs text-orange-600 mt-1">{(restaurant as any).famousReason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-3">
                    {restaurant.averageRating && (
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 font-semibold">{restaurant.averageRating}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('플레이리스트에 저장됨!');
                      }}
                      className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // 플레이리스트 목록 표시
              allPlaylists.map((playlist: any) => (
                <div
                  key={playlist._id || playlist.id}
                  className="flex items-center p-4 border-b hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    toast.success(`${playlist.title} 플레이리스트의 맛집들을 지도에 표시합니다`);
                  }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{playlist.title}</h4>
                    <p className="text-sm text-gray-600">@{playlist.createdBy?.username || 'BobMap'}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span className="mr-3">🍴 {playlist.restaurants?.length || 0}개 맛집</span>
                      <span>❤️ {playlist.likeCount || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success('플레이리스트를 저장했습니다!');
                    }}
                    className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full"
                  >
                    저장
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMap;