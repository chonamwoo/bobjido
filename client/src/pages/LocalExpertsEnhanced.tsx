import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserAvatar } from '../utils/userAvatars';
import { getRestaurantImage } from '../utils/restaurantImages';
import {
  MapPinIcon,
  SparklesIcon,
  UserPlusIcon,
  CheckCircleIcon,
  StarIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  FireIcon,
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  BookmarkIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowPathIcon,
  FunnelIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HomeIcon,
  GlobeAltIcon,
  SparklesIcon as MagicIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BoltIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  HeartIcon as HeartSolidIcon,
  HandThumbUpIcon as ThumbUpSolidIcon,
  HandThumbDownIcon as ThumbDownSolidIcon,
  FireIcon as FireSolidIcon,
  TrophyIcon as TrophySolidIcon
} from '@heroicons/react/24/solid';

// 타입별 특이한 타이틀들
const EXPERT_TITLES = {
  spicyLover: {
    icon: '🌶️',
    titles: ['불맛 소방관', '캡사이신 전도사', '매운맛 수호자', '불닭 챔피언', '떡볶이 박사'],
    color: 'from-red-500 to-orange-500'
  },
  sweetTooth: {
    icon: '🍰',
    titles: ['설탕 요정', '디저트 헌터', '마카롱 수집가', '케이크 소믈리에', '당충전 마스터'],
    color: 'from-pink-500 to-purple-500'
  },
  adventurer: {
    icon: '🚀',
    titles: ['맛 탐험가', '신메뉴 개척자', '퓨전 파이오니어', '미식 모험가', '트렌드 세터'],
    color: 'from-purple-500 to-indigo-500'
  },
  healthy: {
    icon: '🥗',
    titles: ['샐러드 구루', '비건 전사', '클린푸드 달인', '영양학 덕후', '웰빙 멘토'],
    color: 'from-green-500 to-emerald-500'
  },
  budgetKing: {
    icon: '💰',
    titles: ['가성비 황제', '혜자 사냥꾼', '할인 레이더', '쿠폰 마법사', '알뜰 미식가'],
    color: 'from-yellow-500 to-amber-500'
  },
  luxury: {
    icon: '👑',
    titles: ['파인다이닝 귀족', '오마카세 컬렉터', '미슐랭 추적자', '프리미엄 감별사', '럭셔리 큐레이터'],
    color: 'from-amber-500 to-yellow-600'
  },
  nightOwl: {
    icon: '🦉',
    titles: ['심야식당 지킴이', '새벽 라멘 마스터', '24시 전문가', '올빼미 미식가', '한밤의 포식자'],
    color: 'from-indigo-600 to-purple-600'
  },
  coffeeLover: {
    icon: '☕',
    titles: ['카페인 중독자', '라떼아트 감상가', '원두 소믈리에', '드립 마스터', '아메리카노 전도사'],
    color: 'from-amber-600 to-brown-600'
  },
  localHero: {
    icon: '🏘️',
    titles: ['동네 터줏대감', '골목대장', '로컬 가이드', '우리동네 백과사전', '토박이 큐레이터'],
    color: 'from-blue-500 to-cyan-500'
  },
  trendsetter: {
    icon: '✨',
    titles: ['핫플 레이더', '인스타 감성러', 'SNS 인플루언서', '바이럴 메이커', '트렌드 예언가'],
    color: 'from-gradient-to-r from-purple-400 via-pink-400 to-red-400'
  }
};

// 창의적인 찐맛집 필터들
const AUTHENTIC_FILTERS = [
  { 
    id: 'oldSchool', 
    label: '30년 전통',
    icon: '🏛️',
    description: '할머니 손맛 그대로',
    color: 'from-amber-600 to-brown-600'
  },
  { 
    id: 'hiddenGem', 
    label: '간판없는 맛집',
    icon: '🤫',
    description: '아는 사람만 아는',
    color: 'from-purple-600 to-indigo-600'
  },
  { 
    id: 'longQueue', 
    label: '줄서는 집',
    icon: '⏰',
    description: '1시간은 기본',
    color: 'from-red-500 to-orange-500'
  },
  { 
    id: 'taxiDriver', 
    label: '기사님 추천',
    icon: '🚕',
    description: '택시기사 맛집 리스트',
    color: 'from-yellow-500 to-amber-500'
  },
  { 
    id: 'localOnly', 
    label: '현지인만',
    icon: '🏘️',
    description: '관광객은 모르는',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'noDelivery', 
    label: '배달불가',
    icon: '🚫',
    description: '직접 가야만 하는',
    color: 'from-gray-600 to-gray-800'
  },
  { 
    id: 'soldOut', 
    label: '품절대란',
    icon: '💥',
    description: '재료 소진 단골집',
    color: 'from-red-600 to-pink-600'
  },
  { 
    id: 'celebrity', 
    label: '연예인 단골',
    icon: '⭐',
    description: '스타들의 아지트',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'oneMeal', 
    label: '하루 한끼',
    icon: '1️⃣',
    description: '점심만 or 저녁만',
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    id: 'reservation', 
    label: '예약필수',
    icon: '📅',
    description: '한달 전 예약',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'michelin',
    label: '미슐랭 가이드',
    icon: '🌟',
    description: '별을 받은 맛집',
    color: 'from-yellow-500 to-red-500'
  },
  {
    id: 'morning',
    label: '새벽까지',
    icon: '🌙',
    description: '밤 12시 이후도 영업',
    color: 'from-gray-700 to-blue-900'
  },
  {
    id: 'homeStyle',
    label: '집밥스타일',
    icon: '🏠',
    description: '엄마 손맛',
    color: 'from-green-500 to-lime-500'
  },
  {
    id: 'waitLine',
    label: '줄서는 맛집',
    icon: '⏰',
    description: '웨이팅 필수',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'delivery',
    label: '배달안되는',
    icon: '🚫',
    description: '직접 가야만 먹는',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'seasonal',
    label: '계절메뉴',
    icon: '🍂',
    description: '특정 계절만 판매',
    color: 'from-orange-400 to-yellow-500'
  },
  {
    id: 'fusion',
    label: '퓨전요리',
    icon: '🎨',
    description: '창의적인 조합',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'organic',
    label: '유기농맛집',
    icon: '🌱',
    description: '건강한 재료만',
    color: 'from-green-600 to-teal-500'
  },
  {
    id: 'studentFav',
    label: '대학생천국',
    icon: '🎓',
    description: '가성비 최고',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'petFriendly',
    label: '애견동반',
    icon: '🐕',
    description: '반려동물 환영',
    color: 'from-amber-500 to-orange-500'
  }
];

interface VoteData {
  expertId: string;
  votes: {
    up: number;
    down: number;
    userVote: 'up' | 'down' | null;
  };
}

interface TasteProfile {
  spicy: number;
  sweet: number;
  adventure: number;
  healthy: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  authenticTags?: string[];
}

interface LocalExpert {
  id: string;
  username: string;
  avatar: string;
  area: string;
  specialty: string[];
  restaurants: number;
  followers: number;
  rating: number;
  matchPercentage: number;
  isFollowing: boolean;
  recentRestaurants: Restaurant[];
  badges: string[];
  tasteProfile: string;
  tasteStats: TasteProfile;
  bio?: string;
  isTop?: boolean;
  isHot?: boolean;
  expertType: keyof typeof EXPERT_TITLES;
  title?: string;
  authenticFilters?: string[];
}

const LocalExpertsEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('all');
  const [activeTab, setActiveTab] = useState<'hot' | 'following' | 'all' | 'vote'>('vote');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedExperts, setFollowedExperts] = useState<Set<string>>(new Set(['2']));
  const [expandedExpertId, setExpandedExpertId] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // 투표 데이터
  const [votesData, setVotesData] = useState<Map<string, VoteData>>(new Map([
    ['1', { expertId: '1', votes: { up: 127, down: 8, userVote: null }}],
    ['2', { expertId: '2', votes: { up: 89, down: 12, userVote: 'up' }}],
    ['3', { expertId: '3', votes: { up: 234, down: 15, userVote: null }}],
    ['4', { expertId: '4', votes: { up: 67, down: 23, userVote: null }}],
  ]));

  // 샘플 데이터 - 타이틀과 필터 추가
  const experts: LocalExpert[] = [
    {
      id: '1',
      username: '김미식',
      avatar: getUserAvatar('김미식'),
      area: '이태원',
      specialty: ['브런치', '수제버거', '크래프트맥주'],
      restaurants: 127,
      followers: 892,
      rating: 4.8,
      matchPercentage: 92,
      isFollowing: false,
      recentRestaurants: [
        { 
          id: 'r1', 
          name: '루프탑 브런치', 
          cuisine: '브런치', 
          rating: 4.7, 
          image: getRestaurantImage('루프탑 브런치'),
          authenticTags: ['hiddenGem', 'celebrity']
        },
        { 
          id: 'r2', 
          name: '이태원 버거', 
          cuisine: '양식', 
          rating: 4.8, 
          image: getRestaurantImage('이태원 버거'),
          authenticTags: ['longQueue']
        },
        { 
          id: 'r3', 
          name: '한남동 와인바', 
          cuisine: '와인바', 
          rating: 4.6, 
          image: getRestaurantImage('한남동 와인바'),
          authenticTags: ['reservation', 'celebrity']
        }
      ],
      badges: ['🏆', '🔥'],
      tasteProfile: '모험적인 미식가',
      tasteStats: {
        spicy: 75,
        sweet: 40,
        adventure: 95,
        healthy: 60
      },
      bio: '이태원의 숨은 맛집을 찾아다니는 미식가입니다',
      isTop: true,
      isHot: true,
      expertType: 'adventurer',
      title: '미식 모험가',
      authenticFilters: ['hiddenGem', 'celebrity', 'reservation']
    },
    {
      id: '2',
      username: '이구르메',
      avatar: getUserAvatar('이구르메'),
      area: '성수동',
      specialty: ['카페', '베이커리', '비건'],
      restaurants: 89,
      followers: 567,
      rating: 4.6,
      matchPercentage: 88,
      isFollowing: true,
      recentRestaurants: [
        { 
          id: 'r4', 
          name: '성수 카페', 
          cuisine: '카페', 
          rating: 4.5, 
          image: getRestaurantImage('성수 카페'),
          authenticTags: ['hiddenGem', 'noDelivery']
        },
        { 
          id: 'r5', 
          name: '서울숲 베이커리', 
          cuisine: '베이커리', 
          rating: 4.7, 
          image: getRestaurantImage('서울숲 베이커리'),
          authenticTags: ['soldOut', 'oneMeal']
        },
        { 
          id: 'r6', 
          name: '비건 레스토랑', 
          cuisine: '비건', 
          rating: 4.4, 
          image: getRestaurantImage('비건 레스토랑'),
          authenticTags: ['localOnly']
        }
      ],
      badges: ['☕'],
      tasteProfile: '트렌디한 카페러버',
      tasteStats: {
        spicy: 30,
        sweet: 85,
        adventure: 70,
        healthy: 90
      },
      bio: '성수동 카페 투어 전문가',
      isHot: true,
      expertType: 'coffeeLover',
      title: '드립 마스터',
      authenticFilters: ['hiddenGem', 'soldOut', 'noDelivery']
    },
    {
      id: '3',
      username: '박요리',
      avatar: getUserAvatar('박요리'),
      area: '강남',
      specialty: ['오마카세', '파인다이닝', '스테이크'],
      restaurants: 156,
      followers: 1234,
      rating: 4.9,
      matchPercentage: 85,
      isFollowing: false,
      recentRestaurants: [
        { 
          id: 'r7', 
          name: '스시 오마카세', 
          cuisine: '일식', 
          rating: 4.9, 
          image: getRestaurantImage('스시 오마카세'),
          authenticTags: ['reservation', 'celebrity', 'luxury']
        },
        { 
          id: 'r8', 
          name: '강남 스테이크', 
          cuisine: '양식', 
          rating: 4.8, 
          image: getRestaurantImage('강남 스테이크'),
          authenticTags: ['longQueue', 'celebrity']
        },
        { 
          id: 'r9', 
          name: '코스 요리', 
          cuisine: '프렌치', 
          rating: 4.7, 
          image: getRestaurantImage('코스 요리'),
          authenticTags: ['reservation', 'luxury']
        }
      ],
      badges: ['🏆', '👑'],
      tasteProfile: '고급 미식가',
      tasteStats: {
        spicy: 40,
        sweet: 50,
        adventure: 85,
        healthy: 70
      },
      bio: '강남의 파인다이닝 전문가',
      isTop: true,
      expertType: 'luxury',
      title: '미슐랭 추적자',
      authenticFilters: ['reservation', 'celebrity']
    },
    {
      id: '4',
      username: '최맛집',
      avatar: getUserAvatar('최맛집'),
      area: '홍대',
      specialty: ['이자카야', '라멘', '칵테일'],
      restaurants: 98,
      followers: 445,
      rating: 4.5,
      matchPercentage: 79,
      isFollowing: false,
      recentRestaurants: [
        { 
          id: 'r10', 
          name: '홍대 이자카야', 
          cuisine: '일식', 
          rating: 4.5, 
          image: getRestaurantImage('홍대 이자카야'),
          authenticTags: ['nightOwl', 'localOnly']
        },
        { 
          id: 'r11', 
          name: '라멘 맛집', 
          cuisine: '일식', 
          rating: 4.6, 
          image: getRestaurantImage('라멘 맛집'),
          authenticTags: ['longQueue', 'soldOut']
        },
        { 
          id: 'r12', 
          name: '루프탑 바', 
          cuisine: '바', 
          rating: 4.4, 
          image: getRestaurantImage('루프탑 바'),
          authenticTags: ['hiddenGem', 'nightOwl']
        }
      ],
      badges: ['🍺'],
      tasteProfile: '캐주얼 미식가',
      tasteStats: {
        spicy: 70,
        sweet: 35,
        adventure: 75,
        healthy: 40
      },
      bio: '홍대 술집 탐험가',
      expertType: 'nightOwl',
      title: '새벽 라멘 마스터',
      authenticFilters: ['nightOwl', 'localOnly', 'longQueue']
    },
    {
      id: '5',
      username: '정가성비',
      avatar: getUserAvatar('정가성비'),
      area: '신촌',
      specialty: ['백반', '분식', '치킨'],
      restaurants: 234,
      followers: 1567,
      rating: 4.7,
      matchPercentage: 91,
      isFollowing: false,
      recentRestaurants: [
        { 
          id: 'r13', 
          name: '신촌 백반집', 
          cuisine: '한식', 
          rating: 4.6, 
          image: getRestaurantImage('백반집'),
          authenticTags: ['oldSchool', 'taxiDriver', 'localOnly']
        },
        { 
          id: 'r14', 
          name: '떡볶이 천국', 
          cuisine: '분식', 
          rating: 4.5, 
          image: getRestaurantImage('떡볶이'),
          authenticTags: ['oldSchool', 'soldOut']
        },
        { 
          id: 'r15', 
          name: '통닭거리', 
          cuisine: '치킨', 
          rating: 4.7, 
          image: getRestaurantImage('치킨'),
          authenticTags: ['oldSchool', 'longQueue']
        }
      ],
      badges: ['💰', '🔥', '🏆'],
      tasteProfile: '가성비 전문가',
      tasteStats: {
        spicy: 80,
        sweet: 45,
        adventure: 60,
        healthy: 50
      },
      bio: '만원의 행복을 찾아서',
      isTop: true,
      isHot: true,
      expertType: 'budgetKing',
      title: '혜자 사냥꾼',
      authenticFilters: ['oldSchool', 'taxiDriver', 'localOnly']
    }
  ];

  const areas = [
    { value: 'all', label: '전체' },
    { value: 'gangnam', label: '강남/서초' },
    { value: 'hongdae', label: '홍대/연남' },
    { value: 'itaewon', label: '이태원/한남' },
    { value: 'seongsu', label: '성수/성동' },
    { value: 'jongro', label: '종로/을지로' }
  ];

  const handleVote = (expertId: string, voteType: 'up' | 'down') => {
    setVotesData(prev => {
      const newMap = new Map(prev);
      const currentData = newMap.get(expertId) || { 
        expertId, 
        votes: { up: 0, down: 0, userVote: null }
      };
      
      if (currentData.votes.userVote === voteType) {
        // 같은 투표 취소
        currentData.votes[voteType]--;
        currentData.votes.userVote = null;
      } else if (currentData.votes.userVote) {
        // 다른 투표로 변경
        currentData.votes[currentData.votes.userVote]--;
        currentData.votes[voteType]++;
        currentData.votes.userVote = voteType;
      } else {
        // 새로운 투표
        currentData.votes[voteType]++;
        currentData.votes.userVote = voteType;
      }
      
      newMap.set(expertId, currentData);
      return newMap;
    });
  };

  const handleFollow = (expertId: string) => {
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

  const handleToggleExpand = (expertId: string) => {
    setExpandedExpertId(expandedExpertId === expertId ? null : expertId);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterId)) {
        newSet.delete(filterId);
      } else {
        newSet.add(filterId);
      }
      return newSet;
    });
  };

  // 탭에 따른 데이터 필터링
  const getDisplayExperts = () => {
    let filtered = experts;
    
    // 필터 적용
    if (selectedFilters.size > 0) {
      filtered = filtered.filter(expert => 
        expert.authenticFilters?.some(filter => selectedFilters.has(filter))
      );
    }
    
    // 탭별 필터링
    switch(activeTab) {
      case 'hot':
        return filtered.filter(e => e.isHot || e.isTop);
      case 'following':
        return filtered.filter(e => e.isFollowing || followedExperts.has(e.id));
      case 'vote':
        // 투표수 기준 정렬
        return [...filtered].sort((a, b) => {
          const aVotes = votesData.get(a.id)?.votes || { up: 0, down: 0 };
          const bVotes = votesData.get(b.id)?.votes || { up: 0, down: 0 };
          return (bVotes.up - bVotes.down) - (aVotes.up - aVotes.down);
        });
      default:
        return filtered;
    }
  };

  // 팔로잉 중인 전문가 수
  const followingCount = experts.filter(e => e.isFollowing || followedExperts.has(e.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">지역 맛잘알 투표소 🗳️</h1>
          <p className="text-gray-700 font-medium">
            진짜 맛집 전문가를 투표로 검증하고, 특별한 타이틀을 확인하세요!
          </p>
        </div>

        {/* 찐맛집 필터 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilterModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <FunnelIcon className="w-5 h-5" />
            찐맛집 필터
            {selectedFilters.size > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {selectedFilters.size}
              </span>
            )}
          </button>
        </div>

        {/* 선택된 필터 표시 */}
        {selectedFilters.size > 0 && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-sm font-bold text-gray-700">적용된 필터:</span>
              {Array.from(selectedFilters).map(filterId => {
                const filter = AUTHENTIC_FILTERS.find(f => f.id === filterId);
                if (!filter) return null;
                return (
                  <span
                    key={filterId}
                    className={`px-3 py-1 bg-gradient-to-r ${filter.color} text-white rounded-full text-xs font-bold flex items-center gap-1`}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                    <button
                      onClick={() => toggleFilter(filterId)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <button
                onClick={() => setSelectedFilters(new Set())}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                모두 지우기
              </button>
            </div>
            
            {/* 필터에 맞는 맛집 표시 */}
            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-900 mb-3">필터에 맞는 맛집 추천</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: '삼원가든', location: '강남', cuisine: '한식', rating: 4.8 },
                  { name: '미도인', location: '명동', cuisine: '한식', rating: 4.9 },
                  { name: '성수동 갈비', location: '성수', cuisine: '한식', rating: 4.7 },
                  { name: '은행골', location: '마포', cuisine: '한식', rating: 4.6 },
                  { name: '하나면옥', location: '중구', cuisine: '면요리', rating: 4.5 },
                  { name: '본수원갈비', location: '신촌', cuisine: '한식', rating: 4.7 },
                  { name: '미진', location: '강남', cuisine: '일식', rating: 4.9 },
                  { name: '버드나무집', location: '성북', cuisine: '한식', rating: 4.8 }
                ].slice(0, 4).map((restaurant, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/restaurant/' + restaurant.name)}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-left"
                  >
                    <div className="font-bold text-sm mb-1">{restaurant.name}</div>
                    <div className="text-xs text-gray-600">{restaurant.location} · {restaurant.cuisine}</div>
                    <div className="text-xs text-orange-500 mt-1">⭐ {restaurant.rating}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 메인 탭 */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vote')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'vote'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200'
            }`}
          >
            <HandThumbUpIcon className="w-5 h-5" />
            실시간 투표
          </button>
          
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hot'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200'
            }`}
          >
            <FireIcon className="w-5 h-5" />
            인기 전문가
          </button>
          
          <button
            onClick={() => setActiveTab('following')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'following'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-purple-200'
            }`}
          >
            <HeartIcon className="w-5 h-5" />
            팔로잉
            {followingCount > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {followingCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <MapPinIcon className="w-5 h-5" />
            모든 지역
          </button>
        </div>

        {/* 전문가 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayExperts().map((expert) => {
            const voteData = votesData.get(expert.id);
            const titleData = EXPERT_TITLES[expert.expertType];
            
            return (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
              >
                {/* 최근 맛집 이미지 배너 */}
                <div className="h-32 relative overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100">
                  <div className="absolute inset-0 flex">
                    {expert.recentRestaurants.slice(0, 3).map((restaurant, idx) => (
                      <div key={restaurant.id} className="flex-1 relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                          style={{ opacity: 1 - idx * 0.2 }}
                        />
                        {idx < 2 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />}
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* 특별 타이틀 배지 */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {expert.title && (
                      <span className={`px-3 py-1 bg-gradient-to-r ${titleData.color} text-white text-xs font-bold rounded-full flex items-center gap-1`}>
                        <span>{titleData.icon}</span>
                        {expert.title}
                      </span>
                    )}
                    {expert.isTop && (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <TrophyIcon className="w-3 h-3" />
                        TOP
                      </span>
                    )}
                  </div>
                  
                  {/* 지역 */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="font-bold text-sm">{expert.area}</span>
                      <span className="text-xs opacity-90">· {expert.restaurants}개 맛집</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* 전문가 정보 */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/influencer/${expert.id}`)}
                    >
                      <img
                        src={expert.avatar}
                        alt={expert.username}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 hover:text-orange-600 transition-colors">{expert.username}</h3>
                        <p className="text-xs font-medium text-orange-600">{expert.tasteProfile}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-gray-600 ml-0.5">{expert.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">· {expert.followers} 팔로워</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 매칭률 */}
                    <div className="text-right">
                      <div className="text-xs text-gray-600 mb-1">매칭률</div>
                      <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        {expert.matchPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* 투표 섹션 */}
                  {activeTab === 'vote' && voteData && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700">신뢰도 투표</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(expert.id, 'up')}
                            className={`p-2 rounded-lg transition-all ${
                              voteData.votes.userVote === 'up'
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-green-50'
                            }`}
                          >
                            <ThumbUpSolidIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVote(expert.id, 'down')}
                            className={`p-2 rounded-lg transition-all ${
                              voteData.votes.userVote === 'down'
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-red-50'
                            }`}
                          >
                            <ThumbDownSolidIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-600 font-bold">{voteData.votes.up} 추천</span>
                            <span className="text-red-600">{voteData.votes.down} 비추</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500"
                              style={{ 
                                width: `${(voteData.votes.up / (voteData.votes.up + voteData.votes.down)) * 100}%` 
                              }}
                            />
                            <div 
                              className="bg-gradient-to-r from-red-400 to-red-500"
                              style={{ 
                                width: `${(voteData.votes.down / (voteData.votes.up + voteData.votes.down)) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 찐맛집 태그 */}
                  {expert.authenticFilters && expert.authenticFilters.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {expert.authenticFilters.slice(0, 3).map(filterId => {
                        const filter = AUTHENTIC_FILTERS.find(f => f.id === filterId);
                        if (!filter) return null;
                        return (
                          <span
                            key={filterId}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1"
                          >
                            <span>{filter.icon}</span>
                            {filter.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* 전문 분야 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.specialty.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFollow(expert.id)}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        expert.isFollowing || followedExperts.has(expert.id)
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                      }`}
                    >
                      {expert.isFollowing || followedExperts.has(expert.id) ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                          팔로잉
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-4 h-4 inline mr-1" />
                          팔로우
                        </>
                      )}
                    </button>
                    <Link
                      to={`/expert-playlist/${expert.id}`}
                      className="px-4 py-2 bg-white text-orange-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors text-sm font-bold"
                    >
                      리스트
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 찐맛집 필터 모달 */}
        <AnimatePresence>
          {showFilterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowFilterModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-black text-gray-900 mb-4">찐맛집 필터 🎯</h2>
                <p className="text-gray-600 mb-6">진짜 맛집만 찾고 싶다면? 특별한 필터를 선택해보세요!</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {AUTHENTIC_FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => toggleFilter(filter.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedFilters.has(filter.id)
                          ? `bg-gradient-to-r ${filter.color} text-white border-transparent`
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{filter.icon}</span>
                        <div className="text-left">
                          <div className="font-bold">{filter.label}</div>
                          <div className={`text-xs ${selectedFilters.has(filter.id) ? 'text-white/80' : 'text-gray-500'}`}>
                            {filter.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg"
                  >
                    필터 적용 ({selectedFilters.size}개)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilters(new Set());
                      setShowFilterModal(false);
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    초기화
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocalExpertsEnhanced;