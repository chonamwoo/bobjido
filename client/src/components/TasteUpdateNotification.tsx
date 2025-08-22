import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

interface TasteUpdateNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  newTasteProfile: {
    type: string;
    title: string;
    emoji: string;
    description: string;
    confidence: number; // 확신도 (%)
  };
  reason: string; // 변화 이유
}

const TasteUpdateNotification: React.FC<TasteUpdateNotificationProps> = ({
  isVisible,
  onClose,
  newTasteProfile,
  reason
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateUser } = useAuthStore();

  const handleUpdateTaste = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.post('/api/taste-profile/update', {
        newProfileType: newTasteProfile.type
      });

      if (response.data.success) {
        updateUser({
          ...user!,
          tasteProfile: newTasteProfile.type
        });
        
        toast.success('취향이 업데이트되었습니다! ✨');
        onClose();
      }
    } catch (error) {
      toast.error('업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* 알림 모달 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* 헤더 */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  {newTasteProfile.emoji}
                </motion.div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <SparklesIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-purple-600 font-medium">취향 변화 감지!</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800">
                  이런 쪽을 좋아하시네요!
                </h2>
              </div>

              {/* 새로운 취향 프로필 */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <h3 className="font-semibold text-lg mb-2 text-center">
                  {newTasteProfile.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-3">
                  {newTasteProfile.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-xs text-purple-600">
                    확신도: {newTasteProfile.confidence}%
                  </div>
                </div>
              </div>

              {/* 변화 이유 */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">변화 이유: </span>
                  {reason}
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  나중에
                </button>
                <button
                  onClick={handleUpdateTaste}
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>업데이트</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TasteUpdateNotification;