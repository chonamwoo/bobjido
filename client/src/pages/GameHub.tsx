import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const games = [
  {
    id: 'food-mbti',
    title: '음식 MBTI',
    description: '당신의 음식 성향을 알아보세요',
    emoji: '🍽️',
    color: 'from-purple-500 to-pink-500',
    path: '/food-mbti'
  },
  {
    id: 'lunch-recommendation',
    title: '오늘 점심 뭐먹지?',
    description: '몇 가지 질문으로 오늘의 점심 추천',
    emoji: '🍱',
    color: 'from-blue-500 to-cyan-500',
    path: '/lunch-recommendation'
  },
  {
    id: 'mood-food',
    title: '기분따라 음식추천',
    description: '오늘의 기분에 맞는 음식을 추천해드려요',
    emoji: '😊',
    color: 'from-yellow-500 to-orange-500',
    path: '/mood-food'
  },
  {
    id: 'food-vs',
    title: '음식 월드컵',
    description: '이것 vs 저것! 최애 음식을 찾아보세요',
    emoji: '🏆',
    color: 'from-green-500 to-teal-500',
    path: '/food-vs'
  },
  {
    id: 'food-roulette',
    title: '음식 룰렛',
    description: '고민될 때는 운에 맡겨보세요',
    emoji: '🎰',
    color: 'from-red-500 to-pink-500',
    path: '/food-roulette'
  },
  {
    id: 'restaurant-quiz',
    title: '맛집 퀴즈',
    description: '진짜 맛잘알인지 테스트해보세요',
    emoji: '❓',
    color: 'from-indigo-500 to-purple-500',
    path: '/restaurant-quiz'
  }
];

export default function GameHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🎮 음식 게임 센터
          </h1>
          <p className="text-gray-600">재미있는 게임으로 당신의 입맛을 찾아보세요!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={game.path}
                className="block h-full"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-6 h-full
                  bg-gradient-to-br ${game.color}
                  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  cursor-pointer group
                `}>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{game.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {game.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {game.description}
                    </p>
                  </div>
                  
                  {/* 호버 효과 */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* 플레이 아이콘 */}
                  <div className="absolute bottom-4 right-4 text-white/70 group-hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">🏅 나의 게임 기록</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">완료한 게임</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">음식 MBTI</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">추천받은 맛집</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">맞춘 퀴즈</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}