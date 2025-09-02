const axios = require('axios');

async function checkPlaylists() {
  try {
    const response = await axios.get('http://localhost:8888/api/playlists');
    const playlists = response.data.playlists || response.data;
    
    console.log('=== 플레이리스트 데이터 확인 ===');
    console.log(`총 플레이리스트 수: ${playlists.length}`);
    console.log('\n플레이리스트별 레스토랑 수:');
    
    playlists.forEach(p => {
      const restaurantCount = p.restaurants ? p.restaurants.length : 0;
      console.log(`- ${p.title || p.name}: ${restaurantCount}개 레스토랑`);
    });
    
    // 특정 플레이리스트 상세 확인
    const testPlaylist = playlists[0];
    if (testPlaylist && testPlaylist.restaurants && testPlaylist.restaurants.length > 0) {
      console.log('\n첫 번째 플레이리스트 레스토랑 상세:');
      testPlaylist.restaurants.slice(0, 3).forEach((r, index) => {
        const restaurantName = r.restaurant?.name || r.name || '이름 없음';
        console.log(`  ${index + 1}. ${restaurantName}`);
      });
    }
    
  } catch (error) {
    console.error('에러:', error.message);
  }
}

checkPlaylists();