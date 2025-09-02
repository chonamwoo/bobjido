import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, BookmarkIcon, MapPinIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getDefaultAvatar } from '../utils/avatars';
import { getPlaylistCoverImage, getPlaylistGradient, handleImageError } from '../utils/imageUtils';
import toast from 'react-hot-toast';

interface PlaylistCardProps {
  playlist: {
    _id: string;
    title: string;
    description: string;
    coverImage?: string;
    createdBy: {
      _id: string;
      username: string;
      profileImage?: string;
    };
    restaurants: Array<{
      restaurant: {
        _id: string;
        name: string;
        images?: string[];
      };
    }>;
    category: string;
    tags: string[];
    likeCount: number;
    saveCount: number;
    viewCount: number;
    createdAt: string;
    isLiked?: boolean;
    isSaved?: boolean;
  };
  horizontal?: boolean; // 가로 레이아웃 옵션 추가
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, horizontal = false }) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement like functionality
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/playlist/${playlist._id}`;
    
    // Web Share API 지원 확인
    if (navigator.share) {
      try {
        await navigator.share({
          title: playlist.title,
          text: playlist.description || `${playlist.createdBy.username}님의 맛집 컬렉션을 확인해보세요!`,
          url: url,
        });
        toast.success('공유가 완료되었습니다!');
      } catch (error) {
        // 사용자가 공유를 취소한 경우
        if (error instanceof Error && error.name !== 'AbortError') {
          handleFallbackShare(url);
        }
      }
    } else {
      handleFallbackShare(url);
    }
  };

  const handleFallbackShare = (url: string) => {
    // 클립보드에 URL 복사
    navigator.clipboard.writeText(url).then(() => {
      toast.success('링크가 클립보드에 복사되었습니다!');
    }).catch(() => {
      // 클립보드 API 지원하지 않는 경우
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('링크가 클립보드에 복사되었습니다!');
    });
  };

  const getCoverImage = () => {
    if (imageError) {
      return `https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80`;
    }
    return getPlaylistCoverImage(playlist);
  };

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageError(e);
    setImageError(true);
  };

  // 가로 레이아웃일 때
  if (horizontal) {
    return (
      <Link to={`/playlist/${playlist._id}`} className="block">
        <div className="card card-hover group flex bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover Image or Gradient - 가로 레이아웃 */}
          <div className="relative w-32 h-32 md:w-40 md:h-32 flex-shrink-0">
            {playlist.coverImage ? (
              <>
                <img
                  src={getCoverImage()}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                  onError={onImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </>
            ) : (
              <div 
                className="w-full h-full"
                style={{ background: getPlaylistGradient(playlist) }}
              />
            )}
          </div>
          
          {/* Content - 가로 레이아웃 */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{playlist.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">{playlist.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  {playlist.restaurants?.length || 0}개 맛집
                </span>
                <span>❤️ {playlist.likeCount}</span>
                <span>👁️ {playlist.viewCount}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <img
                  src={playlist.createdBy.profileImage || getDefaultAvatar(playlist.createdBy.username, 24)}
                  alt={playlist.createdBy.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-xs text-gray-600">{playlist.createdBy.username}</span>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={handleLike}
                  className="p-1"
                >
                  {playlist.isLiked ? (
                    <HeartSolidIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleSave}
                  className="p-1"
                >
                  {playlist.isSaved ? (
                    <BookmarkSolidIcon className="w-4 h-4 text-primary-500" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-1"
                >
                  <ShareIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 세로 레이아웃 (기존)
  return (
    <Link to={`/playlist/${playlist._id}`} className="block">
      <div className="card card-hover group">
        {/* Cover Image or Gradient */}
        <div className="relative h-48 overflow-hidden">
          {playlist.coverImage ? (
            <>
              <img
                src={getCoverImage()}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={onImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          ) : (
            <div 
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
              style={{ background: getPlaylistGradient(playlist) }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleLike}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              {playlist.isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={handleSave}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              {playlist.isSaved ? (
                <BookmarkSolidIcon className="w-5 h-5 text-primary-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              title="공유하기"
            >
              <ShareIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center text-white">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{playlist.restaurants.length}개 맛집</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Category */}
          <div className="mb-2">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary-500 transition-colors">
              {playlist.title}
            </h3>
            <span className="text-sm text-gray-500">{playlist.category}</span>
          </div>

          {/* Description */}
          {playlist.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {playlist.description}
            </p>
          )}

          {/* Tags */}
          {playlist.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {playlist.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {playlist.tags.length > 3 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{playlist.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={playlist.createdBy.profileImage || getDefaultAvatar(playlist.createdBy.username, 40)}
                alt={playlist.createdBy.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">{playlist.createdBy.username}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <HeartIcon className="w-4 h-4 mr-1" />
                {playlist.likeCount}
              </span>
              <span className="flex items-center">
                <BookmarkIcon className="w-4 h-4 mr-1" />
                {playlist.saveCount}
              </span>
            </div>
          </div>

          {/* Date */}
          <div className="mt-2 text-xs text-gray-400">
            {format(new Date(playlist.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;