const mongoose = require('mongoose');
require('dotenv').config();

async function fixUserIndex() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // User 컬렉션 가져오기
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // 기존 인덱스 확인
    console.log('\n📋 현재 인덱스:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(idx => {
      console.log(`- ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    
    // email 인덱스 삭제 (기본 _id 인덱스 제외)
    try {
      await collection.dropIndex('email_1');
      console.log('\n✅ email_1 인덱스 삭제 완료');
    } catch (error) {
      console.log('⚠️ email_1 인덱스가 없거나 이미 삭제됨');
    }
    
    // sparse 인덱스로 재생성 (partialFilterExpression 없이)
    await collection.createIndex(
      { email: 1 }, 
      { 
        unique: true, 
        sparse: true  // null 값 허용
      }
    );
    console.log('✅ email sparse 인덱스 생성 완료');
    
    // username 인덱스도 확인
    try {
      await collection.createIndex(
        { username: 1 }, 
        { unique: true }
      );
      console.log('✅ username 인덱스 확인/생성 완료');
    } catch (error) {
      console.log('⚠️ username 인덱스 이미 존재');
    }
    
    // kakaoId, googleId 인덱스도 sparse로
    try {
      await collection.createIndex(
        { kakaoId: 1 }, 
        { sparse: true }
      );
      await collection.createIndex(
        { googleId: 1 }, 
        { sparse: true }
      );
      console.log('✅ OAuth ID 인덱스 생성 완료');
    } catch (error) {
      console.log('⚠️ OAuth ID 인덱스 이미 존재');
    }
    
    console.log('\n📋 업데이트된 인덱스:');
    const newIndexes = await collection.listIndexes().toArray();
    newIndexes.forEach(idx => {
      console.log(`- ${idx.name}: ${JSON.stringify(idx.key)}`);
      if (idx.sparse) console.log('  (sparse: true)');
      if (idx.partialFilterExpression) console.log(`  (partial: ${JSON.stringify(idx.partialFilterExpression)})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

fixUserIndex();