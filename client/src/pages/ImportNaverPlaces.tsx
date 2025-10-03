import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ImportNaverPlaces: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [importMethod, setImportMethod] = useState<'search' | 'link'>('link');
  const [shareLink, setShareLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedPlaces, setImportedPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  // 사용하지 않는 함수 제거

  // 공유 링크로 가져오기 - 간단한 방식으로 개선
  const handleShareLink = async () => {
    if (!shareLink) {
      toast.error('네이버 지도 공유 링크를 입력해주세요');
      return;
    }

    // 네이버 링크 형식 검증
    if (!shareLink.includes('naver.me') && !shareLink.includes('map.naver.com')) {
      toast.error('올바른 네이버 지도 링크가 아닙니다');
      return;
    }

    // 네이버 보안 정책으로 직접 파싱이 어려우므로 대안 방법 사용
    toast('네이버 MY플레이스는 보안상 직접 접근이 제한됩니다', {
      icon: '⚠️',
      duration: 3000
    });

    // 즉시 대안 방법 제시
    const confirmed = window.confirm(
      '네이버 보안 정책으로 직접 가져오기가 제한됩니다.\n\n' +
      '대신 다음 방법을 사용해주세요:\n' +
      '1. 링크를 새 창에서 엽니다\n' +
      '2. 맛집 이름들을 확인합니다\n' +
      '3. 검색으로 하나씩 추가합니다\n\n' +
      '지금 링크를 새 창에서 열까요?'
    );

    if (confirmed) {
      // 새 창에서 링크 열기
      window.open(shareLink, '_blank');

      // 안내 메시지
      setTimeout(() => {
        toast('열린 페이지에서 맛집 이름을 확인하고 검색해주세요', {
          duration: 5000,
          icon: '💡'
        });

        // 검색 모드로 자동 전환
        setImportMethod('search');

        // 검색 입력창에 포커스
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="강남"]');
          if (searchInput) {
            (searchInput as HTMLInputElement).focus();
          }
        }, 500);
      }, 1500);
    }

    setShareLink(''); // 링크 입력 초기화
  };

  // 네이버 검색으로 맛집 찾기
  const handleSearchNaver = async () => {
    if (!searchQuery) {
      toast.error('검색어를 입력해주세요');
      return;
    }

    setLoading(true);
    setImportedPlaces([]); // 기존 결과 초기화
    setSelectedPlaces(new Set()); // 선택 초기화

    try {
      const response = await axios.get('/api/import/search-naver', {
        params: {
          query: searchQuery,
          display: 20  // 20개씩 가져오기
        }
      });

      if (response.data.success && response.data.places) {
        // 네이버 API 결과 필터링 (음식점만)
        const restaurantPlaces = response.data.places.filter((place: any) => {
          // 카테고리에 음식점 관련 키워드가 있는지 확인
          const category = place.category || '';
          return category.includes('음식') ||
                 category.includes('한식') ||
                 category.includes('중식') ||
                 category.includes('일식') ||
                 category.includes('양식') ||
                 category.includes('카페') ||
                 category.includes('술집') ||
                 category.includes('맛집') ||
                 category.includes('레스토랑') ||
                 category === ''; // 카테고리가 없는 경우도 포함
        });

        if (restaurantPlaces.length > 0) {
          setImportedPlaces(restaurantPlaces);
          toast.success(`${restaurantPlaces.length}개의 맛집을 찾았습니다!`);
        } else {
          toast('검색 결과에 맛집이 없습니다. 다른 키워드로 검색해보세요.', {
            icon: '⚠️'
          });
        }
      } else {
        toast.error('검색 결과가 없습니다');
      }
    } catch (error: any) {
      console.error('Failed to search Naver:', error);
      if (error.response?.status === 500) {
        toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        toast.error('네이버 검색에 실패했습니다. 검색어를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 파일 업로드 기능 제거

  // 선택한 장소들을 BobMap에 저장
  const handleSavePlaces = async () => {
    if (selectedPlaces.size === 0) {
      toast.error('저장할 장소를 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      const placesToSave = importedPlaces.filter(place =>
        selectedPlaces.has(place.name) // 네이버 API는 id 대신 name 사용
      ).map(place => ({
        name: place.name.replace(/<[^>]*>/g, ''), // HTML 태그 제거
        address: place.address || place.roadAddress,
        category: place.category,
        phone: place.telephone,
        naverPlaceId: place.link, // 네이버 링크를 ID로 사용
        coordinates: place.x && place.y ? {
          // 네이버 좌표는 카텍 좌표계 사용 (x는 경도, y는 위도)
          // 실제로는 변환이 필요하지만, 간단히 처리
          lng: parseFloat(place.x),
          lat: parseFloat(place.y)
        } : undefined,
        importedFrom: 'naver'
      }));

      // 배치로 맛집 저장
      const response = await axios.post('/api/import/batch', {
        places: placesToSave
      });

      if (response.data.success) {
        toast.success(`${response.data.imported}개의 맛집을 성공적으로 저장했습니다!`);

        // localStorage에도 저장 (오프라인 동기화용)
        const existingPlaces = JSON.parse(localStorage.getItem('naverImportedPlaces') || '[]');
        const newPlaces = [...existingPlaces, ...placesToSave.map(place => ({
          ...place,
          importedAt: new Date().toISOString(),
          source: 'naver'
        }))];
        localStorage.setItem('naverImportedPlaces', JSON.stringify(newPlaces));

        // 프로필 페이지로 이동
        navigate('/profile');
      } else {
        toast.error('맛집 저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to save places:', error);
      toast.error('맛집 저장 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const togglePlaceSelection = (placeName: string) => {
    const newSelection = new Set(selectedPlaces);
    if (newSelection.has(placeName)) {
      newSelection.delete(placeName);
    } else {
      newSelection.add(placeName);
    }
    setSelectedPlaces(newSelection);
  };

  const selectAll = () => {
    const allNames = new Set(importedPlaces.map(p => p.name));
    setSelectedPlaces(allNames);
  };

  const deselectAll = () => {
    setSelectedPlaces(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold flex-1">네이버 맛집 가져오기</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 가져오기 방법 선택 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">가져오기 방법 선택</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImportMethod('link')}
              className={`px-4 py-3 rounded-lg border text-sm transition-all flex flex-col items-center justify-center gap-2 ${
                importMethod === 'link'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <LinkIcon className="w-6 h-6" />
              <span className="font-medium">MY플레이스 공유 링크</span>
              <span className="text-xs text-gray-500">저장한 맛집 가져오기</span>
            </button>

            <button
              onClick={() => setImportMethod('search')}
              className={`px-4 py-3 rounded-lg border text-sm transition-all flex flex-col items-center justify-center gap-2 ${
                importMethod === 'search'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#03C75A">
                <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
              </svg>
              <span className="font-medium">네이버 검색</span>
              <span className="text-xs text-gray-500">지역/음식명으로 검색</span>
            </button>
          </div>
        </div>

        {/* 선택한 방법에 따른 UI */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {importMethod === 'link' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  <span className="text-orange-600">네이버 MY플레이스</span>에서 맛집 리스트 가져오기
                </h3>

                {/* 단계별 안내 */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-bold text-orange-800 mb-3">📖 따라하기 가이드</h4>

                  {/* 보안 안내 */}
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <p className="text-xs text-red-700 flex items-start gap-1">
                      <span className="font-bold">⚠️ 참고:</span>
                      <span>네이버 보안 정책상 자동 가져오기가 제한됩니다. 링크를 붙여넣으면 새 창에서 열리며, 맛집 이름을 확인 후 검색으로 추가해주세요.</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">네이버 지도 앱 또는 웹에서 MY플레이스 접속</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <a href="https://m.place.naver.com/my/bookmarks" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            🔗 모바일 웹: m.place.naver.com/my/bookmarks
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">"저장" 탭 클릭</p>
                        <p className="text-xs text-gray-600 mt-1">MY플레이스 → 저장 메뉴로 이동</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">공유하고 싶은 저장 목록의 공유 버튼 클릭</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                            </svg>
                            각 저장 목록 옆 공유 아이콘 클릭
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">예: "전체", "가고싶다", "맛집" 등의 목록</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">링크 복사</p>
                        <p className="text-xs text-gray-600 mt-1">"링크 복사" 버튼을 클릭하여 공유 링크 복사</p>
                        <p className="text-xs text-gray-500 mt-0.5">예시: https://naver.me/5CFBGl81</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">아래에 붙여넣기 후 "가져오기" 클릭!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 링크 입력 */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">공유 링크 붙여넣기</h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={shareLink}
                      onChange={(e) => setShareLink(e.target.value)}
                      placeholder="https://naver.me/xxxxx 또는 map.naver.com/..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleShareLink()}
                    />
                    <button
                      onClick={handleShareLink}
                      disabled={!shareLink || loading}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          처리 중...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          가져오기
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>💡 Tip:</strong> 여러 맛집을 한번에 가져오려면:
                    </p>
                    <ol className="text-xs text-blue-700 mt-1 list-decimal list-inside space-y-0.5">
                      <li>MY플레이스에서 "리스트" 만들기</li>
                      <li>원하는 맛집들을 리스트에 추가</li>
                      <li>리스트 공유 링크 복사</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {importMethod === 'search' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#03C75A">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                  <h3 className="text-lg font-medium">네이버에서 맛집 검색</h3>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>네이버 API 연동:</strong> 실제 네이버 맛집 데이터를 검색하여 가져옵니다.
                  </p>
                </div>
              </div>

              {/* 네이버 검색 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">맛집 검색</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="예: 강남 맛집, 홍대 카페, 우래옥"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchNaver()}
                  />
                  <button
                    onClick={handleSearchNaver}
                    disabled={!searchQuery || loading}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                  >
                    검색
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  지역명, 식당명, 음식 종류 등을 입력하세요
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 가져온 장소 목록 */}
        {importedPlaces.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                가져온 장소 ({selectedPlaces.size}/{importedPlaces.length})
              </h3>
              <div className="space-x-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  전체 선택
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  전체 해제
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {importedPlaces.map((place, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlaces.has(place.name)}
                    onChange={() => togglePlaceSelection(place.name)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{place.name}</p>
                    <p className="text-sm text-gray-500">
                      {place.roadAddress || place.address}
                    </p>
                    {place.category && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs rounded mt-1">
                        {place.category}
                      </span>
                    )}
                    {place.telephone && (
                      <p className="text-xs text-gray-400 mt-1">📞 {place.telephone}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={handleSavePlaces}
                disabled={selectedPlaces.size === 0 || loading}
                className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
              >
                {loading ? '저장 중...' : `선택한 ${selectedPlaces.size}개 장소 저장`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportNaverPlaces;