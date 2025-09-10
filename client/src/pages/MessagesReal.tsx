import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FaceSmileIcon,
  EllipsisVerticalIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import socketService from '../services/socketService';
import axios from '../utils/axios';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  type: 'text' | 'image' | 'location' | 'restaurant';
  restaurantData?: {
    name: string;
    address: string;
    image?: string;
  };
  createdAt: string;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
}

interface Chat {
  _id: string;
  type: 'personal' | 'group';
  name?: string;
  participants: Array<{
    _id: string;
    username: string;
    profileImage?: string;
  }>;
  lastMessage?: {
    _id: string;
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

const MessagesReal: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      connectSocket();
      fetchChats();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
      socketService.joinChat(selectedChat._id);
      socketService.markMessagesAsRead(selectedChat._id);
      
      return () => {
        socketService.leaveChat(selectedChat._id);
      };
    }
  }, [selectedChat]);

  const connectSocket = () => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
      setupSocketListeners();
    }
  };

  const setupSocketListeners = () => {
    socketService.on('new_message', (message: any) => {
      setMessages((prev) => [...prev, message]);
      
      // 메시지를 받은 채팅방 업데이트
      setChats((prev) => prev.map((chat) => {
        if (chat._id === message.chatId) {
          return {
            ...chat,
            lastMessage: {
              _id: message.id,
              content: message.content,
              createdAt: new Date().toISOString(),
            },
          };
        }
        return chat;
      }));
    });

    socketService.on('user_typing', ({ userId, username, isTyping }: any) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(username);
        } else {
          newSet.delete(username);
        }
        return newSet;
      });
    });

    socketService.on('messages_read', ({ userId, chatId }: any) => {
      setMessages((prev) => prev.map((msg) => {
        if (msg.sender._id === user?._id) {
          return {
            ...msg,
            readBy: [...msg.readBy, { user: userId, readAt: new Date().toISOString() }],
          };
        }
        return msg;
      }));
    });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chat/my-chats');
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('채팅 목록 로드 실패:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const tempMessage: Message = {
      _id: Date.now().toString(),
      content: messageInput,
      sender: {
        _id: user?._id || '',
        username: user?.username || '',
        profileImage: user?.profileImage,
      },
      type: 'text',
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    setMessages((prev) => [...prev, tempMessage]);
    socketService.sendMessage(selectedChat._id, messageInput);
    setMessageInput('');
    socketService.stopTyping(selectedChat._id);
  };

  const handleTyping = () => {
    if (!selectedChat) return;

    socketService.startTyping(selectedChat._id);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(selectedChat._id);
    }, 1000);
  };

  const createNewChat = async (targetUserId: string) => {
    try {
      const response = await axios.post('/api/chat/create', {
        participants: [targetUserId],
        type: 'personal',
      });
      
      setChats((prev) => [response.data, ...prev]);
      setSelectedChat(response.data);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherUser = (chat: Chat) => {
    return chat.participants.find((p) => p._id !== user?._id);
  };

  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherUser(chat);
    return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 채팅 목록 */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-3">메시지</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="대화 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {filteredChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const isSelected = selectedChat?._id === chat._id;
            
            return (
              <motion.div
                key={chat._id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b cursor-pointer ${
                  isSelected ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {otherUser?.profileImage ? (
                    <img
                      src={otherUser.profileImage}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold truncate">
                        {otherUser?.username || '알 수 없음'}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage?.content || '메시지를 시작해보세요'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 메시지 영역 */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* 채팅 헤더 */}
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getOtherUser(selectedChat)?.profileImage ? (
                <img
                  src={getOtherUser(selectedChat)?.profileImage}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              )}
              <div>
                <h3 className="font-semibold">
                  {getOtherUser(selectedChat)?.username || '알 수 없음'}
                </h3>
                {typingUsers.size > 0 && (
                  <p className="text-sm text-gray-500">입력 중...</p>
                )}
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => {
                const isMe = message.sender._id === user?._id;
                
                return (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isMe
                            ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {message.type === 'restaurant' && message.restaurantData ? (
                          <div className="space-y-2">
                            <p className="font-semibold">{message.restaurantData.name}</p>
                            <p className="text-sm opacity-90">{message.restaurantData.address}</p>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : ''}`}>
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 */}
          <div className="bg-white border-t p-4">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <PhotoIcon className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaceSmileIcon className="h-5 w-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg hover:opacity-90 transition"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <UserCircleIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              대화를 선택하세요
            </h3>
            <p className="text-gray-500">
              왼쪽에서 대화를 선택하거나 새로운 대화를 시작하세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesReal;