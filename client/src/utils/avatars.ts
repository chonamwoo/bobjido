// UI Avatars 서비스 사용 - 더 안정적이고 빠른 아바타 생성
const AVATAR_COLORS = [
  '5e72e4', // 파란색
  'f5365c', // 빨간색  
  '2dce89', // 초록색
  'fb6340', // 주황색
  '11cdef', // 하늘색
  'ffd600', // 노란색
  '8965e0', // 보라색
  'f53794', // 분홍색
];

/**
 * 사용자명을 기반으로 일관된 기본 아바타를 반환합니다
 * @param username 사용자명
 * @param size 이미지 크기 (기본값: 150)
 * @returns 아바타 URL
 */
export const getDefaultAvatar = (username: string, size: number = 150): string => {
  // 사용자명을 기반으로 일관된 색상 선택
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    const char = username.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];
  
  // UI Avatars API 사용 - 이름 기반 아바타 생성
  const name = encodeURIComponent(username.substring(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${name}&size=${size}&background=${backgroundColor}&color=fff&bold=true&font-size=0.4`;
};

/**
 * 랜덤 기본 아바타를 반환합니다
 * @param size 이미지 크기 (기본값: 150)
 * @returns 아바타 URL
 */
export const getRandomAvatar = (size: number = 150): string => {
  const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
  const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                       String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `https://ui-avatars.com/api/?name=${randomLetters}&size=${size}&background=${randomColor}&color=fff&bold=true&font-size=0.4`;
};