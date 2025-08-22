import React from 'react';
import {
  CheckBadgeIcon,
  PhoneIcon,
  IdentificationIcon,
  StarIcon,
  ShieldCheckIcon,
  FireIcon,
  HeartIcon,
  TrophyIcon
} from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface UserTrustProfile {
  userId: string;
  username: string;
  mannerScore: number; // 0-100
  verifications: {
    phone: boolean;
    email: boolean;
    identity: boolean;
    social: boolean;
  };
  badges: string[];
  reviewCount: number;
  successfulMeetings: number;
  reportCount: number;
  joinedDate: string;
}

interface TrustBadgeProps {
  type: 'phone' | 'email' | 'identity' | 'social' | 'premium' | 'top-matcher';
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const badges = {
    phone: {
      icon: PhoneIcon,
      color: 'text-green-500',
      bg: 'bg-green-100',
      label: '전화번호 인증'
    },
    email: {
      icon: CheckBadgeIcon,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      label: '이메일 인증'
    },
    identity: {
      icon: IdentificationIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      label: '본인 인증'
    },
    social: {
      icon: CheckBadgeIcon,
      color: 'text-sky-500',
      bg: 'bg-sky-100',
      label: '소셜 계정 연동'
    },
    premium: {
      icon: TrophyIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100',
      label: '프리미엄 회원'
    },
    'top-matcher': {
      icon: FireIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-100',
      label: '인기 매처'
    }
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center justify-center ${badge.bg} rounded-full p-1`} title={badge.label}>
      <Icon className={`${sizeClasses[size]} ${badge.color}`} />
    </div>
  );
};

interface MannerScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MannerScore: React.FC<MannerScoreProps> = ({ score, size = 'md', showLabel = true }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '😊';
    if (score >= 70) return '🙂';
    if (score >= 50) return '😐';
    return '😔';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`inline-flex items-center gap-1 ${getScoreColor(score)} border rounded-full ${sizeClasses[size]} font-semibold`}>
      <span>{getScoreEmoji(score)}</span>
      <span>{score}점</span>
      {showLabel && <span className="text-xs opacity-75">매너</span>}
    </div>
  );
};

interface TrustSummaryProps {
  profile: UserTrustProfile;
  detailed?: boolean;
}

export const TrustSummary: React.FC<TrustSummaryProps> = ({ profile, detailed = false }) => {
  const verifiedCount = Object.values(profile.verifications).filter(v => v).length;
  const trustLevel = verifiedCount >= 3 ? '높음' : verifiedCount >= 2 ? '보통' : '낮음';
  const trustColor = verifiedCount >= 3 ? 'text-green-600' : verifiedCount >= 2 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
          신뢰도 정보
        </h3>
        <span className={`text-sm font-medium ${trustColor}`}>
          {trustLevel}
        </span>
      </div>

      {/* 매너 점수 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">매너 점수</span>
        <MannerScore score={profile.mannerScore} size="sm" />
      </div>

      {/* 인증 배지 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">인증 상태</span>
        <div className="flex gap-1">
          {profile.verifications.phone && <TrustBadge type="phone" size="sm" />}
          {profile.verifications.email && <TrustBadge type="email" size="sm" />}
          {profile.verifications.identity && <TrustBadge type="identity" size="sm" />}
          {profile.verifications.social && <TrustBadge type="social" size="sm" />}
        </div>
      </div>

      {detailed && (
        <>
          {/* 활동 통계 */}
          <div className="border-t pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">성공한 만남</span>
              <span className="font-medium">{profile.successfulMeetings}회</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">받은 리뷰</span>
              <span className="font-medium">{profile.reviewCount}개</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">가입일</span>
              <span className="font-medium">{new Date(profile.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* 경고 */}
          {profile.reportCount > 0 && (
            <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600">
                신고 이력 {profile.reportCount}건
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface SafetyTipsProps {
  context: 'before-meeting' | 'during-meeting' | 'after-meeting';
}

export const SafetyTips: React.FC<SafetyTipsProps> = ({ context }) => {
  const tips = {
    'before-meeting': [
      '상대방의 인증 배지와 매너 점수를 확인하세요',
      '공개된 장소에서 만나기로 약속하세요',
      '만남 전 채팅으로 충분히 대화를 나누세요',
      '친구나 가족에게 만남 장소와 시간을 알려주세요'
    ],
    'during-meeting': [
      '처음엔 공개된 장소에서 만나세요',
      '개인정보를 과도하게 공유하지 마세요',
      '불편하면 즉시 자리를 떠나세요',
      '음주는 적당히 하세요'
    ],
    'after-meeting': [
      '매너 평가를 정직하게 작성해주세요',
      '문제가 있었다면 신고 기능을 이용하세요',
      '좋은 경험이었다면 리뷰를 남겨주세요',
      '다음 만남은 신중하게 결정하세요'
    ]
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5" />
        안전 수칙
      </h4>
      <ul className="space-y-1">
        {tips[context].map((tip, index) => (
          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default {
  TrustBadge,
  MannerScore,
  TrustSummary,
  SafetyTips
};