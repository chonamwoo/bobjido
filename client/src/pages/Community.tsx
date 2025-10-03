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
import { getCommunityImage, getAvatarColor, getPostVisual, getRealFoodImage } from '../utils/communityImages';
import CommunityPostModal from '../components/CommunityPostModal';

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
  steps?: { order: number; description: string; image?: string; tip?: string; warning?: string }[];
  discount?: { percentage: number; store: string; validUntil: string; description?: string };
  detailedContent?: string;
  additionalTips?: string[];
  tipDetails?: { summary: string };
  detailedSteps?: { title: string; description: string; warning?: string }[];
}

const Community: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('trending');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
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
      images: [],
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
      ingredients: ['라면 1개', '계란 1개', '대파 1/2대', '김치 100g', '청양고추 1개 (선택)', '치즈 1장 (선택)'],
      steps: [
        { order: 1, description: '물 550ml를 정확히 계량해서 냄비에 붓습니다. 너무 많으면 싱겁고, 너무 적으면 짜집니다.', tip: '종이컵으로 3컵 정도가 550ml입니다' },
        { order: 2, description: '물이 끓기 시작하면 스프를 먼저 넣고 젓가락으로 잘 풀어줍니다. 이렇게 하면 면에 간이 골고루 배어듭니다.' },
        { order: 3, description: '면을 넣고 타이머를 2분 30초로 맞춥니다. 1분이 지나면 면을 한 번 뒤집어 줍니다.', tip: '쫄깃한 면을 원하면 2분, 부드러운 면을 원하면 3분' },
        { order: 4, description: '남은 30초가 되면 계란을 넣습니다. 반숙을 원하면 그대로, 완숙을 원하면 1분 더 끓입니다.' },
        { order: 5, description: '불을 끄고 썰어둔 파와 김치를 올립니다. 취향에 따라 치즈를 올려도 좋습니다.' }
      ],
      detailedContent: '백종원 셰프가 방송에서 공개한 황금 레시피입니다. 핵심은 스프를 먼저 넣는 것! 이렇게 하면 면에 간이 배어들어 훨씬 맛있습니다. 또한 정확한 물의 양과 시간을 지키는 것이 중요합니다. 계란은 취향에 따라 반숙 또는 완숙으로 조절하세요.',
      additionalTips: [
        '물 대신 육수를 사용하면 더욱 깊은 맛이 납니다',
        '버터를 조금 넣으면 고소한 맛이 더해집니다',
        '삶은 계란보다 수란을 만들어 올리면 더 고급스럽습니다',
        '김치는 신김치를 사용하면 더 맛있습니다'
      ],
    },
    {
      id: '2',
      type: 'tip',
      title: '새우 손질 10초 완성법',
      content: '레스토랑 셰프들이 사용하는 새우 손질법. 이쑤시개 하나로 내장을 깔끔하게 제거하는 방법',
      tipDetails: {
        summary: '이쑤시개를 새우 등 두 번째 마디에 찔러 넣고 위로 살짝 들어올리면 내장이 한 번에 빠집니다'
      },
      detailedContent: '새우 손질이 어렵다고 생각하시나요? 전문 셰프들이 사용하는 이 방법을 알면 누구나 10초 만에 새우를 완벽하게 손질할 수 있습니다. 칼로 등을 가르는 번거로운 작업 없이, 이쑤시개 하나만으로 깔끔하게 내장을 제거하는 비법을 알려드립니다.',
      detailedSteps: [
        {
          title: '새우 준비하기',
          description: '새우를 찬물에 헹구고 키친타올로 물기를 제거합니다. 냉동 새우는 미리 해동해주세요.',
          warning: '뜨거운 물로 해동하면 새우가 익어버립니다'
        },
        {
          title: '이쑤시개 위치 잡기',
          description: '새우의 머리에서 두 번째 마디를 찾습니다. 등 쪽에서 마디 사이의 틈이 보이는 곳입니다.'
        },
        {
          title: '내장 빼내기',
          description: '이쑤시개를 살짝 비스듬히 찔러 넣은 후, 위로 천천히 들어올립니다. 검은 내장이 따라 올라옵니다.',
          warning: '너무 깊이 찌르면 새우가 부서질 수 있습니다'
        },
        {
          title: '마무리 확인',
          description: '내장이 완전히 제거되었는지 확인합니다. 남은 부분이 있다면 같은 방법으로 한 번 더 시도합니다.'
        }
      ],
      additionalTips: [
        '손질한 새우는 소금물에 헹구면 더 깨끗해집니다',
        '레몬즙을 뿌리면 비린내가 제거됩니다',
        '요리 직전에 손질하는 것이 신선도 유지에 좋습니다'
      ],
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
      images: [],
      likes: 567,
      comments: 123,
      saves: 234,
      views: 2345,
      createdAt: '1일 전',
      isLiked: false,
      isSaved: true,
      detailedContent: '치킨에는 콜라가 정석이라고 생각하시나요? 제가 발견한 이 조합을 한번 시도해보세요. 사이다의 탄산이 기름기를 싹 잡아주고, 레몬즙이 입안을 개운하게 만들어줍니다. 특히 양념치킨이나 후라이드치킨과 잘 어울립니다!',
      additionalTips: [
        '사이다는 꼭 제로콜라가 아닌 일반 사이다로',
        '레몬즙은 생레몬을 짜서 사용하면 더 상큼합니다',
        '치킨을 먹기 전에 음료를 한 모금 마시고 시작하세요',
        '피클과 함께 먹으면 더욱 맛있습니다'
      ],
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
      detailedContent: '알리오올리오는 가장 단순하면서도 가장 어려운 파스타입니다. 재료가 단순할수록 기술이 중요하죠. 미슐랭 스타 셰프에게 직접 배운 비법을 공개합니다. 핵심은 파스타 면수와 올리브오일의 유화입니다!',
      ingredients: [
        '스파게티 200g',
        '엑스트라 버진 올리브오일 80ml',
        '마늘 4쪽',
        '페페론치노 1개 (선택)',
        '이탈리안 파슬리 한줄',
        '파르미지아노 치즈 (선택)',
        '굵은소금',
        '후추'
      ],
      steps: [
        {
          order: 1,
          description: '큰 냄비에 물을 끓입니다. 물 1L당 굵은소금 10g을 넣습니다.',
          tip: '바닷물 정도의 짠맛이 나야 합니다'
        },
        {
          order: 2,
          description: '마늘을 옆면으로 얇게 자릅니다. 너무 얇으면 탈 수 있으니 2mm 정도가 적당합니다.'
        },
        {
          order: 3,
          description: '차가운 팬에 올리브오일과 마늘을 넣고 약한 불에서 천천히 볶습니다.',
          tip: '마늘이 노릇해질 때까지 기다립니다. 갈색이 되면 안 됩니다!'
        },
        {
          order: 4,
          description: '물이 끓으면 파스타를 넣고 설명서보다 1분 적게 삶습니다.',
          warning: '알 덴테로 마무리할 것이므로 약간 덜 익히는 것이 포인트'
        },
        {
          order: 5,
          description: '파스타가 익는 동안 면수 한 국자를 따로 보관합니다. 이것이 유화의 핵심입니다.'
        },
        {
          order: 6,
          description: '파스타가 익으면 불을 끄고 마늘 팬에 파스타를 넣습니다.',
          tip: '불을 끄는 것이 중요합니다!'
        },
        {
          order: 7,
          description: '면수를 조금씩 넣으면서 빠르게 저어 유화시킵니다. 크림 같은 질감이 되면 성공!',
          tip: '한 번에 많이 넣으면 유화가 깨집니다'
        },
        {
          order: 8,
          description: '파슬리를 넣고 마무리합니다. 취향에 따라 파르미지아노나 페페론치노를 추가합니다.'
        }
      ],
      additionalTips: [
        '파스타 면은 두께 1.6mm 정도가 가장 좋습니다',
        '올리브오일은 꼭 엑스트라 버진을 사용하세요',
        '파슬리가 없다면 바질로 대체 가능합니다',
        '매운맛을 원한다면 페페론치노를 꼭 넣어보세요'
      ],
    },
  ]);

  const categories = [
    { id: 'all', label: '전체', icon: SparklesIcon },
    { id: 'recipe', label: '레시피', icon: BookOpenIcon },
    { id: 'tip', label: '조리 팁', icon: LightBulbIcon },
    { id: 'combination', label: '음식 조합', icon: FireIcon },
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
              레시피, 조리 팁, 음식 조합을 공유하는 공간
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="레시피, 팁, 음식 조합 검색..."
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

            {/* Posts Grid - 이미지 겹침 방지 */}
            <div className="space-y-8">
              {sortedPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow isolate"
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
                         post.type === 'combination' ? '음식조합' : '기타'}
                      </span>
                    </div>

                    {/* Post Content - 클릭 가능하게 수정 */}
                    <div
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPost(post)}
                    >
                      <h3 className="text-xl font-bold mb-2 hover:text-orange-600 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                    </div>

                    {/* 실제 음식 이미지 - 겹침 방지 처리 */}
                    <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getRealFoodImage(post.type, post.title)}
                        alt={post.title}
                        className="w-full h-48 object-cover relative z-0"
                        loading="lazy"
                        onError={(e) => {
                          // 이미지 로드 실패시 폴백
                          const target = e.target as HTMLImageElement;
                          target.src = getCommunityImage(post.type, parseInt(post.id) - 1);
                        }}
                      />
                    </div>

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
                          <span className="text-sm">{Array.isArray(post.likes) ? post.likes.length : post.likes || 0}</span>
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

      {/* Post Detail Modal */}
      {selectedPost && (
        <CommunityPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={() => handleLike(selectedPost.id)}
          onSave={() => handleSave(selectedPost.id)}
        />
      )}
    </div>
  );
};

export default Community;