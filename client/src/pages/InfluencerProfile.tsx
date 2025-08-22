import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  StarIcon,
  FireIcon,
  CalendarIcon,
  UserGroupIcon,
  PlayIcon,
  ChartBarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  HeartIcon as HeartSolid
} from '@heroicons/react/24/solid';
import KoreanMap from '../components/KoreanMap';
import { Restaurant } from '../types';

interface RestaurantData {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  rating: number;
  image: string;
  coordinates: { lat: number; lng: number };
  priceRange: string;
  visitCount?: number;
  isFavorite?: boolean;
  lastVisited?: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  restaurantCount: number;
  totalLikes: number;
  createdAt: string;
  restaurants: RestaurantData[];
}

interface InfluencerData {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  bio: string;
  stats: {
    followers: number;
    playlists: number;
    reviews: number;
    visits: number;
  };
  expertType: string;
  verifiedBadge: boolean;
  joinedDate: string;
  favoriteRestaurants: RestaurantData[];
  playlists: Playlist[];
  recentActivity: {
    type: 'review' | 'playlist' | 'visit';
    restaurant: string;
    date: string;
  }[];
}

const InfluencerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'activity'>('playlists');
  const [showMap, setShowMap] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // 샘플 인플루언서 데이터
  const [influencer] = useState<InfluencerData>({
    id: '1',
    name: '김미식',
    username: '@kimfoodie',
    profileImage: 'https://ui-avatars.com/api/?name=김미식&size=200&background=FF6B6B&color=fff',
    bio: '🔥 매운 음식 전문가 | 🍜 국물요리 마스터 | 📍 서울 전지역 맛집 탐방 3년차',
    stats: {
      followers: 15234,
      playlists: 28,
      reviews: 342,
      visits: 1256
    },
    expertType: '불맛 소방관',
    verifiedBadge: true,
    joinedDate: '2021-03-15',
    favoriteRestaurants: [
      {
        id: '1',
        name: '화로상회',
        address: '서울 강남구 역삼동 123-45',
        cuisine: '바베큐',
        rating: 4.9,
        image: 'https://picsum.photos/400/300?random=1',
        coordinates: { lat: 37.5010, lng: 127.0396 },
        priceRange: '₩₩₩',
        visitCount: 23,
        isFavorite: true,
        lastVisited: '2024-03-15'
      },
      {
        id: '2',
        name: '매운탕의 전설',
        address: '서울 마포구 합정동 456-78',
        cuisine: '해산물',
        rating: 4.8,
        image: 'https://picsum.photos/400/300?random=2',
        coordinates: { lat: 37.5497, lng: 126.9146 },
        priceRange: '₩₩',
        visitCount: 18,
        isFavorite: true,
        lastVisited: '2024-03-10'
      },
      {
        id: '3',
        name: '불타는 닭갈비',
        address: '서울 종로구 익선동 234-56',
        cuisine: '닭갈비',
        rating: 4.7,
        image: 'https://picsum.photos/400/300?random=3',
        coordinates: { lat: 37.5720, lng: 126.9850 },
        priceRange: '₩₩',
        visitCount: 15,
        isFavorite: true,
        lastVisited: '2024-03-08'
      },
      {
        id: '4',
        name: '청양고추 파라다이스',
        address: '서울 용산구 이태원동 345-67',
        cuisine: '퓨전한식',
        rating: 4.6,
        image: 'https://picsum.photos/400/300?random=4',
        coordinates: { lat: 37.5340, lng: 126.9948 },
        priceRange: '₩₩₩',
        visitCount: 12,
        isFavorite: true,
        lastVisited: '2024-03-05'
      },
      {
        id: '5',
        name: '마라천국',
        address: '서울 서대문구 연희동 567-89',
        cuisine: '중식',
        rating: 4.9,
        image: 'https://picsum.photos/400/300?random=5',
        coordinates: { lat: 37.5688, lng: 126.9292 },
        priceRange: '₩₩',
        visitCount: 20,
        isFavorite: true,
        lastVisited: '2024-03-18'
      }
    ],
    playlists: [
      {
        id: '1',
        title: '🔥 불맛 성지 TOP 10',
        description: '서울에서 가장 매운 맛집들만 엄선했습니다',
        coverImage: 'https://picsum.photos/400/300?random=10',
        restaurantCount: 10,
        totalLikes: 523,
        createdAt: '2024-03-01',
        restaurants: [
          {
            id: '1',
            name: '화로상회',
            address: '서울 강남구 역삼동 123-45',
            cuisine: '바베큐',
            rating: 4.9,
            image: 'https://picsum.photos/400/300?random=11',
            coordinates: { lat: 37.5010, lng: 127.0396 },
            priceRange: '₩₩₩'
          },
          {
            id: '6',
            name: '숯불갈비 명가',
            address: '서울 강남구 청담동 678-90',
            cuisine: '갈비',
            rating: 4.8,
            image: 'https://picsum.photos/400/300?random=12',
            coordinates: { lat: 37.5193, lng: 127.0471 },
            priceRange: '₩₩₩₩'
          },
          {
            id: '7',
            name: '매운갈비찜 본점',
            address: '서울 송파구 잠실동 234-56',
            cuisine: '갈비찜',
            rating: 4.7,
            image: 'https://picsum.photos/400/300?random=13',
            coordinates: { lat: 37.5145, lng: 127.1059 },
            priceRange: '₩₩₩'
          }
        ]
      },
      {
        id: '2',
        title: '🍜 국물요리 끝판왕',
        description: '속 시원한 국물요리 맛집 모음',
        coverImage: 'https://picsum.photos/400/300?random=20',
        restaurantCount: 8,
        totalLikes: 412,
        createdAt: '2024-02-15',
        restaurants: [
          {
            id: '2',
            name: '매운탕의 전설',
            address: '서울 마포구 합정동 456-78',
            cuisine: '해산물',
            rating: 4.8,
            image: 'https://picsum.photos/400/300?random=21',
            coordinates: { lat: 37.5497, lng: 126.9146 },
            priceRange: '₩₩'
          },
          {
            id: '8',
            name: '해장국 천국',
            address: '서울 종로구 종로3가 345-67',
            cuisine: '해장국',
            rating: 4.6,
            image: 'https://picsum.photos/400/300?random=22',
            coordinates: { lat: 37.5704, lng: 126.9918 },
            priceRange: '₩'
          }
        ]
      },
      {
        id: '3',
        title: '🌶️ 마라 성애자 필수코스',
        description: '마라 덕후들을 위한 진짜 마라 맛집',
        coverImage: 'https://picsum.photos/400/300?random=30',
        restaurantCount: 12,
        totalLikes: 689,
        createdAt: '2024-01-20',
        restaurants: [
          {
            id: '5',
            name: '마라천국',
            address: '서울 서대문구 연희동 567-89',
            cuisine: '중식',
            rating: 4.9,
            image: 'https://picsum.photos/400/300?random=31',
            coordinates: { lat: 37.5688, lng: 126.9292 },
            priceRange: '₩₩'
          },
          {
            id: '9',
            name: '사천요리 전문점',
            address: '서울 강북구 수유동 456-78',
            cuisine: '중식',
            rating: 4.7,
            image: 'https://picsum.photos/400/300?random=32',
            coordinates: { lat: 37.6388, lng: 127.0247 },
            priceRange: '₩₩'
          }
        ]
      }
    ],
    recentActivity: [
      { type: 'review', restaurant: '화로상회', date: '2024-03-18' },
      { type: 'playlist', restaurant: '불맛 성지 TOP 10', date: '2024-03-17' },
      { type: 'visit', restaurant: '마라천국', date: '2024-03-16' }
    ]
  });

  // 현재 표시할 레스토랑 목록 결정
  const getDisplayRestaurants = (): RestaurantData[] => {
    if (selectedPlaylist) {
      return selectedPlaylist.restaurants;
    }
    return influencer.favoriteRestaurants;
  };

  // Restaurant 타입으로 변환
  const convertToRestaurantType = (restaurants: RestaurantData[]): Restaurant[] => {
    return restaurants.map(r => ({
      _id: r.id,
      name: r.name,
      address: r.address,
      roadAddress: r.address,
      coordinates: r.coordinates,
      category: r.cuisine,
      subCategory: r.cuisine,
      priceRange: r.priceRange,
      images: [{
        url: r.image,
        uploadedBy: influencer.name,
        uploadedAt: new Date().toISOString()
      }],
      phoneNumber: '',
      businessHours: {},
      averageRating: r.rating,
      reviewCount: 0,
      tags: [],
      dnaProfile: {
        atmosphere: [],
        foodStyle: [],
        instagramability: 0,
        dateSpot: 0,
        groupFriendly: 0,
        soloFriendly: 0
      },
      menuItems: [],
      features: [],
      createdBy: {
        _id: influencer.id,
        username: influencer.username,
        email: `${influencer.username}@bobmap.com`,
        trustScore: 100,
        followerCount: influencer.stats.followers,
        followingCount: 0,
        visitedRestaurantsCount: influencer.stats.visits,
        createdAt: influencer.joinedDate,
        updatedAt: new Date().toISOString()
      } as any,
      verifiedBy: [],
      isVerified: true,
      viewCount: 0,
      saveCount: 0,
      savedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/local-experts')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">인플루언서 프로필</h1>
          </div>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-6">
            <img
              src={influencer.profileImage}
              alt={influencer.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{influencer.name}</h2>
                {influencer.verifiedBadge && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    ✓ 인증됨
                  </span>
                )}
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium">
                  {influencer.expertType}
                </span>
              </div>
              <p className="text-gray-500 mb-3">{influencer.username}</p>
              <p className="text-gray-700 mb-4">{influencer.bio}</p>
              
              {/* 통계 */}
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-bold">{influencer.stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">팔로워</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{influencer.stats.playlists}</div>
                  <div className="text-sm text-gray-500">플레이리스트</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{influencer.stats.reviews}</div>
                  <div className="text-sm text-gray-500">리뷰</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{influencer.stats.visits}</div>
                  <div className="text-sm text-gray-500">방문</div>
                </div>
              </div>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex flex-col gap-2">
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow">
                팔로우
              </button>
              <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                공유
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'playlists'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              플레이리스트 ({influencer.playlists.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              최애 맛집 ({influencer.favoriteRestaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              최근 활동
            </button>
            
            {/* 지도 토글 */}
            <div className="ml-auto flex items-center gap-2 py-4">
              <span className="text-sm text-gray-500">지도 보기</span>
              <button
                onClick={() => setShowMap(!showMap)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showMap ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showMap ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={showMap ? 'grid lg:grid-cols-2 gap-6' : ''}>
          {/* 지도 */}
          {showMap && (
            <div className="lg:sticky lg:top-[145px] h-[600px]">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">
                    {selectedPlaylist 
                      ? `${selectedPlaylist.title} (${selectedPlaylist.restaurants.length}개)`
                      : `${influencer.name}님의 최애 맛집 (${influencer.favoriteRestaurants.length}개)`
                    }
                  </h3>
                  {selectedPlaylist && (
                    <button
                      onClick={() => setSelectedPlaylist(null)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                    >
                      ← 전체 최애 맛집 보기
                    </button>
                  )}
                </div>
                <KoreanMap
                  restaurants={convertToRestaurantType(getDisplayRestaurants())}
                  className="w-full h-[calc(100%-60px)]"
                />
              </div>
            </div>
          )}

          {/* 리스트 */}
          <div className={!showMap ? 'max-w-4xl mx-auto' : ''}>
            {activeTab === 'playlists' && (
              <div className="space-y-4">
                {influencer.playlists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <div className="flex">
                      <img
                        src={playlist.coverImage}
                        alt={playlist.title}
                        className="w-48 h-32 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{playlist.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{playlist.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="w-4 h-4" />
                                {playlist.restaurantCount}개 맛집
                              </span>
                              <span className="flex items-center gap-1">
                                <HeartIcon className="w-4 h-4" />
                                {playlist.totalLikes}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(playlist.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/expert-playlist/${playlist.id}`);
                            }}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <PlayIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid gap-4">
                {influencer.favoriteRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-48 h-32 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                              {restaurant.isFavorite && (
                                <HeartSolid className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine} · {restaurant.priceRange}</p>
                            <p className="text-gray-500 text-sm mb-3">{restaurant.address}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <StarSolid className="w-4 h-4 text-yellow-500" />
                                {restaurant.rating}
                              </span>
                              {restaurant.visitCount && (
                                <span className="text-gray-500">
                                  방문 {restaurant.visitCount}회
                                </span>
                              )}
                              {restaurant.lastVisited && (
                                <span className="text-gray-500">
                                  최근 방문: {new Date(restaurant.lastVisited).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-orange-500">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {influencer.recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'review' ? 'bg-blue-100' :
                        activity.type === 'playlist' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {activity.type === 'review' && <StarIcon className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'playlist' && <BookmarkIcon className="w-5 h-5 text-green-600" />}
                        {activity.type === 'visit' && <MapPinIcon className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.type === 'review' && `${activity.restaurant}에 리뷰를 남겼습니다`}
                          {activity.type === 'playlist' && `"${activity.restaurant}" 플레이리스트를 만들었습니다`}
                          {activity.type === 'visit' && `${activity.restaurant}를 방문했습니다`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;