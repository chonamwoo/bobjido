import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  SparklesIcon,
  MapPinIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const FindFriends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nearby' | 'interests' | 'recommendations'>('recommendations');

  const mockFriends = [
    {
      id: 1,
      name: '김미식',
      username: '@kimfoodie',
      avatar: '/default-avatar.png',
      compatibility: 92,
      distance: 2.5,
      favoriteFood: '일식, 이탈리안',
      commonPlaces: 12,
      status: 'online'
    },
    {
      id: 2,
      name: '이맛집',
      username: '@leetaste',
      avatar: '/default-avatar.png',
      compatibility: 85,
      distance: 5.0,
      favoriteFood: '한식, 중식',
      commonPlaces: 8,
      status: 'active'
    },
    {
      id: 3,
      name: '박푸디',
      username: '@parkfood',
      avatar: '/default-avatar.png',
      compatibility: 78,
      distance: 1.2,
      favoriteFood: '카페, 디저트',
      commonPlaces: 5,
      status: 'offline'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <UserGroupIcon className="w-12 h-12 text-purple-600" />
              <SparklesIcon className="absolute -top-2 -right-2 w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              미식 친구 찾기
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            취향이 비슷한 미식가들과 연결되어 함께 맛집을 탐험해보세요
          </p>
        </motion.div>

        {/* 준비중 안내 배너 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <BellIcon className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-1">🚀 곧 만나요!</h3>
              <p className="text-purple-100">
                친구 찾기 기능이 곧 출시됩니다. AI가 당신과 취향이 비슷한 미식가들을 찾아드릴 예정이에요!
              </p>
            </div>
          </div>
        </motion.div>

        {/* 탭 네비게이션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-2 mb-6"
        >
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              추천 친구
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'nearby'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              내 주변
            </button>
            <button
              onClick={() => setActiveTab('interests')}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'interests'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              관심사별
            </button>
          </div>
        </motion.div>

        {/* 검색 바 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="사용자 이름, 음식 취향으로 검색..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button className="px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* 친구 목록 (미리보기) */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {mockFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50" />
              
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      friend.status === 'online' ? 'bg-green-500' :
                      friend.status === 'active' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{friend.name}</h3>
                      <span className="text-sm text-gray-500">{friend.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <HeartIcon className="w-4 h-4 text-purple-500" />
                        {friend.compatibility}% 일치
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4 text-blue-500" />
                        {friend.distance}km
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friend.favoriteFood.split(', ').map((food, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                          {food}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      공통 방문 맛집 <span className="font-semibold text-purple-600">{friend.commonPlaces}곳</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                    <UserPlusIcon className="w-4 h-4 inline mr-1" />
                    친구 추가
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                    <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
                    메시지
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 기능 소개 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI 매칭</h3>
            <p className="text-sm text-gray-600">
              취향 분석을 통해 가장 잘 맞는 미식 친구를 추천해드려요
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">위치 기반</h3>
            <p className="text-sm text-gray-600">
              주변에 있는 미식가들과 함께 새로운 맛집을 탐험해보세요
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <GlobeAltIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">글로벌 연결</h3>
            <p className="text-sm text-gray-600">
              전 세계 미식가들과 음식 문화를 공유하고 교류해요
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FindFriends;