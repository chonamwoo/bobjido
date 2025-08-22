import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

interface TasteChoice {
  id: string;
  emoji: string;
  label: string;
  value: string;
}

const tasteQuestions = [
  {
    id: 'spice_level',
    question: '매운 음식은 얼마나 좋아하세요?',
    choices: [
      { id: 'no_spice', emoji: '😅', label: '전혀 못 먹어요', value: 'none' },
      { id: 'mild', emoji: '🌶️', label: '조금 매운 정도', value: 'mild' },
      { id: 'medium', emoji: '🔥', label: '중간 정도 매워야', value: 'medium' },
      { id: 'hot', emoji: '🌋', label: '아주 매워도 OK', value: 'hot' }
    ]
  },
  {
    id: 'dining_budget',
    question: '평소 한 끼 식사 예산은?',
    choices: [
      { id: 'budget', emoji: '💰', label: '1만원 이하', value: 'budget' },
      { id: 'moderate', emoji: '💳', label: '1-2만원', value: 'moderate' },
      { id: 'premium', emoji: '💎', label: '2-3만원', value: 'premium' },
      { id: 'luxury', emoji: '👑', label: '3만원 이상', value: 'luxury' }
    ]
  },
  {
    id: 'food_adventure',
    question: '새로운 음식에 대한 당신의 태도는?',
    choices: [
      { id: 'conservative', emoji: '🛡️', label: '익숙한 메뉴가 최고', value: 'conservative' },
      { id: 'curious', emoji: '🤔', label: '가끔은 새로운 걸로', value: 'curious' },
      { id: 'adventurous', emoji: '🚀', label: '항상 새로운 도전', value: 'adventurous' }
    ]
  },
  {
    id: 'atmosphere',
    question: '선호하는 식당 분위기는?',
    choices: [
      { id: 'cozy', emoji: '🏠', label: '아늑하고 조용한', value: 'cozy' },
      { id: 'trendy', emoji: '✨', label: '세련되고 힙한', value: 'trendy' },
      { id: 'casual', emoji: '😊', label: '편안하고 캐주얼한', value: 'casual' },
      { id: 'lively', emoji: '🎉', label: '활기차고 북적한', value: 'lively' }
    ]
  },
  {
    id: 'cuisine_preference',
    question: '가장 자주 찾는 음식 종류는?',
    choices: [
      { id: 'korean', emoji: '🍚', label: '한식', value: 'korean' },
      { id: 'western', emoji: '🍝', label: '양식/이탈리안', value: 'western' },
      { id: 'asian', emoji: '🍜', label: '중식/일식/아시안', value: 'asian' },
      { id: 'diverse', emoji: '🌍', label: '다양하게 골고루', value: 'diverse' }
    ]
  },
  {
    id: 'meal_timing',
    question: '가장 중요하게 생각하는 식사는?',
    choices: [
      { id: 'breakfast', emoji: '🌅', label: '아침 - 하루를 시작하는', value: 'breakfast' },
      { id: 'lunch', emoji: '☀️', label: '점심 - 든든하게 충전', value: 'lunch' },
      { id: 'dinner', emoji: '🌙', label: '저녁 - 하루의 마무리', value: 'dinner' },
      { id: 'snack', emoji: '🍰', label: '간식/디저트 타임', value: 'snack' }
    ]
  },
  {
    id: 'dining_company',
    question: '주로 누구와 식사하시나요?',
    choices: [
      { id: 'alone', emoji: '🧘‍♀️', label: '혼자서 (혼밥)', value: 'alone' },
      { id: 'friends', emoji: '👥', label: '친구들과', value: 'friends' },
      { id: 'family', emoji: '👨‍👩‍👧‍👦', label: '가족과', value: 'family' },
      { id: 'date', emoji: '💕', label: '연인과 (데이트)', value: 'date' }
    ]
  },
  {
    id: 'food_discovery',
    question: '맛집 정보는 주로 어디서 얻나요?',
    choices: [
      { id: 'sns', emoji: '📱', label: 'SNS/인스타그램', value: 'sns' },
      { id: 'reviews', emoji: '⭐', label: '리뷰 앱/사이트', value: 'reviews' },
      { id: 'recommendations', emoji: '💬', label: '지인 추천', value: 'recommendations' },
      { id: 'exploration', emoji: '🚶‍♀️', label: '직접 돌아다니며 발견', value: 'exploration' }
    ]
  }
];

const tasteProfiles = {
  spicy_adventurer: { 
    title: '매콤한 모험가', 
    emoji: '🌶️',
    description: '매운 음식과 새로운 맛에 도전하는 용감한 미식가'
  },
  trendy_explorer: { 
    title: '힙스터 탐험가', 
    emoji: '✨',
    description: '트렌디한 장소에서 SNS 속 맛집을 찾아다니는 타입'
  },
  comfort_lover: { 
    title: '편안함 추구자', 
    emoji: '🏠',
    description: '익숙하고 편안한 음식, 아늑한 분위기를 좋아하는 타입'
  },
  social_foodie: { 
    title: '소셜 푸디', 
    emoji: '👥',
    description: '친구, 가족과 함께하는 식사의 즐거움을 아는 타입'
  },
  budget_gourmet: { 
    title: '가성비 구르메', 
    emoji: '💰',
    description: '합리적인 가격으로 맛있는 음식을 찾는 똑똑한 타입'
  },
  premium_diner: { 
    title: '프리미엄 다이너', 
    emoji: '💎',
    description: '품질 좋은 음식과 고급스러운 경험을 중시하는 타입'
  },
  solo_explorer: { 
    title: '혼밥 탐험가', 
    emoji: '🧘‍♀️',
    description: '혼자만의 시간을 즐기며 맛집을 탐험하는 독립적인 타입'
  },
  traditional_taste: { 
    title: '전통 미식가', 
    emoji: '🍚',
    description: '한식과 전통적인 맛을 사랑하는 클래식한 타입'
  }
};

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userProfile, setUserProfile] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = tasteQuestions.length + 2; // 환영 + 질문들 + 결과

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // 자동으로 다음 스텝으로
    setTimeout(() => {
      if (currentStep < tasteQuestions.length) {
        setCurrentStep(prev => prev + 1);
      }
    }, 500);
  };

  const calculateProfile = () => {
    const scores = {
      spicy_adventurer: 0,
      trendy_explorer: 0,
      comfort_lover: 0,
      social_foodie: 0,
      budget_gourmet: 0,
      premium_diner: 0,
      solo_explorer: 0,
      traditional_taste: 0
    };

    // 점수를 더 세분화하여 동점 가능성 감소
    // 매운맛 선호도
    if (answers.spice_level === 'hot') scores.spicy_adventurer += 7;
    if (answers.spice_level === 'medium') scores.spicy_adventurer += 4;
    if (answers.spice_level === 'mild') scores.comfort_lover += 3;
    if (answers.spice_level === 'none') scores.comfort_lover += 5;

    // 예산 기반 점수
    if (answers.dining_budget === 'luxury') scores.premium_diner += 7;
    if (answers.dining_budget === 'premium') scores.premium_diner += 4;
    if (answers.dining_budget === 'budget') scores.budget_gourmet += 6;
    if (answers.dining_budget === 'moderate') scores.budget_gourmet += 3;

    // 모험심
    if (answers.food_adventure === 'adventurous') {
      scores.spicy_adventurer += 5;
      scores.trendy_explorer += 4;
    }
    if (answers.food_adventure === 'curious') {
      scores.social_foodie += 3;
      scores.trendy_explorer += 2;
    }
    if (answers.food_adventure === 'conservative') {
      scores.comfort_lover += 5;
      scores.traditional_taste += 3;
    }

    // 분위기 선호
    if (answers.atmosphere === 'trendy') scores.trendy_explorer += 7;
    if (answers.atmosphere === 'cozy') scores.comfort_lover += 6;
    if (answers.atmosphere === 'lively') scores.social_foodie += 5;
    if (answers.atmosphere === 'casual') scores.comfort_lover += 2;

    // 음식 종류
    if (answers.cuisine_preference === 'korean') scores.traditional_taste += 7;
    if (answers.cuisine_preference === 'western') scores.trendy_explorer += 3;
    if (answers.cuisine_preference === 'asian') scores.spicy_adventurer += 3;
    if (answers.cuisine_preference === 'diverse') {
      scores.spicy_adventurer += 2;
      scores.trendy_explorer += 2;
    }

    // 식사 시간 (추가 차별화)
    if (answers.meal_timing === 'breakfast') scores.comfort_lover += 4;
    if (answers.meal_timing === 'lunch') scores.budget_gourmet += 2;
    if (answers.meal_timing === 'dinner') scores.premium_diner += 3;
    if (answers.meal_timing === 'snack') scores.trendy_explorer += 3;

    // 식사 동반자
    if (answers.dining_company === 'alone') scores.solo_explorer += 8;
    if (answers.dining_company === 'friends') scores.social_foodie += 6;
    if (answers.dining_company === 'family') {
      scores.social_foodie += 2;
      scores.traditional_taste += 4;
    }
    if (answers.dining_company === 'date') scores.premium_diner += 2;

    // 맛집 발견 방식
    if (answers.food_discovery === 'sns') scores.trendy_explorer += 5;
    if (answers.food_discovery === 'reviews') scores.budget_gourmet += 2;
    if (answers.food_discovery === 'exploration') scores.solo_explorer += 4;
    if (answers.food_discovery === 'recommendations') scores.social_foodie += 3;

    // 동점 방지를 위한 개선된 로직
    const sortedProfiles = Object.entries(scores)
      .map(([key, value]) => ({ 
        key, 
        value,
        // 동점일 때 사용할 타이브레이커
        tiebreaker: Math.random()
      }))
      .sort((a, b) => {
        // 먼저 점수로 정렬
        if (b.value !== a.value) {
          return b.value - a.value;
        }
        // 동점일 경우 랜덤 값으로 결정
        return b.tiebreaker - a.tiebreaker;
      });

    const profile = sortedProfiles[0]?.key;
    
    // 프로필이 제대로 선택되었는지 확인
    if (!profile) {
      console.error('프로필 선택 실패, 기본값 사용');
      setUserProfile('comfort_lover'); // 기본값
    } else {
      console.log('선택된 프로필:', profile, '점수:', sortedProfiles[0].value);
      setUserProfile(profile);
    }
    
    setCurrentStep(tasteQuestions.length + 1);
  };

  const saveProfile = async () => {
    setIsSubmitting(true);
    try {
      console.log('=== 취향 프로필 저장 시작 ===');
      console.log('answers:', answers);
      console.log('userProfile:', userProfile);
      console.log('current user:', user);

      // axios 기본 URL 강제 설정 (캐시 문제 해결)
      axios.defaults.baseURL = 'http://localhost:8888';
      console.log('axios.defaults.baseURL 설정:', axios.defaults.baseURL);

      // 절대 URL로 요청 (더 안전)
      const fullUrl = 'http://localhost:8888/api/onboarding/taste-profile';
      console.log('전체 URL:', fullUrl);
      
      const response = await axios.post(fullUrl, {
        answers,
        profile: userProfile
      });

      console.log('서버 응답:', response.data);

      if (response.data.success) {
        // 서버에서 반환된 완전한 사용자 객체 사용
        const updatedUser = response.data.data.user;
        console.log('업데이트된 사용자:', updatedUser);
        updateUser(updatedUser);
        
        toast.success('취향 프로필이 저장되었습니다!');
        navigate('/explore');
      } else {
        console.error('서버 응답에서 success가 false');
        toast.error('프로필 저장에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('=== Onboarding save error ===');
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      toast.error(error.response?.data?.message || '프로필 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipOnboarding = () => {
    const updatedUser = { 
      ...user!, 
      onboardingCompleted: true 
    };
    updateUser(updatedUser);
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {/* 환영 화면 */}
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold mb-2">
                환영합니다, {user?.username}님!
              </h1>
              <p className="text-gray-600 mb-8">
                당신의 입맛과 맞는 친구를 찾아드릴게요.<br />
                간단한 취향 진단을 시작해볼까요?
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                시작하기
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={skipOnboarding}
                className="mt-3 text-gray-500 text-sm hover:text-gray-700"
              >
                나중에 하기
              </button>
            </motion.div>
          )}

          {/* 취향 질문들 */}
          {currentStep > 0 && currentStep <= tasteQuestions.length && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* 진행률 표시 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {currentStep} / {tasteQuestions.length}
                  </span>
                  <span className="text-sm text-purple-600 font-medium">
                    {Math.round((currentStep / tasteQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${(currentStep / tasteQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* 질문 */}
              <h2 className="text-2xl font-bold text-center mb-8">
                {tasteQuestions[currentStep - 1].question}
              </h2>

              {/* 선택지 */}
              <div className="grid grid-cols-2 gap-4">
                {tasteQuestions[currentStep - 1].choices.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(
                      tasteQuestions[currentStep - 1].id,
                      choice.value
                    )}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      answers[tasteQuestions[currentStep - 1].id] === choice.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-2">{choice.emoji}</div>
                    <div className="font-medium">{choice.label}</div>
                  </motion.button>
                ))}
              </div>

              {/* 네비게이션 */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  이전
                </button>
                {currentStep === tasteQuestions.length && (
                  <button
                    onClick={calculateProfile}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    결과 보기
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 결과 화면 */}
          {currentStep === tasteQuestions.length + 1 && userProfile && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl mb-4"
              >
                {tasteProfiles[userProfile as keyof typeof tasteProfiles].emoji}
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                당신은 "{tasteProfiles[userProfile as keyof typeof tasteProfiles].title}"!
              </h2>
              
              <p className="text-gray-600 mb-6">
                {tasteProfiles[userProfile as keyof typeof tasteProfiles].description}
              </p>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-700">
                  이제 당신과 입맛이 비슷한 친구들을 만나보세요!
                </p>
              </div>

              <button
                onClick={saveProfile}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  '저장 중...'
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    시작하기
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;