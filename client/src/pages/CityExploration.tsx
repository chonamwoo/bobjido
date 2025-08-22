import React from 'react';
import { motion } from 'framer-motion';
import CityExplorer from '../components/CityExplorer';
import { MapPinIcon, SparklesIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/outline';

const CityExploration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            도시별 맛집 탐험
          </h1>
          <p className="text-gray-600 text-lg">
            전국 각 도시의 숨은 맛집을 발견하고, 현지인이 추천하는 특별한 맛을 경험해보세요
          </p>
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">도시</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3,842</p>
                <p className="text-sm text-gray-600">맛집</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FireIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">892</p>
                <p className="text-sm text-gray-600">핫플레이스</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">이달의 맛집</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CityExplorer 컴포넌트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CityExplorer />
        </motion.div>

        {/* 추가 정보 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">🏆 이달의 인기 도시</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">1. 제주</span>
                <span className="text-sm text-gray-500">892명 방문</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">2. 부산</span>
                <span className="text-sm text-gray-500">678명 방문</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">3. 강릉</span>
                <span className="text-sm text-gray-500">456명 방문</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">🔥 트렌딩 맛집</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">서울 · 성수 베이커리</span>
                <span className="text-sm text-orange-500">+127%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">제주 · 애월 카페</span>
                <span className="text-sm text-orange-500">+98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">부산 · 해운대 횟집</span>
                <span className="text-sm text-orange-500">+67%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">💎 숨은 보석</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">전주 · 한옥마을 비빔밥</span>
                <span className="text-sm text-purple-500">4.9★</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">속초 · 중앙시장 닭강정</span>
                <span className="text-sm text-purple-500">4.8★</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">여수 · 밤바다 포차</span>
                <span className="text-sm text-purple-500">4.8★</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CityExploration;