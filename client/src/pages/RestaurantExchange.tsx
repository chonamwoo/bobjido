import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserAvatar } from '../utils/userAvatars';
import {
  ArrowsRightLeftIcon,
  MapPinIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ExchangeUser {
  id: string;
  username: string;
  avatar: string;
  specialty: string;
  restaurants: number;
  matchPercentage: number;
  tags: string[];
  rating: number;
  exchanges: number;
  isOnline: boolean;
}

const RestaurantExchange: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'exchange' | 'following'>('exchange');

  // 샘플 데이터 - 실제로는 API에서 가져옴
  const exchangeUsers: ExchangeUser[] = [
    {
      id: '1',
      username: '김미식',
      avatar: getUserAvatar('김미식'),
      specialty: '이태원',
      restaurants: 127,
      matchPercentage: 92,
      tags: ['브런치', '수제버거', '크래프트맥주', '루프탑'],
      rating: 4.8,
      exchanges: 45,
      isOnline: true
    },
    {
      id: '2',
      username: '이구르메',
      avatar: getUserAvatar('이구르메'),
      specialty: '성수동',
      restaurants: 89,
      matchPercentage: 88,
      tags: ['카페', '베이커리', '비건', '와인바'],
      rating: 4.6,
      exchanges: 32,
      isOnline: true
    },
    {
      id: '3',
      username: '박요리',
      avatar: getUserAvatar('박요리'),
      specialty: '강남',
      restaurants: 156,
      matchPercentage: 85,
      tags: ['오마카세', '파인다이닝', '스테이크', '와인'],
      rating: 4.9,
      exchanges: 67,
      isOnline: false
    },
    {
      id: '4',
      username: '최맛집',
      avatar: getUserAvatar('최맛집'),
      specialty: '홍대',
      restaurants: 98,
      matchPercentage: 83,
      tags: ['이자카야', '라멘', '칵테일바', '펍'],
      rating: 4.5,
      exchanges: 28,
      isOnline: true
    },
    {
      id: '5',
      username: '정푸디',
      avatar: getUserAvatar('정푸디'),
      specialty: '을지로',
      restaurants: 73,
      matchPercentage: 79,
      tags: ['노포맛집', '막걸리', '전통주', '고깃집'],
      rating: 4.7,
      exchanges: 21,
      isOnline: false
    },
    {
      id: '6',
      username: '강식도락',
      avatar: getUserAvatar('강식도락'),
      specialty: '연남동',
      restaurants: 64,
      matchPercentage: 76,
      tags: ['브런치', '디저트', '소품샵카페', '베이커리'],
      rating: 4.4,
      exchanges: 19,
      isOnline: true
    }
  ];

  const areas = [
    { value: 'all', label: '전체 지역', count: 234 },
    { value: 'gangnam', label: '강남/서초', count: 45 },
    { value: 'hongdae', label: '홍대/연남', count: 38 },
    { value: 'itaewon', label: '이태원/한남', count: 32 },
    { value: 'seongsu', label: '성수/성동', count: 29 },
    { value: 'jongro', label: '종로/을지로', count: 27 },
    { value: 'gangbuk', label: '강북/노원', count: 21 },
    { value: 'mapo', label: '마포/용산', count: 19 },
    { value: 'dongdaemun', label: '동대문/중구', count: 23 }
  ];

  const myRestaurants = [
    { name: '연남동 파스타', area: '연남동', category: '이탈리안' },
    { name: '홍대 수제버거', area: '홍대', category: '양식' },
    { name: '상수 브런치', area: '상수동', category: '브런치' }
  ];

  const handleExchange = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <ArrowsRightLeftIcon className="w-7 h-7 text-white" />
                </div>
                맛집 교환
              </h1>
              <p className="text-gray-600 mt-2">
                다른 지역 전문가와 맛집 리스트를 교환하고 서로의 지역 전문성을 공유하세요
              </p>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <PlusIcon className="w-5 h-5" />
              교환 요청하기
            </button>
          </div>

          {/* 뷰 모드 탭 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('exchange')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'exchange'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ArrowsRightLeftIcon className="w-4 h-4 inline mr-2" />
              지역 교환
            </button>
            <button
              onClick={() => setViewMode('following')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'following'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <HeartIcon className="w-4 h-4 inline mr-2" />
              팔로잉 맛집
            </button>
          </div>

          {/* 내 정보 카드 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={getUserAvatar('나')}
                  alt="My profile"
                  className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">내 맛집 현황</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 inline mr-1" />
                      주 활동지역: <span className="font-medium">홍대/연남</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      <BuildingStorefrontIcon className="w-4 h-4 inline mr-1" />
                      등록 맛집: <span className="font-medium">42개</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      <ArrowsRightLeftIcon className="w-4 h-4 inline mr-1" />
                      교환 완료: <span className="font-medium">8회</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/my-restaurants"
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                >
                  내 맛집 관리
                </Link>
              </div>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="지역, 사용자, 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              필터
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 사이드바 - 지역 필터 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">지역별 전문가</h3>
              <div className="space-y-2">
                {areas.map(area => (
                  <button
                    key={area.value}
                    onClick={() => setSelectedArea(area.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedArea === area.value
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{area.label}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {area.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">내 최근 맛집</h4>
                <div className="space-y-2">
                  {myRestaurants.map((restaurant, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium text-gray-900">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">
                        {restaurant.area} · {restaurant.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 - 교환 가능한 사용자 목록 */}
          <div className="lg:col-span-3">
            {/* 정렬 옵션 */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{exchangeUsers.length}명</span>의 전문가와 교환 가능
              </p>
              <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>매칭률 높은순</option>
                <option>맛집 많은순</option>
                <option>평점 높은순</option>
                <option>최근 활동순</option>
              </select>
            </div>

            {/* 교환 모드 */}
            {viewMode === 'exchange' && (
              <>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 지역 전문성 교환이란?</h3>
                  <p className="text-sm text-blue-700">
                    서로 다른 지역을 잘 아는 사용자들끼리 맛집 리스트를 교환하는 기능입니다.
                    예: 이태원 전문가 ↔ 성수동 전문가가 서로의 맛집 리스트를 공유
                  </p>
                </div>

                {/* 사용자 카드 그리드 */}
                <div className="grid md:grid-cols-2 gap-4">
                  {exchangeUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
                >
                  {/* 사용자 정보 헤더 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.username}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {user.specialty} 전문
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {user.matchPercentage}% 매칭
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 통계 정보 */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{user.restaurants}</p>
                      <p className="text-xs text-gray-500">맛집</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{user.exchanges}</p>
                      <p className="text-xs text-gray-500">교환</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <p className="text-lg font-bold text-gray-900">{user.rating}</p>
                      </div>
                      <p className="text-xs text-gray-500">평점</p>
                    </div>
                  </div>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {user.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExchange(user.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        selectedUsers.has(user.id)
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {selectedUsers.has(user.id) ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                          선택됨
                        </>
                      ) : (
                        <>
                          <ArrowsRightLeftIcon className="w-4 h-4 inline mr-1" />
                          교환하기
                        </>
                      )}
                    </button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                    </button>
                  </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* 팔로잉 모드 */}
          {viewMode === 'following' && (
            <div>
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-purple-900 mb-2">👥 팔로잉한 사용자의 맛집</h3>
                <p className="text-sm text-purple-700">
                  취향 매칭으로 팔로우한 사용자들의 맛집 리스트를 확인하고 내 리스트에 추가해보세요.
                </p>
              </div>

              <div className="space-y-4">
                {exchangeUsers.slice(0, 3).map((user) => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.username}</h4>
                          <p className="text-sm text-gray-600">
                            {user.specialty} · {user.restaurants}개 맛집
                          </p>
                        </div>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        전체보기 →
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      {['스시 오마카세', '이태원 브런치', '한남동 와인바'].map((restaurant, idx) => (
                        <div key={idx} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                          <p className="font-medium text-gray-900 text-sm">{restaurant}</p>
                          <p className="text-xs text-gray-500 mt-1">{user.specialty}</p>
                          <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
                            + 내 리스트에 추가
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

            {/* 교환 진행 플로팅 버튼 */}
            {selectedUsers.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-40"
              >
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                  <span className="font-medium">{selectedUsers.size}명과 교환 진행</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* 추천 교환 섹션 */}
        {viewMode === 'exchange' && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-500" />
              추천 교환 매칭
            </h2>
            <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">이태원 맛집 전문</span> 김미식님과
                <span className="font-semibold"> 성수동 카페 전문</span> 이구르메님의 교환을 추천드려요!
              </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={getUserAvatar('김미식')}
                    alt="김미식"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">김미식</p>
                    <p className="text-sm text-gray-600">이태원 127개 맛집</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  "성수동 브런치 카페 정보가 필요해요!"
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={getUserAvatar('이구르메')}
                    alt="이구르메"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">이구르메</p>
                    <p className="text-sm text-gray-600">성수동 89개 맛집</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  "이태원 수제버거 맛집 찾고 있어요!"
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              매칭 수락하고 교환 시작하기
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantExchange;