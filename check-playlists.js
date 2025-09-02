const axios = require('axios');

async function checkPlaylists() {
  try {
    const response = await axios.get('http://localhost:8888/api/playlists');
    const playlists = response.data.playlists || response.data;
    
    console.log(`총 플레이리스트 수: ${playlists.length}`);
    console.log('\n한남동 관련 플레이리스트:');
    
    playlists.forEach((p, index) => {
      if (p.title?.includes('한남동') || p.name?.includes('한남동')) {
        console.log(`\n[${index + 1}] ${p.title || p.name}`);
        console.log(`  ID: ${p._id}`);
        console.log(`  설명: ${p.description?.substring(0, 50)}`);
        console.log(`  레스토랑 수: ${p.restaurants?.length || 0}`);
        
        if (p.restaurants && p.restaurants.length > 0) {
          console.log('  레스토랑:');
          p.restaurants.slice(0, 3).forEach(r => {
            const restaurant = r.restaurant || r;
            console.log(`    - ${restaurant.name || restaurant.title || '이름없음'}`);
          });
        }
      }
    });
    
    // Admin API 테스트
    console.log('\n\nAdmin API 테스트:');
    const firstPlaylist = playlists[0];
    
    try {
      // Admin 권한 없이 시도
      await axios.put(
        `http://localhost:8888/api/admin/playlists/${firstPlaylist._id}`,
        { title: 'test' }
      );
      console.log('❌ 보안 문제: Admin 권한 없이 수정 가능!');
    } catch (err) {
      console.log('✅ Admin 권한 없이 수정 차단됨');
    }
    
    try {
      // Admin 권한으로 시도
      await axios.put(
        `http://localhost:8888/api/admin/playlists/${firstPlaylist._id}`,
        { title: firstPlaylist.title || firstPlaylist.name },
        { headers: { 'X-Admin-Auth': 'true' } }
      );
      console.log('✅ Admin 권한으로 수정 성공');
    } catch (err) {
      console.log('❌ Admin 권한으로도 실패:', err.response?.data?.message || err.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPlaylists();