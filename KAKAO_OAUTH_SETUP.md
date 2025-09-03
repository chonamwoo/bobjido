# Kakao OAuth 설정 가이드

## 1. Kakao Developers 앱 생성

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 후 "내 애플리케이션" 클릭
3. "애플리케이션 추가하기" 클릭
4. 앱 정보 입력:
   - 앱 이름: BobMap (또는 원하는 이름)
   - 사업자명: 개인 또는 회사명

## 2. 앱 키 확인

1. 생성된 앱 클릭
2. "앱 키" 메뉴에서 확인
3. **REST API 키** 복사 (이것을 사용)

## 3. 플랫폼 등록

1. "플랫폼" 메뉴 클릭
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 입력:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:8890
   ```

## 4. Redirect URI 등록

1. "제품 설정" > "카카오 로그인" 활성화
2. "Redirect URI 등록" 클릭
3. 다음 URI 추가:
   ```
   http://localhost:8890/api/auth/kakao/callback
   ```

## 5. 동의 항목 설정

1. "제품 설정" > "카카오 로그인" > "동의항목"
2. 필수 동의 항목:
   - 닉네임
   - 프로필 사진
3. 선택 동의 항목:
   - 카카오계정 이메일

## 6. .env 파일 설정

`server/.env` 파일에 추가:
```env
# Kakao OAuth
KAKAO_CLIENT_ID=your_rest_api_key_here
```

⚠️ **주의**: Client Secret은 카카오는 사용하지 않습니다.

## 7. 서버 재시작

```bash
# 서버 재시작
cd server
npm run server
```

## 테스트

1. 브라우저에서 http://localhost:3000 접속
2. "카카오로 로그인" 버튼 클릭
3. 카카오 계정으로 로그인
4. 동의하고 계속하기 클릭

## 트러블슈팅

### "Cannot GET /api/auth/kakao" 오류
- .env 파일에 KAKAO_CLIENT_ID가 설정되어 있는지 확인
- 서버를 재시작했는지 확인

### "KOE101" 오류 (Invalid redirect_uri)
- Redirect URI가 정확히 일치하는지 확인
- Kakao Developers에서 등록한 URI와 서버에서 사용하는 URI가 동일한지 확인

### 로그인 후 리다이렉트 실패
- CLIENT_URL 환경변수 확인
- auth-bridge.html 파일이 client/public에 있는지 확인

## 프로덕션 배포 시

1. 프로덕션 도메인을 플랫폼에 추가
2. 프로덕션 Redirect URI 추가
3. 환경변수 업데이트