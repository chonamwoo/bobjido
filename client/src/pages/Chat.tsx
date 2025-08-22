import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarIcon,
  FaceSmileIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';

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

interface ChatUser {
  id: string;
  username: string;
  profileImage: string;
  isOnline: boolean;
  lastSeen?: string;
  tasteProfile: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'other',
    content: '안녕하세요! 매칭되어서 반가워요 😊',
    timestamp: '오후 2:30',
    type: 'text',
    read: true
  },
  {
    id: '2',
    senderId: 'me',
    content: '안녕하세요! 저도 반가워요. 프로필 보니까 취향이 정말 비슷하네요!',
    timestamp: '오후 2:32',
    type: 'text',
    read: true
  },
  {
    id: '3',
    senderId: 'other',
    content: '맞아요! 매운 음식 좋아하신다니 저랑 똑같네요 ㅎㅎ',
    timestamp: '오후 2:33',
    type: 'text',
    read: true
  },
  {
    id: '4',
    senderId: 'other',
    content: '혹시 이 맛집 가보셨어요?',
    timestamp: '오후 2:34',
    type: 'restaurant',
    restaurantData: {
      name: '교대이층집',
      address: '서울 서초구 서초대로 320',
      image: '/api/placeholder/200/150'
    },
    read: true
  }
];

const iceBreakers = [
  "오늘 점심 뭐 드셨어요?",
  "이 동네 숨은 맛집 아시는 곳 있나요?",
  "매운거 얼마나 잘 드세요?",
  "주말에 맛집 탐방 어때요?",
  "최근에 가장 맛있게 먹은 음식은?"
];

const Chat: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [showIceBreakers, setShowIceBreakers] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Mock user data
  const chatUser: ChatUser = {
    id: userId || '1',
    username: '김미식',
    profileImage: '/api/placeholder/100/100',
    isOnline: true,
    tasteProfile: '모험적인 미식가'
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'text',
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setShowIceBreakers(false);

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate reply
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'other',
          content: '좋은 생각이에요! 언제가 좋으실까요?',
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: 'text',
          read: false
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }, 1000);
  };

  const sendIceBreaker = (text: string) => {
    setInputMessage(text);
    setShowIceBreakers(false);
    inputRef.current?.focus();
  };

  const shareRestaurant = () => {
    const restaurantMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: '이 맛집 어때요?',
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'restaurant',
      restaurantData: {
        name: '스시오마카세',
        address: '서울 강남구 논현로 123',
        image: '/api/placeholder/200/150'
      },
      read: false
    };
    setMessages(prev => [...prev, restaurantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/profile/${chatUser.username}`)}
            >
              <div className="relative">
                <img
                  src={chatUser.profileImage}
                  alt={chatUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {chatUser.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div>
                <h2 className="font-semibold">{chatUser.username}</h2>
                <p className="text-xs text-gray-500">
                  {chatUser.isOnline ? '온라인' : chatUser.lastSeen}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <VideoCameraIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* 매칭 정보 */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-gray-600">
              <span className="font-semibold">{chatUser.username}</span>님과 매칭되었어요!
            </p>
            <p className="text-sm text-purple-600 mt-1">{chatUser.tasteProfile}</p>
          </div>

          {/* 메시지 리스트 */}
          <div className="space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.senderId === 'me' ? 'order-2' : ''}`}>
                  {message.type === 'text' && (
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.senderId === 'me' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'restaurant' && message.restaurantData && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-xs">
                      {message.restaurantData.image && (
                        <img 
                          src={message.restaurantData.image} 
                          alt={message.restaurantData.name}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-1">{message.content}</p>
                        <h4 className="font-semibold text-sm">{message.restaurantData.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          <MapPinIcon className="w-3 h-3 inline mr-1" />
                          {message.restaurantData.address}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <p className={`text-xs text-gray-500 mt-1 ${
                    message.senderId === 'me' ? 'text-right' : ''
                  }`}>
                    {message.timestamp}
                    {message.senderId === 'me' && message.read && ' ✓✓'}
                  </p>
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
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 아이스브레이커 */}
      <AnimatePresence>
        {showIceBreakers && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2">대화 시작하기</p>
              <div className="flex gap-2 flex-wrap">
                {iceBreakers.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => sendIceBreaker(text)}
                    className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <PhotoIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={shareRestaurant}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MapPinIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowIceBreakers(messages.length <= 4)}
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={() => setShowIceBreakers(!showIceBreakers)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className={`p-2 rounded-lg transition-colors ${
              inputMessage.trim()
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;