import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import {
  UsersIcon,
  DocumentDuplicateIcon,
  MapPinIcon,
  ChartBarIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'playlists' | 'restaurants' | 'stats'>('playlists');
  interface AdminData {
    users: any[];
    playlists: any[];
    restaurants: any[];
    stats: any;
  }
  
  const [data, setData] = useState<AdminData>({
    users: [],
    playlists: [],
    restaurants: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    // Admin 권한 체크
    if (!user || user.email !== 'admin@bobmap.com') {
      toast.error('Admin 권한이 필요합니다');
      navigate('/');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersRes = await axios.get('/api/users');
          setData((prev: AdminData) => ({ ...prev, users: usersRes.data }));
          break;
        case 'playlists':
          const playlistsRes = await axios.get('/api/playlists');
          setData((prev: AdminData) => ({ ...prev, playlists: playlistsRes.data }));
          break;
        case 'restaurants':
          const restaurantsRes = await axios.get('/api/restaurants');
          setData((prev: AdminData) => ({ ...prev, restaurants: restaurantsRes.data }));
          break;
        case 'stats':
          // 통계 데이터 가져오기
          const statsRes = await axios.get('/api/admin/stats');
          setData((prev: AdminData) => ({ ...prev, stats: statsRes.data }));
          break;
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      toast.error('데이터를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await axios.delete(`/api/${type}/${id}`);
      toast.success('삭제되었습니다');
      fetchData();
    } catch (error) {
      toast.error('삭제 실패');
    }
  };

  const handleEdit = async (type: string, id: string, updates: any) => {
    try {
      await axios.put(`/api/${type}/${id}`, updates);
      toast.success('수정되었습니다');
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error('수정 실패');
    }
  };

  const handleTogglePublic = async (playlistId: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/playlists/${playlistId}`, { isPublic: !currentStatus });
      toast.success(currentStatus ? '비공개로 전환됨' : '공개로 전환됨');
      fetchData();
    } catch (error) {
      toast.error('상태 변경 실패');
    }
  };

  const renderPlaylists = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">플레이리스트 관리</h2>
      {data.playlists.map((playlist: any) => (
        <div key={playlist._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {editingItem?.id === playlist._id ? (
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="text-lg font-semibold border-b-2 border-orange-400 outline-none"
                />
              ) : (
                <h3 className="text-lg font-semibold">{playlist.title}</h3>
              )}
              <p className="text-sm text-gray-600 mt-1">{playlist.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>작성자: {playlist.createdBy?.username || '알 수 없음'}</span>
                <span>맛집: {playlist.restaurants?.length || 0}개</span>
                <span>좋아요: {playlist.likeCount || 0}</span>
                <span className={`px-2 py-1 rounded ${playlist.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {playlist.isPublic ? '공개' : '비공개'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {editingItem?.id === playlist._id ? (
                <>
                  <button
                    onClick={() => handleEdit('playlists', playlist._id, { title: editingItem.title })}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleTogglePublic(playlist._id, playlist.isPublic)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingItem({ id: playlist._id, title: playlist.title })}
                    className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('playlists', playlist._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">사용자 관리</h2>
      {data.users.map((user: any) => (
        <div key={user._id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>가입일: {new Date(user.createdAt).toLocaleDateString()}</span>
                <span>플레이리스트: {user.playlists?.length || 0}개</span>
                <span>팔로워: {user.followers?.length || 0}명</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete('users', user._id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">통계</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-600">총 사용자</h3>
          <p className="text-2xl font-bold text-orange-600">{data.stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-600">총 플레이리스트</h3>
          <p className="text-2xl font-bold text-blue-600">{data.stats.totalPlaylists || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-600">총 맛집</h3>
          <p className="text-2xl font-bold text-green-600">{data.stats.totalRestaurants || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm text-gray-600">오늘 가입자</h3>
          <p className="text-2xl font-bold text-purple-600">{data.stats.todaySignups || 0}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === 'playlists' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'
            }`}
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
            플레이리스트
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === 'users' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            사용자
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === 'stats' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            통계
          </button>
        </div>

        {/* 컨텐츠 */}
        {activeTab === 'playlists' && renderPlaylists()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'stats' && renderStats()}
      </div>
    </div>
  );
};

export default AdminPanel;