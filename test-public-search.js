const axios = require('axios');

async function testPublicSearch() {
  try {
    console.log('=== 일반 사용자 검색 API 테스트 ===\n');
    
    // 1. 멕시칸 검색
    console.log('1. "멕시칸" 검색...');
    const mexicanResponse = await axios.get('http://localhost:8888/api/search/restaurants', {
      params: { query: '멕시칸' }
    });
    
    console.log(`   결과: ${mexicanResponse.data.restaurants.length}개`);
    if (mexicanResponse.data.restaurants.length > 0) {
      console.log('   첫 3개:');
      mexicanResponse.data.restaurants.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name} - ${r.category} (${r.source})`);
      });
    }
    
    // 2. 이탈리안 검색
    console.log('\n2. "이탈리안" 검색...');
    const italianResponse = await axios.get('http://localhost:8888/api/search/restaurants', {
      params: { query: '이탈리안' }
    });
    
    console.log(`   결과: ${italianResponse.data.restaurants.length}개`);
    if (italianResponse.data.restaurants.length > 0) {
      console.log('   첫 3개:');
      italianResponse.data.restaurants.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name} - ${r.category} (${r.source})`);
      });
    }
    
    // 3. 강남역 검색
    console.log('\n3. "강남역" 검색...');
    const gangnamResponse = await axios.get('http://localhost:8888/api/search/restaurants', {
      params: { query: '강남역' }
    });
    
    console.log(`   결과: ${gangnamResponse.data.restaurants.length}개`);
    if (gangnamResponse.data.restaurants.length > 0) {
      console.log('   첫 3개:');
      gangnamResponse.data.restaurants.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name} - ${r.category} (${r.source})`);
      });
    }
    
    // 4. 카테고리 지정 검색
    console.log('\n4. "강남" + 카테고리 "이탈리안" 검색...');
    const categoryResponse = await axios.get('http://localhost:8888/api/search/restaurants', {
      params: { 
        query: '강남',
        category: '이탈리안'
      }
    });
    
    console.log(`   결과: ${categoryResponse.data.restaurants.length}개`);
    if (categoryResponse.data.restaurants.length > 0) {
      console.log('   첫 3개:');
      categoryResponse.data.restaurants.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name} - ${r.category}`);
        if (r.naverCategory) {
          console.log(`      네이버: ${r.naverCategory}`);
        }
      });
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
    if (error.response) {
      console.error('응답:', error.response.data);
    }
  }
}

testPublicSearch();