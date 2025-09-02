const axios = require('axios');

async function testRestaurantAdd() {
  try {
    console.log('=== 레스토랑 추가 테스트 ===\n');
    
    // 1. Admin 로그인
    console.log('1. Admin 로그인...');
    const loginResponse = await axios.post('http://localhost:8888/api/admin/login', {
      email: 'admin@bobmap.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('   ✓ 로그인 성공\n');
    
    // 2. 레스토랑 생성 테스트
    console.log('2. 레스토랑 생성 테스트...');
    const testRestaurant = {
      name: '테스트 레스토랑 ' + Date.now(),
      address: '서울 강남구 테스트로 123',
      category: '한식',
      phone: '02-1234-5678',
      coordinates: { lat: 37.5665, lng: 126.9780 },
      price: '보통',
      rating: 4.5,
      images: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'
    };
    
    try {
      const createResponse = await axios.post(
        'http://localhost:8888/api/admin/restaurants/create',
        testRestaurant,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Admin-Auth': 'true'
          }
        }
      );
      
      console.log('   ✓ 레스토랑 생성 성공');
      console.log('   레스토랑 ID:', createResponse.data._id);
      console.log('   레스토랑 이름:', createResponse.data.name);
      console.log('   카테고리:', createResponse.data.category);
      console.log('   가격대:', createResponse.data.priceRange);
      console.log('   좌표:', createResponse.data.coordinates);
      console.log('   이미지 수:', createResponse.data.images?.length || 0);
      
    } catch (createError) {
      console.error('   ✗ 레스토랑 생성 실패');
      if (createError.response) {
        console.error('   에러 상태:', createError.response.status);
        console.error('   에러 메시지:', createError.response.data.message);
        if (createError.response.data.errors) {
          console.error('   상세 에러:', createError.response.data.errors);
        }
        if (createError.response.data.details) {
          console.error('   에러 상세:', createError.response.data.details);
        }
      } else {
        console.error('   에러:', createError.message);
      }
    }
    
    // 3. 중복 생성 테스트 (같은 이름과 주소)
    console.log('\n3. 중복 레스토랑 테스트...');
    const duplicateRestaurant = {
      name: '광화문 국밥',
      address: '서울 종로구 새문안로3길 9',
      category: '한식',
      price: '보통'
    };
    
    try {
      const dupResponse = await axios.post(
        'http://localhost:8888/api/admin/restaurants/create',
        duplicateRestaurant,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Admin-Auth': 'true'
          }
        }
      );
      
      console.log('   ✓ 기존 레스토랑 반환 (중복 방지 작동)');
      console.log('   레스토랑 ID:', dupResponse.data._id);
      
    } catch (dupError) {
      console.error('   에러:', dupError.response?.data?.message || dupError.message);
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
  }
}

testRestaurantAdd();