const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB 연결 테스트 (더 상세한 에러 정보)
async function testConnection() {
  const username = 'whskadn73';
  const password = 'whskadn73';
  const cluster = 'jido.wm1k0ul.mongodb.net';
  const database = 'bobmap';
  
  // 비밀번호 URL 인코딩
  const encodedPassword = encodeURIComponent(password);
  
  // 연결 문자열 구성
  const uri = `mongodb+srv://${username}:${encodedPassword}@${cluster}/${database}?retryWrites=true&w=majority&appName=jido`;
  
  console.log('Username:', username);
  console.log('Cluster:', cluster);
  console.log('Database:', database);
  console.log('Encoded Password:', encodedPassword);
  console.log('Full URI (masked):', uri.replace(encodedPassword, '****'));
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    console.log('\n연결 시도 중...');
    await client.connect();
    console.log('✅ MongoDB 연결 성공!');
    
    // 연결 테스트
    const db = client.db(database);
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('연결 종료');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패');
    console.error('Error Code:', error.code);
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('auth')) {
      console.error('\n🔐 인증 문제 해결 방법:');
      console.error('1. MongoDB Atlas에서 Database Access 확인');
      console.error('2. 사용자명과 비밀번호가 정확한지 확인');
      console.error('3. 사용자가 해당 데이터베이스에 접근 권한이 있는지 확인');
    }
    
    if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n🌐 네트워크 문제 해결 방법:');
      console.error('1. MongoDB Atlas Network Access에서 현재 IP 추가');
      console.error('2. 개발용이라면 0.0.0.0/0 (Allow from anywhere) 추가');
    }
  }
}

testConnection();