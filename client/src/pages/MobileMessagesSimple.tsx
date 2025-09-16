import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FaceSmileIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isSent: boolean;
}

interface Chat {
  id: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

interface User {
  id: string;
  username: string;
  profileImage: string;
  bio: string;
  isOnline: boolean;
}

const MobileMessagesSimple: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 자동 응답 메시지 풀
  const autoReplies = [
    "좋은 아이디어네요! 어떤 음식 좋아하세요?",
    "오~ 저도 그 맛집 가보고 싶었어요! 😊",
    "맛있겠다! 언제가 좋으실까요?",
    "저도 요즘 맛집 탐방하고 싶었는데 딱이네요!",
    "와 대박! 거기 진짜 맛있다던데요",
    "좋아요! 같이 가요~ 기대되네요",
    "헐 저도 관심있었어요! 언제 시간 되세요?",
    "네네! 저도 좋아요 ㅎㅎ",
    "오늘 날씨도 좋은데 맛집 탐방 어때요?",
    "저는 매운거 좋아하는데 혹시 매운음식 괜찮으세요?"
  ];

  // Mock 사용자 데이터
  const mockUsers: User[] = [
    { id: 'user1', username: '김미식', profileImage: '👨', bio: '맛집 탐험가, 한식 전문가', isOnline: true },
    { id: 'user2', username: '박맛집', profileImage: '👩', bio: '디저트 카페 마니아', isOnline: false },
    { id: 'user3', username: '이요리', profileImage: '😋', bio: '홈쿠킹 & 레시피 공유', isOnline: true },
    { id: 'user4', username: '최명수', profileImage: '🍳', bio: '미쉐린 레스토랑 탐방', isOnline: false },
    { id: 'user5', username: '정푸디', profileImage: '🍔', bio: '햄버거 & 피자 러버', isOnline: true },
  ];

  // 초기화
  useEffect(() => {
    // localStorage에서 채팅 목록 불러오기
    const loadChats = () => {
      const savedChats = localStorage.getItem('simple_chats');
      if (savedChats) {
        setChats(JSON.parse(savedChats));
      }
    };

    // Mock 사용자 설정
    setAvailableUsers(mockUsers);
    loadChats();
  }, []);

  // 채팅 저장
  const saveChats = (updatedChats: Chat[]) => {
    setChats(updatedChats);
    localStorage.setItem('simple_chats', JSON.stringify(updatedChats));
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const currentChat = chats.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    // 새 메시지 생성
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: '나',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isSent: true
    };

    // 채팅 업데이트
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChatId) {
        const updatedMessages = [...chat.messages, newMessage];
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: messageInput,
          timestamp: newMessage.timestamp
        };
      }
      return chat;
    });

    saveChats(updatedChats);
    setMessageInput('');

    // 자동 스크롤
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // 자동 응답 시뮬레이션
    simulateAutoReply(selectedChatId, currentChat.name);
  };

  // 자동 응답 시뮬레이션
  const simulateAutoReply = (chatId: string, senderName: string) => {
    // 타이핑 표시
    setIsTyping(true);

    // 1-3초 후 응답
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setIsTyping(false);
      
      const replyContent = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      const replyMessage: Message = {
        id: `reply-${Date.now()}`,
        senderId: 'other',
        senderName: senderName,
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isSent: false
      };

      // 채팅 업데이트
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat => {
          if (chat.id === chatId) {
            const updatedMessages = [...chat.messages, replyMessage];
            return {
              ...chat,
              messages: updatedMessages,
              lastMessage: replyContent,
              timestamp: replyMessage.timestamp,
              unreadCount: selectedChatId === chatId ? 0 : chat.unreadCount + 1
            };
          }
          return chat;
        });
        
        // localStorage에 저장
        localStorage.setItem('simple_chats', JSON.stringify(updatedChats));
        return updatedChats;
      });

      // 자동 스크롤
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, delay);
  };

  // 새 채팅 시작
  const startNewChat = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    if (!user) return;

    // 이미 존재하는 채팅 확인
    const existingChat = chats.find(chat => chat.id === `chat-${userId}`);
    if (existingChat) {
      setSelectedChatId(existingChat.id);
      setShowNewChat(false);
      return;
    }

    // 새 채팅 생성
    const newChat: Chat = {
      id: `chat-${userId}`,
      name: user.username,
      profileImage: user.profileImage,
      lastMessage: '',
      timestamp: '방금',
      unreadCount: 0,
      isOnline: user.isOnline,
      messages: []
    };

    const updatedChats = [newChat, ...chats];
    saveChats(updatedChats);
    setSelectedChatId(newChat.id);
    setShowNewChat(false);
  };

  // 빠른 답장
  const sendQuickReply = (content: string) => {
    setMessageInput(content);
    setTimeout(() => sendMessage(), 100);
  };

  const currentChat = selectedChatId ? chats.find(chat => chat.id === selectedChatId) : null;
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 채팅방 뷰
  if (selectedChatId && currentChat) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* 채팅 헤더 */}
        <div className="flex-shrink-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={() => setSelectedChatId(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm">
                  {currentChat.profileImage}
                </div>
                {currentChat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{currentChat.name}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {isTyping ? '입력 중...' : currentChat.isOnline ? '온라인' : '오프라인'}
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
          {currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                {currentChat.profileImage}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentChat.name}님과의 대화
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                아래에서 메시지를 입력해 대화를 시작하세요!
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                <button
                  onClick={() => sendQuickReply('안녕하세요! 👋')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  안녕하세요! 👋
                </button>
                <button
                  onClick={() => sendQuickReply('맛집 추천 부탁드려요!')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  맛집 추천 부탁드려요!
                </button>
                <button
                  onClick={() => sendQuickReply('같이 맛집 탐방 어때요?')}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  같이 맛집 탐방 어때요?
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`relative max-w-[70%]`}>
                    <div className={`relative px-3 py-2 rounded-2xl ${
                      message.isSent
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-0.5 ${
                        message.isSent ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className={`text-[10px] ${
                          message.isSent ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 타이핑 인디케이터 */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력 */}
        <div className="flex-shrink-0 bg-white border-t p-3 safe-area-bottom">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <PhotoIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지 입력..."
                className="w-full px-4 py-2.5 bg-gray-100 rounded-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                <FaceSmileIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              className={`p-2 rounded-full transition-all ${
                messageInput.trim() 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-100' 
                  : 'bg-gray-200 text-gray-400 scale-95'
              }`}
              disabled={!messageInput.trim()}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 채팅 목록 뷰
  return (
    <div className="min-h-screen bg-gray-50">
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
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
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
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="pb-20">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <motion.button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className="w-full bg-white border-b hover:bg-gray-50 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                    {chat.profileImage}
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">{chat.name}</span>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {chat.lastMessage || '대화를 시작해보세요'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center flex-shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">아직 대화가 없습니다</p>
            <button
              onClick={() => setShowNewChat(true)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm"
            >
              새 대화 시작하기
            </button>
          </div>
        )}
      </div>

      {/* 새 대화 모달 */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white rounded-t-3xl w-full" 
              style={{ maxHeight: '80vh' }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">새 대화 시작</h2>
                  <button
                    onClick={() => {
                      setShowNewChat(false);
                      setNewChatSearchQuery('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* 검색바 */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="사용자 검색..."
                    value={newChatSearchQuery}
                    onChange={(e) => setNewChatSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm"
                    autoFocus
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                
                {/* 사용자 목록 */}
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {availableUsers
                    .filter(user => 
                      user.username.toLowerCase().includes(newChatSearchQuery.toLowerCase()) ||
                      user.bio.toLowerCase().includes(newChatSearchQuery.toLowerCase())
                    )
                    .map(user => (
                      <button
                        key={user.id}
                        onClick={() => startNewChat(user.id)}
                        className="w-full p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          {user.profileImage}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMessagesSimple;