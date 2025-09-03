import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FoodItem {
  name: string;
  emoji: string;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
  specialMenu?: string;
}

const initialFoods: FoodItem[] = [
  { name: '치킨', emoji: '🍗', category: '양식' },
  { name: '피자', emoji: '🍕', category: '양식' },
  { name: '삼겹살', emoji: '🥓', category: '한식' },
  { name: '떡볶이', emoji: '🍜', category: '분식' },
  { name: '초밥', emoji: '🍣', category: '일식' },
  { name: '짜장면', emoji: '🍜', category: '중식' },
  { name: '파스타', emoji: '🍝', category: '양식' },
  { name: '라멘', emoji: '🍜', category: '일식' },
  { name: '갈비', emoji: '🥩', category: '한식' },
  { name: '김치찌개', emoji: '🍲', category: '한식' },
  { name: '햄버거', emoji: '🍔', category: '양식' },
  { name: '마라탕', emoji: '🥘', category: '중식' },
  { name: '팟타이', emoji: '🍜', category: '동남아' },
  { name: '쌀국수', emoji: '🍜', category: '동남아' },
  { name: '스테이크', emoji: '🥩', category: '양식' },
  { name: '회', emoji: '🐟', category: '일식' }
];

// 특정 음식별 전문점 데이터베이스
const specificFoodRestaurants: { [key: string]: Restaurant[] } = {
  '피자': [
    {
      id: 'p1',
      name: '피자헛 강남점',
      category: '피자',
      location: '강남구 역삼동',
      rating: 4.2,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      description: '미국식 정통 피자',
      specialMenu: '슈퍼슈프림, 불고기피자'
    },
    {
      id: 'p2',
      name: '피자마루',
      category: '피자',
      location: '서초구 서초동',
      rating: 4.5,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      description: '화덕 피자 전문점',
      specialMenu: '마르게리타, 고르곤졸라'
    },
    {
      id: 'p3',
      name: '미스터피자',
      category: '피자',
      location: '종로구 종로',
      rating: 4.1,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
      description: '샐러드바가 있는 피자',
      specialMenu: '포테이토 골드, 미트디럭스'
    }
  ],
  '치킨': [
    {
      id: 'ch1',
      name: '교촌치킨 강남점',
      category: '치킨',
      location: '강남구 역삼동',
      rating: 4.3,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
      description: '간장치킨의 원조',
      specialMenu: '교촌오리지날, 허니콤보'
    },
    {
      id: 'ch2',
      name: 'BBQ 홍대점',
      category: '치킨',
      location: '마포구 서교동',
      rating: 4.4,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
      description: '황금올리브 치킨',
      specialMenu: '황금올리브, 자메이카통다리'
    },
    {
      id: 'ch3',
      name: '굽네치킨 신촌점',
      category: '치킨',
      location: '서대문구 창천동',
      rating: 4.2,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400',
      description: '오븐에 구운 건강한 치킨',
      specialMenu: '고추바사삭, 갈비천왕'
    }
  ],
  '햄버거': [
    {
      id: 'b1',
      name: '쉐이크쉑 강남',
      category: '햄버거',
      location: '강남구 강남대로',
      rating: 4.6,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      description: '뉴욕 프리미엄 버거',
      specialMenu: '쉑버거, 스모크쉑'
    },
    {
      id: 'b2',
      name: '파이브가이즈',
      category: '햄버거',
      location: '용산구 이태원동',
      rating: 4.5,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
      description: '미국식 수제버거',
      specialMenu: '베이컨 치즈버거, 카준프라이'
    },
    {
      id: 'b3',
      name: '버거킹 명동점',
      category: '햄버거',
      location: '중구 명동',
      rating: 4.0,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      description: '불맛 가득 와퍼',
      specialMenu: '와퍼, 통새우와퍼'
    }
  ],
  '짜장면': [
    {
      id: 'jj1',
      name: '홍콩반점 명동',
      category: '중식',
      location: '중구 명동',
      rating: 4.5,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
      description: '60년 전통 중화요리',
      specialMenu: '유니짜장, 삼선짜장'
    },
    {
      id: 'jj2',
      name: '신승관',
      category: '중식',
      location: '종로구 종로',
      rating: 4.7,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
      description: '수타면 전문점',
      specialMenu: '간짜장, 유슬짜장'
    }
  ],
  '초밥': [
    {
      id: 'ss1',
      name: '스시효',
      category: '일식',
      location: '강남구 청담동',
      rating: 4.8,
      priceRange: '₩₩₩₩',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      description: '에도마에 스시 오마카세',
      specialMenu: '런치 오마카세'
    },
    {
      id: 'ss2',
      name: '스시쿠라',
      category: '일식',
      location: '강남구 논현동',
      rating: 4.6,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1562436260-8c9216eeb703?w=400',
      description: '정통 일본 스시',
      specialMenu: '특선 초밥 세트'
    }
  ],
  '라멘': [
    {
      id: 'r1',
      name: '이치란라멘',
      category: '일식',
      location: '명동',
      rating: 4.7,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      description: '일본 정통 돈코츠 라멘',
      specialMenu: '이치란라멘'
    },
    {
      id: 'r2',
      name: '멘야산다이메',
      category: '일식',
      location: '강남구 역삼동',
      rating: 4.5,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
      description: '츠케멘 전문점',
      specialMenu: '츠케멘, 매운미소라멘'
    }
  ],
  '삼겹살': [
    {
      id: 'sg1',
      name: '하남돼지집',
      category: '한식',
      location: '송파구 방이동',
      rating: 4.6,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
      description: '숙성 삼겹살 전문',
      specialMenu: '한돈 삼겹살, 항정살'
    },
    {
      id: 'sg2',
      name: '돈마호크',
      category: '한식',
      location: '마포구 서교동',
      rating: 4.5,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      description: '이베리코 전문점',
      specialMenu: '이베리코 흑돼지'
    }
  ],
  '떡볶이': [
    {
      id: 'tb1',
      name: '엽기떡볶이',
      category: '분식',
      location: '강남구 역삼동',
      rating: 4.3,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400',
      description: '매운맛의 끝판왕',
      specialMenu: '엽기떡볶이, 주먹김밥'
    },
    {
      id: 'tb2',
      name: '신전떡볶이',
      category: '분식',
      location: '전국 체인',
      rating: 4.2,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
      description: '중독성 있는 매운 떡볶이',
      specialMenu: '신전떡볶이, 치즈김밥'
    }
  ]
};

const restaurantDatabase: { [key: string]: Restaurant[] } = {
  '한식': [
    { 
      id: 'k1', 
      name: '육전식당', 
      category: '한식', 
      location: '종로구 인사동', 
      rating: 4.8, 
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1580554406126-cf7c25c12b88?w=400',
      description: '한우 전문 구이집',
      specialMenu: '한우 등심, 육회'
    },
    {
      id: 'k2',
      name: '김치만',
      category: '한식',
      location: '마포구 망원동',
      rating: 4.6,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400',
      description: '집밥 스타일 한식당',
      specialMenu: '김치찌개, 제육볶음'
    },
    {
      id: 'k3',
      name: '명동갈비',
      category: '한식',
      location: '중구 명동',
      rating: 4.7,
      priceRange: '₩₩₩₩',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
      description: '60년 전통 갈비 전문점',
      specialMenu: '양념갈비, 냉면'
    }
  ],
  '양식': [
    {
      id: 'w1',
      name: '브릭오븐',
      category: '양식',
      location: '성수구 성수동',
      rating: 4.7,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      description: '화덕 피자 전문점',
      specialMenu: '마르게리타, 콰트로 포르마지'
    },
    {
      id: 'w2',
      name: '더버거',
      category: '양식',
      location: '송파구 잠실동',
      rating: 4.5,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      description: '수제버거 맛집',
      specialMenu: '시그니처 버거, 트러플 감자튀김'
    },
    {
      id: 'w3',
      name: '파스타 부오노',
      category: '양식',
      location: '강남구 청담동',
      rating: 4.8,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      description: '정통 이탈리안 레스토랑',
      specialMenu: '트러플 크림 파스타'
    }
  ],
  '일식': [
    {
      id: 'j1',
      name: '스시야',
      category: '일식',
      location: '강남구 청담동',
      rating: 4.9,
      priceRange: '₩₩₩₩',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      description: '오마카세 전문점',
      specialMenu: '런치 오마카세'
    },
    {
      id: 'j2',
      name: '라멘공방',
      category: '일식',
      location: '용산구 이태원동',
      rating: 4.4,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      description: '정통 일본식 라멘',
      specialMenu: '돈코츠라멘, 차슈동'
    },
    {
      id: 'j3',
      name: '하루',
      category: '일식',
      location: '서초구 서초동',
      rating: 4.6,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
      description: '이자카야 & 사시미',
      specialMenu: '모듬회, 사케'
    }
  ],
  '중식': [
    {
      id: 'c1',
      name: '진짜루',
      category: '중식',
      location: '강남구 역삼동',
      rating: 4.7,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
      description: '30년 전통의 수타면 전문점',
      specialMenu: '간짜장, 삼선짬뽕'
    },
    {
      id: 'c2',
      name: '홍콩반점',
      category: '중식',
      location: '서초구 서초동',
      rating: 4.5,
      priceRange: '₩₩₩',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
      description: '미슐랭 가이드 선정 중식당',
      specialMenu: '유니짜장, 게살볶음밥'
    },
    {
      id: 'c3',
      name: '마라공감',
      category: '중식',
      location: '마포구 홍대',
      rating: 4.4,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      description: '마라탕 & 마라샹궈 전문',
      specialMenu: '마라탕, 꿔바로우'
    }
  ],
  '분식': [
    {
      id: 'b1',
      name: '엽기떡볶이',
      category: '분식',
      location: '강남구 역삼동',
      rating: 4.3,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400',
      description: '매운맛의 진수',
      specialMenu: '엽기떡볶이, 주먹김밥'
    },
    {
      id: 'b2',
      name: '신전떡볶이',
      category: '분식',
      location: '전국 체인',
      rating: 4.2,
      priceRange: '₩',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
      description: '국민 떡볶이',
      specialMenu: '신전떡볶이, 치즈김밥'
    }
  ],
  '동남아': [
    {
      id: 's1',
      name: '방콕익스프레스',
      category: '동남아',
      location: '용산구 이태원',
      rating: 4.5,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
      description: '정통 태국 요리',
      specialMenu: '팟타이, 똠얌꿍'
    },
    {
      id: 's2',
      name: '사이공마켓',
      category: '동남아',
      location: '마포구 연남동',
      rating: 4.4,
      priceRange: '₩₩',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      description: '베트남 쌀국수 전문',
      specialMenu: '쌀국수, 반미'
    }
  ]
};

export default function FoodVS() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [currentRound, setCurrentRound] = useState<FoodItem[]>([]);
  const [nextRound, setNextRound] = useState<FoodItem[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [winner, setWinner] = useState<FoodItem | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    // 음식 랜덤 섞기
    const shuffled = [...initialFoods].sort(() => Math.random() - 0.5);
    setFoods(shuffled);
    setCurrentRound(shuffled);
    setTotalRounds(Math.ceil(Math.log2(shuffled.length)));
  }, []);

  const handleChoice = (chosen: FoodItem) => {
    const newNextRound = [...nextRound, chosen];
    setNextRound(newNextRound);

    if (currentMatch + 2 >= currentRound.length) {
      // 현재 라운드 종료
      if (newNextRound.length === 1) {
        // 우승자 결정
        setWinner(newNextRound[0]);
        setTimeout(() => setShowRecommendations(true), 1500);
        
        // Save to localStorage
        const gameRecords = JSON.parse(localStorage.getItem('gameRecords') || '{}');
        const recommendations = specificFoodRestaurants[newNextRound[0].name] || restaurantDatabase[newNextRound[0].category] || [];
        gameRecords.foodVS = {
          winner: newNextRound[0].name,
          category: newNextRound[0].category,
          restaurants: recommendations,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem('gameRecords', JSON.stringify(gameRecords));
        
        // Update completed games count
        const completedGames = parseInt(localStorage.getItem('completedGames') || '0');
        localStorage.setItem('completedGames', String(completedGames + 1));
      } else {
        // 다음 라운드로
        setCurrentRound(newNextRound);
        setNextRound([]);
        setCurrentMatch(0);
        setRoundNumber(roundNumber + 1);
      }
    } else {
      // 다음 매치로
      setCurrentMatch(currentMatch + 2);
    }
  };

  const resetGame = () => {
    const shuffled = [...initialFoods].sort(() => Math.random() - 0.5);
    setFoods(shuffled);
    setCurrentRound(shuffled);
    setNextRound([]);
    setCurrentMatch(0);
    setWinner(null);
    setRoundNumber(1);
    setShowRecommendations(false);
  };

  const getRoundName = () => {
    const remaining = currentRound.length;
    if (remaining === 16) return '16강';
    if (remaining === 8) return '8강';
    if (remaining === 4) return '준결승';
    if (remaining === 2) return '결승';
    return `${remaining}강`;
  };

  const getRecommendedRestaurants = () => {
    if (!winner) return [];
    
    // 먼저 특정 음식 전문점이 있는지 확인
    if (specificFoodRestaurants[winner.name]) {
      return specificFoodRestaurants[winner.name];
    }
    
    // 없으면 카테고리별 맛집 추천
    return restaurantDatabase[winner.category] || [];
  };

  if (winner) {
    const recommendations = getRecommendedRestaurants();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              음식 월드컵 우승!
            </h1>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-6 mb-8"
            >
              <div className="text-6xl mb-3">{winner.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{winner.name}</h2>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                {winner.category}
              </span>
            </motion.div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                다시 하기
              </button>
              <button
                onClick={() => navigate('/game-hub')}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                다른 게임하기
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showRecommendations && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center">
                  🍽️ {winner.name} 맛집 추천
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  {specificFoodRestaurants[winner.name] 
                    ? `당신이 선택한 ${winner.name}! 여기서 드셔보세요!` 
                    : `${winner.category} 카테고리의 다양한 맛집들을 추천해드려요!`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    >
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                        
                        {restaurant.specialMenu && (
                          <p className="text-sm text-orange-600 mb-3">
                            👨‍🍳 추천: {restaurant.specialMenu}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{restaurant.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">{restaurant.rating}</span>
                            </div>
                            <span className="text-gray-600">{restaurant.priceRange}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigate('/explore/local')}
                    className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                  >
                    더 많은 맛집 보기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (currentMatch < currentRound.length) {
    const food1 = currentRound[currentMatch];
    const food2 = currentRound[currentMatch + 1];

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 라운드 정보 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              🏆 음식 월드컵
            </h1>
            <div className="flex justify-center items-center gap-4 text-gray-600">
              <span className="text-xl font-semibold">{getRoundName()}</span>
              <span className="text-lg">
                {currentMatch / 2 + 1} / {currentRound.length / 2} 경기
              </span>
            </div>
          </motion.div>

          {/* VS 대결 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice(food1)}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-8xl mb-4">{food1.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{food1.name}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {food1.category}
              </span>
            </motion.button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-6xl font-bold text-red-500">VS</div>
            </motion.div>

            <motion.button
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice(food2)}
              className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all"
            >
              <div className="text-8xl mb-4">{food2.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{food2.name}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {food2.category}
              </span>
            </motion.button>
          </div>

          {/* 진행 상황 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>진행률</span>
              <span>{Math.round(((currentMatch / 2) / (currentRound.length / 2)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentMatch / 2) / (currentRound.length / 2)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}