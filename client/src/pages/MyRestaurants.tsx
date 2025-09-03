import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dataManager } from '../utils/dataManager';
import type { VisitedRestaurant, UserTasteAnalysis } from '../utils/dataManager';
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
  PhotoIcon,
  XMarkIcon,
  PhoneIcon,
  GlobeAltIcon
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
  phone?: string;
  website?: string;
  hours?: string;
  priceRange?: string;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
}

const MyRestaurants: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent' | 'lists'>('all');
  const [selectedList, setSelectedList] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tasteAnalysis, setTasteAnalysis] = useState<UserTasteAnalysis | undefined>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Track visits and get taste analysis
    restaurants.forEach(restaurant => {
      if (restaurant.visits > 0) {
        dataManager.addVisitedRestaurant(
          restaurant.id,
          restaurant.category,
          restaurant.location,
          restaurant.rating
        );
      }
    });
    
    // Get taste analysis
    const analysis = dataManager.getTasteAnalysis();
    setTasteAnalysis(analysis);
  }, []);

  // 샘플 데이터 - 상세 정보 추가
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: '연남동 파스타',
      category: '이탈리안',
      location: '서울 마포구 연남동 227-8',
      rating: 4.5,
      visits: 5,
      lastVisit: '2일 전',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
      tags: ['파스타', '와인', '데이트'],
      isFavorite: true,
      list: '데이트 코스',
      phone: '02-334-5678',
      website: 'https://yeonnam-pasta.com',
      hours: '월-금 11:30-22:00, 토-일 11:00-22:30',
      priceRange: '2-3만원',
      reviews: [
        { id: '1', author: '김민수', rating: 5, text: '분위기 좋고 파스타가 정말 맛있어요! 데이트하기 딱 좋은 곳', date: '3일 전' },
        { id: '2', author: '이서연', rating: 4, text: '트러플 크림 파스타 강추! 양이 조금 적은게 아쉬워요', date: '1주일 전' },
        { id: '3', author: '박준호', rating: 5, text: '연남동 최고의 이탈리안 레스토랑. 와인 선택도 훌륭해요', date: '2주일 전' }
      ]
    },
    {
      id: '2',
      name: '홍대 수제버거',
      category: '양식',
      location: '서울 마포구 와우산로 21길 19-18',
      rating: 4.8,
      visits: 8,
      lastVisit: '1주일 전',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      tags: ['버거', '수제맥주', '브런치'],
      isFavorite: true,
      list: '브런치 맛집',
      phone: '02-323-9876',
      website: 'https://hongdae-burger.com',
      hours: '매일 11:00-23:00',
      priceRange: '1.5-2만원',
      reviews: [
        { id: '1', author: '정하늘', rating: 5, text: '패티가 육즙이 팡팡! 수제맥주랑 조합 최고', date: '2일 전' },
        { id: '2', author: '최지우', rating: 4, text: '버거는 맛있는데 웨이팅이 좀 길어요', date: '5일 전' }
      ]
    },
    {
      id: '3',
      name: '상수 브런치',
      category: '브런치',
      location: '서울 마포구 상수동 93-45',
      rating: 4.3,
      visits: 3,
      lastVisit: '2주일 전',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
      tags: ['브런치', '카페', '디저트'],
      isFavorite: false,
      list: '브런치 맛집',
      phone: '02-322-1234',
      hours: '화-일 9:00-17:00 (월요일 휴무)',
      priceRange: '1.5-2.5만원',
      reviews: [
        { id: '1', author: '김소영', rating: 4, text: '에그베네딕트가 맛있어요. 커피도 괜찮고요', date: '4일 전' },
        { id: '2', author: '이준형', rating: 5, text: '분위기 너무 좋고 브런치 퀄리티 최고!', date: '1주일 전' }
      ]
    },
    {
      id: '4',
      name: '이태원 타코',
      category: '멕시칸',
      location: '서울 용산구 이태원로 27길 35',
      rating: 4.6,
      visits: 4,
      lastVisit: '3일 전',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      tags: ['타코', '부리토', '맥주'],
      isFavorite: false,
      list: '이태원 맛집',
      phone: '02-795-4567',
      hours: '매일 12:00-24:00',
      priceRange: '1-1.5만원',
      reviews: [
        { id: '1', author: '박서준', rating: 5, text: '진짜 멕시코 맛! 타코 소스가 예술이에요', date: '1일 전' },
        { id: '2', author: '윤아름', rating: 4, text: '맛있긴 한데 양이 좀 적어요. 부리토는 추천!', date: '3일 전' }
      ]
    },
    {
      id: '5',
      name: '성수동 카페',
      category: '카페',
      location: '서울 성동구 성수동2가 273-12',
      rating: 4.2,
      visits: 6,
      lastVisit: '어제',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4bf5e1?w=400',
      tags: ['카페', '디저트', '브런치'],
      isFavorite: true,
      list: '카페 투어',
      phone: '02-465-7890',
      website: 'https://seongsu-cafe.kr',
      hours: '매일 8:00-22:00',
      priceRange: '6천-1.5만원',
      reviews: [
        { id: '1', author: '강민지', rating: 4, text: '커피 맛있고 인테리어 예뻐요. 사진 찍기 좋아요', date: '오늘' },
        { id: '2', author: '조현우', rating: 4, text: '디저트 종류가 많아서 좋아요. 티라미수 추천!', date: '2일 전' }
      ]
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

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

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
          {tasteAnalysis && tasteAnalysis.tastePattern && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
              <TagIcon className="w-4 h-4" />
              <span className="font-medium">
                당신은 {tasteAnalysis.tastePattern === 'adventurous' ? '탐험적인 미식가' :
                       tasteAnalysis.tastePattern === 'traditional' ? '전통적인 맛 추구자' :
                       tasteAnalysis.tastePattern === 'gourmet' ? '고급 미식가' :
                       tasteAnalysis.tastePattern === 'casual' ? '캐주얼 다이너' :
                       '균형 잡힌 식도락검'}입니다!
              </span>
            </div>
          )}
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
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant)}
                >
                  <div className="relative h-32">
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
                    <div className="absolute top-3 left-3">
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

      {/* 레스토랑 상세 모달 - 더 디테일하게 */}
      {showDetailModal && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* 모달 헤더 - 작은 이미지와 기본 정보 */}
            <div className="flex items-start p-6 border-b border-gray-200">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-24 h-24 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedRestaurant.name}
                    </h2>
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium mb-2">
                      {selectedRestaurant.category}
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold">{selectedRestaurant.rating}</span>
                      </div>
                      {selectedRestaurant.priceRange && (
                        <span className="text-gray-600">· {selectedRestaurant.priceRange}</span>
                      )}
                      <span className="text-gray-600">· 방문 {selectedRestaurant.visits}회</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* 모달 컨텐츠 */}
            <div className="p-6">
              {/* 위치 정보 섹션 - 더 자세하게 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  위치 정보
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[60px]">주소:</span>
                    <span className="text-gray-700 font-medium">{selectedRestaurant.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[60px]">지하철:</span>
                    <span className="text-gray-700">홍대입구역 3번 출구 도보 5분</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[60px]">주차:</span>
                    <span className="text-gray-700">건물 내 주차장 2시간 무료</span>
                  </div>
                </div>
                <button className="mt-3 text-sm text-blue-600 hover:underline">
                  지도에서 보기 →
                </button>
              </div>

              {/* 상세 정보 그리드 */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div className="text-sm">
                    <span className="text-gray-500 block">전화번호</span>
                    <span className="text-gray-900 font-medium">{selectedRestaurant.phone || '정보 없음'}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div className="text-sm">
                    <span className="text-gray-500 block">영업시간</span>
                    <span className="text-gray-900 font-medium">{selectedRestaurant.hours || '정보 없음'}</span>
                  </div>
                </div>
                
                {selectedRestaurant.website && (
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <span className="text-gray-500 block">웹사이트</span>
                      <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        방문하기
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRestaurant.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 상세 평점 섹션 */}
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">상세 평점</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">맛</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">4.8</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">서비스</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">4.2</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">분위기</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">4.5</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">가성비</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">4.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">청결도</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">4.7</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">접근성</span>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon key={i} className={`w-3 h-3 ${i < 3 ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-semibold ml-1">3.5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 리뷰 섹션 - 더 많은 리뷰 추가 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">리뷰 (127)</h3>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>최신순</option>
                    <option>평점 높은순</option>
                    <option>평점 낮은순</option>
                    <option>도움이 된 순</option>
                  </select>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      author: '맛집탐험가',
                      rating: 5,
                      date: '2024-01-15',
                      text: '진짜 맛있어요! 특히 시그니처 메뉴는 꼭 드셔보세요. 양도 많고 가격도 합리적이에요.',
                      helpful: 23,
                      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop']
                    },
                    {
                      id: 2,
                      author: '홍대러버',
                      rating: 4,
                      date: '2024-01-10',
                      text: '분위기가 정말 좋아요. 데이트하기 좋은 곳입니다. 음식도 맛있지만 조금 짠 편이에요.',
                      helpful: 15,
                      images: []
                    },
                    {
                      id: 3,
                      author: '미식가A',
                      rating: 5,
                      date: '2024-01-05',
                      text: '홍대에서 이런 맛집을 발견하다니! 재료가 신선하고 조리법도 훌륭해요. 재방문 의사 100%',
                      helpful: 31,
                      images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop']
                    },
                    {
                      id: 4,
                      author: '단골손님',
                      rating: 4,
                      date: '2023-12-28',
                      text: '주말에는 웨이팅이 좀 있는 편이에요. 그래도 기다릴 만한 가치가 있습니다.',
                      helpful: 8,
                      images: []
                    }
                  ].map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {review.author[0]}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{review.author}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <StarSolidIcon
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{review.text}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        👍 도움이 됐어요 ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  리뷰 더보기
                </button>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  리뷰 작성
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  리스트에 추가
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyRestaurants;