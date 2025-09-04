export interface MediaProgram {
  id: string;
  name: string;
  type: 'tv' | 'youtube' | 'michelin' | 'certification';
  icon?: string;
  description?: string;
}

export const mediaPrograms: MediaProgram[] = [
  // TV Programs
  {
    id: 'black-white-chef',
    name: '흑백요리사',
    type: 'tv',
    icon: '👨‍🍳',
    description: 'Netflix 흑백요리사 출연 레스토랑'
  },
  {
    id: 'daco',
    name: '다코 숨은맛집',
    type: 'tv',
    icon: '🔍',
    description: '다나카가 소개하는 숨은 맛집'
  },
  {
    id: 'sikgaek',
    name: '식객 허영만의 백반기행',
    type: 'tv',
    icon: '🍚',
    description: '허영만 화백이 인정한 백반 맛집'
  },
  {
    id: 'wednesday-food',
    name: '수요미식회',
    type: 'tv',
    icon: '🍴',
    description: '수요미식회 소개 맛집'
  },
  {
    id: 'master-of-life',
    name: '생활의달인',
    type: 'tv',
    icon: '🏆',
    description: 'SBS 생활의달인 선정'
  },
  {
    id: 'sung-si-kyung',
    name: '성시경의 먹을텐데',
    type: 'tv',
    icon: '🎤',
    description: '성시경이 다녀간 맛집'
  },
  {
    id: 'delicious-guys',
    name: '맛있는녀석들',
    type: 'tv',
    icon: '😋',
    description: '맛있는녀석들 방문 맛집'
  },
  {
    id: 'baek-3kings',
    name: '백종원의 3대천왕',
    type: 'tv',
    icon: '👑',
    description: '백종원의 3대천왕 선정'
  },
  {
    id: 'hundred-year-shop',
    name: '백년가게',
    type: 'tv',
    icon: '💯',
    description: 'KBS 백년가게 선정'
  },
  {
    id: 'choi-ja-road',
    name: '최자로드',
    type: 'tv',
    icon: '🛣️',
    description: '최자의 맛집 탐방'
  },
  {
    id: 'omniscient',
    name: '전지적참견시점',
    type: 'tv',
    icon: '👁️',
    description: '전지적참견시점 소개'
  },
  {
    id: 'korean-table',
    name: '한국인의밥상',
    type: 'tv',
    icon: '🥘',
    description: 'KBS 한국인의밥상'
  },
  {
    id: 'baek-alley',
    name: '백종원의 골목식당',
    type: 'tv',
    icon: '🏘️',
    description: '백종원의 골목식당 출연'
  },
  
  // Michelin
  {
    id: 'michelin-star',
    name: '미쉐린 스타',
    type: 'michelin',
    icon: '⭐',
    description: '미쉐린 가이드 스타 레스토랑'
  },
  {
    id: 'michelin-bib',
    name: '미쉐린 빕구르망',
    type: 'michelin',
    icon: '🏅',
    description: '미쉐린 빕구르망 선정'
  },
  {
    id: 'michelin-selected',
    name: '미쉐린 셀렉티드',
    type: 'michelin',
    icon: '📖',
    description: '미쉐린 가이드 셀렉티드'
  },
  
  // YouTube Channels
  {
    id: 'tzuyang',
    name: '쯔양',
    type: 'youtube',
    icon: '🍔',
    description: '먹방 유튜버 쯔양 방문'
  },
  {
    id: 'hamzy',
    name: '햄지',
    type: 'youtube',
    icon: '🥢',
    description: 'ASMR 먹방 햄지 추천'
  },
  {
    id: 'fooking',
    name: '푸킹',
    type: 'youtube',
    icon: '🍜',
    description: '맛집 리뷰어 푸킹 추천'
  },
  {
    id: 'korean-englishman',
    name: '영국남자',
    type: 'youtube',
    icon: '🇬🇧',
    description: '영국남자 소개 맛집'
  },
  {
    id: 'workman',
    name: '워크맨',
    type: 'youtube',
    icon: '💼',
    description: '워크맨 출연 맛집'
  },
  
  // Certifications
  {
    id: 'blue-ribbon',
    name: '블루리본',
    type: 'certification',
    icon: '🎀',
    description: '블루리본 서베이 선정'
  },
  {
    id: 'korea-tourism',
    name: '한국관광공사',
    type: 'certification',
    icon: '🇰🇷',
    description: '한국관광공사 추천 맛집'
  },
  {
    id: 'seoul-food',
    name: '서울시 맛집',
    type: 'certification',
    icon: '🏛️',
    description: '서울시 선정 맛집'
  },
  {
    id: 'food-master',
    name: '대한민국 식품명인',
    type: 'certification',
    icon: '🥇',
    description: '대한민국 식품명인'
  }
];

export const getTrustedSources = () => {
  return {
    tv: mediaPrograms.filter(p => p.type === 'tv'),
    michelin: mediaPrograms.filter(p => p.type === 'michelin'),
    youtube: mediaPrograms.filter(p => p.type === 'youtube'),
    certification: mediaPrograms.filter(p => p.type === 'certification')
  };
};