import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { 
  PlayIcon, 
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  FireIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const MobileHomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      // data가 배열인지 확인하고 처리
      const playlistsArray = Array.isArray(response.data) ? response.data : (response.data.playlists || []);
      console.log('Mobile playlists received:', playlistsArray.length, 'items');
      console.log('First playlist:', playlistsArray[0]);
      // 모바일에서는 6개만 표시 (상위 인기 플레이리스트)
      const featuredPlaylists = playlistsArray
        .sort((a: any, b: any) => (b.likeCount || 0) + (b.viewCount || 0) - ((a.likeCount || 0) + (a.viewCount || 0)))
        .slice(0, 6);
      setPlaylists(featuredPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = (playlistId: string) => {
    setLikedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
      } else {
        newSet.add(playlistId);
      }
      return newSet;
    });
  };

  const PlaylistCard = ({ playlist }: { playlist: any }) => {
    const isLiked = likedPlaylists.has(playlist._id);
    const localLikeCount = (playlist.likeCount || 0) + (isLiked ? 1 : 0);

    const getPlaylistImage = () => {
      if (playlist.coverImage) return playlist.coverImage;
      return 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&q=80';
    };

    const getRestaurantNames = () => {
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        const names = playlist.restaurants
          .slice(0, 2)
          .map((r: any) => {
            // restaurant 객체 처리
            if (typeof r === 'object' && r !== null) {
              return r.restaurant?.name || r.name || '';
            }
            return r || '';
          })
          .filter((name: string) => name) // 빈 문자열 제거
          .join(', ');
        return names + (playlist.restaurants.length > 2 ? ` 외 ${playlist.restaurants.length - 2}곳` : '');
      }
      return '맛집 정보 준비중';
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div 
          className="relative cursor-pointer overflow-hidden"
          style={{ aspectRatio: '16/9' }}
          onClick={() => navigate(`/playlist/${playlist._id}`)}
        >
          <img
            src={getPlaylistImage()}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
          <button 
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              // 플레이 기능 추가 예정
            }}
          >
            <PlayIcon className="w-4 h-4 text-gray-900" />
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
              {playlist.name}
            </h3>
            <button 
              onClick={() => handleLikeToggle(playlist._id)}
              className="ml-2 text-gray-600 hover:text-red-500 transition-colors flex items-center space-x-1"
            >
              {isLiked ? (
                <HeartIconSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span className="text-xs">{localLikeCount}</span>
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mb-1 line-clamp-1">
            {playlist.description || '맛집 큐레이션'}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{playlist.restaurantCount || 0}개 맛집</span>
            <span>{playlist.viewCount || 0}회</span>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-1">
              {getRestaurantNames()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 모바일 히어로 섹션 - 심플한 디자인 */}
      <section className="relative h-[240px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-4 pb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              BobMap
            </h1>
            <p className="text-lg font-medium text-white/95">
              진짜 맛집만 모았다
            </p>
            <p className="text-sm text-white/80">
              현지인이 줄서는 진짜 맛집
            </p>
          </motion.div>
        </div>
      </section>

      {/* 액션 버튼들 - 이미지와 분리 */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium shadow-md"
          >
            <MapPinIcon className="w-5 h-5 mr-2" />
            둘러보기
          </button>
          <button
            onClick={() => navigate('/create-playlist')}
            className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-md"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            플리 만들기
          </button>
        </div>
      </div>

      {/* 맞춤 맛집리스트 섹션 */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              <SparklesIcon className="w-5 h-5 inline mr-1 text-orange-500" />
              맞춤 맛집리스트
            </h2>
            <p className="text-xs text-gray-600">취향 기반 추천</p>
          </div>
          <button 
            onClick={() => navigate('/discover')}
            className="text-sm text-orange-600 font-medium"
          >
            더보기
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {playlists.slice(0, 3).map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* 핫한 플레이리스트 섹션 */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              <FireIcon className="w-5 h-5 inline mr-1 text-red-500" />
              지금 핫한 플리
            </h2>
            <p className="text-xs text-gray-600">실시간 인기</p>
          </div>
          <button 
            onClick={() => navigate('/discover')}
            className="text-sm text-orange-600 font-medium"
          >
            더보기
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {playlists.slice(3, 6).map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MobileHomeSoundCloud;