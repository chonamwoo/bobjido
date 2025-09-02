const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');
const Restaurant = require('./server/models/Restaurant');
require('dotenv').config();

// 각 카테고리별로 다양한 이유 템플릿 (중복 방지를 위해 많이 준비)
const reasonTemplates = {
  '한식': {
    '맛집투어': [
      '{name}의 김치찌개는 진짜 엄마 손맛이에요',
      '{name}에서 먹은 된장찌개가 평생 기억에 남아요',
      '{name}의 불고기는 입에서 살살 녹아요',
      '{name} 삼겹살은 고기 질이 남다르고 숯불 향이 일품',
      '{name}의 갈비탕 국물은 24시간 우려낸 진국',
      '{name} 냉면은 여름에 생각나는 최고의 선택',
      '{name}의 비빔밥은 재료 하나하나가 신선해요',
      '{name} 제육볶음은 매콤달콤 중독성 있는 맛',
      '{name}의 김치전은 비 오는 날 막걸리와 완벽한 조합',
      '{name} 순두부찌개는 얼큰하면서도 고소한 맛',
      '{name}의 잡채는 명절 때 먹던 그 맛 그대로',
      '{name} 갈비찜은 부드럽고 양념이 깊게 배어있어요',
      '{name}의 전골 요리는 푸짐하고 국물이 시원해요',
      '{name} 보쌈은 수육이 부드럽고 김치가 일품',
      '{name}의 해물파전은 바삭하면서도 해산물이 신선',
      '{name} 육회는 신선도가 최고고 참기름 향이 좋아요',
      '{name}의 삼계탕은 여름 보양식으로 최고',
      '{name} 감자탕은 뼈에 붙은 살이 푸짐해요',
      '{name}의 닭갈비는 춘천식 정통 맛',
      '{name} 쌈밥은 싱싱한 채소와 고기의 조화'
    ],
    '가족모임': [
      '{name}의 한정식은 부모님 모시기 딱 좋아요',
      '{name}는 3대가 함께 와도 좋을 넓은 룸',
      '{name}의 갈비찜은 온 가족이 좋아하는 메뉴',
      '{name} 보쌈 정식은 가족 외식으로 인기',
      '{name}의 전골은 4인 가족이 먹기 적당한 양',
      '{name}는 어르신들 입맛에 맞는 깔끔한 반찬',
      '{name}의 불고기 전골은 아이들도 잘 먹어요',
      '{name} 삼계탕은 할머니가 좋아하시는 메뉴',
      '{name}의 한식 뷔페는 선택의 폭이 넓어요',
      '{name}는 주차장이 넓어서 가족 모임에 편해요',
      '{name}의 정갈한 상차림은 특별한 날에 어울려요',
      '{name} 돌솥밥은 구수하고 든든해요',
      '{name}의 생선구이는 어른들이 특히 좋아해요',
      '{name} 나물 반찬이 15가지나 되요',
      '{name}의 된장국은 집밥 같은 편안한 맛'
    ],
    '혼밥': [
      '{name}는 1인 세트 메뉴가 잘 구성되어 있어요',
      '{name}의 김치찌개 백반이 7천원 가성비',
      '{name}에서 혼자 먹어도 전혀 눈치 안 보여요',
      '{name}는 바 테이블이 있어서 혼밥 편해요',
      '{name}의 돌솥비빔밥은 1인분도 정성스럽게',
      '{name} 백반 구성이 알차고 맛있어요',
      '{name}는 점심시간에 빨리 나와서 좋아요',
      '{name}의 국밥은 혼밥러들의 최애 메뉴',
      '{name} 김치볶음밥이 양도 많고 맛도 좋아요',
      '{name}는 24시간이라 아무때나 혼밥 가능',
      '{name}의 순대국밥은 해장으로도 좋아요',
      '{name} 청국장은 건강하고 든든한 한 끼',
      '{name}의 제육덮밥은 가성비 최고',
      '{name} 콩나물국밥은 시원하고 깔끔해요',
      '{name}는 키오스크 주문이라 편해요'
    ],
    '회식': [
      '{name}는 삼겹살 질이 좋아서 회식 단골집',
      '{name}의 단체 룸은 30명까지 수용 가능',
      '{name} 고기와 소주 조합이 찰떡',
      '{name}는 직장인 회식 1순위 맛집',
      '{name}의 갈비는 부서 회식 때마다 가는 곳',
      '{name} 생막걸리가 유명해서 분위기 좋아요',
      '{name}는 2차 장소까지 가까워서 편해요',
      '{name}의 안주 메뉴가 20가지나 돼요',
      '{name} 대패삼겹살 무한리필로 회식 인기',
      '{name}는 새벽 2시까지 영업해서 좋아요'
    ],
    '데이트코스': [
      '{name}의 한옥 분위기가 로맨틱해요',
      '{name}는 조용한 개별 룸이 있어서 좋아요',
      '{name}의 정원 뷰가 아름다워요',
      '{name} 전통차와 디저트도 함께 즐길 수 있어요',
      '{name}는 남산 야경이 보이는 특별한 자리',
      '{name}의 궁중요리 코스가 특별한 날에 좋아요',
      '{name} 한복 대여 서비스도 있어요',
      '{name}는 프라이빗한 2인 좌석이 있어요',
      '{name}의 전통 공연을 보며 식사 가능',
      '{name} 분위기가 고급스럽고 조용해요'
    ]
  },
  '중식': {
    '맛집투어': [
      '{name}의 짜장면은 40년 전통의 비법 소스',
      '{name} 짬뽕은 불맛이 제대로 살아있어요',
      '{name}의 탕수육은 바삭함이 3시간은 유지',
      '{name} 마파두부는 사천식 정통 매운맛',
      '{name}의 깐풍기는 겉바속촉의 정석',
      '{name} 양장피는 새콤달콤 소스가 일품',
      '{name}의 고추잡채는 매콤하면서도 달콤',
      '{name} 팔보채는 해산물이 8가지나 들어가요',
      '{name}의 유린기는 부드럽고 소스가 맛있어요',
      '{name} 마라탕은 한 번 먹으면 중독',
      '{name}의 훠궈는 본격 중국식 매운맛',
      '{name} 만두는 수제로 빚어서 육즙이 풍부',
      '{name}의 볶음밥은 불향이 가득해요',
      '{name} 딤섬은 20가지 종류가 있어요',
      '{name}의 깐쇼새우는 달콤한 소스가 최고'
    ],
    '친구모임': [
      '{name}는 요리를 다양하게 시켜서 나눠먹기 좋아요',
      '{name}의 코스 메뉴는 가성비가 훌륭해요',
      '{name} 중국 맥주 종류가 10가지나 돼요',
      '{name}는 단체 예약시 10% 할인',
      '{name}의 세트 메뉴는 4인 기준 딱 맞아요',
      '{name} 개별 룸이 5개나 있어서 예약 편해요',
      '{name}는 밤 12시까지 영업해서 늦은 모임 OK',
      '{name}의 요리 양이 푸짐해서 배부르게 먹어요',
      '{name} 냉면도 맛있어서 식사 마무리 좋아요',
      '{name}는 주차 2시간 무료라 편해요'
    ],
    '가족모임': [
      '{name}의 코스요리는 어른 아이 모두 만족',
      '{name}는 아이 의자와 식기도 준비되어 있어요',
      '{name} 룸이 넓고 조용해서 대화하기 좋아요',
      '{name}의 요리가 MSG 없이 담백해요',
      '{name}는 4대까지 모여도 충분한 공간',
      '{name}의 중화냉채가 입맛을 돋워줘요',
      '{name} 누룽지탕은 아이들이 좋아해요',
      '{name}는 가족 세트 메뉴가 따로 있어요',
      '{name}의 새우 요리는 아이들 인기 메뉴',
      '{name} 북경오리는 특별한 날 가족 외식'
    ]
  },
  '일식': {
    '맛집투어': [
      '{name}의 스시는 매일 새벽 시장에서 공수',
      '{name} 사시미 두께가 엄지손가락만해요',
      '{name}의 라멘은 12시간 끓인 돈코츠 국물',
      '{name} 우동 면은 매일 아침 직접 뽑아요',
      '{name}의 돈카츠는 두께가 3cm는 되요',
      '{name} 돈부리는 재료가 그릇 밖으로 넘쳐요',
      '{name}의 덴푸라는 기름이 깨끗해서 가벼워요',
      '{name} 오코노미야키는 오사카 스타일 정통',
      '{name}의 가라아게는 겉은 바삭 속은 촉촉',
      '{name} 규동은 고기가 부드럽고 양이 많아요',
      '{name}의 우나기동은 장어가 통통해요',
      '{name} 소바는 메밀 함량이 80% 이상',
      '{name}의 차슈는 입에서 녹아요',
      '{name} 타코야키는 문어가 큼직해요',
      '{name}의 나베 요리는 국물이 깊고 진해요'
    ],
    '데이트코스': [
      '{name}의 오마카세는 셰프님 설명이 재밌어요',
      '{name}는 조용하고 은은한 조명이 좋아요',
      '{name}의 개인 룸은 완전 프라이빗해요',
      '{name} 사케 페어링이 음식과 찰떡',
      '{name}의 카이세키는 계절감이 느껴져요',
      '{name}는 스시 바에서 셰프님과 대화 가능',
      '{name}의 정원이 보이는 창가 자리',
      '{name} 디저트 모찌가 예쁘고 맛있어요',
      '{name}는 기념일 서비스가 특별해요',
      '{name}의 노렌을 넘으면 다른 세계'
    ],
    '혼밥': [
      '{name}의 라멘은 혼밥의 정석',
      '{name} 돈부리 세트가 8천원 가성비',
      '{name}는 일본식 카운터 좌석이 편해요',
      '{name}의 런치 정식이 구성이 알차요',
      '{name} 우동은 5분 안에 나와서 빨라요',
      '{name}는 1인 오마카세도 예약 가능',
      '{name}의 벤또는 포장도 깔끔해요',
      '{name} 카레는 든든하고 맛있어요',
      '{name}는 혼밥족들이 많아서 편해요',
      '{name}의 텐동은 혼자 먹기 딱 좋은 양'
    ]
  },
  '양식': {
    '데이트코스': [
      '{name}의 파스타는 알덴테가 완벽해요',
      '{name}는 와인 셀렉션이 200종이 넘어요',
      '{name}의 스테이크는 겉은 바삭 속은 미디엄레어',
      '{name} 리조또는 크림이 너무 진하지 않고 고소',
      '{name}의 창가 자리는 한강 뷰가 멋져요',
      '{name}는 라이브 재즈 공연이 있어요',
      '{name}의 코스는 양도 적당하고 구성이 좋아요',
      '{name} 디저트 티라미수가 입에서 녹아요',
      '{name}는 프로포즈 이벤트 도와줘요',
      '{name}의 트러플 파스타는 향이 미쳤어요'
    ],
    '브런치': [
      '{name}의 에그 베네딕트는 노른자가 완벽한 반숙',
      '{name} 팬케이크는 버터가 사르르 녹아요',
      '{name}의 프렌치 토스트는 시나몬 향이 좋아요',
      '{name} 아보카도 토스트는 비주얼도 예뻐요',
      '{name}의 브런치 세트는 커피까지 포함',
      '{name}는 오전 11시부터 오후 3시까지',
      '{name}의 스무디볼은 과일이 신선해요',
      '{name} 베이글은 크림치즈가 듬뿍',
      '{name}는 테라스에서 브런치 가능',
      '{name}의 오믈렛은 치즈가 쭉 늘어나요'
    ],
    '맛집투어': [
      '{name}의 화덕 피자는 도우가 쫄깃해요',
      '{name} 까르보나라는 크림 없는 정통 로마식',
      '{name}의 부라타 치즈는 매일 공수',
      '{name} 뇨끼는 감자로 직접 만들어요',
      '{name}의 티본 스테이크는 1kg 크기',
      '{name} 해산물 파스타는 새우가 10마리',
      '{name}의 라자냐는 7겹이나 돼요',
      '{name} 포카치아 빵이 무한 리필',
      '{name}의 아란치니는 겉은 바삭 속은 촉촉',
      '{name} 칼초네는 피자 반죽 속 치즈가 가득'
    ]
  },
  '카페': {
    '카페투어': [
      '{name}의 원두는 에티오피아 예가체프',
      '{name} 핸드드립은 바리스타 챔피언이 내려요',
      '{name}의 시그니처 라떼는 꽃향이 나요',
      '{name} 디저트는 매일 직접 구워요',
      '{name}의 2층은 루프탑 정원이에요',
      '{name}는 로스팅을 매일 아침 해요',
      '{name}의 더치커피는 24시간 추출',
      '{name} 크로플은 주문 즉시 구워줘요',
      '{name}는 책이 3000권이나 있어요',
      '{name}의 플랫화이트가 진짜 호주식'
    ],
    '데이트코스': [
      '{name}는 소파가 푹신해서 오래 있기 좋아요',
      '{name}의 개인 부스는 프라이빗해요',
      '{name} BGM이 재즈라서 분위기 있어요',
      '{name}는 밤 11시까지 영업해요',
      '{name}의 딸기 케이크는 프로포즈 케이크로 유명',
      '{name} 테라스에서 보는 석양이 예뻐요',
      '{name}는 플라워 카페라 꽃향기가 좋아요',
      '{name}의 포토존이 10군데나 있어요',
      '{name} 루프탑은 별이 잘 보여요',
      '{name}는 커플 세트 메뉴가 있어요'
    ],
    '혼밥': [
      '{name}는 콘센트가 모든 자리에 있어요',
      '{name}의 와이파이가 100Mbps 속도',
      '{name} 1인 좌석이 창가에 10개',
      '{name}는 브런치 메뉴가 든든해요',
      '{name}의 샌드위치가 한 끼 식사로 충분',
      '{name} 24시간 영업이라 새벽에도 OK',
      '{name}는 노트북 거치대도 빌려줘요',
      '{name}의 아메리카노가 진하고 고소해요',
      '{name} 독서실 같은 조용한 공간',
      '{name}는 혼자 오는 손님이 70%'
    ]
  },
  '패스트푸드': {
    '혼밥': [
      '{name}는 키오스크로 5초 만에 주문',
      '{name}의 세트 메뉴가 만원 이하',
      '{name} 와이파이 비밀번호 없이 연결',
      '{name}는 혼자 앉기 좋은 바 테이블',
      '{name}의 감튀가 항상 갓 튀긴 맛',
      '{name} 24시간이라 새벽 혼밥도 가능',
      '{name}는 드라이브 스루가 빨라요',
      '{name}의 신메뉴가 매달 나와요',
      '{name} 치킨버거가 진짜 통닭 가슴살',
      '{name}는 앱 주문시 20% 할인'
    ],
    '친구모임': [
      '{name}의 파티팩이 4인 기준 3만원',
      '{name}는 단체 주문시 배달비 무료',
      '{name}의 패밀리 세트가 구성이 알차요',
      '{name} 음료 리필이 무제한',
      '{name}는 2층이 넓어서 단체 OK',
      '{name}의 디저트 종류가 10가지',
      '{name} 생일 파티 공간 대여 가능',
      '{name}는 게임기가 있어서 재밌어요',
      '{name}의 양이 다른 곳보다 30% 많아요',
      '{name} 매장이 청결하고 직원이 친절'
    ],
    '야식': [
      '{name}는 새벽 3시까지 배달 가능',
      '{name}의 치킨이 야식계의 끝판왕',
      '{name} 버거 세트가 맥주 안주로 최고',
      '{name}는 배달 30분 내 도착 보장',
      '{name}의 감자튀김이 양이 많아요',
      '{name} 24시간 배달이라 걱정 없어요',
      '{name}는 포장 주문시 30% 할인',
      '{name}의 스파이시 메뉴가 야식에 딱',
      '{name} 콜라가 1.25L 사이즈',
      '{name}는 야식 세트 메뉴가 따로 있어요'
    ]
  },
  '디저트': {
    '카페투어': [
      '{name}의 마카롱은 20가지 맛이 있어요',
      '{name} 케이크는 주문 제작만 받아요',
      '{name}의 크루아상은 27겹 레이어',
      '{name} 타르트는 과일이 제철 과일만',
      '{name}의 푸딩은 3일 숙성시켜요',
      '{name} 젤라또는 이탈리아 기계로 제조',
      '{name}의 도넛은 브리오슈 반죽',
      '{name} 쿠키는 버터 함량 40%',
      '{name}는 비건 디저트도 있어요',
      '{name}의 브라우니는 초콜릿 70% 함유'
    ],
    '데이트코스': [
      '{name}의 커플 케이크 세트가 인기',
      '{name}는 테라스에서 디저트 즐기기 좋아요',
      '{name}의 마카롱 선물 세트가 예뻐요',
      '{name} 수제 아이스크림이 12가지 맛',
      '{name}는 와인과 디저트 페어링',
      '{name}의 초콜릿은 벨기에산 칼리바우트',
      '{name} 케이크에 문구 새겨줘요',
      '{name}는 프라이빗 룸이 있어요',
      '{name}의 밀크쉐이크가 SNS 인기',
      '{name} 파르페가 3단 구성으로 푸짐'
    ]
  },
  '분식': {
    '맛집투어': [
      '{name}의 떡볶이는 40년 비법 양념',
      '{name} 순대는 직접 만들어요',
      '{name}의 김밥은 속이 8가지 재료',
      '{name} 튀김은 주문 즉시 튀겨요',
      '{name}의 라볶이는 라면 사리 2개',
      '{name} 쫄면은 양념이 새콤달콤',
      '{name}의 어묵은 부산에서 직송',
      '{name} 만두는 고기와 김치 반반',
      '{name}는 시장 안에서 60년 전통',
      '{name}의 김치볶음밥이 불맛 가득'
    ],
    '혼밥': [
      '{name}는 1인분도 포장 가능',
      '{name}의 김밥 한 줄이면 한 끼 해결',
      '{name} 컵떡볶이가 3천원',
      '{name}는 5분이면 나와요',
      '{name}의 라면에 김밥이 5천원',
      '{name} 분식 세트가 6천원',
      '{name}는 아침 7시부터 영업',
      '{name}의 참치김밥이 인기 메뉴',
      '{name} 테이블이 1인용이 많아요',
      '{name}는 줄 서는 시간이 짧아요'
    ],
    '야식': [
      '{name}의 떡볶이는 포장하면 양 추가',
      '{name} 순대는 술안주로 인기',
      '{name}는 새벽 1시까지 영업',
      '{name}의 튀김이 맥주랑 찰떡',
      '{name} 라볶이가 해장에 좋아요',
      '{name}는 배달도 가능해요',
      '{name}의 오뎅 국물이 속을 달래줘요',
      '{name} 김밥은 야식으로 부담 없어요',
      '{name}는 포장 시 떡볶이 국물 추가',
      '{name}의 매운 떡볶이가 술을 부르네요'
    ]
  },
  '주점': {
    '친구모임': [
      '{name}의 안주 종류가 50가지가 넘어요',
      '{name}는 수제 맥주가 8종류',
      '{name}의 분위기가 펍 같아서 좋아요',
      '{name} 칵테일이 시그니처 메뉴',
      '{name}는 단체석이 20명까지 가능',
      '{name}의 와인 리스트가 100종',
      '{name} 위스키 종류가 30가지',
      '{name}는 루프탑 바가 있어요',
      '{name}의 안주 양이 푸짐해요',
      '{name} 생맥주가 시원하고 신선'
    ],
    '맛집투어': [
      '{name}는 골목 안 숨은 맛집',
      '{name}의 닭발이 서울 3대 맛집',
      '{name} 곱창 구이가 신선해요',
      '{name}는 노가리가 바삭바삭',
      '{name}의 전은 15가지 종류',
      '{name} 육전이 부드럽고 고소해요',
      '{name}는 막걸리 종류가 20가지',
      '{name}의 안주 가격이 착해요',
      '{name} 분위기가 레트로 감성',
      '{name}는 연예인도 자주 오는 곳'
    ]
  }
};

// 사용된 이유를 추적하기 위한 Set
const usedReasons = new Set();

// 랜덤하게 고유한 이유 선택하는 함수
function getUniqueReasonForRestaurant(restaurant, playlistCategory) {
  const restaurantCategory = restaurant.category;
  let reasons = reasonTemplates[restaurantCategory]?.[playlistCategory];
  
  // 해당 카테고리 조합이 없으면 기본 템플릿 사용
  if (!reasons || reasons.length === 0) {
    reasons = reasonTemplates[restaurantCategory]?.['맛집투어'] || [];
  }
  
  // 여전히 없으면 기본 이유 사용
  if (reasons.length === 0) {
    const defaultReasons = [
      '{name}는 정말 맛있어요',
      '{name}의 음식이 훌륭해요',
      '{name}는 꼭 가봐야 할 곳',
      '{name}의 분위기가 좋아요',
      '{name}는 서비스가 친절해요',
      '{name}의 가성비가 최고예요',
      '{name}는 재방문 의사 100%',
      '{name}의 메뉴가 다양해요',
      '{name}는 접근성이 좋아요',
      '{name}의 인테리어가 멋져요'
    ];
    reasons = defaultReasons;
  }
  
  // 사용 가능한 이유 중에서 선택
  let selectedReason = null;
  let attempts = 0;
  
  while (attempts < reasons.length) {
    const randomIndex = Math.floor(Math.random() * reasons.length);
    const template = reasons[randomIndex];
    const reason = template.replace(/{name}/g, restaurant.name);
    
    // 이미 사용한 이유가 아니면 선택
    if (!usedReasons.has(reason)) {
      usedReasons.add(reason);
      selectedReason = reason;
      break;
    }
    attempts++;
  }
  
  // 모든 이유가 사용되었다면 그냥 새로운 이유 생성
  if (!selectedReason) {
    const timestamp = Date.now();
    selectedReason = `${restaurant.name}는 ${timestamp % 10}번 가봤는데 항상 만족스러워요`;
  }
  
  return selectedReason;
}

async function fixPlaylistReasons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    // 모든 플레이리스트 조회
    const playlists = await Playlist.find({})
      .populate('restaurants.restaurant');

    console.log(`${playlists.length}개의 플레이리스트 발견`);

    let totalUpdated = 0;
    let totalReasons = 0;

    for (const playlist of playlists) {
      console.log(`\n📝 처리 중: ${playlist.title} (${playlist.category})`);
      
      // 이 플레이리스트에 사용된 이유 초기화
      const playlistReasons = new Set();
      
      // 각 레스토랑의 추가 이유 업데이트
      for (let i = 0; i < playlist.restaurants.length; i++) {
        const restaurantItem = playlist.restaurants[i];
        if (restaurantItem.restaurant) {
          const restaurant = restaurantItem.restaurant;
          let newReason = getUniqueReasonForRestaurant(restaurant, playlist.category);
          
          // 같은 플레이리스트 내에서 중복 체크
          let attempts = 0;
          while (playlistReasons.has(newReason) && attempts < 10) {
            newReason = getUniqueReasonForRestaurant(restaurant, playlist.category);
            attempts++;
          }
          
          playlistReasons.add(newReason);
          playlist.restaurants[i].reason = newReason;
          totalReasons++;
          
          console.log(`  ✓ ${restaurant.name} (${restaurant.category}): ${newReason}`);
        }
      }

      await playlist.save();
      totalUpdated++;
    }

    console.log(`\n✅ 총 ${totalUpdated}개 플레이리스트, ${totalReasons}개 이유 업데이트 완료!`);
    console.log(`📊 고유한 이유 ${usedReasons.size}개 생성됨`);
    
    // 샘플 확인
    console.log('\n📋 업데이트 확인:');
    const samplePlaylists = await Playlist.find({}).limit(3)
      .populate('restaurants.restaurant');
    
    for (const playlist of samplePlaylists) {
      console.log(`\n플레이리스트: ${playlist.title} (${playlist.category})`);
      playlist.restaurants.slice(0, 3).forEach((item, idx) => {
        if (item.restaurant) {
          console.log(`  ${idx + 1}. ${item.restaurant.name}: ${item.reason}`);
        }
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

fixPlaylistReasons();