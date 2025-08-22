import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  UserGroupIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ChatItem {
  id: string;
  type: 'personal' | 'group';
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  memberCount?: number;
}

const mockChats: ChatItem[] = [
  {
    id: '1',
    type: 'personal',
    name: '김미식',
    profileImage: '/api/placeholder/100/100',
    lastMessage: '이번 주말에 맛집 탐방 어때요?',
    timestamp: '방금',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    type: 'group',
    name: '강남 맛집 탐험대',
    profileImage: '/api/placeholder/100/100',
    lastMessage: '박먹방: 토요일 7시 어떠신가요?',
    timestamp: '10분 전',
    unreadCount: 5,
    memberCount: 6
  },
  {
    id: '3',
    type: 'personal',
    name: '이구르메',
    profileImage: '/api/placeholder/100/100',
    lastMessage: '사진 공유해주셔서 감사해요!',
    timestamp: '1시간 전',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '4',
    type: 'group',
    name: '매운맛 챌린저',
    profileImage: '/api/placeholder/100/100',
    lastMessage: '최매워: 새로운 마라탕집 발견!',
    timestamp: '어제',
    unreadCount: 0,
    memberCount: 8
  }
];

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const [chats] = useState<ChatItem[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'groups'>('all');

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'personal' && chat.type === 'personal') ||
      (activeTab === 'groups' && chat.type === 'group');
    return matchesSearch && matchesTab;
  });

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const handleChatClick = (chat: ChatItem) => {
    if (chat.type === 'personal') {
      navigate(`/chat/${chat.id}`);
    } else {
      navigate(`/group-chat/${chat.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">채팅</h1>
            <div className="relative">
              <BellIcon className="w-6 h-6 text-gray-600" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </div>
          </div>

          {/* 검색바 */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="대화 검색..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'personal'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              개인
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'groups'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              그룹
            </button>
          </div>
        </div>

        {/* 채팅 목록 */}
        <div className="bg-white">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleChatClick(chat)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                {/* 프로필 이미지 */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.profileImage}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.type === 'personal' && chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                  {chat.type === 'group' && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <UserGroupIcon className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* 채팅 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {chat.name}
                      {chat.type === 'group' && (
                        <span className="ml-1 text-xs text-gray-500 font-normal">
                          ({chat.memberCount}명)
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">대화가 없습니다</h3>
              <p className="text-gray-600 text-center mb-4">
                매칭된 친구들과 대화를 시작해보세요!
              </p>
              <button
                onClick={() => navigate('/matches')}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                매칭 보러가기
              </button>
            </div>
          )}
        </div>

        {/* 플로팅 버튼 - 새 대화 시작 */}
        <button
          onClick={() => navigate('/matches')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatList;