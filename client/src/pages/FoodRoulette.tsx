import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  FireIcon,
  SparklesIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

interface RouletteOption {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
}

const FoodRoulette: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [spinning, setSpinning] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RouletteOption | null>(null);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<RouletteOption[]>([]);
  const [preferences, setPreferences] = useState({
    location: '',
    budget: '',
    groupSize: '',
    mood: ''
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const foodOptions: RouletteOption[] = [
    { id: '1', name: '한식', emoji: '🍚', category: '한식', description: '오늘은 든든한 한식 어때요?', tags: ['김치찌개', '된장찌개', '비빔밥', '불고기'], color: '#FF6B6B' },
    { id: '2', name: '중식', emoji: '🥟', category: '중식', description: '짜장면? 짬뽕? 탕수육?', tags: ['짜장면', '짬뽕', '탕수육', '마파두부'], color: '#4ECDC4' },
    { id: '3', name: '일식', emoji: '🍣', category: '일식', description: '신선한 일식 요리 어떠세요?', tags: ['초밥', '라멘', '돈카츠', '우동'], color: '#45B7D1' },
    { id: '4', name: '양식', emoji: '🍝', category: '양식', description: '파스타와 피자의 향연!', tags: ['파스타', '피자', '스테이크', '리조또'], color: '#96CEB4' },
    { id: '5', name: '치킨', emoji: '🍗', category: '치킨', description: '바삭바삭 치킨 타임!', tags: ['후라이드', '양념', '간장', '파닭'], color: '#FFEAA7' },
    { id: '6', name: '버거', emoji: '🍔', category: '패스트푸드', description: '수제버거 어때요?', tags: ['수제버거', '감자튀김', '쉐이크'], color: '#DFE6E9' },
    { id: '7', name: '카페', emoji: '☕', category: '카페', description: '브런치나 디저트 타임!', tags: ['브런치', '샌드위치', '케이크', '커피'], color: '#FDCB6E' },
    { id: '8', name: '분식', emoji: '🍜', category: '분식', description: '떡볶이에 순대 어때요?', tags: ['떡볶이', '김밥', '순대', '튀김'], color: '#6C5CE7' },
    { id: '9', name: '고기', emoji: '🥩', category: '고기', description: '오늘은 고기 파티!', tags: ['삼겹살', '갈비', '스테이크', '양꼬치'], color: '#A8E6CF' },
    { id: '10', name: '해산물', emoji: '🦐', category: '해산물', description: '싱싱한 해산물 어때요?', tags: ['회', '조개구이', '해물탕', '새우'], color: '#FFD3B6' },
    { id: '11', name: '아시안', emoji: '🍛', category: '아시안', description: '동남아 음식 어때요?', tags: ['쌀국수', '팟타이', '분짜', '똠양꿍'], color: '#FFAAA5' },
    { id: '12', name: '술집', emoji: '🍺', category: '주점', description: '오늘은 한잔 어때요?', tags: ['포차', '호프', '이자카야', '와인바'], color: '#FF8B94' }
  ];

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setSelectedOption(null);
    
    // Calculate random rotation
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const randomIndex = Math.floor(Math.random() * foodOptions.length);
    const anglePerOption = 360 / foodOptions.length;
    const targetAngle = randomIndex * anglePerOption;
    const totalRotation = spins * 360 + targetAngle;
    
    setRotation(prev => prev + totalRotation);

    // Stop spinning after animation
    setTimeout(() => {
      setSpinning(false);
      const selected = foodOptions[randomIndex];
      setSelectedOption(selected);
      setHistory(prev => [selected, ...prev.slice(0, 4)]);
      
      // Save to game history and get recommendations
      if (user) {
        saveGameResult(selected);
      }
    }, 4000);
  };

  const saveGameResult = async (option: RouletteOption) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/games/submit`,
        {
          gameType: 'food_roulette',
          answers: [{
            questionId: 'roulette_result',
            question: '음식 룰렛 결과',
            answer: option.name,
            metadata: {
              category: option.category,
              tags: option.tags
            }
          }],
          location: {
            city: preferences.location || '서울',
            district: ''
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            🎰 오늘 뭐 먹지? 음식 룰렛!
          </h1>
          <p className="text-gray-600">결정장애 해결사! 룰렛을 돌려 오늘의 메뉴를 정해보세요</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Roulette Wheel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="relative w-full max-w-md mx-auto">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-20">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-red-500"></div>
              </div>

              {/* Wheel */}
              <motion.div
                className="relative w-full aspect-square"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {foodOptions.map((option, index) => {
                    const anglePerSlice = 360 / foodOptions.length;
                    const startAngle = index * anglePerSlice - 90;
                    const endAngle = startAngle + anglePerSlice;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const largeArcFlag = anglePerSlice > 180 ? 1 : 0;
                    
                    const x1 = 150 + 140 * Math.cos(startRad);
                    const y1 = 150 + 140 * Math.sin(startRad);
                    const x2 = 150 + 140 * Math.cos(endRad);
                    const y2 = 150 + 140 * Math.sin(endRad);
                    
                    const textAngle = startAngle + anglePerSlice / 2;
                    const textRad = (textAngle * Math.PI) / 180;
                    const textX = 150 + 100 * Math.cos(textRad);
                    const textY = 150 + 100 * Math.sin(textRad);

                    return (
                      <g key={option.id}>
                        <path
                          d={`M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={option.color}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fontSize="20"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                        >
                          {option.emoji}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>

              {/* Center button */}
              <button
                onClick={spin}
                disabled={spinning}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full text-white font-bold text-lg shadow-lg transition-all ${
                  spinning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-orange-500 hover:scale-110 active:scale-95'
                }`}
              >
                {spinning ? (
                  <ArrowPathIcon className="w-8 h-8 mx-auto animate-spin" />
                ) : (
                  'SPIN!'
                )}
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-orange-100 rounded-xl"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{selectedOption.emoji}</div>
                    <h3 className="text-2xl font-bold mb-2">{selectedOption.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedOption.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selectedOption.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side - Preferences & Recommendations */}
          <div className="space-y-6">
            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">🎯 선호 조건 설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    위치
                  </label>
                  <select
                    value={preferences.location}
                    onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">전체 지역</option>
                    <option value="강남">강남</option>
                    <option value="홍대">홍대</option>
                    <option value="이태원">이태원</option>
                    <option value="성수">성수</option>
                    <option value="종로">종로</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                    예산
                  </label>
                  <select
                    value={preferences.budget}
                    onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">상관없음</option>
                    <option value="저렴">1만원 이하</option>
                    <option value="보통">1-3만원</option>
                    <option value="고급">3만원 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    인원
                  </label>
                  <select
                    value={preferences.groupSize}
                    onChange={(e) => setPreferences({...preferences, groupSize: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">상관없음</option>
                    <option value="혼밥">혼자</option>
                    <option value="데이트">2명</option>
                    <option value="소모임">3-4명</option>
                    <option value="단체">5명 이상</option>
                  </select>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">📜 최근 결과</h3>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">아직 룰렛을 돌리지 않았어요!</p>
              )}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">🍽️ 추천 맛집</h3>
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((restaurant, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{restaurant.name}</h4>
                          <p className="text-sm text-gray-600">{restaurant.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                              {restaurant.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              ⭐ {restaurant.averageRating || 4.5}
                            </span>
                          </div>
                        </div>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodRoulette;