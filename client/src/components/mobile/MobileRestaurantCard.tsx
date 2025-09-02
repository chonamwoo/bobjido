import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  StarIcon, 
  EyeIcon, 
  HeartIcon,
  ShareIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface RestaurantCardProps {
  restaurant: {
    _id: string;
    name: string;
    address: string;
    category: string;
    priceRange: string;
    images?: Array<{ url: string }>;
    averageRating: number;
    reviewCount: number;
    viewCount?: number;
    views?: {
      total?: number;
      weeklyViews?: number;
      monthlyViews?: number;
    };
    interactions?: {
      likes?: Array<any>;
      saves?: Array<any>;
      shares?: Array<any>;
    };
    popularityScore?: number;
    trendingScore?: number;
    businessHours?: any;
    tags?: string[];
  };
  distance?: number;
  onClick?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

const MobileRestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  distance,
  onClick,
  onLike,
  onShare
}) => {
  const getPriceLevel = (priceRange: string) => {
    const levels: { [key: string]: string } = {
      '저렴한': '₩',
      '보통': '₩₩',
      '비싼': '₩₩₩',
      '매우비싼': '₩₩₩₩'
    };
    return levels[priceRange] || '₩₩';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      '한식': '🥘',
      '중식': '🥟',
      '일식': '🍣',
      '양식': '🍝',
      '동남아': '🍜',
      '카페': '☕',
      '디저트': '🍰',
      '주점': '🍺',
      '패스트푸드': '🍔',
      '기타': '🍴'
    };
    return emojis[category] || '🍴';
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // 실시간 통계
  const realViewCount = restaurant.views?.total || restaurant.viewCount || 0;
  const weeklyViews = restaurant.views?.weeklyViews || 0;
  const likeCount = restaurant.interactions?.likes?.length || 0;
  const saveCount = restaurant.interactions?.saves?.length || 0;

  // 현재 영업 중인지 확인
  const isOpen = () => {
    if (!restaurant.businessHours) return null;
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const hours = restaurant.businessHours[day];
    
    if (!hours || !hours.isOpen) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const [openHour, openMin] = (hours.open || '00:00').split(':').map(Number);
    const [closeHour, closeMin] = (hours.close || '00:00').split(':').map(Number);
    const openTime = openHour * 100 + openMin;
    const closeTime = closeHour * 100 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openStatus = isOpen();

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      {/* 이미지 섹션 */}
      <div className="relative h-40">
        {restaurant.images && restaurant.images.length > 0 ? (
          <img
            src={restaurant.images[0].url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-4xl">{getCategoryEmoji(restaurant.category)}</span>
          </div>
        )}

        {/* 상단 뱃지들 */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="flex space-x-1">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
              {restaurant.category}
            </span>
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
              {getPriceLevel(restaurant.priceRange)}
            </span>
          </div>
          
          {/* 트렌딩 뱃지 */}
          {restaurant.trendingScore && restaurant.trendingScore > 50 && (
            <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
              🔥 인기
            </span>
          )}
        </div>

        {/* 영업 상태 */}
        {openStatus !== null && (
          <div className="absolute bottom-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              openStatus 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
            }`}>
              {openStatus ? '영업중' : '영업종료'}
            </span>
          </div>
        )}
      </div>

      {/* 정보 섹션 */}
      <div className="p-4">
        {/* 이름 및 평점 */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 flex-1 mr-2">
            {restaurant.name}
          </h3>
          <div className="flex items-center">
            <StarSolid className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{restaurant.averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({restaurant.reviewCount})</span>
          </div>
        </div>

        {/* 주소 및 거리 */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1 flex-1">{restaurant.address}</span>
          {distance && (
            <span className="ml-2 text-orange-600 font-medium">
              {distance < 1000 ? `${distance}m` : `${(distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        {/* 태그 */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {restaurant.tags.length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{restaurant.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 통계 */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {/* 조회수 */}
            <div className="flex items-center">
              <EyeIcon className="w-3.5 h-3.5 mr-0.5" />
              <span>{formatCount(realViewCount)}</span>
              {weeklyViews > 0 && (
                <span className="text-green-600 ml-0.5">
                  ↑{formatCount(weeklyViews)}
                </span>
              )}
            </div>
            
            {/* 좋아요 */}
            <div className="flex items-center">
              <HeartIcon className="w-3.5 h-3.5 mr-0.5" />
              <span>{formatCount(likeCount)}</span>
            </div>
            
            {/* 저장 */}
            <div className="flex items-center">
              <StarIcon className="w-3.5 h-3.5 mr-0.5" />
              <span>{formatCount(saveCount)}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HeartIcon className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShareIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 인기도 점수 바 */}
        {restaurant.popularityScore && restaurant.popularityScore > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>인기도</span>
              <span className="font-medium">{Math.round(restaurant.popularityScore)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full transition-all"
                style={{ width: `${Math.min((restaurant.popularityScore / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileRestaurantCard;