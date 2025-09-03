import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from '../utils/axios';
import { useAuthStore } from '../store/authStore';
import {
  PlusCircleIcon,
  BookmarkIcon,
  MapPinIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
  HeartIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface RestaurantList {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  isPublic: boolean;
  createdAt: string;
  restaurants?: number;
}

const MyLists: React.FC = () => {
  const { user } = useAuthStore();
  
  // API에서 플레이리스트 가져오기
  const { data: apiLists, isLoading } = useQuery({
    queryKey: ['my-playlists', user?._id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await axios.get(`/api/playlists/user/${user._id}`);
        return response.data;
      } catch (error) {
        console.log('API 호출 실패, 로컬 데이터 사용');
        return [];
      }
    },
    enabled: !!user
  });
  
  // 로컬 스토리지에서 플레이리스트 가져오기
  const [localLists, setLocalLists] = useState<any[]>([]);
  
  useEffect(() => {
    const savedLists = localStorage.getItem('localPlaylists');
    if (savedLists) {
      setLocalLists(JSON.parse(savedLists));
    }
  }, []);
  
  // API 데이터와 로컬 데이터 합치기
  const combinedLists = [...(apiLists || []), ...localLists];
  
  // 기본 예시 데이터 (플레이리스트가 없을 때만 표시)
  const [exampleLists] = useState<RestaurantList[]>([
    {
      id: '1',
      name: '데이트 맛집',
      description: '분위기 좋은 로맨틱한 장소들',
      icon: '💑',
      count: 12,
      isPublic: true,
      createdAt: '2024-01-15',
      restaurants: 12
    },
    {
      id: '2',
      name: '혼밥 성지',
      description: '혼자 가기 좋은 편안한 곳',
      icon: '🍜',
      count: 8,
      isPublic: false,
      createdAt: '2024-01-20',
      restaurants: 8
    },
    {
      id: '3',
      name: '도쿄 여행 맛집',
      description: '다음 여행때 꼭 가볼 곳들',
      icon: '🇯🇵',
      count: 15,
      isPublic: true,
      createdAt: '2024-02-01',
      restaurants: 15
    },
    {
      id: '4',
      name: '매운맛 도전',
      description: '매운 음식 좋아하는 사람들을 위한',
      icon: '🌶️',
      count: 6,
      isPublic: true,
      createdAt: '2024-02-10',
      restaurants: 6
    },
    {
      id: '5',
      name: '브런치 카페',
      description: '주말 브런치 맛집 모음',
      icon: '☕',
      count: 10,
      isPublic: false,
      createdAt: '2024-02-15',
      restaurants: 10
    }
  ]);

  const popularCities = [
    { name: '서울', flag: '🇰🇷', count: 234 },
    { name: '도쿄', flag: '🇯🇵', count: 156 },
    { name: '뉴욕', flag: '🇺🇸', count: 89 },
    { name: '파리', flag: '🇫🇷', count: 67 },
    { name: '방콕', flag: '🇹🇭', count: 45 },
    { name: '런던', flag: '🇬🇧', count: 38 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">내 맛집 리스트</h1>
              <p className="text-gray-600">맛집을 테마별로 정리하고 공유해보세요</p>
            </div>
            <Link
              to="/create-playlist"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>새 리스트 만들기</span>
            </Link>
          </div>
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookmarkIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">51</p>
                <p className="text-sm text-gray-600">저장한 맛집</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">내 리스트</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">128</p>
                <p className="text-sm text-gray-600">팔로워</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <HeartIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-gray-600">받은 좋아요</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 리스트 그리드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {(combinedLists.length > 0 ? combinedLists : exampleLists).map((list, index) => (
            <motion.div
              key={list._id || list.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              <Link to={`/playlist/${list._id || list.id}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{list.icon}</div>
                    <div className="flex items-center gap-1">
                      {list.isPublic ? (
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          공개
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          비공개
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {list.title || list.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{list.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {list.restaurantCount || list.count || 0}곳
                      </span>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                </div>
              </Link>
              
              <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-600 hover:text-orange-600 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-600 hover:text-red-600 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(list.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </motion.div>
          ))}
          
          {/* 새 리스트 추가 카드 */}
          <Link
            to="/create-playlist"
            className="bg-white/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all flex items-center justify-center min-h-[200px] group"
          >
            <div className="text-center">
              <PlusCircleIcon className="w-12 h-12 text-gray-400 group-hover:text-orange-500 mx-auto mb-3 transition-colors" />
              <p className="text-gray-600 group-hover:text-orange-600 font-medium transition-colors">
                새 리스트 만들기
              </p>
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default MyLists;