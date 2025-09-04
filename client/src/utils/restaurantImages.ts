// 카테고리별 실제 음식 이미지 URL (고품질 이미지 사용)
const FOOD_IMAGES = {
  // 한식 - 더 다양한 한식 이미지
  korean: [
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80', // 김치찌개
    'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800&q=80', // 한식 상차림
    'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=800&q=80', // 삼겹살
    'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80', // 불고기
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&q=80', // 전골
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80', // 갈비찜
    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80', // 된장찌개
    'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&q=80', // 김밥
  ],
  // 일식
  japanese: [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80', // 스시
    'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80', // 라멘
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', // 돈부리
    'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&q=80', // 우동
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', // 텐동
  ],
  // 중식
  chinese: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', // 탕수육
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80', // 짜장면
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80', // 마라탕
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80', // 딤섬
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&q=80', // 짬뽕
  ],
  // 양식/이탈리안
  italian: [
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80', // 파스타
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', // 피자
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', // 스테이크
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // 리조또
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', // 파스타2
  ],
  // 카페/브런치
  cafe: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', // 커피
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80', // 브런치
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80', // 카페 라떼
    'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80', // 팬케이크
    'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=800&q=80', // 토스트
  ],
  // 디저트/베이커리
  dessert: [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', // 케이크
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', // 빵
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', // 도넛
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', // 마카롱
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', // 쿠키
  ],
  // 패스트푸드
  fastfood: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', // 버거
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80', // 치킨
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', // 피자
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80', // 샌드위치
    'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80', // 핫도그
  ],
  // 주점/바
  bar: [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80', // 와인
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', // 칵테일
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', // 맥주
    'https://images.unsplash.com/photo-1569924995012-c4c706bfcd51?w=800&q=80', // 소주
    'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=800&q=80', // 바 인테리어
  ],
  // 해산물
  seafood: [
    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800&q=80', // 회
    'https://images.unsplash.com/photo-1559737558-a2b8d6d7a0cd?w=800&q=80', // 해산물 플래터
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // 연어
    'https://images.unsplash.com/photo-1565680018434-b513d5e2fd47?w=800&q=80', // 새우
    'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?w=800&q=80', // 랍스터
  ],
  // 레스토랑 인테리어
  interior: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // 레스토랑 인테리어
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // 카페 인테리어
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', // 바 인테리어
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80', // 레스토랑 외관
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80', // 다이닝
  ],
  // 지역/장소 이미지
  location: {
    강남: 'https://images.unsplash.com/photo-1541330041477-ec0c94255278?w=800&q=80', // 강남 야경
    서울: 'https://images.unsplash.com/photo-1517154421773-46b2f30d0b3d?w=800&q=80', // 서울 전경
    부산: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=800&q=80', // 부산 해운대
    제주: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80', // 제주 풍경
    경주: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&q=80', // 경주 전통
    전주: 'https://images.unsplash.com/photo-1598443614576-c86c2ad6f295?w=800&q=80', // 전주 한옥마을
    강릉: 'https://images.unsplash.com/photo-1590756254933-bbcce19d7418?w=800&q=80', // 강릉 바다
    홍대: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80', // 홍대 거리
    이태원: 'https://images.unsplash.com/photo-1533630160910-65f67c358640?w=800&q=80', // 이태원 거리
    성수: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&q=80', // 성수 카페거리
    삼청동: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80', // 삼청동
    북촌: 'https://images.unsplash.com/photo-1516571748831-5d81767b788d?w=800&q=80', // 북촌 한옥마을
    명동: 'https://images.unsplash.com/photo-1535185384036-028135ed14c4?w=800&q=80', // 명동 거리
    인사동: 'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?w=800&q=80', // 인사동
    여의도: 'https://images.unsplash.com/photo-1506781961370-37a89d6b3095?w=800&q=80', // 여의도
    잠실: 'https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=800&q=80', // 잠실 롯데타워
    판교: 'https://images.unsplash.com/photo-1565256150415-ec32a30641d5?w=800&q=80', // 판교 테크노밸리
    해운대: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', // 해운대 해변
    광안리: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80', // 광안리 다리
    남포동: 'https://images.unsplash.com/photo-1553453678-3c87ac8e7e5d?w=800&q=80', // 부산 남포동
  }
};

// 레스토랑 이름에서 카테고리 추출하는 함수
const getCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  // 한식
  if (/김치|찌개|비빔밥|불고기|삼겹살|갈비|한우|한식|곰탕|설렁탕|냉면|김밥|떡볶이/.test(name)) return 'korean';
  
  // 일식
  if (/스시|초밥|라멘|우동|돈부리|오마카세|일식|사시미|규동|정식당/.test(name)) return 'japanese';
  
  // 중식
  if (/짜장|짬뽕|탕수육|마라|중화|중식|딤섬|만두/.test(name)) return 'chinese';
  
  // 이탈리안/양식
  if (/파스타|피자|스테이크|리조또|이탈리안|프렌치|양식|부띠끄|르브르/.test(name)) return 'italian';
  
  // 카페/브런치
  if (/카페|커피|브런치|베이커리|빵|테라스|루프탑|블루보틀|빌즈/.test(name)) return 'cafe';
  
  // 디저트
  if (/디저트|케이크|마카롱|쿠키|아이스크림|와플|팬케이크/.test(name)) return 'dessert';
  
  // 패스트푸드
  if (/버거|치킨|피자|샌드위치|햄버거|닭강정|치킨집/.test(name)) return 'fastfood';
  
  // 주점/바
  if (/와인|바|bar|술집|포차|이자카야|호프|맥주/.test(name)) return 'bar';
  
  // 해산물
  if (/회|횟집|수산|해산물|새우|랍스터|게|오징어|문어/.test(name)) return 'seafood';
  
  // 기본값
  return 'interior';
};

// 그룹/컬렉션 이미지 가져오기
export const getGroupImage = (groupName: string): string => {
  const lowerName = groupName.toLowerCase();
  
  // 지역 기반 그룹 - 더 많은 지역 추가
  for (const [location, url] of Object.entries(FOOD_IMAGES.location)) {
    if (groupName.includes(location)) {
      return url;
    }
  }
  
  // 음식 카테고리 기반 - 더 세분화된 매칭
  if (/매운|불|화|매콤|칼칼/.test(groupName)) return FOOD_IMAGES.korean[0]; // 매운 음식
  if (/데이트|로맨틱|커플|연인/.test(groupName)) return FOOD_IMAGES.italian[0]; // 데이트
  if (/혼밥|혼자|나홀로|솔로/.test(groupName)) return FOOD_IMAGES.japanese[1]; // 혼밥
  if (/회식|모임|파티|단체/.test(groupName)) return FOOD_IMAGES.korean[2]; // 회식
  if (/브런치|아침|모닝|조식/.test(groupName)) return FOOD_IMAGES.cafe[1]; // 브런치
  if (/디저트|달달|케이크|베이커리/.test(groupName)) return FOOD_IMAGES.dessert[0]; // 디저트
  if (/카페|커피|라떼|아메리카노/.test(groupName)) return FOOD_IMAGES.cafe[0]; // 카페
  if (/와인|바|술|주점|포차/.test(groupName)) return FOOD_IMAGES.bar[0]; // 술집
  if (/햄버거|버거|치킨|피자/.test(groupName)) return FOOD_IMAGES.fastfood[0]; // 패스트푸드
  if (/회|참치|연어|초밥|스시/.test(groupName)) return FOOD_IMAGES.seafood[0]; // 해산물
  if (/중식|중국|짜장|짬뽕|마라/.test(groupName)) return FOOD_IMAGES.chinese[0]; // 중식
  if (/일식|일본|라멘|우동|돈부리/.test(groupName)) return FOOD_IMAGES.japanese[0]; // 일식
  if (/한식|한국|김치|된장|비빔밥/.test(groupName)) return FOOD_IMAGES.korean[1]; // 한식
  if (/양식|파스타|스테이크|리조또/.test(groupName)) return FOOD_IMAGES.italian[2]; // 양식
  if (/탐험|여행|투어|맛집/.test(groupName)) return FOOD_IMAGES.interior[3]; // 탐험
  if (/챌린저|도전|챌린지/.test(groupName)) return FOOD_IMAGES.korean[0]; // 도전
  
  // 기본값 - 랜덤하게 선택
  const defaultImages = [...FOOD_IMAGES.interior, ...FOOD_IMAGES.cafe];
  const hash = groupName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaultImages[hash % defaultImages.length];
};

// 레스토랑 이미지를 가져오는 함수 (동기 버전)
export const getRestaurantImage = (restaurantName: string): string => {
  const category = getCategoryFromName(restaurantName);
  const images = FOOD_IMAGES[category as keyof typeof FOOD_IMAGES] || FOOD_IMAGES.interior;
  
  // 배열인 경우
  if (Array.isArray(images)) {
    // 레스토랑 이름을 해시로 변환하여 일관된 이미지 선택
    let hash = 0;
    for (let i = 0; i < restaurantName.length; i++) {
      const char = restaurantName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const index = Math.abs(hash) % images.length;
    return images[index];
  }
  
  // location 객체인 경우
  return FOOD_IMAGES.interior[0];
};

// 레스토랑 이미지를 가져오는 함수 (비동기 버전 - 필요시 사용)
export const getRestaurantImageAsync = async (restaurantName: string): Promise<string> => {
  return getRestaurantImage(restaurantName);
};

// 기본 레스토랑 이미지
export const getDefaultRestaurantImage = (restaurantName: string): string => {
  const category = getCategoryFromName(restaurantName);
  const images = FOOD_IMAGES[category as keyof typeof FOOD_IMAGES] || FOOD_IMAGES.interior;
  
  if (Array.isArray(images)) {
    return images[0];
  }
  
  return FOOD_IMAGES.interior[0];
};

// 여러 레스토랑의 이미지를 한 번에 가져오기
export async function getMultipleRestaurantImages(
  restaurants: Array<{ name: string; _id: string }>
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  // 동기 함수로 변경되어 Promise.all 불필요
  restaurants.forEach((restaurant) => {
    const image = getRestaurantImage(restaurant.name);
    imageMap.set(restaurant._id, image);
  });
  
  return imageMap;
}

// 음식 카테고리 확인
export const extractCategory = getCategoryFromName;