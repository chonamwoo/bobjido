import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon, CloudArrowUpIcon, LinkIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import { useAuthStore } from '../store/authStore';

const ImportNaverPlaces: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [importMethod, setImportMethod] = useState<'oauth' | 'link' | 'file'>('oauth');
  const [shareLink, setShareLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [importedPlaces, setImportedPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<string>>(new Set());

  // 네이버 로그인으로 가져오기
  const handleNaverOAuth = () => {
    // 네이버 OAuth 로그인 URL
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_OAUTH_CLIENT_ID || 'YOUR_CLIENT_ID';
    const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/import/naver/callback`);
    const STATE = Math.random().toString(36).substring(7);
    
    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
    
    window.location.href = authUrl;
  };

  // 공유 링크로 가져오기
  const handleShareLink = async () => {
    if (!shareLink) return;
    
    setLoading(true);
    try {
      // 네이버 공유 링크 파싱
      const response = await axios.post('/api/import/naver-link', {
        shareLink
      });
      
      setImportedPlaces(response.data.places);
    } catch (error) {
      console.error('Failed to import from link:', error);
      alert('링크에서 장소를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  // 선택한 장소들을 BobMap에 저장
  const handleSavePlaces = async () => {
    if (selectedPlaces.size === 0) {
      alert('저장할 장소를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const placesToSave = importedPlaces.filter(place => 
        selectedPlaces.has(place.id || place.name)
      );

      const response = await axios.post('/api/restaurants/batch-import', {
        places: placesToSave.map(place => ({
          name: place.name || place.title,
          address: place.address || place.roadAddress,
          category: place.category || '맛집',
          naverPlaceId: place.id,
          coordinates: {
            lat: place.latitude || place.y,
            lng: place.longitude || place.x
          },
          phone: place.telephone,
          description: place.description,
          importedFrom: 'naver'
        }))
      });

      alert(`${response.data.imported}개의 장소를 성공적으로 가져왔습니다!`);
      navigate('/my-restaurants');
    } catch (error) {
      console.error('Failed to save places:', error);
      alert('장소 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
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
        {/* 가져오기 방법 선택 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">가져오기 방법 선택</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setImportMethod('oauth')}
              className={`p-4 rounded-lg border-2 transition-all ${
                importMethod === 'oauth' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <MapPinIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">네이버 로그인</p>
              <p className="text-sm text-gray-500 mt-1">
                네이버 계정으로 로그인하여 자동으로 가져오기
              </p>
            </button>

            <button
              onClick={() => setImportMethod('link')}
              className={`p-4 rounded-lg border-2 transition-all ${
                importMethod === 'link' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">공유 링크</p>
              <p className="text-sm text-gray-500 mt-1">
                MY플레이스 공유 링크로 가져오기
              </p>
            </button>

            <button
              onClick={() => setImportMethod('file')}
              className={`p-4 rounded-lg border-2 transition-all ${
                importMethod === 'file' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">파일 업로드</p>
              <p className="text-sm text-gray-500 mt-1">
                내보낸 CSV/JSON 파일 업로드
              </p>
            </button>
          </div>
        </div>

        {/* 선택한 방법에 따른 UI */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {importMethod === 'oauth' && (
            <div className="text-center py-8">
              <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">네이버 계정으로 로그인</h3>
              <p className="text-gray-600 mb-6">
                네이버 MY플레이스에 저장된 장소들을 자동으로 가져옵니다
              </p>
              <button
                onClick={handleNaverOAuth}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                네이버 로그인
              </button>
            </div>
          )}

          {importMethod === 'link' && (
            <div>
              <h3 className="text-lg font-medium mb-4">MY플레이스 공유 링크 입력</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  onChange={(e) => setShareLink(e.target.value)}
                  placeholder="https://naver.me/xxxxx"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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