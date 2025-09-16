import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  PhotoIcon, 
  FaceSmileIcon, 
  EllipsisVerticalIcon, 
  XMarkIcon, 
  PlusIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  tasteScore?: number;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
}

interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

const MobileMessagesNew: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // 사용 가능한 사용자 목록 (실제로는 API에서 가져옴)
  const [availableUsers] = useState<User[]>([
    { id: 'user1', name: '김미식', avatar: '👨', tasteScore: 85, bio: '맛집 탐험가, 한식 전문가' },
    { id: 'user2', name: '박맛집', avatar: '👩', tasteScore: 92, bio: '디저트 카페 마니아' },
    { id: 'user3', name: '이요리', avatar: '😋', tasteScore: 78, bio: '홈쿠킹 & 레시피 공유' },
    { id: 'user4', name: '최명수', avatar: '🍳', tasteScore: 88, bio: '미쉐린 레스토랑 탐방' },
    { id: 'user5', name: '정푸디', avatar: '🍔', tasteScore: 75, bio: '햄버거 & 피자 러버' },
    { id: 'user6', name: '강쉐프', avatar: '👨‍🍳', tasteScore: 94, bio: '프렌치 요리 전문' },
    { id: 'user7', name: '윤미미', avatar: '🍰', tasteScore: 82, bio: '베이킹 & 디저트' },
    { id: 'user8', name: '한라면', avatar: '🍜', tasteScore: 70, bio: '라면 & 분식 마스터' },
  ]);
  
  // LocalStorage에서 채팅 데이터 로드
  const loadChats = (): Chat[] => {
    const saved = localStorage.getItem('mobile_chats');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  };
  
  const [chats, setChats] = useState<Chat[]>(loadChats());
  
  // 채팅 데이터 저장
  useEffect(() => {
    localStorage.setItem('mobile_chats', JSON.stringify(chats));
  }, [chats]);
  
  const currentChat = chats.find(chat => chat.id === selectedChat);
  
  // 새 대화 시작
  const startNewChat = (user: User) => {
    // 이미 대화가 있는지 확인
    const existingChat = chats.find(chat => chat.user.id === user.id);
    if (existingChat) {
      setSelectedChat(existingChat.id);
      setShowNewChat(false);
      return;
    }
    
    const newChatId = `chat-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      user: {
        ...user,
        isOnline: Math.random() > 0.5,
      },
      lastMessage: '대화를 시작해보세요!',
      timestamp: '방금',
      unreadCount: 0,
      messages: [],
    };
    
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChatId);
    setShowNewChat(false);
  };
  
  // 메시지 전송
  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      read: false
    };
    
    // 채팅 업데이트
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
    
    // 자동 응답 시뮬레이션
    setTimeout(() => {
      const replies = [
        '좋은 생각이에요! 😊',
        '언제 만날까요?',
        '오~ 그 맛집 저도 가보고 싶었어요!',
        '다음에 같이 가요!',
        '맛있겠네요 ㅎㅎ',
        '혹시 다른 추천 맛집도 있나요?',
        '와 대박! 저도 거기 가봤어요!',
        '진짜요? 저도 궁금해요!',
      ];
      
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
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
                timestamp: '방금',
                unreadCount: chat.unreadCount + 1
              }
            : chat
        )
      );
    }, 1500 + Math.random() * 2000);
  };
  
  // 채팅 삭제
  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChat === chatId) {
      setSelectedChat(null);
    }
  };
  
  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 사용자 프로필 보기
  const viewUserProfile = (user: User) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };
  
  // 채팅방 화면
  if (currentChat) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* 채팅 헤더 */}
        <div className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button 
                onClick={() => setSelectedChat(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => viewUserProfile(currentChat.user)}
                className="flex items-center gap-2 flex-1 min-w-0 hover:bg-gray-50 rounded-lg p-1"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-lg">
                    {currentChat.user.avatar}
                  </div>
                  {currentChat.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{currentChat.user.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentChat.user.isOnline ? '온라인' : currentChat.user.lastSeen || '오프라인'}
                  </p>
                </div>
              </button>
            </div>
            
            <button className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentChat.messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">대화를 시작해보세요!</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {['안녕하세요! 👋', '맛집 추천해주세요!', '같이 식사하실래요?'].map((text) => (
                  <button
                    key={text}
                    onClick={() => setMessageInput(text)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}
          
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
            <button className="p-2">
              <MapPinIcon className="w-5 h-5 text-gray-600" />
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
              disabled={!messageInput.trim()}
              className={`p-2 rounded-full transition-colors ${
                messageInput.trim() 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // 메인 채팅 목록
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 새 대화 모달 */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-sm w-full p-4 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">새 대화 시작하기</h2>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="사용자 검색..."
                className="w-full px-3 py-2 bg-gray-100 rounded-lg mb-3 text-sm"
              />
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => startNewChat(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                      {user.avatar}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.bio ? user.bio : `취향 일치도 ${user.tasteScore}%`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-orange-500">
                        {user.tasteScore}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 사용자 프로필 모달 */}
      <AnimatePresence>
        {showUserProfile && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                  {selectedUser.avatar}
                </div>
                <h3 className="text-xl font-bold mb-1">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedUser.bio}</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{selectedUser.tasteScore}%</p>
                    <p className="text-xs text-gray-500">취향 일치도</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserProfile(false)}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 헤더 */}
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
              <button 
                onClick={() => setShowNewChat(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 검색바 */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3"
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
          </AnimatePresence>
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">아직 대화가 없습니다</p>
            <button
              onClick={() => setShowNewChat(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
            >
              새 대화 시작하기
            </button>
          </div>
        ) : (
          filteredChats.map(chat => (
            <motion.button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className="w-full p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
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
          ))
        )}
      </div>
    </div>
  );
};

export default MobileMessagesNew;