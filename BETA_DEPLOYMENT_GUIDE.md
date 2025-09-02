# 🚀 BobsMap 베타테스트 배포 가이드

## 📋 현재 상태
- **앱 URL**: 배포 후 생성됨 (예: https://bobmap.vercel.app)
- **API URL**: 배포 후 생성됨 (예: https://bobmap-api.railway.app)
- **베타 테스터**: 최대 50명
- **Admin 계정**: admin@bobmap.com / admin123!@#

---

## 🎯 빠른 시작 (친구들용)

### 1. 회원가입 및 로그인
1. 앱 접속: [배포 URL]
2. "시작하기" 버튼 클릭
3. 이메일/비밀번호로 회원가입
4. 취향 진단 테스트 완료 (8문항)

### 2. 플레이리스트 만들기
1. 하단 메뉴 → "만들기" 클릭
2. 플레이리스트 제목 입력 (예: "조남우의 강남 맛집")
3. 맛집 검색 후 추가
4. 태그 추가 (#데이트 #가성비 등)
5. "공개" 설정 후 저장

### 3. 친구 플레이리스트 보기
1. "지도" 메뉴 → "플레이리스트" 토글
2. 친구들의 플레이리스트 확인
3. 마음에 드는 플레이리스트 저장

---

## 🛠️ 배포 방법 (개발자용)

### Option 1: Vercel + Railway (추천) 🔥

#### 1단계: Frontend 배포 (Vercel)
```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 루트에서
vercel

# 3. 설정 선택
# ? Set up and deploy? Yes
# ? Which scope? (본인 계정 선택)
# ? Link to existing project? No
# ? Project name? bobmap
# ? In which directory is your code located? ./client
# ? Override settings? Yes
# Build Command: npm run build
# Output Directory: build
# Install Command: npm install
```

#### 2단계: Backend 배포 (Railway)
1. [Railway.app](https://railway.app) 가입
2. New Project → Deploy from GitHub Repo
3. BobsMap 레포지토리 선택
4. 환경변수 설정:
```
NODE_ENV=production
PORT=8888
MONGODB_URI=(MongoDB Atlas URI)
JWT_SECRET=(32자 랜덤 문자열)
CLIENT_URL=https://bobmap.vercel.app
```
5. Settings → Root Directory: `/server`
6. Deploy 클릭

#### 3단계: 클라이언트 환경변수 업데이트
```bash
# client/.env.production 생성
REACT_APP_API_URL=https://bobmap-api.railway.app
REACT_APP_SOCKET_URL=https://bobmap-api.railway.app
```

Vercel에서 다시 배포:
```bash
vercel --prod
```

### Option 2: Render.com (무료)

#### render.yaml 생성
```yaml
services:
  - type: web
    name: bobmap-api
    runtime: node
    repo: https://github.com/[your-username]/BobsMap
    buildCommand: cd server && npm install
    startCommand: cd server && node index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: bobmap-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
        
  - type: static
    name: bobmap-client
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://bobmap-api.onrender.com
```

---

## 👨‍💼 Admin 패널 사용법

### 1. Admin 로그인
```
URL: [앱URL]/admin
ID: admin@bobmap.com
PW: admin123!@#
```

### 2. Admin 기능
- **플레이리스트 관리**: 모든 플레이리스트 수정/삭제 가능
- **사용자 관리**: 사용자 정지/활성화
- **맛집 데이터 관리**: 맛집 정보 수정
- **통계 확인**: 사용자 활동, 인기 플레이리스트 등

### 3. Admin API 직접 사용
```bash
# 로그인하여 토큰 받기
curl -X POST https://api.bobmap.com/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bobmap.com","password":"admin123!@#"}'

# 플레이리스트 수정
curl -X PUT https://api.bobmap.com/api/admin/playlists/[playlist-id] \
  -H "Authorization: Bearer [admin-token]" \
  -H "Content-Type: application/json" \
  -d '{"title":"수정된 제목","isPublic":false}'

# 사용자 정지
curl -X PUT https://api.bobmap.com/api/admin/users/[user-id]/suspend \
  -H "Authorization: Bearer [admin-token]"
```

---

## 📱 모바일 앱처럼 설치 (PWA)

### iPhone
1. Safari로 앱 접속
2. 공유 버튼 탭
3. "홈 화면에 추가"
4. 앱 아이콘 생성됨

### Android
1. Chrome으로 앱 접속
2. 메뉴 → "홈 화면에 추가"
3. 앱 아이콘 생성됨

---

## 🔧 문제 해결

### 서버가 안 켜질 때
```bash
# 로그 확인
cd server
npm run dev

# 포트 충돌 확인
netstat -an | findstr 8888
```

### MongoDB 연결 오류
1. MongoDB Atlas 접속
2. Network Access → IP Whitelist
3. "Allow Access from Anywhere" 추가

### CORS 오류
```javascript
// server/index.js 수정
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://bobmap.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true
};
```

---

## 📊 베타테스트 체크리스트

### 배포 전
- [ ] 환경변수 모두 설정했나?
- [ ] MongoDB Atlas 연결 확인
- [ ] Admin 계정 생성 확인
- [ ] CORS 설정 확인

### 배포 후
- [ ] 회원가입 테스트
- [ ] 플레이리스트 생성 테스트
- [ ] 이미지 업로드 테스트
- [ ] 모바일 반응형 확인

### 친구들에게 공유
```
🍴 BobsMap 베타테스트 초대 🍴

맛집 플레이리스트 공유 앱을 만들었어!
서로의 맛집 리스트를 공유하고 새로운 맛집을 발견해보자.

🔗 앱 링크: [URL]

📱 사용법:
1. 회원가입 (1분)
2. 너만의 맛집 플레이리스트 만들기
3. 친구들 플레이리스트 구경하기

버그나 개선사항 있으면 말해줘!
```

---

## 🚨 긴급 연락처

문제 발생시:
- 개발자: [당신의 연락처]
- 에러 리포트: GitHub Issues
- 실시간 문의: [카톡 오픈채팅]

---

## 📈 모니터링

### 무료 모니터링 도구
1. **Sentry** (에러 트래킹): https://sentry.io
2. **MongoDB Atlas** (DB 모니터링): Atlas 대시보드
3. **Vercel Analytics** (사용자 분석): Vercel 대시보드
4. **Railway Metrics** (서버 상태): Railway 대시보드

### 주요 지표
- 일일 활성 사용자 (DAU)
- 플레이리스트 생성 수
- 에러율
- 응답 시간

---

## ⚡ 성능 최적화 팁

### 이미지 최적화
```javascript
// 이미지 리사이징
const optimizedUrl = `${imageUrl}?w=800&q=80&fm=webp`;
```

### 캐싱 설정
```javascript
// 정적 파일 캐싱
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

---

이제 베타테스트 준비 완료! 🎉