import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
  BeakerIcon,
  ChartBarIcon,
  LightBulbIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { User } from '../types';

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

const TasteDiagnosis: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // TypeScript 타입 확인을 위한 타입 어설션
  const typedUser = user as any;

  // 현재 사용자의 취향 프로필 정보
  const currentProfile = typeof user?.tasteProfile === 'string' 
    ? user.tasteProfile 
    : user?.tasteProfile?.type || null;
  
  const profileData = currentProfile ? tasteProfiles[currentProfile as keyof typeof tasteProfiles] : null;
  
  // 취향 점수 (실제로는 서버에서 가져와야 함)
  const mockScores = {
    spicy_adventurer: 65,
    trendy_explorer: 82,
    comfort_lover: 45,
    social_foodie: 73,
    budget_gourmet: 58,
    premium_diner: 34,
    solo_explorer: 29,
    traditional_taste: 71
  };

  const sortedProfiles = Object.entries(mockScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  if (!typedUser?.onboardingCompleted || !currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <BeakerIcon className="w-16 h-16 text-purple-500 mx-auto mb-6" />
          
          <h1 className="text-2xl font-bold mb-4">
            아직 취향 진단을 받지 않았어요
          </h1>
          
          <p className="text-gray-600 mb-8">
            온보딩 과정에서 취향 진단을 먼저 받아주세요!
          </p>

          <button
            onClick={() => navigate('/onboarding')}
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
          >
            <BeakerIcon className="w-5 h-5" />
            취향 진단 받기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">내 취향 분석</h1>
          <p className="text-gray-600">
            당신의 음식 취향과 현재 취향 점수를 확인해보세요
          </p>
        </div>

        {/* 현재 주요 취향 프로필 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="text-6xl">{profileData?.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="w-6 h-6 text-yellow-300" />
                <span className="text-sm opacity-90">현재 주요 취향</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{profileData?.title}</h2>
              <p className="text-lg opacity-90">{profileData?.description}</p>
            </div>
          </div>
        </motion.div>

        {/* 취향 점수 차트 */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <ChartBarIcon className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold">취향 점수</h3>
            </div>
            
            <div className="space-y-4">
              {sortedProfiles.map(([profileKey, score], index) => {
                const profile = tasteProfiles[profileKey as keyof typeof tasteProfiles];
                return (
                  <div key={profileKey} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{profile.emoji}</span>
                        <span className="font-medium text-sm">{profile.title}</span>
                      </div>
                      <span className="text-sm font-bold text-purple-600">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                          index === 1 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          'bg-gray-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 동적 업데이트 안내 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <LightBulbIcon className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-semibold">취향은 어떻게 변화하나요?</h3>
            </div>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 mb-1">맛집 등록</p>
                  <p>새로운 맛집을 등록할 때마다 해당 음식 스타일에 따라 취향 점수가 조금씩 변화합니다.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 mb-1">리뷰 작성</p>
                  <p>리뷰 내용을 분석해서 당신이 실제로 좋아하는 맛과 분위기를 파악합니다.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800 mb-1">활동 패턴</p>
                  <p>방문하는 맛집, 저장하는 장소들을 통해 자연스럽게 취향이 업데이트됩니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">자동 알림</span>
              </div>
              <p className="text-sm text-amber-700">
                취향이 크게 변할 때 "이런 쪽을 좋아하시네요! 취향을 업데이트 하시겠어요?" 라고 알려드려요.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 활동 기반 인사이트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-6">최근 활동 기반 인사이트</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl mb-2">🌶️</div>
              <p className="text-sm text-gray-600 mb-1">최근 매운 음식</p>
              <p className="font-bold text-purple-600">+5% 증가</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-sm text-gray-600 mb-1">트렌디한 장소</p>
              <p className="font-bold text-blue-600">+8% 증가</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-sm text-gray-600 mb-1">소셜 다이닝</p>
              <p className="font-bold text-green-600">+3% 증가</p>
            </div>
          </div>
        </motion.div>

        {/* 하단 액션 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/explore')}
            className="btn btn-primary mr-4"
          >
            맛집 탐험하기
          </button>
          <button
            onClick={() => navigate('/saved')}
            className="btn btn-outline"
          >
            내 맛집 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasteDiagnosis;