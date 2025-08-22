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
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

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
  'Turkey': '🇹🇷'
};

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
  travelDates?: { start: string; end: string };
}

// 샘플 데이터 생성 함수
const generateMockUsers = (locationMode: string, selectedCountry?: string): UserCard[] => {
  const baseUsers: UserCard[] = [
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
        { name: '스시오마카세', category: '일식' },
        { name: '버거앤프라이즈', category: '양식' }
      ],
      bio: '맛있는 음식과 함께하는 행복한 일상 🍽️',
      age: 28,
      location: '강남구',
      country: 'Korea',
      city: '서울'
    }
  ];

  if (locationMode === 'global' || locationMode === 'travel') {
    return [
      {
        id: '10',
        username: 'Yuki Tanaka',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        distance: 0,
        matchRate: 88,
        tasteProfile: 'Local Expert',
        tasteTags: ['Sushi Master', 'Izakaya', 'Ramen Hunter'],
        favoriteRestaurants: [
          { name: 'Sukiyabashi Jiro', category: 'Sushi' },
          { name: 'Ichiran Ramen', category: 'Ramen' },
          { name: 'Gonpachi', category: 'Izakaya' }
        ],
        bio: 'Tokyo food guide 🇯🇵 Let me show you the best spots!',
        age: 32,
        location: 'Tokyo',
        country: 'Japan',
        city: 'Tokyo',
        isLocal: true,
        languages: ['JP', 'EN']
      },
      {
        id: '11',
        username: 'Marco Rossi',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        distance: 0,
        matchRate: 85,
        tasteProfile: 'Italian Foodie',
        tasteTags: ['Pasta Expert', 'Wine Lover', 'Truffle Hunter'],
        favoriteRestaurants: [
          { name: 'Osteria Francescana', category: 'Italian' },
          { name: 'Il Luogo di Aimo', category: 'Fine Dining' }
        ],
        bio: 'Milan local, passionate about authentic Italian cuisine 🇮🇹',
        age: 35,
        location: 'Milan',
        country: 'Italy',
        city: 'Milan',
        isLocal: true,
        languages: ['IT', 'EN', 'FR']
      },
      {
        id: '12',
        username: 'Sophie Chen',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        distance: 0,
        matchRate: 90,
        tasteProfile: 'Traveler Foodie',
        tasteTags: ['Street Food', 'Local Markets', 'Hidden Gems'],
        favoriteRestaurants: [
          { name: 'Hawker Chan', category: 'Street Food' },
          { name: 'Maxwell Food Centre', category: 'Local' }
        ],
        bio: 'Traveling to Singapore next week! Looking for food buddies 🌏',
        age: 27,
        location: 'Singapore',
        country: 'Singapore',
        city: 'Singapore',
        isLocal: false,
        languages: ['EN', 'ZH'],
        travelDates: { start: '2024-03-20', end: '2024-03-27' }
      }
    ];
  }
  
  return baseUsers;
};

const ExploreEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  
  // location state에서 초기값 설정
  const [locationMode, setLocationMode] = useState<'nearby' | 'domestic' | 'global' | 'travel'>(
    locationState?.locationMode || 'nearby'
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(locationState?.selectedCountry || '');
  const [selectedCity, setSelectedCity] = useState<string>(locationState?.selectedCity || '');
  const [travelDates, setTravelDates] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [users, setUsers] = useState<UserCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [filters, setFilters] = useState({
    distance: 10,
    minMatchRate: 70,
    tasteProfile: 'all'
  });

  // 위치 모드에 따라 사용자 데이터 변경
  useEffect(() => {
    const newUsers = generateMockUsers(locationMode, selectedCountry);
    setUsers(newUsers);
    setCurrentIndex(0);
  }, [locationMode, selectedCountry]);

  const currentUser = users[currentIndex];
  const hasMoreUsers = currentIndex < users.length;

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentUser) return;

    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handlePass();
    } else if (direction === 'up') {
      handleSuperLike();
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    const message = currentUser.isLocal 
      ? `${currentUser.username}님과 ${currentUser.city}에서 만나요! 🌏`
      : `${currentUser.username}님과 함께 식사해요! 🍽️`;
    
    toast.success(message);
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = () => {
    if (!currentUser) return;
    setCurrentIndex(prev => prev + 1);
  };

  const handleSuperLike = async () => {
    if (!currentUser) return;
    
    toast.success(`${currentUser.username}님에게 슈퍼라이크를 보냈습니다! ⭐`, {
      icon: '⭐',
      duration: 3000
    });
    
    setCurrentIndex(prev => prev + 1);
  };

  const popularDestinations = [
    { name: '도쿄', country: 'Japan', flag: '🇯🇵' },
    { name: '뉴욕', country: 'USA', flag: '🇺🇸' },
    { name: '파리', country: 'France', flag: '🇫🇷' },
    { name: '방콕', country: 'Thailand', flag: '🇹🇭' },
    { name: '런던', country: 'UK', flag: '🇬🇧' },
    { name: '싱가포르', country: 'Singapore', flag: '🇸🇬' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            한끼어때?
            {locationMode === 'global' && <span className="text-lg">🌏</span>}
            {locationMode === 'travel' && <span className="text-lg">✈️</span>}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={`p-2 rounded-lg shadow hover:shadow-md transition-all ${
                locationMode === 'global' || locationMode === 'travel' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white'
              }`}
            >
              <GlobeAltIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 위치 모드 선택 */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-4">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setLocationMode('nearby')}
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
              onClick={() => setLocationMode('domestic')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'domestic' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <BuildingOfficeIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">국내</span>
            </button>
            
            <button
              onClick={() => setLocationMode('global')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'global' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <GlobeAltIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">해외</span>
            </button>
            
            <button
              onClick={() => setLocationMode('travel')}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                locationMode === 'travel' 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">여행</span>
            </button>
          </div>
        </div>

        {/* 위치 선택 패널 */}
        <AnimatePresence>
          {showLocationPicker && (locationMode === 'global' || locationMode === 'travel') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg p-4 mb-4 overflow-hidden"
            >
              <h3 className="font-semibold mb-3">
                {locationMode === 'travel' ? '여행 계획' : '탐험할 도시'}
              </h3>
              
              {locationMode === 'travel' && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">출발일</label>
                      <input
                        type="date"
                        value={travelDates.start}
                        onChange={(e) => setTravelDates(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">도착일</label>
                      <input
                        type="date"
                        value={travelDates.end}
                        onChange={(e) => setTravelDates(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">인기 여행지</p>
                <div className="grid grid-cols-3 gap-2">
                  {popularDestinations.map(dest => (
                    <button
                      key={dest.country}
                      onClick={() => {
                        setSelectedCountry(dest.country);
                        setSelectedCity(dest.name);
                        setShowLocationPicker(false);
                      }}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedCity === dest.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{dest.flag}</div>
                      <div className="text-xs font-medium">{dest.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="도시 검색..."
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  적용
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택된 위치 정보 */}
        {(locationMode === 'global' || locationMode === 'travel') && selectedCity && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{countryFlags[selectedCountry] || '🌍'}</span>
                <div>
                  <p className="font-semibold">{selectedCity}</p>
                  <p className="text-xs opacity-90">
                    {locationMode === 'travel' 
                      ? `${users.filter(u => u.isLocal).length}명의 로컬 가이드`
                      : `${users.length}명의 미식가`}
                  </p>
                </div>
              </div>
              {locationMode === 'travel' && travelDates.start && (
                <div className="text-right">
                  <p className="text-xs opacity-90">여행 기간</p>
                  <p className="text-sm font-medium">
                    {new Date(travelDates.start).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - 
                    {new Date(travelDates.end).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 카드 스택 */}
        <div className="relative h-[600px]">
          {/* 배경 카드들 */}
          {hasMoreUsers && users.slice(currentIndex + 1, currentIndex + 3).map((user, index) => (
            <div
              key={user.id}
              className="absolute inset-0"
              style={{
                transform: `scale(${0.95 - index * 0.03}) translateY(${-10 - index * 10}px)`,
                opacity: 0.5 - index * 0.2,
                zIndex: -index - 1,
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <div className="h-full bg-gray-200" />
              </div>
            </div>
          ))}
          
          <AnimatePresence>
            {hasMoreUsers && currentUser && (
              <motion.div
                key={currentUser.id}
                className="absolute inset-0"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
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
                    
                    {/* 로컬/여행자 뱃지 */}
                    {currentUser.isLocal !== undefined && (
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1 ${
                          currentUser.isLocal 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {currentUser.isLocal ? (
                            <>
                              <HomeIcon className="w-4 h-4" />
                              <span>로컬 가이드</span>
                            </>
                          ) : (
                            <>
                              <PaperAirplaneIcon className="w-4 h-4" />
                              <span>여행자</span>
                            </>
                          )}
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
                        {currentUser.country && (
                          <span className="text-2xl ml-2">
                            {countryFlags[currentUser.country] || '🌍'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>
                            {currentUser.city ? `${currentUser.city}, ${currentUser.country}` : currentUser.location}
                          </span>
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
                    
                    {/* 여행 날짜 */}
                    {currentUser.travelDates && (
                      <div className="bg-blue-50 rounded-lg p-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 font-medium">
                            {new Date(currentUser.travelDates.start).toLocaleDateString('ko-KR')} - 
                            {new Date(currentUser.travelDates.end).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
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
          {!hasMoreUsers && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">
                {locationMode === 'global' || locationMode === 'travel' ? '🌏' : '😊'}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {locationMode === 'global' || locationMode === 'travel' 
                  ? '이 지역의 카드를 모두 확인했어요!'
                  : '더 이상 카드가 없어요!'}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {locationMode === 'global' || locationMode === 'travel' 
                  ? '다른 도시를 탐험해보세요'
                  : '새로운 사람들이 곧 추가될 예정이에요'}
              </p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setUsers(generateMockUsers(locationMode, selectedCountry));
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

export default ExploreEnhanced;