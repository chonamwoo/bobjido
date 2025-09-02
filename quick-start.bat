@echo off
echo 🚀 BobMap 빠른 시작
echo.

echo 🔧 기존 프로세스 정리...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do taskkill /PID %%a /F >nul 2>&1

echo 📦 백엔드 서버 시작 (포트 3001)...
start "BobMap Backend" cmd /k "npm run server"

timeout /t 5 /nobreak

echo 🌐 프론트엔드 시작 (포트 3000)...
start "BobMap Frontend" cmd /k "cd client && set PORT=3000 && npm start"

echo.
echo ✅ BobMap이 시작되었습니다!
echo 📝 백엔드: http://localhost:3001/api/health
echo 💻 프론트엔드: http://localhost:3000
echo 🔑 어드민: http://localhost:3001/api/admin/login
echo.
echo ⚠️ MongoDB Atlas 클라우드 연결을 사용 중입니다.
echo.
pause