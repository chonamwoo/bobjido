import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import KoreanMap from '../components/KoreanMap';
import { 
  HeartIcon, 
  BookmarkIcon, 
  ShareIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists_fixed';
import { dataManager } from '../utils/dataManager';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false);
  const [isSaved, setIsSaved] = useState(() => id ? dataManager.isPlaylistSaved(id) : false);
  const [isLiked, setIsLiked] = useState(() => id ? dataManager.isPlaylistLiked(id) : false);
  const [savedRestaurants, setSavedRestaurants] = useState<string[]>(() => {
    const savedData = dataManager.getSavedRestaurants();
    return savedData.map(r => r.restaurantId);
  });
  
  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      // 인증 맛집 데이터 확인 (새로운 구조)
      if (id?.startsWith('certified-')) {
        const certifiedData = localStorage.getItem('certified_restaurants_data');
        if (certifiedData) {
          const parsedData = JSON.parse(certifiedData);
          const categoryKey = id.replace('certified-', '');
          const category = parsedData.categories[categoryKey];
          if (category) {
            // 카테고리를 플레이리스트 형식으로 변환
            return {
              _id: id,
              name: category.title,
              title: `${category.icon} ${category.title}`,
              description: category.description,
              creator: { username: 'Admin', isVerified: true },
              certification: category.title,
              restaurants: category.restaurants.map((r: any) => ({
                _id: r.id,
                restaurant: {
                  _id: r.id,
                  name: r.name,
                  category: r.category,
                  address: r.address,
                  phoneNumber: r.phoneNumber,
                  priceRange: r.priceRange,
                  rating: r.rating,
                  image: r.image,
                  coordinates: { lat: 37.5665, lng: 126.9780 } // 기본 좌표
                }
              })),
              likeCount: category.likeCount || 0,
              viewCount: category.viewCount || 0,
              tags: [category.title],
              coverImage: category.restaurants[0]?.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
            };
          }
        }
      }
      
      // Admin에서 수정한 데이터 확인
      const adminPlaylists = localStorage.getItem('adminPlaylists');
      if (adminPlaylists) {
        const playlists = JSON.parse(adminPlaylists);
        const adminPlaylist = playlists.find((p: any) => p._id === id);
        if (adminPlaylist) {
          return adminPlaylist;
        }
      }
      
      // certifiedRestaurantLists에서 찾기
      const certifiedPlaylist = certifiedRestaurantLists.find(p => p._id === id);
      if (certifiedPlaylist) {
        return certifiedPlaylist;
      }
      
      // 로컬 스토리지에서 찾기
      const localPlaylists = localStorage.getItem('localPlaylists');
      if (localPlaylists) {
        const playlists = JSON.parse(localPlaylists);
        const localPlaylist = playlists.find((p: any) => p._id === id);
        if (localPlaylist) {
          return localPlaylist;
        }
      }
      
      // 둘 다 없으면 API 호출
      try {
        const response = await axios.get(`/api/playlists/${id}`);
        return response.data;
      } catch (err) {
        throw new Error('맛집 리스트를 찾을 수 없습니다');
      }
    },
    enabled: !!id,
  });
  
  // 저장 상태 동기화
  useEffect(() => {
    if (id && playlist) {
      const saved = dataManager.isPlaylistSaved(id);
      const liked = dataManager.isPlaylistLiked(id);
      setIsSaved(saved);
      setIsLiked(liked);
      console.log(`PlaylistDetail - Loading state for ${id}: saved=${saved}, liked=${liked}`);
    }
  }, [id, playlist]); // playlist가 변경될 때마다 상태 재로드
  
  // Listen for dataManager updates
  useEffect(() => {
    const handleDataUpdate = () => {
      if (id) {
        const saved = dataManager.isPlaylistSaved(id);
        const liked = dataManager.isPlaylistLiked(id);
        setIsSaved(saved);
        setIsLiked(liked);
        console.log(`PlaylistDetail - Data updated for ${id}: saved=${saved}, liked=${liked}`);
      }
      // Update saved restaurants
      const savedData = dataManager.getSavedRestaurants();
      setSavedRestaurants(savedData.map(r => r.restaurantId));
    };

    window.addEventListener('dataManager:update', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('dataManager:update', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, [id]);

  // Mutations removed - using dataManager instead

  const handleSave = () => {
    console.log('handleSave called - id:', id, 'isSaved:', isSaved);
    
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    
    if (id) {
      if (isSaved) {
        console.log('Unsaving playlist:', id);
        dataManager.unsavePlaylist(id);
        setIsSaved(false);
        toast.success('저장 취소됨');
      } else {
        console.log('Saving playlist:', id);
        dataManager.savePlaylist(id);
        setIsSaved(true);
        toast.success('저장됨!');
      }
      
      // 저장 후 상태 확인
      const savedData = dataManager.getSavedPlaylists();
      console.log('After save - Saved playlists:', savedData);
      
      // 이벤트 발생시켜 다른 컴포넌트들이 업데이트 되도록
      window.dispatchEvent(new CustomEvent('dataManager:update'));
    }
  };
  
  const handleLike = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    
    if (id) {
      const liked = dataManager.togglePlaylistLike(id);
      setIsLiked(liked);
      toast.success(liked ? '좋아요!' : '좋아요 취소');
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/playlists/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      toast.success('맛집리스트가 삭제되었습니다.');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제에 실패했습니다.');
    },
  });

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('링크가 클립보드에 복사되었습니다!');
    setShowShareModal(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 맛집리스트를 삭제하시겠습니까?')) {
      deleteMutation.mutate();
    }
  };

  // 디버그: 현재 상태 표시
  console.log('PlaylistDetail - ID:', id);
  console.log('PlaylistDetail - Loading:', isLoading);
  console.log('PlaylistDetail - Error:', error);
  console.log('PlaylistDetail - Playlist:', playlist);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p>플레이리스트 로딩 중... (ID: {id})</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">에러가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">Error: {(error as Error).message}</p>
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">맛집리스트를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 맛집리스트가 존재하지 않거나 삭제되었습니다. (ID: {id})</p>
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // Handle both old and new data formats
  const restaurants = playlist.restaurants.map((r: any) => {
    // If it's already in the new format with restaurant object
    if (r.restaurant) {
      return r.restaurant;
    }
    // If it's the old format, create a compatible object
    return {
      _id: r.name?.replace(/\s/g, '-').toLowerCase() || Math.random().toString(),
      name: r.name || 'Unknown',
      category: r.category || 'Unknown',
      address: r.address || 'Address not available',
      rating: r.rating || 0
    };
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                {playlist.category}
              </span>
              {!playlist.isPublic && (
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  비공개
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{playlist.title}</h1>
            
            {playlist.description && (
              <p className="text-gray-600 text-lg mb-4">{playlist.description}</p>
            )}

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{playlist.restaurantCount}개 맛집</span>
              </div>
              {playlist.estimatedDuration && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{playlist.estimatedDuration}분</span>
                </div>
              )}
              {playlist.estimatedCost && (
                <div className="flex items-center space-x-1">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span>
                    {playlist.estimatedCost.min?.toLocaleString()}
                    {playlist.estimatedCost.max && ` - ${playlist.estimatedCost.max.toLocaleString()}`}원
                    {playlist.estimatedCost.perPerson && ' (1인당)'}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>{playlist.viewCount} 조회</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{playlist.likeCount || 0}</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {isSaved ? (
                    <BookmarkSolidIcon className="w-5 h-5 text-primary-500" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  <span>{playlist.saveCount}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span>공유</span>
            </button>

            {playlist.canEdit && (
              <>
                <Link
                  to={`/playlist/${id}/edit`}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  <PencilIcon className="w-5 h-5" />
                  <span>편집</span>
                </Link>
                
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${playlist.createdBy.username}`}
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <img
              src={playlist.createdBy.profileImage || getDefaultAvatar(playlist.createdBy.username, 40)}
              alt={playlist.createdBy.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{playlist.createdBy.username}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(playlist.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
              </p>
            </div>
          </Link>

          {playlist.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {playlist.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 지도 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">맛집리스트 지도</h2>
          <KoreanMap 
            restaurants={restaurants}
            className="w-full h-[400px]"
          />
        </div>

        {/* 맛집 목록 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">맛집 목록</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {playlist.restaurants.map((item: any, index: number) => {
              // Handle both old and new data formats
              const restaurant = item.restaurant || {
                _id: item.name?.replace(/\s/g, '-').toLowerCase() || Math.random().toString(),
                name: item.name || 'Unknown',
                category: item.category || 'Unknown',
                address: item.address || 'Address not available',
                rating: item.rating || 0
              };
              
              return (
                <div
                  key={restaurant._id}
                  className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedRestaurant({ ...restaurant, playlistNote: item.personalNote, mustTryMenus: item.mustTry });
                    setShowRestaurantDetail(true);
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {restaurant.category}
                        </span>
                        {restaurant.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{restaurant.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {item.personalNote && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          💭 {item.personalNote}
                        </p>
                      )}

                      {item.mustTry && item.mustTry.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">추천 메뉴:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.mustTry.map((menu: string) => (
                              <span
                                key={menu}
                                className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                              >
                                {menu}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 저장 버튼 */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              toast.error('로그인이 필요합니다.');
                              return;
                            }
                            
                            const isRestaurantSaved = savedRestaurants.includes(restaurant._id);
                            if (isRestaurantSaved) {
                              dataManager.unsaveRestaurant(restaurant._id);
                              toast.success('저장 취소');
                              setSavedRestaurants(prev => prev.filter(id => id !== restaurant._id));
                            } else {
                              // localRestaurants에도 저장
                              const localRestaurants = localStorage.getItem('localRestaurants');
                              const restaurants = localRestaurants ? JSON.parse(localRestaurants) : [];
                              if (!restaurants.find((r: any) => r._id === restaurant._id)) {
                                restaurants.push(restaurant);
                                localStorage.setItem('localRestaurants', JSON.stringify(restaurants));
                              }
                              
                              dataManager.saveRestaurant(restaurant._id, `${playlist.title}에서 저장`);
                              toast.success('맛집이 저장되었습니다!');
                              setSavedRestaurants(prev => [...prev, restaurant._id]);
                            }
                          }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            savedRestaurants.includes(restaurant._id)
                              ? 'bg-primary-500 text-white hover:bg-primary-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {savedRestaurants.includes(restaurant._id) ? (
                            <BookmarkSolidIcon className="w-4 h-4" />
                          ) : (
                            <BookmarkIcon className="w-4 h-4" />
                          )}
                          {savedRestaurants.includes(restaurant._id) ? '저장됨' : '저장'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 리믹스 및 완주 버튼 */}
      {user && user._id !== playlist.createdBy._id && (
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">이 맛집리스트가 마음에 드시나요?</h3>
              <p className="text-gray-600">나만의 버전으로 리믹스하거나 완주에 도전해보세요!</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/playlist/${id}/remix`}
                className="btn btn-outline flex items-center space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>리믹스</span>
              </Link>
              <button
                className="btn btn-primary flex items-center space-x-2"
                onClick={() => {
                  // TODO: 완주 기능 구현
                  toast.success('완주 기능은 곧 출시됩니다!');
                }}
              >
                <span>🏁 완주하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">맛집리스트 공유</h3>
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                📋 링크 복사
              </button>
              <button
                onClick={() => {
                  const text = `${playlist.title} - BobMap에서 확인하세요! ${window.location.href}`;
                  if (navigator.share) {
                    navigator.share({ title: playlist.title, text, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(text);
                    toast.success('공유 내용이 클립보드에 복사되었습니다!');
                  }
                  setShowShareModal(false);
                }}
                className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                📱 모바일 공유
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 레스토랑 상세 모달 */}
      {showRestaurantDetail && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
              <button
                onClick={() => {
                  setShowRestaurantDetail(false);
                  setSelectedRestaurant(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRestaurant.category}
                  </span>
                  {selectedRestaurant.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedRestaurant.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {selectedRestaurant.address}
                </p>
              </div>

              {/* 플레이리스트 작성자의 노트 */}
              {selectedRestaurant.playlistNote && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-800 mb-1">💭 플레이리스트 작성자의 한마디</p>
                  <p className="text-gray-700">{selectedRestaurant.playlistNote}</p>
                </div>
              )}

              {/* 추천 메뉴 */}
              {selectedRestaurant.mustTryMenus && selectedRestaurant.mustTryMenus.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">🍽️ 추천 메뉴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.mustTryMenus.map((menu: string) => (
                      <span key={menu} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {menu}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error('로그인이 필요합니다.');
                      return;
                    }
                    
                    const isRestaurantSaved = savedRestaurants.includes(selectedRestaurant._id);
                    if (isRestaurantSaved) {
                      dataManager.unsaveRestaurant(selectedRestaurant._id);
                      toast.success('저장 취소');
                      setSavedRestaurants(prev => prev.filter(id => id !== selectedRestaurant._id));
                    } else {
                      // localRestaurants에도 저장
                      const localRestaurants = localStorage.getItem('localRestaurants');
                      const restaurants = localRestaurants ? JSON.parse(localRestaurants) : [];
                      if (!restaurants.find((r: any) => r._id === selectedRestaurant._id)) {
                        restaurants.push(selectedRestaurant);
                        localStorage.setItem('localRestaurants', JSON.stringify(restaurants));
                      }
                      
                      dataManager.saveRestaurant(selectedRestaurant._id, `${playlist.title}에서 저장`);
                      toast.success('맛집이 저장되었습니다!');
                      setSavedRestaurants(prev => [...prev, selectedRestaurant._id]);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    savedRestaurants.includes(selectedRestaurant._id)
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {savedRestaurants.includes(selectedRestaurant._id) ? (
                    <>
                      <BookmarkSolidIcon className="w-5 h-5 inline mr-2" />
                      저장됨
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5 inline mr-2" />
                      맛집 저장
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    navigate(`/restaurant-map?restaurant=${selectedRestaurant._id}`);
                  }}
                  className="flex-1 py-3 px-4 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
                >
                  <MapPinIcon className="w-5 h-5 inline mr-2" />
                  지도에서 보기
                </button>
              </div>

              {/* 리뷰 작성 */}
              {user && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      toast.success('리뷰 작성 기능은 준비 중입니다.');
                    }}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 inline mr-2" />
                    리뷰 작성하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;