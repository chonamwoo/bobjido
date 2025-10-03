require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT || 8890;
const API_URL = `http://localhost:${PORT}/api/auth`;

async function testLogin() {
  console.log('Testing login functionality...\n');
  console.log(`API URL: ${API_URL}`);
  
  const testCases = [
    { loginId: 'testbob', password: 'test1234', expected: 'success' },
    { loginId: 'testbob@bobmap.com', password: 'test1234', expected: 'success' },
    { loginId: 'testbob', password: 'wrongpass', expected: 'fail' },
    { loginId: 'wronguser', password: 'test1234', expected: 'fail' },
  ];
  
  for (const test of testCases) {
    console.log(`\nTesting: ${test.loginId} / ${test.password.replace(/./g, '*')}`);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        loginId: test.loginId,
        password: test.password
      });
      
      if (test.expected === 'success') {
        console.log('✅ Login successful as expected');
        console.log('  User:', response.data.data.username);
        console.log('  Email:', response.data.data.email);
      } else {
        console.log('Unexpected success - should have failed');
      }
    } catch (error) {
      if (test.expected === 'fail') {
        console.log('✅ Login failed as expected');
        console.log('  Error:', error.response?.data?.message || error.message);
      } else {
        console.log('❌ Unexpected failure - should have succeeded');
        console.log('  Error:', error.response?.data?.message || error.message);
      }
    }
  }
}

testLogin().catch(console.error);