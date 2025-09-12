# BobMap Native App 🍽️

React Native + Expo로 만든 BobMap 모바일 앱입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 16+
- Expo Go 앱 (iOS/Android)
- npm 또는 yarn

### 설치
```bash
# 프로젝트 디렉토리로 이동
cd BobMapNative

# 의존성 설치
npm install

# Expo 개발 서버 시작
npx expo start
```

### 실행 방법

#### 📱 실제 디바이스에서 실행
1. 스마트폰에 **Expo Go** 앱 설치
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. `npx expo start` 실행 후 나타나는 QR 코드 스캔
   - iOS: 카메라 앱으로 QR 스캔
   - Android: Expo Go 앱 내에서 QR 스캔

#### 💻 시뮬레이터/에뮬레이터에서 실행
```bash
# iOS 시뮬레이터 (Mac only)
npx expo start --ios

# Android 에뮬레이터
npx expo start --android

# 웹 브라우저 (실험적)
npx expo start --web
```

## 📁 프로젝트 구조

```
BobMapNative/
├── src/
│   ├── navigation/     # 네비게이션 설정
│   ├── screens/        # 화면 컴포넌트
│   │   ├── auth/       # 인증 관련 화면
│   │   └── ...         # 기타 화면들
│   ├── services/       # API 서비스
│   ├── types/          # TypeScript 타입 정의
│   └── components/     # 재사용 가능한 컴포넌트
├── assets/             # 이미지, 폰트 등
├── App.tsx             # 앱 진입점
└── package.json
```

## 🔧 API 서버 연결

개발 중에는 `src/services/api.ts`의 API_URL을 수정해야 합니다:

```typescript
// 로컬 개발 (실제 디바이스)
const API_URL = 'http://YOUR_IP_ADDRESS:8888/api';

// 로컬 개발 (Android 에뮬레이터)
const API_URL = 'http://10.0.2.2:8888/api';

// 로컬 개발 (iOS 시뮬레이터)
const API_URL = 'http://localhost:8888/api';
```

## 🎨 주요 기능

- ✅ 로그인/회원가입
- ✅ 맛집 플레이리스트 탐색
- ✅ 플레이리스트 생성
- ✅ 실시간 메시지
- ✅ 프로필 관리
- 🚧 카메라 연동 (개발 중)
- 🚧 GPS 위치 기반 검색 (개발 중)

## 🛠️ 개발 도구

### 유용한 명령어
```bash
# 캐시 초기화
npx expo start -c

# 개발 메뉴 열기
# iOS: Cmd + D
# Android: Cmd + M

# 타입 체크
npx tsc --noEmit

# 린트 실행
npm run lint
```

### 디버깅
1. React Native Debugger 설치
2. 앱에서 개발 메뉴 → "Debug Remote JS" 선택
3. Chrome DevTools 또는 React Native Debugger 사용

## 📦 빌드 및 배포

### 개발 빌드
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### 프로덕션 빌드
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

## 🐛 알려진 이슈

1. **iOS에서 로컬 서버 연결 안됨**
   - Info.plist에 NSAppTransportSecurity 설정 필요

2. **Android에서 이미지 로드 안됨**
   - HTTP 이미지는 Android 9+에서 차단됨
   - HTTPS 사용 또는 android:usesCleartextTraffic="true" 설정

## 📝 라이선스

MIT License

## 👥 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**문제가 있나요?** [이슈 생성](https://github.com/yourusername/BobMap/issues)