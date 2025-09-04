import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapIcon,
  UserGroupIcon,
  SparklesIcon,
  ChevronRightIcon,
  PlayIcon,
  FunnelIcon,
  TrophyIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const HomeMVP: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // 찐맛집 필터 옵션들
  const realFilters = [
    { id: 'waiting', label: '줄서는 집', icon: '⏰' },
    { id: 'local', label: '현지인 맛집', icon: '🏝️' },
    { id: 'veteran', label: '30년 전통', icon: '🏛️' },
    { id: 'hidden', label: '간판없는', icon: '🤫' },
    { id: 'michelin', label: '미슐랭', icon: '⭐' },
    { id: 'latenight', label: '새벽까지', icon: '🌙' },
    { id: 'homestyle', label: '집밥스타일', icon: '🍚' },
    { id: 'nodelivery', label: '배달불가', icon: '🚫' },
    { id: 'parking', label: '주차편한', icon: '🅿️' },
    { id: 'nofranchise', label: '단독매장', icon: '1️⃣' },
    { id: 'celebrity', label: '연예인단골', icon: '🎆' },
    { id: 'soldout', label: '품절대란', icon: '💥' },
    { id: 'petfriendly', label: '애견동반', icon: '🐶' },
    { id: 'seasonal', label: '계절한정', icon: '🌸' },
    { id: 'taxi', label: '기사님추천', icon: '🚕' },
  ];

  // 인기 플레이리스트 샘플 데이터
  const popularPlaylists = [
    {
      id: 1,
      title: '강남 직장인 점심 맛집',
      curator: '강남러버',
      curatorId: '1',
      count: 12,
      likes: 342,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      restaurants: [
        { 
          id: 'r1', 
          name: '강남면옥', 
          lat: 37.5010, 
          lng: 127.0396,
          cuisine: '한식',
          priceRange: '₩₩',
          rating: 4.7,
          address: '서울 강남구 테헤란로 123'
        },
        { 
          id: 'r2', 
          name: '역삼칼국수', 
          lat: 37.4998, 
          lng: 127.0366,
          cuisine: '한식',
          priceRange: '₩',
          rating: 4.5,
          address: '서울 강남구 역삼동 456'
        },
        { 
          id: 'r3', 
          name: '선릉김밥천국', 
          lat: 37.5089, 
          lng: 127.0486,
          cuisine: '분식',
          priceRange: '₩',
          rating: 4.3,
          address: '서울 강남구 선릉로 789'
        },
        {
          id: 'r10',
          name: '테헤란 스시',
          lat: 37.5040,
          lng: 127.0426,
          cuisine: '일식',
          priceRange: '₩₩₩',
          rating: 4.8,
          address: '서울 강남구 테헤란로 234'
        },
        {
          id: 'r11',
          name: '강남 파스타',
          lat: 37.4980,
          lng: 127.0286,
          cuisine: '양식',
          priceRange: '₩₩',
          rating: 4.6,
          address: '서울 강남구 강남대로 567'
        }
      ]
    },
    {
      id: 2,
      title: '홍대 데이트 코스',
      curator: '홍대왕',
      curatorId: '2',
      count: 8,
      likes: 256,
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
      restaurants: [
        { 
          id: 'r4', 
          name: '홍대파스타', 
          lat: 37.5563, 
          lng: 126.9236,
          cuisine: '양식',
          priceRange: '₩₩',
          rating: 4.5,
          address: '서울 마포구 홍대입구역 123'
        },
        { 
          id: 'r5', 
          name: '상수동카페', 
          lat: 37.5479, 
          lng: 126.9221,
          cuisine: '카페',
          priceRange: '₩₩',
          rating: 4.7,
          address: '서울 마포구 상수동 456'
        },
        { 
          id: 'r6', 
          name: '합정브런치', 
          lat: 37.5497, 
          lng: 126.9146,
          cuisine: '브런치',
          priceRange: '₩₩₩',
          rating: 4.6,
          address: '서울 마포구 합정동 789'
        },
        {
          id: 'r12',
          name: '연남동 이자카야',
          lat: 37.5627,
          lng: 126.9255,
          cuisine: '일식',
          priceRange: '₩₩',
          rating: 4.4,
          address: '서울 마포구 연남동 234'
        }
      ]
    },
    {
      id: 3,
      title: '을지로 숨은 술집',
      curator: '을지로3가',
      curatorId: '3',
      count: 15,
      likes: 523,
      image: 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=400',
      restaurants: [
        { 
          id: 'r7', 
          name: '을지로포차', 
          lat: 37.5657, 
          lng: 126.9916,
          cuisine: '포차',
          priceRange: '₩₩',
          rating: 4.6,
          address: '서울 중구 을지로3가 123'
        },
        { 
          id: 'r8', 
          name: '노가리골목', 
          lat: 37.5662, 
          lng: 126.9908,
          cuisine: '포차',
          priceRange: '₩',
          rating: 4.5,
          address: '서울 중구 을지로 456'
        },
        { 
          id: 'r9', 
          name: '힙지로술집', 
          lat: 37.5668, 
          lng: 126.9924,
          cuisine: '술집',
          priceRange: '₩₩',
          rating: 4.7,
          address: '서울 중구 을지로 789'
        },
        {
          id: 'r13',
          name: '을지로 와인바',
          lat: 37.5655,
          lng: 126.9920,
          cuisine: '와인바',
          priceRange: '₩₩₩',
          rating: 4.8,
          address: '서울 중구 을지로 234'
        },
        {
          id: 'r14',
          name: '골목 이자카야',
          lat: 37.5670,
          lng: 126.9912,
          cuisine: '일식',
          priceRange: '₩₩',
          rating: 4.5,
          address: '서울 중구 을지로 567'
        }
      ]
    },
  ];

  // 맛잘알 큐레이터 샘플
  const topCurators = [
    { 
      id: 1, 
      name: '푸드파이터', 
      followers: 1523, 
      playlists: 23, 
      badge: '🏆',
      avatar: 'https://ui-avatars.com/api/?name=푸드파이터&size=150&background=FF6B6B&color=fff',
      expertise: '불맛 성지',
      topRestaurants: [
        { id: 'r10', name: '마라천국', lat: 37.5688, lng: 126.9292 },
        { id: 'r11', name: '화로상회', lat: 37.5010, lng: 127.0396 },
        { id: 'r12', name: '불타는닭갈비', lat: 37.5720, lng: 126.9850 },
      ]
    },
    { 
      id: 2, 
      name: '미슐랭헌터', 
      followers: 987, 
      playlists: 15, 
      badge: '⭐',
      avatar: 'https://ui-avatars.com/api/?name=미슐랭헌터&size=150&background=FFD93D&color=fff',
      expertise: '파인다이닝',
      topRestaurants: [
        { id: 'r13', name: '라연', lat: 37.5245, lng: 127.0283 },
        { id: 'r14', name: '밍글스', lat: 37.5267, lng: 127.0378 },
        { id: 'r15', name: '정식당', lat: 37.5233, lng: 127.0390 },
      ]
    },
    { 
      id: 3, 
      name: '로컬맛집왕', 
      followers: 756, 
      playlists: 31, 
      badge: '👑',
      avatar: 'https://ui-avatars.com/api/?name=로컬맛집왕&size=150&background=6C63FF&color=fff',
      expertise: '동네맛집',
      topRestaurants: [
        { id: 'r16', name: '할머니국수', lat: 37.5443, lng: 127.0556 },
        { id: 'r17', name: '시장순대국', lat: 37.5516, lng: 127.0736 },
        { id: 'r18', name: '동네백반집', lat: 37.5389, lng: 127.0821 },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                진짜 맛집
              </span>
              을 찾는 방법
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              광고와 가짜 리뷰에 지치셨나요?<br />
              진짜 맛잘알들이 큐레이션한 플레이리스트를 만나보세요
            </p>

            {/* 핵심 가치 */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700 font-medium">광고 없는 진짜 맛집</span>
              </div>
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">지도로 한눈에</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 font-medium">취향 공유</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/explore')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
                맛집 탐색
              </button>
              <button
                onClick={() => navigate('/create-playlist')}
                className="px-8 py-4 bg-white text-gray-700 rounded-full font-bold border-2 border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <PlusCircleIcon className="w-6 h-6" />
                플레이리스트 만들기
              </button>
              <button
                onClick={() => navigate('/discover')}
                className="px-8 py-4 bg-white text-gray-700 rounded-full font-bold border-2 border-gray-200 hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
              >
                <PlayIcon className="w-6 h-6" />
                둘러보기
              </button>
            </div>

            {/* 찐맛집 필터 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-orange-500" />
                찐맛집 필터
              </h3>
              <div className="flex flex-wrap gap-3">
                {realFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      selectedFilter === filter.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 인기 플레이리스트 */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">🔥 인기 플레이리스트</h2>
            <Link
              to="/discover"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              더보기 <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {popularPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/expert-playlist/${playlist.id}`)}
              >
                <div className="h-48 relative">
                  <img
                    src={playlist.image}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm">
                    {playlist.count}개 맛집
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{playlist.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>by {playlist.curator}</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      {Array.isArray(playlist.likes) ? playlist.likes.length : playlist.likes || 0}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 유명 유튜버/연예인 플레이리스트 */}
      <section className="px-6 py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">🎬 유명 유튜버/연예인 맛집</h2>
            <Link
              to="/celebrity-playlists"
              className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              더보기 <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'sung-si-kyung',
                name: '성시경',
                type: '가수/먹방',
                avatar: 'https://ui-avatars.com/api/?name=성시경&size=150&background=9333EA&color=fff',
                subscribers: '135만 구독자',
                title: '성시경이 극찬한 진짜 맛집',
                restaurants: [
                  { 
                    name: '성수 갈비집', 
                    area: '성수', 
                    description: '"갈비의 정석, 여기가 진짜다"',
                    realAddress: '서울 성동구 성수동2가 289-5'
                  },
                  { 
                    name: '마포 순대국', 
                    area: '마포', 
                    description: '"새벽에도 먹고 싶은 맛"',
                    realAddress: '서울 마포구 도화동 173-2'
                  },
                  { 
                    name: '서촌 해물탕', 
                    area: '서촌', 
                    description: '"해물의 신선함이 다르다"',
                    realAddress: '서울 종로구 통인동 16'
                  }
                ]
              },
              {
                id: 'baek-jong-won',
                name: '백종원',
                type: '요리연구가',
                avatar: 'https://ui-avatars.com/api/?name=백종원&size=150&background=F59E0B&color=fff',
                subscribers: '555만 구독자',
                title: '백종원이 인정한 숨은 맛집',
                restaurants: [
                  { 
                    name: '부암동 간장게장', 
                    area: '종로', 
                    description: '"간장게장의 교과서"',
                    realAddress: '서울 종로구 부암동 208-2'
                  },
                  { 
                    name: '성수 말자 식당', 
                    area: '성수', 
                    description: '"국물이 예술이다"',
                    realAddress: '서울 성동구 성수동1가 656-325'
                  },
                  { 
                    name: '망원 한정식', 
                    area: '망원', 
                    description: '"이 가격에 이 퀄리티?"',
                    realAddress: '서울 마포구 망원동 394-48'
                  }
                ]
              },
              {
                id: 'tzuyang',
                name: '쨔양',
                type: '먹방 유튜버',
                avatar: 'https://ui-avatars.com/api/?name=쨔양&size=150&background=EC4899&color=fff',
                subscribers: '1020만 구독자',
                title: '쨔양이 인정한 양 많고 맛있는 집',
                restaurants: [
                  { 
                    name: '광장시장 육회자매', 
                    area: '광장', 
                    description: '"육회 비빔밥 5그릇 클리어"',
                    realAddress: '서울 종로구 예지동 6-1'
                  },
                  { 
                    name: '종로 토속촌', 
                    area: '종로', 
                    description: '"삼계탕 5그릇 완식"',
                    realAddress: '서울 종로구 관훈동 16'
                  },
                  { 
                    name: '신촌 떡볶이 투킴', 
                    area: '신촌', 
                    description: '"떡볶이 10인분 완식"',
                    realAddress: '서울 서대문구 창천동 52-94'
                  }
                ]
              },
              {
                id: 'hamzy',
                name: '햄지',
                type: '먹방 유튜버',
                avatar: 'https://ui-avatars.com/api/?name=햄지&size=150&background=8B5CF6&color=fff',
                subscribers: '890만 구독자',
                title: '햄지가 사랑하는 ASMR 맛집',
                restaurants: [
                  { 
                    name: '강남 향미', 
                    area: '강남', 
                    description: '"짜장면 비주얼이 미쳤다"',
                    realAddress: '서울 강남구 역삼동 823-42'
                  },
                  { 
                    name: '성수 삼겹살', 
                    area: '성수', 
                    description: '"삼겹살 소리가 예술"',
                    realAddress: '서울 성동구 성수동 276-1'
                  },
                  { 
                    name: '여의도 스시오마카세', 
                    area: '여의도', 
                    description: '"한입 한입이 행복"',
                    realAddress: '서울 영등포구 여의도동 36-3'
                  }
                ]
              },
              {
                id: 'yoon-dookyung',
                name: '윤두경',  
                type: '작가/미식가',
                avatar: 'https://ui-avatars.com/api/?name=윤두경&size=150&background=10B981&color=fff',
                subscribers: 'SNS 팔로워 42만',
                title: '윤두경의 숨은 골목 맛집',
                restaurants: [
                  { 
                    name: '용산 삼각지 솔내음', 
                    area: '용산', 
                    description: '"이것이 진정한 한식"',
                    realAddress: '서울 용산구 효창동 5-92'
                  },
                  { 
                    name: '이촌동 톰에서', 
                    area: '이촌', 
                    description: '"파스타의 정석"',
                    realAddress: '서울 대전광역시 서구 둑산동'
                  },
                  { 
                    name: '한남동 오레노', 
                    area: '한남', 
                    description: '"미슐랭 못지않은 퀄리티"',
                    realAddress: '서울 용산구 한남동 683-134'
                  }
                ]
              },
              {
                id: 'matsuda',
                name: '마츠다',
                type: '일본인 먹방',
                avatar: 'https://ui-avatars.com/api/?name=마츠다&size=150&background=EF4444&color=fff',
                subscribers: '89만 구독자',
                title: '마츠다가 반한 한국 맛집',
                restaurants: [
                  { 
                    name: '을지로 노가리양꼬치', 
                    area: '을지로', 
                    description: '"이런 분위기는 일본에 없어"',
                    realAddress: '서울 중구 을지로3가 295'
                  },
                  { 
                    name: '이태원 부대찌개', 
                    area: '이태원', 
                    description: '"부대찌개의 원조"',
                    realAddress: '서울 용산구 이태원동 119-23'
                  },
                  { 
                    name: '강남 미나리', 
                    area: '강남', 
                    description: '"한우의 최고봉"',
                    realAddress: '서울 강남구 역삼동 823-42'
                  }
                ]
              }
            ].map((celeb) => (
              <motion.div
                key={celeb.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/celebrity-playlist/${celeb.id}`)}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="bg-white p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={celeb.avatar}
                        alt={celeb.name}
                        className="w-14 h-14 rounded-full ring-2 ring-purple-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{celeb.name}</h3>
                        <p className="text-xs text-gray-600">
                          {celeb.type} · {celeb.subscribers}
                        </p>
                      </div>
                      <span className="text-2xl">🎬</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="font-bold text-sm text-purple-700 mb-2">
                        {celeb.title}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {celeb.restaurants.map((rest, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2">
                          <div className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold text-sm">{idx + 1}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{rest.name}</span>
                                <span className="text-xs text-gray-500">({rest.area})</span>
                              </div>
                              <p className="text-xs text-gray-600 italic mt-1">
                                {rest.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t text-center">
                      <span className="text-xs text-purple-600 font-medium">
                        👉 전체 플레이리스트 보기
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 맛잘알 큐레이터 */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">👑 이주의 맛잘알</h2>
            <Link
              to="/curators"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              더보기 <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topCurators.map((curator) => (
              <motion.div
                key={curator.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/influencer/${curator.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={curator.avatar}
                      alt={curator.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-orange-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{curator.name}</h3>
                        <span className="text-2xl">{curator.badge}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {curator.followers.toLocaleString()} 팔로워
                      </p>
                      <p className="text-xs text-orange-600 font-medium mt-1">
                        {curator.expertise}
                      </p>
                    </div>
                  </div>
                  
                  {/* 최애 맛집 미리보기 */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">최애 맛집 TOP 3</p>
                    <div className="space-y-1">
                      {curator.topRestaurants.slice(0, 3).map((rest, idx) => (
                        <div key={rest.id} className="flex items-center gap-2 text-sm">
                          <span className="text-orange-500 font-bold">{idx + 1}</span>
                          <span className="text-gray-700">{rest.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-sm text-gray-600">
                      플레이리스트 {curator.playlists}개
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // 팔로우 기능
                      }}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      팔로우
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 게임 센터 섹션 */}
      <section className="px-6 py-16 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">🎮 음식 게임 센터</h2>
          <p className="text-xl mb-8 opacity-90">
            재미있는 게임으로 당신의 입맛을 찾아보세요!<br />
            MBTI, 점심 추천, 기분별 음식, VS 게임 등 다양한 게임이 준비되어 있습니다
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/game-hub')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              게임 센터 가기
            </button>
            <button
              onClick={() => navigate('/food-mbti')}
              className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-full font-bold hover:bg-white/30 transform hover:scale-105 transition-all"
            >
              MBTI 바로가기
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeMVP;