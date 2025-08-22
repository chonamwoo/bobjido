import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import {
  FireIcon,
  HeartIcon,
  SparklesIcon,
  TrophyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  category: string;
  question: string;
  optionA: {
    text: string;
    emoji: string;
    value: string;
  };
  optionB: {
    text: string;
    emoji: string;
    value: string;
  };
}

const FoodMBTI: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // 음식 MBTI 질문들
  const questions: Question[] = [
    {
      id: 'bingsu',
      category: '디저트',
      question: '여름 빙수 대결!',
      optionA: { text: '팥빙수', emoji: '🫘', value: 'redbean' },
      optionB: { text: '망고빙수', emoji: '🥭', value: 'mango' },
    },
    {
      id: 'bungeoppang',
      category: '길거리',
      question: '붕어빵 어디부터?',
      optionA: { text: '머리부터', emoji: '🐟', value: 'head' },
      optionB: { text: '꼬리부터', emoji: '🐠', value: 'tail' },
    },
    {
      id: 'tteokbokki',
      category: '분식',
      question: '떡볶이에서 뭐가 더 좋아?',
      optionA: { text: '떡이 최고', emoji: '🍢', value: 'rice_cake' },
      optionB: { text: '어묵이 진리', emoji: '🍥', value: 'fish_cake' },
    },
    {
      id: 'chicken',
      category: '치킨',
      question: '치킨 부위 선택!',
      optionA: { text: '닭다리', emoji: '🍗', value: 'leg' },
      optionB: { text: '닭날개', emoji: '🪶', value: 'wing' },
    },
    {
      id: 'noodle_forever',
      category: '평생선택',
      question: '평생 하나만 먹어야 한다면?',
      optionA: { text: '짜장면', emoji: '🥡', value: 'jjajang' },
      optionB: { text: '짬뽕', emoji: '🍜', value: 'jjamppong' },
    },
    {
      id: 'sushi_choice',
      category: '회',
      question: '평생 회 3종류만 먹을 수 있다면?',
      optionA: { text: '참치·연어·광어', emoji: '🍣', value: 'premium' },
      optionB: { text: '우럭·도미·방어', emoji: '🐟', value: 'local' },
    },
    {
      id: 'kimchi',
      category: '김치',
      question: '김치 취향은?',
      optionA: { text: '겉절이', emoji: '🥬', value: 'fresh' },
      optionB: { text: '묵은지', emoji: '🥢', value: 'aged' },
    },
    {
      id: 'ramen',
      category: '라면',
      question: '라면 면발 스타일?',
      optionA: { text: '꼬들꼬들', emoji: '🍜', value: 'firm' },
      optionB: { text: '푹 퍼진', emoji: '🍲', value: 'soft' },
    },
    {
      id: 'pizza',
      category: '피자',
      question: '피자 끝부분은?',
      optionA: { text: '다 먹는다', emoji: '🍕', value: 'eat_crust' },
      optionB: { text: '남긴다', emoji: '🥖', value: 'leave_crust' },
    },
    {
      id: 'egg',
      category: '계란',
      question: '계란 프라이 굽기 정도?',
      optionA: { text: '반숙', emoji: '🍳', value: 'runny' },
      optionB: { text: '완숙', emoji: '🥚', value: 'well_done' },
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    setShowAnimation(true);

    // 애니메이션 후 다음 질문으로
    setTimeout(() => {
      setShowAnimation(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // 모든 질문 완료
        completeTest(newAnswers);
      }
    }, 500);

    // 백엔드에 답변 저장 (로그인한 경우)
    if (user) {
      try {
        await axios.post('/api/food-mbti/answer', {
          questionId: currentQuestion.id,
          answer,
        });
      } catch (error) {
        console.error('답변 저장 실패:', error);
      }
    }
  };

  const completeTest = async (finalAnswers: Record<string, string>) => {
    setIsComplete(true);

    // 결과 계산 및 타입 결정
    const mbtiType = calculateMBTIType(finalAnswers);
    
    if (user) {
      try {
        const response = await axios.post('/api/food-mbti/complete', {
          answers: finalAnswers,
          mbtiType,
        });
        setResult(response.data);
      } catch (error) {
        console.error('결과 저장 실패:', error);
      }
    } else {
      // 비로그인 사용자를 위한 임시 결과
      setResult({
        mbtiType,
        description: getMBTIDescription(mbtiType),
        matchingUsers: [],
      });
    }
  };

  const calculateMBTIType = (answers: Record<string, string>): string => {
    // 간단한 MBTI 타입 계산 로직
    let type = '';
    
    // E/I - 외향적/내향적 (평생선택 기준)
    type += answers.noodle_forever === 'jjajang' ? 'I' : 'E';
    
    // S/N - 감각적/직관적 (전통적 vs 새로운)
    type += answers.bingsu === 'redbean' ? 'S' : 'N';
    
    // T/F - 사고형/감정형 (실용적 vs 감성적)
    type += answers.bungeoppang === 'head' ? 'T' : 'F';
    
    // J/P - 판단형/인식형 (계획적 vs 즉흥적)
    type += answers.egg === 'well_done' ? 'J' : 'P';
    
    return type;
  };

  const getMBTIDescription = (type: string): string => {
    const descriptions: Record<string, string> = {
      'ISTJ': '전통적인 맛집 수호자 - 오래된 노포를 사랑하는 당신',
      'ISFJ': '따뜻한 집밥 러버 - 편안한 맛을 추구하는 당신',
      'INFJ': '숨은 맛집 발견가 - 남들이 모르는 곳을 찾는 당신',
      'INTJ': '미식 전략가 - 완벽한 맛집 리스트를 만드는 당신',
      'ISTP': '실용적 먹방러 - 가성비를 중시하는 당신',
      'ISFP': '감성 미식가 - 분위기도 맛이라고 생각하는 당신',
      'INFP': '이상적인 맛 추구자 - 자신만의 기준이 확고한 당신',
      'INTP': '맛 분석가 - 왜 맛있는지 분석하는 당신',
      'ESTP': '모험적 식도락가 - 새로운 맛에 도전하는 당신',
      'ESFP': '파티 음식 매니아 - 함께 먹는 즐거움을 아는 당신',
      'ENFP': '열정적 맛 탐험가 - 맛집 투어를 즐기는 당신',
      'ENTP': '창의적 퓨전 러버 - 독특한 조합을 좋아하는 당신',
      'ESTJ': '효율적 맛집 정복자 - 체계적으로 맛집을 섭렵하는 당신',
      'ESFJ': '배려심 많은 맛 큐레이터 - 모두가 좋아할 맛집을 찾는 당신',
      'ENFJ': '맛집 전도사 - 좋은 맛집을 널리 알리는 당신',
      'ENTJ': '맛집 리더 - 모임 장소를 항상 당신이 정하는 리더',
    };
    return descriptions[type] || '독특한 입맛의 소유자';
  };

  if (isComplete && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">당신의 음식 MBTI는</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent my-4">
                {result.mbtiType}
              </div>
              <p className="text-lg text-gray-600">{result.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-xl">당신의 음식 취향</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(answers).slice(0, 6).map(([key, value]) => {
                  const question = questions.find(q => q.id === key);
                  const option = value === question?.optionA.value ? question.optionA : question?.optionB;
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                      <span className="text-2xl">{option?.emoji}</span>
                      <span className="text-sm">{option?.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                홈으로
              </button>
              <button
                onClick={() => {
                  if (user) {
                    navigate('/matches');
                  } else {
                    toast.error('로그인 후 매칭을 확인하세요');
                    navigate('/login');
                  }
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                취향 맞는 사람 찾기
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-white h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-white text-center mt-2">
            {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                {currentQuestion.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(currentQuestion.optionA.value)}
                className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4">{currentQuestion.optionA.emoji}</div>
                <div className="text-xl font-bold">{currentQuestion.optionA.text}</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(currentQuestion.optionB.value)}
                className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-6xl mb-4">{currentQuestion.optionB.emoji}</div>
                <div className="text-xl font-bold">{currentQuestion.optionB.text}</div>
              </motion.button>
            </div>

            {/* Skip Button */}
            {!user && (
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  로그인하고 결과 저장하기
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Animation Overlay */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <HeartIcon className="w-32 h-32 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FoodMBTI;