import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { getUserAvatar } from '../utils/userAvatars';
import { getRestaurantImage } from '../utils/restaurantImages';
import { useAuthStore } from '../store/authStore';
import {
  MapPinIcon,
  SparklesIcon,
  UserPlusIcon,
  UserMinusIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  location?: string;
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
  totalReviews: number;
  isFollowing: boolean;
  topRestaurants: Restaurant[];
  category: string;
  badge?: string;
  tagline?: string;
}

const LocalExpertsRanking: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('adventurer');
  const [followedExperts, setFollowedExperts] = useState<Set<string>>(new Set());
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // 카테고리별 전문가 데이터
  const expertsByCategory: { [key: string]: LocalExpert[] } = {
    adventurer: [
      {
        id: '1',
        username: 'foodie_seoul87',
        avatar: getUserAvatar('foodie_seoul87'),
        area: '이태원',
        specialty: ['세계음식', '브런치', '카페'],
        restaurants: 187,
        followers: 12834,
        rating: 4.8,
        totalReviews: 1243,
        isFollowing: false,
        category: 'adventurer',
        badge: '🌍',
        tagline: '이태원 3년차, 세계음식 덕후',
        topRestaurants: [
          { id: 'r1', name: '바토스', cuisine: '멕시칸', rating: 4.7, image: getRestaurantImage('바토스'), location: '이태원' },
          { id: 'r2', name: '리틀넥', cuisine: '브런치', rating: 4.8, image: getRestaurantImage('리틀넥'), location: '한남동' },
          { id: 'r3', name: '케이블카 BBQ', cuisine: '미국식', rating: 4.6, image: getRestaurantImage('케이블카 BBQ'), location: '이태원' }
        ]
      },
      {
        id: '2',
        username: '연남동_맛집탐방',
        avatar: getUserAvatar('연남동_맛집탐방'),
        area: '연남동',
        specialty: ['카페', '베이커리', '브런치'],
        restaurants: 234,
        followers: 8956,
        rating: 4.7,
        totalReviews: 892,
        isFollowing: false,
        category: 'adventurer',
        badge: '☕',
        tagline: '연남동 거주 5년차 현지인',
        topRestaurants: [
          { id: 'r4', name: '컴포트키친', cuisine: '브런치', rating: 4.6, image: getRestaurantImage('컴포트키친'), location: '연남동' },
          { id: 'r5', name: '버터밀크', cuisine: '베이커리', rating: 4.8, image: getRestaurantImage('버터밀크'), location: '연남동' },
          { id: 'r6', name: '소이연남', cuisine: '태국', rating: 4.5, image: getRestaurantImage('소이연남'), location: '연남동' }
        ]
      },
      {
        id: '3',
        username: '을지로_직장인',
        avatar: getUserAvatar('을지로_직장인'),
        area: '을지로',
        specialty: ['노포', '점심맛집', '소주한잔'],
        restaurants: 156,
        followers: 5432,
        rating: 4.6,
        totalReviews: 456,
        isFollowing: true,
        category: 'adventurer',
        badge: '🍺',
        tagline: '을지로 5년차 직장인의 진짜 맛집',
        topRestaurants: [
          { id: 'r7', name: '을지면옥', cuisine: '냉면', rating: 4.8, image: getRestaurantImage('을지면옥'), location: '을지로' },
          { id: 'r8', name: '청진옥', cuisine: '해장국', rating: 4.7, image: getRestaurantImage('청진옥'), location: '종로' },
          { id: 'r9', name: '우래옥', cuisine: '평양냉면', rating: 4.6, image: getRestaurantImage('우래옥'), location: '을지로' }
        ]
      }
    ],
    michelin: [
      {
        id: '4',
        username: 'fine_dining_kr',
        avatar: getUserAvatar('fine_dining_kr'),
        area: '강남',
        specialty: ['파인다이닝', '오마카세', '와인바'],
        restaurants: 89,
        followers: 23456,
        rating: 4.9,
        totalReviews: 234,
        isFollowing: false,
        category: 'michelin',
        badge: '⭐',
        tagline: '미슐랭 레스토랑 전문 리뷰어',
        topRestaurants: [
          { id: 'r10', name: '밍글스', cuisine: '모던한식', rating: 5.0, image: getRestaurantImage('밍글스'), location: '청담동' },
          { id: 'r11', name: '임프레션', cuisine: '프렌치', rating: 4.9, image: getRestaurantImage('임프레션'), location: '강남' },
          { id: 'r12', name: '에빗룸', cuisine: '모던유럽', rating: 4.9, image: getRestaurantImage('에빗룸'), location: '강남' }
        ]
      },
      {
        id: '5',
        username: '스시_오마카세',
        avatar: getUserAvatar('스시_오마카세'),
        area: '압구정',
        specialty: ['스시', '오마카세', '일식'],
        restaurants: 67,
        followers: 15678,
        rating: 4.85,
        totalReviews: 178,
        isFollowing: false,
        category: 'michelin',
        badge: '🍣',
        tagline: '오마카세 월 10회 이상 방문',
        topRestaurants: [
          { id: 'r13', name: '스시선수', cuisine: '오마카세', rating: 4.9, image: getRestaurantImage('스시선수'), location: '압구정' },
          { id: 'r14', name: '무오키', cuisine: '일식', rating: 4.8, image: getRestaurantImage('무오키'), location: '청담' },
          { id: 'r15', name: '알라프리마', cuisine: '이탈리안', rating: 4.7, image: getRestaurantImage('알라프리마'), location: '청담' }
        ]
      }
    ],
    coffee: [
      {
        id: '6',
        username: '바리스타J',
        avatar: getUserAvatar('바리스타J'),
        area: '성수',
        specialty: ['스페셜티', '로스터리', '핸드드립'],
        restaurants: 145,
        followers: 4567,
        rating: 4.8,
        totalReviews: 678,
        isFollowing: false,
        category: 'coffee',
        badge: '☕',
        tagline: '커피 소믈리에',
        topRestaurants: [
          { id: 'r16', name: '블루보틀', cuisine: '카페', rating: 4.7, image: getRestaurantImage('블루보틀'), location: '성수' },
          { id: 'r17', name: '센터커피', cuisine: '카페', rating: 4.8, image: getRestaurantImage('센터커피'), location: '성수' },
          { id: 'r18', name: '멜버른', cuisine: '카페', rating: 4.6, image: getRestaurantImage('멜버른'), location: '성수' }
        ]
      },
      {
        id: '7',
        username: '카페러버',
        avatar: getUserAvatar('카페러버'),
        area: '연남',
        specialty: ['브런치카페', '베이커리', '디저트'],
        restaurants: 112,
        followers: 3214,
        rating: 4.6,
        totalReviews: 456,
        isFollowing: true,
        category: 'coffee',
        badge: '🥐',
        tagline: '브런치 & 디저트 전문',
        topRestaurants: [
          { id: 'r19', name: '런던베이글', cuisine: '베이커리', rating: 4.8, image: getRestaurantImage('런던베이글'), location: '연남' },
          { id: 'r20', name: '레이어드', cuisine: '브런치', rating: 4.7, image: getRestaurantImage('레이어드'), location: '연남' },
          { id: 'r21', name: '오우드', cuisine: '카페', rating: 4.5, image: getRestaurantImage('오우드'), location: '연남' }
        ]
      }
    ],
    street: [
      {
        id: '8',
        username: '길거리파이터',
        avatar: getUserAvatar('길거리파이터'),
        area: '명동',
        specialty: ['포장마차', '시장', '길거리음식'],
        restaurants: 267,
        followers: 2345,
        rating: 4.5,
        totalReviews: 789,
        isFollowing: false,
        category: 'street',
        badge: '🏪',
        tagline: '시장 & 포장마차 마스터',
        topRestaurants: [
          { id: 'r22', name: '명동교자', cuisine: '만두', rating: 4.6, image: getRestaurantImage('명동교자'), location: '명동' },
          { id: 'r23', name: '남대문시장', cuisine: '시장', rating: 4.4, image: getRestaurantImage('남대문시장'), location: '남대문' },
          { id: 'r24', name: '광장시장', cuisine: '시장', rating: 4.7, image: getRestaurantImage('광장시장'), location: '종로' }
        ]
      }
    ],
    trending: [
      {
        id: '9',
        username: '트렌드세터',
        avatar: getUserAvatar('트렌드세터'),
        area: '강남',
        specialty: ['SNS맛집', '핫플', '신상'],
        restaurants: 198,
        followers: 8921,
        rating: 4.7,
        totalReviews: 1234,
        isFollowing: false,
        category: 'trending',
        badge: '🔥',
        tagline: 'SNS 핫플레이스 헌터',
        topRestaurants: [
          { id: 'r25', name: '누들샵', cuisine: '아시안', rating: 4.8, image: getRestaurantImage('누들샵'), location: '강남' },
          { id: 'r26', name: '디저트39', cuisine: '디저트', rating: 4.7, image: getRestaurantImage('디저트39'), location: '강남' },
          { id: 'r27', name: '브레드05', cuisine: '베이커리', rating: 4.6, image: getRestaurantImage('브레드05'), location: '강남' }
        ]
      }
    ]
  };

  const categories = [
    { id: 'adventurer', label: '미식 모험가', icon: RocketLaunchIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'michelin', label: '미슐랭 추적자', icon: StarIcon, color: 'from-yellow-500 to-orange-500' },
    { id: 'coffee', label: '드립 마스터', icon: BeakerIcon, color: 'from-brown-500 to-amber-500' },
    { id: 'street', label: '해장 사냥꾼', icon: FireIcon, color: 'from-red-500 to-orange-500' },
    { id: 'trending', label: '인기 전문가', icon: TrophyIcon, color: 'from-blue-500 to-cyan-500' }
  ];

  // 팔로우/언팔로우 mutation
  const followMutation = useMutation({
    mutationFn: async ({ expertId, isFollowing }: { expertId: string; isFollowing: boolean }) => {
      if (isFollowing) {
        return await axios.delete(`/api/follow/${expertId}/unfollow`);
      } else {
        return await axios.post(`/api/follow/${expertId}/follow`);
      }
    },
    onSuccess: (data, variables) => {
      const action = variables.isFollowing ? '언팔로우' : '팔로우';
      toast.success(`${action}했습니다!`);
      
      // 로컬 상태 업데이트
      setFollowedExperts(prev => {
        const newSet = new Set(prev);
        if (variables.isFollowing) {
          newSet.delete(variables.expertId);
        } else {
          newSet.add(variables.expertId);
        }
        return newSet;
      });
      
      // 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('로그인이 필요합니다');
      } else {
        toast.error('오류가 발생했습니다');
      }
    }
  });

  const handleFollow = (expertId: string, isCurrentlyFollowing: boolean) => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }
    followMutation.mutate({ expertId, isFollowing: isCurrentlyFollowing });
  };

  const currentExperts = expertsByCategory[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">맛잘알 랭킹</h1>
          <p className="text-gray-700 font-medium">
            카테고리별 최고의 맛집 전문가들을 만나보세요 🏆
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* 전문가 랭킹 리스트 */}
        <div className="space-y-4">
          {currentExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="flex items-center p-4">
                {/* 순위 */}
                <div className="w-16 flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md' :
                    index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-md' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* 프로필 */}
                <div className="w-72 flex items-center gap-4 pr-6 border-r-2 border-gray-100">
                  <img
                    src={expert.avatar}
                    alt={expert.username}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{expert.username}</h3>
                      <span className="text-xl">{expert.badge}</span>
                    </div>
                    <p className="text-sm text-orange-600 font-medium mb-1">{expert.tagline}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {expert.area}
                      </span>
                      <span className="flex items-center gap-1">
                        <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                        {expert.rating}
                      </span>
                      <span>{expert.followers.toLocaleString()} 팔로워</span>
                      <span>{expert.restaurants}개 맛집</span>
                    </div>
                  </div>
                </div>

                {/* TOP 3 맛집 */}
                <div className="flex-1 px-6">
                  <div className="flex items-center gap-4">
                    {expert.topRestaurants.slice(0, 3).map((restaurant, rIndex) => (
                      <Link
                        key={restaurant.id}
                        to={`/restaurant/${restaurant.id}`}
                        className="flex items-center gap-3 flex-1 p-2 rounded-lg hover:bg-orange-50 transition-all"
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          rIndex === 0 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {rIndex + 1}
                        </div>
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 truncate">{restaurant.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{restaurant.cuisine}</span>
                            <span className="flex items-center gap-0.5">
                              <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 pl-4">
                  <button
                    onClick={() => handleFollow(expert.id, expert.isFollowing || followedExperts.has(expert.id))}
                    disabled={followMutation.isPending}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                      expert.isFollowing || followedExperts.has(expert.id)
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {expert.isFollowing || followedExperts.has(expert.id) ? (
                      <>
                        <UserMinusIcon className="w-4 h-4 inline mr-1" />
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
                    to={`/expert/${expert.username}`}
                    className="px-4 py-2 bg-white text-orange-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-colors text-sm font-bold"
                  >
                    프로필
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {currentExperts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <TrophyIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              이 카테고리에 전문가가 없어요
            </h3>
            <p className="text-gray-600">
              다른 카테고리를 선택해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalExpertsRanking;