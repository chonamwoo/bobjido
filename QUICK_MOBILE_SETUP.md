# 📱 BobMap 모바일 접속 - 5분 설정 가이드

## 🎯 옵션 1: ngrok (가장 빠른 방법 - 무료)

### 1단계: ngrok 설치
```bash
# Windows (Chocolatey 사용)
choco install ngrok

# 또는 직접 다운로드
# https://ngrok.com/download 에서 다운로드
```

### 2단계: 서버 실행
```bash
# 터미널 1 - 백엔드
npm run server

# 터미널 2 - 프론트엔드
cd client
npm start
```

### 3단계: ngrok 실행
```bash
# 새 터미널에서
ngrok http 3000
```

### 4단계: 링크 복사
ngrok이 생성한 링크를 복사해서 모바일에서 접속:
```
https://abc123.ngrok.io  ← 이런 형태의 링크가 생성됩니다
```

📱 **모바일에서 이 링크로 접속하면 끝!**

---

## 🌐 옵션 2: Vercel 배포 (영구 링크 - 무료)

### 1단계: Vercel CLI 설치
```bash
npm install -g vercel
```

### 2단계: 프론트엔드 배포
```bash
cd client
vercel
```

### 3단계: 환경 변수 설정
Vercel 대시보드에서:
- Settings → Environment Variables
- `REACT_APP_API_URL` = 백엔드 URL 추가

### 배포된 링크
```
https://bobmap.vercel.app  ← 영구적으로 사용 가능
```

---

## 🚂 옵션 3: Railway 배포 (풀스택 - 무료 티어)

### 1단계: Railway 계정 생성
https://railway.app 에서 GitHub로 로그인

### 2단계: 새 프로젝트 생성
- "Deploy from GitHub repo" 선택
- BobMap 리포지토리 선택

### 3단계: 환경 변수 설정
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
```

### 배포된 링크
```
https://bobmap.railway.app  ← 풀스택 앱 완성!
```

---

## 📲 옵션 4: PWA 설정 (앱처럼 설치)

### manifest.json 추가
`client/public/manifest.json`:
```json
{
  "short_name": "BobMap",
  "name": "BobMap - 맛집 매칭",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#ff6b35",
  "background_color": "#ffffff"
}
```

### 모바일에서 설치
1. Chrome/Safari에서 사이트 열기
2. 메뉴 → "홈 화면에 추가"
3. 앱 아이콘으로 바로 실행!

---

## 🎨 옵션 5: Expo Web (React Native 변환)

React 앱을 React Native로 변환하여 진짜 앱으로:

### 설치
```bash
npm install -g expo-cli
expo init bobmap-mobile
```

### 기존 코드 이전
React 컴포넌트를 React Native 컴포넌트로 변환

### 실행
```bash
expo start
# QR 코드 스캔으로 Expo Go 앱에서 실행
```

---

## 🔥 추천 순서

1. **지금 당장 테스트**: ngrok (5분)
2. **친구들과 공유**: Vercel (30분)
3. **완벽한 서비스**: Railway (1시간)
4. **앱처럼 사용**: PWA 설정 추가
5. **진짜 앱 개발**: Expo/React Native

---

## 💡 각 방법의 장단점

| 방법 | 설정 시간 | 비용 | 영구성 | 속도 |
|------|----------|------|--------|------|
| ngrok | 5분 | 무료 | 임시(8시간) | 빠름 |
| Vercel | 30분 | 무료 | 영구 | 매우 빠름 |
| Railway | 1시간 | 무료($5) | 영구 | 빠름 |
| PWA | 10분 | 무료 | - | 기존 속도 |
| Expo | 2시간+ | 무료 | - | 네이티브 |

---

## 🚀 가장 빠른 시작 (ngrok)

```bash
# 1. ngrok 다운로드 (1분)
# https://ngrok.com/download

# 2. 실행 (10초)
ngrok http 3000

# 3. 생성된 링크 복사 (5초)
# https://abc123.ngrok.io

# 4. 모바일에서 접속! 🎉
```

**더 쉬운 방법이 필요하시면 말씀해주세요!**