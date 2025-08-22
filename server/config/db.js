const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // SSL 오류 처리를 위한 설정
    mongoose.set('strictQuery', false);
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // IPv4 강제 사용
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    };

    // MongoDB Atlas는 기본적으로 SSL을 사용하므로 SSL 설정 제거
    // SSL 오류가 지속되면 다음 옵션 사용
    if (process.env.NODE_ENV === 'development') {
      connectionOptions.tls = true;
      connectionOptions.tlsAllowInvalidCertificates = true;
      connectionOptions.tlsAllowInvalidHostnames = true;
    }

    console.log('MongoDB 연결 시도 중...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
    
    // 연결 이벤트 리스너
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 연결 오류:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 연결이 끊어졌습니다.');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB 재연결되었습니다.');
    });
    
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    
    // SSL 관련 오류 상세 정보
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('SSL/TLS 오류 발생. 다음을 확인하세요:');
      console.error('1. MongoDB Atlas 네트워크 접근 설정에서 현재 IP가 허용되었는지 확인');
      console.error('2. MongoDB URI가 올바른지 확인');
      console.error('3. 인터넷 연결 상태 확인');
    }
    
    // 5초 후 재시도
    console.log('5초 후 재연결을 시도합니다...');
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;