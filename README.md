# 🍽️ BobMap - 맛집 플레이리스트 공유 플랫폼

> "음식계의 SoundCloud" - 맛집 플레이리스트를 만들고 공유하는 소셜 플랫폼

BobMap은 사용자들이 자신만의 맛집 컬렉션을 큐레이션하고, 지도 형태로 시각화하여 공유할 수 있는 혁신적인 소셜 플랫폼입니다.

## ✨ 주요 기능

### 🎵 플레이리스트 시스템 (SoundCloud 스타일)
- **테마별 플레이리스트**: 데이트 코스, 혼밥 맛집, 야식 투어 등
- **개인 취향별**: 매운맛 마니아, 가성비 맛집 등 개인 맞춤 컬렉션
- **협업 플레이리스트**: 친구들과 함께 편집 가능
- **리믹스 기능**: 다른 사람의 플레이리스트를 기반으로 나만의 버전 생성

### 🗺️ 지도 기반 시각화
- **인터랙티브 맵**: 플레이리스트별 색상 코딩으로 맛집 마커 표시
- **경로 표시**: 데이트 코스용 맛집 간 이동 경로 시각화
- **실시간 미리보기**: 플레이리스트 편집 시 지도에서 실시간 확인

### 🤖 취향 매칭 & 큐레이터 시스템
- **개인 취향 프로필**: 매운맛/단맛 선호도, 가격대, 분위기 취향 분석
- **큐레이터 랭킹**: 지역별, 카테고리별 전문가 시스템
- **AI 매칭**: 취향이 비슷한 큐레이터의 플레이리스트 추천

### 🌐 소셜 기능
- **공유 시스템**: 링크, 지도 임베드, QR 코드, 카카오톡 카드
- **완주 인증**: 플레이리스트 내 모든 맛집 방문 인증
- **팔로우 시스템**: 취향 비슷한 큐레이터 팔로우

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript** - 메인 프레임워크
- **Tailwind CSS** - 스타일링 (모던하고 세련된 디자인)
- **React Router** - SPA 라우팅
- **React Hook Form** - 폼 관리
- **React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **React Hot Toast** - 알림 시스템

### Backend
- **Node.js** + **Express** - API 서버
- **MongoDB** + **Mongoose** - NoSQL 데이터베이스
- **JWT** - 사용자 인증
- **Multer** - 이미지 업로드
- **Bcrypt** - 비밀번호 암호화

### 지도 & 외부 API
- **네이버 맵 API** - 한국 중심 지도 서비스
- **네이버 검색 API** - 맛집 데이터 수집
- **카카오톡 공유 API** - 소셜 공유

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js (v16 이상) - [다운로드](https://nodejs.org/)
- MongoDB - [다운로드](https://www.mongodb.com/try/download/community) 또는 [MongoDB Atlas](https://www.mongodb.com/atlas) 사용
- 네이버 클라우드 플랫폼 계정 (지도 API 키) - [네이버 클라우드](https://www.ncloud.com/)

### 빠른 시작 (Windows)
```bash
# Windows에서 더블클릭으로 실행
start.bat
```

### 수동 설치 및 실행

#### 1. 의존성 설치
```bash
npm run install-all
```

#### 2. 환경 변수 설정
`.env` 파일이 이미 생성되어 있습니다. 필요시 수정:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bobmap
JWT_SECRET=bobmap_jwt_secret_key_2024_very_secure
JWT_EXPIRE=30d
NODE_ENV=development
REACT_APP_NAVER_MAP_CLIENT_ID=your_naver_map_client_id  # 네이버 맵 API
NAVER_CLIENT_ID=your_naver_search_client_id  # 네이버 검색 API
NAVER_CLIENT_SECRET=your_naver_search_client_secret  # 네이버 검색 API
```

#### 3. MongoDB 실행
```bash
# Windows 서비스로 설치된 경우
net start MongoDB

# 또는 직접 실행
mongod
```

#### 4. 샘플 데이터 시딩 (선택사항)
Bob 계정과 동대문구 맛집 데이터를 미리 생성:
```bash
# 패키지 먼저 설치
npm install

# 샘플 데이터 생성 (Bob 계정 + 동대문구 맛집 10개 + 플레이리스트)
npm run seed
```

#### 5. 애플리케이션 실행
```bash
# 방법 1: 동시 실행 (권장)
npm run dev

# 방법 2: 분리 실행
npm run server  # 터미널 1: 백엔드 (포트 5000)
npm run client  # 터미널 2: 프론트엔드 (포트 3000)
```

#### 6. 브라우저에서 확인
- **메인 사이트**: http://localhost:3000
- **API 상태**: http://localhost:5000/api/health
- **어드민 패널**: http://localhost:5000/api/admin/login

### 🔑 기본 계정
- **어드민**: admin@bobmap.com / BobMap2024!
- **샘플 계정 (시딩 후)**: bob@bobmap.com / bob123456

### 📱 모바일 테스트
개발 서버는 네트워크의 다른 기기에서도 접근 가능합니다:
- 같은 WiFi의 모바일에서: http://[컴퓨터IP]:3000

## 📁 프로젝트 구조

```
bobmap/
├── server/                 # 백엔드
│   ├── controllers/        # 컨트롤러
│   ├── models/            # 데이터베이스 모델
│   ├── routes/            # API 라우트
│   ├── middleware/        # 미들웨어
│   ├── scripts/           # 데이터 시딩 스크립트
│   ├── utils/             # 유틸리티
│   └── index.js           # 서버 진입점
├── client/                # 프론트엔드
│   ├── src/
│   │   ├── components/    # 재사용 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── store/         # 상태 관리
│   │   └── App.tsx        # 메인 앱 컴포넌트
│   └── public/
├── uploads/               # 업로드된 파일
└── README.md
```

## 🎯 주요 페이지

- **홈페이지** (`/`) - 트렌딩 플레이리스트 및 서비스 소개
- **디스커버** (`/discover`) - 플레이리스트 탐색 및 필터링
- **플레이리스트 생성** (`/create-playlist`) - 새 플레이리스트 만들기
- **플레이리스트 상세** (`/playlist/:id`) - 플레이리스트 상세 정보 및 지도
- **맛집 상세** (`/restaurant/:id`) - 맛집 정보 및 포함된 플레이리스트
- **프로필** (`/profile/:username`) - 사용자 프로필 및 만든 플레이리스트

## 🔧 개발 가이드

### API 엔드포인트

#### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/profile` - 프로필 수정

#### 플레이리스트
- `GET /api/playlists` - 플레이리스트 목록 (필터링 지원)
- `GET /api/playlists/trending` - 트렌딩 플레이리스트
- `GET /api/playlists/:id` - 플레이리스트 상세
- `POST /api/playlists` - 플레이리스트 생성
- `PUT /api/playlists/:id` - 플레이리스트 수정
- `DELETE /api/playlists/:id` - 플레이리스트 삭제
- `POST /api/playlists/:id/restaurants` - 맛집 추가
- `POST /api/playlists/:id/like` - 좋아요/취소
- `POST /api/playlists/:id/save` - 저장/취소

#### 맛집
- `GET /api/restaurants/search` - 맛집 검색
- `GET /api/restaurants/search/kakao` - 카카오 장소 검색
- `GET /api/restaurants/:id` - 맛집 상세
- `POST /api/restaurants` - 맛집 등록
- `POST /api/restaurants/:id/verify` - 맛집 검증

#### 사용자
- `GET /api/users/:username` - 사용자 프로필
- `POST /api/users/:username/follow` - 팔로우/언팔로우
- `GET /api/users/:username/playlists` - 사용자의 플레이리스트

### 네이버 맵 API 설정

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 회원가입
2. Maps > Maps API 서비스 신청
3. Application 등록 후 Client ID 발급
4. 서비스 URL 등록 (개발: http://localhost:3000, 배포: 실제 도메인)

### 네이버 검색 API 설정 (시딩용, 선택사항)

1. [네이버 개발자센터](https://developers.naver.com/)에서 애플리케이션 등록
2. 검색 > 지역 API 사용 설정
3. Client ID와 Client Secret 발급

### 샘플 데이터 시딩

Bob 계정과 동대문구 맛집 데이터가 포함된 시딩 기능:

```bash
# 샘플 데이터 생성
npm run seed

# 포함 내용:
# - Bob 사용자 (bob@bobmap.com / bob123456)
# - 추가 사용자 3명 (FoodLover, KoreanFoodie, StreetFood)
# - 동대문구 맛집 10개+ (미리 정의된 데이터)
# - 네이버 검색 API를 통한 추가 맛집 데이터 (API 키 있는 경우)
# - 웹 크롤링을 통한 맛집 데이터 (가능한 경우)
# - Bob의 큐레이션 플레이리스트 5개:
#   • 동대문구 숨은 맛집 TOP 10
#   • 혼밥하기 좋은 곳
#   • 데이트 코스 추천
#   • 가성비 최고 맛집
#   • 회식하기 좋은 곳
# - 팔로우 관계 및 좋아요 데이터
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#ef4444` (Red-500)
- **Secondary**: `#0ea5e9` (Sky-500)
- **Success**: `#10b981` (Emerald-500)
- **Warning**: `#f59e0b` (Amber-500)
- **Error**: `#ef4444` (Red-500)

### 폰트
- **메인 폰트**: Pretendard (한글), -apple-system (영문)
- **코드 폰트**: Monaco, Menlo, monospace

## 🧪 테스트

```bash
# 백엔드 테스트
cd server
npm test

# 프론트엔드 테스트
cd client
npm test
```

## 📦 배포

### 프로덕션 빌드
```bash
npm run build
```

### 환경 변수 (프로덕션)
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
KAKAO_MAP_API_KEY=your_kakao_map_api_key_prod
KAKAO_REST_API_KEY=your_kakao_rest_api_key_prod
```

### 배포 플랫폼
- **백엔드**: Heroku, Railway, AWS EC2
- **프론트엔드**: Vercel, Netlify
- **데이터베이스**: MongoDB Atlas
- **이미지 저장**: AWS S3, Cloudinary

## 🤝 기여하기

1. 포크(Fork)하기
2. 피처 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋 (`git commit -m 'Add some amazing feature'`)
4. 푸시 (`git push origin feature/amazing-feature`)
5. 풀 리퀘스트(Pull Request) 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 확인하세요.

## 🙏 감사의 말

- [카카오맵 API](https://apis.map.kakao.com/) - 지도 서비스 제공
- [Heroicons](https://heroicons.com/) - 아이콘 제공
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [React](https://reactjs.org/) - 프론트엔드 프레임워크

## 📞 문의

- 이메일: your-email@example.com
- GitHub Issues: [이슈 등록](https://github.com/your-username/bobmap/issues)

---

**BobMap**과 함께 당신의 맛집 여정을 기록하고 공유하세요! 🍽️✨