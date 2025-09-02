# BobMap 추천 시스템 아키텍처

## 📊 데이터 모델 구조

### 1. Review Model (상세 평가 데이터)
- **목적**: 사용자의 상세한 평가 데이터 수집
- **핵심 필드**:
  - `detailedRatings`: 6개 평가 항목 (맛, 서비스, 분위기, 가성비, 청결도, 양)
  - `tasteProfile`: 7가지 맛 프로필 (매운맛, 단맛, 짠맛, 신맛, 쓴맛, 감칠맛, 기름진맛)
  - `visitInfo`: 방문 상황 정보 (날짜, 목적, 인원, 시간대, 대기시간, 지출액)
  - `credibilityScore`: 리뷰 신뢰도 점수 (0-100)

### 2. UserInteraction Model (암묵적 행동 데이터)
- **목적**: 사용자의 모든 상호작용 추적
- **추적 이벤트**: view, click, save, like, share, comment, time_spent, scroll 등
- **컨텍스트 정보**: 위치, 시간, 디바이스, 검색어, 필터
- **점수 계산**: 관심도(0-100), 감정(-100~100), 영향력(0-100)

### 3. TasteVector Model (취향 벡터)
- **목적**: 사용자의 다차원 취향 프로필
- **벡터 구성**:
  - 맛 선호도 벡터 (10차원)
  - 요리 스타일 벡터 (10차원)
  - 분위기 선호도 벡터 (10차원)
  - 상황별 선호도 벡터 (8차원)
  - 가격 민감도 벡터 (4차원)
  - 행동 패턴 벡터 (6차원)
- **신뢰도**: 각 차원별 confidence 값 (0-1)

### 4. UserSimilarityMatrix Model (사용자 유사도)
- **목적**: 협업 필터링을 위한 사용자 간 유사도
- **유사도 계산**:
  - 취향 유사도 (30% 가중치)
  - 행동 유사도 (25% 가중치)
  - 평점 유사도 (25% 가중치, Pearson/Cosine)
  - 소셜 유사도 (10% 가중치)
  - 인구통계 유사도 (10% 가중치)

### 5. Recommendation Model (추천 결과)
- **목적**: 생성된 추천 저장 및 성능 추적
- **알고리즘 타입**: 12가지 (협업필터링, 콘텐츠기반, 하이브리드 등)
- **성능 추적**: CTR, CVR, 체류시간, 전환율
- **A/B 테스트**: 실험 그룹 관리

### 6. AlgorithmPerformance Model (알고리즘 성능)
- **목적**: 각 알고리즘의 성능 모니터링 및 최적화
- **메트릭**:
  - 정확도: MAE, RMSE, Precision, Recall, F1
  - 참여도: CTR, CVR, 세션 시간
  - 다양성: 카탈로그 커버리지, 참신성
  - 시스템: 레이턴시, 처리량, 에러율

## 🔄 데이터 수집 흐름

### 1단계: 명시적 데이터 수집
```javascript
// 리뷰 작성 시
POST /api/reviews
{
  restaurant: "restaurantId",
  overallRating: 4.5,
  detailedRatings: {
    taste: { score: 5 },
    service: { score: 4 },
    atmosphere: { score: 4 },
    valueForMoney: { score: 5 },
    cleanliness: { score: 4 },
    portion: { score: 4 }
  },
  content: "정말 맛있었어요...",
  visitInfo: {
    date: "2025-01-20",
    occasion: "데이트",
    groupSize: 2,
    timeOfDay: "저녁"
  },
  tasteProfile: {
    spicyLevel: 3,
    sweetLevel: 2,
    saltyLevel: 3
  }
}
```

### 2단계: 암묵적 데이터 수집
```javascript
// 모든 사용자 행동 자동 추적
POST /api/interactions
{
  targetType: "restaurant",
  targetId: "restaurantId",
  interactionType: "view",
  context: {
    source: "search",
    searchQuery: "강남 맛집",
    location: { lat: 37.5, lng: 127.0 }
  },
  value: {
    duration: 45,
    scrollDepth: 80
  }
}
```

### 3단계: 취향 벡터 업데이트
```javascript
// 리뷰/행동 데이터로 자동 학습
await TasteVector.updateFromReview(review);
await TasteVector.updateFromInteraction(interaction);
```

## 🎯 추천 알고리즘

### 1. 협업 필터링 (Collaborative Filtering)
```javascript
// 유사 사용자 찾기
const similarUsers = await UserSimilarityMatrix.findSimilarUsers(userId, 20);

// 유사 사용자가 좋아한 레스토랑 추천
const recommendations = await generateCollaborativeRecommendations(
  userId, 
  similarUsers
);
```

### 2. 콘텐츠 기반 필터링 (Content-Based)
```javascript
// 사용자 취향 벡터와 레스토랑 특성 매칭
const userVector = await TasteVector.findOne({ user: userId });
const score = userVector.calculateRecommendationScore(restaurant);
```

### 3. 하이브리드 접근
```javascript
// 여러 알고리즘 결합
const cfScore = await getCollaborativeScore(user, restaurant);
const cbScore = await getContentBasedScore(user, restaurant);
const trendScore = await getTrendingScore(restaurant);

const finalScore = cfScore * 0.4 + cbScore * 0.3 + trendScore * 0.3;
```

## 📈 성능 최적화

### 1. 실시간 학습
- 사용자 행동 즉시 반영
- 학습률 점진적 감소 (Learning Rate Decay)
- 신뢰도 기반 가중치 적용

### 2. 캐싱 전략
- UserSimilarityMatrix: 7일 캐시
- TasteVector: 실시간 업데이트
- Recommendation: 24시간 캐시

### 3. A/B 테스트
```javascript
// 알고리즘 성능 비교
const result = await AlgorithmPerformance.analyzeABTest('test-001');
if (result.confident && result.winner === 'test') {
  // 새 알고리즘 채택
  await adoptNewAlgorithm('test-algorithm-v2');
}
```

## 🎨 추천 이유 생성

### 맞춤형 추천 설명
```javascript
const reasons = {
  collaborative_filtering: '비슷한 취향을 가진 사용자들이 좋아합니다',
  content_based: '평소 즐기시는 ${category} 스타일입니다',
  trending: '${region}에서 최근 인기 급상승 중입니다',
  social: '${friendCount}명의 친구가 추천했습니다',
  taste_matching: '매운맛 ${spicyLevel}, 분위기 ${atmosphere}로 취향에 완벽합니다'
};
```

## 🔍 데이터 품질 관리

### 1. 리뷰 신뢰도 평가
- 사용자 신뢰도 (30%)
- 리뷰 상세도 (20%)
- 사진 첨부 (15%)
- 세부 평가 완성도 (15%)
- 커뮤니티 평가 (20%)

### 2. 이상 탐지
```javascript
// 자동 이상 패턴 감지
const anomalies = await AlgorithmPerformance.detectAnomalies();
if (anomalies.length > 0) {
  await sendAlert('Algorithm anomaly detected', anomalies);
}
```

## 📊 주요 지표

### 1. 추천 품질
- **Precision@K**: 상위 K개 추천 중 적중률
- **Recall@K**: 전체 관련 아이템 중 추천 비율
- **NDCG**: 순위를 고려한 추천 품질
- **Coverage**: 전체 아이템 중 추천되는 비율

### 2. 사용자 만족도
- **CTR**: 추천 클릭률
- **CVR**: 추천 전환율 (방문, 저장, 리뷰)
- **Dwell Time**: 추천 아이템 체류 시간
- **Return Rate**: 재방문율

### 3. 다양성
- **Intra-list Diversity**: 추천 리스트 내 다양성
- **Novelty**: 새로운 아이템 비율
- **Serendipity**: 예상치 못한 좋은 추천

## 🚀 구현 로드맵

### Phase 1: 기본 추천 (현재)
- [x] 데이터 모델 설계
- [x] 명시적 평가 수집 (Review)
- [x] 암묵적 행동 추적 (UserInteraction)
- [ ] 기본 협업 필터링
- [ ] API 엔드포인트 구현

### Phase 2: 고급 추천
- [ ] 딥러닝 모델 (임베딩)
- [ ] 실시간 개인화
- [ ] 컨텍스트 인식 추천
- [ ] 그룹 추천

### Phase 3: 최적화
- [ ] 분산 처리 (Redis)
- [ ] 실시간 스트리밍 (Kafka)
- [ ] GPU 가속
- [ ] 엣지 캐싱

## 💡 활용 예시

### 1. 맛집 추천
```javascript
const recommendations = await getPersonalizedRestaurants(userId, {
  location: currentLocation,
  occasion: '데이트',
  groupSize: 2,
  budget: '보통'
});
```

### 2. 취향 매칭
```javascript
const matches = await findTasteMatches(userId, {
  minSimilarity: 0.7,
  maxDistance: 5000,
  ageRange: [25, 35]
});
```

### 3. 플레이리스트 큐레이션
```javascript
const playlists = await curatePlaylistsForUser(userId, {
  theme: '주말 브런치',
  diversity: 'high',
  novelty: 'medium'
});
```

## 🔐 개인정보 보호

### 1. 데이터 익명화
- 사용자 ID 해싱
- 위치 정보 근사화
- 민감 정보 암호화

### 2. 투명성
- 추천 이유 명시
- 데이터 사용 내역 공개
- 옵트아웃 옵션 제공

### 3. 데이터 최소화
- 90일 후 상세 로그 삭제
- 집계 데이터만 장기 보관
- 필수 데이터만 수집

---

이 아키텍처는 실제 사용자 데이터를 기반으로 지속적으로 학습하고 개선되는 추천 시스템을 구축할 수 있도록 설계되었습니다.