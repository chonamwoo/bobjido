import React, { useState, useEffect } from 'react';
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
    id: 'food-vs',
    title: '음식 월드컵',
    description: '이것 vs 저것! 최애 음식을 찾아보세요',
    emoji: '🏆',
    color: 'from-green-500 to-teal-500',
    path: '/food-vs'
  },
  {
    id: 'restaurant-quiz',
    title: '맛집 상식 퀴즈',
    description: '진짜 맛잘알인지 테스트해보세요',
    emoji: '❓',
    color: 'from-indigo-500 to-purple-500',
    path: '/restaurant-quiz'
  }
];

export default function GameHub() {
  const [gameRecords, setGameRecords] = useState<any>({});
  const [completedGames, setCompletedGames] = useState(0);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState(0);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = () => {
    // 게임 기록 불러오기
    const records = JSON.parse(localStorage.getItem('gameRecords') || '{}');
    setGameRecords(records);
    
    // 완료한 게임 수 불러오기
    const completed = parseInt(localStorage.getItem('completedGames') || '0');
    setCompletedGames(completed);
    
    // 추천받은 맛집 수 계산 및 목록 생성
    let totalRestaurants = 0;
    let restaurantList: any[] = [];
    
    Object.entries(records).forEach(([gameType, record]: [string, any]) => {
      if (record.restaurants) {
        totalRestaurants += record.restaurants.length;
        record.restaurants.forEach((restaurant: any) => {
          restaurantList.push({
            ...restaurant,
            fromGame: gameType,
            date: record.completedAt
          });
        });
      }
    });
    
    setRecommendedRestaurants(totalRestaurants);
    setAllRestaurants(restaurantList);
  };

  const resetGameRecords = () => {
    if (window.confirm('정말로 모든 게임 기록을 초기화하시겠습니까?')) {
      localStorage.removeItem('gameRecords');
      localStorage.setItem('completedGames', '0');
      loadGameData();
    }
  };

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

        {/* 나의 게임 기록 - 상단 배치 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">🏅 나의 게임 기록</h2>
            <div className="flex gap-2">
              {recommendedRestaurants > 0 && (
                <button
                  onClick={() => setShowAllRestaurants(!showAllRestaurants)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                >
                  {showAllRestaurants ? '기록' : '맛집'}
                </button>
              )}
              {completedGames > 0 && (
                <button
                  onClick={resetGameRecords}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  초기화
                </button>
              )}
            </div>
          </div>
          
          {!showAllRestaurants ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{completedGames}</div>
                <div className="text-sm text-gray-600">완료한 게임</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{recommendedRestaurants}</div>
                <div className="text-sm text-gray-600">추천받은 맛집</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allRestaurants.length > 0 ? (
                allRestaurants.map((restaurant, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="font-semibold text-gray-800 truncate">{restaurant.name}</div>
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {restaurant.location} · ⭐ {restaurant.rating}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {restaurant.fromGame === 'foodMBTI' && '음식 MBTI'}
                        {restaurant.fromGame === 'foodVS' && '음식 월드컵'}
                        {restaurant.fromGame === 'foodRoulette' && '음식 룰렛'}
                        {restaurant.fromGame === 'lunchRecommendation' && '점심 추천'}
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm hover:bg-orange-200 transition-colors whitespace-nowrap">
                      보기
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>아직 추천받은 맛집이 없습니다</p>
                  <p className="text-sm mt-2">게임을 완료하면 맛집을 추천받을 수 있어요!</p>
                </div>
              )}
            </div>
          )}
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
      </div>
    </div>
  );
}