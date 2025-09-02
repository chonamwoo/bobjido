import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';
import PlaylistCard from '../components/PlaylistCard';
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  FireIcon,
  SparklesIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface FilterState {
  category: string;
  city: string;
  district: string;
  tags: string;
  sortBy: string;
}

const Discover: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    city: '',
    district: '',
    tags: '',
    sortBy: 'createdAt',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // URL 파라미터로부터 초기 필터 설정
  useEffect(() => {
    const theme = searchParams.get('theme');
    const type = searchParams.get('type');
    
    if (theme) {
      setFilters(prev => ({
        ...prev,
        tags: theme,
        category: theme
      }));
      setShowFilters(true);
    }
    
    if (type === 'recommended') {
      setFilters(prev => ({
        ...prev,
        sortBy: 'likeCount'
      }));
    }
  }, [searchParams]);

  const { data: playlistsData, isLoading } = useQuery({
    queryKey: ['playlists', 'discover', filters, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.district) params.append('district', filters.district);
      if (filters.tags) params.append('tags', filters.tags);
      if (searchQuery) params.append('search', searchQuery);
      params.append('sortBy', filters.sortBy);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await axios.get(`/api/playlists?${params.toString()}`);
      return response.data;
    },
  });

  const { data: trendingPlaylists } = useQuery({
    queryKey: ['playlists', 'trending'],
    queryFn: async () => {
      const response = await axios.get('/api/playlists/trending?limit=6');
      return response.data;
    },
  });

  const categories = [
    '데이트코스', '혼밥', '가족모임', '친구모임', 
    '출장/여행', '회식', '카페투어', '맛집투어', '기타'
  ];

  const cities = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시',
    '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
    '경기도', '강원도', '충청북도', '충청남도', '전라북도',
    '전라남도', '경상북도', '경상남도', '제주특별자치도'
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      city: '',
      district: '',
      tags: '',
      sortBy: 'createdAt',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">맛집리스트 디스커버</h1>
        <p className="text-gray-600">전국의 다양한 맛집 맛집리스트를 탐색해보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* 검색창 */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="맛집리스트 제목이나 설명을 검색하세요..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 필터 토글 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center space-x-2"
          >
            <FunnelIcon className="w-5 h-5" />
            <span>필터</span>
          </button>

          {/* 정렬 */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="createdAt">최신순</option>
            <option value="viewCount">인기순</option>
            <option value="likeCount">좋아요순</option>
            <option value="saveCount">저장순</option>
          </select>
        </div>

        {/* 필터 섹션 */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">전체</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">전체</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  태그
                </label>
                <input
                  type="text"
                  value={filters.tags}
                  onChange={(e) => handleFilterChange('tags', e.target.value)}
                  placeholder="예: 데이트, 분위기"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full btn btn-outline"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 트렌딩 섹션 */}
      {!searchQuery && !Object.values(filters).some(v => v !== '' && v !== 'createdAt') && (
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <FireIcon className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">🔥 지금 뜨는 맛집리스트</h2>
          </div>
          
          {trendingPlaylists && trendingPlaylists.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPlaylists.map((playlist: any) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 트렌딩 맛집리스트가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 메인 맛집리스트 목록 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold">
              {searchQuery || Object.values(filters).some(v => v !== '' && v !== 'createdAt')
                ? '검색 결과'
                : '모든 맛집리스트'}
            </h2>
          </div>
          
          {playlistsData?.pagination && (
            <div className="text-sm text-gray-500">
              총 {playlistsData.pagination.total.toLocaleString()}개
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-200"></div>
            ))}
          </div>
        ) : playlistsData?.playlists?.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlistsData.playlists.map((playlist: any) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {playlistsData.pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    이전
                  </button>
                  
                  {[...Array(Math.min(5, playlistsData.pagination.pages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(playlistsData.pagination.pages, currentPage + 1))}
                    disabled={currentPage === playlistsData.pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-400 mb-6">
              다른 키워드로 검색하거나 필터를 조정해보세요
            </p>
            <button
              onClick={resetFilters}
              className="btn btn-primary"
            >
              전체 맛집리스트 보기
            </button>
          </div>
        )}
      </div>

      {/* 사용법 안내 */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 사용법</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <div>
              <p className="font-medium text-gray-900">검색 & 필터</p>
              <p className="text-gray-600">원하는 테마나 지역으로 맛집리스트를 찾아보세요</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <div>
              <p className="font-medium text-gray-900">리스트 탐색</p>
              <p className="text-gray-600">다른 사용자들이 만든 맛집리스트를 둘러보세요</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <div>
              <p className="font-medium text-gray-900">저장 & 공유</p>
              <p className="text-gray-600">마음에 드는 리스트는 저장하고 친구들과 공유하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;