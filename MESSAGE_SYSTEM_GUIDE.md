# BobMap 메시지 시스템 가이드

## 현재 구현 상태 ✅
- MongoDB + Socket.io를 사용한 기본적인 실시간 메시징
- 1:1 채팅 및 그룹 채팅 지원
- 텍스트, 이미지, 위치, 맛집 공유 기능

## 한계점 ⚠️

### 1. 성능 문제
- **MongoDB의 한계**: 실시간 메시징에 최적화되지 않음
- **예상 문제**: 
  - 사용자 100명 이상: 메시지 로딩 지연
  - 사용자 1000명 이상: 심각한 성능 저하
  - 메시지 히스토리 검색 느림

### 2. 확장성 문제
- 단일 서버 WebSocket 연결 제한
- 수평 확장 어려움
- 메시지 동기화 문제

## 권장 개선 방안 🚀

### Phase 1: 현재 시스템 최적화 (단기)
```javascript
// 1. 메시지 페이지네이션
const messages = await Message.find({ chat: chatId })
  .sort('-createdAt')
  .limit(50)  // 최근 50개만 로드
  .skip(page * 50);

// 2. 인덱스 최적화
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ 'readBy.user': 1 });

// 3. 캐싱 적용
const redis = require('redis');
const client = redis.createClient();
// 최근 메시지 캐싱
```

### Phase 2: 하이브리드 접근 (중기)
```javascript
// Redis + MongoDB 조합
// - Redis: 최근 메시지 (7일)
// - MongoDB: 장기 보관

const recentMessages = await redis.get(`chat:${chatId}:messages`);
if (!recentMessages) {
  const messages = await Message.find({ chat: chatId })
    .sort('-createdAt')
    .limit(100);
  await redis.setex(`chat:${chatId}:messages`, 3600, JSON.stringify(messages));
}
```

### Phase 3: 전문 메시징 서비스 (장기)
- **Firebase Realtime Database**: 실시간 동기화
- **AWS AppSync**: GraphQL 기반 실시간 데이터
- **Pusher/Ably**: 메시징 전문 서비스
- **SendBird/Stream Chat**: 완전 관리형 채팅 SDK

## 현재 시스템으로 가능한 규모 📊

| 동시 접속자 | 일일 메시지 | 성능 상태 | 권장 조치 |
|-----------|-----------|----------|----------|
| ~50명 | ~5,000개 | ✅ 양호 | 현재 시스템 유지 |
| ~100명 | ~10,000개 | ⚠️ 주의 | 캐싱 적용 필요 |
| ~500명 | ~50,000개 | ❌ 위험 | Redis 도입 필수 |
| 1000명+ | 100,000개+ | 💀 불가능 | 전문 서비스 전환 |

## 즉시 적용 가능한 개선사항 ✨

### 1. 메시지 제한
```javascript
// 메시지 길이 제한
const MAX_MESSAGE_LENGTH = 500;

// 연속 메시지 제한 (스팸 방지)
const RATE_LIMIT = {
  windowMs: 1000,  // 1초
  max: 5  // 최대 5개 메시지
};
```

### 2. 오래된 메시지 아카이빙
```javascript
// 30일 이상 된 메시지는 별도 컬렉션으로 이동
const archiveOldMessages = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const oldMessages = await Message.find({ createdAt: { $lt: thirtyDaysAgo } });
  
  await ArchivedMessage.insertMany(oldMessages);
  await Message.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
};
```

### 3. 읽음 처리 최적화
```javascript
// 배치 업데이트로 읽음 처리
const markMessagesAsRead = async (chatId, userId) => {
  await Message.updateMany(
    { 
      chat: chatId,
      'readBy.user': { $ne: userId }
    },
    { 
      $push: { 
        readBy: { 
          user: userId, 
          readAt: new Date() 
        } 
      } 
    }
  );
};
```

## 결론 💡

**현재 상태**: MVP로는 충분하지만 확장성 제한
**권장사항**: 
1. 초기 사용자 100명까지는 현재 시스템 유지
2. 성장 시 Redis 캐싱 도입
3. 본격 서비스 시 Firebase 또는 SendBird 전환

**예상 비용**:
- 현재: $0 (MongoDB Atlas 무료 티어)
- Redis 추가: ~$20/월
- Firebase: ~$25/월 (10,000 MAU)
- SendBird: ~$399/월 (5,000 MAU)