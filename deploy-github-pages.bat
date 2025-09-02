@echo off
echo GitHub Pages로 BobMap 배포중...

cd client
call npm run build

cd build
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M main
git remote add origin https://github.com/chonamwoo/bobmap-demo.git
git push -f origin main:gh-pages

echo.
echo ====================================
echo 배포 완료!
echo.
echo 접속 링크: https://chonamwoo.github.io/bobmap-demo
echo.
echo 몇 분 후에 접속 가능합니다.
echo ====================================
pause