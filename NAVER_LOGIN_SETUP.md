# 네이버 로그인 설정 가이드

## ⚠️ 현재 상태
네이버 로그인을 구현하려면 **네이버 개발자 센터에서 애플리케이션을 등록**해야 합니다.
현재 사용 중인 API 키는 검색 API용이며, OAuth 로그인에는 사용할 수 없습니다.

## 🔧 네이버 로그인 앱 등록 방법

### 1단계: 네이버 개발자 센터 가입
1. [네이버 개발자 센터](https://developers.naver.com) 접속
2. 네이버 아이디로 로그인
3. 개발자 정보 등록

### 2단계: 애플리케이션 등록
1. **Application > 애플리케이션 등록** 클릭
2. 다음 정보 입력:
   - **애플리케이션 이름**: BobMap
   - **사용 API**: 네이버 아이디로 로그인 (필수 선택)
   - **제공 정보 선택**:
     - 이메일 주소 (필수)
     - 별명 (필수)
     - 프로필 사진 (선택)
     - 이름 (선택)

### 3단계: 서비스 환경 설정
1. **서비스 URL** 설정:
   ```
   http://localhost:3000
   ```

2. **Callback URL** 설정 (중요!):
   ```
   http://localhost:8888/api/auth/naver/callback
   ```

3. **추가 설정** (프로덕션용):
   ```
   https://yourdomain.com
   https://yourdomain.com/api/auth/naver/callback
   ```

### 4단계: API 키 받기
앱 등록 후 발급되는 정보:
- **Client ID**: 애플리케이션 등록 후 발급
- **Client Secret**: 애플리케이션 등록 후 발급

### 5단계: 환경 변수 설정
`server/.env` 파일 수정:
```env
# 네이버 OAuth (로그인용)
NAVER_CLIENT_ID=발급받은_Client_ID
NAVER_CLIENT_SECRET=발급받은_Client_Secret

# 네이버 검색 API (이미 설정됨 - 변경하지 마세요)
NAVER_SEARCH_CLIENT_ID=V5HzbgRHQULqRaHJjevb
NAVER_SEARCH_CLIENT_SECRET=TsJH7X71M9
```

### 6단계: 클라이언트 코드 수정
`client/src/pages/ImportNaverPlaces.tsx`에서 CLIENT_ID 변경:
```javascript
const CLIENT_ID = '발급받은_Client_ID'; // 여기에 실제 OAuth Client ID 입력
```

## 🚨 중요 사항

### OAuth vs 검색 API
- **OAuth Client ID/Secret**: 로그인 전용, MY플레이스 접근 불가
- **검색 API ID/Secret**: 장소 검색 전용, 로그인 불가
- 두 API는 **완전히 다른 서비스**입니다

### MY플레이스 제한사항
⚠️ **네이버는 현재 MY플레이스 API를 공개하지 않습니다**
- OAuth로 로그인해도 MY플레이스 데이터에 직접 접근 불가
- 대안: 사용자가 수동으로 공유 링크 생성 필요

## 🎯 권장 해결책

### 옵션 1: 검색 기능 활용 (현재 구현됨)
- 네이버 검색 API로 맛집 검색
- 지역명, 음식 종류로 실시간 검색
- **장점**: 바로 사용 가능, 실시간 데이터
- **단점**: 개인 저장 목록 접근 불가

### 옵션 2: 공유 링크 방식
1. 사용자가 네이버 MY플레이스에서 공유 링크 생성
2. BobMap에 링크 붙여넣기
3. 서버에서 링크 파싱 (크롤링)
- **장점**: 개인 맛집 리스트 가져오기 가능
- **단점**: 수동 작업 필요

### 옵션 3: 파일 업로드
- 네이버 MY플레이스 내보내기 기능 활용
- CSV/JSON 파일 업로드
- **장점**: 대량 데이터 처리 가능
- **단점**: 네이버가 내보내기 기능 미제공

## 📝 현재 구현 상태

### ✅ 작동하는 기능
- 네이버 검색 API를 통한 맛집 검색
- 검색 결과 필터링 및 저장
- 지역별, 카테고리별 검색

### ❌ 작동하지 않는 기능
- 네이버 OAuth 로그인 (API 키 미등록)
- MY플레이스 데이터 자동 가져오기 (API 미제공)

## 💡 추천 방안

현재는 **네이버 검색 API**를 활용한 맛집 검색이 가장 실용적입니다.
OAuth 로그인은 MY플레이스 접근이 불가능하므로 큰 의미가 없습니다.

사용자에게는 다음과 같이 안내하는 것이 좋습니다:
1. "강남 맛집" 같은 키워드로 검색
2. 원하는 맛집 선택
3. BobMap에 저장

---
*작성일: 2025-01-30*
*BobMap 개발팀*