import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const TasteRadarChart = ({ userProfile, compareProfile = null, showComparison = false }) => {
  if (!userProfile?.typeScores) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">데이터가 없습니다</p>
      </div>
    );
  }

  // 레이더 차트용 데이터 준비
  const chartData = userProfile.typeScores.slice(0, 8).map(score => {
    const data = {
      taste: score.typeKoreanName || '알 수 없음',
      user: score.percentage || 0,
    };

    // 비교할 프로필이 있으면 해당 데이터도 추가
    if (compareProfile?.typeScores) {
      const compareScore = compareProfile.typeScores.find(
        cs => cs.typeKoreanName === score.typeKoreanName
      );
      data.compare = compareScore?.percentage || 0;
    }

    return data;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        {showComparison ? '취향 호환성 비교' : '취향 분포도'}
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid 
              gridType="polygon"
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <PolarAngleAxis 
              dataKey="taste" 
              tick={{ fontSize: 12, fill: '#374151' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickCount={5}
            />
            <Radar
              name="내 취향"
              dataKey="user"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
            {showComparison && compareProfile && (
              <Radar
                name="비교 대상"
                dataKey="compare"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ fill: '#ec4899', strokeWidth: 2, r: 3 }}
              />
            )}
            <Legend 
              wrapperStyle={{ fontSize: '14px' }}
              iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {showComparison && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            두 취향의 유사도를 한눈에 비교해보세요
          </p>
        </div>
      )}
    </div>
  );
};

export default TasteRadarChart;