@echo off
echo BobMap 서버 재시작 중...

echo.
echo 1. 기존 서버 프로세스 종료 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8888') do (
    echo    프로세스 %%a 종료...
    taskkill /F /PID %%a >nul 2>&1
)

echo 2. 잠시 대기...
timeout /t 2 /nobreak >nul

echo 3. 서버 시작...
start cmd /k "npm run server"

echo.
echo ✅ 서버가 재시작되었습니다!
echo.
echo 서버 URL: http://localhost:8888
echo Admin Panel: http://localhost:3002/admin
echo.
pause