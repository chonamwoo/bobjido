import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  SparklesIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  UserPlusIcon,
  HeartIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import axios from '../utils/axios';
import { getMatchAvatar } from '../utils/userAvatars';
import { getGroupImage, getRestaurantImage } from '../utils/restaurantImages';

interface Match {
  id: string;
  username: string;
  profileImage: string;
  matchRate: number;
  matchedAt: string;
  lastMessage?: string;
  isNew: boolean;
  tasteProfile: string;
  distance: number;
  tasteStats: {
    spicy: number;
    sweet: number;
    adventure: number;
    healthy: number;
  };
  region: string;
  favoriteRestaurants?: Restaurant[];
  isLiked?: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image?: string;
  address: string;
}

interface RecommendedUser {
  id: string;
  username: string;
  profileImage: string;
  matchRate: number;
  tasteProfile: string;
  commonTastes: string[];
  tasteStats: {
    spicy: number;
    sweet: number;
    adventure: number;
    healthy: number;
  };
  region: string;
  bio?: string;
  favoriteRestaurants?: Restaurant[];
  isExpert?: boolean;
  expertBadges?: string[];
  restaurantCount?: number;
  followers?: number;
  rating?: number;
  specialty?: string[];
}

interface FoodGroup {
  id: string;
  name: string;
  memberCount: number;
  category: string;
  nextMeetup?: string;
  image: string;
  description?: string;
  tags?: string[];
}

// 샘플 레스토랑 데이터
const sampleRestaurants: Restaurant[] = [
  { id: '1', name: '스시 오마카세', cuisine: '일식', rating: 4.8, address: '강남구 청담동' },
  { id: '2', name: '파스타 부티크', cuisine: '이탈리안', rating: 4.5, address: '성수동' },
  { id: '3', name: '더 스테이크하우스', cuisine: '양식', rating: 4.7, address: '이태원' },
  { id: '4', name: '매운갈비찜', cuisine: '한식', rating: 4.6, address: '홍대' }
];

const mockMatches: Match[] = [
  {
    id: '1',
    username: '김미식',
    profileImage: getMatchAvatar('김미식', '모험적인 미식가'),
    matchRate: 92,
    matchedAt: '2시간 전',
    lastMessage: '안녕하세요! 맛집 추천 부탁드려요 😊',
    isNew: true,
    tasteProfile: '모험적인 미식가',
    distance: 2.3,
    tasteStats: {
      spicy: 85,
      sweet: 45,
      adventure: 90,
      healthy: 60
    },
    region: '강남/서초',
    favoriteRestaurants: sampleRestaurants.slice(0, 3),
    isLiked: false
  },
  {
    id: '2',
    username: '이구르메',
    profileImage: getMatchAvatar('이구르메', '트렌디한 카페러버'),
    matchRate: 85,
    matchedAt: '어제',
    isNew: false,
    tasteProfile: '트렌디한 카페러버',
    distance: 4.1,
    tasteStats: {
      spicy: 40,
      sweet: 80,
      adventure: 75,
      healthy: 70
    },
    region: '성수/한남',
    favoriteRestaurants: sampleRestaurants.slice(1, 4),
    isLiked: true
  }
];

const mockRecommended: RecommendedUser[] = [
  {
    id: '3',
    username: '박맛집',
    profileImage: getMatchAvatar('박맛집', '매운맛 헌터'),
    matchRate: 88,
    tasteProfile: '매운맛 헌터',
    commonTastes: ['한식', '매운맛', '신규 맛집'],
    tasteStats: {
      spicy: 95,
      sweet: 30,
      adventure: 85,
      healthy: 50
    },
    region: '마포/홍대',
    bio: '매운 음식 없이는 못 살아요! 🔥',
    favoriteRestaurants: sampleRestaurants.slice(0, 2)
  },
  {
    id: '4',
    username: '최먹방',
    profileImage: getMatchAvatar('최먹방', '소셜 다이너'),
    matchRate: 82,
    tasteProfile: '소셜 다이너',
    commonTastes: ['양식', '브런치', '분위기'],
    tasteStats: {
      spicy: 50,
      sweet: 65,
      adventure: 70,
      healthy: 75
    },
    region: '이태원/한남',
    bio: '분위기 좋은 곳에서 맛있는 음식과 대화를 즐겨요',
    favoriteRestaurants: sampleRestaurants.slice(2, 4)
  },
  // 취향 쌍둥이 추가 데이터 (90% 이상 매칭)
  {
    id: 'twin1',
    username: '정미슐랭',
    profileImage: getMatchAvatar('정미슐랭', '미슐랭 헌터'),
    matchRate: 96,
    tasteProfile: '미슐랭 헌터',
    commonTastes: ['파인다이닝', '오마카세', '와인'],
    tasteStats: {
      spicy: 60,
      sweet: 40,
      adventure: 95,
      healthy: 60
    },
    region: '청담/압구정',
    bio: '미슐랭 맛집만 찾아다니는 진짜 미식가입니다 ⭐',
    favoriteRestaurants: sampleRestaurants.slice(0, 3)
  },
  {
    id: 'twin2',
    username: '김푸디',
    profileImage: getMatchAvatar('김푸디', '브런치 마스터'),
    matchRate: 94,
    tasteProfile: '브런치 마스터',
    commonTastes: ['브런치', '카페', '베이커리'],
    tasteStats: {
      spicy: 40,
      sweet: 80,
      adventure: 70,
      healthy: 85
    },
    region: '연남/연희',
    bio: '주말 브런치의 정석을 아는 사람 🥐',
    favoriteRestaurants: sampleRestaurants.slice(1, 3)
  },
  {
    id: 'twin3',
    username: '이맛객',
    profileImage: getMatchAvatar('이맛객', '한식 장인'),
    matchRate: 92,
    tasteProfile: '한식 장인',
    commonTastes: ['한식', '전통주', '계절요리'],
    tasteStats: {
      spicy: 70,
      sweet: 45,
      adventure: 65,
      healthy: 75
    },
    region: '종로/을지로',
    bio: '전통 한식과 막걸리의 조화를 사랑합니다 🍚',
    favoriteRestaurants: sampleRestaurants.slice(0, 2)
  },
  {
    id: 'twin4',
    username: '조셰프',
    profileImage: getMatchAvatar('조셰프', '양식 전문가'),
    matchRate: 91,
    tasteProfile: '양식 전문가',
    commonTastes: ['이탈리안', '프렌치', '스테이크'],
    tasteStats: {
      spicy: 45,
      sweet: 55,
      adventure: 80,
      healthy: 65
    },
    region: '이태원/한남',
    bio: '정통 유럽 요리의 매력에 빠진 사람 🍝',
    favoriteRestaurants: sampleRestaurants.slice(1, 4)
  },
  {
    id: 'twin5',
    username: '강라멘',
    profileImage: getMatchAvatar('강라멘', '일식 마니아'),
    matchRate: 93,
    tasteProfile: '일식 마니아',
    commonTastes: ['라멘', '스시', '이자카야'],
    tasteStats: {
      spicy: 65,
      sweet: 35,
      adventure: 88,
      healthy: 55
    },
    region: '홍대/상수',
    bio: '진짜 일본 라멘을 찾아 헤매는 중 🍜',
    favoriteRestaurants: sampleRestaurants.slice(0, 3)
  },
  {
    id: 'twin6',
    username: '윤비건',
    profileImage: getMatchAvatar('윤비건', '비건 푸디'),
    matchRate: 90,
    tasteProfile: '비건 푸디',
    commonTastes: ['비건', '샐러드', '스무디'],
    tasteStats: {
      spicy: 50,
      sweet: 70,
      adventure: 75,
      healthy: 100
    },
    region: '성수/성동',
    bio: '건강하고 맛있는 비건 맛집 전문가 🥗',
    favoriteRestaurants: sampleRestaurants.slice(2, 4)
  }
];

// 지역 전문가 (맛잘알) 데이터
const mockExperts: RecommendedUser[] = [
  {
    id: 'expert1',
    username: '이태원왕',
    profileImage: getMatchAvatar('이태원왕', '지역 전문가'),
    matchRate: 92,
    tasteProfile: '이태원 맛집 마스터',
    commonTastes: ['브런치', '수제버거', '크래프트맥주'],
    tasteStats: {
      spicy: 75,
      sweet: 40,
      adventure: 95,
      healthy: 60
    },
    region: '이태원/한남',
    bio: '이태원의 숨은 맛집을 찾아다니는 미식가입니다',
    favoriteRestaurants: [
      { id: 'r1', name: '루프탑 브런치', cuisine: '브런치', rating: 4.7, address: '이태원' },
      { id: 'r2', name: '이태원 버거', cuisine: '양식', rating: 4.8, address: '이태원' },
      { id: 'r3', name: '한남동 와인바', cuisine: '와인바', rating: 4.6, address: '한남동' }
    ],
    isExpert: true,
    expertBadges: ['🏆 TOP 맛잘알', '🔥 HOT'],
    restaurantCount: 127,
    followers: 892,
    rating: 4.8,
    specialty: ['브런치', '수제버거', '크래프트맥주']
  },
  {
    id: 'expert2',
    username: '성수카페왕',
    profileImage: getMatchAvatar('성수카페왕', '카페 전문가'),
    matchRate: 88,
    tasteProfile: '성수동 카페 투어 전문가',
    commonTastes: ['카페', '베이커리', '비건'],
    tasteStats: {
      spicy: 30,
      sweet: 85,
      adventure: 70,
      healthy: 90
    },
    region: '성수/성동',
    bio: '성수동 카페는 다 가봤어요! ☕',
    favoriteRestaurants: [
      { id: 'r4', name: '성수 카페', cuisine: '카페', rating: 4.5, address: '성수동' },
      { id: 'r5', name: '서울숲 베이커리', cuisine: '베이커리', rating: 4.7, address: '성수동' }
    ],
    isExpert: true,
    expertBadges: ['☕ 카페 마스터'],
    restaurantCount: 89,
    followers: 567,
    rating: 4.6,
    specialty: ['카페', '베이커리', '비건']
  },
  {
    id: 'expert3',
    username: '강남미식가',
    profileImage: getMatchAvatar('강남미식가', '파인다이닝 전문가'),
    matchRate: 85,
    tasteProfile: '강남 파인다이닝 전문가',
    commonTastes: ['오마카세', '파인다이닝', '스테이크'],
    tasteStats: {
      spicy: 40,
      sweet: 50,
      adventure: 85,
      healthy: 70
    },
    region: '강남/서초',
    bio: '강남의 고급 레스토랑은 제가 다 알아요',
    favoriteRestaurants: [
      { id: 'r6', name: '스시 오마카세', cuisine: '일식', rating: 4.9, address: '청담동' },
      { id: 'r7', name: '강남 스테이크', cuisine: '양식', rating: 4.8, address: '강남' }
    ],
    isExpert: true,
    expertBadges: ['🏆 TOP 맛잘알', '👑 미식왕'],
    restaurantCount: 156,
    followers: 1234,
    rating: 4.9,
    specialty: ['오마카세', '파인다이닝', '스테이크']
  }
];

const mockGroups: FoodGroup[] = [
  {
    id: '1',
    name: '강남 맛집 탐험대',
    memberCount: 156,
    category: '지역 모임',
    nextMeetup: '이번 토요일',
    image: getGroupImage('강남 맛집 탐험대'),
    description: '강남의 숨은 맛집을 함께 탐험해요',
    tags: ['강남', '맛집탐방', '주말모임']
  },
  {
    id: '2',
    name: '매운맛 챌린저',
    memberCount: 89,
    category: '취향 모임',
    image: getGroupImage('매운맛 챌린저'),
    description: '매운맛의 한계에 도전하는 모임',
    tags: ['매운맛', '도전', '한식']
  },
  {
    id: '3',
    name: '홍대 브런치 클럽',
    memberCount: 234,
    category: '취향 모임',
    nextMeetup: '일요일 오전 11시',
    image: getGroupImage('홍대 브런치 클럽'),
    description: '주말 브런치를 함께 즐겨요',
    tags: ['브런치', '홍대', '주말']
  }
];

const Matches: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<'pool' | 'groups'>('pool');
  const [poolSubTab, setPoolSubTab] = useState<'today' | 'twins'>('today');
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [recommended, setRecommended] = useState<RecommendedUser[]>(mockRecommended);
  const [experts, setExperts] = useState<RecommendedUser[]>(mockExperts);
  const [groups, setGroups] = useState<FoodGroup[]>(mockGroups);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [expandedExpertId, setExpandedExpertId] = useState<string | null>(null);
  const [followedExperts, setFollowedExperts] = useState<Set<string>>(new Set());
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  
  // URL hash 체크로 탭 설정
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#twins') {
        setPoolSubTab('twins');
      } else {
        setPoolSubTab('today');
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
        setPoolSubTab(e.detail.tab);
      }
    };
    window.addEventListener('matches-tab-change', handleCustomHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('matches-tab-change', handleCustomHashChange);
    };
  }, []);

  const handleToggleLike = (matchId: string) => {
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, isLiked: !match.isLiked }
        : match
    ));
  };

  const handleMatchRequest = (userId: string) => {
    alert('매칭 신청이 완료되었습니다! 🎉');
  };

  const handleViewRestaurants = (userId: string) => {
    setSelectedUserId(selectedUserId === userId ? null : userId);
  };

  const handleToggleExpertExpand = (expertId: string) => {
    setExpandedExpertId(expandedExpertId === expertId ? null : expertId);
  };

  const handleFollowExpert = (expertId: string) => {
    setFollowedExperts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(expertId)) {
        newSet.delete(expertId);
      } else {
        newSet.add(expertId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">취향 매칭</h1>
          <p className="text-gray-700 font-medium">나와 입맛이 통하는 사람들을 만나보세요 🍽️</p>
        </div>

        {/* 메인 탭 */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('pool')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'pool'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-50 border-2 border-pink-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              <span>인재풀</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'groups'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-yellow-50 border-2 border-yellow-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5" />
              <span>먹친그룹</span>
            </div>
          </button>
        </div>

        {/* 인재풀 탭 */}
        {activeTab === 'pool' && (
          <div className="space-y-8">
            {/* 서브 탭 - 오늘의 추천 / 취향 쌍둥이 */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPoolSubTab('today')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  poolSubTab === 'today'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4" />
                  <span>오늘의 추천</span>
                </div>
              </button>
              <button
                onClick={() => setPoolSubTab('twins')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  poolSubTab === 'twins'
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  <span>취향 쌍둥이</span>
                  <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-bold">90%+</span>
                </div>
              </button>
            </div>

            {/* 오늘의 추천 친구 섹션 */}
            {poolSubTab === 'today' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FireIcon className="w-6 h-6 text-orange-500" />
                    오늘의 추천 친구
                  </h2>
                  <button className="text-sm text-pink-600 hover:text-pink-700 font-bold">
                    더보기 →
                  </button>
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommended.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-5 border-2 border-pink-100"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-pink-100"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{user.username}</h3>
                            <p className="text-sm font-medium text-pink-600">{user.tasteProfile}</p>
                            <p className="text-xs text-gray-600 mt-1">📍 {user.region}</p>
                          </div>
                          
                          {/* 작은 바 차트 형태의 매칭률 */}
                          <div className="text-right">
                            <div className="text-xs text-gray-600 mb-1">매칭률</div>
                            <div className="w-20 h-6 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center text-xs font-bold text-white"
                                style={{ width: `${user.matchRate}%` }}
                              >
                                {user.matchRate}%
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 공통 취향 태그 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {user.commonTastes.map((taste, index) => (
                            <span
                              key={index}
                              className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium"
                            >
                              {taste}
                            </span>
                          ))}
                        </div>
                        
                        {/* 액션 버튼 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewRestaurants(user.id)}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-bold flex items-center justify-center gap-1"
                          >
                            <BuildingStorefrontIcon className="w-4 h-4" />
                            맛집 보기
                          </button>
                          <button
                            onClick={() => handleMatchRequest(user.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                          >
                            매칭 신청
                          </button>
                        </div>
                        
                        {/* 선택된 사용자의 맛집 리스트 */}
                        {selectedUserId === user.id && user.favoriteRestaurants && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 bg-pink-50 rounded-lg"
                          >
                            <p className="text-xs font-bold text-pink-700 mb-2">
                              {user.username}님의 맛집
                            </p>
                            <div className="space-y-1">
                              {user.favoriteRestaurants.map((restaurant) => (
                                <div key={restaurant.id} className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-gray-700">{restaurant.name}</span>
                                  <span className="text-gray-500">{restaurant.cuisine} · ⭐{restaurant.rating}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            )}

            {/* 취향 쌍둥이 섹션 */}
            {poolSubTab === 'twins' && (
              <div id="twins">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                      <SparklesIcon className="w-7 h-7 text-purple-500" />
                      취향 쌍둥이
                    </h2>
                    <p className="text-gray-600">
                      90% 이상 매칭률! 나와 입맛이 거의 같은 사람들을 만나보세요 👯
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-bold">
                    특별 매칭
                  </span>
                </div>
                
                {/* 취향 쌍둥이 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommended.filter(user => user.matchRate >= 90).map((twin) => (
                    <motion.div
                      key={twin.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-purple-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={twin.profileImage}
                            alt={twin.username}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-200"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {twin.matchRate}%
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-3">
                            <h3 className="font-bold text-xl text-gray-900">{twin.username}</h3>
                            <p className="text-sm font-bold text-purple-600 mb-1">{twin.tasteProfile}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-600">📍 {twin.region}</span>
                              {twin.bio && (
                                <span className="text-xs text-gray-500 italic">"{twin.bio}"</span>
                              )}
                            </div>
                          </div>
                          
                            {/* 공통 취향 태그 */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {twin.commonTastes.map((taste, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium"
                                >
                                  {taste}
                                </span>
                              ))}
                            </div>
                            
                            {/* 확장 보기 버튼 */}
                            <button
                              onClick={() => handleToggleExpertExpand(twin.id)}
                              className="w-full mb-3 text-left"
                            >
                              <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all">
                                <span className="text-xs font-bold text-purple-700">취향 분석 보기</span>
                                <ChevronDownIcon className={`w-4 h-4 text-purple-600 transition-transform ${expandedExpertId === twin.id ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            
                            {expandedExpertId === twin.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-3 p-3 bg-purple-50 rounded-lg"
                              >
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">🌶️</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-red-400" style={{ width: `${twin.tasteStats.spicy}%` }} />
                                    </div>
                                    <span className="text-xs font-bold">{twin.tasteStats.spicy}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">🍰</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-pink-400" style={{ width: `${twin.tasteStats.sweet}%` }} />
                                    </div>
                                    <span className="text-xs font-bold">{twin.tasteStats.sweet}%</span>
                                  </div>
                                </div>
                            </motion.div>
                          )}
                          
                          {/* 액션 버튼 */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMatchRequest(twin.id)}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
                            >
                              매칭 신청
                            </button>
                            <button
                              onClick={() => handleViewRestaurants(twin.id)}
                              className="px-3 py-2 bg-white text-purple-700 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all text-sm font-bold"
                            >
                              프로필 보기
                            </button>
                          </div>
                          
                          {/* 선택된 사용자의 맛집 리스트 */}
                          {selectedUserId === twin.id && twin.favoriteRestaurants && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 p-3 bg-purple-50 rounded-lg"
                            >
                              <p className="text-xs font-bold text-purple-700 mb-2">
                                {twin.username}님의 추천 맛집
                              </p>
                              <div className="space-y-1">
                                {twin.favoriteRestaurants.map((restaurant) => (
                                  <div key={restaurant.id} className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-gray-700">{restaurant.name}</span>
                                    <span className="text-gray-500">{restaurant.cuisine} · ⭐{restaurant.rating}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 먹친그룹 탭 */}
        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/group/${group.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-yellow-400 to-orange-400 relative overflow-hidden">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                    <p className="text-sm opacity-90">{group.description}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserGroupIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-bold text-gray-700">{group.memberCount}명</span>
                    </div>
                    {group.nextMeetup && (
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-bold">
                        {group.nextMeetup}
                      </span>
                    )}
                  </div>
                  
                  {group.tags && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {group.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-bold">
                    그룹 참여하기
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* 그룹 만들기 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:shadow-lg transition-all group"
              onClick={() => navigate('/create-group')}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">새 그룹 만들기</h3>
              <p className="text-sm text-gray-700 text-center">
                비슷한 취향의 사람들과<br />
                먹친 그룹을 만들어보세요
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;