import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

// 간소화된 핵심 취향 질문 (3개로 축소)
const tasteQuestions = [
  {
    id: 'food_style',
    question: '어떤 스타일의 음식을 좋아하세요?',
    choices: [
      { id: 'adventure', emoji: '🌍', label: '새롭고 이국적인', value: 'adventure' },
      { id: 'classic', emoji: '🍚', label: '친숙하고 전통적인', value: 'classic' },
      { id: 'trendy', emoji: '✨', label: '트렌디하고 힙한', value: 'trendy' },
      { id: 'comfort', emoji: '🏠', label: '편안하고 가정식', value: 'comfort' }
    ]
  },
  {
    id: 'price_range',
    question: '주로 선호하는 가격대는?',
    choices: [
      { id: 'value', emoji: '💵', label: '가성비 중시 (1만원 이하)', value: 'value' },
      { id: 'moderate', emoji: '💳', label: '적당한 가격 (1-2만원)', value: 'moderate' },
      { id: 'premium', emoji: '💎', label: '특별한 날 (3만원 이상)', value: 'premium' }
    ]
  },
  {
    id: 'dining_vibe',
    question: '어떤 분위기에서 먹는 걸 선호하세요?',
    choices: [
      { id: 'quiet', emoji: '😌', label: '조용하고 편안한', value: 'quiet' },
      { id: 'social', emoji: '🎉', label: '활기차고 소셜한', value: 'social' },
      { id: 'romantic', emoji: '🕯️', label: '분위기 있고 로맨틱한', value: 'romantic' },
      { id: 'casual', emoji: '😎', label: '캐주얼하고 편한', value: 'casual' }
    ]
  }
];

const tasteProfiles = {
  adventurer: { 
    title: '모험적인 미식가', 
    emoji: '🚀',
    description: '새로운 맛과 경험을 추구하는 도전적인 타입'
  },
  traditionalist: { 
    title: '전통 미식가', 
    emoji: '🍚',
    description: '검증된 맛과 편안함을 추구하는 클래식한 타입'
  },
  trendsetter: { 
    title: '트렌드세터', 
    emoji: '✨',
    description: 'SNS 핫플레이스를 찾아다니는 힙한 타입'
  },
  comfort_seeker: { 
    title: '편안함 추구자', 
    emoji: '🏠',
    description: '아늑하고 편안한 분위기를 좋아하는 타입'
  },
  budget_master: { 
    title: '가성비 마스터', 
    emoji: '💰',
    description: '합리적인 가격에 최고의 맛을 찾는 타입'
  },
  premium_diner: { 
    title: '프리미엄 다이너', 
    emoji: '💎',
    description: '고급스러운 경험과 품질을 중시하는 타입'
  },
  social_butterfly: { 
    title: '소셜 버터플라이', 
    emoji: '🦋',
    description: '사람들과 함께하는 식사를 즐기는 타입'
  },
  solo_explorer: { 
    title: '솔로 탐험가', 
    emoji: '🧘',
    description: '혼자만의 여유로운 식사를 즐기는 타입'
  }
};

const OnboardingSimple: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1: 시작 전
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const handleStart = () => {
    setCurrentQuestion(0);
  };

  const handleSkip = () => {
    // 나중에 취향 설정 가능
    navigate('/matches');
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < tasteQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      // 마지막 질문 답변 후 분석
      handleSubmit();
    }
  };

  const calculateProfile = () => {
    const scores: Record<string, number> = {
      adventurer: 0,
      traditionalist: 0,
      trendsetter: 0,
      comfort_seeker: 0,
      budget_master: 0,
      premium_diner: 0,
      social_butterfly: 0,
      solo_explorer: 0
    };

    // 간단한 3개 질문 기반 프로필 결정
    // 음식 스타일
    if (answers.food_style === 'adventure') {
      scores.adventurer += 5;
      scores.trendsetter += 2;
    }
    if (answers.food_style === 'classic') {
      scores.traditionalist += 5;
      scores.comfort_seeker += 2;
    }
    if (answers.food_style === 'trendy') {
      scores.trendsetter += 5;
      scores.social_butterfly += 2;
    }
    if (answers.food_style === 'comfort') {
      scores.comfort_seeker += 5;
      scores.solo_explorer += 2;
    }

    // 가격대
    if (answers.price_range === 'value') {
      scores.budget_master += 5;
      scores.solo_explorer += 1;
    }
    if (answers.price_range === 'moderate') {
      scores.social_butterfly += 2;
      scores.comfort_seeker += 2;
    }
    if (answers.price_range === 'premium') {
      scores.premium_diner += 5;
      scores.trendsetter += 2;
    }

    // 분위기
    if (answers.dining_vibe === 'quiet') {
      scores.solo_explorer += 4;
      scores.comfort_seeker += 2;
    }
    if (answers.dining_vibe === 'social') {
      scores.social_butterfly += 5;
      scores.adventurer += 1;
    }
    if (answers.dining_vibe === 'romantic') {
      scores.premium_diner += 3;
      scores.trendsetter += 2;
    }
    if (answers.dining_vibe === 'casual') {
      scores.budget_master += 2;
      scores.traditionalist += 2;
    }

    // 최고 점수 프로필 선택
    const topProfile = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return topProfile;
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    setTimeout(async () => {
      const profile = calculateProfile();
      
      try {
        const response = await axios.post('/api/onboarding/taste-profile', {
          answers,
          profile
        });

        if (response.data.success) {
          // 서버에서 반환된 업데이트된 사용자 정보 저장
          if (response.data.data?.user) {
            updateUser(response.data.data.user);
          }
          toast.success('취향 분석 완료!');
          navigate('/matches');
        }
      } catch (error) {
        console.error('Profile save error:', error);
        toast.error('프로필 저장 실패');
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {/* 시작 화면 */}
          {currentQuestion === -1 && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                빠른 취향 분석
              </h1>
              <p className="text-gray-600 mb-6">
                딱 3개 질문으로 당신의 취향을 파악해드려요
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleStart}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all font-semibold"
                >
                  시작하기 (30초)
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  나중에 하기
                </button>
              </div>
            </motion.div>
          )}

          {/* 질문 화면 */}
          {currentQuestion >= 0 && currentQuestion < tasteQuestions.length && !isAnalyzing && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* 진행 바 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    {currentQuestion + 1} / {tasteQuestions.length}
                  </span>
                  <button
                    onClick={handleSkip}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    건너뛰기
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / tasteQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* 질문 */}
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {tasteQuestions[currentQuestion].question}
              </h2>

              {/* 선택지 */}
              <div className="space-y-3">
                {tasteQuestions[currentQuestion].choices.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(tasteQuestions[currentQuestion].id, choice.value)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-all flex items-center gap-4 bg-white hover:bg-emerald-50"
                  >
                    <span className="text-2xl">{choice.emoji}</span>
                    <span className="text-left flex-1 text-gray-700 font-medium">
                      {choice.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 분석 중 */}
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="animate-pulse">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  취향 분석 중...
                </h2>
                <p className="text-gray-600">
                  맞춤 매칭을 준비하고 있어요
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingSimple;