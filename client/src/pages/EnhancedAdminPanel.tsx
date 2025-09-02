import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminAxios from '../utils/adminAxios';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface Restaurant {
  _id?: string;
  name: string;
  address: string;
  category: string;
  priceRange: string;
  coordinates?: { lat: number; lng: number };
  images?: any[];
  source?: string;
  exists?: boolean;
}

interface PlaylistRestaurant {
  restaurant: Restaurant | string;
  order: number;
  mustTry?: string[];
  _id?: string;
}

const EnhancedAdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return !!token && (token.startsWith('admin-token-') || token.startsWith('ey'));
  });
  const [loginData, setLoginData] = useState({ email: 'admin@bobmap.com', password: '' });
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [originalPlaylist, setOriginalPlaylist] = useState<any>(null); // 백업용
  const [searchingRestaurant, setSearchingRestaurant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [undoHistory, setUndoHistory] = useState<any[]>([]); // 실행 취소 기록

  // 컴포넌트 마운트 시 adminAxios 헤더 설정
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      adminAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
      adminAxios.defaults.headers['X-Admin-Auth'] = 'true';
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || dataLoaded) return;
    
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const response = await adminAxios.get('/api/playlists');
        const playlistData = response.data.playlists || response.data;
        console.log('Loaded playlists:', playlistData);
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
        setDataLoaded(true);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [isLoggedIn, dataLoaded]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginData.password === 'admin123!') {
      const token = 'admin-token-' + Date.now();
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminToken', token);
      
      // adminAxios 헤더 업데이트
      adminAxios.defaults.headers['Authorization'] = `Bearer ${token}`;
      adminAxios.defaults.headers['X-Admin-Auth'] = 'true';
      
      alert('관리자 로그인 성공');
      setDataLoaded(false); // 데이터 다시 로드
    } else {
      alert('비밀번호가 틀렸습니다');
    }
  };

  const refreshData = async () => {
    try {
      const response = await adminAxios.get('/api/playlists');
      const playlistData = response.data.playlists || response.data;
      setPlaylists(Array.isArray(playlistData) ? playlistData : []);
      alert('데이터를 새로고침했습니다');
    } catch (err) {
      console.error('Failed to refresh:', err);
      alert('새로고침 실패');
    }
  };

  const handleEditPlaylist = async (playlist: any) => {
    // 플레이리스트 상세 정보 가져오기
    try {
      const response = await adminAxios.get(`/api/playlists/${playlist._id}`);
      const playlistData = response.data;
      setEditingPlaylist(JSON.parse(JSON.stringify(playlistData))); // Deep copy
      setOriginalPlaylist(JSON.parse(JSON.stringify(playlistData))); // 백업 저장
    } catch (err) {
      console.error('Failed to fetch playlist details:', err);
      alert('플레이리스트 정보를 불러올 수 없습니다');
    }
  };

  const handleSavePlaylist = async () => {
    if (!editingPlaylist) return;
    
    try {
      // 실행 취소 기록 저장
      setUndoHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        playlistId: editingPlaylist._id,
        originalData: originalPlaylist,
        action: 'edit'
      }]);
      
      // restaurants 배열 정리 (ID만 전송) - 빈 배열 처리
      const cleanRestaurants = (editingPlaylist.restaurants || []).map((item: any, index: number) => ({
        restaurant: item.restaurant?._id || item.restaurant || item._id,
        order: item.order !== undefined ? item.order : index,
        mustTry: item.mustTry || []
      }));
      
      await adminAxios.put(
        `/api/admin/playlists/${editingPlaylist._id}`,
        {
          title: editingPlaylist.title || editingPlaylist.name || '',
          name: editingPlaylist.title || editingPlaylist.name || '', // 둘 다 전송
          description: editingPlaylist.description || '',
          isPublic: editingPlaylist.isPublic !== undefined ? editingPlaylist.isPublic : true,
          restaurants: cleanRestaurants
        }
      );
      alert('플레이리스트가 수정되었습니다');
      setEditingPlaylist(null);
      setOriginalPlaylist(null);
      refreshData();
    } catch (err: any) {
      console.error('Save failed:', err);
      alert('수정 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까? (Admin 권한 필요)')) return;
    
    try {
      // 삭제 전 백업
      const playlist = playlists.find(p => p._id === id);
      if (playlist) {
        setUndoHistory(prev => [...prev, {
          timestamp: new Date().toISOString(),
          playlistId: id,
          originalData: playlist,
          action: 'delete'
        }]);
      }
      
      await adminAxios.delete(`/api/admin/playlists/${id}`);
      alert('플레이리스트가 삭제되었습니다');
      refreshData();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert('삭제 실패: ' + (err.response?.data?.message || 'Admin 권한이 필요합니다'));
    }
  };

  const searchRestaurants = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchingRestaurant(true);
    try {
      const response = await adminAxios.get('/api/admin/restaurants/search', {
        params: { query: searchQuery }
      });
      
      const formattedResults = response.data.map((item: any) => ({
        _id: item._id,
        name: item.name,
        address: item.address,
        category: item.category,
        priceRange: item.price || item.priceRange || '보통',
        coordinates: item.coordinates,
        images: item.images,
        source: item.source,
        exists: item.exists
      }));
      
      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Search failed:', err);
      alert('검색 실패');
    } finally {
      setSearchingRestaurant(false);
    }
  };

  const addRestaurantToPlaylist = async (restaurant: Restaurant) => {
    if (!editingPlaylist) return;
    
    try {
      let restaurantToAdd = restaurant;
      
      // If restaurant doesn't exist in DB, create it first
      if (!restaurant._id || restaurant.source !== 'database') {
        const createResponse = await adminAxios.post(
          '/api/admin/restaurants/create',
          restaurant
        );
        restaurantToAdd = createResponse.data;
      }
      
      const newRestaurant: PlaylistRestaurant = {
        restaurant: restaurantToAdd._id || restaurantToAdd,
        order: editingPlaylist.restaurants ? editingPlaylist.restaurants.length : 0,
        mustTry: []
      };
      
      setEditingPlaylist({
        ...editingPlaylist,
        restaurants: [...(editingPlaylist.restaurants || []), newRestaurant],
        restaurantDetails: {
          ...(editingPlaylist.restaurantDetails || {}),
          [restaurantToAdd._id || '']: restaurantToAdd
        }
      });
      
      alert(`${restaurant.name}을(를) 추가했습니다`);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err: any) {
      console.error('Failed to add restaurant:', err);
      const errorMsg = err.response?.data?.errors?.join(', ') || 
                       err.response?.data?.message || 
                       err.response?.data?.error || 
                       '레스토랑 추가 실패';
      alert(`레스토랑 추가 실패: ${errorMsg}`);
    }
  };

  const removeRestaurantFromPlaylist = (index: number) => {
    if (!editingPlaylist) return;
    
    const updatedRestaurants = editingPlaylist.restaurants.filter((_: any, i: number) => i !== index);
    setEditingPlaylist({
      ...editingPlaylist,
      restaurants: updatedRestaurants
    });
    
    alert('레스토랑을 삭제했습니다');
  };

  const moveRestaurant = (index: number, direction: 'up' | 'down') => {
    if (!editingPlaylist || !editingPlaylist.restaurants) return;
    
    const restaurants = [...editingPlaylist.restaurants];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= restaurants.length) return;
    
    // Swap restaurants
    [restaurants[index], restaurants[newIndex]] = [restaurants[newIndex], restaurants[index]];
    
    // Update order values
    restaurants.forEach((r, i) => {
      r.order = i;
    });
    
    setEditingPlaylist({
      ...editingPlaylist,
      restaurants
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
          <h1 className="text-2xl font-bold mb-6">관리자 로그인</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 실행 취소 기능
  const handleUndo = async () => {
    if (undoHistory.length === 0) {
      alert('실행 취소할 작업이 없습니다');
      return;
    }
    
    const lastAction = undoHistory[undoHistory.length - 1];
    
    if (!window.confirm(`"${lastAction.action}" 작업을 취소하시겠습니까?`)) return;
    
    try {
      if (lastAction.action === 'edit') {
        // 이전 상태로 복원
        await adminAxios.put(
          `/api/admin/playlists/${lastAction.playlistId}`,
          lastAction.originalData
        );
        alert('변경사항이 복원되었습니다');
      } else if (lastAction.action === 'delete') {
        // 삭제된 플레이리스트 복원 - 새로 생성
        alert('삭제된 플레이리스트 복원은 아직 구현되지 않았습니다');
      }
      
      // 마지막 기록 제거
      setUndoHistory(prev => prev.slice(0, -1));
      refreshData();
    } catch (err) {
      console.error('Undo failed:', err);
      alert('실행 취소 실패');
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminToken');
      
      // adminAxios 헤더 제거
      delete adminAxios.defaults.headers['Authorization'];
      delete adminAxios.defaults.headers['X-Admin-Auth'];
      
      setIsLoggedIn(false);
      setDataLoaded(false);
      setPlaylists([]);
      setEditingPlaylist(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">플레이리스트 관리</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ← 대시보드로 돌아가기
          </button>
        </div>
        <div className="flex gap-2">
          {undoHistory.length > 0 && (
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              title={`마지막 작업: ${undoHistory[undoHistory.length - 1].action}`}
            >
              ↶ 실행취소 ({undoHistory.length})
            </button>
          )}
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새로고침
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-bold text-lg mb-2">{playlist.title || playlist.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
                <div className="text-sm text-gray-500 mb-3">
                  <span>맛집 {playlist.restaurants?.length || 0}개</span>
                  {playlist.isPublic && <span className="ml-2 text-green-600">공개</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPlaylist(playlist)}
                    className="flex-1 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    <PencilIcon className="w-4 h-4 inline mr-1" />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Edit Modal */}
      {editingPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">플레이리스트 수정</h2>
              <button
                onClick={() => setEditingPlaylist(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">제목</label>
                  <input
                    type="text"
                    value={editingPlaylist.title || editingPlaylist.name || ''}
                    onChange={(e) => setEditingPlaylist({ 
                      ...editingPlaylist, 
                      title: e.target.value,
                      name: e.target.value  // 둘 다 업데이트
                    })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={editingPlaylist.isPublic}
                      onChange={(e) => setEditingPlaylist({ ...editingPlaylist, isPublic: e.target.checked })}
                      className="mr-2"
                    />
                    공개 플레이리스트
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  value={editingPlaylist.description}
                  onChange={(e) => setEditingPlaylist({ ...editingPlaylist, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                />
              </div>

              {/* Restaurant List */}
              <div>
                <h3 className="text-lg font-semibold mb-2">레스토랑 목록</h3>
                <div className="space-y-2 mb-4">
                  {editingPlaylist.restaurants?.map((item: any, index: number) => {
                    const restaurant = item.restaurant || item;
                    return (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{index + 1}.</span>
                        <BuildingStorefrontIcon className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="text-sm text-gray-600">{restaurant.address}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveRestaurant(index, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveRestaurant(index, 'down')}
                            disabled={index === editingPlaylist.restaurants.length - 1}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => removeRestaurantFromPlaylist(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Restaurant Search */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">레스토랑 추가</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchRestaurants()}
                      placeholder="레스토랑 이름 검색 (예: 스시조, 정식당)"
                      className="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                      onClick={searchRestaurants}
                      disabled={searchingRestaurant}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {searchingRestaurant ? '검색중...' : '검색'}
                    </button>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                      {searchResults.map((restaurant, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50">
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-gray-600">{restaurant.address}</div>
                          </div>
                          <button
                            onClick={() => addRestaurantToPlaylist(restaurant)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  if (window.confirm('변경사항을 취소하시겠습니까?')) {
                    setEditingPlaylist(null);
                    setOriginalPlaylist(null);
                  }
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                취소
              </button>
              {originalPlaylist && (
                <button
                  onClick={() => {
                    if (window.confirm('원래 상태로 되돌리시겠습니까?')) {
                      setEditingPlaylist(JSON.parse(JSON.stringify(originalPlaylist)));
                    }
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  원래대로
                </button>
              )}
              <button
                onClick={handleSavePlaylist}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminPanel;