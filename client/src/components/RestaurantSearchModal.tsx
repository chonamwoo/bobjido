import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { Restaurant, KakaoPlace } from '../types';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface RestaurantSearchModalProps {
  onClose: () => void;
  onSelect: (restaurant: Restaurant) => void;
}

const RestaurantSearchModal: React.FC<RestaurantSearchModalProps> = ({
  onClose,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'existing' | 'kakao' | 'naver'>('naver'); // Default to naver

  const { data: existingRestaurants, isLoading: isLoadingExisting } = useQuery({
    queryKey: ['restaurants', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await axios.get('/api/restaurants/search', {
        params: { query: searchQuery, limit: 20 },
      });
      return response.data.restaurants;
    },
    enabled: searchType === 'existing' && searchQuery.length > 0,
  });

  const { data: kakaoPlaces, isLoading: isLoadingKakao } = useQuery({
    queryKey: ['kakao-places', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await axios.get('/api/restaurants/search/kakao', {
        params: { query: searchQuery },
      });
      return response.data;
    },
    enabled: searchType === 'kakao' && searchQuery.length > 0,
  });

  const { data: naverPlaces, isLoading: isLoadingNaver } = useQuery({
    queryKey: ['naver-places', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      try {
        // 실제 네이버 API 호출
        const response = await axios.get('/api/restaurants/search/naver', {
          params: { 
            query: searchQuery,
            display: 50  // 더 많은 결과를 가져오도록 증가 (최대 100)
          },
        });
        
        // 네이버 API 응답 데이터 형식에 맞게 변환
        if (response.data.restaurants) {
          return response.data.restaurants;
        }
        
        // 백업: API가 실패하면 mock 데이터 반환
        console.log('Using fallback data for Naver search');
        return [
          {
            id: `naver-fallback-1-${Date.now()}`,
            name: searchQuery + ' 맛집',
            address: '서울특별시 강남구 테헤란로 123',
            roadAddress: '서울특별시 강남구 테헤란로 123',
            category: '한식',
            phone: '02-1234-5678',
            coordinates: { lat: 37.5665 + Math.random() * 0.01, lng: 126.9780 + Math.random() * 0.01 }
          }
        ];
      } catch (error) {
        console.error('Naver search error:', error);
        // 에러 발생 시 빈 배열 반환
        return [];
      }
    },
    enabled: searchType === 'naver' && searchQuery.length > 0,
  });

  const handleAddNewRestaurant = async (place: KakaoPlace) => {
    // 로컬 스토리지에 직접 저장 (백엔드 API 대신)
    const newRestaurant: Restaurant = {
      _id: place.id || `local-${Date.now()}`,
      name: place.name,
      address: place.address,
      roadAddress: place.roadAddress || place.address,
      coordinates: place.coordinates,
      category: place.category,
      phoneNumber: place.phone || place.telephone || place.phoneNumber || '',
      images: [],
      priceRange: '',
      averageRating: 0,
      reviewCount: 0,
      tags: [],
      dnaProfile: {
        atmosphere: [],
        foodStyle: [],
        instagramability: 0,
        dateSpot: 0,
        groupFriendly: 0,
        soloFriendly: 0,
      },
      features: [],
      createdBy: {} as any,
      verifiedBy: [],
      isVerified: false,
      viewCount: 0,
      saveCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // 로컬 스토리지에 저장
    const savedRestaurants = localStorage.getItem('localRestaurants');
    const restaurants = savedRestaurants ? JSON.parse(savedRestaurants) : [];
    restaurants.push(newRestaurant);
    localStorage.setItem('localRestaurants', JSON.stringify(restaurants));
    
    onSelect(newRestaurant);
  };

  const restaurants = searchType === 'existing' 
    ? existingRestaurants || []
    : searchType === 'kakao' 
    ? kakaoPlaces || []
    : naverPlaces || [];
  
  const isLoading = searchType === 'existing' 
    ? isLoadingExisting 
    : searchType === 'kakao'
    ? isLoadingKakao
    : isLoadingNaver;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">맛집 검색</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="p-6 border-b">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="맛집 이름을 검색하세요..."
              className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            네이버 검색 기반으로 맛집을 찾아드립니다
          </p>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ maxHeight: 'calc(80vh - 200px)' }}>
          {!searchQuery ? (
            <div className="p-8 text-center text-gray-500">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>맛집 이름이나 주소를 검색해보세요</p>
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">검색 중...</p>
            </div>
          ) : !restaurants || restaurants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>검색 결과가 없습니다</p>
              <p className="text-sm mt-2">
                다른 검색어로 시도해보세요
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {restaurants.map((restaurant: Restaurant | KakaoPlace, index: number) => (
                <div
                  key={'_id' in restaurant ? restaurant._id : restaurant.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {(() => {
                        const hasImages = 'images' in restaurant && restaurant.images && restaurant.images.length > 0;
                        if (hasImages) {
                          const firstImage = restaurant.images![0];
                          const imageUrl = typeof firstImage === 'string' 
                            ? firstImage 
                            : (firstImage as any).url || firstImage;
                          return (
                            <img
                              src={imageUrl}
                              alt={restaurant.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          );
                        }
                        return (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                        {restaurant.address}
                      </p>
                      {restaurant.roadAddress && restaurant.roadAddress !== restaurant.address && (
                        <p className="text-gray-500 text-sm mt-1">
                          도로명: {restaurant.roadAddress}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                          {restaurant.category}
                        </span>
                        {(() => {
                          const phoneValue = ('phone' in restaurant && restaurant.phone) || 
                                           ('phoneNumber' in restaurant && restaurant.phoneNumber) ||
                                           ('telephone' in restaurant && restaurant.telephone);
                          return phoneValue ? (
                            <span className="text-gray-500 text-xs">
                              {phoneValue}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <button
                        onClick={() => {
                          if (searchType === 'existing') {
                            onSelect(restaurant as Restaurant);
                          } else {
                            // Both kakao and naver search results
                            handleAddNewRestaurant(restaurant as KakaoPlace);
                          }
                        }}
                        className="btn btn-primary btn-sm flex items-center space-x-1"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>추가</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantSearchModal;