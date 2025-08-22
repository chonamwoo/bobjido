const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/notificationController');

// 모든 라우트는 인증 필요
router.use(protect);

router.get('/', getNotifications);
router.put('/:notificationId/read', markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:notificationId', deleteNotification);
router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);

module.exports = router;