import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PlaylistCard from '../components/PlaylistCard';
import { 
  SparklesIcon, 
  FireIcon, 
  MapPinIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const Home: React.FC = () => {
  const { data: nearbyBuddies, isLoading } = useQuery({
    queryKey: ['nearby-buddies'],
    queryFn: async () => {
      // 실제 API 호출로 대체 예정
      return mockNearbyBuddies;
    },
  });

  // 가까운 동행 찾기 샘플 데이터
  const mockNearbyBuddies = [
    { id: '1', name: '김미식', restaurant: '스시 오마카세', time: '오늘 7PM', distance: '2.3km', matchRate: 92 },
    { id: '2', name: '이구르메', restaurant: '양꼬치 전문점', time: '내일 6PM', distance: '4.1km', matchRate: 88 },
    { id: '3', name: '박요리', restaurant: '브런치 카페', time: '주말 11AM', distance: '1.5km', matchRate: 85 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section - 극도로 단순화 */}
      <section className="bg-gradient-to-br from-orange-100 via-yellow-50 to-red-50 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                Discover Through Taste
              </span>
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 animate-slide-up">
              <span className="text-gray-700">취향이 맞는 사람과</span> <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-extrabold animate-pulse">새로운 맛집 발견!</span>
            </h2>
            <p className="text-lg text-gray-800 font-semibold mb-12 animate-slide-up animation-delay-200">
              나와 입맛이 통하는 사람들이 추천하는 진짜 맛집
            </p>
            
            {/* 핵심 3개 기능만 강조 */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* 취향 매칭 - 메인 기능 */}
              <Link to="/matches"
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-orange hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 border-2 border-orange-200 hover:border-orange-400 animate-fade-in">
                <div
                    className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-orange">
                  <SparklesIcon className="w-8 h-8 text-white group-hover:animate-pulse"/>
                </div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-2">Discover: 취향 매칭</h3>
                <p className="text-gray-700 text-sm font-medium">나와 입맛이 통하는 사람의 맛집 추천받기</p>
                <div className="mt-4 text-orange-600 font-bold group-hover:text-red-600 transition-colors">시작하기 →</div>
              </Link>

              {/* 동행 찾기 */}
              <Link to="/dining-buddy"
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-yellow hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 border-2 border-yellow-200 hover:border-yellow-400 animate-fade-in animation-delay-200">
                <div
                    className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-yellow">
                  <UserGroupIcon className="w-8 h-8 text-white group-hover:animate-wiggle"/>
                </div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-2">Connect: 동행 찾기</h3>
                <p className="text-gray-700 text-sm font-medium">취향 친구들과 맛집 정보 공유하기</p>
                <div className="mt-4 text-yellow-600 font-bold group-hover:text-orange-600 transition-colors">둘러보기 →
                </div>
              </Link>

              {/* 내 주변 탐색 */}
              <Link to="/map"
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-coral hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 hover:rotate-1 border-2 border-red-200 hover:border-red-400 animate-fade-in animation-delay-400">
                <div
                    className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-coral">
                  <MapPinIcon className="w-8 h-8 text-white group-hover:animate-bounce"/>
                </div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-2">맛집 지도</h3>
                <p className="text-gray-700 text-sm font-medium">취향 친구들이 검증한 진짜 맛집 지도</p>
                <div className="mt-4 text-red-600 font-bold group-hover:text-pink-600 transition-colors">지도 보기 →</div>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 실시간 매칭 현황 - 단순하고 직관적 */}
      <section className="py-12 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">지금 이 순간</h2>
            <p className="text-gray-700 font-medium">실시간으로 매칭되고 있는 사람들</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 방금 매칭된 사람들 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <SparklesIcon className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="font-bold text-gray-900">방금 매칭됨</h3>
                <span className="ml-auto px-2 py-1 bg-emerald-200 text-emerald-700 text-xs rounded-full font-semibold">LIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center bg-white rounded-lg p-3">
                  <div className="flex space-x-1 mr-3">
                    <img src="https://i.pravatar.cc/32?img=1" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://i.pravatar.cc/32?img=2" className="w-8 h-8 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">김미식 ↔ 이구르메</p>
                    <p className="text-xs text-gray-500">매운맛 마니아 • 92% 일치</p>
                  </div>
                  <span className="text-xs text-gray-400">방금 전</span>
                </div>
                <div className="flex items-center bg-white rounded-lg p-3">
                  <div className="flex space-x-1 mr-3">
                    <img src="https://i.pravatar.cc/32?img=3" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://i.pravatar.cc/32?img=4" className="w-8 h-8 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">박요리 ↔ 최맛집</p>
                    <p className="text-xs text-gray-500">카페 투어 • 88% 일치</p>
                  </div>
                  <span className="text-xs text-gray-400">2분 전</span>
                </div>
              </div>
            </div>

            {/* 오늘의 동행 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="w-5 h-5 text-pink-600 mr-2" />
                <h3 className="font-bold text-gray-900">오늘의 동행</h3>
                <span className="ml-auto px-2 py-1 bg-pink-200 text-pink-700 text-xs rounded-full font-semibold">3 NEW</span>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">스시 오마카세</span>
                    <span className="text-xs text-pink-600">오늘 7PM</span>
                  </div>
                  <p className="text-xs text-gray-600">청담 • 2명 구해요 • 15만원선</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">퇴근 후 양꼬치</span>
                    <span className="text-xs text-pink-600">오늘 6PM</span>
                  </div>
                  <p className="text-xs text-gray-600">건대 • 3명 모여요 • 캐주얼</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 간단한 CTA */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            진짜 맛집, 진짜 사람들
          </h2>
          <p className="text-white/90 mb-8">
            취향이 맞는 사람들의 검증된 맛집 추천
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
