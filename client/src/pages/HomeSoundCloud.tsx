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
  StarIcon,
  UserPlusIcon,
  UserMinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { getPlaylistCoverImage } from '../utils/imageUtils';
import { certifiedRestaurantLists, getTrendingLists, getLatestLists } from '../data/certifiedRestaurantLists_fixed';
import { getDefaultAvatar } from '../utils/avatars';
import syncStorage from '../utils/syncStorage';

const HomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { followUser, unfollowUser, isFollowing, syncWithLocalStorage } = useSocialStore();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = {
    curated: useRef<HTMLDivElement>(null),
    trending: useRef<HTMLDivElement>(null),
    celebrity: useRef<HTMLDivElement>(null),
    local: useRef<HTMLDivElement>(null)
  };

  // 플레이리스트와 인증 맛집 데이터 가져오기
  useEffect(() => {
    syncWithLocalStorage(); // Sync social store on mount
    fetchPlaylists();
    
    // 5초마다 자동 새로고침 (실시간 동기화)
    const interval = setInterval(() => {
      fetchPlaylists();
    }, 5000);
    
    // 페이지 포커스 시 데이터 새로고침
    const handleFocus = () => {
      fetchPlaylists();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      
      // MongoDB에서 실제 사용자 플레이리스트 가져오기
      const response = await axios.get('/api/playlists', {
        params: {
          limit: 50,
          sortBy: 'popularityScore',
          sortOrder: 'desc'
        }
      });
      
      if (response.data.playlists && response.data.playlists.length > 0) {
        // 실제 사용자 플레이리스트와 인증 맛집 리스트 결합
        const userPlaylists = response.data.playlists;
        const combinedPlaylists = [...certifiedRestaurantLists, ...userPlaylists];
        setPlaylists(combinedPlaylists);
      } else {
        // 사용자 플레이리스트가 없으면 인증 맛집만 사용
        setPlaylists(certifiedRestaurantLists);
      }
    } catch (error) {
      console.error('플레이리스트 가져오기 실패:', error);
      // 네트워크 오류 시 인증 맛집 리스트로 폴백
      setPlaylists(certifiedRestaurantLists);
      toast.error('일부 데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별로 맛집 리스트 필터링
  const getCategorizedPlaylists = (category: string) => {
    switch (category) {
      case 'curated':
        // 공식 인증 맛집 (미쉐린, 백년가게) - 인증 맛집 우선
        return playlists.filter(p => 
          p.certification === '미쉐린스타' || p.certification === '백년가게' ||
          (p.tags && (p.tags.includes('미쉐린') || p.tags.includes('백년가게')))
        ).slice(0, 5);
      case 'trending':
        // 가장 인기 있는 맛집 리스트 (좋아요 순) - 사용자 플레이리스트 포함
        return [...playlists]
          .sort((a, b) => (b.likeCount || b.likes?.length || 0) - (a.likeCount || a.likes?.length || 0))
          .slice(0, 5);
      case 'celebrity':
        // TV 방송 출연 맛집 - 인증 맛집 우선
        return playlists.filter(p => 
          (p.certification && ['흑백요리사', '수요미식회', '백종원의3대천왕', '맛있는녀석들', '성시경의먹을텐데'].includes(p.certification)) ||
          (p.tags && p.tags.some((tag: string) => ['흑백요리사', '수요미식회', '백종원', '맛있는녀석들', '성시경'].includes(tag)))
        ).slice(0, 5);
      case 'local':
        // 최신 맛집 리스트 - 사용자가 만든 최신 플레이리스트 우선
        return [...playlists]
          .filter(p => p.createdAt) // 실제 생성일이 있는 사용자 플레이리스트 우선
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
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
    // syncStorage를 사용하여 초기 상태 설정
    const [liked, setLiked] = useState(() => {
      if (!user) return false;
      const likes = syncStorage.getPlaylistLikes(user._id);
      return likes.has(playlist._id);
    });
    const [localLikeCount, setLocalLikeCount] = useState(() => {
      const baseCount = Array.isArray(playlist.likes) ? playlist.likes.length : (playlist.likes || playlist.likeCount || 0);
      const storedCount = syncStorage.getLikeCount(`playlist_${playlist._id}`);
      return Math.max(baseCount, storedCount);
    });
    
    // Get creator info
    const creatorUsername = playlist.creator?.username || playlist.createdBy?.username || playlist.createdBy || 'BobMap';
    const creatorId = playlist.creator?._id || playlist.createdBy?._id || `creator_${playlist._id}`;
    const isFollowingCreator = isFollowing(creatorId);
    
    // 실시간 동기화를 위한 리스너 등록
    useEffect(() => {
      if (!user) return;
      
      // 좋아요 상태 변경 리스너
      const unsubscribeLikes = syncStorage.subscribe(`likes_playlist_${user._id}`, (likes: string[]) => {
        const likesSet = new Set(likes);
        setLiked(likesSet.has(playlist._id));
      });
      
      // 좋아요 카운트 변경 리스너
      const unsubscribeCount = syncStorage.subscribe(`like_count_playlist_${playlist._id}`, (count: number) => {
        setLocalLikeCount(count);
      });
      
      return () => {
        unsubscribeLikes();
        unsubscribeCount();
      };
    }, [user, playlist._id]);

    const handleLike = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        toast.error('로그인이 필요합니다');
        navigate('/login');
        return;
      }

      // syncStorage를 통해 즉시 로컬 업데이트
      const newLiked = syncStorage.togglePlaylistLike(playlist._id, user._id);
      setLiked(newLiked);
      setLocalLikeCount(syncStorage.getLikeCount(`playlist_${playlist._id}`));
      toast.success(newLiked ? '좋아요!' : '좋아요 취소');

      // 서버와 동기화 시도 (비동기)
      try {
        await axios.post(
          `/api/social/playlists/${playlist._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('서버 동기화 실패:', error);
        // 서버 동기화 실패 시 롤백
        syncStorage.togglePlaylistLike(playlist._id, user._id);
        setLiked(!newLiked);
        setLocalLikeCount(syncStorage.getLikeCount(`playlist_${playlist._id}`));
        toast.error('좋아요 처리 중 오류가 발생했습니다');
      }
    };

    const getPlaylistImage = () => {
      // 맛집 리스트별 고유 이미지 사용
      return playlist.coverImage || getPlaylistCoverImage(playlist);
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
            
            {/* 맛집 리스트 정보 */}
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-sm opacity-90">{playlist.certification || playlist.category}</p>
              <h3 className="font-bold text-lg">{playlist.title}</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1">
                <img 
                  src={getDefaultAvatar(creatorUsername, 24)}
                  alt={creatorUsername}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">
                  {creatorUsername}
                </span>
                {creatorUsername !== 'BobMap' && user && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowingCreator) {
                        unfollowUser(creatorId);
                        toast.success(`${creatorUsername} 언팔로우`);
                      } else {
                        followUser(creatorId, {
                          _id: creatorId,
                          username: creatorUsername,
                          bio: playlist.certification ? `${playlist.certification} 전문가` : '맛집 큐레이터'
                        });
                        toast.success(`${creatorUsername} 팔로우!`);
                      }
                    }}
                    className={`ml-auto px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                      isFollowingCreator 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md'
                    }`}
                  >
                    {isFollowingCreator ? '팔로잉' : '팔로우'}
                  </button>
                )}
              </div>
              <button 
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors ml-2"
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
              <span>{playlist.restaurants?.length || playlist.restaurantCount || 0}개 맛집</span>
              <span>{typeof playlist.views === 'object' ? (playlist.views?.total || 0) : (playlist.views || playlist.viewCount || 0)}회 조회</span>
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
          <p className="mt-4 text-gray-600">맛집 리스트 로딩 중...</p>
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
                맛집 리스트 만들기
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
                공식 인증 맛집 리스트
              </h2>
              <p className="text-gray-600 mt-1">미쉐린 & 백년가게 선정</p>
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
                실시간 인기 맛집 리스트
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
                방송 출연 맛집
              </h2>
              <p className="text-gray-600 mt-1">흑백요리사, 수요미식회, 백종원의 맛집</p>
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

      {/* 취향 매칭 섹션 - 로그인한 사용자에게만 표시 */}
      {user && (
        <section className="py-12 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  <UserGroupIcon className="w-6 h-6 inline mr-2 text-purple-500" />
                  당신과 취향이 비슷한 사람들
                </h2>
                <p className="text-gray-600 mt-1">팔로잉과 좋아요 기반 추천</p>
              </div>
              <button
                onClick={() => navigate('/matching')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                더보기
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 여기에 매칭된 사용자들 표시 */}
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  85%
                </div>
                <h4 className="font-medium">매칭 점수</h4>
                <p className="text-sm text-gray-500">비슷한 취향의 친구 찾기</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 지역별 맛집 지도 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                <MapPinIcon className="w-6 h-6 inline mr-2 text-blue-500" />
                최신 맛집 리스트
              </h2>
              <p className="text-gray-600 mt-1">새로 등록된 인증 맛집</p>
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