import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface KoreaMapProps {
  onCitySelect: (city: any) => void;
}

// 지역별 도시 데이터 (세분화된 버전)
const regions = [
  {
    name: '서울',
    color: 'from-green-200 to-emerald-300',
    cities: [
      { name: '강남/서초', icon: '💼', users: 89, restaurants: 234 },
      { name: '마포/홍대', icon: '🎨', users: 67, restaurants: 189 },
      { name: '종로/중구', icon: '🏛️', users: 45, restaurants: 156 },
      { name: '성수/건대', icon: '☕', users: 52, restaurants: 143 },
      { name: '이태원/한남', icon: '🌏', users: 38, restaurants: 127 },
      { name: '잠실/송파', icon: '🏢', users: 41, restaurants: 118 }
    ]
  },
  {
    name: '인천/경기',
    color: 'from-teal-200 to-cyan-300',
    cities: [
      { name: '인천 송도', icon: '🏙️', users: 32, restaurants: 87 },
      { name: '인천 구월동', icon: '🛍️', users: 28, restaurants: 76 },
      { name: '수원', icon: '🏰', users: 73, restaurants: 187 },
      { name: '분당/판교', icon: '💻', users: 56, restaurants: 145 },
      { name: '일산', icon: '🌳', users: 34, restaurants: 92 },
      { name: '안양/과천', icon: '🏘️', users: 29, restaurants: 78 }
    ]
  },
  {
    name: '강원',
    color: 'from-blue-200 to-sky-300',
    cities: [
      { name: '춘천', icon: '🏔️', users: 28, restaurants: 76 },
      { name: '강릉', icon: '⛷️', users: 45, restaurants: 123 },
      { name: '속초', icon: '🌊', users: 34, restaurants: 89 },
      { name: '평창', icon: '🎿', users: 22, restaurants: 58 }
    ]
  },
  {
    name: '충청',
    color: 'from-yellow-200 to-amber-300',
    cities: [
      { name: '대전', icon: '🔬', users: 51, restaurants: 134 },
      { name: '청주', icon: '🏫', users: 32, restaurants: 87 },
      { name: '천안', icon: '🚅', users: 29, restaurants: 78 },
      { name: '세종', icon: '🏛️', users: 24, restaurants: 65 }
    ]
  },
  {
    name: '전라',
    color: 'from-red-200 to-pink-300',
    cities: [
      { name: '전주', icon: '🍜', users: 56, restaurants: 145 },
      { name: '광주', icon: '🎨', users: 43, restaurants: 112 },
      { name: '여수', icon: '🌴', users: 31, restaurants: 82 },
      { name: '순천', icon: '🌿', users: 23, restaurants: 61 }
    ]
  },
  {
    name: '경상',
    color: 'from-purple-200 to-violet-300',
    cities: [
      { name: '부산 해운대', icon: '🏖️', users: 54, restaurants: 142 },
      { name: '부산 서면', icon: '🌃', users: 48, restaurants: 126 },
      { name: '대구', icon: '🌆', users: 78, restaurants: 201 },
      { name: '울산', icon: '🏭', users: 38, restaurants: 97 },
      { name: '경주', icon: '🏛️', users: 34, restaurants: 98 },
      { name: '포항', icon: '⚓', users: 26, restaurants: 71 }
    ]
  },
  {
    name: '제주',
    color: 'from-orange-200 to-rose-300',
    cities: [
      { name: '제주시', icon: '🏝️', users: 67, restaurants: 189 },
      { name: '서귀포', icon: '🌺', users: 45, restaurants: 112 },
      { name: '애월', icon: '☕', users: 32, restaurants: 85 },
      { name: '성산', icon: '🌅', users: 24, restaurants: 63 }
    ]
  }
];

const KoreaMap: React.FC<KoreaMapProps> = ({ onCitySelect }) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [expandedRegion, setExpandedRegion] = useState<string | null>('서울');

  const toggleRegion = (regionName: string) => {
    setExpandedRegion(expandedRegion === regionName ? null : regionName);
  };

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
        <span>🇰🇷</span>
        <span>국내 도시 선택</span>
      </h3>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {regions.map((region) => (
          <div key={region.name} className="border border-gray-100 rounded-lg overflow-hidden">
            {/* 지역 헤더 (클릭 가능) */}
            <button
              onClick={() => toggleRegion(region.name)}
              className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${region.color}`} />
                <h4 className="text-sm font-semibold text-gray-700">{region.name}</h4>
                <span className="text-xs text-gray-500">({region.cities.length}개 지역)</span>
              </div>
              <motion.div
                animate={{ rotate: expandedRegion === region.name ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>
            
            {/* 도시 그리드 (확장 시에만 표시) */}
            {expandedRegion === region.name && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-3 bg-white"
              >
                <div className="grid grid-cols-3 gap-2">
                  {region.cities.map((city) => {
                    const isHovered = hoveredCity === city.name;
                    const cityData = { ...city, region: region.name, icon: city.icon };
                    
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
                          relative bg-gradient-to-br ${region.color} bg-opacity-50
                          rounded-lg p-3 cursor-pointer shadow-sm border border-gray-100
                          hover:shadow-md transition-all
                          ${isHovered ? 'ring-2 ring-offset-1 ring-gray-300' : ''}
                        `}>
                          {/* 도시 아이콘과 이름 */}
                          <div className="flex flex-col items-center">
                            <span className="text-2xl mb-1">{city.icon}</span>
                            <span className="text-sm font-bold text-gray-800">
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
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white rounded-lg px-3 py-2 z-20 whitespace-nowrap"
                          >
                            <div className="text-xs">
                              <div className="font-semibold text-sm mb-1">{city.name}</div>
                              <div>👥 {city.users}명의 미식가</div>
                              <div>🍽️ {city.restaurants}개 맛집</div>
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
      
      {/* 빠른 선택 - 인기 지역 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-xs font-semibold text-gray-500 mb-2">🔥 인기 지역</h5>
        <div className="flex flex-wrap gap-2">
          {['강남/서초', '마포/홍대', '부산 해운대', '제주시', '강릉'].map((cityName) => {
            const city = regions.flatMap(r => r.cities).find(c => c.name === cityName);
            if (!city) return null;
            
            return (
              <button
                key={cityName}
                onClick={() => onCitySelect(city)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                {city.icon} {cityName}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* 하단 통계 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {regions.reduce((sum, r) => sum + r.cities.reduce((s, c) => s + c.users, 0), 0)}
            </div>
            <div className="text-xs text-gray-500">총 미식가</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {regions.reduce((sum, r) => sum + r.cities.reduce((s, c) => s + c.restaurants, 0), 0)}
            </div>
            <div className="text-xs text-gray-500">총 맛집</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">
              {regions.reduce((sum, r) => sum + r.cities.length, 0)}
            </div>
            <div className="text-xs text-gray-500">지역 수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoreaMap;