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
  PlusIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  EyeIcon,
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
  discount?: { percentage: number; store: string; };
}

const MobileCommunity: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allPosts] = useState<CommunityPost[]>([
    // 레시피 포스트들
    {
      id: '1',
      type: 'recipe',
      title: '백종원 김치찌개 황금레시피',
      content: '고기 먼저 볶는게 포인트! 김치는 꼭 묵은지로',
      author: {
        id: 'user1',
        name: '집밥고수',
        avatar: '🍳',
        level: '요리 전문가',
        isVerified: true,
      },
      category: '레시피',
      tags: ['김치찌개', '백종원', '한식'],
      images: [getCommunityImage('recipe', 0)],
      likes: 3421,
      comments: 234,
      saves: 1892,
      views: 15678,
      createdAt: '1시간 전',
      isLiked: false,
      isSaved: false,
      difficulty: '초급',
      cookTime: '20분',
      servings: 2,
      ingredients: ['돼지고기 200g', '김치 1컵', '두부 반모', '파 1대', '고춧가루 1큰술'],
    },
    {
      id: '2',
      type: 'recipe',
      title: '5분 완성 계란볶음밥',
      content: '자취생 필수 레시피! 밥은 찬밥이 최고',
      author: {
        id: 'user2',
        name: '자취9년차',
        avatar: '🍚',
        level: '생존요리사',
        isVerified: false,
      },
      category: '레시피',
      tags: ['볶음밥', '자취요리', '간단요리'],
      images: [getCommunityImage('recipe', 1)],
      likes: 892,
      comments: 45,
      saves: 678,
      views: 3456,
      createdAt: '3시간 전',
      isLiked: true,
      isSaved: false,
      difficulty: '초급',
      cookTime: '5분',
      servings: 1,
    },
    {
      id: '3',
      type: 'recipe',
      title: '에어프라이어 치킨 완벽 재현',
      content: '튀기지 않고도 바삭바삭! 비법 소스 레시피 포함',
      author: {
        id: 'user3',
        name: '에프마스터',
        avatar: '🍗',
        level: '에어프라이어 신',
        isVerified: true,
      },
      category: '레시피',
      tags: ['에어프라이어', '치킨', '다이어트'],
      images: [getCommunityImage('recipe', 2)],
      likes: 5678,
      comments: 456,
      saves: 3421,
      views: 28901,
      createdAt: '5시간 전',
      isLiked: false,
      isSaved: true,
      difficulty: '중급',
      cookTime: '40분',
    },
    // 꿀팁 포스트들
    {
      id: '4',
      type: 'tip',
      title: '양파 썰 때 눈물 안나는 방법',
      content: '냉동실에 10분만! 또는 물에 담가두기',
      author: {
        id: 'user4',
        name: '주방해결사',
        avatar: '🧅',
        level: '팁 마스터',
        isVerified: true,
      },
      category: '꿀팁',
      tags: ['양파', '손질법', '꿀팁'],
      likes: 2341,
      comments: 123,
      saves: 1567,
      views: 8901,
      createdAt: '2시간 전',
      isLiked: true,
      isSaved: false,
    },
    {
      id: '5',
      type: 'tip',
      title: '새우 내장 10초만에 빼는법',
      content: '이쑤시개 하나면 끝! 두번째 마디에 찔러서 빼기',
      author: {
        id: 'user5',
        name: '손질의달인',
        avatar: '🦐',
        level: '요리 팁스터',
        isVerified: false,
      },
      category: '꿀팁',
      tags: ['새우', '손질', '해산물'],
      likes: 1823,
      comments: 89,
      saves: 1234,
      views: 6789,
      createdAt: '4시간 전',
      isLiked: false,
      isSaved: true,
    },
    {
      id: '6',
      type: 'tip',
      title: '고기 부드럽게 만드는 비법',
      content: '배즙이나 파인애플즙 30분! 질긴 고기도 부드러워져요',
      author: {
        id: 'user6',
        name: '육식마왕',
        avatar: '🥩',
        level: '고기 전문가',
        isVerified: true,
      },
      category: '꿀팁',
      tags: ['고기', '연육', '요리팁'],
      likes: 3456,
      comments: 234,
      saves: 2341,
      views: 12345,
      createdAt: '6시간 전',
      isLiked: false,
      isSaved: false,
    },
    // 음식 조합 포스트들
    {
      id: '7',
      type: 'combination',
      title: '민트초코 논란 종결 조합',
      content: '민초+맥주 = 의외의 꿀조합?! 한번 도전해보세요',
      author: {
        id: 'user7',
        name: '조합의신',
        avatar: '🍫',
        level: '미각 탐험가',
        isVerified: false,
      },
      category: '조합',
      tags: ['민트초코', '이색조합', '논란종결'],
      likes: 567,
      comments: 456,
      saves: 123,
      views: 3456,
      createdAt: '1시간 전',
      isLiked: false,
      isSaved: false,
    },
    {
      id: '8',
      type: 'combination',
      title: '치킨엔 콜라? NO! 사이다+레몬',
      content: '느끼함 싹 잡아주는 최고의 조합',
      author: {
        id: 'user8',
        name: '치킨러버',
        avatar: '🍗',
        level: '치킨 소믈리에',
        isVerified: true,
      },
      category: '조합',
      tags: ['치킨', '음료', '꿀조합'],
      likes: 4567,
      comments: 345,
      saves: 2345,
      views: 18976,
      createdAt: '3시간 전',
      isLiked: true,
      isSaved: true,
    },
    // 할인 정보 포스트들
    {
      id: '9',
      type: 'deal',
      title: '이마트 1+1 대박행사',
      content: '오늘까지! 농심 라면 전품목 1+1',
      author: {
        id: 'user9',
        name: '할인헌터',
        avatar: '💰',
        level: '세일 마스터',
        isVerified: true,
      },
      category: '할인',
      tags: ['이마트', '1+1', '라면'],
      images: [getCommunityImage('deal', 0)],
      likes: 8901,
      comments: 567,
      saves: 6789,
      views: 45678,
      createdAt: '방금',
      isLiked: false,
      isSaved: true,
      discount: { percentage: 50, store: '이마트' },
    },
    {
      id: '10',
      type: 'deal',
      title: 'GS25 도시락 2+1 행사',
      content: '점심 저녁 해결! 모든 도시락 2+1',
      author: {
        id: 'user10',
        name: '편의점달인',
        avatar: '🏪',
        level: '편의점 전문가',
        isVerified: false,
      },
      category: '할인',
      tags: ['GS25', '도시락', '2+1'],
      likes: 3456,
      comments: 234,
      saves: 2890,
      views: 15678,
      createdAt: '2시간 전',
      isLiked: true,
      isSaved: false,
      discount: { percentage: 33, store: 'GS25' },
    },
  ]);

  // 카테고리별 필터링
  const posts = selectedCategory === 'all' 
    ? allPosts 
    : allPosts.filter(post => {
        switch(selectedCategory) {
          case 'recipe': return post.type === 'recipe';
          case 'tip': return post.type === 'tip';
          case 'combination': return post.type === 'combination';
          case 'deal': return post.type === 'deal';
          default: return true;
        }
      });

  const categories = [
    { id: 'all', label: '전체', icon: '✨', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'recipe', label: '레시피', icon: '📖', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'tip', label: '꿀팁', icon: '💡', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'combination', label: '조합', icon: '🔥', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'deal', label: '할인', icon: '🏷️', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  ];

  const trendingTags = ['라면꿀팁', '에어프라이어', '1인가구', '자취요리', '백종원'];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'recipe': return 'bg-blue-100 text-blue-700';
      case 'tip': return 'bg-green-100 text-green-700';
      case 'combination': return 'bg-purple-100 text-purple-700';
      case 'deal': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'recipe': return '레시피';
      case 'tip': return '꿀팁';
      case 'combination': return '조합';
      case 'deal': return '할인';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">커뮤니티</h1>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 검색바 */}
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-3"
            >
              <input
                type="text"
                placeholder="레시피, 팁, 할인 정보 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm"
              />
            </motion.div>
          )}

          {/* 카테고리 스크롤 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                    selectedCategory === category.id
                      ? `${category.color} text-white shadow-lg scale-105`
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 태그 */}
        <div className="px-4 pb-2 border-t">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 py-2">
              {trendingTags.map(tag => (
                <span
                  key={tag}
                  className="flex-shrink-0 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="px-4 py-4 space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* 포스트 헤더 */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{post.author.name}</span>
                      {post.author.isVerified && (
                        <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{post.createdAt}</span>
                      <span>·</span>
                      <span>{post.author.level}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                  {getTypeLabel(post.type)}
                </span>
              </div>

              {/* 포스트 내용 */}
              <h3 className="font-bold text-base mb-1">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{post.content}</p>

              {/* 이미지 */}
              {post.images && post.images.length > 0 && (
                <div className="mb-3 -mx-4">
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* 메타 정보 */}
              <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
                {post.type === 'recipe' && post.difficulty && (
                  <>
                    <span className="flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" />
                      {post.difficulty}
                    </span>
                    {post.cookTime && (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {post.cookTime}
                      </span>
                    )}
                    {post.servings && (
                      <span className="flex items-center gap-1">
                        <BookOpenIcon className="w-3 h-3" />
                        {post.servings}인분
                      </span>
                    )}
                  </>
                )}
                {post.discount && (
                  <span className="flex items-center gap-1 text-red-600 font-bold">
                    <TagIcon className="w-3 h-3" />
                    {post.discount.percentage}% 할인
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-3 h-3" />
                  {post.views.toLocaleString()}
                </span>
              </div>

              {/* 레시피 재료 표시 */}
              {post.type === 'recipe' && post.ingredients && (
                <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs font-semibold text-orange-700 mb-1">재료</p>
                  <p className="text-xs text-gray-600">{post.ingredients.join(', ')}</p>
                </div>
              )}

              {/* 태그 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1">
                    {post.isLiked ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-600">{post.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-600">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1">
                    {post.isSaved ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-orange-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-600">{post.saves}</span>
                  </button>
                </div>
                <button>
                  <ShareIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 플로팅 작성 버튼 */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center z-40">
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileCommunity;