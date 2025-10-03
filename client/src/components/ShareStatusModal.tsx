import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  EyeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid';

interface ShareReceipt {
  recipientId: string;
  recipientName: string;
  status: 'sent' | 'delivered' | 'read';
  sentAt: string;
  readAt?: string;
}

interface ShareStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareStatusModal: React.FC<ShareStatusModalProps> = ({ isOpen, onClose }) => {
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSentMessages();
    }
  }, [isOpen]);

  const loadSentMessages = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('bobmap_user_data') || '{}');
      const senderId = currentUser.username || '사용자';

      // 모든 종류의 공유 메시지를 가져오기
      const communityMessages = JSON.parse(localStorage.getItem(`messages_sent_by_${senderId}`) || '[]');
      const restaurantShares = JSON.parse(localStorage.getItem(`restaurant_shares_by_${senderId}`) || '[]');
      const playlistShares = JSON.parse(localStorage.getItem(`playlist_shares_by_${senderId}`) || '[]');

      // 모든 공유 내역을 합치기
      const allMessages = [
        ...communityMessages.map((msg: any) => ({ ...msg, shareType: 'community' })),
        ...restaurantShares.map((msg: any) => ({ ...msg, shareType: 'restaurant' })),
        ...playlistShares.map((msg: any) => ({ ...msg, shareType: 'playlist' }))
      ];

      // 시간순으로 정렬 (최신순)
      allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // 각 메시지의 읽음 상태를 실시간으로 확인
      const updatedMessages = allMessages.map((message: any) => {
        const recipientName = message.recipientName;
        const messageId = message.id;

        // 수신자의 메시지를 확인하여 읽음 상태 업데이트
        const recipientMessages = JSON.parse(localStorage.getItem(`messages_to_${recipientName}`) || '[]');
        const recipientMessage = recipientMessages.find((msg: any) => msg.id === messageId);

        if (recipientMessage && recipientMessage.read) {
          return {
            ...message,
            status: 'read',
            readAt: recipientMessage.readAt || new Date().toISOString()
          };
        }

        return message;
      });

      setSentMessages(updatedMessages);
    } catch (error) {
      console.error('Failed to load sent messages:', error);
      setSentMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
      case 'delivered':
        return <CheckIcon className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <CheckSolidIcon className="w-4 h-4 text-green-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return '전송됨';
      case 'delivered':
        return '전달됨';
      case 'read':
        return '읽음';
      default:
        return '대기중';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-gray-600 bg-gray-100';
      case 'delivered':
        return 'text-blue-600 bg-blue-100';
      case 'read':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-400 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const getShareTypeInfo = (shareType: string) => {
    switch (shareType) {
      case 'community':
        return { icon: '📝', label: '커뮤니티 포스트', bgColor: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' };
      case 'restaurant':
        return { icon: '🍽️', label: '맛집', bgColor: 'bg-orange-50 border-orange-200', textColor: 'text-orange-800' };
      case 'playlist':
        return { icon: '📋', label: '맛집 리스트', bgColor: 'bg-purple-50 border-purple-200', textColor: 'text-purple-800' };
      default:
        return { icon: '📤', label: '공유', bgColor: 'bg-gray-50 border-gray-200', textColor: 'text-gray-800' };
    }
  };

  const getContentTitle = (message: any) => {
    switch (message.shareType) {
      case 'community':
        return message.post?.title || '커뮤니티 포스트';
      case 'restaurant':
        return message.restaurant?.name || '맛집 정보';
      case 'playlist':
        return message.playlist?.title || '맛집 리스트';
      default:
        return '공유 항목';
    }
  };

  const getContentDescription = (message: any) => {
    switch (message.shareType) {
      case 'community':
        return message.post?.content;
      case 'restaurant':
        return `${message.restaurant?.category} · ${message.restaurant?.address}`;
      case 'playlist':
        return `${message.playlist?.restaurants?.length || 0}개 맛집`;
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100001] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md max-h-[80vh] rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">공유 상태</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">로딩 중...</p>
            </div>
          ) : sentMessages.length > 0 ? (
            <div className="p-4 space-y-4">
              {sentMessages.map((message, index) => {
                const typeInfo = getShareTypeInfo(message.shareType);
                return (
                  <div key={index} className={`${typeInfo.bgColor} border rounded-lg p-4`}>
                    {/* 공유 타입과 제목 */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} font-medium`}>
                          {typeInfo.label}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm text-gray-900 mb-1">
                        {getContentTitle(message)}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {getContentDescription(message)}
                      </p>
                    </div>

                    {/* 수신자 정보 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{message.recipientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(message.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)}`}>
                          {getStatusText(message.status)}
                        </span>
                      </div>
                    </div>

                    {/* 전송 시간 */}
                    <div className="text-xs text-gray-500">
                      <span>전송: {formatTime(message.timestamp)}</span>
                      {message.readAt && (
                        <span className="ml-3">
                          읽음: {formatTime(message.readAt)}
                        </span>
                      )}
                    </div>

                    {/* 함께 보낸 메시지 */}
                    {message.message && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="text-xs text-gray-700">
                          💬 "{message.message}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">공유한 항목이 없습니다</h3>
              <p className="text-sm text-gray-500">
                맛집, 리스트, 커뮤니티 포스트를 공유하면 여기서 전송 상태를 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>전송됨</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckIcon className="w-3 h-3 text-blue-500" />
              <span>전달됨</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckSolidIcon className="w-3 h-3 text-green-500" />
              <span>읽음</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareStatusModal;