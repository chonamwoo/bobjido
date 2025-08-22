import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WorldMapProps {
  onCitySelect: (city: any) => void;
}

// 대륙별 도시 데이터 (드롭다운용)
const continents = [
  {
    name: '아시아',
    id: 'asia',
    color: 'from-yellow-200 to-orange-300',
    icon: '🌏',
    cities: [
      { name: '도쿄', country: 'Japan', flag: '🇯🇵', users: 156, restaurants: 342, hot: true },
      { name: '오사카', country: 'Japan', flag: '🇯🇵', users: 89, restaurants: 198 },
      { name: '교토', country: 'Japan', flag: '🇯🇵', users: 67, restaurants: 156 },
      { name: '방콕', country: 'Thailand', flag: '🇹🇭', users: 92, restaurants: 256, hot: true },
      { name: '싱가포르', country: 'Singapore', flag: '🇸🇬', users: 78, restaurants: 189 },
      { name: '홍콩', country: 'China', flag: '🇭🇰', users: 65, restaurants: 178 },
      { name: '타이베이', country: 'Taiwan', flag: '🇹🇼', users: 43, restaurants: 134 },
      { name: '하노이', country: 'Vietnam', flag: '🇻🇳', users: 38, restaurants: 98 },
      { name: '호치민', country: 'Vietnam', flag: '🇻🇳', users: 41, restaurants: 112 },
      { name: '발리', country: 'Indonesia', flag: '🇮🇩', users: 87, restaurants: 167, hot: true },
      { name: '쿠알라룸푸르', country: 'Malaysia', flag: '🇲🇾', users: 45, restaurants: 123 },
      { name: '마닐라', country: 'Philippines', flag: '🇵🇭', users: 32, restaurants: 89 }
    ]
  },
  {
    name: '유럽',
    id: 'europe',
    color: 'from-blue-200 to-indigo-300',
    icon: '🌍',
    cities: [
      { name: '파리', country: 'France', flag: '🇫🇷', users: 134, restaurants: 298, hot: true },
      { name: '런던', country: 'UK', flag: '🇬🇧', users: 112, restaurants: 267 },
      { name: '로마', country: 'Italy', flag: '🇮🇹', users: 98, restaurants: 234 },
      { name: '밀라노', country: 'Italy', flag: '🇮🇹', users: 67, restaurants: 178 },
      { name: '바르셀로나', country: 'Spain', flag: '🇪🇸', users: 76, restaurants: 189 },
      { name: '마드리드', country: 'Spain', flag: '🇪🇸', users: 54, restaurants: 143 },
      { name: '베를린', country: 'Germany', flag: '🇩🇪', users: 54, restaurants: 145 },
      { name: '뮌헨', country: 'Germany', flag: '🇩🇪', users: 48, restaurants: 132 },
      { name: '암스테르담', country: 'Netherlands', flag: '🇳🇱', users: 42, restaurants: 123 },
      { name: '프라하', country: 'Czech', flag: '🇨🇿', users: 38, restaurants: 98 },
      { name: '비엔나', country: 'Austria', flag: '🇦🇹', users: 35, restaurants: 92 },
      { name: '리스본', country: 'Portugal', flag: '🇵🇹', users: 41, restaurants: 108 }
    ]
  },
  {
    name: '아메리카',
    id: 'america',
    color: 'from-green-200 to-teal-300',
    icon: '🌎',
    cities: [
      { name: '뉴욕', country: 'USA', flag: '🇺🇸', users: 189, restaurants: 456, hot: true },
      { name: 'LA', country: 'USA', flag: '🇺🇸', users: 145, restaurants: 367 },
      { name: '샌프란시스코', country: 'USA', flag: '🇺🇸', users: 98, restaurants: 256 },
      { name: '시카고', country: 'USA', flag: '🇺🇸', users: 76, restaurants: 198 },
      { name: '라스베가스', country: 'USA', flag: '🇺🇸', users: 54, restaurants: 143 },
      { name: '토론토', country: 'Canada', flag: '🇨🇦', users: 67, restaurants: 178 },
      { name: '밴쿠버', country: 'Canada', flag: '🇨🇦', users: 52, restaurants: 134 },
      { name: '멕시코시티', country: 'Mexico', flag: '🇲🇽', users: 45, restaurants: 134 },
      { name: '칸쿤', country: 'Mexico', flag: '🇲🇽', users: 38, restaurants: 98 }
    ]
  },
  {
    name: '오세아니아',
    id: 'oceania',
    color: 'from-purple-200 to-pink-300',
    icon: '🌏',
    cities: [
      { name: '시드니', country: 'Australia', flag: '🇦🇺', users: 89, restaurants: 234 },
      { name: '멜버른', country: 'Australia', flag: '🇦🇺', users: 67, restaurants: 189 },
      { name: '브리즈번', country: 'Australia', flag: '🇦🇺', users: 45, restaurants: 123 },
      { name: '골드코스트', country: 'Australia', flag: '🇦🇺', users: 38, restaurants: 98 },
      { name: '오클랜드', country: 'New Zealand', flag: '🇳🇿', users: 34, restaurants: 89 },
      { name: '퀸스타운', country: 'New Zealand', flag: '🇳🇿', users: 28, restaurants: 72 }
    ]
  },
  {
    name: '중동/아프리카',
    id: 'middle-east-africa',
    color: 'from-red-200 to-rose-300',
    icon: '🌍',
    cities: [
      { name: '두바이', country: 'UAE', flag: '🇦🇪', users: 76, restaurants: 198, hot: true },
      { name: '아부다비', country: 'UAE', flag: '🇦🇪', users: 45, restaurants: 123 },
      { name: '이스탄불', country: 'Turkey', flag: '🇹🇷', users: 67, restaurants: 178 },
      { name: '카이로', country: 'Egypt', flag: '🇪🇬', users: 34, restaurants: 89 },
      { name: '마라케시', country: 'Morocco', flag: '🇲🇦', users: 28, restaurants: 76 },
      { name: '케이프타운', country: 'South Africa', flag: '🇿🇦', users: 41, restaurants: 108 }
    ]
  }
];

const WorldMap: React.FC<WorldMapProps> = ({ onCitySelect }) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [expandedContinent, setExpandedContinent] = useState<string | null>('asia');

  const toggleContinent = (continentId: string) => {
    setExpandedContinent(expandedContinent === continentId ? null : continentId);
  };

  return (
    <div className="bg-white rounded-xl p-4">
      {/* 헤더 */}
      <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
        <span>🌍</span>
        <span>해외 도시 선택</span>
      </h3>
      
      {/* 대륙별 드롭다운 */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {continents.map((continent) => (
          <div key={continent.id} className="border border-gray-100 rounded-lg overflow-hidden">
            {/* 대륙 헤더 (클릭 가능) */}
            <button
              onClick={() => toggleContinent(continent.id)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{continent.icon}</span>
                <h4 className="text-sm font-semibold text-gray-700">{continent.name}</h4>
                <span className="text-xs text-gray-500">({continent.cities.length}개 도시)</span>
              </div>
              <motion.div
                animate={{ rotate: expandedContinent === continent.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            
            {/* 도시 그리드 (확장 시에만 표시) */}
            {expandedContinent === continent.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-white"
              >
                <div className="grid grid-cols-3 gap-2">
                  {continent.cities.map((city) => {
                    const isHovered = hoveredCity === city.name;
                    const cityData = { ...city, continent: continent.id };
                    
                    return (
                      <motion.div
                        key={city.name}
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => onCitySelect(cityData)}
                      >
                        <div className={`
                          relative bg-gradient-to-br ${continent.color} bg-opacity-50
                          rounded-lg p-3 cursor-pointer shadow-sm border border-gray-100
                          hover:shadow-md transition-all
                          ${isHovered ? 'ring-2 ring-offset-1 ring-gray-300' : ''}
                        `}>
                          {/* 핫 뱃지 */}
                          {city.hot && (
                            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md z-10">
                              🔥
                            </div>
                          )}
                          
                          {/* 도시 정보 */}
                          <div className="flex flex-col items-center">
                            <span className="text-2xl mb-1">{city.flag}</span>
                            <span className="text-sm font-bold text-gray-800 text-center">
                              {city.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {city.users}명
                            </span>
                          </div>
                          
                          {/* 맛집 수 뱃지 */}
                          <div className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5 font-medium shadow-sm">
                            🍽️ {city.restaurants}
                          </div>
                        </div>
                        
                        {/* 호버 시 상세 정보 */}
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white rounded-lg px-3 py-2 z-30 whitespace-nowrap"
                          >
                            <div className="text-xs">
                              <div className="font-semibold text-sm mb-1">{city.name}</div>
                              <div className="text-gray-300 mb-1">{city.country}</div>
                              <div className="space-y-0.5">
                                <div>👥 {city.users}명의 미식가</div>
                                <div>🍽️ {city.restaurants}개 맛집</div>
                              </div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {/* 빠른 선택 - 인기 도시 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-xs font-semibold text-gray-500 mb-2">🔥 인기 도시 TOP 7</h5>
        <div className="flex flex-wrap gap-2">
          {continents
            .flatMap(c => c.cities)
            .sort((a, b) => b.users - a.users)
            .slice(0, 7)
            .map((city) => (
              <button
                key={city.name}
                onClick={() => onCitySelect(city)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors flex items-center gap-1"
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
              </button>
            ))}
        </div>
      </div>
      
      {/* 하단 통계 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {continents.reduce((sum, c) => sum + c.cities.reduce((s, city) => s + city.users, 0), 0)}
            </div>
            <div className="text-xs text-gray-500">총 미식가</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {continents.reduce((sum, c) => sum + c.cities.reduce((s, city) => s + city.restaurants, 0), 0)}
            </div>
            <div className="text-xs text-gray-500">총 맛집</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {continents.reduce((sum, c) => sum + c.cities.length, 0)}
            </div>
            <div className="text-xs text-gray-500">도시 수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;