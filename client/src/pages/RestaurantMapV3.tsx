import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import KoreanMap from '../components/KoreanMap';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  PhoneIcon, 
  XMarkIcon, 
  BuildingStorefrontIcon, 
  TrashIcon, 
  StarIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  BookmarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid';
import { Restaurant } from '../types';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists_fixed';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';
import { ShareIcon } from '@heroicons/react/24/outline';
import { dataManager } from '../utils/dataManager';
import { useIsMobile } from '../hooks/useIsMobile';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers missing issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RestaurantMapV3: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'restaurants' | 'lists'>('lists');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [savedLists, setSavedLists] = useState<string[]>(() => {
    const savedData = dataManager.getSavedPlaylists();
    return savedData.map(p => p.playlistId);
  });
  const [selectedCreatorForExplore, setSelectedCreatorForExplore] = useState<any>(null);
  
  // 소셜 스토어에서 팔로잉 관리
  const { followUser, unfollowUser, isFollowing, syncWithLocalStorage } = useSocialStore();
  
  // 컴포넌트 마운트 시 동기화
  useEffect(() => {
    syncWithLocalStorage();
  }, [syncWithLocalStorage]);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    category: '',
    certification: '', // 인증 맛집 필터 추가
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

  const [savedRestaurants, setSavedRestaurants] = useState<string[]>(() => {
    const savedData = dataManager.getSavedRestaurants();
    return savedData.map(r => r.restaurantId);
  });

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Listen for dataManager updates
  useEffect(() => {
    const handleDataUpdate = () => {
      const savedData = dataManager.getSavedRestaurants();
      setSavedRestaurants(savedData.map(r => r.restaurantId));
    };

    window.addEventListener('dataManager:update', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('dataManager:update', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, []);

  // Handle restaurant query parameter from profile
  useEffect(() => {
    const restaurantId = searchParams.get('restaurant');
    if (restaurantId) {
      // Try to find in localStorage
      let restaurant: any = null;
      const localRestaurants = localStorage.getItem('localRestaurants');
      if (localRestaurants) {
        const restaurants = JSON.parse(localRestaurants);
        restaurant = restaurants.find((r: any) => r._id === restaurantId);
      }
      
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        // Set map center to restaurant location
        if (restaurant.coordinates) {
          setMapCenter({
            lat: restaurant.coordinates.lat,
            lng: restaurant.coordinates.lng
          });
        }
        // Also open the restaurant details modal on mobile
        if (isMobile) {
          setTimeout(() => {
            setSelectedRestaurant(restaurant);
          }, 500);
        }
      }
    }
  }, [searchParams, isMobile]);

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
      // DB 데이터만 사용
      const dbData = dbRestaurants || [];
      result = dbData;
      
      // Add certified restaurants from admin panel
      const certifiedData = localStorage.getItem('certified_restaurants_data');
      if (certifiedData) {
        const parsedData = JSON.parse(certifiedData);
        const certifiedRestaurants: Restaurant[] = [];
        
        Object.entries(parsedData.categories).forEach(([categoryKey, category]: [string, any]) => {
          category.restaurants.forEach((r: any) => {
            const location = r.location || { lat: 37.5665, lng: 126.9780 };
            certifiedRestaurants.push({
              _id: r.id,
              name: r.name,
              category: r.category,
              address: r.address,
              phoneNumber: r.phoneNumber || '',
              priceRange: r.priceRange || '',
              averageRating: r.rating || 0,
              images: r.image ? [r.image] : [],
              certification: category.title, // Add certification badge
              certificationIcon: category.icon,
              location: location,
              coordinates: location, // Use same format as location
              dnaProfile: {
                atmosphere: ['casual', 'cozy'],
                foodStyle: ['traditional', 'authentic'],
                instagramability: 4,
                dateSpot: 3,
                groupFriendly: 4,
                soloFriendly: 3
              },
              reviewCount: 0,
              tags: [],
              features: [],
              createdBy: {} as any,
              verifiedBy: [],
              isVerified: true,
              viewCount: 0,
              saveCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            } as Restaurant);
          });
        });
        
        result = [...result, ...certifiedRestaurants];
      }
      
      // Add local storage restaurants with proper type conversion
      const localRestaurants = localStorage.getItem('localRestaurants');
      if (localRestaurants) {
        const localData = JSON.parse(localRestaurants);
        const convertedLocalRestaurants = localData.map((r: any) => ({
          ...r,
          priceRange: r.priceRange || '',
          images: r.image ? [r.image] : [],
          averageRating: r.rating || 0,
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
        } as Restaurant));
        
        result = [...result, ...convertedLocalRestaurants].filter((restaurant: Restaurant, index: number, self: Restaurant[]) =>
          index === self.findIndex((r) => r._id === restaurant._id)
        );
      }
    }
    
    // 선택된 레스토랑이 있고 리스트에 없으면 추가
    if (selectedRestaurant && !result.find(r => r._id === selectedRestaurant._id)) {
      result = [selectedRestaurant, ...result];
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
    
    // 인증 맛집 필터
    if (filters.certification) {
      result = result.filter(restaurant => 
        (restaurant as any).certification === filters.certification
      );
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
  }, [searchKeyword, searchResults, dbRestaurants, filters, selectedRestaurant]);

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
    console.log('Map - handleSaveRestaurant called - id:', restaurantId);
    
    if (!restaurantId) {
      console.error('Restaurant ID is missing');
      toast.error('맛집 정보를 찾을 수 없습니다.');
      return;
    }
    
    const isSaved = dataManager.isRestaurantSaved(restaurantId);
    console.log('Map - Is already saved?', isSaved);
    
    if (isSaved) {
      dataManager.unsaveRestaurant(restaurantId);
      toast.success('저장을 취소했습니다.');
      // Update local state
      setSavedRestaurants(prev => prev.filter(id => id !== restaurantId));
    } else {
      // 맛집 정보도 함께 저장 (나중에 표시하기 위해)
      const storedRestaurants = localStorage.getItem('localRestaurants');
      const localData = storedRestaurants ? JSON.parse(storedRestaurants) : [];
      const restaurantData = localData.find((r: any) => r._id === restaurantId) ||
                            selectedRestaurant || 
                            { _id: restaurantId, name: '맛집', category: '기타', address: '' };
      
      // localRestaurants에 저장
      const existingRestaurants = storedRestaurants ? JSON.parse(storedRestaurants) : [];
      if (!existingRestaurants.find((r: any) => r._id === restaurantId)) {
        existingRestaurants.push(restaurantData);
        localStorage.setItem('localRestaurants', JSON.stringify(existingRestaurants));
        console.log('Restaurant data saved to localStorage:', restaurantData);
      }
      
      dataManager.saveRestaurant(restaurantId);
      toast.success('맛집이 저장되었습니다!');
      // Update local state
      setSavedRestaurants(prev => [...prev, restaurantId]);
    }
    
    // 저장 후 상태 확인
    const savedData = dataManager.getSavedRestaurants();
    console.log('Map - After save - Saved restaurants:', savedData);
    
    // 이벤트 발생
    window.dispatchEvent(new CustomEvent('dataManager:update'));
    
    // 상태 업데이트 강제
    setRefreshKey(prev => prev + 1);
  }, [selectedRestaurant]);

  // 팔로우 핸들러
  const handleFollowUser = useCallback((userId: string, username: string, userDetails?: any) => {
    const isFollowed = isFollowing(userId);
    
    if (isFollowed) {
      unfollowUser(userId);
      toast.success(`${username}님 팔로우 취소`);
    } else {
      followUser(userId, userDetails || { _id: userId, username });
      toast.success(`${username}님 팔로우 시작! 🎉`);
    }
  }, [isFollowing, followUser, unfollowUser]);

  const handleSaveList = useCallback((listId: string) => {
    console.log('Map - handleSaveList called - id:', listId);
    
    if (!listId) {
      console.error('List ID is missing');
      toast.error('리스트 정보를 찾을 수 없습니다.');
      return;
    }
    
    const isSaved = dataManager.isPlaylistSaved(listId);
    console.log('Map - Is list already saved?', isSaved);
    
    if (isSaved) {
      dataManager.unsavePlaylist(listId);
      
      // saved_playlists_[userId]에서도 제거
      if (user) {
        const savedIds = JSON.parse(localStorage.getItem(`saved_playlists_${user._id}`) || '[]');
        const updatedIds = savedIds.filter((id: string) => id !== listId);
        localStorage.setItem(`saved_playlists_${user._id}`, JSON.stringify(updatedIds));
      }
      
      toast.success('리스트 저장을 취소했습니다.');
      setSavedLists(prev => prev.filter(id => id !== listId));
    } else {
      dataManager.savePlaylist(listId);
      
      // saved_playlists_[userId]에 추가
      if (user) {
        const savedIds = JSON.parse(localStorage.getItem(`saved_playlists_${user._id}`) || '[]');
        if (!savedIds.includes(listId)) {
          savedIds.push(listId);
          localStorage.setItem(`saved_playlists_${user._id}`, JSON.stringify(savedIds));
        }
        
        // 플레이리스트 전체 데이터도 저장 (allPlaylists 업데이트)
        const playlist = certifiedRestaurantLists.find(list => list._id === listId);
        if (playlist) {
          const allPlaylistsData = JSON.parse(localStorage.getItem('allPlaylists') || '[]');
          const exists = allPlaylistsData.some((p: any) => p._id === playlist._id);
          if (!exists) {
            allPlaylistsData.push(playlist);
            localStorage.setItem('allPlaylists', JSON.stringify(allPlaylistsData));
          }
        }
      }
      
      toast.success('리스트가 저장되었습니다!');
      setSavedLists(prev => [...prev, listId]);
    }
    
    // 이벤트 발생
    window.dispatchEvent(new CustomEvent('dataManager:update'));
    setRefreshKey(prev => prev + 1);
  }, [user]);

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

          {/* 필터 버튼과 토글 */}
          <div className="flex justify-center items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('restaurants')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'restaurants' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🍚 맛집
              </button>
              <button
                onClick={() => setViewMode('lists')}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === 'lists' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📋 리스트
              </button>
            </div>
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

                {/* 인증 맛집 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏆 인증 맛집</label>
                  <select
                    value={filters.certification}
                    onChange={(e) => setFilters({ ...filters, certification: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">전체</option>
                    {(() => {
                      const certifiedData = localStorage.getItem('certified_restaurants_data');
                      if (certifiedData) {
                        const parsedData = JSON.parse(certifiedData);
                        return Object.entries(parsedData.categories).map(([key, category]: [string, any]) => (
                          <option key={key} value={category.title}>
                            {category.icon} {category.title}
                          </option>
                        ));
                      }
                      return null;
                    })()}
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
                    certification: '',
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
        <div className={`${isMobile ? 'flex flex-col' : 'grid lg:grid-cols-3 gap-6'}`}>
          {/* 지도 */}
          <div className={`${isMobile ? 'w-full' : 'lg:col-span-2'}`}>
            <div className="bg-white rounded-3xl shadow-xl relative">
              <div className={`relative w-full ${isMobile ? 'h-[300px]' : 'h-[600px]'}`}>
                <KoreanMap
                  restaurants={viewMode === 'lists' && selectedList ? 
                    selectedList.restaurants?.map((r: any) => r.restaurant || r) || [] : 
                    restaurants}
                  onRestaurantClick={handleRestaurantClick}
                  onMapClick={handleMapClick}
                  className="w-full h-full rounded-3xl"
                  markerSize="small" // 마커 크기 축소
                  center={mapCenter} // 지도 중심 설정
                />
                
                {/* 플로팅 액션 버튼 제거 - 맛집 추가 요청 버튼이 이미 있음 */}

                {/* 현재 등록된 맛집 수 표시 */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg" style={{ zIndex: 1000 }}>
                  <span className="text-sm font-medium text-gray-700">
                    {viewMode === 'lists' ? (
                      <>📋 {certifiedRestaurantLists.length}개 리스트</>
                    ) : (
                      <><BuildingStorefrontIcon className="w-4 h-4 inline mr-1" />
                      {restaurants.length}개 맛집</>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 모바일에서 지도 아래에 리스트/맛집 표시 */}
            {isMobile && (
              <div className="mt-4">
                {viewMode === 'lists' ? (
                  // 리스트 목록
                  <div className="grid grid-cols-1 gap-3">
                    {certifiedRestaurantLists.map((list) => (
                  <div key={list._id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    <div
                      onClick={() => setSelectedList(selectedList?._id === list._id ? null : list)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedList?._id === list._id ? 
                        'bg-gradient-to-r from-orange-50 to-red-50 border-b-2 border-orange-200' : 
                        'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            {list.title}
                            <ChevronDownIcon 
                              className={`w-4 h-4 text-gray-500 transition-transform ${
                                selectedList?._id === list._id ? 'rotate-180' : ''
                              }`} 
                            />
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{list.certification || list.category}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveList(list._id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            dataManager.isPlaylistSaved(list._id) ?
                            'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {dataManager.isPlaylistSaved(list._id) ? 
                            <BookmarkSolidIcon className="w-4 h-4" /> : 
                            <BookmarkIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{list.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>📍 {list.restaurants?.length || 0}개</span>
                          <button
                            className="cursor-pointer hover:text-orange-600 transition-colors flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (typeof list.createdBy === 'object' && list.createdBy?.username) {
                                setSelectedCreatorForExplore(list.createdBy);
                              }
                            }}
                          >
                            <span>👤 {typeof list.createdBy === 'object' ? list.createdBy?.username : list.createdBy}</span>
                            <ChevronDownIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* 드롭다운으로 식당 목록 표시 */}
                    {selectedList?._id === list._id && (
                      <div className="bg-gray-50 p-3 border-t border-gray-200 max-h-[300px] overflow-y-auto">
                        <div className="space-y-2">
                          {list.restaurants?.map((item: any, index: number) => {
                            const restaurant = item.restaurant || item;
                            if (!restaurant) return null;
                            
                            return (
                              <div
                                key={restaurant._id || index}
                                onClick={() => handleRestaurantClick(restaurant)}
                                className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-all flex items-center gap-3 border border-gray-100"
                              >
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm text-gray-900">{restaurant.name}</h5>
                                  <p className="text-xs text-gray-500">{restaurant.category}</p>
                                  {restaurant.address && (
                                    <p className="text-xs text-gray-400 mt-1">{restaurant.address}</p>
                                  )}
                                </div>
                                {restaurant.rating && (
                                  <div className="flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm ml-1">{restaurant.rating}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                    ))}
                  </div>
                ) : (
                  // 맛집 목록
                  <div className="grid grid-cols-1 gap-3">
                    {restaurants.slice(0, 10).map((restaurant) => {
                      const hasRating = 'rating' in restaurant && restaurant.rating;
                      return (
                        <div
                          key={restaurant._id}
                          onClick={() => setSelectedRestaurant(restaurant)}
                          className={`p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${
                            selectedRestaurant?._id === restaurant._id ? 
                            'border-orange-500 shadow-lg' : 
                            'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{restaurant.category}</p>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{restaurant.address}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveRestaurant(restaurant._id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${
                                  dataManager.isRestaurantSaved(restaurant._id) ?
                                  'bg-orange-100 text-orange-600' :
                                  'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {dataManager.isRestaurantSaved(restaurant._id) ? (
                                  <BookmarkSolidIcon className="w-4 h-4" />
                                ) : (
                                  <BookmarkIcon className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            {hasRating && (
                              <div className="flex items-center mt-2">
                                <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs ml-1">{(restaurant as any).rating}</span>
                              </div>
                            )}
                          </>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* 데스크톱에서만 기존 리스트 표시 */}
            {!isMobile && viewMode === 'lists' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {certifiedRestaurantLists.map((list) => (
                  <div
                    key={list._id}
                    onClick={() => setSelectedList(list)}
                    className={`p-4 bg-white rounded-xl border-2 cursor-pointer transition-all ${
                      selectedList?._id === list._id ? 
                      'border-orange-500 shadow-lg' : 
                      'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{list.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{list.certification || list.category}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveList(list._id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          dataManager.isPlaylistSaved(list._id) ?
                          'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {dataManager.isPlaylistSaved(list._id) ? 
                          <BookmarkSolidIcon className="w-4 h-4" /> : 
                          <BookmarkIcon className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{list.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>📍 {list.restaurants?.length || 0}개</span>
                      <span>👤 {typeof list.createdBy === 'object' ? list.createdBy?.username : list.createdBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽 사이드 패널 - 선택된 맛집 또는 리스트 정보 (데스크톱만) */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 h-[600px] overflow-y-auto">
              {selectedList && viewMode === 'lists' ? (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedList.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">{selectedList.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedList(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">맛집 목록 ({selectedList.restaurants?.length || 0}개)</h3>
                    <div className="space-y-3">
                      {selectedList.restaurants?.map((item: any, index: number) => {
                        // restaurants 배열이 { restaurant: {...} } 형태로 중첩되어 있음
                        const restaurant = item.restaurant || item;
                        if (!restaurant) return null;
                        
                        return (
                          <div
                            key={restaurant._id || index}
                            onClick={() => handleRestaurantClick(restaurant)}
                            className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              {restaurant.image && (
                                <img
                                  src={restaurant.image}
                                  alt={restaurant.name}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{restaurant.category}</p>
                                {restaurant.address && (
                                  <p className="text-xs text-gray-400 mt-1">{restaurant.address}</p>
                                )}
                                {restaurant.rating && (
                                  <div className="flex items-center mt-2">
                                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="text-sm ml-1">{restaurant.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : selectedRestaurant ? (
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

                    {/* 저장 및 공유 버튼 */}
                    <div className="flex gap-2 my-4">
                      <button
                        onClick={() => {
                          console.log('Desktop Save button clicked, restaurant:', selectedRestaurant);
                          if (selectedRestaurant && selectedRestaurant._id) {
                            handleSaveRestaurant(selectedRestaurant._id);
                          } else {
                            console.error('No restaurant ID available');
                            toast.error('맛집 정보를 찾을 수 없습니다.');
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {dataManager.isRestaurantSaved(selectedRestaurant._id) ? (
                          <BookmarkSolidIcon className="w-5 h-5 text-primary-500" />
                        ) : (
                          <BookmarkIcon className="w-5 h-5" />
                        )}
                        {dataManager.isRestaurantSaved(selectedRestaurant._id) ? '저장됨' : '저장하기'}
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: selectedRestaurant.name,
                              text: `${selectedRestaurant.name} - ${selectedRestaurant.category} 맛집`,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('링크가 복사되었습니다!');
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ShareIcon className="w-5 h-5" />
                        공유하기
                      </button>
                    </div>

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
                        onClick={() => {
                          console.log('Mobile Save button clicked, restaurant:', selectedRestaurant);
                          if (selectedRestaurant && selectedRestaurant._id) {
                            handleSaveRestaurant(selectedRestaurant._id);
                          } else {
                            console.error('No restaurant ID available');
                            toast.error('맛집 정보를 찾을 수 없습니다.');
                          }
                        }}
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
          )}
        </div>

        {/* 모바일에서 선택된 맛집 정보 모달 */}
        {isMobile && selectedRestaurant && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl p-6 animate-slide-up overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {selectedRestaurant.category}
                  </span>
                  {selectedRestaurant.priceRange && (
                    <span className="text-gray-600 text-sm">{selectedRestaurant.priceRange}</span>
                  )}
                </div>
                
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <span className="flex-1 text-sm">{selectedRestaurant.address}</span>
                </div>
                
                {selectedRestaurant.phoneNumber && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{selectedRestaurant.phoneNumber}</span>
                  </div>
                )}
                
                {/* 미니 지도 */}
                {(selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates) && (
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 mt-3">
                    <MapContainer 
                      center={[
                        (selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates).lat,
                        (selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates).lng
                      ]}
                      zoom={16}
                      scrollWheelZoom={false}
                      className="w-full h-full"
                      zoomControl={false}
                      doubleClickZoom={false}
                      dragging={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker 
                        position={[
                          (selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates).lat,
                          (selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates).lng
                        ]}
                      >
                        <Popup>{selectedRestaurant.name}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
                
                {/* 카카오맵으로 보기 버튼 */}
                {(selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates) && (
                  <button
                    onClick={() => {
                      const coords = selectedRestaurant.coordinates || (selectedRestaurant as any).coordinates;
                      window.open(
                        `https://map.kakao.com/link/map/${encodeURIComponent(selectedRestaurant.name)},${coords.lat},${coords.lng}`,
                        '_blank'
                      );
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-xl transition-colors text-sm"
                  >
                    <MapIcon className="w-4 h-4" />
                    카카오맵에서 보기
                  </button>
                )}
                
                {/* 저장 버튼 */}
                <button
                  onClick={() => handleSaveRestaurant(selectedRestaurant._id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    dataManager.isRestaurantSaved(selectedRestaurant._id)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {dataManager.isRestaurantSaved(selectedRestaurant._id) ? (
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
              </div>
            </div>
          </div>
        )}

        {/* 작성자 프로필 미리보기 모달 */}
        {selectedCreatorForExplore && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setSelectedCreatorForExplore(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* 프로필 정보 섹션 */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {selectedCreatorForExplore.username?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedCreatorForExplore.username}</h3>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {selectedCreatorForExplore.bio ||
                   (selectedCreatorForExplore.username === '흑백요리사' ? 'Netflix 흑백요리사 출연 셰프들의 레스토랑을 소개합니다' :
                    selectedCreatorForExplore.username === '수요미식회' ? 'tvN 수요미식회가 선정한 진짜 맛집을 공유합니다' :
                    selectedCreatorForExplore.username === '미쉐린가이드' ? '미쉐린 가이드가 선정한 최고의 레스토랑' :
                    selectedCreatorForExplore.username === '백종원의3대천왕' ? '백종원이 선정한 각 분야 최고의 맛집' :
                    selectedCreatorForExplore.username === '생활의달인' ? 'SBS 생활의달인이 인정한 장인의 맛' :
                    '맛집 큐레이터')}
                </p>
                {selectedCreatorForExplore.isVerified && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-blue-500 font-medium">인증됨</span>
                  </div>
                )}
                
                {/* 통계 정보 */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">
                      {certifiedRestaurantLists.filter((list: any) => {
                        if (typeof list.createdBy === 'object') {
                          return list.createdBy._id === selectedCreatorForExplore._id ||
                                 list.createdBy.username === selectedCreatorForExplore.username;
                        }
                        return false;
                      }).length}
                    </p>
                    <p className="text-xs text-gray-500">리스트</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">
                      {(() => {
                        const lists = certifiedRestaurantLists.filter((list: any) => {
                          if (typeof list.createdBy === 'object') {
                            return list.createdBy._id === selectedCreatorForExplore._id ||
                                   list.createdBy.username === selectedCreatorForExplore.username;
                          }
                          return false;
                        });
                        return lists.reduce((sum: number, list: any) => 
                          sum + (list.restaurants?.length || 0), 0
                        );
                      })()}
                    </p>
                    <p className="text-xs text-gray-500">맛집</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">
                      {selectedCreatorForExplore.followers?.length || 
                       (selectedCreatorForExplore.username === '흑백요리사' ? 3421 :
                        selectedCreatorForExplore.username === '수요미식회' ? 2987 :
                        selectedCreatorForExplore.username === '미쉐린가이드' ? 4567 :
                        selectedCreatorForExplore.username === '백종원의3대천왕' ? 2234 :
                        selectedCreatorForExplore.username === '생활의달인' ? 1876 : 0)}
                    </p>
                    <p className="text-xs text-gray-500">팔로워</p>
                  </div>
                </div>
                
                {/* 팔로우 버튼 */}
                <button
                  onClick={() => {
                    handleFollowUser(
                      selectedCreatorForExplore._id,
                      selectedCreatorForExplore.username,
                      selectedCreatorForExplore
                    );
                  }}
                  className={`mt-4 px-6 py-2 rounded-full font-medium transition-all ${
                    isFollowing(selectedCreatorForExplore._id)
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                  }`}
                >
                  {isFollowing(selectedCreatorForExplore._id) ? '팔로잉' : '팔로우'}
                </button>
              </div>
              
              {/* 최근 리스트 섹션 */}
              <div className="flex-1 overflow-y-auto">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">최근 만든 리스트</h4>
                {(() => {
                  // 더 유연한 매칭 - username 기반으로도 찾기
                  const creatorLists = certifiedRestaurantLists.filter((list: any) => {
                    if (typeof list.createdBy === 'object') {
                      return list.createdBy._id === selectedCreatorForExplore._id ||
                             list.createdBy.username === selectedCreatorForExplore.username;
                    }
                    return false;
                  }).slice(0, 3);
                  
                  if (creatorLists.length === 0) {
                    return (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">아직 만든 리스트가 없습니다</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-2">
                      {creatorLists.map((list: any) => (
                        <div
                          key={list._id}
                          onClick={() => {
                            setSelectedList(list);
                            setSelectedCreatorForExplore(null);
                          }}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm text-gray-900">{list.title || list.name}</h5>
                              <p className="text-xs text-gray-500 mt-1">📍 {list.restaurants?.length || 0}개 맛집</p>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => {
                    // Use userId if available for navigation (to handle Korean names), fallback to username
                    const profileId = selectedCreatorForExplore.userId || selectedCreatorForExplore.username;
                    navigate(`/profile/${profileId}`);
                    setSelectedCreatorForExplore(null);
                  }}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  전체 프로필 보기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 맛집 등록 모달 - 모든 사용자가 사용 가능 */}
        {showAddModal && (
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

        {/* 일반 사용자도 맛집 추가 가능 */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">새 맛집 등록</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                지도를 클릭하여 위치를 선택한 후, 맛집 정보를 입력해주세요.
              </p>

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
                    주소 *
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
                    <option value="₩">₩ (1만원 미만)</option>
                    <option value="₩₩">₩₩ (1-3만원)</option>
                    <option value="₩₩₩">₩₩₩ (3-5만원)</option>
                    <option value="₩₩₩₩">₩₩₩₩ (5만원 이상)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setNewRestaurantForm({
                      name: '',
                      category: '',
                      address: '',
                      phoneNumber: '',
                      priceRange: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitRestaurant}
                  disabled={createRestaurantMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {createRestaurantMutation.isPending ? '등록 중...' : '맛집 등록'}
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