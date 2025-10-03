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
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  BuildingStorefrontIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';
import { getDefaultAvatar } from '../utils/avatars';
import { useSavedPlaylists, useSavedRestaurants, dataManager } from '../utils/dataManager';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists_fixed';
import { cleanupAndSyncSocialData, getSocialStats, addLikedRestaurant, removeLikedRestaurant } from '../utils/dataSyncUtils';
// Removed dependency on sampleRestaurants - using MongoDB data
import KoreanMap from '../components/KoreanMap';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

// 맛집 추가 모달 컴포넌트
const AddRestaurantModal = ({ isOpen, onClose, playlistId, onAdd }: {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  onAdd: (restaurant: any) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Set<string>>(new Set());
  
  // 인증 맛집 리스트에서 검색
  const handleSearch = () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    
    // 모든 인증 맛집 리스트에서 검색
    const allRestaurants: any[] = [];
    certifiedRestaurantLists.forEach(list => {
      if (list.restaurants) {
        list.restaurants.forEach((rest: any) => {
          if (rest.restaurant && !allRestaurants.find(r => r._id === rest.restaurant._id)) {
            allRestaurants.push(rest.restaurant);
          }
        });
      }
    });
    
    // 검색어로 필터링
    const filtered = allRestaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(filtered);
  };
  
  useEffect(() => {
    if (searchQuery && isOpen) {
      handleSearch();
    }
  }, [searchQuery, isOpen]);
  
  const toggleRestaurant = (restaurantId: string) => {
    const newSelected = new Set(selectedRestaurants);
    if (newSelected.has(restaurantId)) {
      newSelected.delete(restaurantId);
    } else {
      newSelected.add(restaurantId);
    }
    setSelectedRestaurants(newSelected);
  };
  
  const handleAddSelected = () => {
    const restaurantsToAdd = searchResults.filter(r => selectedRestaurants.has(r._id));
    restaurantsToAdd.forEach(r => onAdd(r));
    onClose();
    setSearchQuery('');
    setSearchResults([]);
    setSelectedRestaurants(new Set());
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${
        isOpen ? 'block' : 'hidden'
      }`}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">플레이리스트에 맛집 추가</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="맛집 이름, 카테고리, 지역으로 검색"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => setSearchQuery('한식')}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                한식
              </button>
              <button
                onClick={() => setSearchQuery('양식')}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                양식
              </button>
              <button
                onClick={() => setSearchQuery('일식')}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                일식
              </button>
              <button
                onClick={() => setSearchQuery('중식')}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                중식
              </button>
              <button
                onClick={() => setSearchQuery('카페')}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
              >
                카페
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((restaurant) => (
                <div
                  key={restaurant._id}
                  onClick={() => toggleRestaurant(restaurant._id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedRestaurants.has(restaurant._id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {restaurant.image && (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.category}</p>
                      <p className="text-xs text-gray-500">{restaurant.address}</p>
                      {restaurant.rating && (
                        <div className="flex items-center mt-1">
                          <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs ml-1">{restaurant.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRestaurants.has(restaurant._id)}
                        onChange={() => {}}
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              맛집을 검색해주세요
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          <button
            onClick={handleAddSelected}
            disabled={selectedRestaurants.size === 0}
            className={`px-4 py-2 rounded-lg ${
              selectedRestaurants.size > 0
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedRestaurants.size > 0 ? `${selectedRestaurants.size}개 추가` : '맛집 선택'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const isMobile = useIsMobile();
  const {
    followingUsers,
    followingUserDetails,
    followers,
    followerDetails,
    savedRestaurants,
    savedPlaylists,
    getFollowingCount,
    getFollowerCount,
    getSavedRestaurantsCount,
    getSavedPlaylistsCount,
    syncWithLocalStorage
  } = useSocialStore();
  const navigate = useNavigate();
  const [showMyContent, setShowMyContent] = useState(false);
  const [myContentToggle, setMyContentToggle] = useState<'created' | 'saved'>('created');
  const [savedToggle, setSavedToggle] = useState<'restaurants' | 'playlists'>('restaurants');
  const [activeTab, setActiveTab] = useState<'my-lists' | 'saved' | 'likes'>('my-lists');
  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likesToggle, setLikesToggle] = useState<'restaurants' | 'playlists' | 'community'>('restaurants');
  const [refreshKey, setRefreshKey] = useState(0);
  const [localSavedPlaylists, setLocalSavedPlaylists] = useState<any[]>([]);
  const [localSavedRestaurants, setLocalSavedRestaurants] = useState<any[]>([]);
  const [likedRestaurants, setLikedRestaurants] = useState<any[]>([]);
  const [likedPlaylists, setLikedPlaylists] = useState<any[]>([]);
  const [likedCommunityPosts, setLikedCommunityPosts] = useState<any[]>([]);
  const [showRestaurantDetails, setShowRestaurantDetails] = useState<{[key: string]: boolean}>({});
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState<string | null>(null);
  const [selectedRestaurantForMap, setSelectedRestaurantForMap] = useState<any>(null);
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // 로컬스토리지에서 직접 데이터 로드 및 스토어 동기화
  const loadSavedData = () => {
    console.log('Profile - loadSavedData called at', new Date().toISOString());
    
    // Clean up and sync data first
    const data = cleanupAndSyncSocialData();
    
    // Then sync with store
    syncWithLocalStorage();
    
    // Load following data with correct structure
    const followingUsers = data.followingUsers || [];
    const followingUserDetails = data.followingUserDetails || [];
    
    // Ensure following details match following IDs
    if (followingUsers.length > 0 && followingUserDetails.length === 0) {
      // Create default details if missing
      const defaultDetails = followingUsers.map((userId: string) => ({
        _id: userId,
        username: `user_${userId.slice(-6)}`,
        bio: '맛집 큐레이터',
        followedAt: new Date().toISOString()
      }));
      data.followingUserDetails = defaultDetails;
      localStorage.setItem('bobmap_user_data', JSON.stringify(data));
    }
    
    // Load saved items - also check the new saved_playlists format
    const savedPlaylistIds = JSON.parse(localStorage.getItem(`saved_playlists_${currentUser?._id}`) || '[]');
    const savedPlaylistsData = savedPlaylistIds.map((id: string) => ({
      playlistId: id,
      savedAt: new Date().toISOString()
    }));
    
    // Merge with existing data format
    const uniquePlaylists = [...(data.savedPlaylists || []), ...savedPlaylistsData].reduce((acc: any[], curr: any) => {
      if (!acc.find(item => item.playlistId === curr.playlistId)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    
    const uniqueRestaurants = data.savedRestaurants?.reduce((acc: any[], curr: any) => {
      if (!acc.find(item => item.restaurantId === curr.restaurantId)) {
        acc.push(curr);
      }
      return acc;
    }, []) || [];
    
    console.log('Loaded saved playlists:', uniquePlaylists);
    console.log('Loaded saved restaurants:', uniqueRestaurants);
    setLocalSavedPlaylists(uniquePlaylists);
    setLocalSavedRestaurants(uniqueRestaurants);
    
    // Load liked items with proper structure - filter out nulls
    let likedRestaurantIds = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
    let likedPlaylistIds = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');

    // Filter out null, undefined, and empty strings
    likedRestaurantIds = likedRestaurantIds.filter((id: any) => id && id.trim && id.trim() !== '');
    likedPlaylistIds = likedPlaylistIds.filter((id: any) => id && id.trim && id.trim() !== '');

    // Get liked community post IDs
    const likedPostIds = Object.keys(likedPosts).filter(id => likedPosts[id]);
    
    // Get all available restaurants from various sources
    const localRestaurants = JSON.parse(localStorage.getItem('localRestaurants') || '[]');
    const allRestaurants = [...localRestaurants];
    
    // Add restaurants from playlists
    certifiedRestaurantLists.forEach(playlist => {
      if (playlist.restaurants) {
        playlist.restaurants.forEach((r: any) => {
          if (r && !allRestaurants.find((ar: any) => ar._id === (r._id || r.restaurantId))) {
            allRestaurants.push(r);
          }
        });
      }
    });
    
    // Map liked restaurant IDs to actual data
    const likedRestaurantDetails = likedRestaurantIds.map((id: string) => {
      const restaurant = allRestaurants.find((r: any) => 
        r._id === id || r.restaurantId === id
      );
      return restaurant || { 
        _id: id, 
        name: `Restaurant ${id.slice(-4)}`, 
        category: '맛집',
        rating: 4.0 + Math.random(),
        image: `https://source.unsplash.com/400x300/?food,${id}`
      };
    });
    setLikedRestaurants(likedRestaurantDetails);

    // Map liked community post IDs to actual data
    const likedCommunityPostsData = likedPostIds.map((id: string) => {
      // Simple community post structure with essential info
      return {
        id,
        title: `포스트 ${id}`,
        type: 'community',
        category: '커뮤니티',
        // Add more details if needed from localStorage
      };
    });
    setLikedCommunityPosts(likedCommunityPostsData);

    // Get all available playlists
    const adminPlaylists = JSON.parse(localStorage.getItem('adminPlaylists') || '[]');
    const localPlaylistsData = JSON.parse(localStorage.getItem('localPlaylists') || '[]');
    const allAvailablePlaylists = [...certifiedRestaurantLists, ...adminPlaylists, ...localPlaylistsData];
    
    // Map liked playlist IDs to actual data
    const likedPlaylistDetails = likedPlaylistIds.map((id: string) => {
      const playlist = allAvailablePlaylists.find((p: any) => p._id === id);
      return playlist || { 
        _id: id, 
        title: `Playlist ${id.slice(-4)}`, 
        restaurants: [],
        category: '맛집 리스트'
      };
    });
    setLikedPlaylists(likedPlaylistDetails);
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
  
  // 프로필 이미지 업로드 핸들러
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.profileImage) {
        // 프로필 이미지 업데이트 - 기존 사용자 정보와 병합
        if (currentUser) {
          updateUser({
            ...currentUser,
            profileImage: response.data.profileImage
          });
        }
        
        // 페이지 새로고침
        window.location.reload();
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      alert('프로필 이미지 업로드에 실패했습니다.');
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

  // 로컬 플레이리스트 가져오기
  const localPlaylists = localStorage.getItem('localPlaylists');
  const userPlaylists = localPlaylists ? JSON.parse(localPlaylists) : [];
  
  // playlistsData가 변경될 때 allPlaylists 업데이트 - Hook을 조건부 return 전에 배치
  useEffect(() => {
    const playlists = [...(playlistsData?.playlists || []), ...userPlaylists];
    setAllPlaylists(playlists);
  }, [playlistsData, userPlaylists.length]);

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
    followerCount: user.followerCount ?? 0,
    followingCount: user.followingCount ?? 0,
    visitedRestaurantsCount: user.visitedRestaurantsCount ?? 0,
    profileImage: user.profileImage || null,
    tasteProfile: user.tasteProfile || 'spicy_adventurer',
    _id: user._id || '1',
    trustScore: user.trustScore || 0,
    bio: user.bio || '',
  };

  const isOwnProfile = !username || currentUser?._id === profileUser._id;

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-8 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 mb-6 md:mb-0 relative group">
            <img
              src={profileUser.profileImage || getDefaultAvatar(profileUser.username, 150)}
              alt={profileUser.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto md:mx-0 object-cover"
            />
            {isOwnProfile && (
              <>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto md:mx-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center cursor-pointer transition-all duration-200"
                >
                  <CameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </label>
              </>
            )}
          </div>

          <div className="flex-1">
            {/* 사용자명 */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{profileUser.username}</h1>

              {/* 음식 선호도 표시 */}
              {profileUser.preferredFoods && profileUser.preferredFoods.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  {profileUser.preferredFoods.map((foodId: string, index: number) => {
                    const foodMap: { [key: string]: { name: string; emoji: string } } = {
                      korean: { name: '한식', emoji: '🍚' },
                      chinese: { name: '중식', emoji: '🥟' },
                      japanese: { name: '일식', emoji: '🍱' },
                      western: { name: '양식', emoji: '🍝' },
                      asian: { name: '아시안', emoji: '🍜' },
                      cafe: { name: '카페', emoji: '☕' },
                      dessert: { name: '디저트', emoji: '🍰' },
                      chicken: { name: '치킨', emoji: '🍗' },
                      pizza: { name: '피자', emoji: '🍕' },
                      burger: { name: '버거', emoji: '🍔' },
                      meat: { name: '고기', emoji: '🥩' },
                      seafood: { name: '해물', emoji: '🦐' },
                      noodles: { name: '면요리', emoji: '🍜' },
                      snack: { name: '분식', emoji: '🍢' },
                      bar: { name: '술집', emoji: '🍺' },
                      fastfood: { name: '패스트푸드', emoji: '🍟' }
                    };
                    const food = foodMap[foodId] || { name: foodId, emoji: '🍽️' };
                    return (
                      <span
                        key={foodId}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          index === 0
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        <span className="text-sm">{food.emoji}</span>
                        <span>{food.name}</span>
                        {index === 0 && <span className="text-xs">👑</span>}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600">
                <button
                  onClick={() => setShowFollowers(!showFollowers)}
                  className="hover:text-gray-800 transition-colors"
                >
                  팔로워 <span className="font-semibold">{followerDetails.length}</span>
                </button>
                <button
                  onClick={() => setShowFollowing(!showFollowing)}
                  className="hover:text-gray-800 transition-colors"
                >
                  팔로잉 <span className="font-semibold">{followingUserDetails.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 개선된 프로필 콘텐츠 탭 네비게이션 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 탭 헤더 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-lists')}
            className={`flex-1 py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'my-lists'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            <QueueListIcon className="w-4 h-4 hidden md:inline mr-1" />
            <span>리스트</span>
            <span className="ml-1 text-xs">({allPlaylists.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            <BookmarkIcon className="w-4 h-4 hidden md:inline mr-1" />
            <span>저장</span>
            <span className="ml-1 text-xs">({localSavedRestaurants.length + localSavedPlaylists.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 px-2 md:px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'likes'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            <HeartIcon className="w-4 h-4 hidden md:inline mr-1" />
            <span>좋아요</span>
            <span className="ml-1 text-xs">({likedRestaurants.length + likedPlaylists.length + likedCommunityPosts.length})</span>
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-4 md:p-6">

          {/* 내 리스트 탭 */}
          {activeTab === 'my-lists' && (
            allPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPlaylists.map((playlist: any) => (
                  <div key={playlist._id} className="relative">
                    <PlaylistCard playlist={playlist} horizontal={false} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylistForAdd(playlist._id);
                        setShowAddRestaurantModal(true);
                      }}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110 z-10"
                      title="맛집 추가"
                    >
                      <PlusIcon className="w-5 h-5 text-orange-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <QueueListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">아직 만든 플레이리스트가 없습니다</h3>
                <p className="text-gray-500 mb-4">나만의 맛집 리스트를 만들어보세요!</p>
                <Link
                  to="/create-playlist"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  플레이리스트 만들기
                </Link>
              </div>
            )
          )}

          {/* 저장한 항목 탭 */}
          {activeTab === 'saved' && (
            <>
              {/* 저장한 항목 내부 토글 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-3">저장한 항목 선택:</div>
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSavedToggle('restaurants')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      savedToggle === 'restaurants'
                        ? 'bg-white shadow-sm text-orange-600 border border-orange-200'
                        : 'bg-transparent text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    <BuildingStorefrontIcon className="w-4 h-4 inline mr-1" />
                    맛집 ({localSavedRestaurants.length})
                  </button>
                  <button
                    onClick={() => setSavedToggle('playlists')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      savedToggle === 'playlists'
                        ? 'bg-white shadow-sm text-orange-600 border border-orange-200'
                        : 'bg-transparent text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    <QueueListIcon className="w-4 h-4 inline mr-1" />
                    리스트 ({localSavedPlaylists.length})
                  </button>
                </div>

                {/* 네이버 맛집 연동 버튼 */}
                <button
                  onClick={() => navigate('/import/naver')}
                  className="w-full p-3 bg-white border border-green-400 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#03C75A">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">네이버 맛집 리스트 가져오기</span>
                </button>
              </div>

              {/* 저장한 콘텐츠 표시 */}
              {savedToggle === 'restaurants' ? (
                localSavedRestaurants.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {localSavedRestaurants.map((saved: any) => {
                      // 로컬 스토리지에서 레스토랑 정보 찾기
                      const localRestaurants = localStorage.getItem('localRestaurants');
                      const restaurants = localRestaurants ? JSON.parse(localRestaurants) : [];
                      let restaurant = restaurants.find((r: any) => r._id === saved.restaurantId);

                      // 레스토랑 정보가 없으면 기본값 사용
                      if (!restaurant) {
                        restaurant = saved.restaurant || {
                          _id: saved.restaurantId,
                          name: '정보 없음',
                          category: '',
                          rating: 0
                        };
                      }

                      return (
                        <div
                          key={saved.restaurantId}
                          className="bg-white rounded-lg border hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                          onClick={() => setSelectedRestaurantForMap(restaurant)}
                        >
                          <div className="relative w-full aspect-square">
                            {restaurant?.image ? (
                              <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant?.name || 'Restaurant')}&size=200&background=FED7AA&color=C2410C&bold=true`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                                <BuildingStorefrontIcon className="w-8 h-8 text-orange-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm line-clamp-1 mb-1">
                              {restaurant?.name || saved.restaurantId}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{restaurant?.category}</p>
                            {restaurant?.rating && (
                              <div className="flex items-center">
                                <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs ml-1">{restaurant.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">저장한 맛집이 없습니다</h3>
                    <p className="text-gray-500">맛집을 저장하고 나만의 컬렉션을 만들어보세요!</p>
                  </div>
                )
              ) : (
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
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                          >
                            {showRestaurantDetails[playlist._id] ? '맛집 숨기기' : `맛집 ${playlist.restaurants?.length || 0}개 보기`}
                          </button>

                          {showRestaurantDetails[playlist._id] && playlist.restaurants && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
                              {playlist.restaurants.slice(0, 6).map((restaurant: any, idx: number) => {
                                const restaurantData = typeof restaurant === 'string' ?
                                  { _id: restaurant, name: 'Loading...', category: '' } : restaurant;

                                return (
                                  <div
                                    key={restaurantData._id || idx}
                                    onClick={() => setSelectedRestaurantForMap(restaurantData)}
                                    className="bg-white rounded-lg p-2 cursor-pointer hover:shadow-sm transition-shadow"
                                  >
                                    {restaurantData.image && (
                                      <img
                                        src={restaurantData.image}
                                        alt={restaurantData.name}
                                        className="w-full h-16 object-cover rounded mb-2"
                                      />
                                    )}
                                    <h5 className="text-xs font-medium line-clamp-1">{restaurantData.name}</h5>
                                    <p className="text-xs text-gray-500">{restaurantData.category || '음식점'}</p>
                                    {restaurantData.rating && (
                                      <div className="flex items-center mt-1">
                                        <StarIcon className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                        <span className="text-xs ml-0.5">{restaurantData.rating}</span>
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
                  <div className="text-center py-12">
                    <QueueListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">저장한 리스트가 없습니다</h3>
                    <p className="text-gray-500">다른 사람들의 맛집 리스트를 저장해보세요!</p>
                  </div>
                )
              )}
            </>
          )}

          {/* 좋아요 탭 */}
          {activeTab === 'likes' && (
            <>
              {/* 좋아요 내부 토글 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-3">좋아요 항목 선택:</div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLikesToggle('restaurants')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      likesToggle === 'restaurants'
                        ? 'bg-white shadow-sm text-red-600 border border-red-200'
                        : 'bg-transparent text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    <BuildingStorefrontIcon className="w-4 h-4 inline mr-1" />
                    맛집 ({likedRestaurants.length})
                  </button>
                  <button
                    onClick={() => setLikesToggle('playlists')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      likesToggle === 'playlists'
                        ? 'bg-white shadow-sm text-red-600 border border-red-200'
                        : 'bg-transparent text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    <QueueListIcon className="w-4 h-4 inline mr-1" />
                    리스트 ({likedPlaylists.length})
                  </button>
                  <button
                    onClick={() => setLikesToggle('community')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      likesToggle === 'community'
                        ? 'bg-white shadow-sm text-red-600 border border-red-200'
                        : 'bg-transparent text-gray-600 hover:bg-white/70'
                    }`}
                  >
                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4 inline mr-1" />
                    커뮤니티 ({likedCommunityPosts.length})
                  </button>
                </div>
              </div>

              {/* 좋아요 콘텐츠 표시 */}
              {likesToggle === 'restaurants' ? (
                likedRestaurants.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {likedRestaurants.map((restaurant: any) => (
                      <div
                        key={restaurant._id}
                        className="bg-white rounded-lg border hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedRestaurantForMap(restaurant)}
                      >
                        <div className="relative w-full aspect-square">
                          {restaurant.image ? (
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&size=200&background=FED7AA&color=C2410C&bold=true`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                              <HeartIcon className="w-8 h-8 text-red-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm line-clamp-1 mb-1">{restaurant.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">{restaurant.category}</p>
                          {restaurant.rating && (
                            <div className="flex items-center">
                              <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs ml-1">{restaurant.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">좋아요한 맛집이 없습니다</h3>
                    <p className="text-gray-500">마음에 드는 맛집에 좋아요를 눌러보세요!</p>
                  </div>
                )
              ) : likesToggle === 'playlists' ? (
                likedPlaylists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {likedPlaylists.map((playlist: any) => (
                      <div
                        key={playlist._id}
                        className="flex items-center space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {playlist.restaurants?.length || 0}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-base line-clamp-1 mb-1">{playlist.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {playlist.certification || playlist.category} · {playlist.restaurants?.length || 0}개 맛집
                          </p>
                        </div>
                        <HeartSolidIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QueueListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">좋아요한 리스트가 없습니다</h3>
                    <p className="text-gray-500">다른 사람들의 맛집 리스트에 좋아요를 눌러보세요!</p>
                  </div>
                )
              ) : (
                likedCommunityPosts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {likedCommunityPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate('/community')}
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                          {post.type === 'recipe' ? '🍳' : post.type === 'tip' ? '💡' : '📝'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-base line-clamp-1 mb-1">{post.title || `커뮤니티 포스트 ${post.id}`}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {post.category} · 커뮤니티
                          </p>
                        </div>
                        <HeartSolidIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">좋아요한 커뮤니티 포스트가 없습니다</h3>
                    <p className="text-gray-500">커뮤니티에서 유용한 포스트에 좋아요를 눌러보세요!</p>
                  </div>
                )
              )}
            </>
          )}

        </div>

        {/* 모바일에서만 보이는 설정 섹션 */}
        {isMobile && isOwnProfile && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <CogIcon className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">설정</span>
              </div>
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div className="mt-4 space-y-3">
                {!currentUser ? (
                  // 로그인되지 않은 상태
                  <>
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>로그인</span>
                    </Link>
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
                    >
                      <UserPlusIcon className="w-5 h-5" />
                      <span>회원가입</span>
                    </Link>
                  </>
                ) : (
                  // 로그인된 상태
                  <>
                    <button
                      onClick={() => navigate('/edit-profile')}
                      className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                        <span>프로필 수정</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => navigate('/account-settings')}
                      className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <CogIcon className="w-5 h-5 text-gray-600" />
                        <span>계정 설정</span>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
                          logout();
                          navigate('/');
                          toast.success('로그아웃되었습니다');
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>로그아웃</span>
                    </button>
                  </>
                )}
              </div>
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
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedRestaurantForMap.image ? (
                    <img
                      src={selectedRestaurantForMap.image}
                      alt={selectedRestaurantForMap.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://source.unsplash.com/150x150/?food,restaurant';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <span className="text-xl">🍽️</span>
                    </div>
                  )}
                </div>
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
                          // 좋아요 토글 (dataSyncUtils 사용하여 일관성 유지)
                          const restaurantId = selectedRestaurantForMap.restaurantId || selectedRestaurantForMap._id;
                          const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
                          const isLiked = likedRestaurants.includes(restaurantId);
                          if (isLiked) {
                            removeLikedRestaurant(restaurantId);
                          } else {
                            addLikedRestaurant(restaurantId);
                          }
                          // Reload data to update counts
                          loadSavedData();
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

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">팔로잉 ({followingUserDetails.length})</h3>
              <button
                onClick={() => setShowFollowing(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {followingUserDetails.length > 0 ? (
                <div className="p-4 space-y-3">
                  {followingUserDetails.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between">
                      <Link
                        to={`/profile/${user.username}`}
                        className="flex items-center space-x-3 flex-1"
                        onClick={() => setShowFollowing(false)}
                      >
                        <img
                          src={user.profileImage || getDefaultAvatar(user.username, 40)}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.username}</p>
                          {user.bio && (
                            <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          useSocialStore.getState().unfollowUser(user._id);
                          toast.success(`${user.username}님 팔로우 취소`);
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        팔로우 취소
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  아직 팔로우한 사용자가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Likes Modal */}
      {showLikes && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">좋아요</h3>
                <button
                  onClick={() => setShowLikes(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              {/* Toggle buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setLikesToggle('restaurants')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                    likesToggle === 'restaurants'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  맛집 ({likedRestaurants.length})
                </button>
                <button
                  onClick={() => setLikesToggle('playlists')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                    likesToggle === 'playlists'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  리스트 ({likedPlaylists.length})
                </button>
                <button
                  onClick={() => setLikesToggle('community')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                    likesToggle === 'community'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  커뮤니티 ({likedCommunityPosts.length})
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {likesToggle === 'restaurants' ? (
                likedRestaurants.length > 0 ? (
                  <div className="p-4 grid grid-cols-3 gap-2">
                    {likedRestaurants.map((restaurant: any) => (
                      <div
                        key={restaurant._id}
                        className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedRestaurantForMap(restaurant);
                          setShowLikes(false);
                        }}
                      >
                        <div className="relative w-full aspect-square">
                          {restaurant.image ? (
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&size=150&background=FED7AA&color=C2410C&bold=true`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                              <span className="text-2xl">🍽️</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-xs line-clamp-1">{restaurant.name}</h4>
                          <p className="text-xs text-gray-500 line-clamp-1">{restaurant.category}</p>
                          {restaurant.rating && (
                            <div className="flex items-center mt-0.5">
                              <StarIcon className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                              <span className="text-xs ml-0.5">{restaurant.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    좋아요한 맛집이 없습니다
                  </div>
                )
              ) : likesToggle === 'playlists' ? (
                likedPlaylists.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {likedPlaylists.map((playlist: any) => (
                      <div
                        key={playlist._id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          navigate(`/playlist/${playlist._id}`);
                          setShowLikes(false);
                        }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {playlist.restaurants?.length || 0}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{playlist.title}</h4>
                          <p className="text-sm text-gray-500">
                            {playlist.certification || playlist.category} · {playlist.restaurants?.length || 0}개 맛집
                          </p>
                        </div>
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    좋아요한 리스트가 없습니다
                  </div>
                )
              ) : (
                /* Community posts */
                likedCommunityPosts.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {likedCommunityPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          navigate('/community');
                          setShowLikes(false);
                        }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
                          {post.type === 'recipe' ? '🍳' : post.type === 'tip' ? '💡' : '📝'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{post.title || `커뮤니티 포스트 ${post.id}`}</h4>
                          <p className="text-sm text-gray-500">
                            {post.category} · 커뮤니티
                          </p>
                        </div>
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    좋아요한 커뮤니티 포스트가 없습니다
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">팔로워 ({followerDetails.length})</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {followerDetails.length > 0 ? (
                <div className="p-4 space-y-3">
                  {followerDetails.map((user: any) => (
                    <div key={user._id} className="flex items-center justify-between">
                      <Link
                        to={`/profile/${user.username}`}
                        className="flex items-center space-x-3 flex-1"
                        onClick={() => setShowFollowers(false)}
                      >
                        <img
                          src={user.profileImage || getDefaultAvatar(user.username, 40)}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.username}</p>
                          {user.bio && (
                            <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
                          )}
                        </div>
                      </Link>
                      {useSocialStore.getState().isFollowing(user._id) ? (
                        <button
                          onClick={() => {
                            useSocialStore.getState().unfollowUser(user._id);
                            toast.success(`${user.username}님 팔로우 취소`);
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          맞팔로우 중
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            useSocialStore.getState().followUser(user._id, user);
                            toast.success(`${user.username}님 팔로우!`);
                          }}
                          className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-md"
                        >
                          팔로우
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  아직 팔로워가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 맛집 추가 모달 */}
      {showAddRestaurantModal && selectedPlaylistForAdd && (
        <AddRestaurantModal
          isOpen={showAddRestaurantModal}
          onClose={() => {
            setShowAddRestaurantModal(false);
            setSelectedPlaylistForAdd(null);
          }}
          playlistId={selectedPlaylistForAdd}
          onAdd={(restaurant) => {
            // 플레이리스트에 맛집 추가 로직
            const playlists = [...allPlaylists];
            const playlistIndex = playlists.findIndex(p => p._id === selectedPlaylistForAdd);
            if (playlistIndex !== -1) {
              if (!playlists[playlistIndex].restaurants) {
                playlists[playlistIndex].restaurants = [];
              }
              // 중복 체크
              const exists = playlists[playlistIndex].restaurants.some(
                (r: any) => (r.restaurant?._id || r._id) === restaurant._id
              );
              if (!exists) {
                playlists[playlistIndex].restaurants.push({
                  _id: `rest_${Date.now()}`,
                  restaurant: restaurant
                });
                // localStorage에 저장
                const adminPlaylists = localStorage.getItem('adminPlaylists');
                const allAdminPlaylists = adminPlaylists ? JSON.parse(adminPlaylists) : [];
                const updatedPlaylists = allAdminPlaylists.map((p: any) => 
                  p._id === selectedPlaylistForAdd ? playlists[playlistIndex] : p
                );
                if (!updatedPlaylists.find((p: any) => p._id === selectedPlaylistForAdd)) {
                  updatedPlaylists.push(playlists[playlistIndex]);
                }
                localStorage.setItem('adminPlaylists', JSON.stringify(updatedPlaylists));
                setAllPlaylists(playlists);
                toast.success(`${restaurant.name}을(를) 추가했습니다!`);
              } else {
                toast.error('이미 추가된 맛집입니다');
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default ProfileV2;