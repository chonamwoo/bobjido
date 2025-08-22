import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  BeakerIcon,
  SparklesIcon,
  ChartBarIcon,
  FireIcon,
  HeartIcon,
  StarIcon,
  TrophyIcon,
  LightBulbIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface TasteStats {
  totalRestaurants: number;
  favoriteCategory: string;
  averageRating: number;
  priceRange: string;
  topArea: string;
  tasteType: string;
  matchingUsers: number;
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface AreaData {
  name: string;
  visits: number;
  favorites: number;
}

const TasteAnalysis: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // 가짜 데이터
  const stats: TasteStats = {
    totalRestaurants: 56,
    favoriteCategory: '일식',
    averageRating: 4.3,
    priceRange: '₩₩₩',
    topArea: '강남',
    tasteType: user?.tasteProfile?.type || '매콤한 모험가',
    matchingUsers: 234
  };

  const categories: CategoryData[] = [
    { name: '일식', count: 18, percentage: 32, trend: 'up' },
    { name: '한식', count: 12, percentage: 21, trend: 'stable' },
    { name: '양식', count: 10, percentage: 18, trend: 'up' },
    { name: '중식', count: 8, percentage: 14, trend: 'down' },
    { name: '카페', count: 5, percentage: 9, trend: 'up' },
    { name: '기타', count: 3, percentage: 6, trend: 'stable' }
  ];

  const areas: AreaData[] = [
    { name: '강남', visits: 23, favorites: 8 },
    { name: '홍대', visits: 15, favorites: 5 },
    { name: '성수', visits: 10, favorites: 4 },
    { name: '이태원', visits: 5, favorites: 2 },
    { name: '종로', visits: 3, favorites: 1 }
  ];

  const tasteTypeColors: Record<string, string> = {
    '매콤한 모험가': 'from-red-500 to-orange-500',
    '힙스터 탐험가': 'from-purple-500 to-pink-500',
    '편안함 추구자': 'from-blue-500 to-cyan-500',
    '가성비 마스터': 'from-green-500 to-emerald-500',
    '프리미엄 감별사': 'from-amber-500 to-yellow-500',
    '소셜 다이너': 'from-indigo-500 to-purple-500',
    '건강식 애호가': 'from-teal-500 to-green-500',
    '다국적 미식가': 'from-rose-500 to-pink-500'
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />;
    return <span className="w-4 h-4 text-gray-400">-</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BeakerIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">취향 분석 리포트</h1>
                <p className="text-gray-600">당신의 맛집 취향을 분석해봤어요</p>
              </div>
            </div>
            <div className={`px-4 py-2 bg-gradient-to-r ${tasteTypeColors[stats.tasteType]} text-white rounded-full font-bold`}>
              {stats.tasteType}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
          <div className="flex gap-2">
            {['overview', 'categories', 'areas', 'trends'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'overview' && '개요'}
                {tab === 'categories' && '카테고리'}
                {tab === 'areas' && '지역'}
                {tab === 'trends' && '트렌드'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <MapPinIcon className="w-8 h-8 text-purple-500" />
                <span className="text-2xl font-bold">{stats.totalRestaurants}</span>
              </div>
              <p className="text-gray-600 text-sm">방문한 맛집</p>
              <p className="text-xs text-gray-500 mt-1">지난달 대비 +12%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <HeartIcon className="w-8 h-8 text-red-500" />
                <span className="text-2xl font-bold">{stats.favoriteCategory}</span>
              </div>
              <p className="text-gray-600 text-sm">최애 카테고리</p>
              <p className="text-xs text-gray-500 mt-1">32% 선호도</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <StarIcon className="w-8 h-8 text-yellow-500" />
                <span className="text-2xl font-bold">{stats.averageRating}</span>
              </div>
              <p className="text-gray-600 text-sm">평균 평점</p>
              <p className="text-xs text-gray-500 mt-1">까다로운 편</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <UserGroupIcon className="w-8 h-8 text-blue-500" />
                <span className="text-2xl font-bold">{stats.matchingUsers}</span>
              </div>
              <p className="text-gray-600 text-sm">취향 매칭</p>
              <p className="text-xs text-gray-500 mt-1">비슷한 취향 사용자</p>
            </motion.div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">카테고리별 선호도</h3>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.name}</span>
                      {getTrendIcon(category.trend)}
                    </div>
                    <span className="text-sm text-gray-600">{category.count}개 방문</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">자주 가는 지역</h3>
              <div className="space-y-3">
                {areas.map((area, index) => (
                  <motion.div
                    key={area.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                        index === 0 ? 'from-yellow-400 to-orange-500' :
                        index === 1 ? 'from-gray-400 to-gray-500' :
                        'from-orange-300 to-orange-400'
                      } flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{area.name}</p>
                        <p className="text-xs text-gray-500">{area.visits}회 방문</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-gray-600">{area.favorites}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">지역별 특성</h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrophyIcon className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">강남 전문가</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    강남 지역 맛집의 41%를 탐방했어요
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <LightBulbIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">새로운 지역 추천</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    연남동, 성수동을 탐험해보세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">최근 트렌드</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">일식 관심도 급상승</span>
                  </div>
                  <span className="text-xs text-green-600">+45%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">프리미엄 레스토랑 증가</span>
                  </div>
                  <span className="text-xs text-blue-600">+23%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">브런치 카페 방문</span>
                  </div>
                  <span className="text-xs text-purple-600">+15%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">취향 진화</h3>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">85%</p>
                          <p className="text-xs text-gray-600">취향 일치도</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    당신의 취향이 점점 더 명확해지고 있어요!
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold">3개월 전</p>
                    <p className="text-xs text-gray-600">편안함 추구자</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold">현재</p>
                    <p className="text-xs text-purple-600">매콤한 모험가</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">AI 추천</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="font-medium mb-1">다음 도전 과제</p>
              <p className="text-sm opacity-90">베트남 음식에 도전해보세요!</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="font-medium mb-1">취향 쌍둥이</p>
              <p className="text-sm opacity-90">@foodie_kim님과 92% 일치</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="font-medium mb-1">숨은 맛집</p>
              <p className="text-sm opacity-90">을지로 3가 골목 탐험 추천</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteAnalysis;