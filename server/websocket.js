const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const { SocketRateLimiter } = require('./middleware/rateLimiter');

let io;
const connectedUsers = new Map(); // userId -> socketId
const userSockets = new Map(); // socketId -> userId
const messageRateLimiter = new SocketRateLimiter(1000, 5); // 1초에 최대 5개 메시지

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
        
        // Rate limiting 체크
        if (!messageRateLimiter.check(socket.userId)) {
          socket.emit('error', { 
            message: '메시지를 너무 빠르게 전송하고 있습니다. 잠시 후 다시 시도해주세요.',
            type: 'rate_limit'
          });
          return;
        }
        
        // 메시지 길이 제한
        if (content && content.length > 500) {
          socket.emit('error', { 
            message: '메시지는 500자를 초과할 수 없습니다.',
            type: 'message_too_long'
          });
          return;
        }
        
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

    // 메시지 읽음 처리 (배치 최적화)
    socket.on('mark_messages_read', async (chatId) => {
      try {
        // 읽지 않은 메시지 ID만 먼저 가져오기 (성능 최적화)
        const unreadMessages = await Message.find(
          { 
            chat: chatId, 
            sender: { $ne: socket.userId },
            'readBy.user': { $ne: socket.userId }
          },
          '_id'
        ).limit(100); // 한 번에 최대 100개까지만 처리
        
        if (unreadMessages.length > 0) {
          // 배치 업데이트
          const bulkOps = unreadMessages.map(msg => ({
            updateOne: {
              filter: { _id: msg._id },
              update: { 
                $addToSet: { 
                  readBy: {
                    user: socket.userId,
                    readAt: new Date()
                  }
                }
              }
            }
          }));
          
          await Message.bulkWrite(bulkOps, { ordered: false });
          
          // 채팅방의 다른 사용자들에게 읽음 상태 업데이트
          socket.to(chatId).emit('messages_read', {
            userId: socket.userId,
            chatId,
            messageIds: unreadMessages.map(m => m._id)
          });
        }
      } catch (error) {
        console.error('메시지 읽음 처리 실패:', error);
      }
    });

    // 알림 생성 및 전송
    socket.on('create_notification', async (data) => {
      try {
        const { recipientId, type, message, relatedData } = data;
        
        // 알림 데이터베이스에 저장
        const notification = new Notification({
          recipient: recipientId,
          sender: socket.userId,
          type,
          message,
          ...relatedData
        });
        
        await notification.save();
        await notification.populate('sender', 'username profileImage');
        
        // 수신자가 온라인이면 실시간 전송
        const targetSocketId = connectedUsers.get(recipientId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_notification', notification);
        }
        
        console.log(`🔔 알림 전송: ${type} (${socket.user.username} → ${recipientId})`);
      } catch (error) {
        console.error('알림 생성 실패:', error);
        socket.emit('error', { message: '알림 전송에 실패했습니다.' });
      }
    });
    
    // 팔로우 알림
    socket.on('notification_follow', async (targetUserId) => {
      try {
        const notification = new Notification({
          recipient: targetUserId,
          sender: socket.userId,
          type: 'follow',
          message: `${socket.user.username}님이 회원님을 팔로우했습니다`
        });
        
        await notification.save();
        await notification.populate('sender', 'username profileImage');
        
        const targetSocketId = connectedUsers.get(targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_notification', notification);
        }
      } catch (error) {
        console.error('팔로우 알림 실패:', error);
      }
    });
    
    // 플레이리스트 좋아요 알림
    socket.on('notification_playlist_like', async (data) => {
      try {
        const { playlistId, ownerId, playlistTitle } = data;
        
        const notification = new Notification({
          recipient: ownerId,
          sender: socket.userId,
          type: 'playlist_like',
          message: `${socket.user.username}님이 "${playlistTitle}" 플레이리스트를 좋아합니다`,
          relatedPlaylist: playlistId
        });
        
        await notification.save();
        await notification.populate('sender', 'username profileImage');
        
        const targetSocketId = connectedUsers.get(ownerId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_notification', notification);
        }
      } catch (error) {
        console.error('좋아요 알림 실패:', error);
      }
    });
    
    // 플레이리스트 저장 알림  
    socket.on('notification_playlist_save', async (data) => {
      try {
        const { playlistId, ownerId, playlistTitle } = data;
        
        const notification = new Notification({
          recipient: ownerId,
          sender: socket.userId,
          type: 'playlist_save',
          message: `${socket.user.username}님이 "${playlistTitle}" 플레이리스트를 저장했습니다`,
          relatedPlaylist: playlistId
        });
        
        await notification.save();
        await notification.populate('sender', 'username profileImage');
        
        const targetSocketId = connectedUsers.get(ownerId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_notification', notification);
        }
      } catch (error) {
        console.error('저장 알림 실패:', error);
      }
    });
    
    // 새 플레이리스트 알림 (팔로워에게)
    socket.on('notification_new_playlist', async (data) => {
      try {
        const { playlistId, playlistTitle } = data;
        
        // 사용자의 팔로워 목록 가져오기
        const user = await User.findById(socket.userId).populate('followers');
        
        for (const follower of user.followers || []) {
          const notification = new Notification({
            recipient: follower._id,
            sender: socket.userId,
            type: 'new_playlist',
            message: `${socket.user.username}님이 새 플레이리스트 "${playlistTitle}"를 만들었습니다`,
            relatedPlaylist: playlistId
          });
          
          await notification.save();
          
          const targetSocketId = connectedUsers.get(follower._id.toString());
          if (targetSocketId) {
            const populatedNotification = await Notification.findById(notification._id)
              .populate('sender', 'username profileImage');
            io.to(targetSocketId).emit('new_notification', populatedNotification);
          }
        }
      } catch (error) {
        console.error('새 플레이리스트 알림 실패:', error);
      }
    });
    
    // 매칭 추천 알림
    socket.on('notification_match_suggestion', async (data) => {
      try {
        const { matchUserId, matchRate } = data;
        
        const notification = new Notification({
          recipient: socket.userId,
          sender: matchUserId,
          type: 'match_suggestion',
          message: `${matchRate}% 취향 일치! 새로운 매칭을 확인해보세요`
        });
        
        await notification.save();
        await notification.populate('sender', 'username profileImage');
        
        socket.emit('new_notification', notification);
      } catch (error) {
        console.error('매칭 추천 알림 실패:', error);
      }
    });
    
    // 알림 읽음 처리
    socket.on('mark_notification_read', async (notificationId) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, {
          read: true,
          readAt: new Date()
        });
        
        socket.emit('notification_marked_read', notificationId);
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    });
    
    // 모든 알림 읽음 처리
    socket.on('mark_all_notifications_read', async () => {
      try {
        await Notification.updateMany(
          { recipient: socket.userId, read: false },
          { read: true, readAt: new Date() }
        );
        
        socket.emit('all_notifications_marked_read');
      } catch (error) {
        console.error('모든 알림 읽음 처리 실패:', error);
      }
    });
    
    // 읽지 않은 알림 개수 가져오기
    socket.on('get_unread_notifications_count', async () => {
      try {
        const count = await Notification.countDocuments({
          recipient: socket.userId,
          read: false
        });
        
        socket.emit('unread_notifications_count', count);
      } catch (error) {
        console.error('읽지 않은 알림 개수 조회 실패:', error);
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