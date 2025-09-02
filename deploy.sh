#!/bin/bash

echo "🚀 BobsMap 배포 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 환경변수 체크
echo -e "${YELLOW}📋 환경변수 확인 중...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env 파일이 없습니다. .env.example을 복사하여 설정해주세요.${NC}"
    cp .env.example .env
    echo -e "${YELLOW}.env 파일이 생성되었습니다. 설정 후 다시 실행해주세요.${NC}"
    exit 1
fi

# 2. 의존성 설치
echo -e "${YELLOW}📦 의존성 설치 중...${NC}"
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# 3. 빌드
echo -e "${YELLOW}🔨 클라이언트 빌드 중...${NC}"
cd client && npm run build && cd ..

# 4. 배포 옵션 선택
echo -e "${GREEN}배포 방법을 선택하세요:${NC}"
echo "1) Vercel + Railway (추천)"
echo "2) Render.com"
echo "3) 로컬 테스트"
read -p "선택 (1-3): " choice

case $choice in
    1)
        echo -e "${YELLOW}🚀 Vercel + Railway 배포 시작...${NC}"
        
        # Vercel 배포
        echo -e "${YELLOW}📱 프론트엔드 배포 중 (Vercel)...${NC}"
        cd client
        npx vercel --prod
        cd ..
        
        echo -e "${GREEN}✅ Vercel 배포 완료!${NC}"
        echo -e "${YELLOW}📡 백엔드는 Railway에서 수동으로 배포해주세요:${NC}"
        echo "1. https://railway.app 접속"
        echo "2. GitHub 레포지토리 연결"
        echo "3. 환경변수 설정"
        echo "4. Deploy 클릭"
        ;;
        
    2)
        echo -e "${YELLOW}🚀 Render.com 배포 시작...${NC}"
        echo "render.yaml 파일을 GitHub에 푸시한 후"
        echo "https://render.com 에서 'New' -> 'Blueprint' 선택"
        ;;
        
    3)
        echo -e "${YELLOW}🏠 로컬 테스트 모드...${NC}"
        echo -e "${GREEN}서버 시작:${NC} npm run dev"
        npm run dev
        ;;
esac

echo -e "${GREEN}✨ 배포 프로세스 완료!${NC}"
echo -e "${YELLOW}📝 다음 단계:${NC}"
echo "1. Admin 계정으로 로그인: admin@bobmap.com / admin123!@#"
echo "2. 친구들에게 링크 공유"
echo "3. 피드백 수집"