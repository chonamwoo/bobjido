# 🚀 BobMap 데모 배포 가이드 - 사용자 테스트용

## 📋 전체 소요 시간: 30분

## 🎯 목표
실제 사용자들이 가입하고 테스트할 수 있는 데모 환경 구축

---

## 1️⃣ 백엔드 배포 - Render (10분)

### 1단계: Render 계정 생성
- https://render.com 접속
- GitHub로 로그인

### 2단계: 새 Web Service 생성
1. "New +" → "Web Service" 클릭
2. GitHub 리포지토리 연결
3. 설정:
   ```
   Name: bobmap-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

### 3단계: 환경 변수 설정
Dashboard → Environment에서 추가:
```
MONGODB_URI=mongodb+srv://... (MongoDB Atlas 무료 클러스터)
JWT_SECRET=bobmap-demo-secret-2024
NODE_ENV=production
CLIENT_URL=https://bobmap.vercel.app
```

### 4단계: 배포 완료
- URL 생성됨: `https://bobmap-backend.onrender.com`
- 이 URL을 복사해두세요!

---

## 2️⃣ 프론트엔드 배포 - Vercel (10분)

### 1단계: 환경 변수 파일 생성
`client/.env.production` 파일 생성:
```env
REACT_APP_API_URL=https://bobmap-backend.onrender.com
REACT_APP_SOCKET_URL=https://bobmap-backend.onrender.com
```

### 2단계: Vercel CLI 설치 및 배포
```bash
# Vercel CLI 설치
npm install -g vercel

# client 폴더에서 실행
cd client
vercel

# 질문에 답변:
# ? Set up and deploy? Y
# ? Which scope? (본인 계정 선택)
# ? Link to existing project? N
# ? Project name? bobmap
# ? Directory? ./
# ? Override settings? N
```

### 3단계: 환경 변수 설정
Vercel 대시보드에서:
1. Settings → Environment Variables
2. 추가:
   - `REACT_APP_API_URL` = `https://bobmap-backend.onrender.com`

### 4단계: 완료!
- 접속 URL: `https://bobmap.vercel.app`
- 이제 누구나 접속 가능!

---

## 3️⃣ MongoDB Atlas 설정 (10분)

### 무료 클러스터 생성
1. https://cloud.mongodb.com 가입
2. 무료 M0 클러스터 생성
3. Database Access → 사용자 생성
4. Network Access → "Allow from anywhere" 설정
5. Connect → 연결 문자열 복사

---

## 🎨 사용자 테스트 준비

### 1. 테스트 안내 페이지 생성
`client/src/pages/TestGuide.tsx`:
```tsx
import React from 'react';

const TestGuide = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧪 BobMap 베타 테스트</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="font-bold">⚠️ 테스트 버전입니다</p>
        <ul className="mt-2 text-sm">
          <li>• 실제 개인정보를 입력하지 마세요</li>
          <li>• 테스트용 이메일/닉네임을 사용하세요</li>
          <li>• 데이터는 주기적으로 초기화됩니다</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">테스트 해주세요:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>회원가입 및 로그인</li>
          <li>취향 진단 완료</li>
          <li>매칭 기능 사용</li>
          <li>맛집 등록</li>
          <li>동행 찾기</li>
        </ol>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">📝 피드백 방법:</h3>
        <p>카톡 오픈채팅: bit.ly/bobmap-feedback</p>
        <p>구글폼: forms.gle/bobmap2024</p>
      </div>
    </div>
  );
};

export default TestGuide;
```

### 2. 피드백 수집 도구

#### 옵션 A: Google Forms
1. 구글폼 생성 (5분)
2. 질문 예시:
   - 첫인상은 어땠나요? (1-5점)
   - 가장 마음에 든 기능은?
   - 개선이 필요한 부분은?
   - 실제로 사용하고 싶나요?
   - 추가하고 싶은 기능은?

#### 옵션 B: Tally Forms (더 예쁨)
- https://tally.so 무료 사용
- 임베드 가능

#### 옵션 C: 앱 내 피드백 위젯
```bash
npm install @happyreact/react
```

### 3. 분석 도구 설치

```bash
# Google Analytics
npm install react-ga4

# 또는 Mixpanel (더 상세한 이벤트 추적)
npm install mixpanel-browser
```

`client/src/index.tsx`:
```tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-YOUR_TRACKING_ID');
ReactGA.send('pageview');
```

---

## 📊 테스트 데이터 준비

### 시드 데이터 스크립트
`server/scripts/seedData.js`:
```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const seedData = async () => {
  // 샘플 사용자 10명 생성
  const sampleUsers = [
    { username: '매운맛러버', tasteType: '매콤한 모험가' },
    { username: '카페투어', tasteType: '힙스터 탐험가' },
    // ...
  ];

  // 샘플 맛집 20개 생성
  const sampleRestaurants = [
    { name: '을지로 골목식당', category: '한식', rating: 4.5 },
    // ...
  ];

  console.log('✅ 테스트 데이터 생성 완료!');
};
```

---

## 🚦 배포 체크리스트

### 배포 전 확인
- [ ] 민감한 정보 제거 (실제 API 키 등)
- [ ] 테스트 계정 생성
- [ ] 샘플 데이터 준비
- [ ] 에러 페이지 구현
- [ ] 로딩 상태 처리

### 배포 후 확인
- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] 주요 기능 작동 확인
- [ ] 모바일 반응형 확인
- [ ] 속도 테스트

---

## 📣 홍보 전략

### 1. 베타 테스터 모집
```
🍜 BobMap 베타 테스터 모집! 

맛집 취향으로 친구 찾는 신개념 서비스
지금 테스트하고 스타벅스 기프티콘 받아가세요!

👉 bobmap.vercel.app
📝 피드백: bit.ly/bobmap-feedback

#맛집 #매칭앱 #베타테스트
```

### 2. 테스터 모집 채널
- 대학교 에브리타임
- 개발자 커뮤니티 (OKKY, 당근)
- 맛집 관련 카페/커뮤니티
- 인스타그램 스토리
- 카톡 오픈채팅

### 3. 인센티브
- 선착순 50명 커피 기프티콘
- 추첨 10명 치킨 기프티콘
- 정식 출시 시 프리미엄 1개월

---

## 🔧 문제 해결

### Render 무료 티어 제한
- 15분 비활성 시 슬립 (첫 요청 시 30초 지연)
- 해결: UptimeRobot으로 5분마다 핑

### Vercel 함수 제한
- API Routes 사용 불가 (정적 호스팅만)
- 해결: 백엔드는 Render 사용

### CORS 오류
- 백엔드에서 CLIENT_URL 환경변수 확인
- Vercel 도메인 추가

---

## 💰 비용

### 완전 무료 (제한 있음)
- Vercel: 무료 (개인 프로젝트)
- Render: 무료 (750시간/월)
- MongoDB Atlas: 무료 (512MB)
- 예상 동시 사용자: ~100명

### 유료 업그레이드 시
- Render Starter: $7/월 (슬립 없음)
- MongoDB M2: $9/월 (2GB)
- Vercel Pro: $20/월 (팀 협업)

---

## 🎯 다음 단계

1. **MVP 테스트** (1주일)
   - 50-100명 테스터 모집
   - 피드백 수집 및 분석

2. **개선 사항 반영** (1주일)
   - 주요 버그 수정
   - UX 개선

3. **2차 테스트** (1주일)
   - 개선된 버전 배포
   - 더 많은 사용자 테스트

4. **정식 출시 준비**
   - 프로덕션 환경 구축
   - 마케팅 전략 수립

---

## 📞 지원

문제 발생 시:
- GitHub Issues: github.com/yourusername/bobmap
- 이메일: bobmap.support@gmail.com
- 카톡: @bobmap

---

*마지막 업데이트: 2025-08-17*
*작성: Claude AI & BobMap Team*