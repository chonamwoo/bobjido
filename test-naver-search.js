const axios = require('axios');

async function testNaverSearch() {
  try {
    console.log('=== 네이버 맛집 검색 테스트 ===\n');
    
    // 1. Admin 로그인
    console.log('1. Admin 로그인...');
    const loginResponse = await axios.post('http://localhost:8888/api/admin/login', {
      email: 'admin@bobmap.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✓ 로그인 성공\n');
    
    // 2. 망원동 맛집 검색
    console.log('2. 망원동 맛집 검색 (네이버 API)...');
    const searchResponse = await axios.get('http://localhost:8888/api/admin/restaurants/search', {
      params: { query: '망원동' },
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Admin-Auth': 'true'
      }
    });
    
    console.log(`   검색 결과: ${searchResponse.data.length}개\n`);
    
    if (searchResponse.data.length > 0) {
      console.log('=== 실제 망원동 맛집 목록 ===');
      searchResponse.data.slice(0, 10).forEach((restaurant, index) => {
        console.log(`\n${index + 1}. ${restaurant.name}`);
        console.log(`   주소: ${restaurant.address}`);
        console.log(`   카테고리: ${restaurant.category}`);
        if (restaurant.naverCategory) {
          console.log(`   네이버 카테고리: ${restaurant.naverCategory}`);
        }
        console.log(`   전화: ${restaurant.phone || '정보없음'}`);
        console.log(`   좌표: ${restaurant.coordinates.lat}, ${restaurant.coordinates.lng}`);
        console.log(`   출처: ${restaurant.source}`);
      });
      
      // 통계
      console.log('\n=== 카테고리 통계 ===');
      const categoryCount = {};
      searchResponse.data.forEach(r => {
        categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
      });
      Object.entries(categoryCount).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}개`);
      });
    } else {
      console.log('   검색 결과가 없습니다.');
    }
    
    // 3. 다른 지역 테스트
    console.log('\n3. 성수동 맛집 검색...');
    const sungsuResponse = await axios.get('http://localhost:8888/api/admin/restaurants/search', {
      params: { query: '성수동' },
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Admin-Auth': 'true'
      }
    });
    
    console.log(`   성수동 검색 결과: ${sungsuResponse.data.length}개`);
    if (sungsuResponse.data.length > 0) {
      console.log('   첫 3개 결과:');
      sungsuResponse.data.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name} - ${r.address}`);
      });
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
  }
}

testNaverSearch();