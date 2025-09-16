# BobMap 게임 모듈

## 개요
BobMap의 게임 모듈은 사용자의 음식 취향을 재미있게 파악하고 데이터를 수집하는 독립적인 모듈입니다.

## 포함된 게임들

### 1. 음식 MBTI (FoodMBTI)
- 16가지 질문으로 음식 성격 유형 진단
- 팥빙수 vs 망고빙수 같은 재미있는 선택지
- 결과를 통한 취향 데이터 수집

### 2. 음식 VS 게임 (FoodVS)
- 둘 중 하나만 선택하는 토너먼트 방식
- 평생 짜장면 vs 짬뽕 같은 극한 선택
- 사용자 선택 패턴 분석

### 3. 음식 룰렛 (FoodRoulette)
- 랜덤 음식 추천
- 오늘 뭐 먹지? 고민 해결
- 지역별, 카테고리별 필터링

### 4. 맛집 퀴즈 (RestaurantQuiz)
- 유명 맛집 맞추기
- 지역별 맛집 상식 테스트
- 맛집 전문가 레벨 시스템

### 5. 점심 추천 (LunchRecommendation)
- AI 기반 점심 메뉴 추천
- 날씨, 기분, 예산 고려
- 주변 맛집 연계

## 아키텍처

```
modules/games/
├── src/
│   ├── pages/          # 게임 페이지 컴포넌트
│   ├── components/     # 재사용 가능한 게임 컴포넌트
│   └── utils/          # 게임 관련 유틸리티
├── package.json        # 게임 모듈 의존성
└── README.md          # 이 파일
```

## 통합 방법

### 1. 독립 실행 (Standalone)
```bash
cd modules/games
npm install
npm start
```

### 2. 메인 앱에 통합
```javascript
// 동적 임포트로 필요할 때만 로드
const GameHub = lazy(() => import('@modules/games/GameHub'));
```

### 3. 마이크로 프론트엔드
- Module Federation으로 런타임 통합
- 독립 배포 가능
- 버전 관리 독립적

## 데이터 수집

게임을 통해 수집되는 데이터:
- 음식 선호도
- 카테고리별 취향
- 지역별 선호도
- 가격대 민감도
- 모험심 지수

이 데이터는 추후 맛집 추천 알고리즘의 기초 자료로 활용됩니다.

## 향후 계획

1. **Phase 1**: 독립 모듈로 운영
2. **Phase 2**: 데이터 수집 후 분석
3. **Phase 3**: 메인 앱에 선택적 통합
4. **Phase 4**: AI 추천 시스템 연동

## 기술 스택
- React + TypeScript
- Framer Motion (애니메이션)
- Tailwind CSS (스타일링)
- Zustand (상태 관리)

## 성능 최적화
- Lazy Loading
- Code Splitting
- 독립적인 번들링
- CDN 배포 가능

---

이 모듈은 BobMap의 핵심 기능과 독립적으로 개발/배포/운영이 가능하도록 설계되었습니다.