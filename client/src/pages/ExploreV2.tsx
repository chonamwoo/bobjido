import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  HeartIcon,
  XMarkIcon,
  SparklesIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  MapIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  FireIcon,
  TrophyIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import KoreaMap from '../components/KoreaMap';
import WorldMap from '../components/WorldMap';

// 음식 관련 커스텀 아이콘
const PlateIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const BowlIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2z" stroke="currentColor" strokeWidth={1.5} />
    <path d="M7 10c.6-.6 1.4-1 2.2-1h5.6c.8 0 1.6.4 2.2 1" stroke="currentColor" strokeWidth={1.5} fill="none" />
  </svg>
);

// 국가별 국기 이모지 매핑
const countryFlags: { [key: string]: string } = {
  'Japan': '🇯🇵',
  'Korea': '🇰🇷',
  'USA': '🇺🇸',
  'France': '🇫🇷',
  'UK': '🇬🇧',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'China': '🇨🇳',
  'Thailand': '🇹🇭',
  'Singapore': '🇸🇬',
  'Australia': '🇦🇺',
  'Germany': '🇩🇪',
  'Canada': '🇨🇦',
  'Brazil': '🇧🇷',
  'India': '🇮🇳',
  'Mexico': '🇲🇽',
  'UAE': '🇦🇪',
  'Vietnam': '🇻🇳',
  'Indonesia': '🇮🇩',
  'Turkey': '🇹🇷',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Egypt': '🇪🇬',
  'Morocco': '🇲🇦'
};

// 한국 도시 데이터
const koreanCities = [
  { name: '서울', region: '수도권', icon: '🏛️', users: 234, restaurants: 567 },
  { name: '부산', region: '영남', icon: '🌊', users: 89, restaurants: 234 },
  { name: '제주', region: '제주', icon: '🏝️', users: 67, restaurants: 189 },
  { name: '강릉', region: '강원', icon: '⛷️', users: 45, restaurants: 123 },
  { name: '경주', region: '영남', icon: '🏛️', users: 34, restaurants: 98 },
  { name: '전주', region: '호남', icon: '🍜', users: 56, restaurants: 145 },
  { name: '대구', region: '영남', icon: '🌆', users: 78, restaurants: 201 },
  { name: '인천', region: '수도권', icon: '✈️', users: 92, restaurants: 223 },
  { name: '광주', region: '호남', icon: '🎨', users: 43, restaurants: 112 },
  { name: '대전', region: '충청', icon: '🔬', users: 51, restaurants: 134 },
  { name: '울산', region: '영남', icon: '🏭', users: 38, restaurants: 97 },
  { name: '수원', region: '수도권', icon: '🏰', users: 73, restaurants: 187 }
];

// 해외 인기 도시 데이터
const globalDestinations = [
  // 아시아
  { name: '도쿄', country: 'Japan', flag: '🇯🇵', continent: 'asia', hot: true, users: 156, restaurants: 342 },
  { name: '오사카', country: 'Japan', flag: '🇯🇵', continent: 'asia', users: 89, restaurants: 198 },
  { name: '방콕', country: 'Thailand', flag: '🇹🇭', continent: 'asia', hot: true, users: 92, restaurants: 256 },
  { name: '싱가포르', country: 'Singapore', flag: '🇸🇬', continent: 'asia', users: 78, restaurants: 189 },
  { name: '홍콩', country: 'China', flag: '🇭🇰', continent: 'asia', users: 65, restaurants: 178 },
  { name: '타이베이', country: 'Taiwan', flag: '🇹🇼', continent: 'asia', users: 43, restaurants: 134 },
  { name: '하노이', country: 'Vietnam', flag: '🇻🇳', continent: 'asia', users: 38, restaurants: 98 },
  { name: '발리', country: 'Indonesia', flag: '🇮🇩', continent: 'asia', hot: true, users: 87, restaurants: 167 },
  
  // 유럽
  { name: '파리', country: 'France', flag: '🇫🇷', continent: 'europe', hot: true, users: 134, restaurants: 298 },
  { name: '런던', country: 'UK', flag: '🇬🇧', continent: 'europe', users: 112, restaurants: 267 },
  { name: '바르셀로나', country: 'Spain', flag: '🇪🇸', continent: 'europe', hot: true, users: 98, restaurants: 234 },
  { name: '로마', country: 'Italy', flag: '🇮🇹', continent: 'europe', users: 89, restaurants: 212 },
  { name: '베를린', country: 'Germany', flag: '🇩🇪', continent: 'europe', users: 67, restaurants: 156 },
  { name: '암스테르담', country: 'Netherlands', flag: '🇳🇱', continent: 'europe', users: 54, restaurants: 134 },
  { name: '프라하', country: 'Czech', flag: '🇨🇿', continent: 'europe', users: 45, restaurants: 112 },
  { name: '리스본', country: 'Portugal', flag: '🇵🇹', continent: 'europe', hot: true, users: 72, restaurants: 145 },
  
  // 아메리카
  { name: '뉴욕', country: 'USA', flag: '🇺🇸', continent: 'americas', hot: true, users: 189, restaurants: 456 },
  { name: 'LA', country: 'USA', flag: '🇺🇸', continent: 'americas', users: 145, restaurants: 367 },
  { name: '샌프란시스코', country: 'USA', flag: '🇺🇸', continent: 'americas', users: 98, restaurants: 234 },
  { name: '토론토', country: 'Canada', flag: '🇨🇦', continent: 'americas', users: 67, restaurants: 178 },
  { name: '멕시코시티', country: 'Mexico', flag: '🇲🇽', continent: 'americas', users: 54, restaurants: 143 },
  
  // 오세아니아
  { name: '시드니', country: 'Australia', flag: '🇦🇺', continent: 'oceania', users: 78, restaurants: 198 },
  { name: '멜버른', country: 'Australia', flag: '🇦🇺', continent: 'oceania', users: 65, restaurants: 167 }
];

interface UserCard {
  id: string;
  username: string;
  profileImage: string;
  distance: number;
  matchRate: number;
  tasteProfile: string;
  tasteTags: string[];
  favoriteRestaurants: {
    name: string;
    category: string;
    image?: string;
  }[];
  bio?: string;
  age?: number;
  location: string;
  country?: string;
  city?: string;
  isLocal?: boolean;
  languages?: string[];
}

// 샘플 데이터 생성 함수
const generateMockUsers = (locationMode: string, selectedLocation?: any): UserCard[] => {
  if (locationMode === 'nearby') {
    return [
      {
        id: '1',
        username: '김미식',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        distance: 2.3,
        matchRate: 92,
        tasteProfile: '모험적인 미식가',
        tasteTags: ['매운맛 마스터', '카페 투어', '새로운 도전'],
        favoriteRestaurants: [
          { name: '교대이층집', category: '한식' },
          { name: '스시오마카세', category: '일식' }
        ],
        bio: '맛있는 음식과 함께하는 행복한 일상 🍽️',
        age: 28,
        location: '강남구',
        country: 'Korea',
        city: '서울'
      },
      {
        id: '2',
        username: '이구르메',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        distance: 4.1,
        matchRate: 85,
        tasteProfile: '트렌디한 카페러버',
        tasteTags: ['디저트 홀릭', '브런치 카페', '분위기 맛집'],
        favoriteRestaurants: [
          { name: '블루보틀', category: '카페' },
          { name: '빌즈', category: '브런치' }
        ],
        bio: '카페 투어가 취미입니다 ☕',
        age: 25,
        location: '성동구',
        country: 'Korea',
        city: '서울'
      }
    ];
  }

  if (locationMode === 'domestic' && selectedLocation) {
    return [
      {
        id: '10',
        username: `${selectedLocation.name}푸디`,
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        distance: 0,
        matchRate: 88,
        tasteProfile: `${selectedLocation.name} 로컬 전문가`,
        tasteTags: ['지역 맛집', '로컬 추천', '숨은 맛집'],
        favoriteRestaurants: [
          { name: `${selectedLocation.name} 맛집 1`, category: '한식' },
          { name: `${selectedLocation.name} 맛집 2`, category: '지역 특산' }
        ],
        bio: `${selectedLocation.name}의 모든 맛집을 알고 있어요! 🍽️`,
        age: 30,
        location: selectedLocation.name,
        country: 'Korea',
        city: selectedLocation.name,
        isLocal: true
      }
    ];
  }

  if (locationMode === 'global' && selectedLocation) {
    return [
      {
        id: '20',
        username: `${selectedLocation.name} Foodie`,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        distance: 0,
        matchRate: 90,
        tasteProfile: 'Local Expert',
        tasteTags: ['Street Food', 'Fine Dining', 'Local Favorites'],
        favoriteRestaurants: [
          { name: `Best of ${selectedLocation.name}`, category: 'Local' },
          { name: 'Hidden Gem Restaurant', category: 'Traditional' }
        ],
        bio: `Your local guide in ${selectedLocation.name} ${selectedLocation.flag || '🌍'}`,
        age: 32,
        location: selectedLocation.name,
        country: selectedLocation.country,
        city: selectedLocation.name,
        isLocal: true,
        languages: ['EN', 'Local']
      }
    ];
  }
  
  return [];
};

const ExploreV2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  
  const [locationMode, setLocationMode] = useState<'nearby' | 'domestic' | 'global'>(
    locationState?.locationMode || 'nearby'
  );
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  
  const [users, setUsers] = useState<UserCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [filters, setFilters] = useState({
    distance: 10,
    minMatchRate: 70,
    tasteProfile: 'all'
  });

  // 위치 모드에 따라 사용자 데이터 변경
  useEffect(() => {
    const newUsers = generateMockUsers(locationMode, selectedLocation);
    setUsers(newUsers);
    setCurrentIndex(0);
  }, [locationMode, selectedLocation]);

  const currentUser = users[currentIndex];
  const hasMoreUsers = currentIndex < users.length;

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentUser) return;

    setSwipeDirection(direction === 'up' ? 'right' : direction);
    
    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handlePass();
    } else if (direction === 'up') {
      handleSuperLike();
    }
  };

  // 이전 카드로 이동
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음 카드로 이동 (pass와 동일)
  const goToNext = () => {
    handlePass();
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    const message = currentUser.isLocal 
      ? `${currentUser.username}님과 ${currentUser.city}에서 만나요! 🌏`
      : `${currentUser.username}님과 함께 식사해요! 🍽️`;
    
    toast.success(message);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handlePass = () => {
    if (!currentUser) return;
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const handleSuperLike = async () => {
    if (!currentUser) return;
    
    toast.success(`${currentUser.username}님에게 슈퍼라이크를 보냈습니다! ⭐`, {
      icon: '⭐',
      duration: 3000
    });
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  // 해외 도시 필터링
  const filteredGlobalDestinations = globalDestinations.filter(dest => {
    const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  // 국내 도시 필터링
  const filteredKoreanCities = koreanCities.filter(city => 
    city.name.includes(searchQuery) || city.region.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-x-hidden">
      <div className="max-w-lg mx-auto px-4 py-8 relative">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            한끼어때?
            {locationMode === 'global' && <span className="text-lg">🌏</span>}
            {locationMode === 'domestic' && <span className="text-lg">🇰🇷</span>}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={`p-2 rounded-lg shadow hover:shadow-md transition-all ${
                locationMode !== 'nearby' ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              <MapPinIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 위치 모드 선택 - 3개로 간소화 */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-4">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                setLocationMode('nearby');
                setSelectedLocation(null);
              }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'nearby' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <MapPinIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">내 주변</span>
            </button>
            
            <button
              onClick={() => {
                setLocationMode('domestic');
                setShowLocationPicker(true);
              }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'domestic' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">국내</span>
            </button>
            
            <button
              onClick={() => {
                setLocationMode('global');
                setShowLocationPicker(true);
              }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'global' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <GlobeAltIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">해외</span>
            </button>
          </div>
        </div>

        {/* 위치 선택 패널 */}
        <AnimatePresence>
          {showLocationPicker && locationMode === 'domestic' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <KoreaMap 
                onCitySelect={(city) => {
                  setSelectedLocation(city);
                  setShowLocationPicker(false);
                }}
              />
            </motion.div>
          )}

          {showLocationPicker && locationMode === 'global' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <WorldMap 
                onCitySelect={(city) => {
                  setSelectedLocation(city);
                  setShowLocationPicker(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택된 위치 정보 */}
        {selectedLocation && (
          <div className={`rounded-lg p-3 mb-4 text-white ${
            locationMode === 'domestic' 
              ? 'bg-gradient-to-r from-green-500 to-teal-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {locationMode === 'domestic' 
                    ? (selectedLocation.icon || '🏛️')
                    : (selectedLocation.flag || '🌍')}
                </span>
                <div>
                  <p className="font-semibold">{selectedLocation.name}</p>
                  <p className="text-xs opacity-90">
                    {selectedLocation.users}명의 미식가 • {selectedLocation.restaurants || 0}개 맛집
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 카드 스택 */}
        <div className="relative h-[600px] overflow-visible">
          {/* 이전 카드 (왼쪽) */}
          {currentIndex > 0 && (
            <motion.div
              className="absolute inset-0 cursor-pointer"
              style={{
                transform: 'scale(0.85) translateX(-85%)',
                opacity: 0.5,
                zIndex: 1,
              }}
              whileHover={{ 
                scale: 0.88,
                x: '-83%',
                opacity: 0.7,
                transition: { duration: 0.2 }
              }}
              onClick={goToPrevious}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <img
                  src={users[currentIndex - 1].profileImage}
                  alt={users[currentIndex - 1].username}
                  className="w-full h-2/3 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-600">
                    {users[currentIndex - 1].username}
                  </h3>
                  <p className="text-sm text-gray-400">클릭하여 이전으로</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* 다음 카드 (오른쪽) */}
          {currentIndex < users.length - 1 && (
            <motion.div
              className="absolute inset-0 cursor-pointer"
              style={{
                transform: 'scale(0.85) translateX(85%)',
                opacity: 0.5,
                zIndex: 1,
              }}
              whileHover={{ 
                scale: 0.88,
                x: '83%',
                opacity: 0.7,
                transition: { duration: 0.2 }
              }}
              onClick={goToNext}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <img
                  src={users[currentIndex + 1].profileImage}
                  alt={users[currentIndex + 1].username}
                  className="w-full h-2/3 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-600">
                    {users[currentIndex + 1].username}
                  </h3>
                  <p className="text-sm text-gray-400">클릭하여 다음으로</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* 추가 배경 카드 (뒤쪽) */}
          {currentIndex < users.length - 2 && (
            <div
              className="absolute inset-0"
              style={{
                transform: 'scale(0.75) translateY(-20px)',
                opacity: 0.2,
                zIndex: 0,
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <div className="h-full bg-gray-200" />
              </div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {hasMoreUsers && currentUser && (
              <motion.div
                key={currentUser.id}
                className="absolute inset-0"
                style={{ zIndex: 10 }}
                initial={{ scale: 0.95, opacity: 0, x: 0 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{
                  scale: 0.85,
                  opacity: 0,
                  x: swipeDirection === 'left' ? -500 : swipeDirection === 'right' ? 500 : 0,
                  transition: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, { offset, velocity }: PanInfo) => {
                  const swipe = offset.x;
                  const swipeThreshold = 100;
                  const velocityThreshold = 500;

                  if (swipe > swipeThreshold || velocity.x > velocityThreshold) {
                    handleSwipe('right');
                  } else if (swipe < -swipeThreshold || velocity.x < -velocityThreshold) {
                    handleSwipe('left');
                  }
                }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full cursor-grab active:cursor-grabbing">
                  {/* 이미지 영역 */}
                  <div className="relative h-2/3">
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* 로컬 뱃지 */}
                    {currentUser.isLocal && (
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 bg-green-500 text-white rounded-full font-semibold text-sm flex items-center gap-1">
                          <HomeIcon className="w-4 h-4" />
                          <span>로컬 전문가</span>
                        </div>
                      </div>
                    )}
                    
                    {/* 기본 정보 */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">{currentUser.username}</h2>
                        {currentUser.age && (
                          <span className="text-xl">{currentUser.age}</span>
                        )}
                        {currentUser.country && locationMode === 'global' && (
                          <span className="text-2xl ml-2">
                            {countryFlags[currentUser.country] || '🌍'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{currentUser.city || currentUser.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <SparklesIcon className="w-4 h-4" />
                          <span>{currentUser.matchRate}% 매칭</span>
                        </div>
                      </div>
                      
                      {/* 언어 */}
                      {currentUser.languages && (
                        <div className="flex gap-2 mt-2">
                          {currentUser.languages.map(lang => (
                            <span key={lang} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 매칭률 뱃지 */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full font-semibold text-sm ${
                        currentUser.matchRate >= 90 ? 'bg-purple-500 text-white' :
                        currentUser.matchRate >= 80 ? 'bg-blue-500 text-white' :
                        currentUser.matchRate >= 70 ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {currentUser.matchRate}% 매칭
                      </div>
                    </div>
                  </div>

                  {/* 상세 정보 */}
                  <div className="p-4 h-1/3 overflow-y-auto">
                    <div className="mb-3">
                      <p className="text-sm text-purple-600 font-medium mb-1">
                        {currentUser.tasteProfile}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.tasteTags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {currentUser.bio && (
                      <p className="text-sm text-gray-600 mb-3">{currentUser.bio}</p>
                    )}

                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">
                        {currentUser.isLocal ? '추천 로컬 맛집' : '대표 맛집'}
                      </h4>
                      <div className="space-y-1">
                        {currentUser.favoriteRestaurants.slice(0, 3).map((restaurant, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-800">{restaurant.name}</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500">{restaurant.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 카드가 없을 때 */}

          {!hasMoreUsers && selectedLocation && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">
                {locationMode === 'domestic' ? selectedLocation.icon : selectedLocation.flag}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedLocation.name}의 카드를 모두 확인했어요!
              </h3>
              <p className="text-gray-600 text-center mb-6">
                다른 도시를 탐험해보세요
              </p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setUsers(generateMockUsers(locationMode, selectedLocation));
                }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                다시 보기
              </button>
            </div>
          )}

          {!hasMoreUsers && locationMode === 'nearby' && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">😊</div>
              <h3 className="text-xl font-semibold mb-2">더 이상 카드가 없어요!</h3>
              <p className="text-gray-600 text-center mb-6">
                새로운 사람들이 곧 추가될 예정이에요
              </p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setUsers(generateMockUsers('nearby'));
                }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                다시 보기
              </button>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        {hasMoreUsers && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePass}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <XMarkIcon className="w-7 h-7 text-red-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSuperLike}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
            >
              <SparklesIcon className="w-6 h-6 text-blue-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors"
            >
              <PlateIcon className="w-7 h-7 text-green-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/chat/${currentUser.id}`)}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-50 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-6 h-6 text-purple-500" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreV2;