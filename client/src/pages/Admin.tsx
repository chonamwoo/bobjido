import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { certifiedRestaurantLists } from '../data/certifiedRestaurantLists_fixed';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: '',
    category: '미디어 인증',
    certification: '',
    restaurants: []
  });

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    // 로컬 스토리지에서 커스텀 플레이리스트 가져오기
    const customLists = localStorage.getItem('adminPlaylists');
    if (customLists) {
      setPlaylists(JSON.parse(customLists));
    } else {
      // 초기 데이터로 certifiedRestaurantLists 사용
      setPlaylists([...certifiedRestaurantLists]);
      localStorage.setItem('adminPlaylists', JSON.stringify(certifiedRestaurantLists));
    }
  };

  const savePlaylists = (updatedPlaylists: any[]) => {
    setPlaylists(updatedPlaylists);
    localStorage.setItem('adminPlaylists', JSON.stringify(updatedPlaylists));
    toast.success('변경사항이 저장되었습니다!');
  };

  const handleEdit = (playlist: any) => {
    setEditingId(playlist._id);
    setEditForm({
      ...playlist,
      restaurantNames: playlist.restaurants.map((r: any) => 
        r.restaurant?.name || r.name || ''
      ).join(', ')
    });
  };

  const handleSaveEdit = () => {
    const updatedPlaylists = playlists.map(p => {
      if (p._id === editingId) {
        // restaurantNames를 파싱해서 restaurants 배열로 변환
        const restaurantNames = editForm.restaurantNames
          .split(',')
          .map((name: string) => name.trim())
          .filter((name: string) => name);
        
        const restaurants = restaurantNames.map((name: string, index: number) => ({
          restaurant: {
            _id: `rest-${Date.now()}-${index}`,
            name: name,
            category: '한식',
            address: '서울특별시',
            rating: 4.5
          },
          personalNote: '',
          mustTry: []
        }));

        return {
          ...p,
          ...editForm,
          restaurants,
          restaurantCount: restaurants.length,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    
    savePlaylists(updatedPlaylists);
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 플레이리스트를 삭제하시겠습니까?')) {
      const updatedPlaylists = playlists.filter(p => p._id !== id);
      savePlaylists(updatedPlaylists);
    }
  };

  const handleAddPlaylist = () => {
    const restaurantNames = newPlaylist.restaurants
      .map((name: any) => typeof name === 'string' ? name.trim() : '')
      .filter((name: string) => name);
    
    const restaurants = restaurantNames.map((name: string, index: number) => ({
      restaurant: {
        _id: `rest-new-${Date.now()}-${index}`,
        name: name,
        category: '한식',
        address: '서울특별시',
        rating: 4.5
      },
      personalNote: '',
      mustTry: []
    }));

    const playlist = {
      _id: `playlist-${Date.now()}`,
      title: newPlaylist.title,
      description: newPlaylist.description,
      category: newPlaylist.category,
      certification: newPlaylist.certification,
      createdBy: {
        _id: 'admin',
        username: 'Admin',
        isVerified: true
      },
      restaurants,
      restaurantCount: restaurants.length,
      tags: [],
      likeCount: 0,
      saveCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      isPublic: true
    };

    const updatedPlaylists = [...playlists, playlist];
    savePlaylists(updatedPlaylists);
    
    setShowAddForm(false);
    setNewPlaylist({
      title: '',
      description: '',
      category: '미디어 인증',
      certification: '',
      restaurants: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold">관리자 페이지</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              <PlusIcon className="w-5 h-5" />
              새 플레이리스트
            </button>
          </div>
        </div>

        {/* 새 플레이리스트 추가 폼 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">새 플레이리스트 추가</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="제목"
                value={newPlaylist.title}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                placeholder="설명"
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="인증 프로그램 (예: 흑백요리사)"
                value={newPlaylist.certification}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, certification: e.target.value })}
                className="w-full p-2 border rounded-lg"
              />
              <textarea
                placeholder="맛집 이름들 (쉼표로 구분)"
                value={newPlaylist.restaurants.join(', ')}
                onChange={(e) => setNewPlaylist({ 
                  ...newPlaylist, 
                  restaurants: e.target.value.split(',').map(s => s.trim()) as any
                })}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddPlaylist}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewPlaylist({
                      title: '',
                      description: '',
                      category: '미디어 인증',
                      certification: '',
                      restaurants: []
                    });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 플레이리스트 목록 */}
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="bg-white rounded-lg shadow-sm p-6">
              {editingId === playlist._id ? (
                // 편집 모드
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2 border rounded-lg font-bold text-lg"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={editForm.certification}
                    onChange={(e) => setEditForm({ ...editForm, certification: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="인증 프로그램"
                  />
                  <textarea
                    value={editForm.restaurantNames}
                    onChange={(e) => setEditForm({ ...editForm, restaurantNames: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="맛집 이름들 (쉼표로 구분)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditForm({});
                      }}
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                // 보기 모드
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{playlist.title}</h3>
                      <p className="text-gray-600 text-sm">{playlist.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(playlist)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(playlist._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {playlist.certification || playlist.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {playlist.restaurantCount || playlist.restaurants?.length || 0}개 맛집
                    </span>
                    <span className="text-xs text-gray-500">
                      ❤️ {playlist.likeCount || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      👁️ {playlist.viewCount || 0}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    맛집: {playlist.restaurants?.slice(0, 3).map((r: any) => 
                      r.restaurant?.name || r.name || '이름 없음'
                    ).join(', ')}
                    {playlist.restaurants?.length > 3 && ` 외 ${playlist.restaurants.length - 3}곳`}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;