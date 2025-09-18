import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  BookmarkIcon,
  ShareIcon,
  HeartIcon,
  CalendarIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  UserPlusIcon,
  UserMinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { useIsMobile } from '../hooks/useIsMobile';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { token, user: currentUser } = useAuthStore();
  const { followUser, unfollowUser } = useSocialStore();
  
  const [profileData, setProfileData] = useState<any>(null);
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [userRestaurants, setUserRestaurants] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'lists' | 'restaurants' | 'saved'>('lists');
  const [likedLists, setLikedLists] = useState<Set<string>>(new Set());
  const [savedLists, setSavedLists] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (profileData && currentUser) {
      // 팔로우 상태 확인
      const isUserFollowing = profileData.followers?.some(
        (f: any) => {
          const followerId = f._id || f.user?._id || f;
          return followerId === currentUser._id;
        }
      );
      setIsFollowing(isUserFollowing || false);
    }
  }, [profileData, currentUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // 실제 사용자 프로필 데이터 가져오기
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.get(
        `/users/${username}/profile`,
        config
      );
      
      if (response.data) {
        setProfileData(response.data.user);
        setUserPlaylists(response.data.playlists || []);
        setUserRestaurants(response.data.createdRestaurants || []);
        setSavedItems(response.data.savedItems || []);
        setStats(response.data.stats || null);
      }
    } catch (error: any) {
      console.error('프로필 로드 실패:', error);
      toast.error('프로필을 불러올 수 없습니다');
      
      // API 실패시 빈 데이터로 표시 (폴백 데이터 사용 안 함)
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !token) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    if (currentUser.username === username) {
      toast.error('자기 자신을 팔로우할 수 없습니다');
      return;
    }

    try {
      if (isFollowing) {
        await unfollowUser(profileData._id);
        setIsFollowing(false);
        
        // 팔로워 수 업데이트
        setProfileData((prev: any) => ({
          ...prev,
          followers: prev.followers.filter((f: any) => {
            const followerId = f._id || f.user?._id || f;
            return followerId !== currentUser._id;
          })
        }));
        
        toast.success(`${profileData.username}님을 언팔로우했습니다`);
      } else {
        await followUser(profileData._id, profileData.username);
        setIsFollowing(true);
        
        // 팔로워 수 업데이트
        setProfileData((prev: any) => ({
          ...prev,
          followers: [...(prev.followers || []), currentUser._id]
        }));
        
        toast.success(`${profileData.username}님을 팔로우했습니다`);
      }
    } catch (error) {
      console.error('팔로우 처리 실패:', error);
      toast.error('팔로우 처리에 실패했습니다');
    }
  };

  const handleLikeList = (listId: string) => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    setLikedLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
        toast.success('좋아요를 취소했습니다');
      } else {
        newSet.add(listId);
        toast.success('좋아요를 눌렀습니다');
      }
      return newSet;
    });
  };

  const handleSaveList = (listId: string) => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }

    setSavedLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
        toast.success('저장을 취소했습니다');
      } else {
        newSet.add(listId);
        toast.success('리스트를 저장했습니다');
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">프로필을 찾을 수 없습니다</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 실제 데이터 기반 통계 (서버에서 계산된 값 우선 사용)
  const profileStats = {
    lists: stats?.totalPlaylists || userPlaylists.length,
    restaurants: stats?.totalRestaurants || stats?.totalRestaurantsInPlaylists || userRestaurants.length,
    followers: profileData.followerCount || profileData.followers?.length || profileData.stats?.followers || 0,
    following: profileData.followingCount || profileData.following?.length || profileData.stats?.following || 0,
    likes: stats?.totalLikes || userPlaylists.reduce((total: number, list: any) => total + (list.likeCount || 0), 0)
  };

  // 가입일 포맷
  const joinDate = profileData.createdAt ? 
    new Date(profileData.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">프로필</h1>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 프로필 정보 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 프로필 이미지 */}
            <div className="flex justify-center md:justify-start">
              <img 
                src={profileData.profileImage || `https://ui-avatars.com/api/?name=${profileData.username}&background=FF6B35&color=fff`}
                alt={profileData.username}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{profileData.username}</h1>
                {profileData.isVerified && (
                  <CheckBadgeIcon className="w-6 h-6 text-blue-500" />
                )}
              </div>

              {profileData.bio && (
                <p className="text-gray-600 mb-3">{profileData.bio}</p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-4">
                {joinDate && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{joinDate} 가입</span>
                  </div>
                )}
                {profileData.location?.city && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{profileData.location.city} {profileData.location.district || ''}</span>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-center md:justify-start gap-3">
                {currentUser?.username !== username && (
                  <button 
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                    }`}
                  >
                    {isFollowing ? (
                      <><UserMinusIcon className="w-5 h-5 inline mr-1" /> 팔로잉</>
                    ) : (
                      <><UserPlusIcon className="w-5 h-5 inline mr-1" /> 팔로우</>
                    )}
                  </button>
                )}
                {currentUser?.username === username && (
                  <button
                    onClick={() => navigate('/settings')}
                    className="px-6 py-2 bg-gray-200 rounded-full font-medium hover:bg-gray-300 transition-colors"
                  >
                    프로필 편집
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="border-t border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around py-4">
              <div className="text-center">
                <div className="text-xl font-bold">{profileStats.lists}</div>
                <div className="text-sm text-gray-500">리스트</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{profileStats.restaurants}</div>
                <div className="text-sm text-gray-500">맛집</div>
              </div>
              <button
                onClick={() => navigate(`/expert/${username}/followers`)}
                className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              >
                <div className="text-xl font-bold">{profileStats.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-500">팔로워</div>
              </button>
              <button
                onClick={() => navigate(`/expert/${username}/following`)}
                className="text-center hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              >
                <div className="text-xl font-bold">{profileStats.following.toLocaleString()}</div>
                <div className="text-sm text-gray-500">팔로잉</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'lists'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              리스트
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'restaurants'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              맛집
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              저장됨
            </button>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userPlaylists.length > 0 ? userPlaylists.map((list) => (
              <motion.div
                key={list._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/playlist/${list._id}`)}
              >
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-t-lg overflow-hidden">
                  {list.restaurants?.[0]?.restaurant?.images?.[0] && (
                    <img 
                      src={list.restaurants[0].restaurant.images[0]} 
                      alt={list.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {list.restaurantCount || list.restaurants?.length || 0}개 맛집
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{list.title}</h3>
                  {list.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {list.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeList(list._id);
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        {likedLists.has(list._id) ? (
                          <HeartSolidIcon className="w-5 h-5 text-red-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                        <span className="text-sm">{list.likeCount || 0}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveList(list._id);
                        }}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        {savedLists.has(list._id) ? (
                          <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                          <BookmarkIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                아직 작성한 리스트가 없습니다
              </div>
            )}
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRestaurants.length > 0 ? userRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              >
                {restaurant.images?.[0] && (
                  <img 
                    src={restaurant.images[0]} 
                    alt={restaurant.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{restaurant.category}</p>
                  {restaurant.averageRating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{restaurant.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                아직 등록한 맛집이 없습니다
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedItems.length > 0 ? savedItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(item.restaurants ? `/playlist/${item._id}` : `/restaurant/${item._id}`)}
              >
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{item.title || item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description || item.category}</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                저장한 항목이 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;