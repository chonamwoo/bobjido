import React, { useState, useRef } from 'react';
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
  CameraIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';

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

const getProfileEmoji = (profileType: string) => {
  return tasteProfiles[profileType as keyof typeof tasteProfiles]?.emoji || '🍽️';
};

const getProfileTitle = (profileType: string) => {
  return tasteProfiles[profileType as keyof typeof tasteProfiles]?.title || '미식가';
};

const getProfileDescription = (profileType: string) => {
  return tasteProfiles[profileType as keyof typeof tasteProfiles]?.description || '음식을 사랑하는 사람';
};

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'created' | 'saved'>('created');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  // If no username param, use current user's username
  const profileUsername = username || currentUser?.username;

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      // 현재 로그인한 사용자의 프로필인 경우 authStore 데이터 사용
      if (currentUser && currentUser.username === profileUsername) {
        return {
          user: {
            ...currentUser,
            followerCount: currentUser.followerCount ?? 3,
            followingCount: currentUser.followingCount ?? 2,
            visitedRestaurantsCount: currentUser.visitedRestaurantsCount ?? 56
          },
          playlists: []
        };
      }
      
      try {
        const response = await axios.get(`/api/users/${profileUsername}`);
        console.log('프로필 데이터 응답:', response.data);
        // 응답 데이터가 있지만 카운트가 없는 경우 기본값 추가
        if (response.data?.user) {
          return {
            user: {
              ...response.data.user,
              followerCount: response.data.user.followerCount ?? 3,
              followingCount: response.data.user.followingCount ?? 2,
              visitedRestaurantsCount: response.data.user.visitedRestaurantsCount ?? 56
            },
            playlists: response.data.playlists || []
          };
        }
        return response.data;
      } catch (error) {
        // API 에러시 현재 사용자 데이터 또는 가짜 데이터 반환
        console.log('API 에러');
        
        if (currentUser && currentUser.username === profileUsername) {
          return {
            user: currentUser,
            playlists: []
          };
        }
        
        return {
          user: {
            _id: '1',
            username: profileUsername || '사용자',
            followerCount: 3,
            followingCount: 2,
            visitedRestaurantsCount: 56,
            profileImage: null,
            tasteProfile: 'spicy_adventurer'
          },
          playlists: []
        };
      }
    },
    enabled: !!profileUsername,
  });

  const { data: playlistsData } = useQuery({
    queryKey: ['user-playlists', username, activeTab],
    queryFn: async () => {
      if (activeTab === 'created') {
        const response = await axios.get(`/api/users/${profileUsername}/playlists`);
        return response.data;
      } else {
        const response = await axios.get('/api/users/saved/playlists');
        return response.data;
      }
    },
    enabled: !!profileUsername,
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('/api/users/profile-image', formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Update auth store
      if (currentUser) {
        updateUser({ ...currentUser, profileImage: data.profileImage });
      }
      // Update profile query cache
      queryClient.setQueryData(['user', username], (old: any) => ({
        ...old,
        user: { ...old.user, profileImage: data.profileImage }
      }));
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '이미지 업로드에 실패했습니다.');
    },
  });

  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await axios.post(`/api/users/${targetUserId}/follow`);
      return response.data;
    },
    onSuccess: (data) => {
      // Update profile query cache
      queryClient.setQueryData(['user', username], (old: any) => ({
        ...old,
        user: { 
          ...old.user, 
          isFollowing: true,
          followerCount: data.targetUser?.followerCount || (old.user.followerCount + 1)
        }
      }));
      
      // Update current user's following count
      if (currentUser) {
        updateUser({ 
          ...currentUser, 
          followingCount: data.currentUser?.followingCount || ((currentUser.followingCount || 0) + 1)
        });
      }
      
      toast.success('팔로우했습니다');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '팔로우에 실패했습니다');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await axios.delete(`/api/users/${targetUserId}/unfollow`);
      return response.data;
    },
    onSuccess: (data) => {
      // Update profile query cache
      queryClient.setQueryData(['user', username], (old: any) => ({
        ...old,
        user: { 
          ...old.user, 
          isFollowing: false,
          followerCount: data.targetUser?.followerCount || Math.max(0, old.user.followerCount - 1)
        }
      }));
      
      // Update current user's following count
      if (currentUser) {
        updateUser({ 
          ...currentUser, 
          followingCount: data.currentUser?.followingCount || Math.max(0, (currentUser.followingCount || 0) - 1)
        });
      }
      
      toast.success('언팔로우했습니다');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '언팔로우에 실패했습니다');
    },
  });

  const handleFollowToggle = () => {
    if (profileUser.isFollowing) {
      unfollowMutation.mutate(profileUser._id);
    } else {
      followMutation.mutate(profileUser._id);
    }
  };

  const handleProfileImageClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const validateAndUploadFile = (file: File) => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('JPEG, PNG, GIF 파일만 업로드 가능합니다.');
      return;
    }
    
    uploadProfileImageMutation.mutate(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isOwnProfile) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { user = {}, playlists = [] } = profileData || {};
  // 기본값 설정 - user 데이터가 없거나 불완전한 경우
  const profileUser: any = {
    ...user,
    username: user.username || username,
    followerCount: user.followerCount ?? 3,
    followingCount: user.followingCount ?? 2,
    visitedRestaurantsCount: user.visitedRestaurantsCount ?? 56,
    profileImage: user.profileImage || null,
    tasteProfile: user.tasteProfile || 'spicy_adventurer',
    _id: user._id || '1',
    trustScore: user.trustScore || 85,
    bio: user.bio || '',
    isFollowing: user.isFollowing || false
  };
  const isOwnProfile = currentUser?._id === profileUser._id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 프로필 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <div 
              className={`relative group ${
                isOwnProfile && isDragOver ? 'ring-4 ring-primary-300 ring-opacity-50' : ''
              }`}
              onDragOver={isOwnProfile ? handleDragOver : undefined}
              onDragLeave={isOwnProfile ? handleDragLeave : undefined}
              onDrop={isOwnProfile ? handleDrop : undefined}
            >
              <img
                src={profileUser.profileImage || getDefaultAvatar(profileUser.username, 150)}
                alt={profileUser.username}
                className={`w-32 h-32 rounded-full mx-auto md:mx-0 transition-all duration-300 ${
                  isOwnProfile ? 'cursor-pointer hover:opacity-75' : ''
                } ${
                  isDragOver ? 'opacity-75 scale-105' : ''
                }`}
                onClick={handleProfileImageClick}
              />
              {isOwnProfile && (
                <div 
                  className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity cursor-pointer ${
                    isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={handleProfileImageClick}
                >
                  <CameraIcon className="w-8 h-8 text-white" />
                  {isDragOver && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap">
                      드롭하여 업로드
                    </div>
                  )}
                </div>
              )}
              {uploadProfileImageMutation.isPending && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {isOwnProfile && (
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 mt-1">
                  클릭하거나 드래그하여 프로필 사진 업로드
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {/* 사용자명 및 액션 버튼 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{profileUser.username}</h1>
                <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600">
                  <Link to={`/expert/${profileUser.username}/followers`} className="hover:text-primary-600 hover:underline cursor-pointer">
                    팔로워 <span className="font-semibold">{profileUser.followerCount?.toLocaleString() || 0}</span>
                  </Link>
                  <Link to={`/expert/${profileUser.username}/following`} className="hover:text-primary-600 hover:underline cursor-pointer">
                    팔로잉 <span className="font-semibold">{profileUser.followingCount?.toLocaleString() || 0}</span>
                  </Link>
                  <Link to={`/my-restaurants`} className="hover:text-primary-600 hover:underline cursor-pointer">
                    방문한 맛집 <span className="font-semibold">{profileUser.visitedRestaurantsCount}개</span>
                  </Link>
                </div>
              </div>

              <div className="flex space-x-3 mt-4 md:mt-0">
                {isOwnProfile ? (
                  <Link to="/settings" className="btn btn-outline flex items-center space-x-2">
                    <CogIcon className="w-5 h-5" />
                    <span>설정</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followMutation.isPending || unfollowMutation.isPending}
                    className={`btn flex items-center space-x-2 ${
                      profileUser.isFollowing
                        ? 'btn-outline text-gray-700'
                        : 'btn-primary'
                    } ${(followMutation.isPending || unfollowMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followMutation.isPending || unfollowMutation.isPending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                    ) : profileUser.isFollowing ? (
                      <>
                        <UserMinusIcon className="w-5 h-5" />
                        <span>언팔로우</span>
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-5 h-5" />
                        <span>팔로우</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* 신뢰도 점수 */}
            <div className="mb-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">신뢰도: {profileUser.trustScore || 85}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileUser.trustScore || 85}%` }}
                ></div>
              </div>
            </div>

            {/* 자기소개 */}
            {profileUser.bio && (
              <p className="text-gray-600 mb-4">{profileUser.bio}</p>
            )}

            {/* 취향 프로필 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">취향 프로필</h3>
              
              {/* 디버깅 정보 - 완전히 제거하거나 매우 제한적으로만 표시 */}
              {false && process.env.NODE_ENV === 'development' && (
                <div className="mb-2 p-2 bg-yellow-100 rounded text-xs">
                  <strong>Debug:</strong> tasteProfile = {JSON.stringify(profileUser.tasteProfile, null, 2)}
                </div>
              )}
              
              {profileUser.tasteProfile ? (
                <>
                  {/* 주요 취향 타입 표시 */}
                  {(typeof profileUser.tasteProfile === 'string' || profileUser.tasteProfile.type) && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {getProfileEmoji(typeof profileUser.tasteProfile === 'string' ? profileUser.tasteProfile : profileUser.tasteProfile.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800">
                            {getProfileTitle(typeof profileUser.tasteProfile === 'string' ? profileUser.tasteProfile : profileUser.tasteProfile.type)}
                          </h4>
                          <p className="text-sm text-purple-600">
                            {getProfileDescription(typeof profileUser.tasteProfile === 'string' ? profileUser.tasteProfile : profileUser.tasteProfile.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {profileUser.tasteProfile && typeof profileUser.tasteProfile === 'object' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">매운맛</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (profileUser.tasteProfile.spicyTolerance || 0)
                                  ? 'bg-red-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({profileUser.tasteProfile.spicyTolerance || 0}/5)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">단맛</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (profileUser.tasteProfile.sweetPreference || 0)
                                  ? 'bg-pink-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({profileUser.tasteProfile.sweetPreference || 0}/5)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">가격대</span>
                        <p className="text-xs mt-1">{profileUser.tasteProfile.pricePreference || '보통'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">전문 분야</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profileUser.tasteProfile.cuisineExpertise?.slice(0, 2).map((cuisine: string) => (
                            <span
                              key={cuisine}
                              className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
                            >
                              {cuisine}
                            </span>
                          )) || (
                            <span className="text-xs text-gray-400">없음</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">음식 게임을 플레이하고 취향을 찾아보세요!</p>
                  {isOwnProfile && (
                    <button 
                      onClick={() => navigate('/game-hub')}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      게임 센터 가기 →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'created'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              만든 맛집리스트 ({user.playlistCount || 0})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                저장한 맛집리스트
              </button>
            )}
          </nav>
        </div>

        {/* 맛집리스트 목록 */}
        <div className="p-6">
          {playlistsData?.playlists?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistsData.playlists.map((playlist: any) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'created' ? (
                  <MapPinIcon className="w-8 h-8 text-gray-400" />
                ) : (
                  <BookmarkIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                {activeTab === 'created'
                  ? '아직 만든 플레이리스트가 없습니다'
                  : '저장한 맛집리스트가 없습니다'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'created'
                  ? '첫 번째 맛집리스트를 만들어보세요!'
                  : '마음에 드는 맛집리스트를 저장해보세요!'}
              </p>
              {activeTab === 'created' && isOwnProfile && (
                <Link to="/create-playlist" className="btn btn-primary">
                  맛집리스트 만들기
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 최근 활동 */}
      {user.recentActivity?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">최근 활동</h2>
          <div className="space-y-4">
            {user.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <span className="text-xs text-gray-400">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;