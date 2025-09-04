import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  FireIcon,
  SparklesIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  HeartIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  location: string;
  priceRange: string;
  visitCount?: number;
  lastVisit?: string;
  tags: string[];
}

interface FoodList {
  id: string;
  name: string;
  description: string;
  restaurants: Restaurant[];
  isPublic: boolean;
  likes: number;
  createdAt: string;
}

interface UserActivity {
  id: string;
  type: 'review' | 'visit' | 'list';
  restaurant?: string;
  content?: string;
  rating?: number;
  date: string;
}

interface UserProfileData {
  id: string;
  username: string;
  profileImage: string;
  bio: string;
  tasteProfile: string;
  tasteStats: {
    spicy: number;
    sweet: number;
    adventure: number;
    healthy: number;
  };
  location: string;
  joinedDate: string;
  stats: {
    reviews: number;
    lists: number;
    visits: number;
    followers: number;
  };
  favoriteRestaurants: Restaurant[];
  recentVisits: Restaurant[];
  foodLists: FoodList[];
  activities: UserActivity[];
}

// 샘플 데이터
const mockUserProfile: UserProfileData = {
  id: '1',
  username: '김미식',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  bio: '맛있는 음식과 함께하는 행복한 일상 🍽️ 매운 음식 없이는 못 살아요!',
  tasteProfile: '모험적인 미식가',
  tasteStats: {
    spicy: 85,
    sweet: 45,
    adventure: 90,
    healthy: 60
  },
  location: '강남/서초',
  joinedDate: '2024.01',
  stats: {
    reviews: 156,
    lists: 12,
    visits: 342,
    followers: 89
  },
  favoriteRestaurants: [
    {
      id: '1',
      name: '교대이층집',
      category: '한식',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      location: '강남구 서초동',
      priceRange: '₩₩',
      visitCount: 15,
      lastVisit: '3일 전',
      tags: ['매운맛', '혼밥가능', '웨이팅']
    },
    {
      id: '2',
      name: '스시오마카세',
      category: '일식',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      location: '강남구 청담동',
      priceRange: '₩₩₩₩',
      visitCount: 8,
      lastVisit: '1주일 전',
      tags: ['오마카세', '예약필수', '특별한날']
    },
    {
      id: '3',
      name: '성수 베이커리',
      category: '베이커리',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
      location: '성동구 성수동',
      priceRange: '₩',
      visitCount: 23,
      lastVisit: '어제',
      tags: ['브런치', '디저트', '커피']
    }
  ],
  recentVisits: [
    {
      id: '4',
      name: '한남 파스타',
      category: '양식',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop',
      location: '용산구 한남동',
      priceRange: '₩₩₩',
      visitCount: 1,
      lastVisit: '오늘',
      tags: ['파스타', '와인', '데이트']
    },
    {
      id: '5',
      name: '이태원 타코',
      category: '멕시칸',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
      location: '용산구 이태원동',
      priceRange: '₩₩',
      visitCount: 2,
      lastVisit: '2일 전',
      tags: ['타코', '맥주', '분위기']
    }
  ],
  foodLists: [
    {
      id: '1',
      name: '강남 매운맛 성지',
      description: '진짜 매운맛을 찾는 당신을 위한 리스트',
      restaurants: [],
      isPublic: true,
      likes: 234,
      createdAt: '2024.03.15'
    },
    {
      id: '2',
      name: '혼밥하기 좋은 곳',
      description: '혼자서도 편하게 즐길 수 있는 맛집들',
      restaurants: [],
      isPublic: true,
      likes: 189,
      createdAt: '2024.02.28'
    },
    {
      id: '3',
      name: '데이트 코스 맛집',
      description: '분위기 좋고 맛도 좋은 데이트 장소',
      restaurants: [],
      isPublic: false,
      likes: 98,
      createdAt: '2024.01.20'
    }
  ],
  activities: [
    {
      id: '1',
      type: 'review',
      restaurant: '교대이층집',
      content: '여전히 맛있어요! 매운 갈비찜 최고',
      rating: 5,
      date: '3일 전'
    },
    {
      id: '2',
      type: 'visit',
      restaurant: '성수 베이커리',
      date: '어제'
    },
    {
      id: '3',
      type: 'list',
      content: '새로운 리스트 "브런치 카페 모음" 생성',
      date: '1주일 전'
    }
  ]
};

const UserProfile: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData>(mockUserProfile);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'lists' | 'activity'>('restaurants');
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedLists, setLikedLists] = useState<string[]>([]);

  useEffect(() => {
    // username으로 프로필 데이터 로드
    // 실제로는 API 호출
    console.log('Loading profile for:', username);
  }, [username]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? '팔로우를 취소했습니다' : '팔로우했습니다');
  };

  const handleMatchRequest = () => {
    toast.success('매칭 신청을 보냈습니다! 🍽️');
  };

  const handleLikeList = (listId: string) => {
    if (likedLists.includes(listId)) {
      setLikedLists(likedLists.filter(id => id !== listId));
      toast.success('좋아요를 취소했습니다');
    } else {
      setLikedLists([...likedLists, listId]);
      toast.success('좋아요를 눌렀습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold">{profile.username}님의 프로필</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={profile.profileImage}
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-100"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
                  <p className="text-purple-600 font-medium mb-2">{profile.tasteProfile}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {profile.joinedDate} 가입
                    </span>
                  </div>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-gray-700 mb-4">{profile.bio}</p>
              )}

              {/* 통계 */}
              <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.reviews}</div>
                  <div className="text-xs text-gray-500">리뷰</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.lists}</div>
                  <div className="text-xs text-gray-500">리스트</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.visits}</div>
                  <div className="text-xs text-gray-500">방문</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profile.stats.followers}</div>
                  <div className="text-xs text-gray-500">팔로워</div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleFollow}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
                <button
                  onClick={handleMatchRequest}
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-md transition-all"
                >
                  매칭 신청
                </button>
                <button
                  onClick={() => navigate(`/chat/${profile.id}`)}
                  className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 취향 차트 */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">취향 프로필</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">🌶️ 매운맛</div>
                <div className="relative h-20 bg-white rounded-md overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-red-400 to-red-300"
                    style={{ height: `${profile.tasteStats.spicy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {profile.tasteStats.spicy}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">🍰 단맛</div>
                <div className="relative h-20 bg-white rounded-md overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-pink-400 to-pink-300"
                    style={{ height: `${profile.tasteStats.sweet}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {profile.tasteStats.sweet}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">🚀 모험</div>
                <div className="relative h-20 bg-white rounded-md overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-400 to-purple-300"
                    style={{ height: `${profile.tasteStats.adventure}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {profile.tasteStats.adventure}%
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">🥗 건강</div>
                <div className="relative h-20 bg-white rounded-md overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-300"
                    style={{ height: `${profile.tasteStats.healthy}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                    {profile.tasteStats.healthy}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg p-1 shadow-sm mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'restaurants'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              맛집
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'lists'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              리스트
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'activity'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              활동
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            {/* 자주 가는 맛집 */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-500" />
                자주 가는 맛집
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.favoriteRestaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="relative h-40">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                      {restaurant.visitCount && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {restaurant.visitCount}회 방문
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-1">{restaurant.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {restaurant.category} · {restaurant.location} · {restaurant.priceRange}
                      </p>
                      {restaurant.lastVisit && (
                        <p className="text-xs text-purple-600 mb-2">
                          마지막 방문: {restaurant.lastVisit}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {restaurant.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 최근 방문 */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                최근 방문
              </h3>
              <div className="space-y-3">
                {profile.recentVisits.map((restaurant) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex gap-4"
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">{restaurant.name}</h4>
                          <p className="text-sm text-gray-500">
                            {restaurant.category} · {restaurant.location}
                          </p>
                          <p className="text-xs text-purple-600 mt-1">
                            {restaurant.lastVisit} 방문
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.foodLists.map((list) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{list.name}</h4>
                    <p className="text-sm text-gray-600">{list.description}</p>
                  </div>
                  {!list.isPublic && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      비공개
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{list.createdAt}</span>
                    <span className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      {Array.isArray(list.likes) ? list.likes.length : list.likes || 0}
                    </span>
                  </div>
                  <button
                    onClick={() => handleLikeList(list.id)}
                    className={`p-2 rounded-lg transition-all ${
                      likedLists.includes(list.id)
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {likedLists.includes(list.id) ? (
                      <HeartSolidIcon className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            {profile.activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                {activity.type === 'review' && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <StarIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">리뷰 작성</span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">{activity.restaurant}</span>
                    </p>
                    {activity.content && (
                      <p className="text-sm text-gray-600">{activity.content}</p>
                    )}
                    {activity.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < (activity.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activity.type === 'visit' && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">
                      <span className="font-semibold">{activity.restaurant}</span> 방문
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{activity.date}</span>
                  </div>
                )}
                
                {activity.type === 'list' && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BookmarkIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">{activity.content}</span>
                    <span className="text-xs text-gray-500 ml-auto">{activity.date}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;