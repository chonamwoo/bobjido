# 네이버 OAuth 로그인 설정 가이드

## 현재 상태
네이버 OAuth 로그인 기능은 **코드는 구현되어 있으나 API 키 설정이 필요**합니다.

## 설정 방법

### 1. 네이버 개발자 센터에서 앱 등록

1. [네이버 개발자 센터](https://developers.naver.com) 접속
2. 로그인 후 "Application > 애플리케이션 등록" 클릭
3. 애플리케이션 정보 입력:
   - **애플리케이션 이름**: BobMap
   - **사용 API**: 네이버 아이디로 로그인
   - **제공 정보**: 이메일 주소, 닉네임, 프로필 사진

### 2. 서비스 환경 설정

애플리케이션 등록 후 서비스 설정:

- **서비스 URL**:
  ```
  http://localhost:3000
  ```

- **Callback URL**:
  ```
  http://localhost:8888/api/auth/naver/callback
  ```

### 3. 환경 변수 설정

`server/.env` 파일에 다음 추가:

```env
# 네이버 OAuth (로그인용)
NAVER_CLIENT_ID=발급받은_클라이언트_ID
NAVER_CLIENT_SECRET=발급받은_클라이언트_시크릿

# 네이버 검색 API (이미 설정됨)
NAVER_SEARCH_CLIENT_ID=V5HzbgRHQULqRaHJjevb
NAVER_SEARCH_CLIENT_SECRET=TsJH7X71M9
```

### 4. 서버 재시작

```bash
# 서버 재시작
npm run server
```

## 대체 방법 (현재 사용 가능)

네이버 OAuth를 설정하지 않아도 다음 방법으로 네이버 맛집을 가져올 수 있습니다:

### 1. 네이버 지도 공유 링크 사용
1. 네이버 지도 앱/웹에서 맛집 리스트 열기
2. "공유" 버튼 클릭
3. 링크 복사
4. BobMap에서 붙여넣기

### 2. 네이버 검색 API 사용 (현재 작동)
- 키워드로 맛집 검색
- 지역 + 음식 종류로 검색
- 예: "강남 파스타", "홍대 카페"

## 문제 해결

### 오류: "네이버 로그인 설정이 필요합니다"
→ 위의 설정 가이드를 따라 OAuth 앱을 등록하고 환경 변수를 설정하세요.

### 오류: "Invalid client"
→ CLIENT_ID와 CLIENT_SECRET이 올바른지 확인하세요.

### 오류: "Redirect URI mismatch"
→ 네이버 개발자 센터에서 Callback URL이 정확히 설정되었는지 확인하세요.

## 기술 구현 상태

✅ **구현 완료**:
- passport-naver-v2 전략 (`server/config/passport.js`)
- 라우트 설정 (`server/routes/authRoutes.js`)
- 클라이언트 UI (`client/src/pages/ImportNaverPlaces.tsx`)

❌ **설정 필요**:
- 네이버 개발자 센터 앱 등록
- 환경 변수 설정

## 참고 링크
- [네이버 로그인 API 가이드](https://developers.naver.com/docs/login/api/)
- [네이버 개발자 센터](https://developers.naver.com)