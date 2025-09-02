@echo off
echo 🚀 BobMap 서버 시작 중...
echo.

REM MongoDB 서비스 시작 시도
echo 📦 MongoDB 서비스 시작 시도...
net start MongoDB
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB 서비스 시작 실패. 수동으로 시작해주세요.
    echo 💡 MongoDB가 설치되지 않았다면: https://www.mongodb.com/try/download/community
)

echo.
echo 🔧 의존성 설치 중...
call npm install
cd client
call npm install
cd ..

echo.
echo 🚀 서버 시작...
npm run dev

pause