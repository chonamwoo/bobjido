import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserAvatar } from '../utils/userAvatars';
import { useAuthStore } from '../store/authStore';
import {
  UserPlusIcon,
  UserMinusIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowLeftIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface User {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
  tasteProfile: string;
  matchPercentage: number;
  restaurantCount: number;
  rating: number;
  isFollowing: boolean;
  isMutual?: boolean;
  location?: string;
}

const FollowManagement: React.FC = () => {
  const { username, type } = useParams<{ username: string; type: 'followers' | 'following' }>();
  const navigate = useNavigate();
  const { user: currentUser, incrementFollowing, decrementFollowing } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'matched'>(type || 'followers');
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  // 샘플 데이터
  const followers: User[] = [
    {
      id: '1',
      username: '김미식',
      avatar: getUserAvatar('김미식'),
      bio: '이태원의 숨은 맛집을 찾아다니는 미식가입니다',
      tasteProfile: '모험적인 미식가',
      matchPercentage: 92,
      restaurantCount: 127,
      rating: 4.8,
      isFollowing: true,
      isMutual: true,
      location: '이태원'
    },
    {
      id: '2',
      username: '이구르메',
      avatar: getUserAvatar('이구르메'),
      bio: '성수동 카페 투어 전문가',
      tasteProfile: '트렌디한 카페러버',
      matchPercentage: 88,
      restaurantCount: 89,
      rating: 4.6,
      isFollowing: false,
      location: '성수동'
    },
    {
      id: '3',
      username: '박요리',
      avatar: getUserAvatar('박요리'),
      bio: '강남의 파인다이닝 전문가',
      tasteProfile: '고급 미식가',
      matchPercentage: 85,
      restaurantCount: 156,
      rating: 4.9,
      isFollowing: true,
      isMutual: true,
      location: '강남'
    }
  ];

  const following: User[] = [
    {
      id: '4',
      username: '최맛집',
      avatar: getUserAvatar('최맛집'),
      bio: '홍대 술집 탐험가',
      tasteProfile: '캐주얼 미식가',
      matchPercentage: 79,
      restaurantCount: 98,
      rating: 4.5,
      isFollowing: true,
      location: '홍대'
    },
    {
      id: '5',
      username: '정미슐랭',
      avatar: getUserAvatar('정미슐랭'),
      bio: '미슐랭 맛집만 다니는 진짜 미식가',
      tasteProfile: '프리미엄 다이너',
      matchPercentage: 93,
      restaurantCount: 203,
      rating: 4.9,
      isFollowing: true,
      location: '청담동'
    }
  ];

  // 매칭된 친구들 (상호 팔로우 + 높은 매칭률)
  const matchedFriends = [...followers, ...following].filter(
    user => user.isMutual && user.matchPercentage >= 85
  );

  const handleFollow = (userId: string, isCurrentlyFollowing: boolean) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        // authStore 업데이트 - 언팔로우
        if (currentUser?.username === username) {
          decrementFollowing();
        }
      } else {
        newSet.add(userId);
        // authStore 업데이트 - 팔로우
        if (currentUser?.username === username) {
          incrementFollowing();
        }
      }
      return newSet;
    });
  };

  const getDisplayUsers = () => {
    switch(activeTab) {
      case 'followers':
        return followers;
      case 'following':
        return following;
      case 'matched':
        return matchedFriends;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/profile/${username}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">프로필로 돌아가기</span>
          </button>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {username}님의 연결
          </h1>
          <p className="text-gray-700 font-medium">
            팔로워, 팔로잉, 그리고 매칭된 친구들을 관리하세요
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('followers')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'followers'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-blue-200'
            }`}
          >
            <UserMinusIcon className="w-5 h-5" />
            팔로워
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {currentUser?.username === username ? (currentUser?.followerCount || followers.length) : followers.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('following')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'following'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-green-50 border-2 border-green-200'
            }`}
          >
            <UserPlusIcon className="w-5 h-5" />
            팔로잉
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {currentUser?.username === username ? (currentUser?.followingCount || following.length) : following.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('matched')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'matched'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-50 border-2 border-pink-200'
            }`}
          >
            <SparklesIcon className="w-5 h-5" />
            매칭 친구
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {matchedFriends.length}
            </span>
          </button>
        </div>

        {/* 사용자 리스트 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayUsers().map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
            >
              <div className="p-6">
                {/* 프로필 정보 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{user.username}</h3>
                      <p className="text-xs font-medium text-orange-600">{user.tasteProfile}</p>
                      {user.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPinIcon className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 상호 팔로우 표시 */}
                  {user.isMutual && (
                    <span className="px-2 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      맞팔
                    </span>
                  )}
                </div>

                {/* 바이오 */}
                {user.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {user.bio}
                  </p>
                )}

                {/* 통계 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <BuildingStorefrontIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-900">{user.restaurantCount}</span>
                    </div>
                    <span className="text-xs text-gray-500">맛집</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{user.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">평점</span>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {user.matchPercentage}%
                    </div>
                    <span className="text-xs text-gray-500">매칭</span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  {activeTab === 'followers' && !user.isFollowing ? (
                    <button
                      onClick={() => handleFollow(user.id, user.isFollowing || followedUsers.has(user.id))}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all"
                    >
                      <UserPlusIcon className="w-4 h-4 inline mr-1" />
                      맞팔하기
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user.id, user.isFollowing || followedUsers.has(user.id))}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        user.isFollowing || followedUsers.has(user.id)
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {user.isFollowing || followedUsers.has(user.id) ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                          팔로잉
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-4 h-4 inline mr-1" />
                          팔로우
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="px-4 py-2 bg-white text-orange-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors text-sm font-bold"
                  >
                    프로필
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {getDisplayUsers().length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <UserPlusIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'followers' && '아직 팔로워가 없어요'}
              {activeTab === 'following' && '아직 팔로잉하는 사람이 없어요'}
              {activeTab === 'matched' && '매칭된 친구가 없어요'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'followers' && '다른 사람들과 소통하며 팔로워를 늘려보세요!'}
              {activeTab === 'following' && '취향이 맞는 사람들을 팔로우해보세요!'}
              {activeTab === 'matched' && '서로 팔로우하고 취향이 맞는 친구를 만나보세요!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowManagement;