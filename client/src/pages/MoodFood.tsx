import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const moods = [
  {
    id: 'happy',
    emoji: '😊',
    label: '행복해요',
    color: 'from-yellow-400 to-orange-400',
    foods: [
      { name: '피자', emoji: '🍕', description: '행복을 더해줄 치즈 가득 피자' },
      { name: '치킨', emoji: '🍗', description: '바삭바삭 행복한 치킨' },
      { name: '스테이크', emoji: '🥩', description: '특별한 날의 스테이크' }
    ]
  },
  {
    id: 'sad',
    emoji: '😢',
    label: '우울해요',
    color: 'from-blue-400 to-indigo-400',
    foods: [
      { name: '떡볶이', emoji: '🍜', description: '매콤한 떡볶이로 기분전환' },
      { name: '아이스크림', emoji: '🍦', description: '달달한 아이스크림으로 위로' },
      { name: '초콜릿', emoji: '🍫', description: '행복 호르몬을 위한 초콜릿' }
    ]
  },
  {
    id: 'angry',
    emoji: '😤',
    label: '화나요',
    color: 'from-red-400 to-pink-400',
    foods: [
      { name: '매운탕', emoji: '🍲', description: '화를 날려버릴 얼큰한 매운탕' },
      { name: '불닭볶음면', emoji: '🔥', description: '스트레스를 태워버릴 불닭' },
      { name: '마라탕', emoji: '🥘', description: '얼얼한 마라탕으로 스트레스 해소' }
    ]
  },
  {
    id: 'tired',
    emoji: '😴',
    label: '피곤해요',
    color: 'from-purple-400 to-pink-400',
    foods: [
      { name: '삼계탕', emoji: '🍗', description: '원기회복 삼계탕' },
      { name: '장어구이', emoji: '🐟', description: '스태미나 충전 장어구이' },
      { name: '갈비탕', emoji: '🍖', description: '든든한 갈비탕으로 에너지 충전' }
    ]
  },
  {
    id: 'excited',
    emoji: '🤩',
    label: '신나요',
    color: 'from-green-400 to-teal-400',
    foods: [
      { name: '삼겹살', emoji: '🥓', description: '신나는 날엔 삼겹살 파티' },
      { name: '회', emoji: '🍣', description: '싱싱한 회로 기분 UP' },
      { name: '양꼬치', emoji: '🍢', description: '맥주와 함께 양꼬치' }
    ]
  },
  {
    id: 'stressed',
    emoji: '😰',
    label: '스트레스',
    color: 'from-gray-400 to-slate-400',
    foods: [
      { name: '족발', emoji: '🍖', description: '쫄깃한 족발로 스트레스 해소' },
      { name: '곱창', emoji: '🥘', description: '소주 한잔과 곱창' },
      { name: '감자탕', emoji: '🍲', description: '푸짐한 감자탕으로 위로' }
    ]
  },
  {
    id: 'bored',
    emoji: '😑',
    label: '심심해요',
    color: 'from-amber-400 to-yellow-400',
    foods: [
      { name: '분식', emoji: '🍜', description: '다양한 분식 먹방' },
      { name: '뷔페', emoji: '🍽️', description: '이것저것 골라먹는 재미' },
      { name: '맛집 탐방', emoji: '🗺️', description: '새로운 맛집 도전' }
    ]
  },
  {
    id: 'romantic',
    emoji: '💕',
    label: '설레요',
    color: 'from-pink-400 to-rose-400',
    foods: [
      { name: '파스타', emoji: '🍝', description: '로맨틱한 파스타 디너' },
      { name: '와인', emoji: '🍷', description: '와인과 치즈 플래터' },
      { name: '디저트', emoji: '🍰', description: '달콤한 디저트 카페' }
    ]
  }
];

export default function MoodFood() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood);
  };

  const resetSelection = () => {
    setSelectedMood(null);
  };

  if (selectedMood) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{selectedMood.emoji}</div>
              <h2 className={`text-3xl font-bold bg-gradient-to-r ${selectedMood.color} bg-clip-text text-transparent`}>
                {selectedMood.label}일 때 추천 음식
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              {selectedMood.foods.map((food, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${selectedMood.color} bg-opacity-10 rounded-xl p-4 border-2 border-opacity-20`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{food.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
                      <p className="text-gray-600 text-sm">{food.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetSelection}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                다른 기분 선택
              </button>
              <button
                onClick={() => navigate('/game-hub')}
                className={`flex-1 py-3 bg-gradient-to-r ${selectedMood.color} text-white rounded-xl font-semibold hover:shadow-lg transition-shadow`}
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            😊 오늘 기분이 어떠신가요?
          </h1>
          <p className="text-gray-600">기분에 맞는 음식을 추천해드릴게요!</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood, index) => (
            <motion.button
              key={mood.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleMoodSelect(mood)}
              className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${mood.color}
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                cursor-pointer group
              `}
            >
              <div className="relative z-10 text-white">
                <div className="text-5xl mb-3">{mood.emoji}</div>
                <div className="text-lg font-bold">{mood.label}</div>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}