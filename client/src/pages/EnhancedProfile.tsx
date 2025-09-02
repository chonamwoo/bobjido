import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  UserPlusIcon,
  UserMinusIcon,
  BellIcon,
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  FireIcon,
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  BeakerIcon,
  ChevronRightIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import KoreanMap from '../components/KoreanMap';

// 취향 프로필 정보
const tasteProfiles = {
  spicy_adventurer: { 
    title: '매콤한 모험가', 
    emoji: '🌶️',
    icon: FireIcon,
    color: 'from-red-500 to-orange-500',
    description: '매운 음식과 새로운 맛에 도전하는 용감한 미식가'
  },
  trendy_explorer: { 
    title: '힙스터 탐험가', 
    emoji: '✨',
    icon: SparklesIcon,
    color: 'from-purple-500 to-pink-500',
    description: '트렌디한 장소에서 SNS 속 맛집을 찾아다니는 타입'
  },
  comfort_lover: { 
    title: '편안함 추구자', 
    emoji: '🏠',
    icon: HomeIcon,
    color: 'from-green-500 to-teal-500',
    description: '익숙하고 편안한 음식, 아늑한 분위기를 좋아하는 타입'
  },
  social_foodie: { 
    title: '소셜 푸디', 
    emoji: '👥',
    icon: UsersIcon,
    color: 'from-blue-500 to-cyan-500',
    description: '친구, 가족과 함께하는 식사의 즐거움을 아는 타입'
  },
  budget_gourmet: { 
    title: '가성비 구르메', 
    emoji: '💰',
    icon: CurrencyDollarIcon,
    color: 'from-yellow-500 to-orange-500',
    description: '합리적인 가격으로 맛있는 음식을 찾는 똑똑한 타입'
  },
  premium_diner: { 
    title: '프리미엄 다이너', 
    emoji: '💎',
    icon: SparklesIcon,
    color: 'from-purple-600 to-indigo-600',
    description: '품질 좋은 음식과 고급스러운 경험을 중시하는 타입'
  },
  solo_explorer: { 
    title: '혼밥 탐험가', 
    emoji: '🧘‍♀️',
    icon: GlobeAltIcon,
    color: 'from-indigo-500 to-purple-500',
    description: '혼자만의 시간을 즐기며 맛집을 탐험하는 독립적인 타입'
  },
  traditional_taste: { 
    title: '전통 미식가', 
    emoji: '🍚',
    icon: BeakerIcon,
    color: 'from-amber-600 to-yellow-600',
    description: '한식과 전통적인 맛을 사랑하는 클래식한 타입'
  }
};

interface ProfileData {
  user: any;
  playlists: any[];
  isFollowing?: boolean;
}

const EnhancedProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'playlists' | 'restaurants' | 'stats'>('playlists');
  const [showNotifications, setShowNotifications] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  // 프로필 데이터 조회
  const { data: profileData, isLoading } = useQuery<ProfileData>({
    queryKey: ['profile', username],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${username}/profile`
      );
      return response.data;
    },
    enabled: !!username
  });

  // 팔로우 상태 확인
  const { data: followStatus } = useQuery({
    queryKey: ['follow-status', profileData?.user?._id],
    queryFn: async () => {
      if (!profileData?.user?._id || isOwnProfile) return null;
      const response = await axios.get(`/api/follow/${profileData.user._id}/status`);
      return response.data;
    },
    enabled: !!profileData?.user?._id && !isOwnProfile
  });

  // 팔로우/언팔로우
  const followMutation = useMutation({
    mutationFn: async () => {
      if (followStatus?.isFollowing) {
        return await axios.delete(`/api/follow/${profileData?.user._id}/unfollow`);
      } else {
        return await axios.post(`/api/follow/${profileData?.user._id}/follow`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(followStatus?.isFollowing ? '언팔로우했습니다' : '팔로우했습니다');
    }
  });

  // 알림 조회
  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/api/notifications');
      return response.data;
    },
    enabled: isOwnProfile && showNotifications
  });

  // 알림 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await axios.put(`/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      refetchNotifications();
    }
  });

  const profile = tasteProfiles[profileData?.user?.tasteProfile?.type as keyof typeof tasteProfiles] || tasteProfiles.spicy_adventurer;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        {/* 그라데이션 배경 */}
        <div className={`h-32 bg-gradient-to-r ${profile.color}`}></div>
        
        <div className="px-8 pb-8">
          <div className="flex items-start justify-between -mt-16">
            {/* 프로필 이미지 & 정보 */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <img
                  src={profileData?.user?.profileImage || `https://ui-avatars.com/api/?name=${username}&background=random`}
                  alt={username}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r ${profile.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-xl">{profile.emoji}</span>
                </div>
              </div>
              
              <div className="mt-20">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {username}
                  {followStatus?.isMutual && (
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      맞팔로우
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <profile.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-medium text-gray-600">{profile.title}</span>
                </div>
                <p className="text-gray-500 mt-1">{profile.description}</p>
                
                {/* 통계 */}
                <div className="flex items-center gap-6 mt-4">
                  <Link to={`/profile/${username}/followers`} className="hover:text-primary-500">
                    <span className="font-bold text-xl">{profileData?.user?.followerCount || 0}</span>
                    <span className="text-gray-500 ml-1">팔로워</span>
                  </Link>
                  <Link to={`/profile/${username}/following`} className="hover:text-primary-500">
                    <span className="font-bold text-xl">{profileData?.user?.followingCount || 0}</span>
                    <span className="text-gray-500 ml-1">팔로잉</span>
                  </Link>
                  <div>
                    <span className="font-bold text-xl">{profileData?.playlists?.length || 0}</span>
                    <span className="text-gray-500 ml-1">플레이리스트</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-3 mt-20">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {notifications?.unreadCount > 0 ? (
                      <>
                        <BellSolidIcon className="w-6 h-6 text-primary-500" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.unreadCount}
                        </span>
                      </>
                    ) : (
                      <BellIcon className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <CogIcon className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    followStatus?.isFollowing
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {followStatus?.isFollowing ? (
                    <>
                      <UserMinusIcon className="w-5 h-5" />
                      언팔로우
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" />
                      팔로우
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 알림 패널 */}
      {isOwnProfile && showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-bold mb-4">알림</h3>
          {notifications?.notifications?.length > 0 ? (
            <div className="space-y-3">
              {notifications.notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-lg flex items-start justify-between ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={notification.sender?.profileImage || `https://ui-avatars.com/api/?name=${notification.sender?.username}`}
                      alt={notification.sender?.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification._id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      읽음
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">새로운 알림이 없습니다</p>
          )}
        </motion.div>
      )}

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'playlists'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            맛집리스트
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'restaurants'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            방문한 맛집
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            취향 분석
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData?.playlists?.map((playlist: any) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="block bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 relative">
                    {playlist.restaurants?.length > 0 && (
                      <KoreanMap
                        restaurants={playlist.restaurants}
                        className="w-full h-full"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-lg">{playlist.title}</h3>
                      <p className="text-sm opacity-90">
                        {playlist.restaurants?.length || 0}개 맛집
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {playlist.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          {playlist.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookmarkIcon className="w-4 h-4" />
                          {playlist.saveCount || 0}
                        </span>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="text-center py-8 text-gray-500">
              방문한 맛집 기능은 준비 중입니다
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* 취향 통계 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 rounded-lg">
                  <FireIcon className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-2xl font-bold">87</p>
                  <p className="text-sm text-gray-600">매운맛 지수</p>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
                  <UsersIcon className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold">124</p>
                  <p className="text-sm text-gray-600">모임 장소</p>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                  <HomeIcon className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-gray-600">혼밥 맛집</p>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                  <SparklesIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <p className="text-2xl font-bold">43</p>
                  <p className="text-sm text-gray-600">SNS 핫플</p>
                </div>
              </div>

              {/* 취향 매칭률 섹션 */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">🎯 취향이 비슷한 사용자</h3>
                  <span className="text-sm text-gray-500">AI 기반 매칭</span>
                </div>
                <div className="space-y-3">
                  {[
                    { 
                      rank: 1, 
                      username: 'seoul_foodie', 
                      name: '서울푸디',
                      match: 94,
                      tags: ['한식', '매운맛', '혼밥'],
                      followers: 12834,
                      area: '강남',
                      gradient: 'FF6B6B'
                    },
                    { 
                      rank: 2, 
                      username: 'spicy_queen', 
                      name: '매운맛여왕',
                      match: 89,
                      tags: ['중식', '매운맛', '마라'],
                      followers: 8956,
                      area: '홍대',
                      gradient: '4ECDC4'
                    },
                    { 
                      rank: 3, 
                      username: 'hansik_lover', 
                      name: '한식러버',
                      match: 85,
                      tags: ['한식', '전통', '노포'],
                      followers: 6234,
                      area: '종로',
                      gradient: '95E1D3'
                    },
                    { 
                      rank: 4, 
                      username: 'cafe_hunter', 
                      name: '카페헌터',
                      match: 82,
                      tags: ['카페', '브런치', '디저트'],
                      followers: 15432,
                      area: '성수',
                      gradient: 'F38181'
                    },
                    { 
                      rank: 5, 
                      username: 'meat_master', 
                      name: '고기마스터',
                      match: 78,
                      tags: ['고기', 'BBQ', '삼겹살'],
                      followers: 9871,
                      area: '마포',
                      gradient: 'AA96DA'
                    },
                    { 
                      rank: 6, 
                      username: 'dessert_fairy', 
                      name: '디저트요정',
                      match: 76,
                      tags: ['디저트', '베이커리', '마카롱'],
                      followers: 7654,
                      area: '연남',
                      gradient: 'FCBAD3'
                    },
                    { 
                      rank: 7, 
                      username: 'ramen_otaku', 
                      name: '라멘오타쿠',
                      match: 73,
                      tags: ['일식', '라멘', '돈카츠'],
                      followers: 5432,
                      area: '명동',
                      gradient: 'FDCB6E'
                    },
                    { 
                      rank: 8, 
                      username: 'street_food', 
                      name: '길거리맛집',
                      match: 71,
                      tags: ['분식', '길거리', '시장'],
                      followers: 3210,
                      area: '남대문',
                      gradient: '6C5CE7'
                    }
                  ].map((user) => (
                    <div 
                      key={user.rank} 
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/expert/${user.username}`)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${user.rank <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {user.rank <= 3 ? '🏆' : ''}{user.rank}
                        </span>
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.gradient}&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-gray-500">@{user.username}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{user.area}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{user.followers.toLocaleString()} 팔로워</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          user.match >= 90 ? 'text-red-500' : 
                          user.match >= 80 ? 'text-orange-500' : 
                          user.match >= 70 ? 'text-yellow-500' : 
                          'text-gray-500'
                        }`}>
                          {user.match}%
                        </div>
                        <div className="flex gap-1 mt-1">
                          {user.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  더 많은 매칭 보기
                </button>
              </div>

              {/* 취향 분석 차트 */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">📊 나의 취향 분석</h3>
                <div className="space-y-4">
                  {[
                    { label: '한식', value: 85, color: 'bg-red-500' },
                    { label: '중식', value: 72, color: 'bg-yellow-500' },
                    { label: '일식', value: 68, color: 'bg-blue-500' },
                    { label: '양식', value: 45, color: 'bg-green-500' },
                    { label: '카페', value: 92, color: 'bg-purple-500' }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;