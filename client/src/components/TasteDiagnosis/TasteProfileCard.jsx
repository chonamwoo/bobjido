import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  HeartIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import TasteRadarChart from './TasteRadarChart';

const TasteProfileCard = ({ profile, onConfirm, onReanalyze }) => {
  const primaryType = profile?.primaryType;
  const secondaryType = profile?.secondaryType;
  const analysisData = profile?.analysisData;

  if (!primaryType) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">당신의 맛 취향 진단서</h2>
          <span className="text-6xl">{primaryType.emoji}</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-purple-100 text-sm mb-1">주요 타입</p>
            <h3 className="text-2xl font-bold">{primaryType.koreanName}</h3>
            <p className="text-purple-100 mt-1">{primaryType.description}</p>
          </div>

          {secondaryType && (
            <div className="mt-4 pt-4 border-t border-purple-400/30">
              <p className="text-purple-100 text-sm mb-1">부가 타입</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{secondaryType.emoji}</span>
                <h4 className="text-lg font-semibold">{secondaryType.koreanName}</h4>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            취향 타입별 매칭도
          </h4>
          <div className="space-y-3">
            {profile.typeScores?.slice(0, 8).map((score, idx) => (
              <div key={score.tasteType._id || idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{score.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {score.typeKoreanName}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-32">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        idx === 0 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        idx === 1 ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                        'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}
                      style={{ width: `${score.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                    {score.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <TasteRadarChart userProfile={profile} />
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            당신의 특징
          </h4>
          <div className="flex flex-wrap gap-2">
            {primaryType.characteristics?.map((char, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {analysisData && (
          <>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-purple-500" />
                맛집 방문 통계
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 text-sm">총 방문 맛집</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysisData.totalRestaurants}곳
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 text-sm">평균 평점</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysisData.averageRating?.toFixed(1) || '-'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 text-sm">다양성 점수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysisData.diversityScore?.toFixed(0) || '-'}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600 text-sm">충성도 점수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analysisData.loyaltyScore?.toFixed(0) || '-'}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-purple-500" />
                선호 카테고리 TOP 3
              </h4>
              <div className="space-y-2">
                {analysisData.topCategories?.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {idx + 1}. {cat.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {cat.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-purple-500" />
                맛 선호도
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">매운맛 선호도</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={`w-8 h-2 rounded ${
                          level <= (analysisData.spicyPreference || 0)
                            ? 'bg-red-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">가격대</p>
                  <p className="font-medium text-gray-900">
                    {analysisData.averagePriceRange || '-'}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4">
          {!profile.confirmedByUser ? (
            <>
              <button
                onClick={onConfirm}
                className="flex-1 btn btn-primary"
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                이 취향으로 친구 찾기
              </button>
              <button
                onClick={onReanalyze}
                className="flex-1 btn btn-outline"
              >
                다시 분석하기
              </button>
            </>
          ) : (
            <div className="flex-1 text-center py-3 bg-green-50 text-green-700 rounded-lg">
              <p className="font-medium">취향 프로필 확정 완료!</p>
              <p className="text-sm mt-1">비슷한 취향의 친구들을 찾아보세요</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TasteProfileCard;