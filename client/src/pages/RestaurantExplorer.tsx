import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  FunnelIcon,
  MapIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import KoreanMap from '../components/KoreanMap';
import { Restaurant } from '../types';

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  category: string;
  subCategory?: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  district: string;
  nearbyLandmarks?: string[];
  businessHours?: {
    weekday: string;
    weekend: string;
  };
  isOpen?: boolean;
  popularMenu?: string[];
  distance?: number; // 현재 위치에서의 거리
}

const RestaurantExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedTab, setSelectedTab] = useState<'neighborhood' | 'workplace' | 'filter'>('neighborhood');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('강남');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // 서울 주요 지역 데이터
  const districts = [
    { id: 'gangnam', name: '강남', count: 523, popular: ['테헤란로', '강남역', '선릉'] },
    { id: 'hongdae', name: '홍대', count: 412, popular: ['홍대입구', '상수', '합정'] },
    { id: 'jongno', name: '종로', count: 389, popular: ['광화문', '인사동', '익선동'] },
    { id: 'myeongdong', name: '명동', count: 298, popular: ['명동역', '을지로', '충무로'] },
    { id: 'itaewon', name: '이태원', count: 276, popular: ['이태원역', '한남동', '경리단길'] },
    { id: 'seongsu', name: '성수', count: 234, popular: ['성수역', '뚝섬', '서울숲'] },
    { id: 'yeouido', name: '여의도', count: 189, popular: ['여의도역', 'IFC몰', '한강공원'] },
    { id: 'gangbuk', name: '강북', count: 167, popular: ['수유', '미아', '성북'] },
    { id: 'mapo', name: '마포', count: 345, popular: ['마포역', '공덕', '망원'] },
    { id: 'jamsil', name: '잠실', count: 298, popular: ['잠실역', '롯데월드', '석촌호수'] }
  ];

  // 직장/학교 주변 카테고리
  const workplaceCategories = [
    { id: 'office', name: '오피스 밀집지역', icon: BuildingOfficeIcon, count: 1234 },
    { id: 'university', name: '대학가', icon: AcademicCapIcon, count: 987 },
    { id: 'hospital', name: '병원 주변', icon: '🏥', count: 456 },
    { id: 'station', name: '역세권', icon: '🚇', count: 2345 }
  ];

  // 필터 옵션들
  const filterOptions = [
    { id: 'delivery-none', label: '배달 안되는 맛집', icon: '🚫', count: 234 },
    { id: 'local-favorite', label: '현지인 단골', icon: '🏘️', count: 456 },
    { id: 'hidden-gem', label: '숨은 맛집', icon: '💎', count: 178 },
    { id: 'michelin', label: '미슐랭', icon: '⭐', count: 23 },
    { id: 'waiting', label: '웨이팅 맛집', icon: '⏰', count: 89 },
    { id: 'late-night', label: '심야 영업', icon: '🌙', count: 156 },
    { id: 'solo-dining', label: '혼밥 맛집', icon: '1️⃣', count: 234 },
    { id: 'group-dining', label: '단체 가능', icon: '👥', count: 345 },
    { id: 'pet-friendly', label: '애견 동반', icon: '🐕', count: 67 },
    { id: 'vegan', label: '비건 옵션', icon: '🌱', count: 45 },
    { id: 'halal', label: '할랄', icon: '☪️', count: 34 },
    { id: 'parking', label: '주차 가능', icon: '🚗', count: 567 }
  ];

  // 샘플 레스토랑 데이터
  const allRestaurants: RestaurantData[] = [
    // 강남 지역
    {
      id: 'r1',
      name: '성수족발',
      address: '서울 강남구 테헤란로 123',
      coordinates: { lat: 37.5010, lng: 127.0396 },
      category: '한식',
      subCategory: '족발/보쌈',
      priceRange: '₩₩',
      rating: 4.8,
      reviewCount: 523,
      image: 'https://picsum.photos/400/300?random=1',
      tags: ['delivery-none', 'local-favorite', 'late-night'],
      district: '강남',
      nearbyLandmarks: ['강남역 3번출구 도보 5분'],
      businessHours: { weekday: '11:00-24:00', weekend: '11:00-02:00' },
      isOpen: true,
      popularMenu: ['족발', '보쌈', '막국수']
    },
    {
      id: 'r2',
      name: '미슐랭 스시',
      address: '서울 강남구 청담동 456',
      coordinates: { lat: 37.5193, lng: 127.0471 },
      category: '일식',
      subCategory: '스시/오마카세',
      priceRange: '₩₩₩₩',
      rating: 4.9,
      reviewCount: 234,
      image: 'https://picsum.photos/400/300?random=2',
      tags: ['michelin', 'waiting', 'delivery-none'],
      district: '강남',
      nearbyLandmarks: ['청담역 1번출구 도보 3분'],
      businessHours: { weekday: '12:00-15:00, 18:00-22:00', weekend: '12:00-22:00' },
      isOpen: true,
      popularMenu: ['오마카세 코스', '치라시동', '우니']
    },
    // 홍대 지역
    {
      id: 'r3',
      name: '홍대 떡볶이',
      address: '서울 마포구 홍대입구역 789',
      coordinates: { lat: 37.5563, lng: 126.9236 },
      category: '분식',
      subCategory: '떡볶이',
      priceRange: '₩',
      rating: 4.5,
      reviewCount: 1234,
      image: 'https://picsum.photos/400/300?random=3',
      tags: ['local-favorite', 'solo-dining', 'late-night'],
      district: '홍대',
      nearbyLandmarks: ['홍대입구역 9번출구 도보 2분'],
      businessHours: { weekday: '10:00-02:00', weekend: '10:00-04:00' },
      isOpen: true,
      popularMenu: ['로제떡볶이', '김말이', '순대']
    },
    {
      id: 'r4',
      name: '연남동 브런치',
      address: '서울 마포구 연남동 234',
      coordinates: { lat: 37.5627, lng: 126.9255 },
      category: '양식',
      subCategory: '브런치',
      priceRange: '₩₩',
      rating: 4.6,
      reviewCount: 456,
      image: 'https://picsum.photos/400/300?random=4',
      tags: ['pet-friendly', 'vegan', 'parking'],
      district: '홍대',
      nearbyLandmarks: ['홍대입구역 3번출구 도보 10분'],
      businessHours: { weekday: '09:00-22:00', weekend: '09:00-23:00' },
      isOpen: true,
      popularMenu: ['에그베네딕트', '팬케이크', '아보카도토스트']
    },
    // 종로 지역
    {
      id: 'r5',
      name: '광화문 한정식',
      address: '서울 종로구 광화문 345',
      coordinates: { lat: 37.5759, lng: 126.9769 },
      category: '한식',
      subCategory: '한정식',
      priceRange: '₩₩₩',
      rating: 4.7,
      reviewCount: 345,
      image: 'https://picsum.photos/400/300?random=5',
      tags: ['group-dining', 'parking', 'delivery-none'],
      district: '종로',
      nearbyLandmarks: ['광화문역 2번출구 도보 5분'],
      businessHours: { weekday: '11:30-21:00', weekend: '11:00-21:30' },
      isOpen: true,
      popularMenu: ['점심특선', '한정식 정찬', '계절 코스']
    },
    {
      id: 'r6',
      name: '익선동 카페',
      address: '서울 종로구 익선동 567',
      coordinates: { lat: 37.5720, lng: 126.9850 },
      category: '카페',
      subCategory: '디저트',
      priceRange: '₩₩',
      rating: 4.4,
      reviewCount: 678,
      image: 'https://picsum.photos/400/300?random=6',
      tags: ['hidden-gem', 'pet-friendly'],
      district: '종로',
      nearbyLandmarks: ['종로3가역 4번출구 도보 3분'],
      businessHours: { weekday: '10:00-22:00', weekend: '10:00-23:00' },
      isOpen: true,
      popularMenu: ['수제 케이크', '드립커피', '크로플']
    },
    // 이태원 지역
    {
      id: 'r7',
      name: '경리단길 파스타',
      address: '서울 용산구 이태원동 890',
      coordinates: { lat: 37.5340, lng: 126.9948 },
      category: '양식',
      subCategory: '이탈리안',
      priceRange: '₩₩₩',
      rating: 4.8,
      reviewCount: 234,
      image: 'https://picsum.photos/400/300?random=7',
      tags: ['hidden-gem', 'waiting', 'halal'],
      district: '이태원',
      nearbyLandmarks: ['녹사평역 2번출구 도보 8분'],
      businessHours: { weekday: '11:30-22:00', weekend: '11:00-23:00' },
      isOpen: true,
      popularMenu: ['트러플 파스타', '마르게리타 피자', '부라타 샐러드']
    },
    // 성수 지역
    {
      id: 'r8',
      name: '성수 수제버거',
      address: '서울 성동구 성수동 123',
      coordinates: { lat: 37.5447, lng: 127.0564 },
      category: '양식',
      subCategory: '버거',
      priceRange: '₩₩',
      rating: 4.6,
      reviewCount: 567,
      image: 'https://picsum.photos/400/300?random=8',
      tags: ['local-favorite', 'parking', 'pet-friendly'],
      district: '성수',
      nearbyLandmarks: ['성수역 3번출구 도보 5분'],
      businessHours: { weekday: '11:00-21:00', weekend: '11:00-22:00' },
      isOpen: true,
      popularMenu: ['수제버거', '트러플감자튀김', '밀크쉐이크']
    },
    // 여의도 지역
    {
      id: 'r9',
      name: '여의도 일식당',
      address: '서울 영등포구 여의도동 456',
      coordinates: { lat: 37.5219, lng: 126.9245 },
      category: '일식',
      subCategory: '라멘',
      priceRange: '₩₩',
      rating: 4.5,
      reviewCount: 789,
      image: 'https://picsum.photos/400/300?random=9',
      tags: ['office', 'solo-dining'],
      district: '여의도',
      nearbyLandmarks: ['여의도역 3번출구 도보 3분', 'IFC몰 인근'],
      businessHours: { weekday: '11:00-21:00', weekend: '11:30-20:00' },
      isOpen: true,
      popularMenu: ['돈코츠라멘', '차슈동', '교자']
    },
    // 마포 지역
    {
      id: 'r10',
      name: '망원시장 맛집',
      address: '서울 마포구 망원동 789',
      coordinates: { lat: 37.5556, lng: 126.9019 },
      category: '한식',
      subCategory: '시장맛집',
      priceRange: '₩',
      rating: 4.7,
      reviewCount: 890,
      image: 'https://picsum.photos/400/300?random=10',
      tags: ['local-favorite', 'hidden-gem', 'delivery-none'],
      district: '마포',
      nearbyLandmarks: ['망원역 2번출구 도보 5분'],
      businessHours: { weekday: '09:00-20:00', weekend: '09:00-18:00' },
      isOpen: true,
      popularMenu: ['칼국수', '김밥', '떡볶이']
    }
  ];

  // 필터링된 레스토랑 목록
  const filteredRestaurants = useMemo(() => {
    let filtered = [...allRestaurants];

    // 탭별 필터링
    if (selectedTab === 'neighborhood') {
      filtered = filtered.filter(r => r.district === selectedDistrict);
    } else if (selectedTab === 'workplace') {
      // 직장/학교 주변 필터링 (여기서는 태그 기반)
      // 실제로는 위치 기반 필터링 필요
    } else if (selectedTab === 'filter') {
      if (selectedFilters.size > 0) {
        filtered = filtered.filter(r => 
          r.tags.some(tag => selectedFilters.has(tag))
        );
      }
    }

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 가격대 필터링
    if (priceFilter !== 'all') {
      filtered = filtered.filter(r => r.priceRange === priceFilter);
    }

    return filtered;
  }, [selectedTab, selectedDistrict, selectedFilters, searchQuery, priceFilter]);

  // Restaurant 타입으로 변환
  const convertToRestaurantType = (restaurants: RestaurantData[]): Restaurant[] => {
    return restaurants.map(r => ({
      _id: r.id,
      name: r.name,
      address: r.address,
      roadAddress: r.address,
      coordinates: r.coordinates,
      category: r.category,
      subCategory: r.subCategory || r.category,
      priceRange: r.priceRange,
      images: [{
        url: r.image,
        uploadedBy: 'system',
        uploadedAt: new Date().toISOString()
      }],
      phoneNumber: '',
      businessHours: {},
      averageRating: r.rating,
      reviewCount: r.reviewCount,
      tags: r.tags,
      dnaProfile: {
        atmosphere: [],
        foodStyle: [],
        instagramability: 0,
        dateSpot: 0,
        groupFriendly: r.tags.includes('group-dining') ? 5 : 3,
        soloFriendly: r.tags.includes('solo-dining') ? 5 : 3
      },
      menuItems: r.popularMenu?.map(menu => ({
        name: menu,
        isPopular: true
      })) || [],
      features: r.tags,
      createdBy: {
        _id: 'system',
        username: 'system',
        email: 'system@bobmap.com',
        trustScore: 100,
        followerCount: 0,
        followingCount: 0,
        visitedRestaurantsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any,
      verifiedBy: [],
      isVerified: true,
      viewCount: 0,
      saveCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">맛집 탐색</h1>
              </div>
              
              {/* 뷰 모드 토글 */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    viewMode === 'map' 
                      ? 'bg-white text-orange-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-orange-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 검색바 */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="맛집 이름, 카테고리, 지역으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex gap-6 border-t">
            <button
              onClick={() => setSelectedTab('neighborhood')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                selectedTab === 'neighborhood'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPinIcon className="w-5 h-5 inline mr-1" />
              동네별
            </button>
            <button
              onClick={() => setSelectedTab('workplace')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                selectedTab === 'workplace'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5 inline mr-1" />
              직장/학교 주변
            </button>
            <button
              onClick={() => setSelectedTab('filter')}
              className={`py-3 border-b-2 font-medium transition-colors ${
                selectedTab === 'filter'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FunnelIcon className="w-5 h-5 inline mr-1" />
              필터별
              {selectedFilters.size > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {selectedFilters.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 서브 필터 바 */}
      <div className="bg-white border-b sticky top-[185px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {selectedTab === 'neighborhood' && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {districts.map((district) => (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrict(district.name)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedDistrict === district.name
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {district.name}
                  <span className="ml-1 text-xs opacity-80">({district.count})</span>
                </button>
              ))}
            </div>
          )}

          {selectedTab === 'workplace' && (
            <div className="grid grid-cols-4 gap-2">
              {workplaceCategories.map((category) => (
                <button
                  key={category.id}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-1">
                    {typeof category.icon === 'string' ? category.icon : <category.icon className="w-8 h-8 mx-auto" />}
                  </div>
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500">{category.count}개</div>
                </button>
              ))}
            </div>
          )}

          {selectedTab === 'filter' && (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {Array.from(selectedFilters).map((filterId) => {
                  const filter = filterOptions.find(f => f.id === filterId);
                  return filter ? (
                    <span
                      key={filterId}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {filter.icon} {filter.label}
                      <button
                        onClick={() => {
                          const newFilters = new Set(selectedFilters);
                          newFilters.delete(filterId);
                          setSelectedFilters(newFilters);
                        }}
                        className="ml-1 hover:text-orange-900"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FunnelIcon className="w-4 h-4" />
                필터 선택
              </button>
            </div>
          )}

          {/* 가격대 필터 */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <span className="text-sm text-gray-600">가격대:</span>
            <div className="flex gap-2">
              {['all', '₩', '₩₩', '₩₩₩', '₩₩₩₩'].map((price) => (
                <button
                  key={price}
                  onClick={() => setPriceFilter(price)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    priceFilter === price
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {price === 'all' ? '전체' : price}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-gray-600">
              {filteredRestaurants.length}개 맛집
            </span>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'map' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 지도 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden h-[600px]">
                <KoreanMap
                  restaurants={convertToRestaurantType(filteredRestaurants)}
                  onRestaurantClick={(restaurant) => {
                    const selected = filteredRestaurants.find(r => r.id === restaurant._id);
                    setSelectedRestaurant(selected || null);
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* 선택된 레스토랑 정보 */}
            <div className="lg:col-span-1">
              {selectedRestaurant ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-[320px]"
                >
                  <img
                    src={selectedRestaurant.image}
                    alt={selectedRestaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{selectedRestaurant.name}</h3>
                    <p className="text-gray-600 mb-3">{selectedRestaurant.category} · {selectedRestaurant.priceRange}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <StarSolid className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">{selectedRestaurant.rating}</span>
                        <span className="text-gray-500 text-sm">({selectedRestaurant.reviewCount})</span>
                      </div>
                      {selectedRestaurant.isOpen ? (
                        <span className="text-green-600 text-sm font-medium">영업중</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">영업종료</span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-700">{selectedRestaurant.address}</p>
                          {selectedRestaurant.nearbyLandmarks?.map((landmark, idx) => (
                            <p key={idx} className="text-gray-500 text-xs">{landmark}</p>
                          ))}
                        </div>
                      </div>
                      
                      {selectedRestaurant.businessHours && (
                        <div className="flex items-start gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-700">평일: {selectedRestaurant.businessHours.weekday}</p>
                            <p className="text-gray-700">주말: {selectedRestaurant.businessHours.weekend}</p>
                          </div>
                        </div>
                      )}

                      {selectedRestaurant.popularMenu && (
                        <div className="flex items-start gap-2">
                          <FireIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-700 font-medium mb-1">인기 메뉴</p>
                            <div className="flex flex-wrap gap-1">
                              {selectedRestaurant.popularMenu.map((menu, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  {menu}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        상세보기
                      </button>
                      <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>지도에서 맛집을 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 리스트 뷰 */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <StarSolid className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  {restaurant.tags.includes('michelin') && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      미슐랭
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {restaurant.category} · {restaurant.priceRange} · {restaurant.district}
                  </p>
                  
                  {restaurant.nearbyLandmarks && (
                    <p className="text-xs text-gray-500 mb-3">
                      {restaurant.nearbyLandmarks[0]}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {restaurant.tags.slice(0, 3).map((tag) => {
                      const filter = filterOptions.find(f => f.id === tag);
                      return filter ? (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {filter.icon} {filter.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      리뷰 {restaurant.reviewCount}개
                    </span>
                    {restaurant.isOpen ? (
                      <span className="text-xs text-green-600 font-medium">영업중</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">영업종료</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 필터 모달 */}
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">필터 선택</h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        const newFilters = new Set(selectedFilters);
                        if (newFilters.has(filter.id)) {
                          newFilters.delete(filter.id);
                        } else {
                          newFilters.add(filter.id);
                        }
                        setSelectedFilters(newFilters);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedFilters.has(filter.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{filter.icon}</div>
                      <div className="font-medium">{filter.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{filter.count}개 맛집</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedFilters(new Set())}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    적용하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantExplorer;