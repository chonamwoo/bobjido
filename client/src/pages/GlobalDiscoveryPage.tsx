import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  MapIcon,
  UsersIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import GlobalDiscoveryMap from '../components/GlobalDiscovery/GlobalDiscoveryMap';
import TravelPlanner from '../components/GlobalDiscovery/TravelPlanner';

const GlobalDiscoveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'planner'>('discover');

  const tabs = [
    {
      id: 'discover',
      name: '전세계 탐험',
      icon: GlobeAltIcon,
      description: '여행지에서 같은 취향의 로컬들을 찾아보세요'
    },
    {
      id: 'planner',
      name: '여행 플래너',
      icon: MapIcon,
      description: '맞춤형 여행 맛집 계획을 세워보세요'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <GlobeAltIcon className="w-12 h-12 text-blue-600" />
              <SparklesIcon className="absolute -top-2 -right-2 w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              글로벌 미식 디스커버리
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전 세계 어디서든 당신과 같은 취향의 미식가들을 만나고, 
            현지인만 아는 특별한 맛집을 발견해보세요
          </p>
        </motion.div>

        {/* 탭 네비게이션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-2 mb-8 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'discover' | 'planner')}
                  className={`relative p-4 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.name}</span>
                  </div>
                  <p className={`text-xs ${
                    activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 컨텐츠 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'discover' && (
            <GlobalDiscoveryMap 
              onLocationSelect={(location: any, users: any) => {
                console.log('Selected location:', location);
                console.log('Matched users:', users);
              }}
            />
          )}
          
          {activeTab === 'planner' && (
            <TravelPlanner />
          )}
        </motion.div>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <UsersIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">스마트 매칭</h3>
            <p className="text-sm text-gray-600">
              AI 분석으로 취향이 비슷한 현지 미식가들과 자동 매칭
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <MapIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">로컬 전문가</h3>
            <p className="text-sm text-gray-600">
              현지인만 아는 숨겨진 맛집과 특별한 경험 공유
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-center">
            <GlobeAltIcon className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">전 세계 연결</h3>
            <p className="text-sm text-gray-600">
              언어와 국경을 넘어 미식으로 이어지는 글로벌 네트워크
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalDiscoveryPage;