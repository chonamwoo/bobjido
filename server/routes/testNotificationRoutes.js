const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getIo } = require('../websocket');

// 테스트 알림 생성 엔드포인트
router.post('/create-test', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const io = getIo();
    
    // 다양한 테스트 알림 생성
    const testNotifications = [
      {
        recipient: userId,
        sender: userId,
        type: 'follow',
        message: '테스트 사용자님이 회원님을 팔로우했습니다',
        read: false
      },
      {
        recipient: userId,
        sender: userId,
        type: 'playlist_like',
        message: '누군가 "맛집 플레이리스트"를 좋아합니다',
        read: false
      },
      {
        recipient: userId,
        sender: userId,
        type: 'comment',
        message: '새로운 댓글이 달렸습니다',
        read: false
      },
      {
        recipient: userId,
        sender: userId,
        type: 'match_suggestion',
        message: '85% 취향 일치! 새로운 매칭을 확인해보세요',
        read: false
      }
    ];
    
    // 알림을 데이터베이스에 저장
    const savedNotifications = [];
    for (const notificationData of testNotifications) {
      const notification = new Notification(notificationData);
      await notification.save();
      await notification.populate('sender', 'username profileImage');
      savedNotifications.push(notification);
      
      // WebSocket으로 실시간 전송
      const connectedUsers = require('../websocket').getConnectedUsers ? 
        require('../websocket').getConnectedUsers() : [];
      
      if (connectedUsers.includes(userId.toString())) {
        io.to(userId.toString()).emit('new_notification', notification);
      }
    }
    
    res.json({
      success: true,
      message: `${savedNotifications.length}개의 테스트 알림이 생성되었습니다`,
      notifications: savedNotifications
    });
  } catch (error) {
    console.error('테스트 알림 생성 실패:', error);
    res.status(500).json({
      success: false,
      message: '테스트 알림 생성에 실패했습니다',
      error: error.message
    });
  }
});

// 모든 알림 삭제 (테스트용)
router.delete('/clear-all', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await Notification.deleteMany({ recipient: userId });
    
    res.json({
      success: true,
      message: `${result.deletedCount}개의 알림이 삭제되었습니다`
    });
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    res.status(500).json({
      success: false,
      message: '알림 삭제에 실패했습니다'
    });
  }
});

module.exports = router;