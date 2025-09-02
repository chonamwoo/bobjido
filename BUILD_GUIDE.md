# 🚀 BobMap 애플리케이션 빌드 가이드

## 📱 모바일 앱 (PWA - Progressive Web App)

### 1. PWA로 변환 (가장 간단!)
이미 React 앱이 PWA를 지원하도록 설정되어 있습니다.

```bash
cd client
npm run build
```

빌드 후 배포하면 사용자들이 "홈 화면에 추가"로 앱처럼 사용 가능합니다.

### 2. React Native로 변환
```bash
npx react-native init BobMapMobile
# 기존 컴포넌트를 React Native 컴포넌트로 변환 필요
```

## 💻 데스크톱 앱 (Electron)

### 설치
```bash
npm install electron electron-builder --save-dev
```

### 개발 모드 실행
```bash
# 터미널 1: 백엔드 서버 실행
npm run server

# 터미널 2: React 개발 서버 실행
npm run client

# 터미널 3: Electron 개발 모드 실행
npm run electron-dev
```

### 프로덕션 빌드

#### Windows 실행 파일 (.exe)
```bash
npm run dist-win
```
→ `dist/Bob's Map Setup 1.0.0.exe` 생성

#### Mac 앱 (.dmg)
```bash
npm run dist-mac
```
→ `dist/Bob's Map-1.0.0.dmg` 생성

#### Linux 앱 (AppImage)
```bash
npm run dist-linux
```
→ `dist/Bob's Map-1.0.0.AppImage` 생성

## 🌐 웹 배포

### 1. Vercel (추천)
```bash
cd client
npm run build
npx vercel --prod
```

### 2. Netlify
```bash
cd client
npm run build
# build 폴더를 Netlify에 드래그 앤 드롭
```

### 3. GitHub Pages
```bash
cd client
npm install --save-dev gh-pages
```

package.json에 추가:
```json
"homepage": "https://yourusername.github.io/BobMap",
"scripts": {
  "deploy": "npm run build && gh-pages -d build"
}
```

```bash
npm run deploy
```

## 🐳 Docker 컨테이너

### Dockerfile 생성
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client && npm install && npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### 빌드 및 실행
```bash
docker build -t bobmap .
docker run -p 5000:5000 bobmap
```

## 📦 Chrome Extension

### manifest.json 생성
```json
{
  "manifest_version": 3,
  "name": "Bob's Map",
  "version": "1.0.0",
  "description": "취향 기반 맛집 매칭",
  "action": {
    "default_popup": "index.html"
  },
  "permissions": ["storage", "tabs"]
}
```

Chrome 확장 프로그램으로 설치 가능

## 🎯 빠른 시작 (Windows 사용자)

1. **가장 간단한 방법 - 웹앱 배포**
```bash
cd client
npm run build
# build 폴더의 내용을 웹 서버에 업로드
```

2. **데스크톱 앱 만들기**
```bash
# Electron 설치
npm install electron electron-builder --save-dev

# Windows 실행 파일 생성
npm run build
npm run dist-win

# dist 폴더에서 설치 파일 확인
```

3. **즉시 실행 가능한 파일**
```bash
# Electron 개발 모드로 바로 실행
npm run electron-dev
```

## 🔧 환경 설정

### .env 파일 설정
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 포트 설정
- 백엔드: 5000
- 프론트엔드: 3000

## 📝 주의사항

1. **빌드 전 확인사항**
   - MongoDB 연결 설정
   - 환경 변수 설정
   - 이미지 파일 경로 확인

2. **배포 시 체크리스트**
   - [ ] 프로덕션 환경 변수 설정
   - [ ] HTTPS 설정
   - [ ] 도메인 설정
   - [ ] 백엔드 API URL 수정

3. **모바일 반응형 확인**
   - 이미 반응형 디자인 적용됨
   - PWA로 모바일 앱처럼 사용 가능

## 🚨 문제 해결

### Electron 실행 안 될 때
```bash
# node_modules 재설치
rm -rf node_modules
npm install
```

### 빌드 에러 시
```bash
# client 폴더에서
cd client
rm -rf node_modules
npm install
npm run build
```

### 포트 충돌 시
```bash
# Windows에서 포트 확인
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# 프로세스 종료
taskkill /PID [프로세스ID] /F
```

## 🎉 완성!

이제 BobMap을 다양한 플랫폼에서 사용할 수 있습니다:
- ✅ 웹 브라우저
- ✅ Windows 데스크톱 앱
- ✅ Mac 데스크톱 앱
- ✅ PWA (모바일 앱처럼 사용)
- ✅ Chrome Extension

가장 간단한 방법은 **PWA 웹앱 배포**입니다!