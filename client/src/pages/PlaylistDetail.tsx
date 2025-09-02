import React, { useState } from 'react';
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
  PlayIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';
import { getDefaultAvatar } from '../utils/avatars';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const response = await axios.get(`/api/playlists/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `/api/playlists/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['playlist', id], (old: any) => ({
        ...old,
        isLiked: data.isLiked,
        likeCount: data.likeCount,
      }));
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '오류가 발생했습니다.');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `/api/playlists/${id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['playlist', id], (old: any) => ({
        ...old,
        isSaved: data.isSaved,
        saveCount: data.saveCount,
      }));
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '오류가 발생했습니다.');
    },
  });

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

  const restaurants = playlist.restaurants.map((r: any) => r.restaurant);

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
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {playlist.isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{playlist.likeCount}</span>
                </button>

                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  {playlist.isSaved ? (
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
            {playlist.restaurants.map((item: any, index: number) => (
              <Link
                key={item.restaurant._id}
                to={`/restaurant/${item.restaurant._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.restaurant.address}</p>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {item.restaurant.category}
                      </span>
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
                  </div>
                </div>
              </Link>
            ))}
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
    </div>
  );
};

export default PlaylistDetail;