import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FireIcon,
  BookOpenIcon,
  LightBulbIcon,
  TagIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ShareIcon,
  ClockIcon,
  CheckBadgeIcon,
  TrophyIcon,
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { getCommunityImage, getAvatarColor } from '../utils/communityImages';

interface CommunityPost {
  id: string;
  type: 'recipe' | 'tip' | 'combination' | 'deal' | 'review';
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: string;
    isVerified: boolean;
  };
  category: string;
  tags: string[];
  images?: string[];
  video?: string;
  likes: number;
  comments: number;
  saves: number;
  views: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
  difficulty?: '초급' | '중급' | '고급';
  cookTime?: string;
  servings?: number;
  ingredients?: string[];
  steps?: { order: number; description: string; image?: string }[];
  discount?: { percentage: number; store: string; validUntil: string };
}

const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('trending');
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      type: 'recipe',
      title: '백종원도 극찬한 라면 끓이는 꿀팁',
      content: '라면을 더 맛있게 끓이는 비법을 공개합니다. 면을 넣기 전 스프를 먼저 풀고, 물이 끓을 때 계란을 넣으면...',
      author: {
        id: 'user1',
        name: '라면마스터',
        avatar: '🍜',
        level: '라면 소믈리에',
        isVerified: true,
      },
      category: '레시피',
      tags: ['라면', '꿀팁', '백종원', '인스턴트'],
      images: [getCommunityImage('recipe', 0)],
      likes: 1234,
      comments: 89,
      saves: 456,
      views: 5678,
      createdAt: '2시간 전',
      isLiked: false,
      isSaved: false,
      difficulty: '초급',
      cookTime: '5분',
      servings: 1,
      ingredients: ['라면 1개', '계란 1개', '파 조금', '김치 약간'],
      steps: [
        { order: 1, description: '물 550ml를 끓인다' },
        { order: 2, description: '스프를 먼저 넣고 잘 푼다' },
        { order: 3, description: '면을 넣고 2분 30초 끓인다' },
        { order: 4, description: '계란을 넣고 30초 더 끓인다' },
      ],
    },
    {
      id: '2',
      type: 'tip',
      title: '새우 손질 10초 완성법',
      content: '레스토랑 셰프들이 사용하는 새우 손질법. 이쑤시개 하나로 내장을 깔끔하게 제거하는 방법',
      author: {
        id: 'user2',
        name: '요리왕비룡',
        avatar: '👨‍🍳',
        level: '마스터 셰프',
        isVerified: true,
      },
      category: '조리 팁',
      tags: ['새우', '손질법', '요리팁', '해산물'],
      video: 'video_url_here',
      likes: 892,
      comments: 45,
      saves: 678,
      views: 3456,
      createdAt: '5시간 전',
      isLiked: true,
      isSaved: false,
      difficulty: '중급',
    },
    {
      id: '3',
      type: 'combination',
      title: '치킨+콜라 말고 이거 드세요',
      content: '치킨과 찰떡궁합인 의외의 음료 조합. 치킨 + 사이다 + 레몬즙의 환상적인 조화!',
      author: {
        id: 'user3',
        name: '먹방BJ',
        avatar: '🍗',
        level: '음식 큐레이터',
        isVerified: false,
      },
      category: '음식 조합',
      tags: ['치킨', '음료', '조합', '꿀조합'],
      images: [getCommunityImage('combination', 0)],
      likes: 567,
      comments: 123,
      saves: 234,
      views: 2345,
      createdAt: '1일 전',
      isLiked: false,
      isSaved: true,
    },
    {
      id: '4',
      type: 'deal',
      title: '이마트 1+1 행사 총정리',
      content: '이번 주 이마트 전국 매장 1+1 행사 상품 총정리. 라면, 과자, 음료 등 필수템 할인 정보',
      author: {
        id: 'user4',
        name: '할인헌터',
        avatar: '💰',
        level: '세일 마스터',
        isVerified: false,
      },
      category: '할인 정보',
      tags: ['이마트', '1+1', '할인', '세일'],
      images: [getCommunityImage('deal', 0)],
      likes: 2341,
      comments: 89,
      saves: 1892,
      views: 8901,
      createdAt: '3시간 전',
      isLiked: false,
      isSaved: false,
      discount: { percentage: 50, store: '이마트', validUntil: '2025-01-25' },
    },
    {
      id: '5',
      type: 'recipe',
      title: '미슐랭 셰프의 파스타 비법',
      content: '집에서도 레스토랑 퀄리티 파스타 만들기. 알리오올리오의 진짜 비법 공개',
      author: {
        id: 'user5',
        name: '이탈리아셰프',
        avatar: '🍝',
        level: '미슐랭 셰프',
        isVerified: true,
      },
      category: '레시피',
      tags: ['파스타', '이탈리안', '미슐랭', '알리오올리오'],
      images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'],
      likes: 3456,
      comments: 234,
      saves: 2134,
      views: 12345,
      createdAt: '6시간 전',
      isLiked: true,
      isSaved: true,
      difficulty: '고급',
      cookTime: '20분',
      servings: 2,
    },
  ]);

  const categories = [
    { id: 'all', label: '전체', icon: SparklesIcon },
    { id: 'recipe', label: '레시피', icon: BookOpenIcon },
    { id: 'tip', label: '조리 팁', icon: LightBulbIcon },
    { id: 'combination', label: '음식 조합', icon: FireIcon },
    { id: 'deal', label: '할인 정보', icon: TagIcon },
  ];

  const trendingTags = [
    '라면꿀팁', '에어프라이어', '다이어트', '1인가구', '자취요리',
    '백종원레시피', '간편요리', '혼술안주', '브런치', '야식',
  ];

  const handleLike = (postId: string) => {
    setAllPosts(allPosts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setAllPosts(allPosts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved, saves: post.isSaved ? post.saves - 1 : post.saves + 1 }
        : post
    ));
  };

  const filteredPosts = allPosts.filter(post => {
    if (selectedCategory !== 'all' && post.type !== selectedCategory) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'latest') {
      return b.id.localeCompare(a.id);
    } else if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else {
      return b.views - a.views;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">푸드 커뮤니티</h1>
            <p className="text-xl opacity-90 mb-8">
              레시피, 조리 팁, 음식 조합, 할인 정보를 공유하는 공간
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="레시피, 팁, 할인 정보 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-12 py-4 rounded-full text-gray-900 placeholder-gray-500"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow">
                  검색
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Write Button - Floating */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40">
        <PlusIcon className="w-6 h-6" />
      </button>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">카테고리</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map(tag => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('trending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    sortBy === 'trending' ? 'bg-orange-100 text-orange-600' : 'bg-white'
                  }`}
                >
                  트렌딩
                </button>
                <button
                  onClick={() => setSortBy('latest')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    sortBy === 'latest' ? 'bg-orange-100 text-orange-600' : 'bg-white'
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    sortBy === 'popular' ? 'bg-orange-100 text-orange-600' : 'bg-white'
                  }`}
                >
                  인기순
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                필터
              </button>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
              {sortedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.name}</span>
                            {post.author.isVerified && (
                              <CheckBadgeIcon className="w-5 h-5 text-blue-500" />
                            )}
                            <span className="text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full">
                              {post.author.level}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{post.createdAt}</span>
                        </div>
                      </div>
                      
                      {/* Post Type Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.type === 'recipe' ? 'bg-blue-100 text-blue-700' :
                        post.type === 'tip' ? 'bg-green-100 text-green-700' :
                        post.type === 'combination' ? 'bg-purple-100 text-purple-700' :
                        post.type === 'deal' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {post.type === 'recipe' ? '레시피' :
                         post.type === 'tip' ? '조리팁' :
                         post.type === 'combination' ? '음식조합' :
                         post.type === 'deal' ? '할인정보' : '기타'}
                      </span>
                    </div>

                    {/* Post Content */}
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>

                    {/* Images/Video */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Recipe Details */}
                    {post.type === 'recipe' && post.difficulty && (
                      <div className="flex gap-4 mb-4 text-sm">
                        <span className="flex items-center gap-1">
                          <TrophyIcon className="w-4 h-4 text-gray-400" />
                          난이도: {post.difficulty}
                        </span>
                        {post.cookTime && (
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            {post.cookTime}
                          </span>
                        )}
                        {post.servings && (
                          <span className="flex items-center gap-1">
                            <BookOpenIcon className="w-4 h-4 text-gray-400" />
                            {post.servings}인분
                          </span>
                        )}
                      </div>
                    )}

                    {/* Discount Info */}
                    {post.discount && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-600">
                            {post.discount.percentage}% 할인
                          </span>
                          <span className="text-sm text-gray-600">
                            {post.discount.store} | ~{post.discount.validUntil}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          {post.isLiked ? (
                            <HeartSolidIcon className="w-5 h-5 text-red-500" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button
                          onClick={() => handleSave(post.id)}
                          className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                        >
                          {post.isSaved ? (
                            <BookmarkSolidIcon className="w-5 h-5 text-orange-500" />
                          ) : (
                            <BookmarkIcon className="w-5 h-5" />
                          )}
                          <span className="text-sm">{post.saves}</span>
                        </button>
                      </div>
                      <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                        <ShareIcon className="w-5 h-5" />
                        <span className="text-sm">공유</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Top Contributors */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">이주의 인기 작성자</h3>
              <div className="space-y-4">
                {[
                  { name: '라면마스터', posts: 42, followers: 1234, avatar: '🍜' },
                  { name: '요리왕비룡', posts: 38, followers: 892, avatar: '👨‍🍳' },
                  { name: '할인헌터', posts: 31, followers: 567, avatar: '💰' },
                  { name: '이탈리아셰프', posts: 28, followers: 445, avatar: '🍝' },
                  { name: '에어프라이어신', posts: 25, followers: 334, avatar: '🍟' },
                ].map((author, index) => (
                  <div key={author.name} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                      {author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{author.name}</div>
                      <div className="text-xs text-gray-500">
                        {author.posts}개 포스트 · {author.followers}명
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;