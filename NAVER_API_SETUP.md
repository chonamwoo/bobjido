# 네이버 검색 API 설정 가이드

## 1. 네이버 개발자 센터 가입
1. [네이버 개발자 센터](https://developers.naver.com) 접속
2. 네이버 계정으로 로그인

## 2. 애플리케이션 등록
1. "Application" → "애플리케이션 등록" 클릭
2. 애플리케이션 이름: `BobMap`
3. 사용 API 선택: **검색(Search)** 체크
   - 지역 (local)
4. 서비스 환경 등록:
   - WEB 설정 선택
   - 서비스 URL: `http://localhost:3000`
   - Callback URL: 비워두기 (검색 API는 필요 없음)

## 3. API 키 발급
1. 등록 완료 후 "내 애플리케이션" 페이지에서 확인
2. **Client ID**와 **Client Secret** 복사

## 4. 환경 변수 설정
`server/.env` 파일 수정:
```env
NAVER_SEARCH_CLIENT_ID=발급받은_Client_ID
NAVER_SEARCH_CLIENT_SECRET=발급받은_Client_Secret
```

## 5. 서버 재시작
```bash
# 서버 재시작
npm run server
```

## 6. 테스트
1. 프론트엔드에서 "만들기" 페이지 이동
2. "맛집 추가" 클릭
3. 네이버 탭 선택
4. 검색어 입력 (예: "강남 맛집", "홍대 카페")
5. 실제 네이버 검색 결과 확인

## API 제한사항
- 일일 호출 제한: 25,000회
- 초당 호출 제한: 10회
- 검색 결과 최대: 100개

## 트러블슈팅

### API 키가 작동하지 않는 경우
1. Client ID와 Secret이 정확히 복사되었는지 확인
2. 서버를 재시작했는지 확인
3. 네이버 개발자 센터에서 API 사용 설정이 활성화되어 있는지 확인

### 검색 결과가 나오지 않는 경우
1. 브라우저 개발자 도구 (F12) → Network 탭 확인
2. `/api/restaurants/search/naver` 요청 확인
3. 응답 상태 코드 확인:
   - 500: API 키 설정 문제
   - 200: 정상 (하지만 결과가 없을 수 있음)

### Mock 데이터로 테스트
API 키가 없어도 기본 mock 데이터로 테스트 가능합니다.
실제 API 키 설정 후 진짜 네이버 검색 결과를 볼 수 있습니다.