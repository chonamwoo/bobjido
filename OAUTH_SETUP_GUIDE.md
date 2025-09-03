# OAuth 로그인 설정 가이드

## 🔐 Google OAuth 설정

### Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **API 및 서비스** > **사용자 인증 정보** 이동
4. OAuth 2.0 클라이언트 ID 수정

### ✅ 승인된 리디렉션 URI (반드시 모두 추가)
```
http://localhost:8888/api/auth/google/callback
http://172.20.10.4:8888/api/auth/google/callback
```

### ⚠️ 주의사항
- 포트 번호가 **8888**인지 확인 (3000이나 5000이 아님!)
- 네트워크 IP 주소 (172.20.10.4)도 반드시 추가
- 끝에 `/api/auth/google/callback` 경로 포함

---

## 🟡 Kakao OAuth 설정

### Kakao Developers 설정
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 > BobMap 선택
3. **앱 설정** > **플랫폼** > **Web**

### ✅ 사이트 도메인 설정
```
http://localhost:8888
http://172.20.10.4:8888
http://localhost:3001
http://172.20.10.4:3001
```

### ✅ Redirect URI 설정
**카카오 로그인** > **Redirect URI** 에서 다음 URI 등록:
```
http://localhost:8888/api/auth/kakao/callback
http://172.20.10.4:8888/api/auth/kakao/callback
```

### ⚠️ 주의사항
- 카카오는 사이트 도메인과 Redirect URI 둘 다 등록 필요
- 포트 번호가 **8888**인지 확인
- 네트워크 IP 주소도 반드시 추가

---

## 🔧 환경 변수 확인

### `.env` (서버)
```env
PORT=8888
SERVER_URL=http://172.20.10.4:8888
CLIENT_URL=http://172.20.10.4:3001
```

### `client/.env` (클라이언트)
```env
PORT=3001
REACT_APP_API_URL=http://172.20.10.4:8888
```

---

## 📱 모바일 테스트

1. PC와 모바일이 같은 Wi-Fi 네트워크에 연결되어 있는지 확인
2. 모바일 브라우저에서 `http://172.20.10.4:3001` 접속
3. 로그인 페이지에서 Google/Kakao 로그인 테스트

## 🔍 디버깅

OAuth 로그인이 실패하는 경우:
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. 리다이렉트 URL이 올바른지 확인
3. 서버 로그 확인: `npm run server` 콘솔 출력 확인

## 📌 중요 포인트

- **포트 8888**: OAuth 콜백은 백엔드 서버(8888)로 와야 함
- **포트 3001**: 프론트엔드는 3001에서 실행
- **네트워크 IP**: 모바일 접속을 위해 172.20.10.4 사용
- **auth-bridge.html**: OAuth 성공 후 토큰을 localStorage에 저장하고 리다이렉트