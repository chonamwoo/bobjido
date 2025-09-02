const axios = require('axios');

async function checkRealData() {
  try {
    // 1. 레스토랑 확인
    const restResponse = await axios.get('http://localhost:8888/api/restaurants');
    const restaurants = restResponse.data.restaurants;
    
    console.log('=== 실제 레스토랑 데이터 확인 ===');
    console.log(`총 레스토랑 수: ${restaurants.length}\n`);
    
    console.log('샘플 레스토랑 5개:');
    restaurants.slice(0, 5).forEach((rest, i) => {
      console.log(`\n${i + 1}. ${rest.name}`);
      console.log(`   카테고리: ${rest.category}`);
      console.log(`   주소: ${rest.address}`);
      console.log(`   가격대: ${rest.priceRange}`);
      console.log(`   평점: ${rest.averageRating?.toFixed(1)}`);
      console.log(`   인증: ${rest.isVerified ? '✓' : '✗'}`);
    });
    
    // 2. 플레이리스트 확인
    const playlistResponse = await axios.get('http://localhost:8888/api/playlists');
    const playlists = playlistResponse.data.playlists;
    
    console.log('\n=== 플레이리스트 레스토랑 연결 확인 ===');
    
    for (let i = 0; i < Math.min(3, playlists.length); i++) {
      const playlist = playlists[i];
      console.log(`\n"${playlist.title}"`);
      
      if (playlist.restaurants && playlist.restaurants.length > 0) {
        console.log(`  레스토랑 ${playlist.restaurants.length}개:`);
        playlist.restaurants.slice(0, 3).forEach((item, idx) => {
          const rest = item.restaurant || item;
          console.log(`    ${idx + 1}. ${rest.name} - ${rest.address}`);
        });
      } else {
        console.log('  레스토랑 없음');
      }
    }
    
    // 3. 지역별 통계
    console.log('\n=== 지역별 레스토랑 분포 ===');
    const regions = {};
    restaurants.forEach(r => {
      const district = r.address.split(' ')[2] || '기타';
      regions[district] = (regions[district] || 0) + 1;
    });
    
    Object.entries(regions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([region, count]) => {
        console.log(`  ${region}: ${count}개`);
      });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRealData();