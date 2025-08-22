import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RestaurantCardWithBadge from '../components/RestaurantCardWithBadge';
import { getRestaurantImage } from '../utils/restaurantImages';
import { getUserAvatar } from '../utils/userAvatars';
import {
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  FunnelIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const CertifiedRestaurants: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const certifiedRestaurants = [
    {
      id: '1',
      name: '나폴리의 태양',
      category: '이탈리안',
      location: '이태원',
      rating: 4.9,
      priceRange: '₩₩₩',
      image: getRestaurantImage('나폴리의 태양'),
      whyISaved: '나폴리에서 먹던 그 맛 그대로! 진짜 나폴리 피자를 찾는다면 여기',
      certification: {
        type: '여행 전문가',
        badge: '✈️',
        verifier: '나폴리 3년 유학생',
        verifiedAt: '2024-01-15'
      },
      author: {
        name: '이탈리아러버',
        avatar: getUserAvatar('이탈리아러버'),
        isExpert: true
      },
      savedBy: 234,
      reviews: 89
    },
    {
      id: '2',
      name: '스시 하나',
      category: '일식',
      location: '청담동',
      rating: 4.8,
      priceRange: '₩₩₩₩',
      image: getRestaurantImage('스시 하나'),
      whyISaved: '도쿄 긴자에서도 이 정도 퀄리티는 드물어요',
      certification: {
        type: '전문가 인증',
        badge: '👨‍🍳',
        verifier: '前 긴자 스시야 셰프',
        verifiedAt: '2024-01-20'
      },
      author: {
        name: '스시마스터',
        avatar: getUserAvatar('스시마스터'),
        isExpert: true
      },
      savedBy: 567,
      reviews: 123
    },
    {
      id: '3',
      name: '대구막창',
      category: '한식',
      location: '대구 동성로',
      rating: 4.7,
      priceRange: '₩₩',
      image: getRestaurantImage('대구막창'),
      whyISaved: '대구 토박이만 아는 진짜 막창집',
      certification: {
        type: '현지인 인증',
        badge: '🏠',
        verifier: '대구 30년 토박이',
        verifiedAt: '2024-01-10'
      },
      author: {
        name: '대구청년',
        avatar: getUserAvatar('대구청년'),
        isExpert: false
      },
      savedBy: 189,
      reviews: 67
    },
    {
      id: '4',
      name: '방콕 스트릿',
      category: '태국 음식',
      location: '연남동',
      rating: 4.6,
      priceRange: '₩₩',
      image: getRestaurantImage('방콕 스트릿'),
      whyISaved: '방콕 길거리에서 먹던 똠양꿍 그 맛!',
      certification: {
        type: '여행 전문가',
        badge: '✈️',
        verifier: '방콕 50회 방문',
        verifiedAt: '2024-01-18'
      },
      author: {
        name: '동남아덕후',
        avatar: getUserAvatar('동남아덕후'),
        isExpert: true
      },
      savedBy: 312,
      reviews: 98
    },
    {
      id: '5',
      name: '할랄 가이즈',
      category: '중동 음식',
      location: '이태원',
      rating: 4.5,
      priceRange: '₩',
      image: getRestaurantImage('할랄 가이즈'),
      whyISaved: '무슬림도 안심하고 먹을 수 있는 정통 할랄 푸드',
      certification: {
        type: '문화 전문가',
        badge: '🌏',
        verifier: '할랄 인증 전문가',
        verifiedAt: '2024-01-12'
      },
      author: {
        name: '할랄푸디',
        avatar: getUserAvatar('할랄푸디'),
        isExpert: true
      },
      savedBy: 156,
      reviews: 45
    },
    {
      id: '6',
      name: '텍사스 BBQ',
      category: '양식',
      location: '한남동',
      rating: 4.8,
      priceRange: '₩₩₩',
      image: getRestaurantImage('텍사스 BBQ'),
      whyISaved: '텍사스에서 먹던 그 스모키한 맛 완벽 재현',
      certification: {
        type: '음식 애호가',
        badge: '🍽️',
        verifier: 'BBQ 100곳 순례자',
        verifiedAt: '2024-01-25'
      },
      author: {
        name: 'BBQ헌터',
        avatar: getUserAvatar('BBQ헌터'),
        isExpert: true
      },
      savedBy: 423,
      reviews: 156
    }
  ];

  const filterOptions = [
    { value: 'all', label: '전체', icon: SparklesIcon },
    { value: '현지인 인증', label: '현지인 인증', icon: ShieldCheckIcon },
    { value: '전문가 인증', label: '전문가 인증', icon: TrophyIcon },
    { value: '여행 전문가', label: '여행 전문가', icon: FireIcon },
    { value: '음식 애호가', label: '음식 애호가', icon: CheckBadgeIcon },
    { value: '문화 전문가', label: '문화 전문가', icon: FunnelIcon }
  ];

  const filteredRestaurants = selectedFilter === 'all' 
    ? certifiedRestaurants 
    : certifiedRestaurants.filter(r => r.certification?.type === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">인증된 맛집</h1>
              <p className="text-gray-600">전문가와 현지인이 인증한 진짜 맛집들</p>
            </div>
          </div>
        </motion.div>

        {/* 인증 시스템 설명 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8"
        >
          <h2 className="font-bold text-gray-900 mb-3">🏆 BobMap 인증 시스템</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏠</span>
                <h3 className="font-bold text-gray-800">현지인 인증</h3>
              </div>
              <p className="text-sm text-gray-600">
                10년 이상 거주한 토박이들이 추천하는 로컬 맛집
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👨‍🍳</span>
                <h3 className="font-bold text-gray-800">전문가 인증</h3>
              </div>
              <p className="text-sm text-gray-600">
                셰프, 요리사 등 업계 종사자가 인정한 맛집
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✈️</span>
                <h3 className="font-bold text-gray-800">여행 전문가</h3>
              </div>
              <p className="text-sm text-gray-600">
                해당 지역 거주 경험자가 보증하는 본토의 맛
              </p>
            </div>
          </div>
        </motion.div>

        {/* 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {filterOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  selectedFilter === option.value
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>

        {/* 인증 맛집 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RestaurantCardWithBadge restaurant={restaurant} />
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <ShieldCheckIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              이 카테고리에 인증된 맛집이 없어요
            </h3>
            <p className="text-gray-600">
              다른 인증 카테고리를 선택해보세요
            </p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-3">당신도 맛집 전문가가 되어보세요!</h2>
          <p className="mb-6 opacity-90">
            특별한 경험과 전문성으로 다른 사람들에게 신뢰받는 맛집을 추천해보세요
          </p>
          <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-bold hover:shadow-lg transition-all">
            인증 신청하기
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CertifiedRestaurants;