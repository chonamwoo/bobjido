import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

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
}

const LocalExperts: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [activeTab, setActiveTab] = useState<'hot' | 'following' | 'all'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedExperts, setFollowedExperts] = useState<Set<string>>(new Set(['2']));
  const [expandedExpertId, setExpandedExpertId] = useState<string | null>(null);

  // 샘플 데이터
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
        { id: 'r1', name: '루프탑 브런치', cuisine: '브런치', rating: 4.7, image: getRestaurantImage('루프탑 브런치') },
        { id: 'r2', name: '이태원 버거', cuisine: '양식', rating: 4.8, image: getRestaurantImage('이태원 버거') },
        { id: 'r3', name: '한남동 와인바', cuisine: '와인바', rating: 4.6, image: getRestaurantImage('한남동 와인바') }
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
      isHot: true
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
        { id: 'r4', name: '성수 카페', cuisine: '카페', rating: 4.5, image: getRestaurantImage('성수 카페') },
        { id: 'r5', name: '서울숲 베이커리', cuisine: '베이커리', rating: 4.7, image: getRestaurantImage('서울숲 베이커리') },
        { id: 'r6', name: '비건 레스토랑', cuisine: '비건', rating: 4.4, image: getRestaurantImage('비건 레스토랑') }
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
      isHot: true
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
        { id: 'r7', name: '스시 오마카세', cuisine: '일식', rating: 4.9, image: getRestaurantImage('스시 오마카세') },
        { id: 'r8', name: '강남 스테이크', cuisine: '양식', rating: 4.8, image: getRestaurantImage('강남 스테이크') },
        { id: 'r9', name: '코스 요리', cuisine: '프렌치', rating: 4.7, image: getRestaurantImage('코스 요리') }
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
      isTop: true
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
        { id: 'r10', name: '홍대 이자카야', cuisine: '일식', rating: 4.5, image: getRestaurantImage('홍대 이자카야') },
        { id: 'r11', name: '라멘 맛집', cuisine: '일식', rating: 4.6, image: getRestaurantImage('라멘 맛집') },
        { id: 'r12', name: '루프탑 바', cuisine: '바', rating: 4.4, image: getRestaurantImage('루프탑 바') }
      ],
      badges: ['🍺'],
      tasteProfile: '캐주얼 미식가',
      tasteStats: {
        spicy: 70,
        sweet: 35,
        adventure: 75,
        healthy: 40
      },
      bio: '홍대 술집 탐험가'
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

  // 탭에 따른 데이터 필터링
  const getDisplayExperts = () => {
    switch(activeTab) {
      case 'hot':
        return experts.filter(e => e.isHot || e.isTop);
      case 'following':
        return experts.filter(e => e.isFollowing || followedExperts.has(e.id));
      default:
        return experts;
    }
  };

  // 팔로잉 중인 전문가 수
  const followingCount = experts.filter(e => e.isFollowing || followedExperts.has(e.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">지역 맛잘알</h1>
          <p className="text-gray-700 font-medium">
            각 지역의 맛집 전문가들을 팔로우하고 그들의 맛집 리스트를 확인해보세요 🗺️
          </p>
        </div>

        {/* 내가 팔로잉 중인 전문가 요약 (있을 경우) */}
        {followingCount > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <HeartSolidIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">팔로잉 중인 전문가</h3>
                  <p className="text-sm text-gray-600">{followingCount}명의 전문가를 팔로우 중</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('following')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                모두 보기
              </button>
            </div>
          </div>
        )}

        {/* 메인 탭 */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
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
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
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
            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <MapPinIcon className="w-5 h-5" />
            모든 지역
          </button>
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {areas.map(area => (
            <button
              key={area.value}
              onClick={() => setSelectedArea(area.value)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedArea === area.value
                  ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-bold border-2 border-orange-300'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>

        {/* 전문가 리스트 - 가로형 카드 */}
        <div className="space-y-4">
          {getDisplayExperts().map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
            >
              <div className="flex">
                {/* 왼쪽: 순위 & 프로필 */}
                <div className="w-80 p-6 border-r-2 border-gray-100">
                  {/* 순위 배지 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* 순위 표시 */}
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                        #{index + 1}
                      </div>
                      <img
                        src={expert.avatar}
                        alt={expert.username}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-200"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{expert.username}</h3>
                        <p className="text-sm font-medium text-orange-600">{expert.tasteProfile}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center">
                            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{expert.followers} 팔로워</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 배지 */}
                    <div className="flex flex-col gap-1">
                      {expert.isTop && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <TrophyIcon className="w-3 h-3" />
                          TOP
                        </span>
                      )}
                      {expert.isHot && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <FireIcon className="w-3 h-3" />
                          HOT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 지역 & 전문 분야 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-700">{expert.area}</span>
                      <span className="text-sm text-gray-500">· {expert.restaurants}개 맛집 등록</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {expert.specialty.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 소개 */}
                  {expert.bio && (
                    <p className="text-sm text-gray-600 mb-4">
                      {expert.bio}
                    </p>
                  )}

                  {/* 매칭률 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 font-medium">나와의 취향 매칭률</span>
                      <span className="text-xs font-bold text-orange-600">{expert.matchPercentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                        style={{ width: `${expert.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFollow(expert.id)}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
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
                      to={`/profile/${expert.username}`}
                      className="px-4 py-2.5 bg-white text-orange-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors text-sm font-bold"
                    >
                      프로필
                    </Link>
                  </div>
                </div>

                {/* 오른쪽: 추천 맛집 순위 */}
                <div className="flex-1 p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-orange-500" />
                    {expert.username}님의 TOP 5 맛집
                  </h4>
                  
                  {/* 맛집 순위 리스트 */}
                  <div className="space-y-3">
                    {expert.recentRestaurants.map((restaurant, rIndex) => (
                      <div key={restaurant.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-all cursor-pointer">
                        {/* 순위 배지 */}
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            rIndex === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                            rIndex === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                            rIndex === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {rIndex + 1}
                          </div>
                        </div>
                        
                        {/* 맛집 이미지 */}
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        
                        {/* 맛집 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-gray-900">{restaurant.name}</h5>
                            <div className="flex items-center gap-1">
                              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                              <span className="font-semibold text-gray-700">{restaurant.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="px-2 py-0.5 bg-white rounded-full">{restaurant.cuisine}</span>
                            {rIndex === 0 && (
                              <span className="text-xs font-bold text-orange-600">
                                🔥 가장 추천!
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* 바로가기 버튼 */}
                        <Link
                          to={`/restaurant/${restaurant.id}`}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all"
                        >
                          상세보기
                        </Link>
                      </div>
                    ))}
                    
                    {/* 더 보기 버튼 */}
                    <Link
                      to={`/profile/${expert.username}`}
                      className="block w-full text-center py-3 bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 rounded-lg font-bold hover:from-orange-100 hover:to-yellow-100 transition-all"
                    >
                      {expert.restaurants}개 맛집 모두 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {getDisplayExperts().length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <MapPinIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'following' ? '팔로잉 중인 전문가가 없어요' : '전문가가 없어요'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'following' 
                ? '맛집 전문가를 팔로우하고 그들의 맛집을 확인해보세요!'
                : '다른 지역을 선택해보세요'}
            </p>
            {activeTab === 'following' && (
              <button
                onClick={() => setActiveTab('hot')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                인기 전문가 보기
              </button>
            )}
          </div>
        )}

        {/* 추천 섹션 */}
        {activeTab === 'all' && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-purple-500" />
              이번 주 떠오르는 전문가
            </h2>
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {experts
                  .filter(e => e.isHot)
                  .slice(0, 3)
                  .map((expert) => (
                    <div key={expert.id} className="bg-white rounded-xl p-4 border-2 border-purple-100">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={expert.avatar}
                          alt={expert.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{expert.username}</h4>
                          <p className="text-xs text-gray-600">{expert.area} · {expert.restaurants}개 맛집</p>
                        </div>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          <span className="font-bold text-purple-600">{expert.followers}</span> 팔로워
                        </span>
                        <button
                          onClick={() => handleFollow(expert.id)}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700"
                        >
                          + 팔로우
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalExperts;