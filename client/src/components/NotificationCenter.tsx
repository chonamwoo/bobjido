import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Heart, Bookmark, UserPlus, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';
import axios from '../utils/axios';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Notification {
  _id: string;
  type: 'follow' | 'playlist_like' | 'playlist_save' | 'comment' | 'mention' | 'new_playlist' | 'match_suggestion' | 'message';
  sender: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  message: string;
  relatedPlaylist?: string;
  relatedRestaurant?: string;
  relatedComment?: string;
  read: boolean;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    setupSocketListeners();
    
    return () => {
      socketService.off('new_notification');
      socketService.off('unread_notifications_count');
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      updateUnreadCount(response.data);
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('new_notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // 브라우저 알림 표시 (권한이 있는 경우)
      if (Notification.permission === 'granted') {
        new Notification('BobMap 알림', {
          body: notification.message,
          icon: '/logo192.png',
        });
      }
    });

    socketService.on('unread_notifications_count', (count: number) => {
      setUnreadCount(count);
    });

    socketService.getUnreadNotificationsCount();
  };

  const updateUnreadCount = (notifications: Notification[]) => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      socketService.markNotificationAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      socketService.markAllNotificationsAsRead();
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification._id);
    
    // 알림 타입에 따라 다른 페이지로 이동
    switch (notification.type) {
      case 'follow':
        navigate(`/user/${notification.sender._id}`);
        break;
      case 'playlist_like':
      case 'playlist_save':
      case 'new_playlist':
        if (notification.relatedPlaylist) {
          navigate(`/playlist/${notification.relatedPlaylist}`);
        }
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'match_suggestion':
        navigate('/matching');
        break;
      default:
        break;
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <UserPlus className="w-5 h-5" />;
      case 'playlist_like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'playlist_save':
        return <Bookmark className="w-5 h-5 text-yellow-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'match_suggestion':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="relative">
      {/* 알림 벨 아이콘 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 드롭다운 */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-[500px] overflow-hidden">
            {/* 헤더 */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">알림</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    모두 읽음
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="overflow-y-auto max-h-[400px]">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  로딩 중...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  알림이 없습니다
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 푸터 */}
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  모든 알림 보기
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;