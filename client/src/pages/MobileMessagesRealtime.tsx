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
  CheckIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';
import socketService from '../services/socketService';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import chatService from '../services/chatService';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location' | 'restaurant';
  restaurantData?: {
    name: string;
    address: string;
    image?: string;
  };
  read: boolean;
}

interface User {
  id: string;
  username: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
  bio?: string;
  tasteType?: string;
}

interface Chat {
  id: string;
  type: 'personal' | 'group';
  name?: string;
  profileImage?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
  participants?: User[];
}

const MobileMessagesRealtime: React.FC = () => {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // 채팅 목록 불러오기
  const fetchChats = async () => {
    try {
      setLoading(true);
      const chatList = await chatService.getChats();
      setChats(chatList);
    } catch (error) {
      console.error('채팅 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 메시지 불러오기
  const fetchMessages = async (chatId: string) => {
    try {
      const messageList = await chatService.getMessages(chatId);
      
      // 메시지가 없는 경우 빈 배열 설정
      setMessages(messageList || []);
      
      // 메시지 읽음 처리 (서버 연결시)
      if (socketService.isConnected() && messageList.length > 0) {
        socketService.markMessagesAsRead(chatId);
      }
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      // 에러가 발생해도 빈 배열로 설정
      setMessages([]);
    }
  };

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get('/api/users/available');
      if (response.data.success) {
        console.log('사용자 목록 로드 성공:', response.data.data.length, '명');
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      // 서버 오류 시 빈 배열 유지
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 새 채팅 모달이 열릴 때 사용자 목록 불러오기
  useEffect(() => {
    if (showNewChat) {
      fetchUsers();
    }
  }, [showNewChat]);

  // Socket 이벤트 설정
  useEffect(() => {
    if (!token) return;

    // Socket 연결
    if (!socketService.isConnected()) {
      socketService.connect(token);
    }

    // 새 메시지 수신
    socketService.on('new_message', (data: any) => {
      console.log('새 메시지 수신:', data);
      
      // 현재 선택된 채팅방의 메시지인 경우
      if (selectedChatId && data.chatId === selectedChatId) {
        const newMessage: Message = {
          id: data.id,
          senderId: data.senderId,
          content: data.content,
          timestamp: data.timestamp,
          type: data.type || 'text',
          restaurantData: data.restaurantData,
          read: false
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // 자동 스크롤
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // 채팅 목록 업데이트
      setChats(prev => prev.map(chat => 
        chat.id === data.chatId 
          ? { ...chat, lastMessage: data.content, timestamp: '방금', unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    });

    // 타이핑 상태
    socketService.on('user_typing', (data: any) => {
      if (data.chatId === selectedChatId && data.userId !== currentUser?._id) {
        setTypingUser(data.username);
        setIsTyping(data.isTyping);
        
        // 3초 후 타이핑 상태 자동 해제
        if (data.isTyping) {
          setTimeout(() => setIsTyping(false), 3000);
        }
      }
    });

    // 사용자 온라인 상태
    socketService.on('user_online', (data: any) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    });

    socketService.on('user_offline', (data: any) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    // 초기 데이터 로드
    fetchChats();
    fetchUsers();

    return () => {
      socketService.off('new_message');
      socketService.off('user_typing');
      socketService.off('user_online');
      socketService.off('user_offline');
    };
  }, [token, selectedChatId, currentUser]);

  // 메시지 전송
  const handleSendMessage = async () => {
    console.log('handleSendMessage 호출됨', { messageInput, selectedChatId });
    if (!messageInput.trim() || !selectedChatId) {
      console.log('메시지가 비어있거나 채팅방이 선택되지 않음');
      return;
    }

    const currentInput = messageInput;
    setMessageInput('');

    try {
      // ChatService를 사용하여 메시지 전송
      console.log('메시지 전송 시작:', currentInput);
      const message = await chatService.sendMessage(selectedChatId, currentInput, 'text');
      console.log('메시지 생성됨:', message);
      
      // UI 업데이트
      setMessages(prev => {
        const updated = [...prev, message];
        console.log('메시지 목록 업데이트:', updated);
        // LocalStorage에도 저장
        localStorage.setItem(`messages_${selectedChatId}`, JSON.stringify(updated));
        return updated;
      });
      
      // 채팅 목록 업데이트
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, lastMessage: currentInput, timestamp: message.timestamp }
          : chat
      ));
      
      // Socket으로도 전송 (서버 연결시)
      if (socketService.isConnected()) {
        socketService.sendMessage(selectedChatId, currentInput, 'text');
      }
      
      // 실제 서버로만 메시지 전송 (자동 응답 제거)
      
      setError(null);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setError('메시지 전송에 실패했습니다.');
      setMessageInput(currentInput); // 실패시 입력값 복원
    }

    // 자동 스크롤
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 타이핑 처리
  const handleTyping = () => {
    if (!selectedChatId) return;

    // 타이핑 시작 알림
    socketService.startTyping(selectedChatId);

    // 이전 타임아웃 취소
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 1초 후 타이핑 중지 알림
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(selectedChatId);
    }, 1000);
  };

  // 새 채팅 시작
  const startNewChat = async (userId: string) => {
    const selectedUser = availableUsers.find(u => u.id === userId);
    if (!selectedUser) {
      setError('사용자를 찾을 수 없습니다.');
      return;
    }
    
    // 이미 존재하는 채팅 확인
    const existingChat = chats.find(chat => 
      chat.participants?.some(p => p.id === userId)
    );
    
    if (existingChat) {
      // 기존 채팅방이 있으면 선택
      setShowNewChat(false);
      setNewChatSearchQuery('');
      selectChat(existingChat.id);
      return;
    }
    
    try {
      // ChatService를 사용하여 채팅방 생성
      const { chatId, chat } = await chatService.createChat(
        userId, 
        selectedUser.username,
        selectedUser.profileImage
      );
      
      // 채팅 목록에 추가
      setChats(prev => [chat, ...prev]);
      
      // 모달 닫기
      setShowNewChat(false);
      setNewChatSearchQuery('');
      
      // 채팅방 선택 (메시지 로드 및 소켓 참여 포함)
      selectChat(chatId);
      
      setError(null);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      setError('채팅방 생성에 실패했습니다.');
    }
  };

  // 채팅방 선택
  const selectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Socket 참여
    if (socketService.isConnected()) {
      socketService.joinChat(chatId);
    }
    
    // 메시지 로드
    await fetchMessages(chatId);
  };

  // 채팅방 나가기
  const leaveChat = () => {
    if (selectedChatId) {
      socketService.leaveChat(selectedChatId);
    }
    setSelectedChatId(null);
    setMessages([]);
  };

  const currentChat = selectedChatId ? chats.find(chat => chat.id === selectedChatId) : null;
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 채팅방 뷰
  if (selectedChatId) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        {/* 채팅 헤더 */}
        <div className="flex-shrink-0 bg-white border-b z-10">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button
                onClick={leaveChat}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm">
                  {currentChat?.profileImage || currentChat?.name?.[0]?.toUpperCase() || '?'}
                </div>
                {currentChat?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{currentChat?.name || '대화'}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {isTyping && typingUser ? `${typingUser}님이 입력 중...` : 
                   currentChat?.isOnline ? '온라인' : '오프라인'}
                </p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                {currentChat?.profileImage || currentChat?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentChat?.name || '새로운 대화'}님과의 대화
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                아래에서 메시지를 입력해 대화를 시작하세요!
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                <button
                  onClick={() => {
                    setMessageInput('안녕하세요! 👋');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  안녕하세요! 👋
                </button>
                <button
                  onClick={() => {
                    setMessageInput('맛집 추천 부탁드려요!');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  맛집 추천 부탁드려요!
                </button>
                <button
                  onClick={() => {
                    setMessageInput('같이 맛집 탐방 어때요?');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  같이 맛집 탐방 어때요?
                </button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === 'me' || message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`relative max-w-[70%] ${
                message.senderId === 'me' || message.senderId === currentUser?._id ? 'order-2' : ''
              }`}>
                <div className={`relative px-3 py-2 rounded-2xl ${
                  message.senderId === 'me' || message.senderId === currentUser?._id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.type === 'text' && (
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  )}
                  
                  {message.type === 'restaurant' && message.restaurantData && (
                    <div className="space-y-2">
                      <p className="text-sm">{message.content}</p>
                      <div className="bg-white/20 rounded-lg p-2">
                        <h4 className="font-semibold text-sm">{message.restaurantData.name}</h4>
                        <p className="text-xs opacity-90 flex items-center gap-1 mt-1">
                          <MapPinIcon className="w-3 h-3" />
                          {message.restaurantData.address}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex items-center gap-1 mt-0.5 ${
                    message.senderId === 'me' || message.senderId === currentUser?._id ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className={`text-[10px] ${
                      message.senderId === 'me' || message.senderId === currentUser?._id ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </span>
                    {(message.senderId === 'me' || message.senderId === currentUser?._id) && (
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
          )))}
          
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
          
          <div ref={messagesEndRef} />
        </div>

        {/* 메시지 입력 */}
        <div className="flex-shrink-0 bg-white border-t p-3 safe-area-bottom">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <PhotoIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지 입력..."
                className="w-full px-4 py-2.5 bg-gray-100 rounded-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                <FaceSmileIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 채팅 목록 */}
      <div className="pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <motion.button
              key={chat.id}
              onClick={async () => {
                await selectChat(chat.id);
              }}
              className="w-full bg-white border-b hover:bg-gray-50 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-xl">
                    {chat.profileImage || chat.name?.[0]?.toUpperCase()}
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
              className="bg-white rounded-t-3xl w-full flex flex-col"
              style={{ maxHeight: '80vh' }}
            >
              {/* 헤더 - 고정 */}
              <div className="flex-shrink-0 border-b">
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
                  <div className="relative">
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
                </div>
              </div>
              
              {/* 사용자 목록 - 스크롤 가능 */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-4 space-y-2">
                  {(() => {
                    if (loadingUsers) {
                      return (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                      );
                    }

                    const filteredUsers = availableUsers.filter(user => {
                      const searchLower = newChatSearchQuery.toLowerCase();
                      const usernameLower = user.username?.toLowerCase() || '';
                      const bioLower = user.bio?.toLowerCase() || '';
                      
                      return usernameLower.includes(searchLower) || bioLower.includes(searchLower);
                    });
                    
                    if (availableUsers.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">아직 가입한 사용자가 없습니다</p>
                          <p className="text-sm text-gray-400 mt-1">새로운 사용자를 초대해보세요!</p>
                        </div>
                      );
                    }
                    
                    if (filteredUsers.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">검색 결과가 없습니다</p>
                          <p className="text-sm text-gray-400 mt-1">다른 키워드로 검색해보세요</p>
                        </div>
                      );
                    }
                    
                    return filteredUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => startNewChat(user.id)}
                        className="w-full p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                      >
                        {user.profileImage && user.profileImage.startsWith('http') ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white flex-shrink-0 ${user.profileImage && user.profileImage.startsWith('http') ? 'hidden' : ''}`}>
                          {user.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">{user.username}</p>
                          {user.bio && <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>}
                          {user.tasteType && <p className="text-xs text-orange-500">{user.tasteType}</p>}
                        </div>
                      </button>
                    ));
                  })()}
                  
                  {/* 더 많은 사용자를 위한 여백 */}
                  <div className="h-4"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 플로팅 새 메시지 버튼 */}
      {!showNewChat && (
        <button 
          onClick={() => setShowNewChat(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MobileMessagesRealtime;