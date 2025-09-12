const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { messageLimiter } = require('../middleware/rateLimiter');

// 채팅 목록 가져오기
router.get('/list', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      type: { $in: ['personal', 'group'] }
    })
    .populate('participants', 'username profileImage')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    const formattedChats = chats.map(chat => {
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );

      return {
        id: chat._id,
        type: chat.type,
        name: chat.type === 'group' ? chat.name : otherParticipant?.username,
        profileImage: chat.type === 'group' ? 
          chat.groupImage : 
          (otherParticipant?.profileImage || '/api/placeholder/100/100'),
        lastMessage: chat.lastMessage?.content || '',
        timestamp: formatTimestamp(chat.updatedAt),
        unreadCount: chat.unreadCount?.get(req.user._id) || 0,
        isOnline: chat.type === 'personal' ? Math.random() > 0.5 : undefined,
        memberCount: chat.type === 'group' ? chat.participants.length : undefined
      };
    });

    res.json({
      success: true,
      data: formattedChats
    });
  } catch (error) {
    console.error('채팅 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '채팅 목록을 불러올 수 없습니다.'
    });
  }
});

// 특정 채팅방의 메시지들 가져오기
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // 채팅방 참여자인지 확인
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: '채팅방에 접근할 권한이 없습니다.'
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const formattedMessages = messages.reverse().map(msg => ({
      id: msg._id,
      senderId: msg.sender._id.toString() === req.user._id.toString() ? 'me' : 'other',
      content: msg.content,
      timestamp: formatTimestamp(msg.createdAt),
      type: msg.type || 'text',
      restaurantData: msg.restaurantData,
      read: msg.readBy.includes(req.user._id)
    }));

    // 메시지 읽음 처리
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: req.user._id },
        readBy: { $nin: [req.user._id] }
      },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({
      success: true,
      data: formattedMessages
    });
  } catch (error) {
    console.error('메시지 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '메시지를 불러올 수 없습니다.'
    });
  }
});

// 메시지 보내기 (Rate limiting 적용)
router.post('/:chatId/messages', protect, messageLimiter, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', restaurantData } = req.body;

    // 메시지 길이 제한
    if (content && content.length > 500) {
      return res.status(400).json({
        success: false,
        message: '메시지는 500자를 초과할 수 없습니다.'
      });
    }

    // 채팅방 참여자인지 확인
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: '채팅방에 접근할 권한이 없습니다.'
      });
    }

    // 새 메시지 생성
    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content,
      type,
      restaurantData,
      readBy: [req.user._id]
    });

    await message.save();
    await message.populate('sender', 'username profileImage');

    // 채팅방 정보 업데이트
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    // WebSocket으로 실시간 전송 (향후 구현)
    // io.to(chatId).emit('newMessage', formattedMessage);

    const formattedMessage = {
      id: message._id,
      senderId: 'me',
      content: message.content,
      timestamp: formatTimestamp(message.createdAt),
      type: message.type,
      restaurantData: message.restaurantData,
      read: false
    };

    res.json({
      success: true,
      data: formattedMessage
    });
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    res.status(500).json({
      success: false,
      message: '메시지 전송에 실패했습니다.'
    });
  }
});

// 새 채팅방 생성 (매칭된 사용자와)
router.post('/create', protect, async (req, res) => {
  try {
    const { userId, type = 'personal' } = req.body;

    // 이미 존재하는 채팅방 확인
    let existingChat = await Chat.findOne({
      type: 'personal',
      participants: { $all: [req.user._id, userId] }
    });

    if (existingChat) {
      return res.json({
        success: true,
        data: { chatId: existingChat._id },
        message: '기존 채팅방을 사용합니다.'
      });
    }

    // 새 채팅방 생성
    const chat = new Chat({
      type,
      participants: [req.user._id, userId],
      createdBy: req.user._id
    });

    await chat.save();

    res.json({
      success: true,
      data: { chatId: chat._id },
      message: '새 채팅방이 생성되었습니다.'
    });
  } catch (error) {
    console.error('채팅방 생성 실패:', error);
    res.status(500).json({
      success: false,
      message: '채팅방 생성에 실패했습니다.'
    });
  }
});

// 그룹 채팅방 생성
router.post('/group/create', protect, async (req, res) => {
  try {
    const { name, description, participants } = req.body;

    const chat = new Chat({
      type: 'group',
      name,
      description,
      participants: [...participants, req.user._id],
      createdBy: req.user._id,
      admins: [req.user._id]
    });

    await chat.save();

    res.json({
      success: true,
      data: { chatId: chat._id },
      message: '그룹 채팅방이 생성되었습니다.'
    });
  } catch (error) {
    console.error('그룹 채팅방 생성 실패:', error);
    res.status(500).json({
      success: false,
      message: '그룹 채팅방 생성에 실패했습니다.'
    });
  }
});

// 타이핑 상태 업데이트 (WebSocket 연동 필요)
router.post('/:chatId/typing', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isTyping } = req.body;

    // WebSocket으로 타이핑 상태 전송
    // io.to(chatId).emit('typing', { userId: req.user._id, isTyping });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '타이핑 상태 업데이트에 실패했습니다.'
    });
  }
});

// 헬퍼 함수
function formatTimestamp(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

  if (diffInHours < 1) return '방금';
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInHours < 48) return '어제';
  
  return messageDate.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  });
}

module.exports = router;