import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  PlusIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { getGroupImage, getRestaurantImage } from '../utils/restaurantImages';
import { getDefaultAvatar } from '../utils/avatars';

interface GroupMember {
  id: string;
  username: string;
  profileImage: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

interface GroupPost {
  id: string;
  author: GroupMember;
  content: string;
  images?: string[];
  restaurant?: {
    name: string;
    location: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
}

const GroupCommunity: React.FC = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'events' | 'members'>('posts');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Mock 데이터
  const groupInfo = {
    id: groupId,
    name: '강남 맛집 탐험대',
    description: '강남 지역의 숨은 맛집을 찾아다니는 모임입니다! 매주 새로운 곳을 탐험해요 🍽️',
    memberCount: 24,
    category: '지역 모임',
    coverImage: getGroupImage('강남 맛집 탐험대'),
    createdAt: '2024년 1월',
    rules: [
      '서로 존중하며 대화해요',
      '맛집 정보는 자유롭게 공유해요',
      '월 1회 이상 정기 모임 참여를 권장해요'
    ]
  };

  const members: GroupMember[] = [
    {
      id: '1',
      username: '김그룹장',
      profileImage: getDefaultAvatar('김그룹장', 50),
      role: 'leader',
      joinedAt: '2024년 1월'
    },
    {
      id: '2',
      username: '이미식',
      profileImage: getDefaultAvatar('이미식', 50),
      role: 'member',
      joinedAt: '2024년 2월'
    },
    {
      id: '3',
      username: '박푸디',
      profileImage: getDefaultAvatar('박푸디', 50),
      role: 'member',
      joinedAt: '2024년 2월'
    },
    {
      id: '4',
      username: '최맛집',
      profileImage: getDefaultAvatar('최맛집', 50),
      role: 'member',
      joinedAt: '2024년 3월'
    },
    {
      id: '5',
      username: '정셰프',
      profileImage: getDefaultAvatar('정셰프', 50),
      role: 'member',
      joinedAt: '2024년 3월'
    }
  ];

  const posts: GroupPost[] = [
    {
      id: '1',
      author: members[0],
      content: '오늘 다녀온 강남역 파스타 맛집! 진짜 대박이었어요 👍 트러플 오일 파스타 강추합니다~',
      images: ['https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80'],
      restaurant: {
        name: '파스타 부티크',
        location: '강남역 3번 출구'
      },
      likes: 15,
      comments: 8,
      isLiked: false,
      createdAt: '2시간 전'
    },
    {
      id: '2',
      author: members[1],
      content: '다음 모임 장소 추천! 여기 브런치 진짜 맛있어요. 주말에 같이 가실 분?',
      images: [
        'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
      ],
      restaurant: {
        name: '브런치 카페',
        location: '신논현역'
      },
      likes: 23,
      comments: 12,
      isLiked: true,
      createdAt: '5시간 전'
    },
    {
      id: '3',
      author: members[2],
      content: '어제 다녀온 한식집 너무 좋았어요! 김치찌개 진짜 집밥 같은 맛이었어요 ㅠㅠ',
      images: ['https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80'],
      restaurant: {
        name: '미소 한정식',
        location: '강남구청역'
      },
      likes: 8,
      comments: 3,
      isLiked: false,
      createdAt: '1일 전'
    },
    {
      id: '4',
      author: members[3],
      content: '회식 장소로 다녀온 일식집! 분위기 좋고 음식도 맛있었어요. 단체 모임하기 좋을 것 같아요~',
      images: [
        'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
        'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80'
      ],
      restaurant: {
        name: '스시젠',
        location: '선릉역'
      },
      likes: 31,
      comments: 15,
      isLiked: true,
      createdAt: '2일 전'
    }
  ];

  const events: GroupEvent[] = [
    {
      id: '1',
      title: '12월 정기 모임 - 크리스마스 특집',
      date: '2024년 12월 23일 오후 6시',
      location: '강남 파인다이닝 레스토랑',
      participants: 8,
      maxParticipants: 12
    },
    {
      id: '2',
      title: '신년 맛집 투어',
      date: '2025년 1월 6일 오후 1시',
      location: '강남역 일대',
      participants: 5,
      maxParticipants: 8
    }
  ];

  const handleLikePost = (postId: string) => {
    // 좋아요 처리 로직
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      // 새 게시물 생성 로직
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                // sessionStorage에서 저장된 탭 확인
                const savedTab = sessionStorage.getItem('matchesActiveTab') || 'groups';
                navigate(`/matches?tab=${savedTab}`);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold flex-1">{groupInfo.name}</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <UserGroupIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 정보 */}
      <div className="bg-white mb-4">
        <div 
          className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative"
          style={{ 
            backgroundImage: `url(${groupInfo.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm opacity-90 mb-1">{groupInfo.category} · {groupInfo.memberCount}명</p>
            <h2 className="text-2xl font-bold mb-2">{groupInfo.name}</h2>
            <p className="text-sm opacity-90">{groupInfo.description}</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'posts' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
          >
            게시물
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'events' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
          >
            모임 일정
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'members' 
                ? 'text-purple-600 border-b-2 border-purple-600' 
                : 'text-gray-600'
            }`}
          >
            멤버 ({groupInfo.memberCount})
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* 게시물 탭 */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {/* 새 게시물 작성 */}
            {showNewPost ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="맛집 정보나 모임 후기를 공유해주세요..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
                <div className="flex items-center justify-between mt-3">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <PhotoIcon className="w-5 h-5" />
                    <span className="text-sm">사진 추가</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowNewPost(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      게시
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowNewPost(true)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <PlusIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-600">새 게시물 작성하기...</span>
              </button>
            )}

            {/* 게시물 목록 */}
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                {/* 작성자 정보 */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.author.profileImage}
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.author.username}</span>
                      {post.author.role === 'leader' && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                          리더
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{post.createdAt}</span>
                  </div>
                </div>

                {/* 게시물 내용 */}
                <p className="text-gray-800 mb-3">{post.content}</p>

                {/* 맛집 정보 */}
                {post.restaurant && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{post.restaurant.name}</span>
                      <span className="text-gray-500">· {post.restaurant.location}</span>
                    </div>
                  </div>
                )}

                {/* 이미지 */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    {post.isLiked ? (
                      <HeartSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span className="text-sm">{Array.isArray(post.likes) ? post.likes.length : post.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 모임 일정 탭 */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{event.participants}/{event.maxParticipants}명 참여</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                    참여하기
                  </button>
                </div>
                
                {/* 참여 진행률 */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}

            <button className="w-full bg-purple-100 text-purple-600 rounded-xl p-4 hover:bg-purple-200 transition-colors font-medium">
              + 새 모임 만들기
            </button>
          </div>
        )}

        {/* 멤버 탭 */}
        {activeTab === 'members' && (
          <div className="space-y-3">
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                <img
                  src={member.profileImage}
                  alt={member.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.username}</span>
                    {member.role === 'leader' && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                        리더
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">가입: {member.joinedAt}</span>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  프로필 보기
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCommunity;