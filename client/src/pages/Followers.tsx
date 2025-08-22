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

  const { data, isLoading } = useQuery({
    queryKey: ['followers', username],
    queryFn: async () => {
      // First get the user ID from username
      const userResponse = await axios.get(`/api/users/${username}`);
      const userId = userResponse.data.user._id;
      
      // Then get followers
      const response = await axios.get(`/api/users/${userId}/followers`);
      return response.data;
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
  ) || [];

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
              <p className="text-gray-600">총 {data?.total || 0}명</p>
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