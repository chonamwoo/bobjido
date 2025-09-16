@echo off
echo Copying BobsMap to BobsMaps_final...

:: Create directories
if not exist "..\BobsMaps_final" mkdir "..\BobsMaps_final"
if not exist "..\BobsMaps_final\client" mkdir "..\BobsMaps_final\client"
if not exist "..\BobsMaps_final\server" mkdir "..\BobsMaps_final\server"

:: Copy main files
copy package.json "..\BobsMaps_final\" /Y
copy package-lock.json "..\BobsMaps_final\" /Y
copy .env "..\BobsMaps_final\" /Y 2>nul
copy *.html "..\BobsMaps_final\" /Y
copy *.md "..\BobsMaps_final\" /Y
copy *.js "..\BobsMaps_final\" /Y
copy *.json "..\BobsMaps_final\" /Y
copy *.bat "..\BobsMaps_final\" /Y

:: Copy client folder
xcopy client "..\BobsMaps_final\client" /E /I /Y /Q /EXCLUDE:exclude.txt

:: Copy server folder  
xcopy server "..\BobsMaps_final\server" /E /I /Y /Q /EXCLUDE:exclude.txt

:: Copy other important folders if they exist
if exist ".claude" xcopy .claude "..\BobsMaps_final\.claude" /E /I /Y /Q

echo.
echo Copy completed!
echo.
echo Next steps:
echo 1. cd ..\BobsMaps_final
echo 2. npm install
echo 3. cd client && npm install && cd ..
echo 4. npm run server (in one terminal)
echo 5. cd client && npm start (in another terminal)