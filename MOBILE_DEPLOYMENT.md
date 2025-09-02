# 모바일 배포 가이드

## 현재 설정된 모바일 접근 방법

### 1. Localtunnel 사용 (권장)

현재 설정:
- 백엔드 서버: http://localhost:5000
- 프론트엔드: http://localhost:3001  
- 모바일 시뮬레이터: http://localhost:5555

#### 실행 단계:

1. **백엔드 서버 실행**
```bash
cd server
node index.js
# 포트 5000에서 실행
```

2. **프론트엔드 실행**
```bash
cd client
npm start
# 포트 3001에서 실행
```

3. **Localtunnel 설치 및 실행**
```bash
# Localtunnel 설치 (한 번만)
npm install -g localtunnel

# 백엔드용 터널 생성
lt --port 5000 --subdomain bobmap-api

# 프론트엔드용 터널 생성 (새 터미널)
lt --port 3001 --subdomain bobmap-app
```

4. **환경변수 설정**
client/.env 파일 생성:
```
REACT_APP_API_URL=https://bobmap-api.loca.lt
```

5. **접속 URL**
- 모바일 앱: https://bobmap-app.loca.lt
- API 서버: https://bobmap-api.loca.lt

### 2. ngrok 사용 (대안)

```bash
# ngrok 설치
npm install -g ngrok

# 백엔드 터널
ngrok http 5000

# 프론트엔드 터널 (새 터미널)
ngrok http 3001
```

ngrok이 제공하는 URL을 사용하여 접속

### 3. 같은 네트워크 사용 (가장 간단)

1. 컴퓨터와 모바일이 같은 WiFi에 연결
2. 컴퓨터의 IP 주소 확인:
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```

3. client/.env 파일 수정:
```
REACT_APP_API_URL=http://[컴퓨터IP]:5000
```

4. 모바일에서 접속:
```
http://[컴퓨터IP]:3001
```

## 문제 해결

### CORS 에러
- 서버의 CORS 설정이 모든 origin 허용하도록 설정됨
- withCredentials: true 설정 확인

### 로그인 안되는 문제
- localStorage가 제대로 동작하는지 확인
- 토큰이 제대로 저장되는지 개발자 도구로 확인

### API 호출 실패
- baseURL이 올바르게 설정되었는지 확인
- 네트워크 탭에서 요청 URL 확인

## 프로덕션 배포

### Vercel 배포 (권장)
1. GitHub에 코드 푸시
2. Vercel에서 Import
3. 환경변수 설정
4. 자동 배포

### Heroku 배포
1. Heroku CLI 설치
2. 앱 생성 및 배포
3. MongoDB Atlas 연결

### AWS/GCP 배포
- EC2/Compute Engine 인스턴스 생성
- Node.js, MongoDB 설치
- PM2로 프로세스 관리