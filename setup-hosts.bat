@echo off
echo.
echo ========================================
echo   BobMap Local Domain Setup
echo ========================================
echo.
echo This script will add local domain for OAuth
echo.
echo Please run as Administrator!
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with Administrator privileges...
    
    :: Add entries to hosts file
    echo. >> C:\Windows\System32\drivers\etc\hosts
    echo # BobMap Local Development >> C:\Windows\System32\drivers\etc\hosts
    echo 127.0.0.1 bobmap.local >> C:\Windows\System32\drivers\etc\hosts
    echo 172.20.10.4 bobmap.local >> C:\Windows\System32\drivers\etc\hosts
    
    echo.
    echo ✅ Successfully added bobmap.local to hosts file!
    echo.
    echo Now you can access:
    echo   PC: http://bobmap.local:3001
    echo   Mobile: Configure your mobile device's hosts file
    echo.
) else (
    echo ❌ ERROR: Please run this script as Administrator!
    echo.
    echo Right-click on this file and select "Run as administrator"
    echo.
)

pause