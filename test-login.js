const axios = require('axios');

async function testLogin(userId, password) {
  try {
    const response = await axios.post('http://localhost:8890/api/auth/login', {
      loginId: userId,
      password: password
    });
    
    console.log(`✅ ${userId} 로그인 성공!`);
    console.log(`   이름: ${response.data.data.username}`);
    console.log(`   이메일: ${response.data.data.email}`);
  } catch (error) {
    console.log(`❌ ${userId} 로그인 실패:`, error.response?.data?.message || error.message);
  }
}

async function testAllAccounts() {
  console.log('📝 모든 계정 로그인 테스트\n');
  console.log('=' .repeat(50));
  
  await testLogin('testuser', 'testuser');
  console.log('-' .repeat(50));
  
  await testLogin('testbob', 'BobMap2025!Test');
  console.log('-' .repeat(50));
  
  await testLogin('admin', 'BobMap2025!Admin');
  console.log('=' .repeat(50));
}

testAllAccounts();