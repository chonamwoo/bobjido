import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../utils/adminAxios';
import toast from 'react-hot-toast';
import { 
  UserIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  username: string;
  email: string;
  trustScore: number;
  isActive: boolean;
  createdAt: string;
  tasteProfile?: {
    tasteType: string;
  };
  stats?: {
    playlistCount: number;
    restaurantCount: number;
    followersCount: number;
  };
}

const AdminUserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!window.confirm(`이 사용자를 ${currentStatus ? '비활성화' : '활성화'} 하시겠습니까?`)) {
      return;
    }

    try {
      await adminAxios.put(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
      });
      toast.success(`사용자가 ${!currentStatus ? '활성화' : '비활성화'} 되었습니다`);
      loadUsers();
    } catch (error: any) {
      toast.error('상태 변경에 실패했습니다');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`정말로 "${username}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await adminAxios.delete(`/api/admin/users/${userId}`);
      toast.success('사용자가 삭제되었습니다');
      loadUsers();
    } catch (error: any) {
      toast.error('사용자 삭제에 실패했습니다');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: any = a[sortBy as keyof User];
    let bVal: any = b[sortBy as keyof User];
    
    if (sortBy === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">사용자 관리</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              ← 대시보드로 돌아가기
            </button>
          </div>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            새로고침
          </button>
        </div>
        
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="사용자 검색 (이름, 이메일)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="createdAt">가입일</option>
            <option value="username">이름</option>
            <option value="trustScore">신뢰도</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '오름차순 ↑' : '내림차순 ↓'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">사용자 목록 불러오는 중...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    취향 타입
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신뢰도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.tasteProfile?.tasteType || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.trustScore >= 80 ? 'bg-green-100 text-green-800' :
                        user.trustScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.trustScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isActive ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <CheckCircleIcon className="w-3 h-3" />
                          활성
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                          <XCircleIcon className="w-3 h-3" />
                          비활성
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        className={`${
                          user.isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        } mr-3`}
                      >
                        {user.isActive ? '비활성화' : '활성화'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.username)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;