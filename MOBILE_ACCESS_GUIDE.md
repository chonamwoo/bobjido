# 📱 BobMap 모바일 접속 가이드

## 🌟 핸드폰에서 BobMap 사용하는 방법

### 방법 1: 같은 Wi-Fi 네트워크 접속 (가장 쉬움)

1. **컴퓨터와 핸드폰이 같은 Wi-Fi에 연결되어 있는지 확인**

2. **핸드폰 브라우저에서 다음 주소로 접속:**
   ```
   http://172.20.10.4:3001
   ```

3. **홈 화면에 추가하기 (PWA 설치)**
   - **Android (Chrome)**: 
     - 메뉴(⋮) → "홈 화면에 추가"
   - **iPhone (Safari)**: 
     - 공유 버튼 → "홈 화면에 추가"

---

### 방법 2: Cloudflare Tunnel 사용 (인터넷 공개)

1. **Cloudflare Tunnel 설치**
   ```bash
   npm install -g cloudflared
   ```

2. **터널 실행**
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```

3. **생성된 URL을 핸드폰에서 접속**
   - 예: `https://xxxxx.trycloudflare.com`

---

### 방법 3: localtunnel 사용 (무료)

1. **localtunnel 설치**
   ```bash
   npm install -g localtunnel
   ```

2. **터널 실행**
   ```bash
   lt --port 3001 --subdomain bobmap
   ```

3. **생성된 URL 접속**
   ```
   https://bobmap.loca.lt
   ```

---

### 방법 4: 모바일 핫스팟 사용

1. **핸드폰 핫스팟 켜기**
2. **컴퓨터를 핸드폰 핫스팟에 연결**
3. **핸드폰에서 접속**
   ```
   http://192.168.xxx.xxx:3001
   ```
   (ipconfig로 확인한 IP 주소 사용)

---

## 🚀 PWA 앱으로 설치하기

BobMap은 PWA(Progressive Web App)로 제작되어 앱처럼 사용 가능합니다!

### Android 설치 방법:
1. Chrome에서 사이트 접속
2. 주소창 옆 설치 아이콘 클릭
3. 또는 메뉴 → "앱 설치" 선택
4. 홈 화면에 아이콘 생성됨

### iPhone 설치 방법:
1. Safari에서 사이트 접속
2. 공유 버튼 탭
3. "홈 화면에 추가" 선택
4. 이름 확인 후 "추가"

---

## 📡 현재 접속 가능한 주소

### 로컬 네트워크 (같은 Wi-Fi):
- **웹사이트**: http://172.20.10.4:3001
- **API 서버**: http://172.20.10.4:5000
- **모바일 시뮬레이터**: http://172.20.10.4:5555

### 로컬 컴퓨터:
- **웹사이트**: http://localhost:3001
- **API 서버**: http://localhost:5000
- **모바일 시뮬레이터**: http://localhost:5555

---

## ⚙️ 서버 설정 변경 (필요시)

### 모든 IP에서 접속 허용하기:

1. **client/package.json 수정**
   ```json
   "scripts": {
     "start": "set HOST=0.0.0.0 && react-scripts start"
   }
   ```

2. **서버 재시작**
   ```bash
   npm start
   ```

---

## 🔥 주의사항

1. **방화벽 설정**: Windows 방화벽에서 포트 3001, 5000 허용 필요
2. **보안**: 로컬 네트워크에서만 사용 권장
3. **HTTPS**: 일부 PWA 기능은 HTTPS에서만 작동

---

## 📱 테스트 계정

```
Email: test@bobmap.com
Password: password123
```

---

## 💡 문제 해결

### "사이트에 연결할 수 없음" 오류:
1. 컴퓨터와 핸드폰이 같은 네트워크인지 확인
2. Windows 방화벽 확인
3. IP 주소가 맞는지 확인 (ipconfig)

### PWA 설치 안 됨:
1. HTTPS가 아닌 경우 일부 기능 제한
2. Chrome/Safari 최신 버전 사용
3. 시크릿 모드에서는 설치 불가

---

## 🎯 추천 방법

**개발/테스트용**: 방법 1 (같은 Wi-Fi)
**친구에게 공유**: 방법 2 또는 3 (인터넷 공개)
**앱처럼 사용**: PWA 설치

---

즐거운 BobMap 사용되세요! 🍴✨