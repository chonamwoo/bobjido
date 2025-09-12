# 🚀 BobMap Native 앱 실행 가이드

## ✅ 현재 실행 상태
- **Expo 서버**: http://localhost:19000 (실행 중)
- **백엔드 API**: http://172.20.10.4:8888 (실행 중)
- **네트워크 IP**: 172.20.10.4

## 📱 앱 연결 방법

### 방법 1: QR 코드 스캔 (권장)
1. 스마트폰에서 **Expo Go** 앱 실행
2. 터미널에 표시된 QR 코드 스캔
   - iOS: 카메라 앱으로 스캔
   - Android: Expo Go 앱 내에서 "Scan QR Code" 선택

### 방법 2: 수동 연결
1. Expo Go 앱 열기
2. "Enter URL manually" 선택
3. 다음 URL 입력:
   ```
   exp://172.20.10.4:19000
   ```

## 🔧 문제 해결

### "Internet connection appears to be offline" 오류
1. **같은 Wi-Fi 확인**: 컴퓨터와 스마트폰이 같은 네트워크에 있는지 확인
2. **방화벽 확인**: Windows Defender 방화벽에서 포트 19000, 8888 허용
3. **VPN 비활성화**: VPN이 켜져 있다면 끄기

### 연결이 안 될 때
```bash
# Expo 재시작
cd BobMapNative
npx expo start -c

# 터널 모드로 시도 (느리지만 안정적)
npx expo start --tunnel
```

### API 연결 오류
`src/config/api.config.ts` 파일에서 IP 주소 확인:
```typescript
lan: 'http://172.20.10.4:8888/api',  // 현재 IP로 변경
```

## 📝 개발 팁

### 실시간 로그 보기
- 터미널에서 Metro 번들러 로그 확인
- Expo Go 앱에서 흔들기 → "Debug Remote JS" 선택

### 캐시 초기화
```bash
npx expo start -c
```

### 개발 메뉴 열기
- iOS: 디바이스 흔들기 또는 Cmd + D
- Android: 디바이스 흔들기 또는 Cmd + M

## 🎯 테스트 계정
- Email: test@example.com
- Password: password123

## 📱 주요 화면
- **로그인**: 시작 화면
- **홈**: 맛집 플레이리스트 목록
- **탐색**: 지역별 맛집 검색
- **만들기**: 새 플레이리스트 생성
- **메시지**: 실시간 채팅
- **프로필**: 사용자 정보

## 🚨 주의사항
- 백엔드 서버(포트 8888)가 실행 중이어야 함
- 첫 실행 시 번들링에 1-2분 소요될 수 있음
- 코드 변경 시 자동으로 리로드됨

---
**현재 상태**: Expo 서버 실행 중 ✅
**다음 단계**: Expo Go 앱에서 QR 코드 스캔하여 연결