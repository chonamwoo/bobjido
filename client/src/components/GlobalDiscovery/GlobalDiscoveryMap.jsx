import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axios';
import { 
  GlobeAltIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon,
  LanguageIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

// 국가별 국기 이모지 매핑
const countryFlags = {
  'Japan': '🇯🇵',
  'JP': '🇯🇵',
  '일본': '🇯🇵',
  'Korea': '🇰🇷',
  'KR': '🇰🇷',
  '한국': '🇰🇷',
  'USA': '🇺🇸',
  'US': '🇺🇸',
  'United States': '🇺🇸',
  '미국': '🇺🇸',
  'France': '🇫🇷',
  'FR': '🇫🇷',
  '프랑스': '🇫🇷',
  'UK': '🇬🇧',
  'GB': '🇬🇧',
  'United Kingdom': '🇬🇧',
  '영국': '🇬🇧',
  'Italy': '🇮🇹',
  'IT': '🇮🇹',
  '이탈리아': '🇮🇹',
  'Spain': '🇪🇸',
  'ES': '🇪🇸',
  '스페인': '🇪🇸',
  'China': '🇨🇳',
  'CN': '🇨🇳',
  '중국': '🇨🇳',
  'Thailand': '🇹🇭',
  'TH': '🇹🇭',
  '태국': '🇹🇭',
  'Singapore': '🇸🇬',
  'SG': '🇸🇬',
  '싱가포르': '🇸🇬',
  'Australia': '🇦🇺',
  'AU': '🇦🇺',
  '호주': '🇦🇺',
  'Netherlands': '🇳🇱',
  'NL': '🇳🇱',
  '네덜란드': '🇳🇱',
  'UAE': '🇦🇪',
  'AE': '🇦🇪',
  '아랍에미리트': '🇦🇪',
  'Germany': '🇩🇪',
  'DE': '🇩🇪',
  '독일': '🇩🇪',
  'Canada': '🇨🇦',
  'CA': '🇨🇦',
  '캐나다': '🇨🇦',
  'Brazil': '🇧🇷',
  'BR': '🇧🇷',
  '브라질': '🇧🇷',
  'India': '🇮🇳',
  'IN': '🇮🇳',
  '인도': '🇮🇳',
  'Mexico': '🇲🇽',
  'MX': '🇲🇽',
  '멕시코': '🇲🇽',
  'Russia': '🇷🇺',
  'RU': '🇷🇺',
  '러시아': '🇷🇺',
  'Vietnam': '🇻🇳',
  'VN': '🇻🇳',
  '베트남': '🇻🇳'
};

// 국가 코드나 이름으로 국기 가져오기
const getFlag = (country) => {
  if (!country) return '🌍';
  return countryFlags[country] || 
         countryFlags[country.toUpperCase()] || 
         countryFlags[country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()] ||
         '🌍';
};

const GlobalDiscoveryMap = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);

  const popularDestinations = [
    { name: '도쿄, 일본', country: 'Japan', city: '도쿄', flag: '🇯🇵' },
    { name: '뉴욕, 미국', country: 'USA', city: '뉴욕', flag: '🇺🇸' },
    { name: '파리, 프랑스', country: 'France', city: '파리', flag: '🇫🇷' },
    { name: '방콕, 태국', country: 'Thailand', city: '방콕', flag: '🇹🇭' },
    { name: '런던, 영국', country: 'UK', city: '런던', flag: '🇬🇧' },
    { name: '시드니, 호주', country: 'Australia', city: '시드니', flag: '🇦🇺' },
    { name: '베이징, 중국', country: 'China', city: '베이징', flag: '🇨🇳' },
    { name: '로마, 이탈리아', country: 'Italy', city: '로마', flag: '🇮🇹' },
    { name: '싱가포르', country: 'Singapore', city: '싱가포르', flag: '🇸🇬' },
    { name: '두바이, UAE', country: 'UAE', city: '두바이', flag: '🇦🇪' },
    { name: '바르셀로나, 스페인', country: 'Spain', city: '바르셀로나', flag: '🇪🇸' },
    { name: '암스테르담, 네덜란드', country: 'Netherlands', city: '암스테르담', flag: '🇳🇱' }
  ];

  const discoverLocation = async (location) => {
    setLoading(true);
    setSelectedLocation(location);

    try {
      const response = await axiosInstance.get('/api/global-discovery/discover', {
        params: {
          country: location.country,
          city: location.city
        }
      });

      setMatchedUsers(response.data.matchedUsers || []);
      if (onLocationSelect) {
        onLocationSelect(location, response.data.matchedUsers);
      }
    } catch (error) {
      console.error('Error discovering location:', error);
      if (error.response?.status === 400) {
        alert('먼저 취향 진단을 완료해주세요!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <GlobeAltIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">전 세계 미식 탐험</h2>
            <p className="text-blue-100">
              여행지에서 같은 취향의 로컬 미식가들을 만나보세요
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 검색 바 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="도시나 국가를 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* 인기 여행지 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            🌍 인기 미식 여행지
          </h3>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularDestinations.map((destination, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => discoverLocation(destination)}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">{destination.flag}</div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                    {destination.city}
                  </div>
                  <div className="text-xs text-gray-500">
                    {destination.country}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="flex flex-col items-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">
              <span className="text-lg mr-1">{selectedLocation?.flag}</span>
              {selectedLocation?.name}에서 취향 맞는 친구들을 찾고 있습니다...
            </p>
          </div>
        )}

        {/* 매칭된 사용자들 */}
        {!loading && matchedUsers.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-blue-500" />
                <span className="text-xl">{selectedLocation?.flag}</span>
                {selectedLocation?.name}의 미식 친구들
              </h3>
              <span className="text-sm text-gray-500">
                {matchedUsers.length}명 발견
              </span>
            </div>

            <div className="space-y-4">
              {matchedUsers.slice(0, 6).map((match, idx) => (
                <motion.div
                  key={match.user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={match.user.profileImage || '/default-avatar.png'}
                      alt={match.user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {match.user.username}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                          match.compatibilityGrade === 'S' ? 'bg-purple-600' :
                          match.compatibilityGrade === 'A' ? 'bg-blue-600' :
                          match.compatibilityGrade === 'B' ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}>
                          {match.compatibilityGrade}
                        </span>
                        <span className="text-sm text-purple-600 font-semibold">
                          {match.compatibility}% 일치
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span className="text-lg">{getFlag(match.location.country)}</span>
                          {match.location.city}, {match.location.country}
                        </span>
                        {match.distance && (
                          <span>📍 {match.distance}km</span>
                        )}
                      </div>

                      {match.languages && match.languages.length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <LanguageIcon className="w-4 h-4 text-gray-400" />
                          <div className="flex gap-1">
                            {match.languages.map(lang => (
                              <span 
                                key={lang}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                              >
                                {lang.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {match.localRecommendations && match.localRecommendations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">로컬 추천 맛집</p>
                          <div className="flex gap-2">
                            {match.localRecommendations.slice(0, 2).map((rec, recIdx) => (
                              <div key={recIdx} className="flex-1 bg-gray-50 rounded p-2">
                                <div className="text-xs font-medium text-gray-900">
                                  {rec.restaurant?.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {rec.restaurant?.category}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">문화 모험심</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < match.culturalAdventure ? 'bg-orange-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-xs text-gray-500">사교성</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < match.socialLevel ? 'bg-green-400' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 btn btn-sm btn-outline">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      연결하기
                    </button>
                    <button className="flex-1 btn btn-sm btn-primary">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      추천 보기
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {matchedUsers.length > 6 && (
              <div className="text-center mt-6">
                <button className="btn btn-outline">
                  더 많은 친구 보기 (+{matchedUsers.length - 6}명)
                </button>
              </div>
            )}
          </div>
        )}

        {/* 결과 없음 */}
        {!loading && selectedLocation && matchedUsers.length === 0 && (
          <div className="text-center py-12">
            <GlobeAltIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <span className="text-xl mr-1">{selectedLocation.flag}</span>
              {selectedLocation.name}에서 매칭된 친구를 찾지 못했습니다
            </h3>
            <p className="text-gray-600">
              다른 여행지를 선택하거나 나중에 다시 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalDiscoveryMap;