import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  FlagIcon,
  NoSymbolIcon,
  ShieldExclamationIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
  };
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetUser }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'no-show', label: '약속 불이행 (노쇼)', icon: '🚫' },
    { value: 'inappropriate', label: '부적절한 행동', icon: '⚠️' },
    { value: 'harassment', label: '욕설 또는 괴롭힘', icon: '😠' },
    { value: 'fake-profile', label: '허위 프로필', icon: '🎭' },
    { value: 'spam', label: '스팸 또는 광고', icon: '📧' },
    { value: 'safety', label: '안전 우려', icon: '🚨' },
    { value: 'other', label: '기타', icon: '📝' }
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('신고 사유를 선택해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('/api/safety/report', {
        targetUserId: targetUser.id,
        reason,
        description
      });

      toast.success('신고가 접수되었습니다');
      onClose();
    } catch (error) {
      toast.error('신고 처리 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FlagIcon className="w-6 h-6 text-red-500" />
              사용자 신고
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold">{targetUser.username}</span>님을 신고하는 이유를 선택해주세요
          </p>

          {/* 신고 사유 선택 */}
          <div className="space-y-2 mb-4">
            {reportReasons.map((item) => (
              <label
                key={item.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  reason === item.value
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={item.value}
                  checked={reason === item.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="sr-only"
                />
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          {/* 추가 설명 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 설명 (선택사항)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
              rows={3}
              placeholder="구체적인 상황을 설명해주세요..."
            />
          </div>

          {/* 경고 메시지 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
              허위 신고는 제재 대상이 될 수 있습니다
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '신고하기'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface BlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
  };
  onConfirm: () => void;
}

export const BlockConfirmModal: React.FC<BlockConfirmModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onConfirm
}) => {
  const [isBlocking, setIsBlocking] = useState(false);

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await axios.post('/api/safety/block', {
        targetUserId: targetUser.id
      });

      toast.success(`${targetUser.username}님을 차단했습니다`);
      onConfirm();
      onClose();
    } catch (error) {
      toast.error('차단 처리 중 오류가 발생했습니다');
    } finally {
      setIsBlocking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-sm w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <NoSymbolIcon className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              사용자 차단
            </h2>

            <p className="text-gray-600 mb-6">
              <span className="font-semibold">{targetUser.username}</span>님을 차단하시겠습니까?
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2 font-medium">차단 시:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 서로 매칭되지 않습니다</li>
                <li>• 메시지를 주고받을 수 없습니다</li>
                <li>• 상대방의 프로필을 볼 수 없습니다</li>
                <li>• 설정에서 차단 해제 가능합니다</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleBlock}
                disabled={isBlocking}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isBlocking ? '처리 중...' : '차단하기'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface SafetyButtonsProps {
  targetUser: {
    id: string;
    username: string;
  };
  size?: 'sm' | 'md';
}

export const SafetyButtons: React.FC<SafetyButtonsProps> = ({ targetUser, size = 'md' }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-3 py-1.5' 
    : 'text-sm px-4 py-2';

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowReportModal(true)}
          className={`${sizeClasses} border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2`}
        >
          <FlagIcon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
          신고
        </button>
        <button
          onClick={() => setShowBlockModal(true)}
          className={`${sizeClasses} border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2`}
        >
          <NoSymbolIcon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
          차단
        </button>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetUser={targetUser}
      />

      <BlockConfirmModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        targetUser={targetUser}
        onConfirm={() => {}}
      />
    </>
  );
};

interface VerificationPromptProps {
  type: 'phone' | 'identity';
  onVerify: () => void;
  onSkip: () => void;
}

export const VerificationPrompt: React.FC<VerificationPromptProps> = ({ type, onVerify, onSkip }) => {
  const prompts = {
    phone: {
      title: '전화번호 인증으로 신뢰도를 높이세요',
      description: '인증된 사용자는 더 많은 매칭 기회를 얻을 수 있습니다',
      icon: '📱',
      benefit: '매칭률 30% 증가'
    },
    identity: {
      title: '본인 인증으로 안전한 만남을 보장하세요',
      description: '본인 인증 완료 시 프리미엄 배지를 받을 수 있습니다',
      icon: '🆔',
      benefit: '신뢰도 최고 등급'
    }
  };

  const prompt = prompts[type];

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
      <div className="flex items-start gap-4">
        <div className="text-3xl">{prompt.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{prompt.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium mb-4">
            <CheckCircleIcon className="w-3 h-3" />
            {prompt.benefit}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onVerify}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              지금 인증하기
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              나중에
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  ReportModal,
  BlockConfirmModal,
  SafetyButtons,
  VerificationPrompt
};