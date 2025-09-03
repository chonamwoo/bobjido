import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  StarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HeartIcon,
  BookmarkIcon,
  CameraIcon,
  UserGroupIcon,
  UserIcon,
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  category: string;
  priceRange: string;
  averageRating: number;
  reviewCount: number;
  images: { url: string }[];
  dnaProfile?: {
    atmosphere?: string[];
    foodStyle?: string[];
    instagramability?: number;
    dateSpot?: number;
    groupFriendly?: number;
    soloFriendly?: number;
  };
  tags?: string[];
  businessHours?: any;
  phoneNumber?: string;
  distance?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  viewCount?: number;
}

interface EnhancedRestaurantCardProps {
  restaurant: Restaurant;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
}

const EnhancedRestaurantCard: React.FC<EnhancedRestaurantCardProps> = ({ 
  restaurant, 
  onLike,
  onSave 
}) => {
  const getPriceLevel = (range: string) => {
    switch(range) {
      case '저렴한': return '₩';
      case '보통': return '₩₩';
      case '비싼': return '₩₩₩';
      case '매우비싼': return '₩₩₩₩';
      default: return '₩₩';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '한식': 'bg-red-100 text-red-700',
      '중식': 'bg-orange-100 text-orange-700',
      '일식': 'bg-blue-100 text-blue-700',
      '양식': 'bg-purple-100 text-purple-700',
      '카페': 'bg-amber-100 text-amber-700',
      '주점': 'bg-green-100 text-green-700',
      '디저트': 'bg-pink-100 text-pink-700',
      '패스트푸드': 'bg-yellow-100 text-yellow-700',
      '동남아': 'bg-teal-100 text-teal-700',
      '기타': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['기타'];
  };

  const isOpen = () => {
    if (!restaurant.businessHours) return null;
    const now = new Date();
    const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const hours = restaurant.businessHours[day];
    if (!hours || !hours.isOpen) return false;
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const restaurantImage = restaurant.images?.[0]?.url || 
    `https://images.unsplash.com/photo-${
      ['1517248135467-4c7edcad34c4', '1555396273-eb8052c4862a', '1559181567-c3190ca9959b'][
        Math.floor(Math.random() * 3)
      ]
    }?w=800&h=600&fit=crop`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/restaurant/${restaurant._id}`}>
        {/* 이미지 섹션 - 더 크게 */}
        <div className="relative h-56 overflow-hidden group">
          <img 
            src={restaurantImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
            }}
          />
          
          {/* 오버레이 정보 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {restaurant.dnaProfile && (
                <div className="flex gap-3 text-sm mb-2">
                  {restaurant.dnaProfile.instagramability && restaurant.dnaProfile.instagramability >= 4 && (
                    <div className="flex items-center gap-1">
                      <CameraIcon className="w-4 h-4" />
                      <span>인스타맛집</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.dateSpot && restaurant.dnaProfile.dateSpot >= 4 && (
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>데이트</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.soloFriendly && restaurant.dnaProfile.soloFriendly >= 4 && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      <span>혼밥</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.groupFriendly && restaurant.dnaProfile.groupFriendly >= 4 && (
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>모임</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <span>{restaurant.viewCount || 0} views</span>
              </div>
            </div>
          </div>

          {/* 카테고리 뱃지 */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(restaurant.category)}`}>
              {restaurant.category}
            </span>
          </div>

          {/* 영업 상태 */}
          {isOpen() !== null && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isOpen() ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {isOpen() ? '영업중' : '영업종료'}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* 정보 섹션 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/restaurant/${restaurant._id}`} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
          </Link>
          <div className="flex gap-1 ml-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onLike?.(restaurant._id);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {restaurant.isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave?.(restaurant._id);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {restaurant.isSaved ? (
                <BookmarkSolidIcon className="w-5 h-5 text-orange-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* 평점과 리뷰 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(restaurant.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-1">
              {restaurant.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            리뷰 {restaurant.reviewCount}개
          </span>
          <span className="text-sm font-medium text-gray-700">
            {getPriceLevel(restaurant.priceRange)}
          </span>
        </div>

        {/* 위치 정보 */}
        <div className="flex items-start gap-1 mb-3">
          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-1">
            {restaurant.address}
          </p>
          {restaurant.distance && (
            <span className="text-sm text-orange-600 font-medium ml-auto flex-shrink-0">
              {restaurant.distance < 1000 
                ? `${restaurant.distance}m` 
                : `${(restaurant.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        {/* DNA 특성 태그 */}
        {restaurant.dnaProfile && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.dnaProfile.atmosphere?.slice(0, 2).map((atm, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {atm}
              </span>
            ))}
            {restaurant.dnaProfile.foodStyle?.slice(0, 1).map((style, idx) => (
              <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs">
                {style}
              </span>
            ))}
          </div>
        )}

        {/* 추가 정보 아이콘 */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          {restaurant.phoneNumber && (
            <div className="flex items-center gap-1 text-gray-500">
              <PhoneIcon className="w-3.5 h-3.5" />
              <span className="text-xs">전화가능</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-500">
            <ClockIcon className="w-3.5 h-3.5" />
            <span className="text-xs">예약가능</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <BuildingOfficeIcon className="w-3.5 h-3.5" />
            <span className="text-xs">주차</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <TruckIcon className="w-3.5 h-3.5" />
            <span className="text-xs">배달</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedRestaurantCard;