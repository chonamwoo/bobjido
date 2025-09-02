import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, BookmarkIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

interface PlaylistCardProps {
  playlist: {
    _id: string;
    title: string;
    description?: string;
    coverImage?: string;
    category: string;
    createdBy: {
      username: string;
      profileImage?: string;
    };
    restaurants: Array<any>;
    viewCount?: number;
    views?: {
      total?: number;
      weeklyViews?: number;
    };
    likes: Array<any>;
    saves: Array<any>;
    popularityScore?: number;
    trendingScore?: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onClick?: () => void;
}

const MobilePlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isLiked = false,
  isSaved = false,
  onLike,
  onSave,
  onClick
}) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '데이트코스': 'from-pink-500 to-red-500',
      '혼밥': 'from-blue-500 to-cyan-500',
      '가족모임': 'from-green-500 to-emerald-500',
      '친구모임': 'from-purple-500 to-indigo-500',
      '출장/여행': 'from-yellow-500 to-orange-500',
      '회식': 'from-gray-500 to-slate-500',
      '카페투어': 'from-amber-500 to-yellow-500',
      '맛집투어': 'from-red-500 to-orange-500',
      '기타': 'from-gray-400 to-gray-600'
    };
    return colors[category] || colors['기타'];
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // 실시간 조회수 (새로운 시스템)
  const realViewCount = playlist.views?.total || playlist.viewCount || 0;
  const weeklyViews = playlist.views?.weeklyViews || 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      {/* 커버 이미지 또는 그라데이션 */}
      <div className="relative h-32">
        {playlist.coverImage ? (
          <img
            src={playlist.coverImage}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(playlist.category)}`} />
        )}
        
        {/* 카테고리 태그 */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
            {playlist.category}
          </span>
        </div>

        {/* 트렌딩 뱃지 */}
        {playlist.trendingScore && playlist.trendingScore > 100 && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
              🔥 HOT
            </span>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 제목 및 설명 */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {playlist.title}
        </h3>
        {playlist.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {playlist.description}
          </p>
        )}

        {/* 생성자 정보 */}
        <div className="flex items-center mb-3">
          {playlist.createdBy.profileImage ? (
            <img
              src={playlist.createdBy.profileImage}
              alt={playlist.createdBy.username}
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
            </div>
          )}
          <span className="text-sm text-gray-600">{playlist.createdBy.username}</span>
          <span className="text-xs text-gray-400 ml-auto">
            {playlist.restaurants.length}개 맛집
          </span>
        </div>

        {/* 통계 및 액션 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            {/* 실시간 조회수 */}
            <div className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              <span>{formatCount(realViewCount)}</span>
              {weeklyViews > 0 && (
                <span className="text-xs text-green-600 ml-1">
                  +{formatCount(weeklyViews)}
                </span>
              )}
            </div>
            
            {/* 좋아요 수 */}
            <div className="flex items-center">
              <HeartIcon className="w-4 h-4 mr-1" />
              <span>{formatCount(playlist.likes.length)}</span>
            </div>
            
            {/* 저장 수 */}
            <div className="flex items-center">
              <BookmarkIcon className="w-4 h-4 mr-1" />
              <span>{formatCount(playlist.saves.length)}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isLiked ? (
                <HeartSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSaved ? (
                <BookmarkSolid className="w-5 h-5 text-orange-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* 인기도 스코어 바 (선택적 표시) */}
        {playlist.popularityScore && playlist.popularityScore > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>인기도</span>
              <span>{Math.round(playlist.popularityScore)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min((playlist.popularityScore / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobilePlaylistCard;