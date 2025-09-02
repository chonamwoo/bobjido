const axios = require('axios');

async function checkRestaurantNames() {
  try {
    console.log('=== 레스토랑 이름 확인 ===\n');
    
    // 레스토랑 목록 가져오기
    const response = await axios.get('http://localhost:8888/api/restaurants');
    const restaurants = response.data.restaurants || response.data;
    
    console.log(`총 레스토랑 수: ${restaurants.length}\n`);
    
    // 카테고리별로 정리
    const byCategory = {};
    restaurants.forEach(r => {
      if (!byCategory[r.category]) {
        byCategory[r.category] = [];
      }
      byCategory[r.category].push({
        name: r.name,
        address: r.address,
        priceRange: r.priceRange,
        hasCoordinates: !!(r.coordinates && r.coordinates.lat && r.coordinates.lng)
      });
    });
    
    // 카테고리별 출력
    Object.keys(byCategory).forEach(category => {
      console.log(`\n[${category}] (${byCategory[category].length}개)`);
      byCategory[category].slice(0, 5).forEach(r => {
        console.log(`  - ${r.name}`);
        console.log(`    주소: ${r.address}`);
        console.log(`    가격대: ${r.priceRange}`);
        console.log(`    좌표: ${r.hasCoordinates ? '✓' : '✗'}`);
      });
      if (byCategory[category].length > 5) {
        console.log(`  ... 외 ${byCategory[category].length - 5}개`);
      }
    });
    
    // 문제가 있을 수 있는 레스토랑 찾기
    console.log('\n=== 잠재적 문제 확인 ===');
    
    const problems = [];
    restaurants.forEach(r => {
      if (!r.coordinates || !r.coordinates.lat || !r.coordinates.lng) {
        problems.push(`좌표 없음: ${r.name}`);
      }
      if (!r.priceRange || !['저렴한', '보통', '비싼', '매우비싼'].includes(r.priceRange)) {
        problems.push(`잘못된 가격대(${r.priceRange}): ${r.name}`);
      }
      if (!r.category || !['한식', '중식', '일식', '양식', '동남아', '카페', '디저트', '주점', '패스트푸드', '기타'].includes(r.category)) {
        problems.push(`잘못된 카테고리(${r.category}): ${r.name}`);
      }
    });
    
    if (problems.length > 0) {
      console.log('문제 발견:');
      problems.forEach(p => console.log(`  - ${p}`));
    } else {
      console.log('모든 레스토랑 데이터가 정상입니다.');
    }
    
  } catch (error) {
    console.error('에러:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
    }
  }
}

checkRestaurantNames();