import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getUserAvatar } from '../utils/userAvatars';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  SparklesIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  StarIcon,
  BellIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'match' | 'buddy_request' | 'restaurant_share' | 'review' | 'message';
  from: {
    id: string;
    username: string;
    profileImage?: string;
  };
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const Notifications: React.FC = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      from: {
        id: 'user1',
        username: '맛집탐험가',
        profileImage: undefined
      },
      message: '님과 취향이 매칭되었습니다! 82% 일치',
      link: '/matches',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30분 전
    },
    {
      id: '2',
      type: 'follow',
      from: {
        id: 'user2',
        username: '푸드러버',
        profileImage: undefined
      },
      message: '님이 회원님을 팔로우하기 시작했습니다',
      link: '/profile/푸드러버',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2시간 전
    },
    {
      id: '3',
      type: 'buddy_request',
      from: {
        id: 'user3',
        username: '카페투어',
        profileImage: undefined
      },
      message: '님이 오늘 저녁 동행을 제안했습니다',
      link: '/dining-buddy',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5시간 전
    },
    {
      id: '4',
      type: 'restaurant_share',
      from: {
        id: 'user4',
        username: '이태원맛집',
        profileImage: undefined
      },
      message: '님이 새로운 맛집을 공유했습니다',
      link: '/restaurant-exchange',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1일 전
    },
    {
      id: '5',
      type: 'review',
      from: {
        id: 'user5',
        username: '미식가',
        profileImage: undefined
      },
      message: '님이 회원님의 맛집에 리뷰를 남겼습니다',
      link: '/my-restaurants',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2일 전
    },
    {
      id: '6',
      type: 'like',
      from: {
        id: 'user6',
        username: '스시매니아',
        profileImage: undefined
      },
      message: '님이 회원님의 맛집 리스트를 좋아합니다',
      link: '/my-lists',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3일 전
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlusIcon className="w-5 h-5 text-blue-500" />;
      case 'match':
        return <SparklesIcon className="w-5 h-5 text-emerald-500" />;
      case 'buddy_request':
        return <UsersIcon className="w-5 h-5 text-teal-500" />;
      case 'restaurant_share':
        return <BuildingStorefrontIcon className="w-5 h-5 text-purple-500" />;
      case 'review':
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      case 'message':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      {/* 헤더 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
              <BellIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">알림</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">읽지 않은 알림 {unreadCount}개</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-2"
            >
              <CheckIcon className="w-4 h-4" />
              모두 읽음 표시
            </button>
          )}
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 알림
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'unread'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            읽지 않음 {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all ${
                !notification.isRead ? 'border-l-4 border-l-emerald-500' : ''
              }`}
            >
              <Link
                to={notification.link || '#'}
                onClick={() => markAsRead(notification.id)}
                className="flex items-start gap-4"
              >
                {/* 프로필 이미지 */}
                <div className="relative">
                  <img
                    src={notification.from.profileImage || getUserAvatar(notification.from.username)}
                    alt={notification.from.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-semibold">{notification.from.username}</span>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(notification.createdAt, { 
                      addSuffix: true,
                      locale: ko 
                    })}
                  </p>
                </div>

                {/* 읽지 않음 표시 */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                )}
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </p>
          </div>
        )}
      </div>

      {/* 이전 알림 더보기 */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
            이전 알림 더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;