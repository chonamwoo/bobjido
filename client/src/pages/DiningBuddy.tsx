import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserAvatar } from '../utils/userAvatars';
import { getRestaurantImage } from '../utils/restaurantImages';
import {
  UsersIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  PlusIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  TagIcon,
  BoltIcon,
  TrophyIcon,
  BuildingStorefrontIcon,
  ArrowRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface TasteProfile {
  spicy: number;
  sweet: number;
  adventure: number;
  healthy: number;
}

interface DiningRequest {
  id: string;
  host: {
    username: string;
    avatar: string;
    rating: number;
    matchPercentage: number;
    tasteProfile: string;
    tasteStats: TasteProfile;
    favoriteRestaurants?: string[];
  };
  restaurant: {
    name: string;
    category: string;
    location: string;
    priceRange: string;
    image?: string;
  };
  datetime: string;
  currentPeople: number;
  maxPeople: number;
  description: string;
  tags: string[];
  status: 'open' | 'almost-full' | 'full';
  isHot?: boolean;
  isRecommended?: boolean;
  isMine?: boolean;
}

const DiningBuddy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'recommended'>('today');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // URL hash 체크로 탭 설정
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#recommended') {
        setActiveTab('recommended');
      } else {
        setActiveTab('today');
      }
    };

    // 초기 로드 시 체크
    handleHashChange();

    // hash 변경 감지
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    // 커스텀 이벤트로도 감지
    const handleCustomHashChange = (e: any) => {
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('dining-tab-change', handleCustomHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('dining-tab-change', handleCustomHashChange);
    };
  }, []);

  // 내가 올린 동행
  const myRequests: DiningRequest[] = [
    {
      id: 'my1',
      host: {
        username: '나',
        avatar: getUserAvatar('나'),
        rating: 4.8,
        matchPercentage: 100,
        tasteProfile: '모험적인 미식가',
        tasteStats: {
          spicy: 85,
          sweet: 45,
          adventure: 95,
          healthy: 70
        },
        favoriteRestaurants: ['스시 오마카세', '파스타 부티크', '더 스테이크하우스']
      },
      restaurant: {
        name: '이태원 신상 브런치',
        category: '브런치',
        location: '이태원',
        priceRange: '₩₩₩',
        image: getRestaurantImage('이태원 신상 브런치')
      },
      datetime: '오늘 오후 1:00',
      currentPeople: 2,
      maxPeople: 4,
      description: '루프탑 뷰가 끝내주는 브런치 카페! 인스타 감성 충만한 곳이에요 📸',
      tags: ['브런치', '루프탑', '인스타감성'],
      status: 'open',
      isMine: true
    }
  ];

  // 오늘의 동행
  const todayRequests: DiningRequest[] = [
    {
      id: '1',
      host: {
        username: '김미식',
        avatar: getUserAvatar('김미식'),
        rating: 4.8,
        matchPercentage: 92,
        tasteProfile: '고급 미식가',
        tasteStats: {
          spicy: 60,
          sweet: 40,
          adventure: 85,
          healthy: 50
        },
        favoriteRestaurants: ['스시 오마카세 긴자', '르 베르나르댕', '정식당']
      },
      restaurant: {
        name: '스시 오마카세 긴자',
        category: '일식',
        location: '청담동',
        priceRange: '₩₩₩₩',
        image: getRestaurantImage('스시 오마카세')
      },
      datetime: '오늘 오후 7:00',
      currentPeople: 2,
      maxPeople: 4,
      description: '고급 스시 오마카세 함께 즐기실 분 모집합니다. 1인당 15만원 정도 예상됩니다.',
      tags: ['오마카세', '스시', '고급'],
      status: 'open',
      isHot: true
    },
    {
      id: '2',
      host: {
        username: '이구르메',
        avatar: getUserAvatar('이구르메'),
        rating: 4.6,
        matchPercentage: 88,
        tasteProfile: '캐주얼 탐험가',
        tasteStats: {
          spicy: 75,
          sweet: 30,
          adventure: 70,
          healthy: 60
        },
        favoriteRestaurants: ['양꼬치 전문점', '마라탕 맛집', '훠궈 천국']
      },
      restaurant: {
        name: '양꼬치 전문점',
        category: '중식',
        location: '건대입구',
        priceRange: '₩₩',
        image: getRestaurantImage('양꼬치')
      },
      datetime: '오늘 오후 6:00',
      currentPeople: 3,
      maxPeople: 6,
      description: '퇴근 후 양꼬치에 칭따오 한잔! 편하게 오세요~',
      tags: ['양꼬치', '칭따오', '캐주얼'],
      status: 'almost-full'
    }
  ];

  // 추천 기반 동행
  const recommendedRequests: DiningRequest[] = [
    {
      id: 'r1',
      host: {
        username: '박맛집',
        avatar: getUserAvatar('박맛집'),
        rating: 4.9,
        matchPercentage: 95,
        tasteProfile: '매운맛 헌터',
        tasteStats: {
          spicy: 95,
          sweet: 20,
          adventure: 90,
          healthy: 40
        },
        favoriteRestaurants: ['마라탕 천국', '불타는 떡볶이', '지옥라면']
      },
      restaurant: {
        name: '사천 정통 마라탕',
        category: '중식',
        location: '홍대',
        priceRange: '₩₩',
        image: getRestaurantImage('마라탕')
      },
      datetime: '내일 오후 7:00',
      currentPeople: 1,
      maxPeople: 4,
      description: '진짜 사천식 마라탕! 매운맛 도전하실 분들만 오세요 🔥🔥🔥',
      tags: ['마라탕', '매운맛', '도전'],
      status: 'open',
      isRecommended: true
    },
    {
      id: 'r2',
      host: {
        username: '최와인',
        avatar: getUserAvatar('최와인'),
        rating: 4.7,
        matchPercentage: 91,
        tasteProfile: '와인 소믈리에',
        tasteStats: {
          spicy: 30,
          sweet: 70,
          adventure: 80,
          healthy: 85
        },
        favoriteRestaurants: ['와인바 르뱅', '비스트로 드 욘빌', '치즈룸']
      },
      restaurant: {
        name: '와인바 르뱅',
        category: '와인바',
        location: '청담동',
        priceRange: '₩₩₩',
        image: getRestaurantImage('와인바')
      },
      datetime: '금요일 오후 8:00',
      currentPeople: 2,
      maxPeople: 4,
      description: '와인 입문자 환영! 소믈리에가 추천해주는 와인과 페어링 요리를 즐겨요',
      tags: ['와인', '페어링', '분위기'],
      status: 'open',
      isRecommended: true
    }
  ];

  // 모든 요청 합치기
  const allRequests = [...myRequests, ...todayRequests, ...recommendedRequests];

  const categories = [
    { value: 'all', label: '전체', icon: '🍽️' },
    { value: 'korean', label: '한식', icon: '🥘' },
    { value: 'japanese', label: '일식', icon: '🍱' },
    { value: 'chinese', label: '중식', icon: '🥟' },
    { value: 'western', label: '양식', icon: '🍕' },
    { value: 'brunch', label: '브런치', icon: '🥞' },
    { value: 'drinks', label: '술/바', icon: '🍺' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-700 border-green-200';
      case 'almost-full': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'full': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'open': return '모집중';
      case 'almost-full': return '마감임박';
      case 'full': return '마감';
      default: return status;
    }
  };

  const handleToggleExpand = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  // 탭에 따른 데이터 필터링
  const getDisplayRequests = () => {
    switch(activeTab) {
      case 'today':
        return [...myRequests, ...todayRequests];
      case 'recommended':
        return recommendedRequests;
      default:
        return [...myRequests, ...todayRequests];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                동행 찾기
              </h1>
              <p className="text-gray-700 font-medium mt-2">
                혼자 가기 부담스러운 맛집, 함께 갈 동행을 찾아보세요 🍽️
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all font-bold"
            >
              <PlusIcon className="w-5 h-5" />
              동행 모집하기
            </button>
          </div>

          {/* 내가 올린 동행 (있을 경우) */}
          {myRequests.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-blue-600" />
                  내가 모집중인 동행
                </h3>
                <span className="text-sm text-blue-600 font-bold">
                  {myRequests[0].currentPeople}/{myRequests[0].maxPeople}명 참여중
                </span>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={myRequests[0].restaurant.image}
                      alt={myRequests[0].restaurant.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{myRequests[0].restaurant.name}</h4>
                      <p className="text-sm text-gray-600">{myRequests[0].restaurant.location} · {myRequests[0].datetime}</p>
                      <p className="text-sm text-gray-700 mt-1">{myRequests[0].description}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                    관리하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 메인 탭 */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'today'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200'
              }`}
            >
              <BoltIcon className="w-5 h-5" />
              오늘의 동행
              {activeTab === 'today' && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {todayRequests.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'recommended'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200'
              }`}
            >
              <SparklesIcon className="w-5 h-5" />
              추천 기반
              {activeTab === 'recommended' && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {recommendedRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-bold border-2 border-orange-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayRequests().map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
            >
              {/* 상태 배지 */}
              <div className="relative">
                {/* 레스토랑 이미지 */}
                {request.restaurant.image && (
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 relative overflow-hidden">
                    <img
                      src={request.restaurant.image}
                      alt={request.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* 레스토랑 정보 오버레이 */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-xl mb-1">{request.restaurant.name}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {request.restaurant.location}
                        </span>
                        <span>{request.restaurant.category}</span>
                        <span className="font-bold">{request.restaurant.priceRange}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 배지들 */}
                <div className="absolute top-3 left-3 right-3 flex justify-between">
                  <div className="flex gap-2">
                    {request.isHot && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <FireIcon className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                    {request.isRecommended && (
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3" />
                        추천
                      </span>
                    )}
                    {request.isMine && (
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                        내 모집
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* 호스트 정보 & 매칭률 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={request.host.avatar}
                      alt={request.host.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{request.host.username}</p>
                      <p className="text-xs font-medium text-pink-600">{request.host.tasteProfile}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-gray-600 ml-0.5">{request.host.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 매칭률 작은 바 차트 */}
                  <div className="text-right">
                    <div className="text-xs text-gray-600 mb-1">매칭률</div>
                    <div className="w-20 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center text-xs font-bold text-white"
                        style={{ width: `${request.host.matchPercentage}%` }}
                      >
                        {request.host.matchPercentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 호스트 취향 미니 바 차트 */}
                <button 
                  onClick={() => handleToggleExpand(request.id)}
                  className="w-full mb-3 text-left"
                >
                  <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all">
                    <span className="text-xs font-bold text-pink-700">취향 프로필 보기</span>
                    <ChevronDownIcon className={`w-4 h-4 text-pink-600 transition-transform ${expandedUserId === request.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {expandedUserId === request.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🌶️ 매운맛</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-400"
                            style={{ width: `${request.host.tasteStats.spicy}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{request.host.tasteStats.spicy}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🍰 단맛</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-pink-400"
                            style={{ width: `${request.host.tasteStats.sweet}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{request.host.tasteStats.sweet}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🚀 모험</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400"
                            style={{ width: `${request.host.tasteStats.adventure}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{request.host.tasteStats.adventure}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">🥗 건강</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-400"
                            style={{ width: `${request.host.tasteStats.healthy}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{request.host.tasteStats.healthy}%</span>
                      </div>
                    </div>
                    
                    {/* 호스트의 맛집 */}
                    {request.host.favoriteRestaurants && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs font-bold text-gray-700 mb-1">
                          {request.host.username}님의 단골 맛집
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {request.host.favoriteRestaurants.map((restaurant, idx) => (
                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded-full border border-gray-200">
                              {restaurant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 시간 정보 */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-bold text-gray-900">{request.datetime}</span>
                </div>

                {/* 설명 */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {request.description}
                </p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {request.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 참여 현황 및 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-bold text-gray-900">
                      {request.currentPeople}/{request.maxPeople}명
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(Math.min(request.currentPeople, 3))].map((_, idx) => (
                        <img
                          key={idx}
                          src={getUserAvatar(`user${idx}`)}
                          alt="participant"
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      ))}
                      {request.currentPeople > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">+{request.currentPeople - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {request.isMine ? (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                      관리
                    </button>
                  ) : request.status !== 'full' ? (
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all">
                      참여하기
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed" disabled>
                      마감
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {getDisplayRequests().length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <UsersIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              현재 모집 중인 동행이 없어요
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째로 동행을 모집해보세요!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              동행 모집하기
            </button>
          </div>
        )}

        {/* 플로팅 버튼 (모바일) */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="sm:hidden fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DiningBuddy;