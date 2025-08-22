const Notification = require('../models/Notification');

// 알림 목록 조회
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username profileImage')
      .populate('relatedPlaylist', 'title')
      .populate('relatedRestaurant', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      read: false 
    });

    res.json({
      notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: '알림 조회 중 오류가 발생했습니다.' });
  }
};

// 알림 읽음 처리
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: '알림을 찾을 수 없습니다.' });
    }

    res.json({ message: '알림을 읽음 처리했습니다.', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: '알림 읽음 처리 중 오류가 발생했습니다.' });
  }
};

// 모든 알림 읽음 처리
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: '모든 알림을 읽음 처리했습니다.' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: '알림 읽음 처리 중 오류가 발생했습니다.' });
  }
};

// 알림 삭제
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ message: '알림을 찾을 수 없습니다.' });
    }

    res.json({ message: '알림을 삭제했습니다.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: '알림 삭제 중 오류가 발생했습니다.' });
  }
};

// 알림 설정 조회
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 사용자의 알림 설정 조회 (User 모델에 추가 필요)
    const user = await User.findById(userId).select('notificationSettings');
    
    res.json({
      settings: user.notificationSettings || {
        follow: true,
        playlistLike: true,
        restaurantReview: true,
        comment: true,
        mention: true,
        playlistSave: true
      }
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ message: '알림 설정 조회 중 오류가 발생했습니다.' });
  }
};

// 알림 설정 업데이트
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { settings } = req.body;

    await User.findByIdAndUpdate(userId, {
      notificationSettings: settings
    });

    res.json({ message: '알림 설정이 업데이트되었습니다.', settings });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ message: '알림 설정 업데이트 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings
};