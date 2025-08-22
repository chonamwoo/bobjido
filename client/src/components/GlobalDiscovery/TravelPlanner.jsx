import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axios';
import { 
  MapIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  UserGroupIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  HeartIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../common/LoadingSpinner';
import { getUserAvatar } from '../../utils/userAvatars';

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

const TravelPlanner = () => {
  const [destinations, setDestinations] = useState([{ country: '', city: '', dates: '' }]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('planner'); // planner, matching, following
  const [followedUsers, setFollowedUsers] = useState(new Set());

  const addDestination = () => {
    setDestinations([...destinations, { country: '', city: '', dates: '' }]);
  };

  const removeDestination = (index) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const updateDestination = (index, field, value) => {
    const updated = destinations.map((dest, i) => 
      i === index ? { ...dest, [field]: value } : dest
    );
    setDestinations(updated);
  };

  const getTravelRecommendations = async () => {
    const validDestinations = destinations.filter(dest => dest.country && dest.city);
    
    if (validDestinations.length === 0) {
      alert('최소 하나의 여행지를 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/global-discovery/travel-recommendations', {
        destinations: validDestinations
      });

      setRecommendations(response.data);
    } catch (error) {
      console.error('Error getting travel recommendations:', error);
      if (error.response?.status === 400) {
        alert('먼저 취향 진단을 완료해주세요!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <MapIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">글로벌 맛집 여행 플래너</h2>
            <p className="text-green-100">
              전세계 미식가들과 함께 만드는 맛집 여행 계획
            </p>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'planner' 
                ? 'bg-white text-teal-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <MapPinIcon className="w-4 h-4 inline mr-2" />
            여행 플래너
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'matching' 
                ? 'bg-white text-teal-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <UserGroupIcon className="w-4 h-4 inline mr-2" />
            현지 매칭
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'following' 
                ? 'bg-white text-teal-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <HeartIcon className="w-4 h-4 inline mr-2" />
            팔로잉
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 여행 플래너 탭 */}
        {activeTab === 'planner' && (
          <>
            {/* 여행지 입력 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                여행 일정 입력
              </h3>
              
              <div className="space-y-4">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 items-center bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-teal-100 text-teal-600 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="국가 (예: 일본, Japan, JP)"
                        value={destination.country}
                        onChange={(e) => updateDestination(index, 'country', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg">
                        {destination.country ? getFlag(destination.country) : '🌍'}
                      </span>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="도시 (예: 도쿄)"
                      value={destination.city}
                      onChange={(e) => updateDestination(index, 'city', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    <input
                      type="text"
                      placeholder="여행 날짜 (예: 3/15-3/20)"
                      value={destination.dates}
                      onChange={(e) => updateDestination(index, 'dates', e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    {destinations.length > 1 && (
                      <button
                        onClick={() => removeDestination(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={addDestination}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  여행지 추가
                </button>
                
                <button
                  onClick={getTravelRecommendations}
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  맞춤 추천 받기
                </button>
              </div>
            </div>

            {/* 추천 결과 */}
            {loading && (
              <div className="flex flex-col items-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">
                  여행지별 맞춤 추천을 준비하고 있습니다...
                </p>
              </div>
            )}

            {recommendations && (
              <div className="space-y-8">
                {/* 사용자 취향 요약 */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-purple-500" />
                    당신의 취향 프로필
                  </h3>
                  
                  {recommendations.userTasteProfile?.topTypes && (
                    <div className="flex gap-2">
                      {recommendations.userTasteProfile.topTypes.map(type => (
                        <span
                          key={type.tasteType}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {type.emoji} {type.typeKoreanName} ({type.percentage.toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 여행지별 추천 */}
                {recommendations.travelRecommendations?.map((travel, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">{getFlag(travel.destination.country)}</span>
                        {travel.destination.city}, {travel.destination.country}
                        {travel.destination.dates && (
                          <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                            <CalendarIcon className="w-4 h-4 inline mr-1" />
                            {travel.destination.dates}
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="p-6">
                      {travel.experts && travel.experts.length > 0 ? (
                        <div className="space-y-6">
                          {/* 현지 미식가 매칭 */}
                          <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <UserGroupIcon className="w-5 h-5" />
                              매칭된 현지 미식가 {travel.experts.length}명
                            </h4>
                            <p className="text-sm text-blue-700">
                              당신과 취향이 비슷한 현지 미식가들이 추천하는 맛집입니다
                            </p>
                          </div>

                          {travel.experts.map((expert, expertIdx) => (
                            <div key={expertIdx} className="border-l-4 border-teal-400 pl-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={expert.localExpert.profileImage || getUserAvatar(expert.localExpert.username)}
                                    alt={expert.localExpert.username}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {expert.localExpert.username}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-gray-600">
                                        <MapPinIcon className="w-4 h-4 inline" />
                                        {travel.destination.city} 거주
                                      </span>
                                      <span className="text-purple-600 font-medium">
                                        취향 {expert.matchPercentage || 85}% 일치
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* 팔로우 & 채팅 버튼 */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleFollow(expert.localExpert._id)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                      followedUsers.has(expert.localExpert._id)
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                  >
                                    {followedUsers.has(expert.localExpert._id) ? (
                                      <>
                                        <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                                        팔로잉
                                      </>
                                    ) : (
                                      <>
                                        <UserPlusIcon className="w-4 h-4 inline mr-1" />
                                        팔로우
                                      </>
                                    )}
                                  </button>
                                  <button className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200 transition-all">
                                    <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
                                    채팅
                                  </button>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {expert.recommendations.map((rec, recIdx) => (
                                  <div
                                    key={recIdx}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                  >
                                    <h5 className="font-semibold text-gray-900 mb-1">
                                      {rec.restaurant?.name}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {rec.restaurant?.category} · {rec.restaurant?.address}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2 italic">
                                      "{rec.description}"
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {rec.tags?.map(tag => (
                                        <span
                                          key={tag}
                                          className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600">
                            {travel.destination.city}에서는 아직 매칭된 로컬 전문가가 없습니다
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            다른 여행자들이 추천을 등록하면 알려드릴게요!
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 현지 매칭 탭 */}
        {activeTab === 'matching' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                해외 미식가 매칭
              </h3>
              <p className="text-gray-600 mb-4">
                여행지의 현지 미식가들과 직접 소통하며 진짜 로컬 맛집을 발견하세요
              </p>

              {/* 매칭된 사용자 목록 */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  { name: 'Takeshi', country: '일본', city: '도쿄', match: 92, tags: ['라멘', '스시', '이자카야'] },
                  { name: 'Marie', country: '프랑스', city: '파리', match: 88, tags: ['비스트로', '와인', '디저트'] },
                  { name: 'Marco', country: '이탈리아', city: '로마', match: 85, tags: ['파스타', '피자', '젤라또'] },
                  { name: 'Linda', country: '미국', city: '뉴욕', match: 83, tags: ['버거', '스테이크', '브런치'] },
                ].map((user, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getUserAvatar(user.name)}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">
                            {getFlag(user.country)} {user.city}, {user.country}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">{user.match}%</div>
                        <div className="text-xs text-gray-500">취향 일치</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {user.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all">
                        <UserPlusIcon className="w-4 h-4 inline mr-1" />
                        팔로우
                      </button>
                      <button className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-200 transition-all">
                        <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
                        대화하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 팔로잉 탭 */}
        {activeTab === 'following' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-pink-500" />
                팔로잉 중인 해외 미식가
              </h3>
              <p className="text-gray-600 mb-4">
                취향이 비슷한 전세계 미식가들의 맛집 리스트를 실시간으로 받아보세요
              </p>

              {/* 팔로잉 리스트 */}
              <div className="space-y-4">
                {[
                  { name: 'Takeshi', country: '일본', city: '도쿄', lastUpdate: '2시간 전', newPosts: 3 },
                  { name: 'Marie', country: '프랑스', city: '파리', lastUpdate: '어제', newPosts: 5 },
                  { name: 'Marco', country: '이탈리아', city: '로마', lastUpdate: '3일 전', newPosts: 2 },
                ].map((user, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={getUserAvatar(user.name)}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {user.name}
                            <span className="ml-2 text-sm font-normal text-gray-500">
                              {getFlag(user.country)} {user.city}
                            </span>
                          </h4>
                          <p className="text-sm text-gray-600">
                            마지막 업데이트: {user.lastUpdate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {user.newPosts > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                            새 포스트 {user.newPosts}
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <HeartSolidIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  더 많은 미식가 찾기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPlanner;