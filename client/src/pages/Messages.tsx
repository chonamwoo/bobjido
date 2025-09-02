import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        name: '맛집탐험가',
        avatar: '🍕',
        isOnline: true,
      },
      lastMessage: '이번 주말에 그 맛집 같이 가실래요?',
      timestamp: '방금 전',
      unreadCount: 2,
      messages: [
        { id: '1', text: '안녕하세요! 프로필 보고 연락드려요', sender: 'other', timestamp: '오후 2:30', read: true },
        { id: '2', text: '안녕하세요! 반가워요 😊', sender: 'me', timestamp: '오후 2:35', read: true },
        { id: '3', text: '혹시 강남역 맛집 추천해주실 수 있나요?', sender: 'other', timestamp: '오후 2:40', read: true },
        { id: '4', text: '강남역이면 "스시조" 추천드려요! 오마카세 맛집이에요', sender: 'me', timestamp: '오후 2:42', read: true },
        { id: '5', text: '오 좋네요! 가격대는 어떻게 되나요?', sender: 'other', timestamp: '오후 2:45', read: true },
        { id: '6', text: '런치는 5-7만원, 디너는 10만원대예요', sender: 'me', timestamp: '오후 2:47', read: true },
        { id: '7', text: '이번 주말에 그 맛집 같이 가실래요?', sender: 'other', timestamp: '방금 전', read: false },
      ],
    },
    {
      id: '2',
      user: {
        name: '라면마스터',
        avatar: '🍜',
        isOnline: false,
        lastSeen: '1시간 전',
      },
      lastMessage: '그 레시피 정말 대박이었어요!',
      timestamp: '30분 전',
      unreadCount: 0,
      messages: [
        { id: '1', text: '라면 끓이는 팁 감사해요!', sender: 'me', timestamp: '오전 11:00', read: true },
        { id: '2', text: '도움이 되셨다니 기뻐요!', sender: 'other', timestamp: '오전 11:05', read: true },
        { id: '3', text: '그 레시피 정말 대박이었어요!', sender: 'other', timestamp: '30분 전', read: true },
      ],
    },
    {
      id: '3',
      user: {
        name: '요리왕비룡',
        avatar: '👨‍🍳',
        isOnline: true,
      },
      lastMessage: '다음 주에 쿠킹 클래스 어때요?',
      timestamp: '2시간 전',
      unreadCount: 1,
      messages: [
        { id: '1', text: '안녕하세요! 요리 클래스 문의드려요', sender: 'me', timestamp: '오전 10:00', read: true },
        { id: '2', text: '네, 어떤 요리를 배우고 싶으신가요?', sender: 'other', timestamp: '오전 10:15', read: true },
        { id: '3', text: '이탈리안 파스타요!', sender: 'me', timestamp: '오전 10:20', read: true },
        { id: '4', text: '다음 주에 쿠킹 클래스 어때요?', sender: 'other', timestamp: '2시간 전', read: false },
      ],
    },
    {
      id: '4',
      user: {
        name: '할인헌터',
        avatar: '💰',
        isOnline: false,
        lastSeen: '어제',
      },
      lastMessage: '이마트 할인 정보 공유해드릴게요',
      timestamp: '어제',
      unreadCount: 0,
      messages: [
        { id: '1', text: '할인 정보 항상 감사해요!', sender: 'me', timestamp: '어제', read: true },
        { id: '2', text: '이마트 할인 정보 공유해드릴게요', sender: 'other', timestamp: '어제', read: true },
      ],
    },
  ]);

  const currentChat = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentChat) return;
    
    // 실제로는 API 호출하여 메시지 전송
    setMessageInput('');
  };

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-96 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">메시지</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="대화 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map(chat => (
                  <motion.button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedChat === chat.id ? 'bg-orange-50' : ''
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                          {chat.user.avatar}
                        </div>
                        {chat.user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{chat.user.name}</span>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            {currentChat ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white">
                        {currentChat.user.avatar}
                      </div>
                      {currentChat.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentChat.user.name}</h3>
                      <p className="text-xs text-gray-500">
                        {currentChat.user.isOnline ? '온라인' : `마지막 접속: ${currentChat.user.lastSeen}`}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentChat.messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${
                        message.sender === 'me'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      } rounded-2xl px-4 py-2`}>
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          message.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className={`text-xs ${
                            message.sender === 'me' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </span>
                          {message.sender === 'me' && (
                            message.read ? (
                              <CheckSolidIcon className="w-4 h-4 text-orange-100" />
                            ) : (
                              <CheckIcon className="w-4 h-4 text-orange-200" />
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <PhotoIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <FaceSmileIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="메시지 입력..."
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <UserCircleIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">대화를 선택하세요</h3>
                  <p className="text-gray-500">왼쪽 목록에서 대화를 선택하여 메시지를 시작하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;