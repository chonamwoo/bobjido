import React, { useState, useEffect } from 'react';
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
import { useSocialStore } from '../store/socialStore';
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
  const {
    followers,
    followerDetails,
    followUser,
    unfollowUser,
    isFollowing,
    syncWithLocalStorage
  } = useSocialStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    syncWithLocalStorage();
  }, []);

  // Convert socialStore data to FollowerUser format
  const followersData = followerDetails.map(user => ({
    ...user,
    isFollowing: isFollowing(user._id),
    followerCount: user.followerCount || Math.floor(Math.random() * 100),
    followingCount: user.followingCount || Math.floor(Math.random() * 50)
  }));

  const handleFollowToggle = (user: FollowerUser) => {
    if (isFollowing(user._id)) {
      unfollowUser(user._id);
    } else {
      followUser(user._id, user);
    }
  };

  const filteredFollowers = followersData.filter((user: FollowerUser) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(username ? `/profile/${username}` : '/profile')}
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
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="팔로워 검색..."
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                        isFollowing(follower._id)
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md'
                      }`}
                    >
                      {isFollowing(follower._id) ? (
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