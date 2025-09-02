import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  HeartIcon,
  BookmarkIcon,
  SparklesIcon,
  FireIcon,
  MapPinIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { getPlaylistCoverImage } from '../utils/imageUtils';

const HomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = {
    curated: useRef<HTMLDivElement>(null),
    trending: useRef<HTMLDivElement>(null),
    celebrity: useRef<HTMLDivElement>(null),
    local: useRef<HTMLDivElement>(null)
  };

  // 실제 DB에서 플레이리스트 가져오기
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/playlists`,
        {
          params: {
            limit: 20,
            sortBy: 'likeCount',
            sortOrder: 'desc'
          }
        }
      );
      
      if (response.data.playlists) {
        setPlaylists(response.data.playlists);
      }
    } catch (error) {
      console.error('플레이리스트 가져오기 실패:', error);
      toast.error('플레이리스트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별로 플레이리스트 필터링
  const getCategorizedPlaylists = (category: string) => {
    switch (category) {
      case 'curated':
        // 데이트코스, 혼밥 카테고리
        return playlists.filter(p => 
          p.category === '데이트코스' || p.category === '혼밥'
        ).slice(0, 5);
      case 'trending':
        // 가장 인기 있는 플레이리스트 (유명인 제외)
        return playlists
          .filter(p => !p.tags?.some((tag: string) => 
            ['성시경', '맛있는녀석들', '쯔양', '백종원'].includes(tag))
          )
          .sort((a, b) => b.likeCount - a.likeCount)
          .slice(0, 5);
      case 'celebrity':
        // 유명인 방문 맛집
        return playlists.filter(p => 
          p.tags?.some((tag: string) => 
            ['성시경', '맛있는녀석들', '쯔양', '백종원', '먹을텐데', '먹방', '방송맛집'].includes(tag)
          )
        ).slice(0, 5);
      case 'local':
        // 맛집투어 카테고리 (유명인 제외)
        return playlists.filter(p => 
          p.category === '맛집투어' &&
          !p.tags?.some((tag: string) => 
            ['성시경', '맛있는녀석들', '쯔양', '백종원'].includes(tag))
        ).slice(0, 5);
      default:
        return [];
    }
  };

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const PlaylistCard = ({ playlist, type }: { playlist: any, type: string }) => {
    const [liked, setLiked] = useState(playlist.isLiked || false);
    const [localLikeCount, setLocalLikeCount] = useState(playlist.likeCount || 0);

    const handleLike = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        toast.error('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      try {
        await axios.post(
          `/api/playlists/${playlist._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLiked(!liked);
        setLocalLikeCount(liked ? localLikeCount - 1 : localLikeCount + 1);
      } catch (error) {
        console.error('좋아요 실패:', error);
      }
    };

    const getPlaylistImage = () => {
      // 플레이리스트별 고유 이미지 사용
      return getPlaylistCoverImage(playlist);
    };

    const getRestaurantNames = () => {
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        return playlist.restaurants
          .slice(0, 3)
          .map((r: any) => r.restaurant?.name || '맛집')
          .join(', ');
      }
      return '맛집 리스트';
    };

    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="flex-shrink-0 w-72 cursor-pointer"
        onClick={() => navigate(`/playlist/${playlist._id}`)}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all">
          <div className="relative aspect-square">
            <img
              src={getPlaylistImage()}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* 매칭 점수 또는 카테고리 배지 */}
            {type === 'curated' && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                맞춤 추천
              </div>
            )}
            
            {/* 재생 버튼 */}
            <button className="absolute bottom-3 right-3 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors group">
              <PlayIcon className="w-6 h-6 text-gray-800 group-hover:text-orange-600" />
            </button>
            
            {/* 플레이리스트 정보 */}
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-sm opacity-90">{playlist.category}</p>
              <h3 className="font-bold text-lg">{playlist.title}</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full" />
                <span className="text-sm text-gray-600">
                  {playlist.createdBy?.username || 'BobMap'}
                </span>
              </div>
              <button 
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                {liked ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
                <span className="text-sm">{localLikeCount}</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-1">
              {playlist.description || '맛집 큐레이션'}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{playlist.restaurantCount || 0}개 맛집</span>
              <span>{playlist.viewCount || 0}회 재생</span>
            </div>
            
            {/* 실제 맛집 이름들 표시 */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-1">
                {getRestaurantNames()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">플레이리스트 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 히어로 섹션 */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
            alt="Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4"
            >
              진짜 맛집만 모았다, BobMap
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90 mb-8"
            >
              현지인이 줄서는 집, 배달 안하는 집, 어르신도 아는 진짜 맛집
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4"
            >
              <button
                onClick={() => navigate('/explore')}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <MapPinIcon className="w-5 h-5 inline mr-2" />
                둘러보기
              </button>
              <button
                onClick={() => navigate('/create-playlist')}
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium border border-white/30 hover:bg-white/20 transition-all"
              >
                플레이리스트 만들기
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 당신을 위한 맞춤 맛집리스트 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                <SparklesIcon className="w-6 h-6 inline mr-2 text-orange-500" />
                당신을 위한 맞춤 맛집리스트
              </h2>
              <p className="text-gray-600 mt-1">취향 분석 기반 추천</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(scrollRefs.curated, 'left')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefs.curated, 'right')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefs.curated}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {getCategorizedPlaylists('curated').map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} type="curated" />
            ))}
          </div>
        </div>
      </section>

      {/* 실시간 인기 플레이리스트 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                <FireIcon className="w-6 h-6 inline mr-2 text-red-500" />
                실시간 인기 플레이리스트
              </h2>
              <p className="text-gray-600 mt-1">지금 가장 핫한 맛집 리스트</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(scrollRefs.trending, 'left')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefs.trending, 'right')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefs.trending}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {getCategorizedPlaylists('trending').map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} type="trending" />
            ))}
          </div>
        </div>
      </section>

      {/* 유명인이 방문한 맛집 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                <StarIcon className="w-6 h-6 inline mr-2 text-yellow-500" />
                유명인이 방문한 맛집
              </h2>
              <p className="text-gray-600 mt-1">성시경, 맛있는 녀석들, 쯔양이 찾은 맛집</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(scrollRefs.celebrity, 'left')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefs.celebrity, 'right')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefs.celebrity}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {getCategorizedPlaylists('celebrity').map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} type="celebrity" />
            ))}
          </div>
        </div>
      </section>

      {/* 지역별 맛집 지도 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                <MapPinIcon className="w-6 h-6 inline mr-2 text-blue-500" />
                지역별 맛집 지도
              </h2>
              <p className="text-gray-600 mt-1">동네별 숨은 맛집 탐방</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(scrollRefs.local, 'left')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(scrollRefs.local, 'right')}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRefs.local}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {getCategorizedPlaylists('local').map((playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} type="local" />
            ))}
          </div>
        </div>
      </section>

      {/* 취향 매칭 섹션 */}
      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                🎯 취향이 비슷한 사용자들
              </h2>
              <p className="text-gray-600 mt-1">AI가 분석한 당신과 비슷한 입맛</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              모두 보기 →
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: '맛집탐험가', username: 'explorer_99', match: 92, followers: 23456, reviews: 892, gradient: 'FF6B6B' },
              { name: '서울미식가', username: 'seoul_gourmet', match: 88, followers: 18234, reviews: 567, gradient: '4ECDC4' },
              { name: '카페중독자', username: 'cafe_addict', match: 85, followers: 15678, reviews: 432, gradient: '95E1D3' },
              { name: '한식전문가', username: 'korean_pro', match: 83, followers: 12345, reviews: 789, gradient: 'F38181' },
              { name: '매운맛킬러', username: 'spicy_killer', match: 81, followers: 9876, reviews: 234, gradient: 'AA96DA' },
              { name: '디저트헌터', username: 'dessert_hunt', match: 79, followers: 8765, reviews: 345, gradient: 'FCBAD3' },
              { name: '브런치러버', username: 'brunch_love', match: 77, followers: 7654, reviews: 123, gradient: 'FDCB6E' },
              { name: '일식마니아', username: 'japan_mania', match: 75, followers: 6543, reviews: 456, gradient: '6C5CE7' },
              { name: '중식고수', username: 'chinese_master', match: 73, followers: 5432, reviews: 678, gradient: 'A8E6CF' },
              { name: '양식천재', username: 'western_genius', match: 71, followers: 4321, reviews: 890, gradient: 'FFD3B6' },
              { name: '분식애호가', username: 'snack_lover', match: 69, followers: 3210, reviews: 567, gradient: 'FFAAA5' },
              { name: '혼밥전사', username: 'solo_warrior', match: 67, followers: 2109, reviews: 234, gradient: 'FF8B94' }
            ].map((user, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                onClick={() => navigate(`/expert/${user.username}`)}
              >
                <div className="relative mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.gradient}&color=fff`}
                    alt={user.name}
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                  <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                    user.match >= 85 ? 'bg-red-500' : 
                    user.match >= 75 ? 'bg-orange-500' : 
                    'bg-yellow-500'
                  }`}>
                    {user.match}%
                  </div>
                </div>
                <h3 className="font-bold text-sm text-center truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 text-center">@{user.username}</p>
                <div className="flex justify-between mt-3 pt-3 border-t text-xs text-gray-600">
                  <div className="text-center">
                    <p className="font-bold">{user.followers > 10000 ? `${Math.floor(user.followers/1000)}K` : user.followers.toLocaleString()}</p>
                    <p className="text-gray-400">팔로워</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{user.reviews}</p>
                    <p className="text-gray-400">리뷰</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            나만의 맛집 플레이리스트를 만들어보세요
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            좋아하는 맛집들을 모아 플레이리스트를 만들고, 다른 사람들과 공유해보세요.
            당신의 큐레이션이 누군가에게는 최고의 맛집 가이드가 됩니다.
          </p>
          <button
            onClick={() => navigate('/create-playlist')}
            className="px-8 py-3 bg-white text-orange-600 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
          >
            플레이리스트 만들기
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeSoundCloud;