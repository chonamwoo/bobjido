import React, { useState, useEffect } from 'react';
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
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { getCommunityImage, getAvatarColor, getPostVisual, getRealFoodImage } from '../utils/communityImages';
import CommunityPostModal from '../components/CommunityPostModal';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

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
  commentList?: Comment[];
  saves: number;
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

const MobileCommunity: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSharePost, setSelectedSharePost] = useState<any>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  // 실제 사용자 데이터 로드
  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = () => {
    try {
      // 프로필에서 사용하는 실제 팔로잉과 팔로워 데이터 가져오기
      const userDataRaw = localStorage.getItem('userData') || localStorage.getItem('bobmap_user_data');

      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        const followingUserDetails = userData.followingUserDetails || [];
        const followerDetails = userData.followerDetails || [];

        const allConnectedUsers = [];

        // 팔로잉 중인 사용자들 추가
        if (followingUserDetails.length > 0) {
          const followingUsers = followingUserDetails.map((user: any) => ({
            id: user._id || user.id || `following_${Math.random().toString(36).substr(2, 9)}`,
            name: user.username || user.name || '사용자',
            avatar: user.profileImage || user.avatar || '👤',
            type: 'following'
          }));
          allConnectedUsers.push(...followingUsers);
        }

        // 팔로워들 추가
        if (followerDetails.length > 0) {
          const followers = followerDetails.map((user: any) => ({
            id: user._id || user.id || `follower_${Math.random().toString(36).substr(2, 9)}`,
            name: user.username || user.name || '사용자',
            avatar: user.profileImage || user.avatar || '👤',
            type: 'follower'
          }));
          allConnectedUsers.push(...followers);
        }

        // 중복 제거 (같은 사용자가 팔로잉과 팔로워 둘 다인 경우)
        const uniqueUsers = allConnectedUsers.reduce((acc: any[], current: any) => {
          const existingUser = acc.find(user => user.name === current.name);
          if (!existingUser) {
            acc.push(current);
          } else if (current.type === 'following' && existingUser.type === 'follower') {
            // 팔로잉 관계를 우선으로 표시
            existingUser.type = 'mutual';
          }
          return acc;
        }, []);

        setAvailableUsers(uniqueUsers);
        console.log('Loaded connected users (following + followers):', uniqueUsers);
      } else {
        // userData가 없는 경우
        setAvailableUsers([]);
      }
    } catch (error) {
      console.error('Failed to load connected users:', error);
      setAvailableUsers([]);
    }
  };

  // localStorage에서 데이터 불러오기
  const getStoredData = (key: string) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  // 실제 저장된 댓글 개수 가져오기
  const getActualCommentCount = (postId: string) => {
    try {
      const comments = localStorage.getItem(`comments_${postId}`);
      if (comments) {
        const parsed = JSON.parse(comments);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  // localStorage에 데이터 저장
  const saveStoredData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      console.error('Failed to save to localStorage');
    }
  };

  const handleLike = (postId: string) => {
    const likedPosts = getStoredData('likedPosts');
    const postLikes = getStoredData('postLikes');

    const isCurrentlyLiked = likedPosts[postId] || false;

    // 좋아요 상태 토글
    likedPosts[postId] = !isCurrentlyLiked;

    // 좋아요 수 업데이트
    if (!postLikes[postId]) postLikes[postId] = 0;
    postLikes[postId] = isCurrentlyLiked ? Math.max(0, postLikes[postId] - 1) : postLikes[postId] + 1;

    saveStoredData('likedPosts', likedPosts);
    saveStoredData('postLikes', postLikes);

    setAllPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isLiked: !isCurrentlyLiked, likes: postLikes[postId] }
        : post
    ));

    // 모달이 열려있으면 선택된 포스트도 업데이트
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, isLiked: !isCurrentlyLiked, likes: postLikes[postId] } : null);
    }
  };

  // 공유 기능
  const handleShare = (post: any) => {
    setSelectedSharePost(post);
    setShowShareModal(true);
  };

  const sendShareMessage = () => {
    if (selectedUsers.length > 0 && selectedSharePost) {
      // 선택된 사용자들에게 메시지 보내기
      const shareData = {
        type: 'community_share',
        post: selectedSharePost,
        message: shareMessage,
        sharedBy: '사용자',
        timestamp: new Date().toISOString()
      };

      // localStorage에 메시지 저장
      selectedUsers.forEach(userId => {
        const userMessages = JSON.parse(localStorage.getItem(`messages_${userId}`) || '[]');
        userMessages.push(shareData);
        localStorage.setItem(`messages_${userId}`, JSON.stringify(userMessages));
      });

      // 성공 메시지 - 실제 사용자 이름 표시
      const selectedUserNames = selectedUsers.map(userId => {
        const user = availableUsers.find(u => u.id === userId);
        return user ? user.name : userId;
      });

      alert(`${selectedUserNames.join(', ')} 등 ${selectedUsers.length}명에게 공유했습니다!`);
      setShowShareModal(false);
      setSelectedUsers([]);
      setShareMessage('');
      setSelectedSharePost(null);
    }
  };

  const handleSave = (postId: string) => {
    const savedPosts = getStoredData('savedPosts');
    const postSaves = getStoredData('postSaves');

    const isCurrentlySaved = savedPosts[postId] || false;

    // 저장 상태 토글
    savedPosts[postId] = !isCurrentlySaved;

    // 저장 수 업데이트
    if (!postSaves[postId]) postSaves[postId] = 0;
    postSaves[postId] = isCurrentlySaved ? Math.max(0, postSaves[postId] - 1) : postSaves[postId] + 1;

    saveStoredData('savedPosts', savedPosts);
    saveStoredData('postSaves', postSaves);

    setAllPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isSaved: !isCurrentlySaved, saves: postSaves[postId] }
        : post
    ));

    // 모달이 열려있으면 선택된 포스트도 업데이트
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, isSaved: !isCurrentlySaved, saves: postSaves[postId] } : null);
    }
  };

  const handleCommentAdd = (postId: string, comment: any) => {
    // 실제 댓글 개수를 localStorage에서 가져와서 업데이트
    const actualCount = getActualCommentCount(postId);

    // 게시물 댓글 수 업데이트
    setAllPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comments: actualCount } : p
    ));
  };

  const handlePostClick = (post: CommunityPost) => {
    setSelectedPost(post);
  };

  const [allPosts, setAllPosts] = useState<CommunityPost[]>([
    // 레시피 포스트들
    {
      id: '1',
      type: 'recipe',
      title: '백종원 김치찌개 황금레시피',
      content: '새우젓과 된장이 비법! 고기 잡내 없는 깨끗한 김치찌개',
      author: {
        id: 'user1',
        name: '집밥고수',
        avatar: '🍳',
        level: '요리 전문가',
        isVerified: true,
      },
      category: '레시피',
      tags: ['김치찌개', '백종원', '한식'],
      images: [],
      likes: getStoredData('postLikes')['1'] || 0,
      comments: getActualCommentCount('1'),
      commentList: [
        {
          id: 'c1-1',
          author: { id: 'u2', name: '요리초보', avatar: '😅' },
          content: '오 진짜 맛있게 나왔어요! 감사합니다',
          createdAt: '30분 전',
          likes: 12,
          isLiked: false
        },
        {
          id: 'c1-2',
          author: { id: 'u3', name: '김치러버', avatar: '🥰' },
          content: '묵은지 사용하니까 정말 다르네요',
          createdAt: '1시간 전',
          likes: 8,
          isLiked: true,
          replies: [
            {
              id: 'c1-2-1',
              author: { id: 'user1', name: '집밥고수', avatar: '🍳' },
              content: '네, 묵은지가 포인트에요!',
              createdAt: '45분 전',
              likes: 3,
              isLiked: false
            }
          ]
        },
        {
          id: 'c1-3',
          author: { id: 'u4', name: '맛집헌터', avatar: '🔍' },
          content: '고기는 어떤 부위 쓰시나요?',
          createdAt: '2시간 전',
          likes: 5,
          isLiked: false
        },
        {
          id: 'c1-4',
          author: { id: 'u5', name: '한식러버', avatar: '🍲' },
          content: '내일 당장 해먹어야겠어요 ㅋㅋ',
          createdAt: '3시간 전',
          likes: 15,
          isLiked: false
        },
        {
          id: 'c1-5',
          author: { id: 'u6', name: '주부님9단', avatar: '👩' },
          content: '두부 넣어도 맛있어요!',
          createdAt: '4시간 전',
          likes: 7,
          isLiked: true
        }
      ],
      saves: getStoredData('postSaves')['1'] || 0,
      createdAt: '1시간 전',
      isLiked: getStoredData('likedPosts')['1'] || false,
      isSaved: getStoredData('savedPosts')['1'] || false,
      difficulty: '초급',
      cookTime: '20분',
      servings: 2,
      ingredients: ['돼지고기 350g', '신김치 한포기', '설탕 1스푼', '고춧가루 2.5스푼', '간장 2.5스푼', '된장 0.5스푼', '양파 반개', '대파', '다진마늘 1스푼', '청양고추 1개', '새우젓 2스푼', '들기름'],
      steps: [
        { order: 1, description: '돼지고기 핏물을 빼고 신김치를 적당한 크기로 자릅니다' },
        { order: 2, description: '냄비에 들기름을 두르고 김치를 볶은 후 다진마늘과 설탕 1스푼을 넣어 볶아요', tip: '김치를 볶으면 진한 맛!' },
        { order: 3, description: '물(또는 쌀뜨물) 8컵을 부어 센 불에 끓인 후 돼지고기를 넣습니다', tip: '고기를 먼저 볶지 않는 것이 비법!' },
        { order: 4, description: '된장 반스푼을 넣어 고기 잡내를 제거합니다', warning: '된장은 조금만!' },
        { order: 5, description: '양파 반개, 청양고추를 넣고 간장 2.5스푼, 새우젓 2스푼, 고춧가루 2.5스푼을 넣어줍니다' },
        { order: 6, description: '충분히 끓인 후 마지막에 파를 썰어 넣습니다', tip: '오래 끓이면 더 맛있어요!' },
      ],
      detailedContent: '백종원 셰프의 대표적인 김치찌개 황금레시피! 일반적인 김치찌개와 다르게 고기를 먼저 볶지 않고 물에 넣고 끓여서 육수를 내는 것이 핵심! 된장을 넣어 고기 잡내를 제거하고 구수한 맛을 더하며, 새우젓을 넣어 시원한 맛을 냅니다. 조미료가 전혀 들어가지 않아 건강하면서도 깊은 맛을 낼 수 있습니다!',
      additionalTips: ['쌀뜨물을 사용하면 더욱 구수한 맛이 납니다', '김치가 신 김치일수록 맛이 좋아요', '두부를 넣어도 잘 어울립니다'],
    },
    {
      id: '2',
      type: 'recipe',
      title: '5분 완성 황금 계란볶음밥',
      content: '파기름이 포인트! 밥에 계란 미리 섹어서 볶아요',
      author: {
        id: 'user2',
        name: '자취9년차',
        avatar: '🍚',
        level: '생존요리사',
        isVerified: false,
      },
      category: '레시피',
      tags: ['볶음밥', '자취요리', '간단요리'],
      images: [],
      likes: getStoredData('postLikes')['2'] || 0,
      comments: getActualCommentCount('2'),
      commentList: [
        {
          id: 'c2-1',
          author: { id: 'u7', name: '자취생', avatar: '🍜' },
          content: '이건 진짜 간단해서 좋네요',
          createdAt: '1시간 전',
          likes: 23,
          isLiked: false
        },
        {
          id: 'c2-2',
          author: { id: 'u8', name: '요리왕', avatar: '👑' },
          content: '난 참치 넣어서 해먹어요',
          createdAt: '2시간 전',
          likes: 10,
          isLiked: true
        },
        {
          id: 'c2-3',
          author: { id: 'u9', name: '밥도둑', avatar: '🍙' },
          content: '스팸 넣으면 스팸볶음밥 되죠?',
          createdAt: '3시간 전',
          likes: 18,
          isLiked: false
        }
      ],
      saves: getStoredData('postSaves')['2'] || 0,
      createdAt: '3시간 전',
      isLiked: getStoredData('likedPosts')['2'] || false,
      isSaved: getStoredData('savedPosts')['2'] || false,
      difficulty: '초급',
      cookTime: '5분',
      servings: 1,
      ingredients: ['밥 1공기(200g)', '계란 2개', '대파 1대', '간장 1.5스푼', '굴소스 0.5스푼', '버터 약간', '소금, 후추'],
      steps: [
        { order: 1, description: '찬밥에 계란을 깨트린 후 소금, 후추를 넣고 잘 섹어요', tip: '30분 숙성하면 더 좋아요!' },
        { order: 2, description: '팬에 기름을 두르고 파를 볶아 파기름을 만들어요', tip: '파기름이 핵심!' },
        { order: 3, description: '불을 센불로 하고 밥-계란 혼합물을 넣어 볶아요' },
        { order: 4, description: '고슬고슬해지면 간장, 굴소스, 버터를 넣고 센불로 볶아요', tip: '버터가 고소함을 더해요!' },
        { order: 5, description: '취향에 따라 김치나 스팸을 추가해도 맛있어요' },
      ],
      detailedContent: '자취생의 최애 메뉴 황금 계란볶음밥! 비법은 찬밥에 계란을 미리 섹어 두는 것입니다. 이렇게 하면 밥알이 계란으로 코팅되어 고슬고슬하게 완성됩니다. 파기름은 풍미를 더해주고, 마지막에 넣는 버터가 고소한 맛을 완성합니다!',
      additionalTips: ['볶음밥은 무조건 센불!', '찬밥을 전자레인지에 살짝 데워도 좋아요', '가위로도 재료 손질 가능!'],
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
      images: [],
      likes: getStoredData('postLikes')['3'] || 0,
      comments: getActualCommentCount('3'),
      commentList: [
        {
          id: 'c3-1',
          author: { id: 'u10', name: '치킨러버', avatar: '🍗' },
          content: '와 진짜 바삭해요! 감사합니다',
          createdAt: '10분 전',
          likes: 45,
          isLiked: true
        },
        {
          id: 'c3-2',
          author: { id: 'u11', name: '다이어터', avatar: '🎈' },
          content: '칼로리 낮아서 좋아요',
          createdAt: '30분 전',
          likes: 23,
          isLiked: false
        },
        {
          id: 'c3-3',
          author: { id: 'u12', name: '에프러버', avatar: '🔥' },
          content: '온도 몇 도로 하셨나요?',
          createdAt: '1시간 전',
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: 'c3-3-1',
              author: { id: 'user3', name: '에프마스터', avatar: '🍗' },
              content: '180도 20분 후 200도 10분이에요!',
              createdAt: '45분 전',
              likes: 8,
              isLiked: false
            }
          ]
        },
        {
          id: 'c3-4',
          author: { id: 'u13', name: '후라이드팬', avatar: '🍳' },
          content: '양념 비율이 핵심인 것 같아요',
          createdAt: '2시간 전',
          likes: 34,
          isLiked: false
        },
        {
          id: 'c3-5',
          author: { id: 'u14', name: '치킨매니아', avatar: '🐔' },
          content: '치킨무도 같이 했는데 잘 나왔어요',
          createdAt: '3시간 전',
          likes: 28,
          isLiked: true
        },
        {
          id: 'c3-6',
          author: { id: 'u15', name: '요리초보자', avatar: '😋' },
          content: '오늘 당장 해먹어보겠습니다!',
          createdAt: '4시간 전',
          likes: 15,
          isLiked: false
        },
        {
          id: 'c3-7',
          author: { id: 'u16', name: '배달거부', avatar: '🚴' },
          content: '배달비 아끼려고 집에서 해먹어요',
          createdAt: '4시간 전',
          likes: 42,
          isLiked: false
        },
        {
          id: 'c3-8',
          author: { id: 'u17', name: '술꼰', avatar: '🍺' },
          content: '맥주안주 완벽!',
          createdAt: '5시간 전',
          likes: 67,
          isLiked: true
        }
      ],
      saves: getStoredData('postSaves')['3'] || 0,
      createdAt: '5시간 전',
      isLiked: getStoredData('likedPosts')['3'] || false,
      isSaved: getStoredData('savedPosts')['3'] || false,
      difficulty: '중급',
      cookTime: '30분',
      servings: 2,
      ingredients: ['닭다리 8개', '우유 200ml', '허브솔트 1스푼', '올리브오일 4스푼', '후추', '튀김가루 1컵', '계란 2개', '빵가루 1컵'],
      steps: [
        { order: 1, description: '닭다리를 우유에 30분간 담가 잡내를 제거해요' },
        { order: 2, description: '허브솔트, 올리브오일, 후추로 1시간 재워요', tip: '칼집을 내면 더 잘 익어요!' },
        { order: 3, description: '계란-튀김가루-빵가루 순서로 코팅해요' },
        { order: 4, description: '에어프라이어를 200도로 5분 예열해요' },
        { order: 5, description: '200도에서 15분 굽고, 뒤집어서 다시 15분 구워요', tip: '겹쳐지지 않게 간격을 두세요!' },
        { order: 6, description: '마지막 5분은 180도로 낮춰서 속까지 완벽하게!' },
      ],
      detailedContent: '에어프라이어로 만드는 바삭한 치킨! 비법은 우유에 담가 잡내를 제거하고, 튀김가루로 코팅하는 것입니다. 200도에서 15분씩 양면을 구워주면 기름 없이도 바삭한 치킨이 완성됩니다. 칼로리도 낮아서 다이어트 중에도 좋아요!',
      additionalTips: ['에어프라이어 기종마다 온도/시간 조절 필요', '남은 치킨은 180도 10분 데워서 바삭하게', '닭가슴살도 같은 방법으로 가능'],
    },
    {
      id: '11',
      type: 'recipe',
      title: '정승제 셰프의 칠판 레시피: 압도적인 맛의 카레',
      content: 'GQ 코리아 공개! 바몬드 카레와 스위트콘의 환상적인 조화',
      author: {
        id: 'user11',
        name: '정승제',
        avatar: '🍛',
        level: '요리 일타강사',
        isVerified: true,
      },
      category: '레시피',
      tags: ['카레', '일본요리', '정승제', '일타강사'],
      images: [],
      likes: getStoredData('postLikes')['11'] || 0,
      comments: getActualCommentCount('11'),
      commentList: [
        {
          id: 'c11-1',
          author: { id: 'u18', name: '카레러버', avatar: '🍛' },
          content: '정승제님 레시피는 믿고 따라함',
          createdAt: '5분 전',
          likes: 234,
          isLiked: true
        },
        {
          id: 'c11-2',
          author: { id: 'u19', name: '요리학원생', avatar: '👨‍🎓' },
          content: '사과와 꿀을 넣는다니 신기해요',
          createdAt: '10분 전',
          likes: 89,
          isLiked: false
        },
        {
          id: 'c11-3',
          author: { id: 'u20', name: '일본여행가', avatar: '🎌' },
          content: '일본 현지에서 먹던 그 맛이네요!',
          createdAt: '15분 전',
          likes: 156,
          isLiked: true
        },
        {
          id: 'c11-4',
          author: { id: 'u21', name: '카레마니아', avatar: '🤘' },
          content: '우유 넣으니까 진짜 부드러워요',
          createdAt: '20분 전',
          likes: 78,
          isLiked: false,
          replies: [
            {
              id: 'c11-4-1',
              author: { id: 'user11', name: '정승제', avatar: '🍛' },
              content: '우유는 선택이 아닌 필수입니다!',
              createdAt: '18분 전',
              likes: 345,
              isLiked: true
            },
            {
              id: 'c11-4-2',
              author: { id: 'u21', name: '카레마니아', avatar: '🤘' },
              content: '와 정승제님이 답글을!! 감사합니다!',
              createdAt: '15분 전',
              likes: 123,
              isLiked: false
            }
          ]
        },
        {
          id: 'c11-5',
          author: { id: 'u22', name: '집밥사랑', avatar: '🏠' },
          content: '아이들도 좋아하는 맛이에요',
          createdAt: '25분 전',
          likes: 91,
          isLiked: false
        }
      ],
      saves: getStoredData('postSaves')['11'] || 0,
      createdAt: '30분 전',
      isLiked: getStoredData('likedPosts')['11'] || false,
      isSaved: getStoredData('savedPosts')['11'] || false,
      difficulty: '중급',
      cookTime: '40분',
      servings: 4,
      ingredients: ['바몬드 카레 2봉지', '돼지 앞다릿살 2팩', '감자 3개', '양파 3개', '스위트콘 통조림 1개', '청양고추 1개', '참기름', '맛소금', '순 후추'],
      steps: [
        { order: 1, description: '큰 냄비에 참기름을 살짝 둘러주고 돼지고기를 넣어요', tip: '맛소금과 순 후추로 양념!' },
        { order: 2, description: '고기가 익는 동안 감자와 양파를 깍둡썰기로 잘라요', tip: '당근은 넣지 않아요!' },
        { order: 3, description: '야채가 적당히 익으면 물을 첨가하고 저어주세요' },
        { order: 4, description: '바몬드 카레 2봉지, 스위트콘, 청양고추를 넣어요', tip: '스위트콘이 포인트!' },
        { order: 5, description: '뛭근하게 끓여서 완성!', tip: '압도적인 맛을 위해 정성스럽게!' },
      ],
      detailedContent: '정승제 셰프가 GQ 코리아에 공개한 특별한 카레 레시피! 일반적인 카레와 다르게 당근을 넣지 않고 대신 스위트콘과 청양고추로 특별한 맛을 냅니다. 바몬드 카레 2봉지를 사용하는 것이 핀심! 돼지 앞다릿살을 참기름에 볶아 고소함을 더하고, 뛭근하게 끓여 완성하는 "압도적인 맛"의 카레입니다!',
      additionalTips: ['바몬드 카레는 다른 브랜드보다 진하고 깊은 맛이 특징', '당근을 빼고 스위트콘을 넣는 것이 정승제만의 비법', '청양고추는 매운맛을 조절하기 위해 취향에 따라 조절', '참기름으로 시작하면 고소한 맛이 배가됩니다'],
    },
    {
      id: '12',
      type: 'recipe',
      title: '황금 비율 김밥 만들기',
      content: '편의점 김밥보다 100배 맛있는 황금비율',
      author: {
        id: 'user12',
        name: '김밥마스터',
        avatar: '🍙',
        level: '김밥 전문가',
        isVerified: false,
      },
      category: '레시피',
      tags: ['김밥', '간편요리', '도시락'],
      images: [],
      likes: getStoredData('postLikes')['12'] || 0,
      comments: getActualCommentCount('12'),
      saves: getStoredData('postSaves')['12'] || 0,
      createdAt: '2시간 전',
      isLiked: getStoredData('likedPosts')['12'] || false,
      isSaved: getStoredData('savedPosts')['12'] || false,
      difficulty: '초급',
      cookTime: '15분',
      servings: 2,
    },
    {
      id: '13',
      type: 'recipe',
      title: 'SNS 대란 나던 수플레 팬케이크',
      content: '폭신폭신 구름처럼 부드러운 수플레 팬케이크 비법',
      author: {
        id: 'user13',
        name: '디저트왕',
        avatar: '🥞',
        level: '베이킹 마스터',
        isVerified: true,
      },
      category: '레시피',
      tags: ['디저트', '팬케이크', '브런치'],
      images: [],
      likes: getStoredData('postLikes')['13'] || 0,
      comments: getActualCommentCount('13'),
      saves: getStoredData('postSaves')['13'] || 0,
      createdAt: '4시간 전',
      isLiked: getStoredData('likedPosts')['13'] || false,
      isSaved: getStoredData('savedPosts')['13'] || false,
      difficulty: '고급',
      cookTime: '25분',
      servings: 4,
    },
    // 꿀팁 포스트들
    {
      id: '4',
      type: 'tip',
      title: '양파 썰 때 눈물 안나는 방법',
      content: '냉동실에 10분만! 또는 물에 담가두기',
      detailedContent: '양파를 썰 때 눈물이 나는 이유는 양파 세포가 손상되면서 술폭시드라는 최루 물질이 생기기 때문입니다. 이를 방지하는 가장 효과적인 방법들을 소개합니다.',
      tipDetails: {
        summary: '냉동고 10분, 찬물 담그기, 가스불 켜기 등 실험으로 증명된 방법들',
      },
      detailedSteps: [
        {
          title: '냉장/냉동 보관법',
          description: '양파를 냉동고에 10-15분 또는 냉장고에 1시간 보관한 후 썰기. 온도가 낮아져 화학적 반응이 감소합니다.',
          warning: '너무 오래 냉동하면 양파가 얼어버리니 주의',
        },
        {
          title: '물 활용법',
          description: '양파를 찬물에 5분간 담가두거나, 칼에 물을 묻힌 후 썰기. 흐르는 물에서 작업하면 더 효과적입니다.',
        },
        {
          title: '가스불 활용법',
          description: 'KBS 스펀지 실험결과 가장 효과적! 가스불 근처에서 양파를 썰면 매운 성분이 연소되어 눈물이 나지 않습니다.',
        },
        {
          title: '식빵 물고 썰기',
          description: '식빵을 큼지막하게 잘라 입에 물고 양파를 썰면 눈물이 전혀 나지 않습니다. 실험으로 검증된 방법!',
        },
        {
          title: '전자레인지 활용',
          description: '양파를 45초간 전자레인지에 돌리면 전자파로 매운 가스가 파괴됩니다.',
          warning: '너무 오래 돌리면 양파가 익어버림',
        },
      ],
      additionalTips: [
        '초를 켜놓고 썰기 - 매운 성분이 초와 만나 중화',
        '물안경이나 고글 착용 - 원천차단 방법',
        '환기를 잘 시킨 상태에서 작업',
        '날카로운 칼 사용 - 세포 손상을 최소화',
      ],
      author: {
        id: 'user4',
        name: '주방해결사',
        avatar: '🧅',
        level: '팁 마스터',
        isVerified: true,
      },
      category: '꿀팁',
      tags: ['양파', '손질법', '꿀팁'],
      likes: getStoredData('postLikes')['4'] || 0,
      comments: getActualCommentCount('4'),
      saves: getStoredData('postSaves')['4'] || 0,
      createdAt: '2시간 전',
      isLiked: getStoredData('likedPosts')['4'] || false,
      isSaved: getStoredData('savedPosts')['4'] || false,
    },
    {
      id: '5',
      type: 'tip',
      title: '새우 내장 10초만에 빼는법',
      content: '이쑤시개 하나면 끝! 두번째 마디에 찔러서 빼기',
      detailedContent: '백종원도 극찬한 새우 손질법! 이쑤시개 하나면 10초만에 새우 내장을 깔끔하게 제거할 수 있습니다. 내장을 제거하지 않으면 모래가 씹히고 비린내가 날 수 있어요.',
      tipDetails: {
        summary: '새우 등껍질 2-3번째 마디에 이쑤시개를 찔러 내장을 한 번에 빼내는 방법',
      },
      detailedSteps: [
        {
          title: '수염과 뿔 제거',
          description: '새우의 긴 수염 두 개와 머리 위의 뾰족한 뿔을 가위로 먼저 제거합니다.',
        },
        {
          title: '내장 제거 (핵심!)',
          description: '새우 등껍질 2번째 또는 3번째 마디에 이쑤시개를 살짝 찔러넣고 위로 살살 들어올리면 내장이 쏙 빠져나옵니다.',
          warning: '너무 세게 하면 내장이 끊어질 수 있으니 힘을 빼고 천천히',
        },
        {
          title: '물총 제거',
          description: '꼬리 끝의 뾰족한 부분(물총)을 제거합니다. 특히 튀김할 때는 기름이 튀어 위험하니 꼭 제거하세요.',
        },
        {
          title: '껍질 벗기기 꿀팁',
          description: '새우를 뒤집어 다리 부분을 양쪽으로 잡아 벌리면 껍질이 쉽게 벗겨집니다.',
        },
        {
          title: '비린내 제거',
          description: '녹말 2큰술, 맛술 2큰술을 넣고 조물조물 해주면 녹말이 비린내를 흡착합니다.',
        },
      ],
      additionalTips: [
        '해산물은 상하기 쉬우니 손질 후 바로 요리하거나 냉동 보관',
        '새우 머리는 버리지 말고 국물 낼 때 사용하면 좋음',
        '손질한 새우는 키친타올로 물기 제거 후 사용',
        '냉동새우는 소금물에 해동하면 탱탱함 유지',
      ],
      author: {
        id: 'user5',
        name: '손질의달인',
        avatar: '🦐',
        level: '요리 팁스터',
        isVerified: false,
      },
      category: '꿀팁',
      tags: ['새우', '손질', '해산물'],
      likes: getStoredData('postLikes')['5'] || 0,
      comments: getActualCommentCount('5'),
      saves: getStoredData('postSaves')['5'] || 0,
      createdAt: '4시간 전',
      isLiked: getStoredData('likedPosts')['5'] || false,
      isSaved: getStoredData('savedPosts')['5'] || false,
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
      likes: getStoredData('postLikes')['6'] || 0,
      comments: getActualCommentCount('6'),
      saves: getStoredData('postSaves')['6'] || 0,
      createdAt: '6시간 전',
      isLiked: getStoredData('likedPosts')['6'] || false,
      isSaved: getStoredData('savedPosts')['6'] || false,
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
      likes: getStoredData('postLikes')['7'] || 0,
      comments: getActualCommentCount('7'),
      saves: getStoredData('postSaves')['7'] || 0,
      createdAt: '1시간 전',
      isLiked: getStoredData('likedPosts')['7'] || false,
      isSaved: getStoredData('savedPosts')['7'] || false,
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
      likes: getStoredData('postLikes')['8'] || 0,
      comments: getActualCommentCount('8'),
      saves: getStoredData('postSaves')['8'] || 0,
      createdAt: '3시간 전',
      isLiked: getStoredData('likedPosts')['8'] || false,
      isSaved: getStoredData('savedPosts')['8'] || false,
    },
  ]);

  // 카테고리별 필터링
  // 카테고리 필터링
  const categoryFilteredPosts = selectedCategory === 'all'
    ? allPosts
    : allPosts.filter(post => {
        switch(selectedCategory) {
          case 'recipe': return post.type === 'recipe';
          case 'tip': return post.type === 'tip';
          case 'combination': return post.type === 'combination';
          default: return true;
        }
      });

  // 검색 필터링
  const posts = searchQuery.trim() === ''
    ? categoryFilteredPosts
    : categoryFilteredPosts.filter(post => {
        const searchLower = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          post.author.name.toLowerCase().includes(searchLower) ||
          (post.ingredients && post.ingredients.some((ing: string) => ing.toLowerCase().includes(searchLower))) ||
          (post.detailedContent && post.detailedContent.toLowerCase().includes(searchLower))
        );
      });

  const categories = [
    { id: 'all', label: '전체', icon: '✨', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'recipe', label: '레시피', icon: '📖', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { id: 'tip', label: '꿀팁', icon: '💡', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 'combination', label: '조합', icon: '🔥', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  ];

  const trendingTags = ['라면꿀팁', '에어프라이어', '1인가구', '자취요리', '백종원'];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'recipe': return 'bg-blue-100 text-blue-700';
      case 'tip': return 'bg-green-100 text-green-700';
      case 'combination': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'recipe': return '레시피';
      case 'tip': return '꿀팁';
      case 'combination': return '조합';
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

      {/* 검색 결과 표시 */}
      {searchQuery.trim() !== '' && (
        <div className="px-4 pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>"{searchQuery}" 검색 결과: {posts.length}개</span>
            {posts.length === 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-auto text-orange-500 font-medium"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      )}

      {/* 포스트 목록 */}
      <div className="px-4 py-4 space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePostClick(post)}
          >
            {/* 포스트 내용 - 리스트 스타일 */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {/* 제목과 타입 뱃지 */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(post.type)} flex-shrink-0`}>
                      {getTypeLabel(post.type)}
                    </span>
                    {/* 인기 포스트 표시 (좋아요 + 저장 >= 100) */}
                    {((post.likes || 0) + (post.saves || 0) >= 100) && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white flex-shrink-0">
                        🔥 인기
                      </span>
                    )}
                    <h3 className="font-bold text-base flex-1 line-clamp-2">{post.title}</h3>
                  </div>

                  {/* 내용 미리보기 */}
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.content}</p>

                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xs">
                      {post.author.avatar}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{post.author.name}</span>
                    {post.author.isVerified && (
                      <CheckBadgeIcon className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-500">· {post.createdAt}</span>
                  </div>

                  {/* 메타 정보 및 통계 */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {post.type === 'recipe' && post.difficulty && (
                      <>
                        <span className="flex items-center gap-0.5">
                          <SparklesIcon className="w-3 h-3" />
                          {post.difficulty}
                        </span>
                        {post.cookTime && (
                          <span className="flex items-center gap-0.5">
                            <ClockIcon className="w-3 h-3" />
                            {post.cookTime}
                          </span>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="flex items-center gap-1">
                        {post.isLiked ? (
                          <HeartSolidIcon className="w-4 h-4 text-red-500" />
                        ) : (
                          <HeartIcon className="w-4 h-4" />
                        )}
                        <span className={post.isLiked ? 'text-red-500 font-semibold' : ''}>
                          {(Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)).toLocaleString()}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        {post.isSaved ? (
                          <BookmarkSolidIcon className="w-4 h-4 text-orange-500" />
                        ) : (
                          <BookmarkIcon className="w-4 h-4" />
                        )}
                        <span className={post.isSaved ? 'text-orange-500 font-semibold' : ''}>
                          {(post.saves || 0).toLocaleString()}
                        </span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post);
                        }}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <ShareIcon className="w-4 h-4" />
                        <span className="text-xs">공유</span>
                      </button>
                    </div>
                  </div>

                  {/* 태그 (선택적) */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
      </div>

      {/* 플로팅 작성 버튼 */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center z-40">
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Post Detail Modal */}
      {selectedPost && (
        <CommunityPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={() => handleLike(selectedPost.id)}
          onSave={() => handleSave(selectedPost.id)}
          onShare={() => handleShare(selectedPost)}
          onCommentAdd={handleCommentAdd}
        />
      )}

      {/* 공유 모달 */}
      {showShareModal && selectedSharePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">커뮤니티 게시글 공유</h3>

            {/* 공유할 게시글 미리보기 */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="font-medium text-sm">{selectedSharePost.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedSharePost.type === 'recipe' ? '🍳 레시피' : '💡 꿀팁'}
              </p>
            </div>

            {/* 메시지 입력 */}
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="함께 보낼 메시지를 입력하세요 (선택)"
              className="w-full p-3 border rounded-lg text-sm mb-4"
              rows={3}
            />

            {/* 사용자 선택 */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">받는 사람 선택 (팔로잉 & 팔로워)</p>
              {availableUsers.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <label key={user.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(u => u !== user.id));
                          }
                        }}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{user.avatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              user.type === 'mutual' ? 'bg-purple-100 text-purple-700' :
                              user.type === 'following' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {user.type === 'mutual' ? '서로팔로우' :
                               user.type === 'following' ? '팔로잉' :
                               '팔로워'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">공유할 수 있는 사용자가 없습니다.</p>
                  <p className="text-xs mt-1">다른 사용자를 팔로우해보세요!</p>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSelectedSharePost(null);
                  setShareMessage('');
                  setSelectedUsers([]);
                }}
                className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={sendShareMessage}
                disabled={selectedUsers.length === 0}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCommunity;