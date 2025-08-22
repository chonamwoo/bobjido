import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BuildingStorefrontIcon,
  PlusIcon,
  MapPinIcon,
  StarIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  visits: number;
  lastVisit: string;
  image: string;
  tags: string[];
  isFavorite: boolean;
  list: string;
}

const MyRestaurants: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent' | 'lists'>('all');
  const [selectedList, setSelectedList] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 샘플 데이터
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: '연남동 파스타',
      category: '이탈리안',
      location: '연남동',
      rating: 4.5,
      visits: 5,
      lastVisit: '2일 전',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
      tags: ['파스타', '와인', '데이트'],
      isFavorite: true,
      list: '데이트 코스'
    },
    {
      id: '2',
      name: '홍대 수제버거',
      category: '양식',
      location: '홍대',
      rating: 4.8,
      visits: 8,
      lastVisit: '1주일 전',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      tags: ['버거', '수제맥주', '브런치'],
      isFavorite: true,
      list: '브런치 맛집'
    },
    {
      id: '3',
      name: '상수 브런치',
      category: '브런치',
      location: '상수동',
      rating: 4.3,
      visits: 3,
      lastVisit: '2주일 전',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
      tags: ['브런치', '카페', '디저트'],
      isFavorite: false,
      list: '브런치 맛집'
    },
    {
      id: '4',
      name: '이태원 타코',
      category: '멕시칸',
      location: '이태원',
      rating: 4.6,
      visits: 4,
      lastVisit: '3일 전',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      tags: ['타코', '부리토', '맥주'],
      isFavorite: false,
      list: '이태원 맛집'
    },
    {
      id: '5',
      name: '성수동 카페',
      category: '카페',
      location: '성수동',
      rating: 4.2,
      visits: 6,
      lastVisit: '어제',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4bf5e1?w=400',
      tags: ['카페', '디저트', '브런치'],
      isFavorite: true,
      list: '카페 투어'
    }
  ];

  const myLists = [
    { name: '전체', count: 42, color: 'bg-gray-100 text-gray-700' },
    { name: '데이트 코스', count: 8, color: 'bg-pink-100 text-pink-700' },
    { name: '브런치 맛집', count: 12, color: 'bg-yellow-100 text-yellow-700' },
    { name: '이태원 맛집', count: 7, color: 'bg-blue-100 text-blue-700' },
    { name: '카페 투어', count: 15, color: 'bg-green-100 text-green-700' }
  ];

  const stats = [
    { label: '총 맛집', value: '42', icon: BuildingStorefrontIcon, color: 'text-purple-600' },
    { label: '즐겨찾기', value: '18', icon: HeartIcon, color: 'text-pink-600' },
    { label: '방문 횟수', value: '156', icon: ClockIcon, color: 'text-blue-600' },
    { label: '리스트', value: '5', icon: FolderIcon, color: 'text-green-600' }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (activeTab === 'favorites' && !restaurant.isFavorite) return false;
    if (selectedList !== 'all' && restaurant.list !== selectedList) return false;
    if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
              <BuildingStorefrontIcon className="w-7 h-7 text-white" />
            </div>
            내 맛집
          </h1>
          <p className="text-gray-600 mt-2">
            내가 저장한 맛집들을 한눈에 관리하고 공유하세요
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            전체 맛집
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'favorites'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HeartIcon className="w-4 h-4 inline mr-1" />
            즐겨찾기
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'recent'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ClockIcon className="w-4 h-4 inline mr-1" />
            최근 방문
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'lists'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FolderIcon className="w-4 h-4 inline mr-1" />
            리스트별
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 사이드바 - 리스트 필터 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">내 리스트</h3>
                <button className="text-purple-600 hover:text-purple-700">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {myLists.map((list, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedList(list.name === '전체' ? 'all' : list.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      (selectedList === 'all' && list.name === '전체') || selectedList === list.name
                        ? 'bg-orange-50 text-orange-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{list.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${list.color}`}>
                      {list.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  새 리스트 만들기
                </button>
              </div>
            </div>
          </div>

          {/* 메인 컨텐츠 - 맛집 그리드 */}
          <div className="lg:col-span-3">
            {/* 검색 바 */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="맛집 이름으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 맛집 카드 그리드 */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors">
                      {restaurant.isFavorite ? (
                        <HeartSolidIcon className="w-5 h-5 text-pink-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
                        {restaurant.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{restaurant.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        방문 {restaurant.visits}회
                      </div>
                      <div className="text-sm text-gray-500">
                        {restaurant.lastVisit}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {restaurant.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        <FolderIcon className="w-4 h-4 inline mr-1" />
                        {restaurant.list}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 빈 상태 */}
            {filteredRestaurants.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BuildingStorefrontIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  저장된 맛집이 없어요
                </h3>
                <p className="text-gray-600 mb-6">
                  맛집을 발견하고 저장해보세요!
                </p>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  맛집 찾아보기
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 플로팅 액션 버튼 */}
        <button className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40">
          <PlusIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MyRestaurants;