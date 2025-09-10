const Message = require('../models/Message');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const User = require('../models/User');

// 온라인 사용자 관리
const onlineUsers = new Map();

const socketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // 사용자 인증 및 온라인 상태 설정
    socket.on('authenticate', async (userId) => {
      try {
        socket.userId = userId;
        onlineUsers.set(userId, socket.id);
        
        // 사용자를 개인 룸에 참여시킴
        socket.join(userId);
        
        // 온라인 상태 브로드캐스트
        socket.broadcast.emit('userOnline', userId);
        
        // 읽지 않은 메시지 수 전송
        const unreadCount = await Message.countDocuments({
          receiver: userId,
          read: false
        });
        
        socket.emit('unreadMessages', unreadCount);
        
        // 읽지 않은 알림 수 전송
        const unreadNotifications = await Notification.countDocuments({
          recipient: userId,
          read: false
        });
        
        socket.emit('unreadNotifications', unreadNotifications);
        
      } catch (error) {
        console.error('Authentication error:', error);
      }
    });

    // 채팅방 참여
    socket.on('joinChat', async (chatId) => {
      try {
        socket.join(chatId);
        
        // 채팅방의 이전 메시지 로드
        const messages = await Message.find({ chat: chatId })
          .populate('sender', 'username profileImage')
          .sort({ createdAt: -1 })
          .limit(50);
        
        socket.emit('previousMessages', messages.reverse());
      } catch (error) {
        console.error('Join chat error:', error);
      }
    });

    // 메시지 전송
    socket.on('sendMessage', async (data) => {
      try {
        const { chatId, content, type = 'text', additionalData } = data;
        
        // 채팅방 확인
        const chat = await Chat.findById(chatId);
        if (!chat) {
          return socket.emit('error', 'Chat not found');
        }
        
        // 메시지 생성
        const message = new Message({
          chat: chatId,
          sender: socket.userId,
          content,
          type,
          ...additionalData
        });
        
        await message.save();
        
        // 메시지 정보 가져오기
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username profileImage');
        
        // 채팅방 업데이트
        chat.lastMessage = message._id;
        await chat.save();
        
        // 채팅방의 모든 참여자에게 메시지 전송
        io.to(chatId).emit('newMessage', populatedMessage);
        
        // 수신자에게 알림 생성
        const receivers = chat.participants.filter(
          p => p.toString() !== socket.userId
        );
        
        for (const receiverId of receivers) {
          // 알림 생성
          const notification = new Notification({
            recipient: receiverId,
            sender: socket.userId,
            type: 'message',
            message: `새 메시지: ${content.substring(0, 50)}...`
          });
          
          await notification.save();
          
          // 실시간 알림 전송
          const receiverSocketId = onlineUsers.get(receiverId.toString());
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('newNotification', notification);
          }
        }
        
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // 메시지 읽음 처리
    socket.on('markAsRead', async (messageIds) => {
      try {
        await Message.updateMany(
          { 
            _id: { $in: messageIds },
            receiver: socket.userId
          },
          { 
            read: true,
            readAt: new Date()
          }
        );
        
        socket.emit('messagesMarkedAsRead', messageIds);
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    // 타이핑 상태
    socket.on('typing', ({ chatId, isTyping }) => {
      socket.to(chatId).emit('userTyping', {
        userId: socket.userId,
        isTyping
      });
    });

    // 알림 생성 헬퍼 함수
    const createNotification = async (type, recipientId, senderId, message, relatedData = {}) => {
      try {
        const notification = new Notification({
          recipient: recipientId,
          sender: senderId,
          type,
          message,
          ...relatedData
        });
        
        await notification.save();
        
        // 실시간 알림 전송
        const receiverSocketId = onlineUsers.get(recipientId.toString());
        if (receiverSocketId) {
          const populatedNotification = await Notification.findById(notification._id)
            .populate('sender', 'username profileImage');
          io.to(receiverSocketId).emit('newNotification', populatedNotification);
        }
        
        return notification;
      } catch (error) {
        console.error('Create notification error:', error);
      }
    };

    // 팔로우 알림
    socket.on('followUser', async (targetUserId) => {
      try {
        const user = await User.findById(socket.userId);
        await createNotification(
          'follow',
          targetUserId,
          socket.userId,
          `${user.username}님이 회원님을 팔로우했습니다`
        );
      } catch (error) {
        console.error('Follow notification error:', error);
      }
    });

    // 플레이리스트 좋아요 알림
    socket.on('likePlaylist', async ({ playlistId, ownerId }) => {
      try {
        const user = await User.findById(socket.userId);
        await createNotification(
          'playlist_like',
          ownerId,
          socket.userId,
          `${user.username}님이 회원님의 플레이리스트를 좋아합니다`,
          { relatedPlaylist: playlistId }
        );
      } catch (error) {
        console.error('Like notification error:', error);
      }
    });

    // 플레이리스트 저장 알림
    socket.on('savePlaylist', async ({ playlistId, ownerId }) => {
      try {
        const user = await User.findById(socket.userId);
        await createNotification(
          'playlist_save',
          ownerId,
          socket.userId,
          `${user.username}님이 회원님의 플레이리스트를 저장했습니다`,
          { relatedPlaylist: playlistId }
        );
      } catch (error) {
        console.error('Save notification error:', error);
      }
    });

    // 새 플레이리스트 알림 (팔로워에게)
    socket.on('newPlaylist', async (playlistId) => {
      try {
        const user = await User.findById(socket.userId).populate('followers');
        
        for (const follower of user.followers) {
          await createNotification(
            'new_playlist',
            follower._id,
            socket.userId,
            `${user.username}님이 새 플레이리스트를 만들었습니다`,
            { relatedPlaylist: playlistId }
          );
        }
      } catch (error) {
        console.error('New playlist notification error:', error);
      }
    });

    // 매칭 추천 알림
    socket.on('checkMatchSuggestions', async () => {
      try {
        const user = await User.findById(socket.userId);
        
        // 매칭율이 높은 사용자 찾기 (예: 80% 이상)
        const potentialMatches = await User.find({
          _id: { $ne: socket.userId },
          'tasteProfile.type': user.tasteProfile.type
        }).limit(5);
        
        for (const match of potentialMatches) {
          // 매칭율 계산 (간단한 예시)
          const matchRate = calculateMatchRate(user.tasteProfile, match.tasteProfile);
          
          if (matchRate > 80) {
            await createNotification(
              'match_suggestion',
              socket.userId,
              match._id,
              `${match.username}님과 취향이 ${matchRate}% 일치합니다!`
            );
          }
        }
      } catch (error) {
        console.error('Match suggestion error:', error);
      }
    });

    // 알림 읽음 처리
    socket.on('markNotificationAsRead', async (notificationId) => {
      try {
        await Notification.findByIdAndUpdate(notificationId, {
          read: true,
          readAt: new Date()
        });
        
        socket.emit('notificationMarkedAsRead', notificationId);
      } catch (error) {
        console.error('Mark notification as read error:', error);
      }
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        socket.broadcast.emit('userOffline', socket.userId);
      }
    });
  });
};

// 매칭율 계산 함수
function calculateMatchRate(profile1, profile2) {
  if (!profile1 || !profile2) return 0;
  
  let score = 0;
  let total = 0;
  
  // 타입 일치
  if (profile1.type === profile2.type) score += 30;
  total += 30;
  
  // 선호도 비교
  const preferences = ['spicyLevel', 'priceRange', 'adventurous', 'atmosphere'];
  preferences.forEach(pref => {
    if (profile1[pref] && profile2[pref]) {
      const diff = Math.abs(profile1[pref] - profile2[pref]);
      score += Math.max(0, 10 - diff * 2);
      total += 10;
    }
  });
  
  // 카테고리 선호도 비교
  if (profile1.categories && profile2.categories) {
    const common = profile1.categories.filter(c => 
      profile2.categories.includes(c)
    ).length;
    score += (common / Math.max(profile1.categories.length, profile2.categories.length)) * 30;
    total += 30;
  }
  
  return Math.round((score / total) * 100);
}

module.exports = socketHandlers;