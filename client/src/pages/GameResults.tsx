import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartBarIcon, FireIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface GameChoice {
  question: string;
  choice: string;
  percentage: number;
}

interface RecommendedRestaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  image: string;
  reason: string;
}

export default function GameResults() {
  const navigate = useNavigate();
  const [gameChoices, setGameChoices] = useState<GameChoice[]>([]);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<RecommendedRestaurant[]>([]);
  const [mbtiType, setMbtiType] = useState<string>('');

  useEffect(() => {
    // 게임 결과 불러오기
    const records = JSON.parse(localStorage.getItem('gameRecords') || '{}');
    const mbtiResult = records.foodMBTI;
    
    if (mbtiResult) {
      setMbtiType(mbtiResult.type);
      
      // 선택 분석 데이터 생성
      const choices: GameChoice[] = [
        {
          question: '반숙 vs 완숙',
          choice: mbtiResult.choices?.egg || '반숙',
          percentage: mbtiResult.choices?.egg === '반숙' ? 73 : 27
        },
        {
          question: '매운맛 선호도',
          choice: mbtiResult.choices?.spicy || '적당히 매운맛',
          percentage: mbtiResult.choices?.spicy === '매운맛 마니아' ? 45 : 55
        },
        {
          question: '국물 vs 비빔',
          choice: mbtiResult.choices?.soup || '국물',
          percentage: mbtiResult.choices?.soup === '국물' ? 62 : 38
        },
        {
          question: '혼밥 vs 같이',
          choice: mbtiResult.choices?.alone || '친구와 함께',
          percentage: mbtiResult.choices?.alone === '혼자서도 OK' ? 41 : 59
        }
      ];
      setGameChoices(choices);
      
      // 추천 맛집 생성
      const restaurants: RecommendedRestaurant[] = mbtiResult.restaurants || [
        {
          id: '1',
          name: '육회자매집',
          category: '한식',
          location: '강남구 역삼동',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1550388342-b3fd986e4e67?w=300&h=200&fit=crop',
          reason: '당신의 고급 입맛에 딱!'
        },
        {
          id: '2',
          name: '홍대 떡볶이 연구소',
          category: '분식',
          location: '마포구 서교동',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=300&h=200&fit=crop',
          reason: '매운맛 취향과 일치'
        },
        {
          id: '3',
          name: '성수 브런치 카페',
          category: '카페',
          location: '성동구 성수동',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
          reason: '분위기 있는 공간 선호'
        }
      ];
      setRecommendedRestaurants(restaurants);
      
      // 추천 맛집을 localStorage에 저장
      const updatedRecords = {
        ...records,
        foodMBTI: {
          ...mbtiResult,
          restaurants: restaurants
        }
      };
      localStorage.setItem('gameRecords', JSON.stringify(updatedRecords));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">🎯 게임 결과 분석</h1>
          <p className="text-gray-600">당신의 음식 취향을 분석했어요!</p>
        </motion.div>

        {/* MBTI 타입 표시 */}
        {mbtiType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-8 text-white text-center"
          >
            <h2 className="text-xl mb-2">당신의 음식 MBTI는</h2>
            <div className="text-4xl font-bold">{mbtiType}</div>
          </motion.div>
        )}

        {/* 선택 분석 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600" />
            당신의 선택 분석
          </h2>
          
          <div className="space-y-4">
            {gameChoices.map((choice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{choice.question}</span>
                  <span className="font-bold text-orange-600">{choice.choice}</span>
                </div>
                <div className="relative">
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${choice.percentage}%` }}
                      transition={{ delay: 0.5 + 0.1 * index, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                    />
                  </div>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-700">
                    상위 {choice.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 추천 맛집 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FireIcon className="w-6 h-6 mr-2 text-red-600" />
            당신을 위한 맞춤 맛집
          </h2>
          
          <div className="space-y-4">
            {recommendedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + 0.1 * index }}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {restaurant.location} · {restaurant.category}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm ml-1">{restaurant.rating}</span>
                    <span className="text-xs text-orange-600 ml-3 bg-orange-50 px-2 py-1 rounded">
                      {restaurant.reason}
                    </span>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/game-hub')}
            className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            다른 게임 하기
          </button>
          <button
            onClick={() => navigate('/super-explore')}
            className="py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            맛집 탐색하기
          </button>
        </div>
      </div>
    </div>
  );
}