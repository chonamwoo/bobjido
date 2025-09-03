import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { 
  UserPlusIcon,
  UserMinusIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';

interface FollowingUser {
  _id: string;
  username: string;
  profileImage?: string;
  bio?: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

const Following: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample following data for demonstration
  const sampleFollowing: FollowingUser[] = [
    {
      _id: '1',
      username: '흑백요리사_정지선',
      bio: '흑백요리사 우승자, 중식 레스토랑 셔프',
      isFollowing: true,
      followerCount: 15234,
      followingCount: 234
    },
    {
      _id: '2',
      username: '백종원_세계요리',
      bio: '백종원 요리비책 저자',
      isFollowing: true,
      followerCount: 23456,
      followingCount: 432
    },
    {
      _id: '3',
      username: '수요미식회_공식',
      bio: '수요미식회 공식 계정',
      isFollowing: true,
      followerCount: 34567,
      followingCount: 123
    },
    {
      _id: '4',
      username: '맛탐정_홍석천',
      bio: '전국 맛집 탐방, 히든짱 발굴',
      isFollowing: true,
      followerCount: 8901,
      followingCount: 567
    },
    {
      _id: '5',
      username: '브런치카페_김소현',
      bio: '브런치와 카페를 사랑하는 푸디',
      isFollowing: true,
      followerCount: 4567,
      followingCount: 890
    },
    {
      _id: '6',
      username: '미슐랭_가이드',
      bio: '미슐랭 레스토랑 전문 평론가',
      isFollowing: true,
      followerCount: 12345,
      followingCount: 45
    }
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['following', username],
    queryFn: async () => {
      try {
        // First get the user ID from username
        const userResponse = await axios.get(`/api/users/${username}`);
        const userId = userResponse.data.user._id;
        
        // Then get following
        const response = await axios.get(`/api/users/${userId}/following`);
        return response.data;
      } catch (err) {
        // Return sample data on error
        return {
          following: sampleFollowing,
          total: sampleFollowing.length
        };
      }
    },
    enabled: !!username,
  });

  const followMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await axios.post(`/api/users/${targetUserId}/follow`);
      return { ...response.data, targetUserId };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['following', username], (old: any) => ({
        ...old,
        following: old.following.map((user: FollowingUser) =>
          user._id === data.targetUserId
            ? { ...user, isFollowing: true, followerCount: user.followerCount + 1 }
            : user
        ),
      }));
      toast.success('팔로우했습니다');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '팔로우에 실패했습니다');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await axios.delete(`/api/users/${targetUserId}/unfollow`);
      return { ...response.data, targetUserId };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['following', username], (old: any) => ({
        ...old,
        following: old.following.map((user: FollowingUser) =>
          user._id === data.targetUserId
            ? { ...user, isFollowing: false, followerCount: Math.max(0, user.followerCount - 1) }
            : user
        ),
      }));
      toast.success('언팔로우했습니다');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '언팔로우에 실패했습니다');
    },
  });

  const handleFollowToggle = (user: FollowingUser) => {
    if (user.isFollowing) {
      unfollowMutation.mutate(user._id);
    } else {
      followMutation.mutate(user._id);
    }
  };

  const filteredFollowing = data?.following?.filter((user: FollowingUser) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || sampleFollowing.filter((user: FollowingUser) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/profile/${username}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{username}님이 팔로우하는 사람</h1>
              <p className="text-gray-600">총 {filteredFollowing?.length || 0}명</p>
            </div>
          </div>
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="팔로잉 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 팔로잉 목록 */}
      <div className="bg-white rounded-xl shadow-sm">
        {filteredFollowing.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '검색 결과가 없습니다' : '아직 팔로우하는 사람이 없습니다'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredFollowing.map((followingUser: FollowingUser) => (
              <div key={followingUser._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/profile/${followingUser.username}`}
                    className="flex items-center space-x-3 flex-1"
                  >
                    <img
                      src={followingUser.profileImage || getDefaultAvatar(followingUser.username, 48)}
                      alt={followingUser.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{followingUser.username}</h3>
                      {followingUser.bio && (
                        <p className="text-sm text-gray-600 line-clamp-1">{followingUser.bio}</p>
                      )}
                      <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                        <span>팔로워 {followingUser.followerCount}</span>
                        <span>팔로잉 {followingUser.followingCount}</span>
                      </div>
                    </div>
                  </Link>

                  {currentUser && currentUser.username !== followingUser.username && (
                    <button
                      onClick={() => handleFollowToggle(followingUser)}
                      disabled={followMutation.isPending || unfollowMutation.isPending}
                      className={`btn btn-sm flex items-center space-x-1 ${
                        followingUser.isFollowing
                          ? 'btn-outline text-gray-700'
                          : 'btn-primary'
                      }`}
                    >
                      {followingUser.isFollowing ? (
                        <>
                          <UserMinusIcon className="w-4 h-4" />
                          <span>언팔로우</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-4 h-4" />
                          <span>팔로우</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;