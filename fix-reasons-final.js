const mongoose = require('mongoose');
require('dotenv').config();

// 카테고리별 맛집 추가 이유 템플릿
const reasonTemplates = {
  '한식': [
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
  '중식': [
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
  '일식': [
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
  '양식': [
    '{name}의 파스타는 알덴테가 완벽해요',
    '{name}는 와인 셀렉션이 200종이 넘어요',
    '{name}의 스테이크는 겉은 바삭 속은 미디엄레어',
    '{name} 리조또는 크림이 너무 진하지 않고 고소',
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
  ],
  '카페': [
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
  '패스트푸드': [
    '{name}는 키오스크로 5초 만에 주문',
    '{name}의 세트 메뉴가 만원 이하',
    '{name} 와이파이 비밀번호 없이 연결',
    '{name}는 혼자 앉기 좋은 바 테이블',
    '{name}의 감튀가 항상 갓 튀긴 맛',
    '{name} 24시간이라 새벽에도 가능',
    '{name}는 드라이브 스루가 빨라요',
    '{name}의 신메뉴가 매달 나와요',
    '{name} 치킨버거가 진짜 통닭 가슴살',
    '{name}는 앱 주문시 20% 할인'
  ],
  '디저트': [
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
  '분식': [
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
  '주점': [
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
  ]
};

// 기본 템플릿 (카테고리가 매칭 안될 때)
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

async function fixPlaylistReasons() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');

    const db = mongoose.connection.db;
    const playlistsCollection = db.collection('playlists');
    const restaurantsCollection = db.collection('restaurants');

    // 모든 플레이리스트 조회
    const playlists = await playlistsCollection.find({}).toArray();
    console.log(`${playlists.length}개의 플레이리스트 발견`);

    let totalUpdated = 0;
    const usedReasons = new Set();

    for (const playlist of playlists) {
      if (!playlist.restaurants || playlist.restaurants.length === 0) continue;

      const updatedRestaurants = [];
      
      for (const item of playlist.restaurants) {
        if (!item.restaurant) {
          updatedRestaurants.push(item);
          continue;
        }

        // 레스토랑 정보 조회
        const restaurant = await restaurantsCollection.findOne({ 
          _id: item.restaurant 
        });

        if (!restaurant) {
          updatedRestaurants.push(item);
          continue;
        }

        // 카테고리에 맞는 이유 선택
        const templates = reasonTemplates[restaurant.category] || defaultReasons;
        
        // 중복되지 않는 이유 찾기
        let selectedReason = null;
        let attempts = 0;
        
        while (attempts < templates.length && !selectedReason) {
          const template = templates[Math.floor(Math.random() * templates.length)];
          const reason = template.replace(/{name}/g, restaurant.name);
          
          if (!usedReasons.has(reason)) {
            usedReasons.add(reason);
            selectedReason = reason;
          }
          attempts++;
        }

        // 그래도 못 찾으면 랜덤 생성
        if (!selectedReason) {
          const randomIndex = Math.floor(Math.random() * 10);
          selectedReason = `${restaurant.name}를 ${randomIndex}번 방문했는데 항상 만족스러워요`;
        }

        updatedRestaurants.push({
          ...item,
          reason: selectedReason
        });

        console.log(`  ✓ ${restaurant.name} (${restaurant.category}): ${selectedReason}`);
      }

      // 플레이리스트 업데이트
      await playlistsCollection.updateOne(
        { _id: playlist._id },
        { $set: { restaurants: updatedRestaurants } }
      );
      
      totalUpdated++;
      console.log(`✅ 업데이트 완료: ${playlist.title}`);
    }

    console.log(`\n✅ 총 ${totalUpdated}개 플레이리스트 업데이트 완료!`);
    
    // 확인
    const samplePlaylist = await playlistsCollection.findOne({});
    if (samplePlaylist && samplePlaylist.restaurants) {
      console.log('\n📋 샘플 확인:');
      console.log(`플레이리스트: ${samplePlaylist.title}`);
      for (let i = 0; i < Math.min(3, samplePlaylist.restaurants.length); i++) {
        const item = samplePlaylist.restaurants[i];
        if (item.restaurant) {
          const rest = await restaurantsCollection.findOne({ _id: item.restaurant });
          console.log(`  ${i + 1}. ${rest?.name}: ${item.reason}`);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

fixPlaylistReasons();