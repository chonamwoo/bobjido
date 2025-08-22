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
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MyStats: React.FC = () => {
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
  const visitTrendData = {
    labels: selectedPeriod === 'week' 
      ? ['월', '화', '수', '목', '금', '토', '일']
      : selectedPeriod === 'month'
      ? ['1주', '2주', '3주', '4주']
      : ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      label: '방문 횟수',
      data: selectedPeriod === 'week'
        ? [2, 1, 3, 2, 4, 5, 3]
        : selectedPeriod === 'month'
        ? [3, 4, 2, 3]
        : [8, 12, 15, 11, 9, 12],
      borderColor: 'rgb(251, 146, 60)',
      backgroundColor: 'rgba(251, 146, 60, 0.5)',
      tension: 0.4
    }]
  };

  // 카테고리별 방문 데이터
  const categoryData = {
    labels: ['한식', '일식', '중식', '양식', '카페', '기타'],
    datasets: [{
      label: '방문 횟수',
      data: [45, 28, 18, 22, 10, 4],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(251, 146, 60, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(168, 85, 247, 0.7)'
      ],
      borderWidth: 0
    }]
  };

  // 시간대별 방문 패턴
  const timePatternData = {
    labels: ['아침', '점심', '저녁', '야식'],
    datasets: [{
      label: '방문 비율',
      data: [5, 35, 52, 8],
      backgroundColor: [
        'rgba(254, 240, 138, 0.7)',
        'rgba(254, 215, 170, 0.7)',
        'rgba(254, 202, 202, 0.7)',
        'rgba(220, 198, 254, 0.7)'
      ],
      borderWidth: 0
    }]
  };

  // 취향 프로필 레이더 차트
  const tasteRadarData = {
    labels: ['매운맛', '단맛', '모험심', '가성비', '분위기', '트렌디'],
    datasets: [{
      label: '나의 취향',
      data: [4, 2, 5, 3, 4, 5],
      backgroundColor: 'rgba(251, 146, 60, 0.2)',
      borderColor: 'rgb(251, 146, 60)',
      pointBackgroundColor: 'rgb(251, 146, 60)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(251, 146, 60)'
    }]
  };

  // 월별 지출 데이터
  const spendingData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      label: '지출 금액',
      data: [120000, 180000, 150000, 200000, 165000, 190000],
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

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
          <div className="h-64">
            <Line data={visitTrendData} options={chartOptions} />
          </div>
        </div>

        {/* 카테고리별 분포 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">카테고리별 방문</h2>
          <div className="h-64">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>

        {/* 시간대별 패턴 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">시간대별 패턴</h2>
          <div className="h-64">
            <Bar data={timePatternData} options={chartOptions} />
          </div>
        </div>

        {/* 취향 프로필 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">나의 취향 프로필</h2>
          <div className="h-64">
            <Radar data={tasteRadarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* 월별 지출 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">월별 지출 현황</h2>
        <div className="h-64">
          <Bar data={spendingData} options={chartOptions} />
        </div>
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

export default MyStats;