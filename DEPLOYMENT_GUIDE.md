# BobMap 배포 가이드 🚀

## 빠른 시작 - 30분 안에 배포하기

### 1단계: MongoDB Atlas 설정 (5분)
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 가입
2. 무료 클러스터 생성 (M0 Sandbox)
3. Database Access에서 사용자 생성
4. Network Access에서 0.0.0.0/0 추가 (모든 IP 허용)
5. Connect 버튼 → Connect your application → 연결 문자열 복사

### 2단계: 환경 변수 설정 (5분)

`.env` 파일 생성:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bobmap?retryWrites=true&w=majority

# JWT Secret (랜덤 문자열 생성)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server
PORT=8888
NODE_ENV=production

# Google OAuth (선택사항)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth (선택사항)
KAKAO_CLIENT_ID=your-kakao-app-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# 네이버 지도 API (선택사항)
NAVER_MAP_CLIENT_ID=your-naver-client-id
NAVER_MAP_CLIENT_SECRET=your-naver-client-secret
```

### 3단계: Vercel 배포 (10분)

#### A. GitHub에 코드 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/bobmap.git
git push -u origin main
```

#### B. Vercel 설정
1. [Vercel](https://vercel.com) 가입 (GitHub 연동)
2. "New Project" 클릭
3. GitHub 레포지토리 선택
4. Framework Preset: Create React App 선택
5. Build Settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/build`
6. Environment Variables 추가 (위의 .env 내용)

#### C. 백엔드 배포 (Render.com 추천)
1. [Render](https://render.com) 가입
2. New Web Service 생성
3. GitHub 레포지토리 연결
4. 설정:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables 추가

### 4단계: 프론트엔드 API URL 수정 (5분)

`client/src/utils/axios.ts` 수정:
```typescript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com'  // Render 배포 URL
  : 'http://localhost:8888';

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});
```

## 🎯 배포 후 체크리스트

- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] 취향 진단 테스트
- [ ] 맛집 등록 테스트
- [ ] 매칭 기능 테스트
- [ ] PWA 설치 테스트

## 💰 비용

### 무료 티어 한계
- **MongoDB Atlas M0**: 512MB 스토리지 (약 10,000 사용자)
- **Vercel**: 월 100GB 대역폭
- **Render**: 월 750시간 무료

### 유료 업그레이드 시점
- 사용자 1,000명 이상
- 일일 활성 사용자 100명 이상
- 이미지 업로드 많을 때

## 🔒 보안 체크리스트

### 필수 설정
```javascript
// server/index.js에 추가
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-app.vercel.app',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### 환경별 설정
```javascript
// 프로덕션 전용 설정
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.enable('trust proxy');
  
  // HTTPS 강제
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 📱 PWA 배포

### manifest.json 확인
```json
{
  "name": "BobMap - 취향 기반 맛집 매칭",
  "short_name": "BobMap",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FF6B6B",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker 등록 확인
```javascript
// client/src/index.tsx
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register();
```

## 🖥️ 데스크톱 앱 배포 (Electron)

### Windows 배포
```bash
npm run dist-win
# dist/BobMap Setup 1.0.0.exe 생성됨
```

### Mac 배포
```bash
npm run dist-mac
# dist/BobMap-1.0.0.dmg 생성됨
```

### 자동 업데이트 설정
```javascript
// electron-main.js
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

## 📊 모니터링 설정

### Google Analytics
```html
<!-- client/public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry 에러 트래킹
```bash
npm install @sentry/react
```

```javascript
// client/src/index.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

## 🚨 문제 해결

### CORS 에러
```javascript
// 백엔드 CORS 설정 확인
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true
}));
```

### MongoDB 연결 실패
- Network Access에서 IP 화이트리스트 확인
- 연결 문자열의 비밀번호 특수문자 인코딩 확인

### 빌드 실패
```bash
# 로컬에서 먼저 테스트
cd client
npm run build
```

## 📈 성공 지표

### 첫 주 목표
- [ ] 100명 가입
- [ ] 50개 맛집 등록
- [ ] 10개 매칭 성사

### 첫 달 목표
- [ ] 1,000명 가입
- [ ] 500개 맛집 등록
- [ ] 100개 매칭 성사
- [ ] 일일 활성 사용자 50명

## 💡 마케팅 팁

### 초기 사용자 확보
1. **베타 테스터 모집**: 인스타그램, 에브리타임
2. **리워드 제공**: 초기 100명 특별 배지
3. **인플루언서 협업**: 맛집 블로거/유튜버
4. **대학가 타겟팅**: 학교별 맛집 리스트

### 바이럴 기능
- 취향 테스트 결과 공유
- 맛집 리스트 공유
- 친구 초대 리워드

## 🎉 출시 준비 완료!

모든 준비가 완료되었습니다. 이제 실제 사용자들이 사용할 수 있습니다!

### 지원 연락처
- 이메일: support@bobmap.com
- 카카오톡: @bobmap
- GitHub Issues: https://github.com/yourusername/bobmap/issues

---
*마지막 업데이트: 2025-08-18*