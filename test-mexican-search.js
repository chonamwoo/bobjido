const axios = require('axios');

async function testMexicanSearch() {
  try {
    console.log('=== 카테고리별 맛집 검색 테스트 ===\n');
    
    // 1. Admin 로그인
    console.log('1. Admin 로그인...');
    const loginResponse = await axios.post('http://localhost:8888/api/admin/login', {
      email: 'admin@bobmap.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✓ 로그인 성공\n');
    
    // 2. 멕시칸 맛집 검색
    console.log('2. "멕시칸" 검색 테스트...');
    const mexicanResponse = await axios.get('http://localhost:8888/api/admin/restaurants/search', {
      params: { query: '멕시칸' },
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Admin-Auth': 'true'
      }
    });
    
    console.log(`   검색 결과: ${mexicanResponse.data.length}개\n`);
    
    if (mexicanResponse.data.length > 0) {
      console.log('=== 멕시칸 검색 결과 ===');
      let mexicanaCount = 0;
      let realMexicanCount = 0;
      
      mexicanResponse.data.forEach((restaurant, index) => {
        console.log(`\n${index + 1}. ${restaurant.name}`);
        console.log(`   주소: ${restaurant.address}`);
        console.log(`   카테고리: ${restaurant.category}`);
        if (restaurant.naverCategory) {
          console.log(`   네이버 카테고리: ${restaurant.naverCategory}`);
        }
        
        // 멕시카나 치킨인지 체크
        if (restaurant.name.includes('멕시카나')) {
          console.log(`   ⚠️ 멕시카나 치킨 발견!`);
          mexicanaCount++;
        }
        
        // 진짜 멕시칸 음식점인지 체크
        if (restaurant.naverCategory && 
            (restaurant.naverCategory.includes('멕시코') || 
             restaurant.naverCategory.includes('남미') ||
             restaurant.name.toLowerCase().includes('taco') ||
             restaurant.name.includes('타코'))) {
          console.log(`   ✓ 진짜 멕시칸 음식점`);
          realMexicanCount++;
        }
      });
      
      console.log(`\n=== 분석 결과 ===`);
      console.log(`총 ${mexicanResponse.data.length}개 중:`);
      console.log(`- 진짜 멕시칸 음식점: ${realMexicanCount}개`);
      console.log(`- 멕시카나 치킨: ${mexicanaCount}개`);
    }
    
    // 3. 이탈리안 검색 테스트
    console.log('\n3. "이탈리안" 검색 테스트...');
    const italianResponse = await axios.get('http://localhost:8888/api/admin/restaurants/search', {
      params: { query: '이탈리안' },
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Admin-Auth': 'true'
      }
    });
    
    console.log(`   검색 결과: ${italianResponse.data.length}개`);
    if (italianResponse.data.length > 0) {
      console.log('\n   첫 3개 결과:');
      italianResponse.data.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name}`);
        if (r.naverCategory) {
          console.log(`      카테고리: ${r.naverCategory}`);
        }
      });
    }
    
    // 4. 타코 검색 테스트
    console.log('\n4. "타코" 검색 테스트...');
    const tacoResponse = await axios.get('http://localhost:8888/api/admin/restaurants/search', {
      params: { query: '타코' },
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Admin-Auth': 'true'
      }
    });
    
    console.log(`   검색 결과: ${tacoResponse.data.length}개`);
    if (tacoResponse.data.length > 0) {
      console.log('\n   첫 3개 결과:');
      tacoResponse.data.slice(0, 3).forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.name}`);
        if (r.naverCategory) {
          console.log(`      카테고리: ${r.naverCategory}`);
        }
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

testMexicanSearch();