const axios = require('axios');

async function testDataSync() {
  try {
    console.log('=== 데이터 동기화 테스트 ===\n');
    
    // 1. 플레이리스트 목록 확인
    const response = await axios.get('http://localhost:8888/api/playlists');
    const playlists = response.data.playlists || response.data;
    
    console.log(`총 플레이리스트 수: ${playlists.length}\n`);
    
    // 2. 각 플레이리스트의 레스토랑 확인
    for (let i = 0; i < Math.min(3, playlists.length); i++) {
      const playlist = playlists[i];
      console.log(`플레이리스트: "${playlist.title || playlist.name}"`);
      console.log(`  - ID: ${playlist._id}`);
      console.log(`  - 레스토랑 수: ${playlist.restaurants?.length || 0}`);
      
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        const firstRest = playlist.restaurants[0];
        const restaurant = firstRest.restaurant || firstRest;
        console.log(`  - 첫 번째 레스토랑:`);
        console.log(`    * 이름: ${restaurant.name}`);
        console.log(`    * 주소: ${restaurant.address}`);
        console.log(`    * 좌표: lat=${restaurant.coordinates?.lat}, lng=${restaurant.coordinates?.lng}`);
        console.log(`    * 카테고리: ${restaurant.category}`);
        console.log(`    * 가격대: ${restaurant.priceRange}`);
      }
      console.log('');
    }
    
    // 3. 특정 플레이리스트 상세 정보 테스트
    if (playlists.length > 0) {
      const testId = playlists[0]._id;
      console.log(`상세 정보 테스트 - ID: ${testId}`);
      
      const detailResponse = await axios.get(`http://localhost:8888/api/playlists/${testId}`);
      const detail = detailResponse.data;
      
      console.log(`  - 제목: ${detail.title || detail.name}`);
      console.log(`  - 레스토랑 수: ${detail.restaurants?.length || 0}`);
      
      if (detail.restaurants && detail.restaurants.length > 0) {
        console.log('  - 레스토랑 목록:');
        detail.restaurants.forEach((item, index) => {
          const rest = item.restaurant || item;
          console.log(`    ${index + 1}. ${rest.name} - ${rest.category} (${rest.priceRange || '가격정보없음'})`);
          if (rest.coordinates) {
            console.log(`       좌표: ${rest.coordinates.lat}, ${rest.coordinates.lng}`);
          } else {
            console.log(`       좌표: 없음`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('에러:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
  }
}

testDataSync();