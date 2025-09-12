# 🔧 네트워크 연결 문제 해결 가이드

## ❌ "Internet connection appears to be offline" 오류 해결

### 방법 1: Tunnel 모드 사용 (추천) ✅
```bash
npx expo start --tunnel
```
- 인터넷을 통해 연결되므로 방화벽/네트워크 문제 우회
- 조금 느릴 수 있지만 가장 안정적

### 방법 2: LAN 모드 사용
```bash
npx expo start --lan
```
- 같은 Wi-Fi 네트워크에서만 작동
- 빠른 속도

### 방법 3: localhost 사용 (에뮬레이터용)
```bash
npx expo start --localhost
```
- iOS 시뮬레이터나 Android 에뮬레이터에서만 작동

## 🛡️ Windows 방화벽 설정

### 관리자 권한으로 CMD 실행 후:
```cmd
# Expo 포트 허용
netsh advfirewall firewall add rule name="Expo Dev Server" dir=in action=allow protocol=TCP localport=8081

# 백엔드 API 포트 허용
netsh advfirewall firewall add rule name="BobMap API" dir=in action=allow protocol=TCP localport=8888

# Metro 번들러 포트 허용
netsh advfirewall firewall add rule name="Metro Bundler" dir=in action=allow protocol=TCP localport=19000-19006
```

## 📱 스마트폰 설정

### Android:
1. **개발자 옵션 활성화**
   - 설정 → 휴대전화 정보 → 빌드 번호 7번 탭
2. **USB 디버깅 활성화**
   - 설정 → 개발자 옵션 → USB 디버깅 ON

### iOS:
1. **신뢰할 수 있는 개발자**
   - 설정 → 일반 → VPN 및 기기 관리
   - 개발자 앱 신뢰

## 🌐 네트워크 체크리스트

- [ ] 컴퓨터와 스마트폰이 같은 Wi-Fi?
- [ ] VPN 비활성화?
- [ ] Windows Defender 방화벽 예외 추가?
- [ ] 안티바이러스 소프트웨어 일시 중지?

## 💡 Quick Fix 스크립트

### fix-expo.bat 파일 생성:
```batch
@echo off
echo Killing existing Expo processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2

echo Starting Expo with tunnel mode...
cd BobMapNative
npx expo start --tunnel --clear

pause
```

## 🔄 캐시 초기화

문제가 지속되면:
```bash
# Expo 캐시 초기화
npx expo start -c

# npm 캐시 초기화
npm cache clean --force

# Metro 캐시 초기화
npx react-native start --reset-cache
```

## 📡 대체 연결 방법

### 1. ngrok 사용
```bash
npm install -g ngrok
ngrok http 8081
```

### 2. localtunnel 사용
```bash
npm install -g localtunnel
lt --port 8081
```

## 🚨 긴급 해결책

아무것도 안 될 때:
1. **컴퓨터 재시작**
2. **라우터 재시작**
3. **Expo Go 앱 재설치**
4. **개발 서버 포트 변경**
   ```bash
   npx expo start --port 8083
   ```

## 📞 지원

여전히 문제가 있다면:
- Expo 포럼: https://forums.expo.dev/
- Stack Overflow: #expo 태그
- GitHub Issues: https://github.com/expo/expo/issues