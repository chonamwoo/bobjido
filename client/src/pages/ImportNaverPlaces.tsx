import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const ImportNaverPlaces: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [importMethod, setImportMethod] = useState<'link' | 'oauth' | 'file'>('link');
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedPlaces, setImportedPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  // 네이버 로그인으로 가져오기
  const handleNaverOAuth = () => {
    // 네이버 OAuth 로그인 시작
    window.location.href = 'http://localhost:8888/api/auth/naver';
  };

  // 공유 링크로 가져오기 (데모)
  const handleShareLink = async () => {
    if (!shareLink) {
      toast.error('네이버 지도 공유 링크를 입력해주세요');
      return;
    }

    setLoading(true);

    // 데모 데이터 생성
    setTimeout(() => {
      const demoPlaces = [
        { id: 'naver-1', name: '성북동 빵공장', category: '베이커리', address: '서울 성북구 성북동 1-2', rating: 4.5 },
        { id: 'naver-2', name: '우래옥', category: '한식', address: '서울 중구 창경궁로 62-29', rating: 4.3 },
        { id: 'naver-3', name: '광화문 국밥', category: '한식', address: '서울 종로구 종로 1-1', rating: 4.7 },
        { id: 'naver-4', name: '교대 이층집', category: '일식', address: '서울 서초구 서초대로 320', rating: 4.6 },
        { id: 'naver-5', name: '을지로 골뱅이', category: '술집', address: '서울 중구 을지로 157', rating: 4.4 }
      ];

      setImportedPlaces(demoPlaces);
      toast.success('네이버 지도에서 5개의 맛집을 가져왔습니다!');
      setLoading(false);
    }, 1500);
  };

  // CSV/JSON 파일로 가져오기
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        // CSV 또는 JSON 파싱
        let places = [];
        if (file.name.endsWith('.json')) {
          places = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // CSV 파싱 로직
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          places = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj: any, header, index) => {
              obj[header.trim()] = values[index]?.trim();
              return obj;
            }, {});
          });
        }
        
        setImportedPlaces(places);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Failed to parse file:', error);
      alert('파일을 읽는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 선택한 장소들을 BobMap에 저장 (데모)
  const handleSavePlaces = async () => {
    if (selectedPlaces.size === 0) {
      toast.error('저장할 장소를 선택해주세요.');
      return;
    }

    setLoading(true);

    // 데모: localStorage에 저장
    setTimeout(() => {
      const placesToSave = importedPlaces.filter(place =>
        selectedPlaces.has(place.id || place.name)
      );

      // 기존 저장된 네이버 맛집 가져오기
      const existingPlaces = JSON.parse(localStorage.getItem('naverImportedPlaces') || '[]');

      // 새로운 맛집 추가
      const newPlaces = [...existingPlaces, ...placesToSave.map(place => ({
        ...place,
        importedAt: new Date().toISOString(),
        source: 'naver'
      }))];

      localStorage.setItem('naverImportedPlaces', JSON.stringify(newPlaces));

      toast.success(`${placesToSave.length}개의 맛집을 성공적으로 저장했습니다!`);
      setLoading(false);

      // 프로필 페이지로 이동
      navigate('/profile');
    }, 1000);
  };

  const togglePlaceSelection = (placeId: string) => {
    const newSelection = new Set(selectedPlaces);
    if (newSelection.has(placeId)) {
      newSelection.delete(placeId);
    } else {
      newSelection.add(placeId);
    }
    setSelectedPlaces(newSelection);
  };

  const selectAll = () => {
    const allIds = new Set(importedPlaces.map(p => p.id || p.name));
    setSelectedPlaces(allIds);
  };

  const deselectAll = () => {
    setSelectedPlaces(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">네이버 MY플레이스 가져오기</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 가져오기 방법 선택 - 작은 버튼 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">가져오기 방법</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setImportMethod('link')}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                importMethod === 'link'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              공유 링크
            </button>

            <button
              onClick={() => setImportMethod('oauth')}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                importMethod === 'oauth'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <MapPinIcon className="w-4 h-4" />
              네이버 로그인
            </button>

            <button
              onClick={() => setImportMethod('file')}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                importMethod === 'file'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <CloudArrowUpIcon className="w-4 h-4" />
              파일 업로드
            </button>
          </div>
        </div>

        {/* 선택한 방법에 따른 UI */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {importMethod === 'oauth' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white">
                  <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">네이버 로그인으로 MY플레이스 가져오기</h3>
              <p className="text-gray-600 mb-6">
                네이버 계정으로 로그인하여 저장한 맛집을 가져옵니다
              </p>
              <button
                onClick={handleNaverOAuth}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                네이버 로그인
              </button>
            </div>
          )}

          {importMethod === 'link' && (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#03C75A">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                  <h3 className="text-lg font-medium">MY플레이스 공유 링크 입력</h3>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>테스트 모드:</strong> 아무 링크나 입력하시면 예시 맛집 5개가 표시됩니다.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  onChange={(e) => setShareLink(e.target.value)}
                  placeholder="https://naver.me/xxxxx 또는 아무 텍스트나 입력"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleShareLink}
                  disabled={!shareLink || loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
                >
                  가져오기
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                네이버 MY플레이스 → 공유 → 링크 복사
              </p>
            </div>
          )}

          {importMethod === 'file' && (
            <div>
              <h3 className="text-lg font-medium mb-4">파일 업로드</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">CSV 또는 JSON 파일을 선택하세요</p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer transition-colors"
                >
                  파일 선택
                </label>
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
                    checked={selectedPlaces.has(place.id || place.name)}
                    onChange={() => togglePlaceSelection(place.id || place.name)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{place.name || place.title}</p>
                    <p className="text-sm text-gray-500">
                      {place.address || place.roadAddress}
                    </p>
                    {place.category && (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs rounded mt-1">
                        {place.category}
                      </span>
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