@echo off
echo ====================================
echo     BobsMap 배포 스크립트
echo ====================================
echo.

:: 환경변수 체크
echo [1/4] 환경변수 확인 중...
if not exist ".env" (
    echo .env 파일이 없습니다. .env.example을 복사합니다...
    copy .env.example .env
    echo .env 파일이 생성되었습니다. 설정 후 다시 실행해주세요.
    pause
    exit /b
)

:: 의존성 설치
echo.
echo [2/4] 의존성 설치 중...
call npm install
cd client
call npm install
cd ..
cd server
call npm install
cd ..

:: 빌드
echo.
echo [3/4] 클라이언트 빌드 중...
cd client
call npm run build
cd ..

:: 배포 옵션
echo.
echo [4/4] 배포 방법을 선택하세요:
echo.
echo 1. Vercel + Railway (추천)
echo 2. 로컬 테스트
echo 3. 종료
echo.
set /p choice="선택 (1-3): "

if "%choice%"=="1" (
    echo.
    echo Vercel 배포 시작...
    cd client
    npx vercel --prod
    cd ..
    echo.
    echo ====================================
    echo   Vercel 배포 완료!
    echo ====================================
    echo.
    echo 백엔드 배포 방법:
    echo 1. https://railway.app 접속
    echo 2. GitHub 레포지토리 연결
    echo 3. 환경변수 설정
    echo 4. Deploy 클릭
    echo.
) else if "%choice%"=="2" (
    echo.
    echo 로컬 테스트 시작...
    start cmd /k "cd server && npm run dev"
    timeout /t 3
    start cmd /k "cd client && npm start"
    echo.
    echo 서버: http://localhost:8888
    echo 클라이언트: http://localhost:3000
    echo.
) else (
    echo 종료합니다.
)

pause