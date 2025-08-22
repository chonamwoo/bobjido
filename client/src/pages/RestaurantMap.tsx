import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import KoreanMap from '../components/KoreanMap';
import { MagnifyingGlassIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Restaurant } from '../types';
import { mockRestaurants, searchRestaurants } from '../data/mockRestaurants';

const RestaurantMap: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 필터링된 레스토랑 데이터
  const restaurants = useMemo(() => {
    if (!searchKeyword) return mockRestaurants;
    return searchRestaurants(searchKeyword);
  }, [searchKeyword]);
  
  const isLoading = false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchKeyword(searchInput.trim());
      
      // 검색 기록 추가 (중복 제거)
      const newHistory = [searchInput.trim(), ...searchHistory.filter(item => item !== searchInput.trim())].slice(0, 5);
      setSearchHistory(newHistory);
    }
  };

  const handleRestaurantClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const quickSearches = ['치킨', '피자', '한식', '중식', '일식', '카페', '디저트', '회', '고기', '라면'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
            🗺️ 실시간 맛집 지도
          </h1>
          <p className="text-gray-600 text-lg">근처 맛집을 실시간으로 찾아보세요</p>
        </div>

        {/* 검색 섹션 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="맛집을 검색해보세요 (예: 강남 삼겹살)"
                className="w-full px-6 py-4 text-lg border-2 border-primary-200 rounded-2xl focus:border-primary-400 focus:outline-none shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-white p-3 rounded-xl hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 shadow-lg"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* 빠른 검색 버튼들 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {quickSearches.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchInput(keyword);
                  setSearchKeyword(keyword);
                }}
                className="px-4 py-2 bg-white border border-primary-200 rounded-full text-primary-600 hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {keyword}
              </button>
            ))}
          </div>

          {/* 검색 기록 */}
          {searchHistory.length > 0 && (
            <div className="max-w-2xl mx-auto mt-4">
              <p className="text-sm text-gray-500 mb-2">최근 검색:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((history, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchInput(history);
                      setSearchKeyword(history);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {history}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 지도와 정보 섹션 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <KoreanMap
                restaurants={restaurants}
                onRestaurantClick={handleRestaurantClick}
                className="w-full h-[600px]"
              />
            </div>
          </div>

          {/* 선택된 식당 정보 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 h-[600px] overflow-y-auto">
              {selectedRestaurant ? (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold text-primary-600 mb-4 flex items-center">
                    <MapPinIcon className="w-6 h-6 mr-2" />
                    {selectedRestaurant.name}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-primary-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500 mb-1">카테고리</p>
                      <p className="font-semibold text-primary-700">{selectedRestaurant.category}</p>
                    </div>

                    <div className="bg-secondary-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-500 mb-1">주소</p>
                      <p className="font-medium text-gray-700">{selectedRestaurant.address}</p>
                    </div>

                    {selectedRestaurant.phoneNumber && (
                      <div className="bg-accent-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500 mb-1">전화번호</p>
                        <p className="font-medium text-gray-700 flex items-center">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          {selectedRestaurant.phoneNumber}
                        </p>
                      </div>
                    )}

                    {selectedRestaurant.averageRating && selectedRestaurant.averageRating > 0 && (
                      <div className="bg-warm-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500 mb-1">평점</p>
                        <p className="font-bold text-warm-600 text-lg">
                          ⭐ {selectedRestaurant.averageRating}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 bg-gradient-to-r from-primary-400 to-secondary-400 text-white py-3 rounded-2xl font-semibold hover:from-primary-500 hover:to-secondary-500 transition-all duration-300 shadow-lg">
                        플레이리스트에 추가
                      </button>
                      <button className="px-4 py-3 border-2 border-primary-300 text-primary-600 rounded-2xl font-semibold hover:bg-primary-50 transition-all duration-300">
                        📞
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="animate-pulse">
                    <div className="w-24 h-24 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-12 h-12 text-primary-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">맛집을 검색해보세요</h3>
                    <p className="text-gray-500">지도에서 마커를 클릭하면<br />상세 정보를 확인할 수 있어요</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="mt-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">🎯 사용법</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">1. 검색하기</h4>
              <p className="text-gray-600">원하는 음식이나 지역을 검색하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl">📍</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">2. 선택하기</h4>
              <p className="text-gray-600">지도의 마커를 클릭해서 식당 정보를 확인하세요</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">3. 저장하기</h4>
              <p className="text-gray-600">마음에 드는 식당을 플레이리스트에 추가하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;