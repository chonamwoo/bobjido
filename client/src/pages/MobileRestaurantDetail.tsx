import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  CheckBadgeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore';

const MobileRestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: restaurant, isLoading, error } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await axios.get(`/api/restaurants/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const handleLike = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? '좋아요 취소' : '좋아요!');
  };

  const handleSave = () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      navigate('/auth');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? '저장 취소' : '저장됨!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant?.name,
        text: `${restaurant?.name} - ${restaurant?.category}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다!');
    }
  };

  const handleCall = () => {
    if (restaurant?.phoneNumber) {
      window.location.href = `tel:${restaurant.phoneNumber}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    // 더미 데이터 - 실제 맛집 정보
    const dummyRestaurant = {
      name: '미미면가 성수점',
      category: '중식',
      address: '서울 성동구 성수일로 10길 26',
      phoneNumber: '02-468-0903',
      rating: 4.6,
      reviewCount: 342,
      priceRange: '₩₩',
      images: [
        'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800'
      ],
      hours: '11:30 - 21:00',
      closedDays: '일요일',
      verified: true,
      likeCount: 521,
      shareCount: 143,
      viewCount: 2850,
      savedCount: 298
    };

    const restaurantData = restaurant || dummyRestaurant;

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* 이미지 갤러리 */}
        <div className="relative h-[250px] overflow-hidden">
          <img
            src={restaurantData.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'}
            alt={restaurantData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
        </div>

        {/* 레스토랑 정보 */}
        <div className="px-4 -mt-10 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-4">
            {/* 제목 및 카테고리 */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-xl font-bold text-gray-900">{restaurantData.name}</h1>
                {restaurantData.verified && (
                  <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>{restaurantData.category}</span>
                <span className="mx-2">•</span>
                <span>{restaurantData.priceRange}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{restaurantData.rating}</span>
                  <span className="text-gray-500 ml-1">({restaurantData.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* 통계 정보 - 가로 배치 */}
            <div className="flex justify-around py-3 border-y">
              <div className="flex items-center text-sm">
                <ShareIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-gray-700">{restaurantData.shareCount}</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckBadgeIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-gray-700">인증</span>
              </div>
              <div className="flex items-center text-sm">
                <ChatBubbleLeftIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-gray-700">{restaurantData.reviewCount}</span>
              </div>
              <div className="flex items-center text-sm">
                <EyeIcon className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-gray-700">{restaurantData.viewCount}</span>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                onClick={handleLike}
                className="flex flex-col items-center py-2"
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600" />
                )}
                <span className="text-xs text-gray-600 mt-1">좋아요</span>
              </button>
              
              <button
                onClick={handleSave}
                className="flex flex-col items-center py-2"
              >
                {isSaved ? (
                  <BookmarkSolidIcon className="w-6 h-6 text-orange-500" />
                ) : (
                  <BookmarkIcon className="w-6 h-6 text-gray-600" />
                )}
                <span className="text-xs text-gray-600 mt-1">저장</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex flex-col items-center py-2"
              >
                <ShareIcon className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">공유</span>
              </button>
              
              <button
                onClick={handleCall}
                className="flex flex-col items-center py-2"
              >
                <PhoneIcon className="w-6 h-6 text-gray-600" />
                <span className="text-xs text-gray-600 mt-1">전화</span>
              </button>
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="px-4 mt-4 space-y-4">
          {/* 위치 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">위치 정보</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                <span className="text-sm text-gray-700">{restaurantData.address}</span>
              </div>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium mt-3">
                지도에서 보기
              </button>
            </div>
          </div>

          {/* 영업 시간 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">영업 시간</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{restaurantData.hours}</span>
              </div>
              {restaurantData.closedDays && (
                <p className="text-sm text-red-600">휴무: {restaurantData.closedDays}</p>
              )}
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">리뷰</h3>
              <button className="text-sm text-orange-600">리뷰 작성</button>
            </div>
            <div className="text-center py-8 text-gray-500">
              <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">아직 리뷰가 없습니다</p>
              <p className="text-xs mt-1">첫 번째 리뷰를 작성해보세요!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileRestaurantDetail;