import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  StarIcon,
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  CameraIcon,
  UserGroupIcon,
  UserIcon,
  ClockIcon,
  PhoneIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { isOpenNow } from '../data/restaurantFilters';

// 미디어 인증 정보
const mediaCertificationInfo: { [key: string]: { name: string, icon: string, color: string } } = {
  michelin: { name: '미쉐린', icon: '⭐', color: 'bg-red-600' },
  blacknwhite: { name: '흑백요리사', icon: '👨‍🍳', color: 'bg-gray-900' },
  wednesday: { name: '수요미식회', icon: '🍽️', color: 'bg-blue-600' },
  baekjongwon: { name: '백종원3대천왕', icon: '👑', color: 'bg-yellow-500' },
  lifemaster: { name: '생활의달인', icon: '🏆', color: 'bg-purple-600' },
  foodfighters: { name: '맛있는녀석들', icon: '🍖', color: 'bg-orange-600' },
  sungsikyung: { name: '성시경', icon: '🎤', color: 'bg-green-600' },
  heoymans: { name: '허영만백반', icon: '🍚', color: 'bg-amber-700' },
  centurystore: { name: '백년가게', icon: '💯', color: 'bg-indigo-600' },
  choijaroad: { name: '최자로드', icon: '🛣️', color: 'bg-teal-600' },
  koreanstable: { name: '한국인의밥상', icon: '🍱', color: 'bg-amber-600' },
  alleyrestaurant: { name: '골목식당', icon: '🏘️', color: 'bg-cyan-600' },
  hiddeneatery: { name: '숨은맛집', icon: '🔍', color: 'bg-pink-600' }
};

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  category: string;
  subcategory?: string;
  priceRange: string;
  averageRating: number;
  reviewCount: number;
  images: { url: string }[];
  dnaProfile?: {
    atmosphere?: string[];
    features?: string[];
    foodStyle?: string[];
    instagramability?: number;
    dateSpot?: number;
    groupFriendly?: number;
    soloFriendly?: number;
    description?: string;
  };
  tags?: string[];
  businessHours?: any;
  openingHours?: { [key: string]: string };
  phoneNumber?: string;
  distance?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  viewCount?: number;
  certifications?: string[];
}

interface ImprovedRestaurantCardProps {
  restaurant: Restaurant;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
}

const ImprovedRestaurantCard: React.FC<ImprovedRestaurantCardProps> = ({ 
  restaurant, 
  onLike,
  onSave 
}) => {
  const getPriceLevel = (range: string) => {
    const priceMap: { [key: string]: string } = {
      'cheap': '₩',
      'moderate': '₩₩',
      'expensive': '₩₩₩',
      'veryExpensive': '₩₩₩₩',
      '저렴한': '₩',
      '보통': '₩₩',
      '비싼': '₩₩₩',
      '매우비싼': '₩₩₩₩'
    };
    return priceMap[range] || '₩₩';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '한식': 'bg-red-100 text-red-700',
      '중식': 'bg-orange-100 text-orange-700',
      '일식': 'bg-blue-100 text-blue-700',
      '양식': 'bg-purple-100 text-purple-700',
      '카페': 'bg-amber-100 text-amber-700',
      '카페/디저트': 'bg-amber-100 text-amber-700',
      '주점': 'bg-green-100 text-green-700',
      '디저트': 'bg-pink-100 text-pink-700',
      '패스트푸드': 'bg-yellow-100 text-yellow-700',
      '아시안': 'bg-teal-100 text-teal-700',
      '동남아': 'bg-teal-100 text-teal-700',
      '기타': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors['기타'];
  };

  const isCurrentlyOpen = isOpenNow(restaurant.openingHours || restaurant.businessHours);

  const restaurantImage = restaurant.images?.[0]?.url || 
    `/api/placeholder/400/300?text=${encodeURIComponent(restaurant.name)}`;

  // 대표 인증 뱃지 선택 (최대 2개)
  const topCertifications = restaurant.certifications?.slice(0, 2) || [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative"
    >
      {/* 인증 뱃지 오버레이 */}
      {topCertifications.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-3">
          <div className="flex items-center gap-2">
            {topCertifications.map(cert => {
              const info = mediaCertificationInfo[cert];
              if (!info) return null;
              return (
                <div
                  key={cert}
                  className={`${info.color} text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium backdrop-blur-sm bg-opacity-90`}
                >
                  <span>{info.icon}</span>
                  <span>{info.name}</span>
                </div>
              );
            })}
            {restaurant.certifications && restaurant.certifications.length > 2 && (
              <div className="bg-gray-900/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                +{restaurant.certifications.length - 2}
              </div>
            )}
          </div>
        </div>
      )}

      <Link to={`/restaurant/${restaurant._id}`}>
        {/* 이미지 섹션 */}
        <div className="relative h-56 overflow-hidden group">
          <img 
            src={restaurantImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
            }}
          />
          
          {/* 호버 시 추가 정보 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {restaurant.dnaProfile?.description && (
                <p className="text-sm mb-2 line-clamp-2">{restaurant.dnaProfile.description}</p>
              )}
              {restaurant.dnaProfile && (
                <div className="flex gap-3 text-xs">
                  {restaurant.dnaProfile.instagramability && restaurant.dnaProfile.instagramability >= 4 && (
                    <div className="flex items-center gap-1">
                      <CameraIcon className="w-3 h-3" />
                      <span>인스타맛집</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.dateSpot && restaurant.dnaProfile.dateSpot >= 4 && (
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-3 h-3" />
                      <span>데이트</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.soloFriendly && restaurant.dnaProfile.soloFriendly >= 4 && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      <span>혼밥</span>
                    </div>
                  )}
                  {restaurant.dnaProfile.groupFriendly && restaurant.dnaProfile.groupFriendly >= 4 && (
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-3 h-3" />
                      <span>모임</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 카테고리 뱃지 */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(restaurant.category)}`}>
                {restaurant.category}
              </span>
              {restaurant.subcategory && (
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                  {restaurant.subcategory}
                </span>
              )}
            </div>
          </div>

          {/* 영업 상태 */}
          <div className="absolute bottom-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              isCurrentlyOpen 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {isCurrentlyOpen ? '영업중' : '영업종료'}
              </div>
            </span>
          </div>
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
            리뷰 {restaurant.reviewCount}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {getPriceLevel(restaurant.priceRange)}
          </span>
        </div>

        {/* 위치 정보 */}
        <div className="flex items-start gap-1 mb-3">
          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-1 flex-1">
            {restaurant.address}
          </p>
          {restaurant.distance && (
            <span className="text-sm text-orange-600 font-medium flex-shrink-0">
              {restaurant.distance < 1000 
                ? `${restaurant.distance}m` 
                : `${(restaurant.distance / 1000).toFixed(1)}km`}
            </span>
          )}
        </div>

        {/* 특징 태그 */}
        {(restaurant.tags || restaurant.dnaProfile?.features) && (
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.dnaProfile?.features?.slice(0, 3).map((feature, idx) => {
              const featureIcons: { [key: string]: any } = {
                'parking': BuildingOfficeIcon,
                'reservation': ClockIcon,
                'delivery': TruckIcon,
                'takeout': TruckIcon,
                'wifi': PhoneIcon,
                'privateRoom': UserGroupIcon,
                'corkage': SparklesIcon
              };
              const Icon = featureIcons[feature];
              
              return (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  {Icon && <Icon className="w-3 h-3" />}
                  {feature === 'parking' && '주차'}
                  {feature === 'reservation' && '예약'}
                  {feature === 'delivery' && '배달'}
                  {feature === 'takeout' && '포장'}
                  {feature === 'wifi' && '와이파이'}
                  {feature === 'privateRoom' && '룸'}
                  {feature === 'corkage' && '콜키지'}
                  {feature === 'open24' && '24시간'}
                  {feature === 'lateNight' && '심야'}
                  {feature === 'petFriendly' && '펫가능'}
                  {feature === 'noKids' && '노키즈'}
                  {feature === 'valet' && '발렛'}
                </span>
              );
            })}
            {restaurant.dnaProfile?.atmosphere?.slice(0, 2).map((atm, idx) => (
              <span key={`atm-${idx}`} className="px-2 py-1 bg-orange-50 text-orange-600 rounded text-xs">
                {atm}
              </span>
            ))}
          </div>
        )}

        {/* 하단 추가 정보 */}
        {restaurant.certifications && restaurant.certifications.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <CheckBadgeIcon className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-gray-600">
                {restaurant.certifications.length}개 프로그램 인증
              </span>
              {restaurant.viewCount && restaurant.viewCount > 100 && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-600">
                    조회 {restaurant.viewCount.toLocaleString()}회
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImprovedRestaurantCard;