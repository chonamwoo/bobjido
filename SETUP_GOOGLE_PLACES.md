# Google Places API 설정 가이드

실제 식당 사진을 가져오려면 Google Places API 키가 필요합니다.

## 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 좌측 메뉴에서 "API 및 서비스" > "라이브러리" 선택
4. "Places API" 검색하여 활성화
5. "API 및 서비스" > "사용자 인증 정보" 선택
6. "+ 사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키 복사

## 2. API 키 제한 설정 (권장)

보안을 위해 API 키에 제한을 설정하세요:
1. 생성된 API 키 옆의 편집 버튼 클릭
2. "API 제한사항"에서 "키 제한" 선택
3. "Places API" 선택
4. 저장

## 3. 프로젝트에 API 키 설정

1. 프로젝트 루트의 `.env` 파일 열기
2. 다음 줄을 찾아서:
   ```
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```
3. `your_google_places_api_key_here`를 실제 API 키로 교체:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyB...your_actual_api_key
   ```

## 4. 실제 식당 사진 가져오기

API 키 설정 후 다음 명령어로 실제 식당 사진을 가져올 수 있습니다:

```bash
cd server
node scripts/fetchRealRestaurantPhotos.js
```

## 5. 주의사항

- Google Places API는 유료 서비스입니다 (월 $300 무료 크레딧 제공)
- Photo API 호출: 1,000회당 $7
- Text Search API 호출: 1,000회당 $32
- 무료 크레딧 범위 내에서 테스트해보세요

## 6. 문제 해결

### API 키가 작동하지 않는 경우:
1. Places API가 활성화되어 있는지 확인
2. API 키에 Places API 권한이 있는지 확인
3. 결제 계정이 연결되어 있는지 확인 (무료 크레딧 사용 시에도 필요)

### 할당량 초과 오류:
1. Google Cloud Console에서 사용량 확인
2. 필요시 할당량 증가 요청
3. 또는 API 호출 빈도 조절

API 키 설정 없이도 애플리케이션은 정상 작동하며, 식당 이미지는 깔끔한 번호 아이콘으로 표시됩니다.