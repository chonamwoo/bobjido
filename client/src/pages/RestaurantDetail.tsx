import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import KoreanMap from '../components/KoreanMap';
import { 
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  BookmarkIcon,
  ShareIcon,
  CheckBadgeIcon,
  PhotoIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useAuthStore } from '../store/authStore';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: restaurantData, isLoading, error } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await axios.get(`/api/restaurants/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/restaurants/${id}/verify`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '검증에 실패했습니다.');
    },
  });

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('링크가 클립보드에 복사되었습니다!');
  };

  // 디버그: 현재 상태 표시
  console.log('RestaurantDetail - ID:', id);
  console.log('RestaurantDetail - Loading:', isLoading);
  console.log('RestaurantDetail - Error:', error);
  console.log('RestaurantDetail - Data:', restaurantData);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p>맛집 정보 로딩 중... (ID: {id})</p>
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

  if (!restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">맛집을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 맛집이 존재하지 않거나 삭제되었습니다. (ID: {id})</p>
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const { restaurant, playlistsIncluding } = restaurantData;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 헤더 이미지 */}
      {false && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="relative">
            <img
              src={restaurant.images[selectedImageIndex].url}
              alt={restaurant.name}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {restaurant.images.length}
            </div>
          </div>
          
          {restaurant.images.length > 1 && (
            <div className="p-4">
              <div className="flex space-x-2 overflow-x-auto">
                {restaurant.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-primary-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${restaurant.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 메인 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                  {restaurant.isVerified && (
                    <CheckBadgeIcon className="w-8 h-8 text-blue-500" title="검증된 맛집" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <span className="flex items-center">
                    <StarIcon className="w-5 h-5 mr-1 text-yellow-500" />
                    {restaurant.averageRating > 0 ? restaurant.averageRating.toFixed(1) : 'N/A'}
                  </span>
                  <span>리뷰 {restaurant.reviewCount}개</span>
                  <span className="flex items-center">
                    <EyeIcon className="w-5 h-5 mr-1" />
                    {restaurant.viewCount} 조회
                  </span>
                </div>

                <p className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  {restaurant.address}
                </p>

                {restaurant.roadAddress && restaurant.roadAddress !== restaurant.address && (
                  <p className="text-gray-500 text-sm ml-7">
                    도로명: {restaurant.roadAddress}
                  </p>
                )}

                {restaurant.phoneNumber && (
                  <p className="flex items-center text-gray-600 mt-2">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    {restaurant.phoneNumber}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span>공유</span>
                </button>

                {user && (
                  <button
                    onClick={() => verifyMutation.mutate()}
                    disabled={verifyMutation.isPending}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <CheckBadgeIcon className="w-5 h-5" />
                    <span>검증</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {restaurant.category}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {restaurant.priceRange}
              </span>
            </div>

            {/* 태그 */}
            {restaurant.tags && restaurant.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <TagIcon className="w-5 h-5 mr-2" />
                  태그
                </h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* DNA 프로필 */}
            {restaurant.dnaProfile && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">맛집 DNA</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">인스타그램성</span>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (restaurant.dnaProfile.instagramability || 0)
                              ? 'bg-pink-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">데이트 적합도</span>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (restaurant.dnaProfile.dateSpot || 0)
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">단체 모임</span>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (restaurant.dnaProfile.groupFriendly || 0)
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">혼밥 적합도</span>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < (restaurant.dnaProfile.soloFriendly || 0)
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 메뉴 */}
          {restaurant.menuItems && restaurant.menuItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">메뉴</h2>
              <div className="space-y-3">
                {restaurant.menuItems.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        {item.name}
                        {item.isPopular && (
                          <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            인기
                          </span>
                        )}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      )}
                    </div>
                    {item.price && (
                      <span className="font-semibold text-primary-600">
                        {item.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 평가 섹션 - 심플하고 모던한 디자인 */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">평가</h2>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(restaurant.averageRating || 4.5) 
                        ? 'text-orange-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-2xl font-bold">{(restaurant.averageRating || 4.5).toFixed(1)}</span>
              </div>
            </div>
            
            {/* 간단한 평가 태그들 */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '😋', label: '맛있어요', count: 234 },
                { icon: '💰', label: '가성비 좋아요', count: 156 },
                { icon: '🎨', label: '분위기 좋아요', count: 189 },
                { icon: '👨‍👩‍👧‍👦', label: '가족모임 추천', count: 67 },
                { icon: '📸', label: '사진맛집', count: 123 },
                { icon: '🚗', label: '주차 편해요', count: 45 }
              ].map((tag, index) => (
                <div
                  key={index}
                  className="bg-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className="text-lg">{tag.icon}</span>
                  <span className="text-sm font-medium">{tag.label}</span>
                  <span className="text-xs text-gray-500">({tag.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 섹션 - 심플한 디자인 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">플레이리스트에 추가한 이유</h2>
              <span className="text-sm text-gray-500">{playlistsIncluding.length}개 플레이리스트</span>
            </div>
            <div className="space-y-3">
              {playlistsIncluding.length > 0 ? (
                playlistsIncluding.map((playlist: any) => (
                  <div key={playlist._id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <img
                      src={playlist.createdBy?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(playlist.createdBy?.username || 'User')}&background=FF6B6B&color=fff`}
                      alt={playlist.createdBy?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{playlist.createdBy?.username || 'Unknown'}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <Link to={`/playlists/${playlist._id}`} className="text-xs text-primary-500 hover:underline">
                          {playlist.title}
                        </Link>
                      </div>
                      <p className="text-gray-700 text-sm">{playlist.personalNote || '맛있어서 추가했어요!'}</p>
                      {playlist.mustTry && playlist.mustTry.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {playlist.mustTry.map((item: string, idx: number) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">아직 플레이리스트에 추가되지 않았어요</p>
                  {user && (
                    <Link to="/playlists/create" className="text-primary-500 text-sm hover:underline mt-2 inline-block">
                      첫 번째로 추가하기
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 영업시간 */}
          {restaurant.businessHours && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 mr-2" />
                영업시간
              </h2>
              <div className="space-y-2">
                {Object.entries(restaurant.businessHours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">
                      {day === 'monday' && '월요일'}
                      {day === 'tuesday' && '화요일'}
                      {day === 'wednesday' && '수요일'}
                      {day === 'thursday' && '목요일'}
                      {day === 'friday' && '금요일'}
                      {day === 'saturday' && '토요일'}
                      {day === 'sunday' && '일요일'}
                    </span>
                    <span className={hours.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {hours.isOpen && hours.open && hours.close
                        ? `${hours.open} - ${hours.close}`
                        : '휴무'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 지도 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">위치</h2>
            <KoreanMap 
              restaurants={[restaurant]}
              className="w-full h-[250px]"
            />
          </div>

          {/* 포함된 맛집리스트 */}
          {playlistsIncluding && playlistsIncluding.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">이 맛집이 포함된 맛집리스트</h2>
              <div className="space-y-3">1
                {playlistsIncluding.map((playlist: any) => (
                  <Link
                    key={playlist._id}
                    to={`/playlist/${playlist._id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-sm">{playlist.title}</h3>
                    <p className="text-gray-600 text-xs mt-1">{playlist.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        by {playlist.createdBy.username}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>❤️ {playlist.likeCount}</span>
                        <span>💾 {playlist.saveCount}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 비슷한 맛집 */}
          {restaurant.similarRestaurants && restaurant.similarRestaurants.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">비슷한 맛집</h2>
              <div className="space-y-3">
                {restaurant.similarRestaurants.map((similar: any) => (
                  <Link
                    key={similar.restaurant._id}
                    to={`/restaurant/${similar.restaurant._id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-sm">{similar.restaurant.name}</h3>
                    <p className="text-gray-600 text-xs">{similar.restaurant.address}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {similar.restaurant.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {similar.similarity}% 유사
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 맛집 정보 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">맛집 정보</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">등록일</span>
                <span>{format(new Date(restaurant.createdAt), 'yyyy.MM.dd', { locale: ko })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">등록자</span>
                <Link 
                  to={`/profile/${restaurant.createdBy.username}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {restaurant.createdBy.username}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">검증 수</span>
                <span>{restaurant.verifiedBy?.length || 0}명</span>
              </div>
              {restaurant.features && restaurant.features.length > 0 && (
                <div>
                  <span className="text-gray-500">편의시설</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {restaurant.features.map((feature: string) => (
                      <span
                        key={feature}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;