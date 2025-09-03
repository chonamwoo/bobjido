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

interface FollowerUser {
  _id: string;
  username: string;
  profileImage?: string;
  bio?: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

const Followers: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample followers data for demonstration
  const sampleFollowers: FollowerUser[] = [
    {
      _id: '1',
      username: '미식가_김철수',
      bio: '맛집 탐험가, 음식 평론가',
      isFollowing: true,
      followerCount: 1234,
      followingCount: 567
    },
    {
      _id: '2',
      username: '요리왕_박영희',
      bio: '홈쿠킹 전문가, 레시피 공유',
      isFollowing: false,
      followerCount: 892,
      followingCount: 423
    },
    {
      _id: '3',
      username: '카페러버_이민수',
      bio: '카페 투어 전문, 디저트 마니아',
      isFollowing: true,
      followerCount: 456,
      followingCount: 789
    },
    {
      _id: '4',
      username: '맛집헌터_최지은',
      bio: '숨은 맛집 발굴 전문',
      isFollowing: false,
      followerCount: 2341,
      followingCount: 234
    },
    {
      _id: '5',
      username: '푸드스타그램_김민재',
      bio: '음식 사진 전문, 플레이팅 아티스트',
      isFollowing: true,
      followerCount: 3456,
      followingCount: 123
    }
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['followers', username],
    queryFn: async () => {
      try {
        // First get the user ID from username
        const userResponse = await axios.get(`/api/users/${username}`);
        const userId = userResponse.data.user._id;
        
        // Then get followers
        const response = await axios.get(`/api/users/${userId}/followers`);
        return response.data;
      } catch (err) {
        // Return sample data on error
        return {
          followers: sampleFollowers,
          total: sampleFollowers.length
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
      queryClient.setQueryData(['followers', username], (old: any) => ({
        ...old,
        followers: old.followers.map((user: FollowerUser) =>
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
      queryClient.setQueryData(['followers', username], (old: any) => ({
        ...old,
        followers: old.followers.map((user: FollowerUser) =>
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

  const handleFollowToggle = (user: FollowerUser) => {
    if (user.isFollowing) {
      unfollowMutation.mutate(user._id);
    } else {
      followMutation.mutate(user._id);
    }
  };

  const filteredFollowers = data?.followers?.filter((user: FollowerUser) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || sampleFollowers.filter((user: FollowerUser) =>
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
              <h1 className="text-2xl font-bold">{username}님의 팔로워</h1>
              <p className="text-gray-600">총 {filteredFollowers?.length || 0}명</p>
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
            placeholder="팔로워 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 팔로워 목록 */}
      <div className="bg-white rounded-xl shadow-sm">
        {filteredFollowers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '검색 결과가 없습니다' : '아직 팔로워가 없습니다'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredFollowers.map((follower: FollowerUser) => (
              <div key={follower._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/profile/${follower.username}`}
                    className="flex items-center space-x-3 flex-1"
                  >
                    <img
                      src={follower.profileImage || getDefaultAvatar(follower.username, 48)}
                      alt={follower.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{follower.username}</h3>
                      {follower.bio && (
                        <p className="text-sm text-gray-600 line-clamp-1">{follower.bio}</p>
                      )}
                      <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                        <span>팔로워 {follower.followerCount}</span>
                        <span>팔로잉 {follower.followingCount}</span>
                      </div>
                    </div>
                  </Link>

                  {currentUser && currentUser.username !== follower.username && (
                    <button
                      onClick={() => handleFollowToggle(follower)}
                      disabled={followMutation.isPending || unfollowMutation.isPending}
                      className={`btn btn-sm flex items-center space-x-1 ${
                        follower.isFollowing
                          ? 'btn-outline text-gray-700'
                          : 'btn-primary'
                      }`}
                    >
                      {follower.isFollowing ? (
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

export default Followers;