const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import logger
const { logger, requestLogger, errorLogger, notifyTaskComplete } = require('./utils/logger');

// Import tracking middleware
const { trackUserActivity } = require('./middleware/tracking');

// Import routes with error handling
let authRoutes, userRoutes, restaurantRoutes, playlistRoutes, adminRoutes, tasteProfileRoutes, globalDiscoveryRoutes, matchingRoutes, chatRoutes, onboardingRoutes, userStatsRoutes, followRoutes, notificationRoutes;

try {
  authRoutes = require('./routes/authRoutes');
  userRoutes = require('./routes/userRoutes');
  restaurantRoutes = require('./routes/restaurantRoutes');
  playlistRoutes = require('./routes/playlistRoutes');
  adminRoutes = require('./routes/adminRoutes');
  searchRoutes = require('./routes/searchRoutes');
  tasteProfileRoutes = require('./routes/tasteProfileRoutes');
  globalDiscoveryRoutes = require('./routes/globalDiscoveryRoutes');
  matchingRoutes = require('./routes/matchingRoutes');
  chatRoutes = require('./routes/chatRoutes');
  onboardingRoutes = require('./routes/onboardingRoutes');
  userStatsRoutes = require('./routes/userStats');
  recommendationsRoutes = require('./routes/recommendations');
  followRoutes = require('./routes/followRoutes');
  notificationRoutes = require('./routes/notificationRoutes');
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 100에서 1000으로 증가
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});

// Helmet 설정 - CSP 정책 완화
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://openapi.map.naver.com", "https://oapi.map.naver.com"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
      connectSrc: ["'self'", "https://naveropenapi.apigw.ntruss.com", "https://openapi.map.naver.com"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());

// CORS 설정 - 여러 origin 허용
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:5555',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5555'
];

app.use(cors({
  origin: function(origin, callback) {
    // origin이 없는 경우(예: 모바일 앱, Postman 등) 허용
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // 개발 중에는 모든 origin 허용
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Auth', 'x-admin-auth'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use(requestLogger);

// Add user activity tracking
app.use(trackUserActivity);

// Session middleware는 MongoDB 연결 후에 설정됩니다

// Rate limiting 일시적으로 비활성화 (개발 중)
// app.use('/api/', limiter);

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// uploads 폴더가 없으면 생성
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  logger.info('✅ MongoDB 연결 성공');
  notifyTaskComplete('MongoDB Connection', true);
  
  // MongoDB 연결 후 Session 및 Passport 초기화
  try {
    console.log('🔐 Session 및 Passport 초기화 중...');
    
    // Session middleware
    const session = require('express-session');
    app.use(session({
      secret: process.env.JWT_SECRET || 'bobmap-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
    
    // Passport 초기화
    const passportConfig = require('./config/passport');
    app.use(passportConfig.passport.initialize());
    app.use(passportConfig.passport.session());
    console.log('✅ Session 및 Passport 초기화 완료');
  } catch (error) {
    console.error('❌ Passport 초기화 실패:', error);
  }
  
  // 슈퍼 어드민 계정 생성 - 주석 처리 (수동으로 생성)
  // try {
  //   const { createSuperAdmin } = require('./controllers/adminController');
  //   await createSuperAdmin();
  //   console.log('✅ 어드민 설정 완료');
  // } catch (error) {
  //   console.log('⚠️ 어드민 설정 중 오류:', error.message);
  // }

  // 라우트 등록 (MongoDB 연결 후)
  console.log('🛣️ 라우트 등록 중...');
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/restaurants', restaurantRoutes);
  app.use('/api/playlists', playlistRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/taste-profile', tasteProfileRoutes);
  app.use('/api/global-discovery', globalDiscoveryRoutes);
  app.use('/api/matching', matchingRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/onboarding', onboardingRoutes);
  app.use('/api/user-stats', userStatsRoutes);
  app.use('/api/recommendations', recommendationsRoutes);
  app.use('/api/follow', followRoutes);
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ 라우트 등록 완료');
})
.catch((err) => {
  console.error('❌ MongoDB 연결 실패:', err.message);
  console.log('💡 MongoDB가 설치되어 있지 않다면 https://www.mongodb.com/try/download/community 에서 설치하세요');
  console.log('💡 또는 MongoDB Atlas (클라우드)를 사용하려면 .env 파일의 MONGODB_URI를 변경하세요');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BobMap API is running' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Add error logging middleware
app.use(errorLogger);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || '서버 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8888;
const { createServer } = require('http');
const { initializeWebSocket } = require('./websocket');

// HTTP 서버 생성 (WebSocket 연동을 위해)
const server = createServer(app);

// WebSocket 초기화
initializeWebSocket(server);

// 서버 시작
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 BobMap 서버가 포트 ${PORT}에서 실행 중입니다!`);
  logger.info(`CLIENT_URL: ${process.env.CLIENT_URL}`);
  logger.info(`SERVER_URL: ${process.env.SERVER_URL}`);
  notifyTaskComplete('Server Start', true);
  console.log('\x07'); // System beep for task completion
  console.log(`\n💻 PC 접속:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   ${process.env.CLIENT_URL || 'http://localhost:3001'} (React 개발 서버)`);
  console.log(`\n📱 모바일 접속 (같은 Wi-Fi 네트워크):`);
  console.log(`   http://172.20.10.4:3001`);
  console.log(`\n🔄 WebSocket: ws://172.20.10.4:${PORT}`);
  console.log('\n📋 시작 방법:');
  console.log('1. MongoDB 연결 완료 ✅');
  console.log('2. WebSocket 서버 초기화 완료 ✅');
  console.log('3. 프론트엔드: cd client && npm start');
  console.log('4. 모바일에서 http://172.20.10.4:3000 접속');
  console.log(`\n✅ API 서버가 모든 네트워크 인터페이스에서 수신 중입니다!`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}이 이미 사용 중입니다.`);
    console.error('💡 다른 프로세스를 종료하고 다시 시도해주세요.');
    console.error('💡 Windows: netstat -ano | findstr :8888 으로 확인 후 taskkill로 종료');
    process.exit(1);
  } else {
    console.error('❌ 서버 시작 오류:', err);
    process.exit(1);
  }
});