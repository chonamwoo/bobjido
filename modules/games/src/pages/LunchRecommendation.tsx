import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    emoji: string;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 'weather',
    question: '오늘 날씨는 어때요?',
    options: [
      { text: '맑고 화창해요', emoji: '☀️', value: 'sunny' },
      { text: '비가 와요', emoji: '🌧️', value: 'rainy' },
      { text: '추워요', emoji: '❄️', value: 'cold' },
      { text: '더워요', emoji: '🔥', value: 'hot' }
    ]
  },
  {
    id: 'hunger',
    question: '얼마나 배고프신가요?',
    options: [
      { text: '엄청 배고파요', emoji: '🦁', value: 'very' },
      { text: '적당히 배고파요', emoji: '😊', value: 'normal' },
      { text: '별로 안 배고파요', emoji: '🤏', value: 'little' },
      { text: '간식 정도만', emoji: '🍪', value: 'snack' }
    ]
  },
  {
    id: 'time',
    question: '점심 시간이 얼마나 있나요?',
    options: [
      { text: '30분 이내', emoji: '⚡', value: 'quick' },
      { text: '1시간 정도', emoji: '⏰', value: 'normal' },
      { text: '여유롭게', emoji: '🌸', value: 'plenty' },
      { text: '시간 제한 없음', emoji: '♾️', value: 'unlimited' }
    ]
  },
  {
    id: 'with',
    question: '누구와 함께 먹나요?',
    options: [
      { text: '혼자', emoji: '🚶', value: 'alone' },
      { text: '동료들과', emoji: '👥', value: 'colleagues' },
      { text: '친구들과', emoji: '👫', value: 'friends' },
      { text: '가족과', emoji: '👨‍👩‍👧‍👦', value: 'family' }
    ]
  },
  {
    id: 'budget',
    question: '예산은 어느 정도인가요?',
    options: [
      { text: '1만원 이하', emoji: '💵', value: 'cheap' },
      { text: '1-2만원', emoji: '💴', value: 'normal' },
      { text: '2-3만원', emoji: '💶', value: 'expensive' },
      { text: '상관없어요', emoji: '💎', value: 'any' }
    ]
  }
];

const recommendations: Record<string, { name: string; emoji: string; description: string; categories: string[] }[]> = {
  // 날씨 + 배고픔 조합
  'sunny_very': [
    { name: '냉면', emoji: '🍜', description: '시원한 냉면으로 더위를 날려보세요', categories: ['한식'] },
    { name: '초밥', emoji: '🍣', description: '신선한 초밥으로 든든하게', categories: ['일식'] }
  ],
  'rainy_normal': [
    { name: '부대찌개', emoji: '🍲', description: '비 오는 날엔 뜨끈한 부대찌개', categories: ['한식'] },
    { name: '파전', emoji: '🥞', description: '비 오는 날의 국룰, 파전과 막걸리', categories: ['한식'] }
  ],
  'cold_very': [
    { name: '갈비탕', emoji: '🍖', description: '뜨끈하고 든든한 갈비탕', categories: ['한식'] },
    { name: '라멘', emoji: '🍜', description: '진한 국물의 일본 라멘', categories: ['일식'] }
  ],
  'hot_little': [
    { name: '샐러드', emoji: '🥗', description: '가볍고 상큼한 샐러드', categories: ['양식'] },
    { name: '콩국수', emoji: '🥣', description: '시원하고 고소한 콩국수', categories: ['한식'] }
  ],
  // 기본 추천
  'default': [
    { name: '김치찌개', emoji: '🍲', description: '언제나 옳은 김치찌개', categories: ['한식'] },
    { name: '파스타', emoji: '🍝', description: '다양한 파스타 중 선택', categories: ['양식'] },
    { name: '비빔밥', emoji: '🍚', description: '건강하고 균형잡힌 비빔밥', categories: ['한식'] },
    { name: '짜장면', emoji: '🍜', description: '점심의 클래식, 짜장면', categories: ['중식'] }
  ]
};

export default function LunchRecommendation() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      
      // Save to localStorage
      const gameRecords = JSON.parse(localStorage.getItem('gameRecords') || '{}');
      gameRecords.lunchRecommendation = {
        answers: newAnswers,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
      
      // Update completed games count
      const completedGames = parseInt(localStorage.getItem('completedGames') || '0');
      localStorage.setItem('completedGames', String(completedGames + 1));
    }
  };

  const getRestaurantsByFood = (foodName: string) => {
    const restaurantMap: { [key: string]: Array<{ name: string; location: string; rating: number }> } = {
      '김치찌개': [
        { name: '김치찌개 전문점', location: '종로', rating: 4.6 },
        { name: '집밥 한상', location: '강남', rating: 4.5 },
        { name: '할머니 김치찌개', location: '홍대', rating: 4.7 }
      ],
      '쌀국수': [
        { name: '포메인', location: '강남', rating: 4.3 },
        { name: '에머이', location: '이태원', rating: 4.5 },
        { name: '미스사이공', location: '홍대', rating: 4.4 }
      ],
      '햄버거': [
        { name: '수제버거 맛집', location: '홍대', rating: 4.6 },
        { name: '버거파크', location: '강남', rating: 4.5 },
        { name: '쉐이크쉑', location: '강남', rating: 4.5 }
      ],
      '샐러드': [
        { name: '샐러디', location: '강남', rating: 4.2 },
        { name: '스윗밸런스', location: '성수', rating: 4.4 },
        { name: '그린테이블', location: '홍대', rating: 4.3 }
      ]
    };
    
    return restaurantMap[foodName] || [
      { name: '맛집 추천 1', location: '강남', rating: 4.5 },
      { name: '맛집 추천 2', location: '홍대', rating: 4.4 }
    ];
  };

  const getRecommendation = () => {
    // 답변 조합으로 추천 결정
    const key = `${answers.weather}_${answers.hunger}`;
    return recommendations[key] || recommendations.default;
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const recommended = getRecommendation();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              🍱 오늘의 점심 추천
            </h2>
            
            <div className="space-y-4 mb-8">
              {recommended.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{item.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex gap-2">
                          {item.categories.map((cat, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Restaurant Recommendations */}
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700">🍴 추천 맛집</h4>
                      <div className="space-y-1">
                        {getRestaurantsByFood(item.name).map((restaurant, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{restaurant.name}</span>
                            <span className="text-gray-500">{restaurant.location} · ⭐{restaurant.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                다시 추천받기
              </button>
              <button
                onClick={() => navigate('/game-hub')}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                다른 게임하기
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* 진행 바 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>질문 {currentQuestion + 1}/{questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {questions[currentQuestion].question}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAnswer(option.value)}
                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {option.text}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}