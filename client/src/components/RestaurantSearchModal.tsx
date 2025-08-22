import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
  const [searchType, setSearchType] = useState<'existing' | 'kakao' | 'naver'>('existing');

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
      const response = await axios.get('/api/restaurants/search/naver', {
        params: { query: searchQuery },
      });
      // 네이버 API는 { restaurants: [...] } 형식으로 반환
      const result = response.data;
      if (Array.isArray(result)) {
        return result;
      } else if (result && result.restaurants) {
        return result.restaurants;
      }
      return [];
    },
    enabled: searchType === 'naver' && searchQuery.length > 0,
  });

  const handleAddNewRestaurant = async (place: KakaoPlace) => {
    try {
      const restaurantData: any = {
        name: place.name,
        address: place.address,
        roadAddress: place.roadAddress,
        coordinates: place.coordinates,
        category: place.category,
        phoneNumber: place.phone || place.telephone || place.phoneNumber,
      };

      // Only add optional fields if they exist
      if (place.kakaoPlaceId || place.id) {
        restaurantData.kakaoPlaceId = place.kakaoPlaceId || place.id;
      }
      if (place.naverId) {
        restaurantData.naverId = place.naverId;
      }

      const response = await axios.post('/api/restaurants', restaurantData);
      
      onSelect(response.data);
    } catch (error: any) {
      console.error('Failed to create restaurant:', error);
      if (error.response?.status === 400) {
        // 이미 등록된 맛집인 경우, 기존 맛집 정보로 선택
        const existingRestaurant: Restaurant = {
          ...place,
          _id: place.id || 'temp-id',
          phoneNumber: place.phone,
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
        onSelect(existingRestaurant);
      }
    }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
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
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setSearchType('existing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'existing'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              등록된 맛집
            </button>
            <button
              onClick={() => setSearchType('kakao')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'kakao'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              카카오 검색
            </button>
            <button
              onClick={() => setSearchType('naver')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'naver'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              네이버 검색
            </button>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'existing'
                  ? '등록된 맛집을 검색하세요...'
                  : searchType === 'kakao'
                  ? '카카오맵에서 맛집을 검색하세요...'
                  : '네이버에서 맛집을 검색하세요...'
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto">
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
              {searchType === 'existing' && (
                <p className="text-sm mt-2">
                  '카카오 검색' 또는 '네이버 검색' 탭에서 맛집을 검색해보세요
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y">
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