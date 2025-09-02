import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import PlaylistCard from '../components/PlaylistCard';
import { 
  UserIcon,
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  UserPlusIcon,
  UserMinusIcon,
  CogIcon,
  StarIcon,
  CameraIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';
import { useSavedPlaylists, useSavedRestaurants } from '../utils/dataManager';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists';
import { getRestaurantById } from '../data/sampleRestaurants';
import KoreanMap from '../components/KoreanMap';

// 취향 프로필 정보
const tasteProfiles = {
  spicy_adventurer: { 
    title: '매콤한 모험가', 
    emoji: '🌶️',
    description: '매운 음식과 새로운 맛에 도전하는 용감한 미식가'
  },
  trendy_explorer: { 
    title: '힙스터 탐험가', 
    emoji: '✨',
    description: '트렌디한 장소에서 SNS 속 맛집을 찾아다니는 타입'
  },
  comfort_lover: { 
    title: '편안함 추구자', 
    emoji: '🏠',
    description: '익숙하고 편안한 음식, 아늑한 분위기를 좋아하는 타입'
  },
  social_foodie: { 
    title: '소셜 푸디', 
    emoji: '👥',
    description: '친구, 가족과 함께하는 식사의 즐거움을 아는 타입'
  },
  budget_gourmet: { 
    title: '가성비 구르메', 
    emoji: '💰',
    description: '합리적인 가격으로 맛있는 음식을 찾는 똑똑한 타입'
  },
  premium_diner: { 
    title: '프리미엄 다이너', 
    emoji: '💎',
    description: '품질 좋은 음식과 고급스러운 경험을 중시하는 타입'
  },
  solo_explorer: { 
    title: '혼밥 탐험가', 
    emoji: '🧘‍♀️',
    description: '혼자만의 시간을 즐기며 맛집을 탐험하는 독립적인 타입'
  },
  traditional_taste: { 
    title: '전통 미식가', 
    emoji: '🍚',
    description: '한식과 전통적인 맛을 사랑하는 클래식한 타입'
  }
};

const ProfileV2: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showCreated, setShowCreated] = useState(true);
  const [showSavedLists, setShowSavedLists] = useState(true);
  const [showSavedRestaurants, setShowSavedRestaurants] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localSavedPlaylists, setLocalSavedPlaylists] = useState<any[]>([]);
  const [localSavedRestaurants, setLocalSavedRestaurants] = useState<any[]>([]);
  const [showRestaurantDetails, setShowRestaurantDetails] = useState<{[key: string]: boolean}>({});
  const [selectedRestaurantForMap, setSelectedRestaurantForMap] = useState<any>(null);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // 로컬스토리지에서 직접 데이터 로드
  const loadSavedData = () => {
    console.log('Profile - loadSavedData called at', new Date().toISOString());
    const storageData = localStorage.getItem('bobmap_user_data');
    
    if (storageData) {
      const data = JSON.parse(storageData);
      
      // 중복 제거
      const uniquePlaylists = data.savedPlaylists?.reduce((acc: any[], curr: any) => {
        if (!acc.find(item => item.playlistId === curr.playlistId)) {
          acc.push(curr);
        }
        return acc;
      }, []) || [];
      
      const uniqueRestaurants = data.savedRestaurants?.reduce((acc: any[], curr: any) => {
        if (!acc.find(item => item.restaurantId === curr.restaurantId)) {
          acc.push(curr);
        }
        return acc;
      }, []) || [];
      
      setLocalSavedPlaylists(uniquePlaylists);
      setLocalSavedRestaurants(uniqueRestaurants);
    } else {
      setLocalSavedPlaylists([]);
      setLocalSavedRestaurants([]);
    }
  };
  
  // 저장된 레스토랑 가져오기
  const getSavedRestaurants = () => {
    return localSavedRestaurants;
  };
  
  // 저장된 레스토랑 업데이트
  const setSavedRestaurants = (restaurants: any[]) => {
    setLocalSavedRestaurants(restaurants);
    // localStorage 업데이트
    const storageData = localStorage.getItem('bobmap_user_data');
    if (storageData) {
      const data = JSON.parse(storageData);
      data.savedRestaurants = restaurants;
      localStorage.setItem('bobmap_user_data', JSON.stringify(data));
      // 이벤트 발생
      window.dispatchEvent(new Event('dataManager:update'));
    }
  };
  
  // 초기 로드 및 실시간 업데이트
  useEffect(() => {
    loadSavedData();
    
    const handleDataUpdate = () => {
      loadSavedData();
      setRefreshKey(prev => prev + 1);
    };
    
    const handleFocus = () => {
      loadSavedData();
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('dataManager:update', handleDataUpdate);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleDataUpdate);
    
    // 3초마다 자동 새로고침
    const intervalId = setInterval(() => {
      loadSavedData();
    }, 3000);
    
    return () => {
      window.removeEventListener('dataManager:update', handleDataUpdate);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleDataUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // 사용자 프로필 데이터 가져오기 (API 오류 시 기본값 사용)
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', username || currentUser?._id],
    queryFn: async () => {
      try {
        const userId = username ? 
          (await axios.get(`/api/users/username/${username}`)).data.user._id :
          currentUser?._id;
        const response = await axios.get(`/api/users/${userId}/profile`);
        return response.data;
      } catch (error) {
        console.log('Profile API error, using default data');
        // API 오류 시 기본 데이터 반환
        return {
          user: currentUser || {
            _id: '1',
            username: username || 'user',
            followerCount: 0,
            followingCount: 0,
            visitedRestaurantsCount: 0,
            profileImage: null,
            tasteProfile: 'spicy_adventurer',
            trustScore: 85,
            bio: '',
          }
        };
      }
    },
    enabled: true,
  });

  const { data: playlistsData } = useQuery({
    queryKey: ['userPlaylists', username || currentUser?._id],
    queryFn: async () => {
      try {
        const userId = username ?
          (await axios.get(`/api/users/username/${username}`)).data.user._id :
          currentUser?._id;
        const response = await axios.get(`/api/playlists/user/${userId}`);
        return response.data;
      } catch (error) {
        console.log('Playlists API error, using local data');
        // API 오류 시 로컬 데이터만 사용
        return { playlists: [] };
      }
    },
    enabled: true,
  });

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { user = {} } = profileData || {};
  const profileUser: any = {
    ...user,
    username: user.username || username,
    followerCount: user.followerCount ?? 5,
    followingCount: user.followingCount ?? 6,
    visitedRestaurantsCount: user.visitedRestaurantsCount ?? 56,
    profileImage: user.profileImage || null,
    tasteProfile: user.tasteProfile || 'spicy_adventurer',
    _id: user._id || '1',
    trustScore: user.trustScore || 85,
    bio: user.bio || '',
  };

  const isOwnProfile = !username || currentUser?._id === profileUser._id;

  // 로컬 플레이리스트 가져오기
  const localPlaylists = localStorage.getItem('localPlaylists');
  const userPlaylists = localPlaylists ? JSON.parse(localPlaylists) : [];
  const allPlaylists = [...(playlistsData?.playlists || []), ...userPlaylists];

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <img
              src={profileUser.profileImage || getDefaultAvatar(profileUser.username, 150)}
              alt={profileUser.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto md:mx-0"
            />
          </div>

          <div className="flex-1">
            {/* 사용자명 */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{profileUser.username}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600">
                <Link to={`/expert/${profileUser.username}/followers`} className="hover:text-primary-600">
                  팔로워 <span className="font-semibold">{profileUser.followerCount}</span>
                </Link>
                <Link to={`/expert/${profileUser.username}/following`} className="hover:text-primary-600">
                  팔로잉 <span className="font-semibold">{profileUser.followingCount}</span>
                </Link>
                <span>방문 맛집 <span className="font-semibold">{profileUser.visitedRestaurantsCount}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 새로고침 버튼 */}
      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              loadSavedData();
              setRefreshKey(prev => prev + 1);
              toast.success('새로고침 완료!');
            }}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-lg border border-gray-200"
            title="새로고침"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* 모든 콘텐츠를 한 화면에 표시 */}
      <div className="space-y-6">
        {/* 만든 맛집리스트 섹션 */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">만든 맛집리스트 ({allPlaylists.length})</h3>
            <button
              onClick={() => setShowCreated(!showCreated)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${showCreated ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {showCreated && (
            allPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPlaylists.map((playlist: any) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} horizontal={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">아직 만든 플레이리스트가 없습니다</p>
              </div>
            )
          )}
        </div>

        {/* 저장한 리스트 섹션 */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">저장한 리스트 ({localSavedPlaylists.length})</h3>
              <button
                onClick={() => setShowSavedLists(!showSavedLists)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSavedLists ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showSavedLists && (
              localSavedPlaylists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localSavedPlaylists.map((saved: any) => {
                    let playlist: any = certifiedRestaurantLists.find(p => p._id === saved.playlistId);
                    
                    if (!playlist) {
                      const adminPlaylists = localStorage.getItem('adminPlaylists');
                      if (adminPlaylists) {
                        const playlists = JSON.parse(adminPlaylists);
                        playlist = playlists.find((p: any) => p._id === saved.playlistId);
                      }
                    }
                    
                    if (!playlist) return null;
                    
                    const formattedPlaylist = {
                      ...playlist,
                      category: playlist.certification || '맛집',
                      likeCount: playlist.likeCount || 0,
                      saveCount: playlist.saveCount || 0,
                      viewCount: playlist.viewCount || 0,
                      createdAt: playlist.createdAt || new Date().toISOString(),
                      restaurants: playlist.restaurants || []
                    };
                    
                    return (
                      <div key={playlist._id} className="space-y-3">
                        <PlaylistCard playlist={formattedPlaylist} horizontal={false} />
                        
                        {/* 리스트 내 맛집들 표시 (토글 가능) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRestaurantDetails(prev => ({...prev, [playlist._id]: !prev[playlist._id]}));
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          {showRestaurantDetails[playlist._id] ? '맛집 숨기기' : `맛집 ${playlist.restaurants?.length || 0}개 보기`}
                        </button>
                        
                        {showRestaurantDetails[playlist._id] && playlist.restaurants && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {playlist.restaurants.slice(0, 6).map((restaurantId: string) => {
                              const restaurant = getRestaurantById(restaurantId);
                              if (!restaurant) return null;
                              
                              return (
                                <div
                                  key={restaurantId}
                                  onClick={() => setSelectedRestaurantForMap(restaurant)}
                                  className="bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                  {restaurant.image && (
                                    <img
                                      src={restaurant.image}
                                      alt={restaurant.name}
                                      className="w-full h-16 object-cover rounded mb-1"
                                    />
                                  )}
                                  <h5 className="text-xs font-medium line-clamp-1">{restaurant.name}</h5>
                                  <p className="text-xs text-gray-500">{restaurant.category}</p>
                                  {restaurant.rating && (
                                    <div className="flex items-center mt-1">
                                      <StarIcon className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                      <span className="text-xs ml-0.5">{restaurant.rating}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">저장한 리스트가 없습니다</p>
                </div>
              )
            )}
          </div>
        )}

        {/* 저장한 맛집 섹션 */}
        {isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">저장한 맛집 ({localSavedRestaurants.length})</h3>
              <button
                onClick={() => setShowSavedRestaurants(!showSavedRestaurants)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSavedRestaurants ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showSavedRestaurants && (
              localSavedRestaurants.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {localSavedRestaurants.map((saved: any) => {
                    let restaurant = getRestaurantById(saved.restaurantId);
                    
                    if (!restaurant) {
                      const localRestaurants = localStorage.getItem('localRestaurants');
                      const restaurants = localRestaurants ? JSON.parse(localRestaurants) : [];
                      restaurant = restaurants.find((r: any) => r._id === saved.restaurantId);
                    }
                    
                    return (
                      <div 
                        key={saved.restaurantId} 
                        className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                        onClick={() => setSelectedRestaurantForMap(restaurant)}
                      >
                        {restaurant?.image && (
                          <img 
                            src={restaurant.image} 
                            alt={restaurant.name}
                            className="w-full h-24 md:h-32 object-cover"
                          />
                        )}
                        <div className="p-2 md:p-3">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {restaurant?.name || saved.restaurantId}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{restaurant?.category}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{restaurant?.address}</p>
                          {restaurant?.rating && (
                            <div className="flex items-center mt-1">
                              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs ml-1">{restaurant.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">저장한 맛집이 없습니다</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      {/* 지도 모달 */}
      {selectedRestaurantForMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-3 border-b">
              <div>
                <h3 className="font-bold text-base">{selectedRestaurantForMap.name}</h3>
                <p className="text-xs text-gray-600">{selectedRestaurantForMap.address}</p>
              </div>
              <button
                onClick={() => setSelectedRestaurantForMap(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* 지도 */}
            <div className="h-[200px] md:h-[250px]">
              <KoreanMap
                center={selectedRestaurantForMap.coordinates || { lat: 37.5665, lng: 126.9780 }}
                zoom={15}
                restaurants={[selectedRestaurantForMap]}
                className="w-full h-full"
              />
            </div>
            
            {/* 맛집 정보 및 액션 버튼 */}
            <div className="p-3 border-t max-h-[280px] overflow-y-auto">
              <div className="flex items-start gap-3 mb-3">
                {selectedRestaurantForMap.image && (
                  <img
                    src={selectedRestaurantForMap.image}
                    alt={selectedRestaurantForMap.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                        {selectedRestaurantForMap.category}
                      </span>
                      {selectedRestaurantForMap.rating && (
                        <div className="flex items-center">
                          <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs ml-0.5">{selectedRestaurantForMap.rating}</span>
                        </div>
                      )}
                    </div>
                    {/* 액션 버튼 */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          const savedRestaurants = getSavedRestaurants();
                          const index = savedRestaurants.findIndex(r => 
                            r.restaurantId === selectedRestaurantForMap.restaurantId || 
                            r._id === selectedRestaurantForMap._id
                          );
                          if (index > -1) {
                            savedRestaurants.splice(index, 1);
                          }
                          setSavedRestaurants(savedRestaurants);
                          setSelectedRestaurantForMap(null);
                          setRefreshKey(Date.now());
                        }}
                        className="flex items-center gap-0.5 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                      >
                        <BookmarkIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">저장 취소</span>
                      </button>
                      <button
                        onClick={() => {
                          // 좋아요 토글 (실제로는 localStorage에 저장)
                          const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
                          const restaurantId = selectedRestaurantForMap.restaurantId || selectedRestaurantForMap._id;
                          const isLiked = likedRestaurants.includes(restaurantId);
                          if (isLiked) {
                            const index = likedRestaurants.indexOf(restaurantId);
                            likedRestaurants.splice(index, 1);
                          } else {
                            likedRestaurants.push(restaurantId);
                          }
                          localStorage.setItem('likedRestaurants', JSON.stringify(likedRestaurants));
                          setRefreshKey(Date.now());
                        }}
                        className={`flex items-center gap-0.5 px-2 py-1 rounded transition-colors text-xs ${
                          JSON.parse(localStorage.getItem('likedRestaurants') || '[]').includes(
                            selectedRestaurantForMap.restaurantId || selectedRestaurantForMap._id
                          )
                            ? 'bg-pink-500 text-white hover:bg-pink-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <HeartSolidIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">
                          {JSON.parse(localStorage.getItem('likedRestaurants') || '[]').includes(
                            selectedRestaurantForMap.restaurantId || selectedRestaurantForMap._id
                          ) ? '좋아요 취소' : '좋아요'}
                        </span>
                      </button>
                    </div>
                  </div>
                  {selectedRestaurantForMap.description && (
                    <p className="text-sm text-gray-600 mb-3">{selectedRestaurantForMap.description}</p>
                  )}
                  
                  {/* 추가 정보 */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedRestaurantForMap.priceRange && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">가격대:</span>
                        <span className="font-medium">{selectedRestaurantForMap.priceRange}</span>
                      </div>
                    )}
                    {selectedRestaurantForMap.phone && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">전화:</span>
                        <span className="font-medium">{selectedRestaurantForMap.phone}</span>
                      </div>
                    )}
                    {selectedRestaurantForMap.hours && (
                      <div className="flex items-center gap-1 col-span-2">
                        <span className="text-gray-500">영업시간:</span>
                        <span className="font-medium">{selectedRestaurantForMap.hours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 리뷰 섹션 */}
              <div className="border-t pt-3">
                <h4 className="font-bold text-xs mb-2">리뷰</h4>
                <div className="space-y-2">
                  {/* 샘플 리뷰들 */}
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          김
                        </div>
                        <span className="font-medium text-xs">김재광</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-2.5 h-2.5 ${i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">진짜 맛있어요! 특히 제육볶음이 최고입니다.</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">2일 전</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                          이
                        </div>
                        <span className="font-medium text-xs">이남우</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`w-2.5 h-2.5 ${i < 5 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">사장님이 친절하시고 반찬도 맛있어요!</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">1주일 전</p>
                  </div>
                </div>
                
                {/* 리뷰 작성 버튼 */}
                <button className="w-full mt-2 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-xs font-medium">
                  리뷰 작성하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileV2;