// 3단계 인증 시스템

export interface CertificationProgram {
  id: string;
  name: string;
  type: 'official' | 'friend' | 'taste-match';
  icon?: string;
  description?: string;
  weight: number; // 신뢰도 가중치 1-10
  color?: string;
}

// 1. 공식 인증 (방송/미쉐린)
export const officialCertifications: CertificationProgram[] = [
  // TV 프로그램
  {
    id: '흑백요리사',
    name: '흑백요리사',
    type: 'official',
    icon: '👨‍🍳',
    description: 'Netflix 흑백요리사 출연',
    weight: 10,
    color: 'black'
  },
  {
    id: '다코숨은맛집',
    name: '다코 숨은맛집',
    type: 'official',
    icon: '🔍',
    description: '다나카가 소개하는 숨은 맛집',
    weight: 8,
    color: 'purple'
  },
  {
    id: '식객허영만의백반기행',
    name: '식객 허영만의 백반기행',
    type: 'official',
    icon: '🍚',
    description: '허영만 화백이 인정한 백반 맛집',
    weight: 9,
    color: 'brown'
  },
  {
    id: '수요미식회',
    name: '수요미식회',
    type: 'official',
    icon: '🍽️',
    description: '수요미식회 소개 맛집',
    weight: 9,
    color: 'blue'
  },
  {
    id: '생활의달인',
    name: '생활의달인',
    type: 'official',
    icon: '🏆',
    description: 'SBS 생활의달인 선정',
    weight: 9,
    color: 'gold'
  },
  {
    id: '성시경의먹을텐데',
    name: '성시경의 먹을텐데',
    type: 'official',
    icon: '🎤',
    description: '성시경이 다녀간 맛집',
    weight: 8,
    color: 'green'
  },
  {
    id: '맛있는녀석들',
    name: '맛있는녀석들',
    type: 'official',
    icon: '😋',
    description: '맛있는녀석들 방문 맛집',
    weight: 7,
    color: 'orange'
  },
  {
    id: '백종원의3대천왕',
    name: '백종원의 3대천왕',
    type: 'official',
    icon: '👑',
    description: '백종원의 3대천왕 선정',
    weight: 8,
    color: 'red'
  },
  {
    id: '백년가게',
    name: '백년가게',
    type: 'official',
    icon: '💯',
    description: 'KBS 백년가게 선정',
    weight: 10,
    color: 'indigo'
  },
  {
    id: '최자로드',
    name: '최자로드',
    type: 'official',
    icon: '🛣️',
    description: '최자의 맛집 탐방',
    weight: 7,
    color: 'teal'
  },
  {
    id: '전지적참견시점',
    name: '전지적참견시점',
    type: 'official',
    icon: '👁️',
    description: '전지적참견시점 소개',
    weight: 7,
    color: 'pink'
  },
  {
    id: '한국인의밥상',
    name: '한국인의밥상',
    type: 'official',
    icon: '🥘',
    description: 'KBS 한국인의밥상',
    weight: 8,
    color: 'amber'
  },
  {
    id: '백종원의골목식당',
    name: '백종원의 골목식당',
    type: 'official',
    icon: '🏘️',
    description: '백종원의 골목식당 출연',
    weight: 7,
    color: 'cyan'
  },
  
  // 미쉐린
  {
    id: '미쉐린스타',
    name: '미쉐린 스타',
    type: 'official',
    icon: '⭐',
    description: '미쉐린 가이드 스타 레스토랑',
    weight: 10,
    color: 'red'
  },
  {
    id: '미쉐린빕구르망',
    name: '미쉐린 빕구르망',
    type: 'official',
    icon: '🏅',
    description: '미쉐린 빕구르망 선정',
    weight: 9,
    color: 'red'
  },
  {
    id: '미쉐린셀렉티드',
    name: '미쉐린 셀렉티드',
    type: 'official',
    icon: '📖',
    description: '미쉐린 가이드 셀렉티드',
    weight: 8,
    color: 'red'
  }
];

// 2. 친구 인증 (소셜 인증)
export const friendCertifications: CertificationProgram[] = [
  {
    id: 'friend-favorite',
    name: '친구들의 단골',
    type: 'friend',
    icon: '👥',
    description: '친구 10명 이상이 추천',
    weight: 7,
    color: 'blue'
  },
  {
    id: 'friend-recommend',
    name: '친구 추천',
    type: 'friend',
    icon: '💬',
    description: '친구가 직접 추천한 맛집',
    weight: 6,
    color: 'green'
  },
  {
    id: 'friend-gathering',
    name: '모임 장소',
    type: 'friend',
    icon: '🎉',
    description: '친구들과 자주 가는 곳',
    weight: 5,
    color: 'purple'
  },
  {
    id: 'friend-discovery',
    name: '친구 발견',
    type: 'friend',
    icon: '💡',
    description: '친구가 발견한 숨은 맛집',
    weight: 6,
    color: 'yellow'
  }
];

// 3. 취향 매칭 인증 (AI/알고리즘 기반)
export const tasteMatchCertifications: CertificationProgram[] = [
  {
    id: 'taste-perfect',
    name: '취향 100% 일치',
    type: 'taste-match',
    icon: '💯',
    description: '당신 취향과 완벽 일치',
    weight: 9,
    color: 'gradient'
  },
  {
    id: 'taste-high',
    name: '취향 90% 일치',
    type: 'taste-match',
    icon: '🎯',
    description: '높은 취향 일치도',
    weight: 8,
    color: 'orange'
  },
  {
    id: 'taste-similar',
    name: '비슷한 취향',
    type: 'taste-match',
    icon: '🤝',
    description: '취향 비슷한 사람들의 선택',
    weight: 7,
    color: 'pink'
  },
  {
    id: 'taste-trending',
    name: '취향 트렌딩',
    type: 'taste-match',
    icon: '📈',
    description: '당신 취향 그룹에서 인기',
    weight: 6,
    color: 'teal'
  },
  {
    id: 'taste-explorer',
    name: '새로운 취향 도전',
    type: 'taste-match',
    icon: '🚀',
    description: '취향 확장 추천',
    weight: 5,
    color: 'indigo'
  }
];

// 전체 인증 프로그램
export const allCertifications: CertificationProgram[] = [
  ...officialCertifications,
  ...friendCertifications,
  ...tasteMatchCertifications
];

// 인증 타입별 그룹
export const certificationGroups = {
  official: {
    title: '공식 인증',
    subtitle: '방송/미쉐린 검증',
    icon: '🏆',
    certifications: officialCertifications
  },
  friend: {
    title: '친구 인증',
    subtitle: '지인들의 추천',
    icon: '👥',
    certifications: friendCertifications
  },
  tasteMatch: {
    title: '취향 인증',
    subtitle: 'AI 취향 매칭',
    icon: '🎯',
    certifications: tasteMatchCertifications
  }
};

// 인증 레벨 계산 (가중치 기반)
export const getCertificationLevel = (certifications: string[]): {
  level: string;
  score: number;
  color: string;
} => {
  if (!certifications || certifications.length === 0) {
    return { level: '미인증', score: 0, color: 'gray' };
  }
  
  let totalScore = 0;
  certifications.forEach(certId => {
    const cert = allCertifications.find(c => c.id === certId);
    if (cert) {
      totalScore += cert.weight;
    }
  });
  
  if (totalScore >= 20) {
    return { level: '레전드', score: totalScore, color: 'gold' };
  } else if (totalScore >= 15) {
    return { level: '명예의전당', score: totalScore, color: 'purple' };
  } else if (totalScore >= 10) {
    return { level: '인증맛집', score: totalScore, color: 'blue' };
  } else if (totalScore >= 5) {
    return { level: '추천맛집', score: totalScore, color: 'green' };
  } else {
    return { level: '일반맛집', score: totalScore, color: 'gray' };
  }
};

// 인증 뱃지 스타일
export const getCertificationBadgeStyle = (type: 'official' | 'friend' | 'taste-match') => {
  switch(type) {
    case 'official':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    case 'friend':
      return 'bg-gradient-to-r from-blue-400 to-purple-500 text-white';
    case 'taste-match':
      return 'bg-gradient-to-r from-pink-400 to-red-500 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};