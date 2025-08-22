const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');
const Message = require('./models/Message');

let io;
const connectedUsers = new Map(); // userId -> socketId
const userSockets = new Map(); // socketId -> userId

function initializeWebSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  // 소켓 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('인증 토큰이 필요합니다.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('유효하지 않은 사용자입니다.'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket 인증 실패:', error);
      next(new Error('인증에 실패했습니다.'));
    }
  });

  // 연결 이벤트
  io.on('connection', (socket) => {
    console.log(`✅ 사용자 연결: ${socket.user.username} (${socket.userId})`);
    
    // 사용자 온라인 상태 추가
    connectedUsers.set(socket.userId, socket.id);
    userSockets.set(socket.id, socket.userId);
    
    // 사용자가 참여한 모든 채팅방에 입장
    socket.on('join_chats', async () => {
      try {
        const userChats = await Chat.find({
          participants: socket.userId
        }).select('_id');
        
        userChats.forEach(chat => {
          socket.join(chat._id.toString());
          console.log(`📥 ${socket.user.username}이 채팅방 ${chat._id}에 입장`);
        });

        // 온라인 사용자 목록 업데이트
        socket.broadcast.emit('user_online', {
          userId: socket.userId,
          username: socket.user.username
        });
      } catch (error) {
        console.error('채팅방 입장 실패:', error);
      }
    });

    // 특정 채팅방 입장
    socket.on('join_chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.includes(socket.userId)) {
          socket.join(chatId);
          console.log(`📥 ${socket.user.username}이 채팅방 ${chatId}에 입장`);
          
          // 채팅방의 다른 사용자들에게 입장 알림
          socket.to(chatId).emit('user_joined_chat', {
            userId: socket.userId,
            username: socket.user.username
          });
        }
      } catch (error) {
        console.error('채팅방 입장 실패:', error);
      }
    });

    // 채팅방 나가기
    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      socket.to(chatId).emit('user_left_chat', {
        userId: socket.userId,
        username: socket.user.username
      });
      console.log(`📤 ${socket.user.username}이 채팅방 ${chatId}에서 나감`);
    });

    // 메시지 전송
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'text', restaurantData } = data;
        
        // 채팅방 참여자 확인
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          socket.emit('error', { message: '채팅방에 접근할 권한이 없습니다.' });
          return;
        }

        // 메시지 저장
        const message = new Message({
          chat: chatId,
          sender: socket.userId,
          content,
          type,
          restaurantData,
          readBy: [socket.userId]
        });

        await message.save();
        await message.populate('sender', 'username profileImage');

        // 채팅방 정보 업데이트
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        // 실시간으로 메시지 전송
        const messageData = {
          id: message._id,
          senderId: socket.userId,
          senderName: message.sender.username,
          content: message.content,
          timestamp: new Date().toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: message.type,
          restaurantData: message.restaurantData,
          read: false
        };

        // 채팅방의 모든 사용자에게 메시지 전송
        io.to(chatId).emit('new_message', messageData);
        
        console.log(`💬 메시지 전송 (${socket.user.username} → 채팅방 ${chatId}): ${content}`);
      } catch (error) {
        console.error('메시지 전송 실패:', error);
        socket.emit('error', { message: '메시지 전송에 실패했습니다.' });
      }
    });

    // 타이핑 상태
    socket.on('typing_start', (chatId) => {
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: true
      });
    });

    socket.on('typing_stop', (chatId) => {
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping: false
      });
    });

    // 메시지 읽음 처리
    socket.on('mark_messages_read', async (chatId) => {
      try {
        await Message.updateMany(
          { 
            chat: chatId, 
            sender: { $ne: socket.userId },
            'readBy.user': { $nin: [socket.userId] }
          },
          { 
            $addToSet: { 
              readBy: {
                user: socket.userId,
                readAt: new Date()
              }
            }
          }
        );

        // 채팅방의 다른 사용자들에게 읽음 상태 업데이트
        socket.to(chatId).emit('messages_read', {
          userId: socket.userId,
          chatId
        });
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    });

    // 매칭 알림
    socket.on('send_match_notification', (data) => {
      const { targetUserId, type, message } = data;
      const targetSocketId = connectedUsers.get(targetUserId);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit('match_notification', {
          type, // 'like', 'superlike', 'match'
          from: {
            userId: socket.userId,
            username: socket.user.username,
            profileImage: socket.user.profileImage
          },
          message,
          timestamp: new Date()
        });
      }
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log(`❌ 사용자 연결 해제: ${socket.user.username} (${socket.userId})`);
      
      // 연결된 사용자 목록에서 제거
      connectedUsers.delete(socket.userId);
      userSockets.delete(socket.id);
      
      // 오프라인 상태 알림
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // 에러 처리
    socket.on('error', (error) => {
      console.error(`Socket 에러 (${socket.user.username}):`, error);
      socket.emit('error', { message: '연결 오류가 발생했습니다.' });
    });
  });

  console.log('🔄 WebSocket 서버 초기화 완료');
  return io;
}

// 온라인 사용자 확인
function isUserOnline(userId) {
  return connectedUsers.has(userId.toString());
}

// 특정 사용자에게 알림 전송
function sendNotificationToUser(userId, notification) {
  const socketId = connectedUsers.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit('notification', notification);
    return true;
  }
  return false;
}

// 채팅방의 모든 사용자에게 메시지 전송
function sendMessageToChat(chatId, message) {
  if (io) {
    io.to(chatId).emit('new_message', message);
    return true;
  }
  return false;
}

module.exports = {
  initializeWebSocket,
  isUserOnline,
  sendNotificationToUser,
  sendMessageToChat,
  getConnectedUsers: () => Array.from(connectedUsers.keys()),
  getIo: () => io
};