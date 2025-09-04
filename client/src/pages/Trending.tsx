import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FireIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  SparklesIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, FireIcon as FireSolidIcon } from '@heroicons/react/24/solid';
import { getRestaurantImage } from '../utils/restaurantImages';

interface TrendingRestaurant {
  id: string;
  name: string;
  category: string;
  area: string;
  rating: number;
  image: string;
  rank: number;
  previousRank: number;
  views: number;
  likes: number;
  shares: number;
  reviews: number;
  recentReviews: number;
  tags: string[];
  trendingReason: string;
  matchPercentage?: number;
}

const Trending: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [categoryFilter, setCategoryFilter] = useState('전체');

  // 실시간 인기 맛집 데이터
  const trendingRestaurants: TrendingRestaurant[] = [
    {
      id: '1',
      name: '성수 수제버거',
      category: '양식',
      area: '성수동',
      rating: 4.8,
      image: getRestaurantImage('수제버거'),
      rank: 1,
      previousRank: 3,
      views: 15420,
      likes: 892,
      shares: 234,
      reviews: 456,
      recentReviews: 67,
      tags: ['수제버거', '트러플', '성수핫플'],
      trendingReason: '이번 주 리뷰 67개 급증',
      matchPercentage: 94
    },
    {
      id: '2',
      name: '을지로 골목 포차',
      category: '한식',
      area: '을지로',
      rating: 4.6,
      image: getRestaurantImage('포차'),
      rank: 2,
      previousRank: 8,
      views: 12890,
      likes: 743,
      shares: 189,
      reviews: 892,
      recentReviews: 89,
      tags: ['레트로', '안주맛집', '힙지로'],
      trendingReason: 'SNS 바이럴 폭발',
      matchPercentage: 88
    },
    {
      id: '3',
      name: '한남동 파스타',
      category: '양식',
      area: '한남동',
      rating: 4.7,
      image: getRestaurantImage('파스타'),
      rank: 3,
      previousRank: 2,
      views: 11234,
      likes: 678,
      shares: 145,
      reviews: 334,
      recentReviews: 45,
      tags: ['수제파스타', '와인', '데이트'],
      trendingReason: '셀럽 방문 인증',
      matchPercentage: 91
    },
    {
      id: '4',
      name: '광화문 한정식',
      category: '한식',
      area: '광화문',
      rating: 4.9,
      image: getRestaurantImage('한정식'),
      rank: 4,
      previousRank: 5,
      views: 9876,
      likes: 567,
      shares: 123,
      reviews: 223,
      recentReviews: 34,
      tags: ['한정식', '미쉐린', '비즈니스'],
      trendingReason: '미쉐린 가이드 선정',
      matchPercentage: 85
    },
    {
      id: '5',
      name: '연남동 브런치',
      category: '카페',
      area: '연남동',
      rating: 4.5,
      image: getRestaurantImage('브런치'),
      rank: 5,
      previousRank: 4,
      views: 8765,
      likes: 543,
      shares: 98,
      reviews: 445,
      recentReviews: 56,
      tags: ['브런치', '에그베네딕트', '연남동'],
      trendingReason: '주말 웨이팅 2시간',
      matchPercentage: 79
    },
    {
      id: '6',
      name: '강남 스시 오마카세',
      category: '일식',
      area: '청담동',
      rating: 4.8,
      image: getRestaurantImage('스시'),
      rank: 6,
      previousRank: 7,
      views: 7654,
      likes: 432,
      shares: 87,
      reviews: 167,
      recentReviews: 23,
      tags: ['오마카세', '스시', '프리미엄'],
      trendingReason: '예약 3주 대기',
      matchPercentage: 92
    },
    {
      id: '7',
      name: '홍대 라멘집',
      category: '일식',
      area: '홍대',
      rating: 4.6,
      image: getRestaurantImage('라멘'),
      rank: 7,
      previousRank: 12,
      views: 6789,
      likes: 398,
      shares: 76,
      reviews: 556,
      recentReviews: 78,
      tags: ['라멘', '돈코츠', '줄서는집'],
      trendingReason: '신메뉴 출시 화제',
      matchPercentage: 87
    },
    {
      id: '8',
      name: '이태원 바베큐',
      category: '양식',
      area: '이태원',
      rating: 4.7,
      image: getRestaurantImage('바베큐'),
      rank: 8,
      previousRank: 6,
      views: 5678,
      likes: 345,
      shares: 65,
      reviews: 278,
      recentReviews: 34,
      tags: ['BBQ', '스테이크', '수제맥주'],
      trendingReason: '외국인 관광객 인기',
      matchPercentage: 83
    },
    {
      id: '9',
      name: '종로 순두부찌개',
      category: '한식',
      area: '종로',
      rating: 4.5,
      image: getRestaurantImage('순두부'),
      rank: 9,
      previousRank: 15,
      views: 4567,
      likes: 289,
      shares: 54,
      reviews: 667,
      recentReviews: 89,
      tags: ['순두부', '전통', '아침식사'],
      trendingReason: '유튜버 추천 폭주',
      matchPercentage: 76
    },
    {
      id: '10',
      name: '성수 베이커리',
      category: '카페',
      area: '성수동',
      rating: 4.6,
      image: getRestaurantImage('베이커리'),
      rank: 10,
      previousRank: 9,
      views: 3456,
      likes: 234,
      shares: 43,
      reviews: 334,
      recentReviews: 45,
      tags: ['베이커리', '크로와상', '커피'],
      trendingReason: '신상 디저트 품절대란',
      matchPercentage: 81
    }
  ];

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) return { text: `▲ ${change}`, color: 'text-red-500' };
    if (change < 0) return { text: `▼ ${Math.abs(change)}`, color: 'text-blue-500' };
    return { text: '-', color: 'text-gray-400' };
  };

  const categories = ['전체', '한식', '일식', '양식', '카페', '중식', '아시안'];

  const filteredRestaurants = categoryFilter === '전체' 
    ? trendingRestaurants 
    : trendingRestaurants.filter(r => r.category === categoryFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FireIcon className="w-8 h-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold">실시간 인기 맛집</h1>
                <p className="text-sm text-gray-600">지금 가장 핫한 맛집들</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>최근 업데이트: 5분 전</span>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex gap-2 mb-3">
            {['today', 'week', 'month'].map((time) => (
              <button
                key={time}
                onClick={() => setTimeFilter(time)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeFilter === time
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {time === 'today' ? '오늘' : time === 'week' ? '이번 주' : '이번 달'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  categoryFilter === category
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <EyeIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {filteredRestaurants.reduce((sum, r) => sum + r.views, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">총 조회수</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <HeartIcon className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {filteredRestaurants.reduce((sum, r) => sum + (Array.isArray(r.likes) ? r.likes.length : (r.likes || 0)), 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">총 좋아요</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <ChatBubbleLeftIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {filteredRestaurants.reduce((sum, r) => sum + r.recentReviews, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">최근 리뷰</p>
          </div>
        </div>
      </div>

      {/* Ranking List */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant, index) => {
            const rankChange = getRankChange(restaurant.rank, restaurant.previousRank);
            
            return (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex">
                  {/* Rank */}
                  <div className="w-20 bg-gradient-to-br from-red-500 to-orange-500 flex flex-col items-center justify-center text-white">
                    <span className="text-3xl font-bold">{restaurant.rank}</span>
                    <span className={`text-sm font-medium ${rankChange.color}`}>
                      {rankChange.text}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="w-32 h-32 bg-gray-200 flex-shrink-0">
                    <img 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{restaurant.name}</h3>
                          {restaurant.rank <= 3 && (
                            <FireSolidIcon className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{restaurant.category} · {restaurant.area}</p>
                      </div>
                      {restaurant.matchPercentage && (
                        <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                          {restaurant.matchPercentage}% 매칭
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <EyeIcon className="w-4 h-4" />
                        <span>{restaurant.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <HeartIcon className="w-4 h-4" />
                        <span>{Array.isArray(restaurant.likes) ? restaurant.likes.length : restaurant.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ShareIcon className="w-4 h-4" />
                        <span>{restaurant.shares}</span>
                      </div>
                    </div>

                    {/* Trending Reason */}
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1">
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                      {restaurant.trendingReason}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 mt-2">
                      {restaurant.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col justify-center gap-2 p-4 border-l">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <BookmarkIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ShareIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Trending;