// 실제 식당별 대표 음식 이미지 매핑
export const restaurantSpecificImages: { [key: string]: string } = {
  // 강남 맛집들
  '밍글스': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', // 파인다이닝 코스 요리
  '정식당': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', // 모던 한식 정식
  '시그니처': 'https://images.unsplash.com/photo-1626957341926-98d2fc2c7af9?w=800', // 스테이크
  '스시사이토': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', // 고급 스시
  '평양면옥': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800', // 평양냉면
  '새마을식당': 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800', // 7분김치찌개
  '후토마키': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', // 스시롤
  '모수': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800', // 돈카츠
  
  // 홍대 맛집들
  '연남동그곳': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', // 피자
  '홍대개미': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', // 비빔밥
  '뱃놈': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800', // 냉면
  '마포원조갈매기': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800', // 갈매기살
  '호호식당': 'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800', // 쌀국수
  '버거비': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800', // 수제버거
  
  // 이태원 맛집들
  '단델라이언': 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=800', // 스테이크
  '바토스': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', // 타코
  '카사블랑카': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', // 모로칸 쿠스쿠스
  '라이너스 바베큐': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', // BBQ 립
  '케세라세라': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', // 케이크
  '더베이커스테이블': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800', // 베이커리
  '페트라': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', // 중동음식
  
  // 성수 맛집들
  '어니언': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', // 커피와 베이글
  '대림창고': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', // 브런치
  '성수족발': 'https://images.unsplash.com/photo-1625398407796-82b7b8c3c6b2?w=800', // 족발
  '더플레인': 'https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=800', // 베이커리
  '테라스키친': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800', // 브런치 플레이트
  
  // 종로/을지로 맛집들
  '광장시장 마약김밥': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800', // 김밥
  '을지로골뱅이': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800', // 골뱅이무침
  '진옥화할매원조닭한마리': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800', // 닭한마리
  '종로노가리': 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800', // 노가리와 맥주
  
  // 기타 유명 맛집들
  '교대이층집': 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800', // 삼겹살
  '을지면옥': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800', // 냉면
  '마포돼지갈비': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800', // 돼지갈비
  '종로설렁탕': 'https://images.unsplash.com/photo-1580651614010-0e5b4f90e6f2?w=800', // 설렁탕
  '광화문짚불고기': 'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800', // 불고기
  
  // 디저트/카페
  '도레도레': 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800', // 도나츠
  '나뜨르': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', // 케이크
  '블루보틀': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', // 스페셜티 커피
  
  // 일식
  '쿠시카츠준': 'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800', // 쿠시카츠
  '하카타분코': 'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=800', // 라멘
  '긴자료코': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800', // 우동
  
  // 중식
  '홍콩반점': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800', // 짜장면
  '태화장': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800', // 짬뽕
  '샤오롱칸': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800', // 마라탕
  
  // 치킨
  '교촌치킨': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800', // 양념치킨
  'BBQ치킨': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800', // 황금올리브
  '굽네치킨': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800', // 오븐치킨
  
  // 분식
  '신전떡볶이': 'https://images.unsplash.com/photo-1635684953077-95e87e9a24b5?w=800', // 떡볶이
  '김밥천국': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800', // 김밥
  '할머니즉석떡볶이': 'https://images.unsplash.com/photo-1635684953077-95e87e9a24b5?w=800', // 즉석떡볶이
  
  // 해산물
  '노량진수산시장': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', // 회
  '대게나라': 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=800', // 대게
  '조개구이천국': 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=800', // 조개구이
  
  // 베트남/태국
  '포36거리': 'https://images.unsplash.com/photo-1582116593333-0c7b5e04c11f?w=800', // 쌀국수
  '방콕익스프레스': 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800', // 팟타이
  '사이공마켓': 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800', // 분짜
  
  // 멕시칸
  '온더보더': 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800', // 부리또
  '구스토타코': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800' // 타코
};

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
  // 먼저 실제 식당명에 매핑된 이미지가 있는지 확인
  if (restaurantSpecificImages[restaurantName]) {
    return restaurantSpecificImages[restaurantName];
  }
  
  // 부분 매칭 시도
  const lowerName = restaurantName.toLowerCase();
  for (const [key, value] of Object.entries(restaurantSpecificImages)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // 카테고리 기반 매칭
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