import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  HeartIcon,
  MapPinIcon,
  SparklesIcon,
  FireIcon,
  PlusCircleIcon,
  StarIcon,
  BookmarkIcon,
  UserPlusIcon,
  UserMinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { certifiedRestaurantLists, getTrendingLists, getLatestLists } from '../data/certifiedRestaurantLists_fixed';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import syncStorage from '../utils/syncStorage';
import { getImageForCategory, getPlaylistImage } from '../utils/foodImages';
import { getRestaurantImage } from '../utils/restaurantImages';
import { getUniquePlaylistImage } from '../utils/playlistImages';

const MobileHomeSoundCloud: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPlaylists, setLikedPlaylists] = useState<Set<string>>(new Set());
  const [savedPlaylists, setSavedPlaylists] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'certified' | 'following' | 'similar'>('certified');
  const { followUser, unfollowUser, isFollowing, syncWithLocalStorage, followingUsers } = useSocialStore();
  
  // Sync on mount
  useEffect(() => {
    syncWithLocalStorage();
    
    // localStorage에서 초기 좋아요 및 저장 상태 불러오기
    if (user) {
      const likes = syncStorage.getPlaylistLikes(user._id);
      setLikedPlaylists(likes);
      
      // 저장된 플레이리스트 불러오기
      const saved = localStorage.getItem(`saved_playlists_${user._id}`);
      if (saved) {
        setSavedPlaylists(new Set(JSON.parse(saved)));
      }
    }
  }, [syncWithLocalStorage, user]);
  
  // 실시간 동기화를 위한 리스너 등록
  useEffect(() => {
    if (!user) return;
    
    // 좋아요 상태 변경 리스너
    const unsubscribe = syncStorage.subscribe(`likes_playlist_${user._id}`, (likes: string[]) => {
      setLikedPlaylists(new Set(likes));
    });
    
    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    fetchPlaylists();
  }, [activeFilter]);
  
  // 실시간 동기화를 위한 자동 새로고침
  useEffect(() => {
    // 5초마다 데이터 새로고침
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
  }, [activeFilter]); // activeFilter 변경 시 interval 재설정

  const fetchPlaylists = async () => {
    console.log('fetchPlaylists called with activeFilter:', activeFilter);
    setLoading(true);
    try {
      // Admin에서 수정한 데이터가 있으면 사용, 없으면 기본 데이터 사용
      const adminPlaylists = localStorage.getItem('adminPlaylists');
      let allPlaylists = adminPlaylists ? JSON.parse(adminPlaylists) : certifiedRestaurantLists;
      
      let filteredLists = [];
      
      if (activeFilter === 'certified') {
        console.log('Loading certified restaurants...');
        // 인증 맛집 리스트 - Admin만 수정 가능
        const adminData = localStorage.getItem('certified_restaurants_data');
        if (adminData) {
          const parsedData = JSON.parse(adminData);
          // 카테고리별로 리스트 생성
          filteredLists = Object.entries(parsedData.categories).map(([key, category]: [string, any]) => {
            // 실제 조회수와 좋아요 수 가져오기 (없으면 초기값 설정)
            const statsKey = `playlist_stats_certified-${key}`;
            const savedStats = localStorage.getItem(statsKey);
            const stats = savedStats ? JSON.parse(savedStats) : {
              likeCount: category.likeCount || 0,
              viewCount: category.viewCount || 0
            };
            
            return {
              _id: `certified-${key}`,
              name: category.title,
              title: `${category.icon} ${category.title}`,
              description: category.description,
              creator: { username: 'Admin', isVerified: true },
              certification: category.title,
              likeCount: stats.likeCount,
              viewCount: stats.viewCount,
              restaurants: category.restaurants.slice(0, 5).map((r: any) => ({
              _id: r.id,
              restaurant: { 
                _id: r.id, 
                name: r.name, 
                category: r.category, 
                address: r.address,
                image: r.image
              }
              })),
              tags: [category.title.split(' ')[0], '인증맛집'],
              coverImage: null // getPlaylistImageUrl이 처리하도록 null로 설정
            };
          });
        } else {
          // 기본 인증 맛집 리스트
          filteredLists = allPlaylists.filter((p: any) => 
            p.certification && [
              '흑백요리사',
              '수요미식회',
              '미쉐린스타',
              '백종원의3대천왕',
              '백년가게'
            ].includes(p.certification)
          );
        }
      } else if (activeFilter === 'following') {
        console.log('Loading following playlists...');
        // 팔로잉하는 사람들의 플레이리스트
        // followedUsers 키로 저장된 팔로우 목록 가져오기
        const followingIds = localStorage.getItem('followedUsers') ? JSON.parse(localStorage.getItem('followedUsers') || '[]') : [];
        
        // 또는 useSocialStore에서 직접 가져오기
        const followingFromStore = followingUsers;
        const actualFollowing = followingFromStore.length > 0 ? followingFromStore : followingIds;
        console.log('Following users:', actualFollowing);
        
        if (actualFollowing.length > 0) {
          // 실제 팔로우한 사람들의 플레이리스트만 표시
          // 1. allPlaylists에서 팔로우한 사람의 리스트 찾기
          const allPlaylistsData = JSON.parse(localStorage.getItem('allPlaylists') || '[]');
          const certifiedData = certifiedRestaurantLists || [];
          
          // 팔로우한 사람들의 플레이리스트 필터링
          const followedUserPlaylists = [...allPlaylistsData, ...certifiedData].filter((list: any) => {
            if (list.createdBy && typeof list.createdBy === 'object') {
              return actualFollowing.includes(list.createdBy._id);
            } else if (list.creator && typeof list.creator === 'object') {
              return actualFollowing.includes(list.creator._id);
            }
            return false;
          });
          
          // 실제 팔로우한 사람들의 플레이리스트만 표시 (데모 데이터 제거)
          filteredLists = followedUserPlaylists;
        } else {
          // 팔로잉하는 사람이 없을 때 빈 배열 반환
          filteredLists = [];
        }
      } else if (activeFilter === 'similar') {
        // 취향 매칭 - 서비스 준비중
        filteredLists = [];
      }
      
      console.log('Setting playlists:', filteredLists.length, 'items for filter:', activeFilter);
      setPlaylists(filteredLists.slice(0, 6));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (playlistId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    // syncStorage를 통해 즉시 로컬 업데이트
    const newLiked = syncStorage.togglePlaylistLike(playlistId, user._id);
    setLikedPlaylists(prev => {
      const newSet = new Set(prev);
      if (newLiked) {
        newSet.add(playlistId);
      } else {
        newSet.delete(playlistId);
      }
      return newSet;
    });
    
    // 좋아요 수 업데이트
    const statsKey = `playlist_stats_${playlistId}`;
    const currentStats = localStorage.getItem(statsKey);
    const stats = currentStats ? JSON.parse(currentStats) : { 
      likeCount: 0, 
      viewCount: 0 
    };
    stats.likeCount = newLiked ? (stats.likeCount || 0) + 1 : Math.max(0, (stats.likeCount || 0) - 1);
    localStorage.setItem(statsKey, JSON.stringify(stats));
    
    // 인증 맛집 데이터에도 업데이트
    if (playlistId.startsWith('certified-')) {
      const certifiedData = localStorage.getItem('certified_restaurants_data');
      if (certifiedData) {
        const parsedData = JSON.parse(certifiedData);
        const categoryKey = playlistId.replace('certified-', '');
        if (parsedData.categories[categoryKey]) {
          parsedData.categories[categoryKey].likeCount = stats.likeCount;
          localStorage.setItem('certified_restaurants_data', JSON.stringify(parsedData));
        }
      }
    }
    
    toast.success(newLiked ? '좋아요!' : '좋아요 취소');

    // 서버와 동기화 시도 (비동기)
    try {
      await axios.post(
        `/api/social/playlists/${playlistId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('서버 동기화 실패:', error);
      // 서버 동기화 실패 시 롤백
      syncStorage.togglePlaylistLike(playlistId, user._id);
      setLikedPlaylists(prev => {
        const newSet = new Set(prev);
        if (!newLiked) {
          newSet.add(playlistId);
        } else {
          newSet.delete(playlistId);
        }
        return newSet;
      });
      toast.error('좋아요 처리 중 오류가 발생했습니다');
    }
  };

  const handleSaveToggle = (playlistId: string) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    // 플레이리스트 찾기
    const playlist = playlists.find(p => p._id === playlistId);
    
    setSavedPlaylists(prev => {
      const newSet = new Set(prev);
      let saved;
      if (newSet.has(playlistId)) {
        newSet.delete(playlistId);
        saved = false;
      } else {
        newSet.add(playlistId);
        saved = true;
      }
      
      // localStorage에 ID만 저장
      localStorage.setItem(`saved_playlists_${user._id}`, JSON.stringify(Array.from(newSet)));
      
      // 플레이리스트 전체 데이터도 저장 (allPlaylists 업데이트)
      if (saved && playlist) {
        const allPlaylistsData = JSON.parse(localStorage.getItem('allPlaylists') || '[]');
        const exists = allPlaylistsData.some((p: any) => p._id === playlist._id);
        if (!exists) {
          allPlaylistsData.push(playlist);
          localStorage.setItem('allPlaylists', JSON.stringify(allPlaylistsData));
        }
      }
      
      toast.success(saved ? '플레이리스트 저장됨!' : '저장 취소');
      return newSet;
    });
  };

  const handleFollowUser = (userId: string, username: string, userDetails?: any) => {
    const isFollowed = isFollowing(userId);
    
    if (isFollowed) {
      unfollowUser(userId);
      toast.success(`${username}님 팔로우 취소`);
    } else {
      followUser(userId, userDetails || { _id: userId, username });
      toast.success(`${username}님 팔로우 시작! 🎉`);
    }
  };

  const PlaylistCard = ({ playlist, index }: { playlist: any; index: number }) => {
    const isLiked = likedPlaylists.has(playlist._id);
    const isSaved = savedPlaylists.has(playlist._id);
    const [localLikeCount, setLocalLikeCount] = useState(() => {
      const baseCount = Array.isArray(playlist.likes) ? playlist.likes.length : (playlist.likes || playlist.likeCount || 0);
      const storedCount = syncStorage.getLikeCount(`playlist_${playlist._id}`);
      return Math.max(baseCount, storedCount);
    });
    
    // 좋아요 카운트 실시간 동기화
    useEffect(() => {
      const unsubscribe = syncStorage.subscribe(`like_count_playlist_${playlist._id}`, (count: number) => {
        setLocalLikeCount(count);
      });
      
      return () => {
        unsubscribe();
      };
    }, [playlist._id]);

    const getPlaylistImageUrl = () => {
      // 이미 coverImage가 있다면 그것을 사용
      if (playlist.coverImage) return playlist.coverImage;
      
      // 새로운 이미지 함수 사용 - 플레이리스트의 제목과 설명을 기반으로 적절한 이미지 선택
      return getUniquePlaylistImage(playlist);
    };

    const getRestaurantNames = () => {
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        const names = playlist.restaurants
          .slice(0, 3)
          .map((r: any) => {
            // restaurant 객체 처리 - certifiedRestaurantLists 형식 지원
            if (typeof r === 'object' && r !== null) {
              return r.restaurant?.name || r.name || '';
            }
            return r || '';
          })
          .filter((name: string) => name) // 빈 문자열 제거
          .join(', ');
        
        if (names) {
          return names + (playlist.restaurants.length > 3 ? ` 외 ${playlist.restaurants.length - 3}곳` : '');
        }
      }
      
      // 인증 리스트의 경우 디폴트 설명
      if (playlist.certification) {
        const certDescriptions: { [key: string]: string } = {
          '흑백요리사': '임페리얼 트레져, 네오포차, 스시조 외',
          '수요미식회': '평래옥, 라이너스 바베큐, 을지면옥 외',
          '미쉐린스타': '밍글스, 곳간, 라연, 품서울 외',
          '백종원의3대천왕': '진진, 홍탁집, 황해면옥 외',
          '백년가게': '우래옥, 평래옥, 하동관 외'
        };
        return certDescriptions[playlist.certification] || '인증 맛집';
      }
      
      return '맛집 리스트';
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
          onClick={() => {
            // 조회수 증가
            const statsKey = `playlist_stats_${playlist._id}`;
            const currentStats = localStorage.getItem(statsKey);
            const stats = currentStats ? JSON.parse(currentStats) : { 
              likeCount: playlist.likeCount || 0, 
              viewCount: playlist.viewCount || 0 
            };
            stats.viewCount = (stats.viewCount || 0) + 1;
            localStorage.setItem(statsKey, JSON.stringify(stats));
            
            // 인증 맛집 데이터에도 업데이트
            if (playlist.certification) {
              const certifiedData = localStorage.getItem('certified_restaurants_data');
              if (certifiedData) {
                const parsedData = JSON.parse(certifiedData);
                const categoryKey = playlist._id.replace('certified-', '');
                if (parsedData.categories[categoryKey]) {
                  parsedData.categories[categoryKey].viewCount = stats.viewCount;
                  localStorage.setItem('certified_restaurants_data', JSON.stringify(parsedData));
                }
              }
            }
            
            navigate(`/playlist/${playlist._id}`);
          }}
        >
          <img
            src={getPlaylistImageUrl()}
            alt={playlist.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // 에러 발생시 첫번째 레스토랑 이미지로 대체
              if (playlist.restaurants && playlist.restaurants.length > 0) {
                const firstRestaurant = playlist.restaurants[0];
                const restaurantName = typeof firstRestaurant === 'object' ? 
                  (firstRestaurant.restaurant?.name || firstRestaurant.name) : 
                  firstRestaurant;
                target.src = getRestaurantImage(restaurantName);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
          
          {/* 인증 배지 또는 추천 이유 */}
          {playlist.certification && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
              {playlist.certification === '미쉐린스타' ? '⭐ 미쉐린' :
               playlist.certification === '백년가게' ? '💯 백년가게' :
               playlist.certification === '흑백요리사' ? '👨‍🍳 흑백요리사' :
               playlist.certification === '수요미식회' ? '🍽️ 수요미식회' :
               playlist.certification === '백종원의3대천왕' ? '👑 3대천왕' :
               playlist.certification}
            </div>
          )}
          {playlist.recommendedReason && (
            <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-white">
              {playlist.recommendedReason}
            </div>
          )}
          
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
              {playlist.title || playlist.name}
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
          
          {/* 크리에이터 정보 */}
          {(playlist.createdBy || playlist.creator) && (
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">
                by <span 
                  className="font-medium text-gray-700 hover:text-orange-600 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 작성자 프로필로 이동
                    const creator = playlist.createdBy || playlist.creator;
                    if (creator.username) {
                      navigate(`/profile/${creator.username}`);
                    }
                  }}
                >
                  {(playlist.createdBy || playlist.creator).username}
                </span>
                {(playlist.createdBy || playlist.creator).isVerified && ' ✓'}
              </p>
              
              {/* 플레이리스트 액션 버튼들 */}
              <div className="flex items-center gap-2">
                {/* 저장 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToggle(playlist._id);
                  }}
                  className={`p-1.5 rounded-full transition-all ${
                    isSaved ?
                    'text-green-600 bg-green-50' :
                    'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                  title={isSaved ? '저장됨' : '플레이리스트 저장'}
                >
                  {isSaved ? (
                    <BookmarkIconSolid className="w-4 h-4" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{playlist.restaurants?.length || playlist.restaurantCount || 0}개 맛집</span>
            <span>{typeof playlist.views === 'object' ? (playlist.views?.total || 0) : (playlist.views || playlist.viewCount || 0)}회 조회</span>
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
          <p className="mt-4 text-gray-600">맛집 리스트 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 모바일 히어로 섹션 - 심플한 디자인 */}
      <section className="relative h-[280px] overflow-hidden">
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


      {/* 필터 탭 */}
      <section className="px-4 mt-6">
        <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('certified')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'certified'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            인증맛집
          </button>
          <button
            onClick={() => setActiveFilter('following')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'following'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            친구맛집
          </button>
          <button
            onClick={() => setActiveFilter('similar')}
            className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'similar'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            취향매칭
          </button>
        </div>

        {/* 필터별 설명 */}
        <div className="mb-4">
          {activeFilter === 'certified' && (
            <p className="text-xs text-gray-600">
              <StarIcon className="w-4 h-4 inline mr-1 text-yellow-500" />
              미디어, 인플루언서, 유튜브 등에 등장한 검증된 맛집
            </p>
          )}
          {activeFilter === 'following' && (
            <p className="text-xs text-gray-600">
              <HeartIcon className="w-4 h-4 inline mr-1 text-red-500" />
              내가 팔로우하는 친구들의 맛집 리스트
            </p>
          )}
          {activeFilter === 'similar' && (
            <p className="text-xs text-gray-600">
              <SparklesIcon className="w-4 h-4 inline mr-1 text-purple-500" />
              나와 비슷한 먹성을 가진 사람들의 추천
            </p>
          )}
        </div>
        
        {/* 플레이리스트 표시 */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {playlists.map((playlist, index) => (
              <PlaylistCard key={playlist._id} playlist={playlist} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {activeFilter === 'similar' ? (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                <SparklesIcon className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🚀 서비스 준비중
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  취향 매칭 서비스가 곧 출시됩니다!
                </p>
                <p className="text-xs text-gray-500">
                  AI가 분석한 당신의 취향과 비슷한 사람들의<br />
                  맛집 리스트를 추천해드릴 예정입니다
                </p>
                <div className="mt-4 inline-flex items-center text-xs text-purple-600 font-medium">
                  <span className="animate-pulse">개발 진행중...</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {activeFilter === 'following' 
                  ? '팔로우하는 친구가 없습니다. 맛집 잘 아는 친구들을 팔로우해보세요!'
                  : '아직 등록된 맛집이 없습니다.'}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MobileHomeSoundCloud;