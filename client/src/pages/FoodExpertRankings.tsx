import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import {
  TrophyIcon,
  FireIcon,
  StarIcon,
  UserIcon,
  HeartIcon,
  BookmarkIcon,
  MapPinIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolidIcon } from '@heroicons/react/24/solid';
import { getDefaultAvatar } from '../utils/avatars';
import toast from 'react-hot-toast';

interface ExpertUser {
  rank: number;
  userId: string;
  username: string;
  profileImage?: string;
  bio?: string;
  level: number;
  points: number;
  restaurantsAdded: number;
  listsCreated: number;
  totalLikes: number;
  totalSaves: number;
  badges?: Array<{ name: string; icon: string }>;
}

const FoodExpertRankings: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('한식');
  const [rankings, setRankings] = useState<ExpertUser[]>([]);
  const [allCategoryRankings, setAllCategoryRankings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'category' | 'overview'>('category');

  const foodCategories = [
    { name: '한식', emoji: '🍚' },
    { name: '중식', emoji: '🥟' },
    { name: '일식', emoji: '🍱' },
    { name: '양식', emoji: '🍝' },
    { name: '카페', emoji: '☕' },
    { name: '디저트', emoji: '🍰' },
    { name: '분식', emoji: '🍜' },
    { name: '치킨', emoji: '🍗' },
    { name: '피자', emoji: '🍕' },
    { name: '버거', emoji: '🍔' },
    { name: '아시안', emoji: '🍛' },
    { name: '회/초밥', emoji: '🍣' },
    { name: '고기', emoji: '🥩' },
    { name: '면요리', emoji: '🍝' },
    { name: '술집', emoji: '🍺' },
    { name: '카레', emoji: '🍛' },
    { name: '냉면', emoji: '🥶' },
    { name: '제육', emoji: '🥘' },
    { name: '삼겹살', emoji: '🥓' }
  ];

  useEffect(() => {
    if (viewMode === 'category') {
      fetchCategoryRankings();
    } else {
      fetchAllCategoryRankings();
    }
  }, [selectedCategory, viewMode]);

  const fetchCategoryRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rankings/category/${selectedCategory}`);
      setRankings(response.data.rankings || []);
    } catch (error) {
      console.error('랭킹 조회 실패:', error);
      // 더미 데이터
      setRankings(generateDummyRankings(selectedCategory));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategoryRankings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/rankings/all-categories');
      setAllCategoryRankings(response.data.rankings || {});
    } catch (error) {
      console.error('전체 랭킹 조회 실패:', error);
      // 더미 데이터
      setAllCategoryRankings(generateDummyAllRankings());
    } finally {
      setLoading(false);
    }
  };

  const generateDummyRankings = (category: string): ExpertUser[] => {
    const dummyUsers = [
      { username: '맛집왕', bio: `${category} 맛집 전문가입니다`, level: 87, points: 8750 },
      { username: '푸드파이터', bio: '매일 새로운 맛집 탐방중', level: 75, points: 7520 },
      { username: '미식가', bio: '진짜 맛집만 추천해드립니다', level: 68, points: 6830 },
      { username: '맛스타그램', bio: 'SNS 맛집 인플루언서', level: 62, points: 6200 },
      { username: '로컬맛집러', bio: '숨은 로컬 맛집 발굴가', level: 55, points: 5540 }
    ];

    return dummyUsers.map((user, index) => ({
      rank: index + 1,
      userId: `user${index + 1}`,
      username: user.username,
      bio: user.bio,
      level: user.level,
      points: user.points,
      restaurantsAdded: Math.floor(Math.random() * 50) + 10,
      listsCreated: Math.floor(Math.random() * 20) + 5,
      totalLikes: Math.floor(Math.random() * 500) + 100,
      totalSaves: Math.floor(Math.random() * 300) + 50,
      badges: getBadgesForLevel(user.level, category)
    }));
  };

  const generateDummyAllRankings = () => {
    const result: any = {};
    ['한식', '중식', '일식', '양식', '카페'].forEach(category => {
      result[category] = generateDummyRankings(category).slice(0, 3);
    });
    return result;
  };

  const getBadgesForLevel = (level: number, category: string) => {
    const badges = [];
    if (level >= 10) badges.push({ name: `${category} 입문자`, icon: '🌱' });
    if (level >= 30) badges.push({ name: `${category} 애호가`, icon: '❤️' });
    if (level >= 50) badges.push({ name: `${category} 전문가`, icon: '⭐' });
    if (level >= 70) badges.push({ name: `${category} 마스터`, icon: '👑' });
    if (level >= 90) badges.push({ name: `${category} 레전드`, icon: '🏆' });
    return badges;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default: return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrophySolidIcon className="w-8 h-8 text-orange-500" />
              맛잘알 랭킹
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('category')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'category'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                카테고리별
              </button>
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'overview'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                전체 요약
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'category' ? (
        <>
          {/* 카테고리 선택 */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {foodCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition ${
                      selectedCategory === cat.name
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 랭킹 리스트 */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory} 맛잘알 TOP 랭킹
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedCategory} 맛집을 가장 잘 아는 전문가들입니다
              </p>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">랭킹을 불러오는 중...</p>
                  </div>
                ) : (
                  rankings.map((user, index) => (
                    <motion.div
                      key={user.userId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`rounded-2xl shadow-lg overflow-hidden ${getRankColor(user.rank)}`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* 순위 */}
                          <div className="flex-shrink-0">
                            <div className="text-center">
                              {getRankIcon(user.rank) ? (
                                <div className="text-4xl mb-1">{getRankIcon(user.rank)}</div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700">
                                  {user.rank}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 프로필 이미지 */}
                          <img
                            src={user.profileImage || getDefaultAvatar(user.username)}
                            alt={user.username}
                            className="w-16 h-16 rounded-full border-4 border-white shadow-md cursor-pointer"
                            onClick={() => navigate(`/profile/${user.userId}`)}
                          />

                          {/* 사용자 정보 */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className="text-xl font-bold cursor-pointer hover:underline"
                                  onClick={() => navigate(`/profile/${user.userId}`)}
                                >
                                  {user.username}
                                </h3>
                                <p className="text-sm opacity-90 mt-1">{user.bio}</p>

                                {/* 배지 */}
                                {user.badges && user.badges.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {user.badges.map((badge, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs"
                                      >
                                        <span>{badge.icon}</span>
                                        <span>{badge.name}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* 레벨 & 포인트 */}
                              <div className="text-right">
                                <div className="text-2xl font-bold">Lv.{user.level}</div>
                                <div className="text-sm opacity-90">{user.points}P</div>
                              </div>
                            </div>

                            {/* 통계 */}
                            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/20">
                              <div className="text-center">
                                <div className="text-lg font-bold">{user.restaurantsAdded}</div>
                                <div className="text-xs opacity-75">맛집 등록</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{user.listsCreated}</div>
                                <div className="text-xs opacity-75">리스트</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{user.totalLikes}</div>
                                <div className="text-xs opacity-75">받은 좋아요</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">{user.totalSaves}</div>
                                <div className="text-xs opacity-75">받은 저장</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      ) : (
        /* 전체 요약 뷰 */
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">카테고리별 TOP 맛잘알</h2>
            <p className="text-gray-600 mt-1">각 음식 카테고리의 최고 전문가들</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(allCategoryRankings).map(([category, users]: [string, any]) => {
              const categoryData = foodCategories.find(c => c.name === category);
              return (
                <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{categoryData?.emoji}</span>
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                  </div>
                  <div className="space-y-3">
                    {users.map((user: ExpertUser) => (
                      <div
                        key={user.userId}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/profile/${user.userId}`)}
                      >
                        <span className="text-lg font-bold text-gray-400">
                          {getRankIcon(user.rank) || `#${user.rank}`}
                        </span>
                        <img
                          src={user.profileImage || getDefaultAvatar(user.username)}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">Lv.{user.level}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodExpertRankings;