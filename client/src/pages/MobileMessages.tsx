import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FaceSmileIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
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

const MobileMessages: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        name: '맛집탐험가',
        avatar: '🍕',
        isOnline: true,
      },
      lastMessage: '이번 주말에 그 맛집 같이 가실래요?',
      timestamp: '방금',
      unreadCount: 2,
      messages: [
        { id: '1', text: '안녕하세요!', sender: 'other', timestamp: '오후 2:30', read: true },
        { id: '2', text: '네 안녕하세요 😊', sender: 'me', timestamp: '오후 2:35', read: true },
        { id: '3', text: '강남역 맛집 추천해주실 수 있나요?', sender: 'other', timestamp: '오후 2:40', read: true },
        { id: '4', text: '스시조 추천드려요!', sender: 'me', timestamp: '오후 2:42', read: true },
        { id: '5', text: '이번 주말에 그 맛집 같이 가실래요?', sender: 'other', timestamp: '방금', read: false },
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
      lastMessage: '그 레시피 정말 대박!',
      timestamp: '30분 전',
      unreadCount: 0,
      messages: [
        { id: '1', text: '라면 팁 감사해요!', sender: 'me', timestamp: '오전 11:00', read: true },
        { id: '2', text: '도움이 되셨다니 기뻐요!', sender: 'other', timestamp: '오전 11:05', read: true },
        { id: '3', text: '그 레시피 정말 대박!', sender: 'other', timestamp: '30분 전', read: true },
      ],
    },
    {
      id: '3',
      user: {
        name: '요리왕비룡',
        avatar: '👨‍🍳',
        isOnline: true,
      },
      lastMessage: '쿠킹 클래스 어때요?',
      timestamp: '2시간 전',
      unreadCount: 1,
      messages: [
        { id: '1', text: '쿠킹 클래스 어때요?', sender: 'other', timestamp: '2시간 전', read: false },
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
      lastMessage: '이마트 할인 정보예요',
      timestamp: '어제',
      unreadCount: 0,
      messages: [],
    },
  ]);

  const currentChat = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentChat) return;
    
    // 새 메시지 추가
    const newMessage = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: false
    };
    
    // 현재 채팅 업데이트
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageInput,
              timestamp: '방금'
            }
          : chat
      )
    );
    
    setMessageInput('');
    
    // 시뮬레이션: 2초 후 상대방 응답
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        text: '메시지 잘 받았어요! 😊',
        sender: 'other' as const,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        read: false
      };
      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: [...chat.messages, replyMessage],
                lastMessage: replyMessage.text,
                timestamp: '방금'
              }
            : chat
        )
      );
    }, 2000);
  };

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 채팅방 선택 시
  if (currentChat) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 채팅 헤더 - 더 컴팩트하고 명확하게 */}
        <div className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm">
                  {currentChat.user.avatar}
                </div>
                {currentChat.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{currentChat.user.name}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {currentChat.user.isOnline ? '온라인' : `마지막 접속: ${currentChat.user.lastSeen}`}
                </p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentChat.messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative max-w-[70%] ${
                message.sender === 'me' ? 'order-2' : ''
              }`}>
                {/* 말풍선 꼬리 - 더 부드러운 스타일 */}
                <div className={`absolute top-3 ${
                  message.sender === 'me' 
                    ? 'right-0 translate-x-1'
                    : 'left-0 -translate-x-1'
                }`}>
                  <svg width="10" height="16" viewBox="0 0 10 16" className={
                    message.sender === 'me' 
                      ? 'fill-orange-500'
                      : 'fill-gray-100'
                  }>
                    {message.sender === 'me' ? (
                      <path d="M0 0 L0 16 Q10 8 0 0" />
                    ) : (
                      <path d="M10 0 L10 16 Q0 8 10 0" />
                    )}
                  </svg>
                </div>
                
                {/* 메시지 내용 - 더 읽기 쉽게 */}
                <div className={`relative px-3 py-2 rounded-2xl ${
                  message.sender === 'me'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-0.5 ${
                    message.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-[10px] ${
                      message.sender === 'me' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </span>
                    {message.sender === 'me' && (
                      message.read ? (
                        <CheckSolidIcon className="w-2.5 h-2.5 text-orange-100" />
                      ) : (
                        <CheckIcon className="w-2.5 h-2.5 text-orange-200" />
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 메시지 입력 */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex items-center gap-2">
            <button className="p-2">
              <PhotoIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지 입력..."
                className="w-full px-4 py-2 bg-gray-100 rounded-full pr-10"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <FaceSmileIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 채팅 목록
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - 더 간단하고 명확하게 */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">메시지</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 검색바 */}
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              <input
                type="text"
                placeholder="대화 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="pb-20">
        {filteredChats.map(chat => (
          <motion.button
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className="w-full bg-white border-b hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3 p-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                  {chat.user.avatar}
                </div>
                {chat.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{chat.user.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate flex-1 mr-2">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 플로팅 새 메시지 버튼 */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center z-40">
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileMessages;