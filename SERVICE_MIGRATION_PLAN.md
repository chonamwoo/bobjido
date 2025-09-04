# BobMap 실제 서비스 전환 계획

## 🎯 목표
모든 콘텐츠를 사용자가 생성한 실제 데이터로 전환 (홈페이지 인증 맛집 제외)

## 📋 제거해야 할 가짜 데이터

### 1. 가짜 데이터 파일들
- [ ] `/client/src/data/mockRestaurants.ts`
- [ ] `/client/src/data/playlistsData.ts`
- [ ] `/client/src/data/realRestaurants.ts`
- [ ] `/client/src/data/youtuberPlaylists.ts`
- [ ] `/client/src/data/enhancedRestaurants.ts`
- [ ] `/client/src/data/sampleRestaurants.ts`

### 2. 유지해야 할 파일 (인증 맛집용)
- ✅ `/client/src/data/certifiedRestaurants.ts` - 인증 맛집 데이터
- ✅ `/client/src/data/certifiedRestaurantLists.ts` - 인증 맛집 리스트
- ✅ `/client/src/data/certificationSystem.ts` - 인증 시스템
- ✅ `/client/src/data/mediaPrograms.ts` - TV 프로그램 정보

## 🔧 수정해야 할 컴포넌트

### 1. 홈페이지 (HomeSoundCloud.tsx)
- [x] 인증 맛집은 유지
- [ ] 나머지는 MongoDB에서 가져오기
- [ ] 인기 플레이리스트 - DB에서
- [ ] 추천 플레이리스트 - DB에서

### 2. 둘러보기 (Discover.tsx)
- [x] 이미 MongoDB 연결됨
- [ ] 로컬 스토리지 의존성 제거

### 3. 내 맛집리스트 (MyLists.tsx)
- [ ] 예시 데이터 제거
- [ ] MongoDB만 사용

### 4. 커뮤니티 (Community.tsx)
- [ ] 가짜 게시글 제거
- [ ] MongoDB 연결

### 5. 게임/이벤트
- [ ] 음식 MBTI - 실제 사용자 데이터
- [ ] 푸드 VS - 실제 투표 데이터
- [ ] 룰렛 - 사용자 맛집에서

## 🗄️ MongoDB 스키마 확인

### 필요한 컬렉션
1. **users** - ✅ 구현됨
2. **playlists** - ✅ 구현됨  
3. **restaurants** - ✅ 구현됨
4. **reviews** - ⚠️ 필요
5. **posts** (커뮤니티) - ⚠️ 필요
6. **votes** (푸드VS) - ⚠️ 필요
7. **games** (게임 결과) - ⚠️ 필요

## 🚀 작업 순서

### Phase 1: 데이터 정리
1. 가짜 데이터 파일 제거
2. 컴포넌트에서 가짜 데이터 import 제거
3. 로컬 스토리지 의존성 제거

### Phase 2: MongoDB 연결
1. 누락된 스키마 생성 (posts, reviews, votes)
2. API 엔드포인트 구현
3. 프론트엔드 연결

### Phase 3: 사용자 생성 콘텐츠
1. 리뷰 작성 기능
2. 커뮤니티 게시글 작성
3. 게임 참여 데이터 저장

### Phase 4: 초기 데이터
1. 인증 맛집만 시드 데이터로
2. 나머지는 빈 상태로 시작
3. 사용자가 채워나가는 구조

## ✨ 최종 목표
- 사용자가 직접 만드는 맛집 플랫폼
- 인증 맛집은 운영자가 큐레이션
- 나머지 모든 콘텐츠는 100% 사용자 생성