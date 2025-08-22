import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Certification {
  type: string;
  badge: string;
  verifier: string;
  verifiedAt: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  priceRange: string;
  image: string;
  whyISaved?: string;
  certification?: Certification;
  author: {
    name: string;
    avatar: string;
    isExpert?: boolean;
  };
  savedBy?: number;
  reviews?: number;
}

interface RestaurantCardWithBadgeProps {
  restaurant: Restaurant;
  showAuthor?: boolean;
}

const RestaurantCardWithBadge: React.FC<RestaurantCardWithBadgeProps> = ({ 
  restaurant, 
  showAuthor = true 
}) => {
  const certificationExamples = {
    '현지인 인증': {
      examples: ['대구 20년 토박이', '해운대 원주민', '을지로 3대째'],
      color: 'from-green-500 to-teal-500'
    },
    '전문가 인증': {
      examples: ['前 스시 오마카세 셰프', '이탈리안 10년차 요리사', '바리스타 자격증 보유'],
      color: 'from-blue-500 to-purple-500'
    },
    '여행 전문가': {
      examples: ['도쿄 3년 거주', '나폴리 유학생', '방콕 100회 방문'],
      color: 'from-purple-500 to-pink-500'
    },
    '음식 애호가': {
      examples: ['라멘 500그릇 완식', '전국 막걸리 투어', 'BBQ 마니아'],
      color: 'from-orange-500 to-red-500'
    },
    '문화 전문가': {
      examples: ['중국어 통역사', '할랄 음식 전문가', '비건 10년차'],
      color: 'from-indigo-500 to-blue-500'
    }
  };

  const getCertificationColor = (type: string) => {
    return certificationExamples[type as keyof typeof certificationExamples]?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
    >
      {/* 인증 뱃지 (상단) */}
      {restaurant.certification && (
        <div className={`bg-gradient-to-r ${getCertificationColor(restaurant.certification.type)} p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{restaurant.certification.badge}</span>
              <div className="text-white">
                <p className="text-xs font-medium opacity-90">{restaurant.certification.type}</p>
                <p className="text-sm font-bold">{restaurant.certification.verifier}</p>
              </div>
            </div>
            <CheckBadgeIcon className="w-6 h-6 text-white/80" />
          </div>
        </div>
      )}

      {/* 이미지 */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* 카테고리 & 가격대 */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">
            {restaurant.category}
          </span>
          <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold">
            {restaurant.priceRange}
          </span>
        </div>

        {/* 저장 버튼 */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <BookmarkIcon className="w-5 h-5 text-gray-700" />
        </button>

        {/* 위치 */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{restaurant.location}</span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 제목 & 평점 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700 ml-1">{restaurant.rating}</span>
              </div>
              {restaurant.reviews && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-600">리뷰 {restaurant.reviews}개</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 저장 이유 */}
        {restaurant.whyISaved && (
          <div className="bg-orange-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-orange-800">
              <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
              "{restaurant.whyISaved}"
            </p>
          </div>
        )}

        {/* 인증 상세 (카드 내부) */}
        {restaurant.certification && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-800 mb-1">
                  {restaurant.certification.type} 인증
                </p>
                <p className="text-xs text-blue-700">
                  {restaurant.certification.verifier}가 인증한 진짜 {restaurant.category} 맛집
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 작성자 정보 */}
        {showAuthor && restaurant.author && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <Link to={`/profile/${restaurant.author.name}`} className="flex items-center gap-2">
              <img
                src={restaurant.author.avatar}
                alt={restaurant.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-700 font-medium">
                {restaurant.author.name}
              </span>
              {restaurant.author.isExpert && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  전문가
                </span>
              )}
            </Link>
            
            {/* 상호작용 버튼 */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                <HeartIcon className="w-4 h-4" />
                <span className="text-xs">{restaurant.savedBy || 0}</span>
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantCardWithBadge;