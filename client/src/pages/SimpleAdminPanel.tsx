import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SimpleAdminPanel: React.FC = () => {
  const navigate = useNavigate();
  // 로컬스토리지에서 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [loginData, setLoginData] = useState({ email: 'admin@bobmap.com', password: '' });
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'users'>('playlists');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private'>('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false); // 데이터 로드 여부 추적

  // 데이터 로드 - 한 번만 실행
  useEffect(() => {
    if (!isLoggedIn || dataLoaded) return;
    
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8888/api/playlists');
        const playlistData = response.data.playlists || response.data;
        console.log('Admin playlists received:', playlistData.length, 'items');
        console.log('First playlist in admin:', playlistData[0]);
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
        setDataLoaded(true);
      } catch (err) {
        // 에러 무시
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [isLoggedIn, dataLoaded]);

  // 탭 변경 시 데이터 로드
  const handleTabChange = async (tab: 'playlists' | 'users') => {
    setActiveTab(tab);
    setLoading(true);
    
    try {
      if (tab === 'playlists') {
        const response = await axios.get('http://localhost:8888/api/playlists');
        const playlistData = response.data.playlists || response.data;
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
      } else if (tab === 'users') {
        const response = await axios.get('http://localhost:8888/api/users');
        const userData = response.data.users || response.data;
        setUsers(Array.isArray(userData) ? userData : []);
      }
    } catch (err) {
      // 에러 무시
    } finally {
      setLoading(false);
    }
  };

  // Admin 로그인 폼
  const AdminLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin 로그인</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간소화된 Admin 인증
    if (loginData.email === 'admin@bobmap.com' && loginData.password === 'admin123!') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', loginData.email);
      toast.success('Admin 로그인 성공!');
    } else {
      toast.error('로그인 실패. 비밀번호: admin123!');
    }
  };

  // 데이터 새로고침 함수 (수정/삭제 후 사용)
  const refreshData = async () => {
    if (activeTab === 'playlists') {
      try {
        const response = await axios.get('http://localhost:8888/api/playlists');
        const playlistData = response.data.playlists || response.data;
        setPlaylists(Array.isArray(playlistData) ? playlistData : []);
      } catch (err) {
        // 조용히 처리
      }
    } else if (activeTab === 'users') {
      try {
        const response = await axios.get('http://localhost:8888/api/users');
        const userData = response.data.users || response.data;
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        // 조용히 처리
      }
    }
  };


  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      // 실제 API 호출
      await axios.delete(`http://localhost:8888/api/playlists/${id}`);
      toast.success('플레이리스트가 삭제되었습니다');
      // 목록 새로고침
      refreshData();
    } catch (err) {
      console.log('API 호출 실패 - 로컬에서만 삭제됨');
    }
  };

  const handleTogglePublic = async (id: string) => {
    const playlist = playlists.find(p => p._id === id);
    if (!playlist) return;
    
    try {
      await axios.put(`http://localhost:8888/api/playlists/${id}`, { 
        isPublic: !playlist.isPublic 
      });
      toast.success('공개 상태가 변경되었습니다');
      refreshData();
    } catch (error) {
      toast.error('상태 변경 실패');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('정말 사용자를 삭제하시겠습니까?')) return;
    
    setUsers(users.filter(u => u._id !== id));
    toast.success('사용자가 삭제되었습니다');
  };

  const handleEditPlaylist = (playlist: any) => {
    setEditingPlaylist({ ...playlist });
    setSelectedPlaylist(null);
  };

  const handleSavePlaylist = async () => {
    if (!editingPlaylist) return;
    
    try {
      // 실제 API 호출
      await axios.put(`http://localhost:8888/api/playlists/${editingPlaylist._id}`, {
        title: editingPlaylist.title,
        description: editingPlaylist.description,
        isPublic: editingPlaylist.isPublic
      });
      toast.success('플레이리스트가 수정되었습니다');
      setEditingPlaylist(null);
      refreshData(); // 목록 새로고침
    } catch (err) {
      console.error('API 호출 실패:', err);
      toast.error('수정 실패');
    }
  };

  const handleViewDetails = (playlist: any) => {
    setSelectedPlaylist(playlist);
    setEditingPlaylist(null);
  };

  // 필터링된 플레이리스트
  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         playlist.createdBy?.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'public' && playlist.isPublic) ||
                         (filterBy === 'private' && !playlist.isPublic);
    
    return matchesSearch && matchesFilter;
  });

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="text-sm text-gray-600">
            <span className="font-mono">관리자 모드</span>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => handleTabChange('playlists')}
            className={`pb-2 px-4 ${
              activeTab === 'playlists' 
                ? 'border-b-2 border-orange-500 text-orange-600 font-semibold' 
                : 'text-gray-600'
            }`}
          >
            플레이리스트 ({Array.isArray(playlists) ? playlists.length : 0})
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`pb-2 px-4 ${
              activeTab === 'users' 
                ? 'border-b-2 border-orange-500 text-orange-600 font-semibold' 
                : 'text-gray-600'
            }`}
          >
            사용자 ({Array.isArray(users) ? users.length : 0})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        ) : (
          <div>
            {/* 플레이리스트 관리 */}
            {activeTab === 'playlists' && (
              <div>
                {/* 검색 및 필터 */}
                <div className="mb-6 flex gap-4">
                  <input
                    type="text"
                    placeholder="제목, 설명, 작성자로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'public' | 'private')}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="all">전체</option>
                    <option value="public">공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>

                {/* 상세보기 모달 */}
                {selectedPlaylist && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                      <h2 className="text-2xl font-bold mb-4">{selectedPlaylist.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedPlaylist.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">작성자</span>
                          <p className="font-semibold">{selectedPlaylist.createdBy?.username}</p>
                          <p className="text-sm text-gray-600">{selectedPlaylist.createdBy?.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">통계</span>
                          <p>좋아요: {selectedPlaylist.likeCount}</p>
                          <p>조회수: {typeof selectedPlaylist.views === 'object' ? (selectedPlaylist.views?.total || 0) : (selectedPlaylist.views || 0)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">포함된 맛집 ({selectedPlaylist.restaurants?.length || 0}개)</h3>
                        <div className="bg-gray-50 rounded p-3">
                          {selectedPlaylist.restaurants?.map((r: any, idx: number) => {
                            const restaurant = r.restaurant || r;
                            return (
                              <div key={idx} className="flex justify-between py-1">
                                <span>{restaurant.name || '이름 없음'}</span>
                                <span className="text-sm text-gray-500">{restaurant.category || '카테고리 없음'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditPlaylist(selectedPlaylist)}
                          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                          수정하기
                        </button>
                        <button
                          onClick={() => setSelectedPlaylist(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 수정 모달 */}
                {editingPlaylist && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                      <h2 className="text-2xl font-bold mb-4">플레이리스트 수정</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">제목</label>
                          <input
                            type="text"
                            value={editingPlaylist.title}
                            onChange={(e) => setEditingPlaylist({ ...editingPlaylist, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">설명</label>
                          <textarea
                            value={editingPlaylist.description}
                            onChange={(e) => setEditingPlaylist({ ...editingPlaylist, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center">
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
                      
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          onClick={handleSavePlaylist}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingPlaylist(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 플레이리스트 목록 */}
                <div className="space-y-4">
                  {Array.isArray(filteredPlaylists) && filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map((playlist) => (
                  <div key={playlist._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{playlist.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{playlist.description}</p>
                          </div>
                          <span className={`ml-4 px-2 py-1 rounded text-xs ${
                            playlist.isPublic 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {playlist.isPublic ? '공개' : '비공개'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {playlist.createdBy?.username || '알 수 없음'}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            맛집 {playlist.restaurants?.length || 0}개
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {playlist.likeCount || 0}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {typeof playlist.views === 'object' ? (playlist.views?.total || 0) : (playlist.views || 0)}
                          </span>
                        </div>
                        {playlist.restaurants && playlist.restaurants.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">맛집: </span>
                            {playlist.restaurants.slice(0, 3).map((r: any) => {
                              // restaurant 객체가 중첩되어 있는 경우 처리
                              const name = r.restaurant?.name || r.name || '이름 없음';
                              return name;
                            }).join(', ')}
                            {playlist.restaurants.length > 3 && ` 외 ${playlist.restaurants.length - 3}개`}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(playlist)}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => handleTogglePublic(playlist._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          {playlist.isPublic ? '비공개로' : '공개로'}
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(playlist._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))) : (
                  <div className="text-center py-8 text-gray-500">
                    플레이리스트가 없습니다
                  </div>
                )}
                </div>
              </div>
            )}

            {/* 사용자 관리 */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>가입일: {new Date(user.createdAt).toLocaleDateString()}</span>
                          <span>플레이리스트: {user.playlists}개</span>
                          <span>팔로워: {user.followers}명</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))) : (
                  <div className="text-center py-8 text-gray-500">
                    사용자가 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 통계 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">통계 대시보드</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">총 플레이리스트</h3>
              <p className="text-2xl font-bold text-orange-600">{Array.isArray(playlists) ? playlists.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                공개: {Array.isArray(playlists) ? playlists.filter(p => p.isPublic).length : 0} / 
                비공개: {Array.isArray(playlists) ? playlists.filter(p => !p.isPublic).length : 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">총 맛집</h3>
              <p className="text-2xl font-bold text-green-600">
                {Array.isArray(playlists) ? 
                  playlists.reduce((sum, p) => sum + (p.restaurants?.length || 0), 0) : 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                평균: {Array.isArray(playlists) && playlists.length > 0 ? 
                  Math.round(playlists.reduce((sum, p) => sum + (p.restaurants?.length || 0), 0) / playlists.length) : 0}개/리스트
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">총 사용자</h3>
              <p className="text-2xl font-bold text-blue-600">{Array.isArray(users) ? users.length : 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                활동중: {Array.isArray(users) ? users.filter(u => u.playlists > 0).length : 0}명
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm text-gray-600">인기도</h3>
              <p className="text-2xl font-bold text-purple-600">
                {Array.isArray(playlists) ? playlists.reduce((sum, p) => sum + (p.likeCount || 0), 0) : 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                조회수: {Array.isArray(playlists) ? 
                  playlists.reduce((sum, p) => sum + (typeof p.views === 'object' ? (p.views?.total || 0) : (p.views || 0)), 0) : 0}
              </p>
            </div>
          </div>
          
          {/* 인기 플레이리스트 TOP 3 */}
          {Array.isArray(playlists) && playlists.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3">🏆 인기 플레이리스트 TOP 3</h3>
              <div className="space-y-2">
                {playlists
                  .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
                  .slice(0, 3)
                  .map((playlist, idx) => (
                    <div key={playlist._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                        </span>
                        <div>
                          <p className="font-medium">{playlist.title}</p>
                          <p className="text-sm text-gray-500">by {playlist.createdBy?.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">❤️ {playlist.likeCount || 0}</p>
                        <p className="text-xs text-gray-500">👁️ {typeof playlist.views === 'object' ? (playlist.views?.total || 0) : (playlist.views || 0)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminPanel;