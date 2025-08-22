import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number[];
  timeSpent: number;
  level: string;
  recommendations: any[];
}

const RestaurantQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: '한국에서 가장 오래된 짜장면 전문점은?',
      options: ['공화춘', '태화루', '동보성', '영빈루'],
      correctAnswer: 0,
      explanation: '공화춘은 1908년 개업한 한국 최초의 중국요리 전문점입니다.',
      category: '역사',
      difficulty: 'hard'
    },
    {
      id: '2',
      question: '미슐랭 가이드 서울 2024에서 3스타를 받은 레스토랑이 아닌 것은?',
      options: ['가온', '라연', '모수', '정식당'],
      correctAnswer: 3,
      explanation: '정식당은 미슐랭 2스타 레스토랑입니다.',
      category: '미슐랭',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: '비빔밥의 발상지로 알려진 지역은?',
      options: ['전주', '진주', '안동', '경주'],
      correctAnswer: 0,
      explanation: '전주비빔밥은 한국의 대표적인 향토음식입니다.',
      category: '지역',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: '한국 최초의 커피 전문점은?',
      options: ['다방', '미도파', '낙원떡집', '남대문다방'],
      correctAnswer: 1,
      explanation: '미도파는 1930년대 개업한 한국 최초의 커피 전문점입니다.',
      category: '역사',
      difficulty: 'hard'
    },
    {
      id: '5',
      question: '매운탕에 가장 적합한 생선은?',
      options: ['대구', '갈치', '고등어', '조기'],
      correctAnswer: 0,
      explanation: '대구는 담백하고 살이 단단해 매운탕에 가장 적합합니다.',
      category: '요리',
      difficulty: 'medium'
    },
    {
      id: '6',
      question: '한국 전통주 중 세계문화유산에 등재된 것은?',
      options: ['막걸리', '소주', '청주', '동동주'],
      correctAnswer: 0,
      explanation: '막걸리 빚기는 2023년 유네스코 인류무형문화유산에 등재되었습니다.',
      category: '문화',
      difficulty: 'medium'
    },
    {
      id: '7',
      question: '서울에서 가장 오래된 설렁탕집은?',
      options: ['이문설농탕', '신촌설렁탕', '종로설렁탕', '을지로설렁탕'],
      correctAnswer: 0,
      explanation: '이문설농탕은 1907년 개업한 서울 최고(最古)의 설렁탕집입니다.',
      category: '역사',
      difficulty: 'hard'
    },
    {
      id: '8',
      question: '김치의 주재료인 배추가 한국에 전래된 시기는?',
      options: ['고려시대', '조선시대', '삼국시대', '일제강점기'],
      correctAnswer: 1,
      explanation: '배추는 조선시대 중기에 중국에서 전래되었습니다.',
      category: '역사',
      difficulty: 'medium'
    },
    {
      id: '9',
      question: '닭갈비의 원조 도시는?',
      options: ['춘천', '안동', '전주', '대구'],
      correctAnswer: 0,
      explanation: '춘천닭갈비는 1960년대부터 시작된 춘천의 대표 음식입니다.',
      category: '지역',
      difficulty: 'easy'
    },
    {
      id: '10',
      question: '한국 최초의 치킨 프랜차이즈는?',
      options: ['림스치킨', '페리카나', '멕시카나', 'BBQ'],
      correctAnswer: 0,
      explanation: '림스치킨은 1977년 개업한 한국 최초의 치킨 프랜차이즈입니다.',
      category: '역사',
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Time out
    }
  }, [timeLeft, quizStarted, isAnswered]);

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setTimeLeft(30);
  };

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setAnswers([...answers, answerIndex]);

    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + getDifficultyPoints(quizQuestions[currentQuestion].difficulty));
    }

    // Auto proceed after 2 seconds
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const getDifficultyPoints = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
  };

  const finishQuiz = async () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correctCount = answers.filter((ans, idx) => 
      ans === quizQuestions[idx].correctAnswer
    ).length;

    const level = getLevel(score);
    
    setShowResult(true);

    // Save results and get recommendations
    if (user) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8888'}/api/games/submit`,
          {
            gameType: 'restaurant_quiz',
            answers: answers.map((ans, idx) => ({
              questionId: quizQuestions[idx].id,
              question: quizQuestions[idx].question,
              answer: quizQuestions[idx].options[ans] || 'No answer',
              metadata: {
                correct: ans === quizQuestions[idx].correctAnswer,
                category: quizQuestions[idx].category,
                difficulty: quizQuestions[idx].difficulty
              }
            })),
            result: {
              score,
              level,
              correctCount,
              timeSpent
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
        console.error('Failed to save quiz result:', error);
      }
    }
  };

  const getLevel = (score: number) => {
    if (score >= 250) return '맛집 박사';
    if (score >= 200) return '맛집 전문가';
    if (score >= 150) return '맛집 마니아';
    if (score >= 100) return '맛집 탐험가';
    if (score >= 50) return '맛집 초보';
    return '맛집 입문자';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
    setIsAnswered(false);
    setQuizStarted(false);
    setRecommendations([]);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              맛집 퀴즈 챌린지
            </h1>
            <p className="text-gray-600 mb-8">
              당신의 맛집 지식을 테스트해보세요!<br />
              10개의 문제를 풀고 맛집 전문가가 되어보세요
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <QuestionMarkCircleIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">10 문제</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <ClockIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-semibold">30초 제한</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <TrophyIcon className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="font-semibold">최대 300점</p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform"
            >
              퀴즈 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctCount = answers.filter((ans, idx) => 
      ans === quizQuestions[idx].correctAnswer
    ).length;
    const level = getLevel(score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <TrophyIcon className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">퀴즈 완료!</h2>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                {score}점
              </p>
              <p className="text-2xl font-semibold text-gray-700 mb-2">{level}</p>
              <p className="text-gray-600">
                {quizQuestions.length}문제 중 {correctCount}문제 정답
              </p>
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold">문제 리뷰</h3>
              {quizQuestions.map((q, idx) => {
                const isCorrect = answers[idx] === q.correctAnswer;
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{q.question}</p>
                        <p className="text-sm text-gray-600">
                          정답: {q.options[q.correctAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-red-600">
                            당신의 답: {answers[idx] >= 0 ? q.options[answers[idx]] : '시간 초과'}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">{q.explanation}</p>
                      </div>
                      <div className="ml-4">
                        {isCorrect ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircleIcon className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">🍽️ 당신을 위한 추천 맛집</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.slice(0, 4).map((restaurant, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-semibold">{restaurant.name}</h4>
                      <p className="text-sm text-gray-600">{restaurant.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {restaurant.category}
                        </span>
                        <span className="text-sm">⭐ {restaurant.averageRating || 4.5}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
              >
                다시 도전
              </button>
              <button
                onClick={() => navigate('/game-hub')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                다른 게임 하기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-gray-500">문제 {currentQuestion + 1} / {quizQuestions.length}</span>
              <div className="text-2xl font-bold">점수: {score}</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                {timeLeft}
              </div>
              <p className="text-sm text-gray-500">남은 시간</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-b-2xl shadow-xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {question.difficulty === 'easy' ? '쉬움' :
                 question.difficulty === 'medium' ? '보통' : '어려움'}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {question.category}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showResult = isAnswered;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showResult && isCorrect
                      ? 'bg-green-50 border-green-500'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-red-50 border-red-500'
                      : isSelected
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-gray-400'
                  } ${!isAnswered && 'hover:scale-[1.02] cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <LightBulbIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">설명</p>
                    <p className="text-blue-800">{question.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RestaurantQuiz;