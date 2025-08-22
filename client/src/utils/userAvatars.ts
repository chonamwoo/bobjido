// 사용자 프로필 이미지 관리 유틸리티
// 실제 사람 사진들을 사용하여 더 현실적인 프로필 이미지 제공

const AVATAR_IMAGES = {
  // 남성 프로필 이미지
  male: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', // 친근한 남성
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', // 정장 남성
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80', // 캐주얼 남성
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80', // 스마일 남성
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', // 비즈니스 남성
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80', // 젊은 남성
    'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&q=80', // 안경 남성
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', // 캐주얼2
    'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=400&q=80', // 정장2
    'https://images.unsplash.com/photo-1507081323647-4d250478b919?w=400&q=80', // 웃는 남성
  ],
  // 여성 프로필 이미지
  female: [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', // 친근한 여성
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', // 프로페셔널
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', // 웃는 여성
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80', // 클로즈업
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80', // 안경 여성
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', // 모델
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80', // 캐주얼
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80', // 비즈니스
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80', // 자연스러운
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80', // 세련된
  ],
  // 중성적/다양한 프로필 이미지
  neutral: [
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', // 프로페셔널
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', // 웃는 얼굴
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80', // 남성2
    'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&q=80', // 여성2
    'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=400&q=80', // 다양성
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', // 비즈니스2
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', // 정장3
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80', // 웃는 남성2
    'https://images.unsplash.com/photo-1582015752624-e8b1c75e4b14?w=400&q=80', // 캐주얼3
    'https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=400&q=80', // 여성3
  ],
  // 미식가/음식 관련 테마 프로필
  foodie: [
    'https://images.unsplash.com/photo-1583394293214-28ded15ee3c4?w=400&q=80', // 셰프
    'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=400&q=80', // 바리스타
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80', // 요리하는 사람
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', // 베이커
    'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80', // 웃는 셰프
  ]
};

// 사용자명을 기반으로 일관된 아바타 선택
export const getUserAvatar = (username: string, category?: 'male' | 'female' | 'neutral' | 'foodie'): string => {
  // 사용자명 해시 생성
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // 카테고리가 지정되지 않았다면 모든 이미지 풀에서 선택
  if (!category) {
    const allImages = [
      ...AVATAR_IMAGES.male,
      ...AVATAR_IMAGES.female,
      ...AVATAR_IMAGES.neutral,
      ...AVATAR_IMAGES.foodie
    ];
    const index = Math.abs(hash) % allImages.length;
    return allImages[index];
  }
  
  // 특정 카테고리에서 선택
  const categoryImages = AVATAR_IMAGES[category];
  const index = Math.abs(hash) % categoryImages.length;
  return categoryImages[index];
};

// 기본 아바타 (로딩 실패시 폴백)
export const getDefaultAvatar = (): string => {
  return AVATAR_IMAGES.neutral[0];
};

// 랜덤 아바타 선택 (신규 사용자용)
export const getRandomAvatar = (category?: 'male' | 'female' | 'neutral' | 'foodie'): string => {
  if (!category) {
    const allImages = [
      ...AVATAR_IMAGES.male,
      ...AVATAR_IMAGES.female,
      ...AVATAR_IMAGES.neutral,
      ...AVATAR_IMAGES.foodie
    ];
    return allImages[Math.floor(Math.random() * allImages.length)];
  }
  
  const categoryImages = AVATAR_IMAGES[category];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

// 매칭 페이지용 아바타 (취향 프로필 기반)
export const getMatchAvatar = (username: string, tasteProfile?: string): string => {
  // 취향 프로필에 따라 카테고리 선택
  let category: 'male' | 'female' | 'neutral' | 'foodie' = 'neutral';
  
  if (tasteProfile) {
    if (tasteProfile.includes('셰프') || tasteProfile.includes('미식가') || tasteProfile.includes('요리')) {
      category = 'foodie';
    }
  }
  
  return getUserAvatar(username, category);
};

// 그룹 멤버 아바타 목록 생성
export const getGroupMemberAvatars = (count: number = 3): string[] => {
  const avatars: string[] = [];
  const allImages = [
    ...AVATAR_IMAGES.male,
    ...AVATAR_IMAGES.female,
    ...AVATAR_IMAGES.neutral
  ];
  
  // 중복 없이 선택
  const selectedIndices = new Set<number>();
  while (avatars.length < count && avatars.length < allImages.length) {
    const index = Math.floor(Math.random() * allImages.length);
    if (!selectedIndices.has(index)) {
      selectedIndices.add(index);
      avatars.push(allImages[index]);
    }
  }
  
  return avatars;
};

export default AVATAR_IMAGES;