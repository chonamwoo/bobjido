import React, { useState } from 'react';
import { 
  ChartBarIcon,
  FireIcon,
  MapPinIcon,
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

// 간단한 바 차트 컴포넌트
const SimpleBarChart: React.FC<{ data: number[]; labels: string[]; color: string }> = ({ data, labels, color }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="space-y-3">
      {data.map((value, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{labels[idx]}</span>
            <span className="font-medium">{value}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${(value / maxValue) * 100}%`,
                backgroundColor: color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// 도넛 차트 대체 컴포넌트
const SimplePieChart: React.FC<{ data: number[]; labels: string[]; colors: string[] }> = ({ data, labels, colors }) => {
  const total = data.reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="space-y-2">
      {data.map((value, idx) => {
        const percentage = Math.round((value / total) * 100);
        return (
          <div key={idx} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[idx] }}
            />
            <span className="text-sm text-gray-600 flex-1">{labels[idx]}</span>
            <span className="text-sm font-medium">{percentage}%</span>
            <span className="text-xs text-gray-500">({value})</span>
          </div>
        );
      })}
    </div>
  );
};

const MyStatsSimple: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // 가짜 데이터 생성
  const stats = {
    totalVisits: 127,
    thisMonthVisits: 12,
    favoriteCategory: '한식',
    averageSpending: 15000,
    totalReviews: 43,
    helpfulReviews: 38,
    matchingCount: 24,
    diningBuddyCount: 8,
    trustScore: 85,
    level: 3,
    nextLevelProgress: 65,
    badges: [
      { name: '맛집 탐험가', icon: '🏃', count: 1 },
      { name: '리뷰 마스터', icon: '✍️', count: 1 },
      { name: '취향 쌍둥이', icon: '👯', count: 3 },
      { name: '동행 달인', icon: '🤝', count: 2 }
    ]
  };

  // 방문 트렌드 데이터
  const visitTrendLabels = selectedPeriod === 'week' 
    ? ['월', '화', '수', '목', '금', '토', '일']
    : selectedPeriod === 'month'
    ? ['1주', '2주', '3주', '4주']
    : ['1월', '2월', '3월', '4월', '5월', '6월'];
    
  const visitTrendData = selectedPeriod === 'week'
    ? [2, 1, 3, 2, 4, 5, 3]
    : selectedPeriod === 'month'
    ? [3, 4, 2, 3]
    : [8, 12, 15, 11, 9, 12];

  // 카테고리별 방문 데이터
  const categoryLabels = ['한식', '일식', '중식', '양식', '카페', '기타'];
  const categoryData = [45, 28, 18, 22, 10, 4];
  const categoryColors = [
    '#ef4444',
    '#fb923c',
    '#f59e0b',
    '#22c55e',
    '#3b82f6',
    '#a855f7'
  ];

  // 시간대별 방문 패턴
  const timePatternLabels = ['아침', '점심', '저녁', '야식'];
  const timePatternData = [5, 35, 52, 8];

  // 취향 프로필 데이터
  const tasteProfileData = [
    { label: '매운맛', value: 4, max: 5 },
    { label: '단맛', value: 2, max: 5 },
    { label: '모험심', value: 5, max: 5 },
    { label: '가성비', value: 3, max: 5 },
    { label: '분위기', value: 4, max: 5 },
    { label: '트렌디', value: 5, max: 5 }
  ];

  // 월별 지출 데이터
  const spendingLabels = ['1월', '2월', '3월', '4월', '5월', '6월'];
  const spendingData = [120, 180, 150, 200, 165, 190]; // 천원 단위

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <ChartBarIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">내 통계</h1>
            <p className="text-white/80 mt-1">나의 맛집 여정을 한눈에</p>
          </div>
        </div>

        {/* 레벨 & 진행도 */}
        <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Level {stats.level} 맛집 탐험가</span>
            </div>
            <span className="text-sm text-white/80">
              다음 레벨까지 {100 - stats.nextLevelProgress}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.nextLevelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <MapPinIcon className="w-8 h-8 text-orange-500" />
            <span className="text-xs text-green-600 font-semibold">+12 이번달</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalVisits}</div>
          <div className="text-gray-600 text-sm">총 방문 맛집</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <StarIcon className="w-8 h-8 text-yellow-500" />
            <span className="text-xs text-gray-500">{stats.helpfulReviews}/{stats.totalReviews}</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <div className="text-gray-600 text-sm">작성한 리뷰</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <UserGroupIcon className="w-8 h-8 text-purple-500" />
            <span className="text-xs text-purple-600 font-semibold">활발</span>
          </div>
          <div className="text-2xl font-bold">{stats.matchingCount}</div>
          <div className="text-gray-600 text-sm">취향 매칭</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold">₩{stats.averageSpending.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">평균 지출</div>
        </div>
      </div>

      {/* 획득 배지 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-yellow-500" />
          획득한 배지
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.badges.map((badge, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="font-semibold text-sm">{badge.name}</div>
              <div className="text-xs text-gray-500 mt-1">x{badge.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* 방문 트렌드 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">방문 트렌드</h2>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedPeriod === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period === 'week' ? '주간' : period === 'month' ? '월간' : '연간'}
                </button>
              ))}
            </div>
          </div>
          <SimpleBarChart 
            data={visitTrendData} 
            labels={visitTrendLabels} 
            color="#fb923c" 
          />
        </div>

        {/* 카테고리별 분포 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">카테고리별 방문</h2>
          <SimplePieChart 
            data={categoryData} 
            labels={categoryLabels} 
            colors={categoryColors} 
          />
        </div>

        {/* 시간대별 패턴 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">시간대별 패턴</h2>
          <SimpleBarChart 
            data={timePatternData} 
            labels={timePatternLabels} 
            color="#f97316" 
          />
        </div>

        {/* 취향 프로필 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">나의 취향 프로필</h2>
          <div className="space-y-3">
            {tasteProfileData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}/{item.max}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 월별 지출 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">월별 지출 현황</h2>
        <SimpleBarChart 
          data={spendingData} 
          labels={spendingLabels} 
          color="#22c55e" 
        />
        <p className="text-xs text-gray-500 mt-2 text-center">단위: 천원</p>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₩{Math.round(stats.averageSpending * stats.totalVisits / 6).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">월 평균 지출</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ₩{stats.averageSpending.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">평균 객단가</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₩{(stats.averageSpending * stats.totalVisits).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">총 지출</div>
          </div>
        </div>
      </div>

      {/* 최근 활동 요약 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-orange-600" />
          이번 주 활동
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="font-semibold">3일 연속 방문</div>
              <div className="text-sm text-gray-600">열정적인 한 주!</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <div className="font-semibold">2명과 매칭</div>
              <div className="text-sm text-gray-600">새로운 맛집 친구</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="font-semibold">신뢰도 +5</div>
              <div className="text-sm text-gray-600">꾸준한 활동</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStatsSimple;