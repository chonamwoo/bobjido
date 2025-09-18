import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../utils/adminAxios';
import toast from 'react-hot-toast';
import { 
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  verifiedAt: Date | null;
  verificationNote: string;
  createdAt: string;
  followers?: any[];
  following?: any[];
  savedRestaurants?: any[];
}

const AdminVerification: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [verificationNote, setVerificationNote] = useState('');

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
    } catch (error) {
      console.error('사용자 로드 실패:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await adminAxios.put(`/api/admin/users/${userId}/verify`, {
        isVerified,
        verificationNote: verificationNote || (isVerified ? '관리자 인증' : '인증 취소')
      });
      
      toast.success(isVerified ? '사용자가 인증되었습니다' : '인증이 취소되었습니다');
      loadUsers();
      setSelectedUser(null);
      setVerificationNote('');
    } catch (error) {
      console.error('인증 상태 변경 실패:', error);
      toast.error('인증 상태 변경에 실패했습니다');
    }
  };

  const handleMakeAdmin = async (userId: string, isAdmin: boolean) => {
    if (!window.confirm(isAdmin ? '이 사용자를 관리자로 설정하시겠습니까?' : '관리자 권한을 제거하시겠습니까?')) {
      return;
    }

    try {
      await adminAxios.put(`/api/admin/users/${userId}/admin`, { isAdmin });
      toast.success(isAdmin ? '관리자 권한이 부여되었습니다' : '관리자 권한이 제거되었습니다');
      loadUsers();
    } catch (error) {
      console.error('관리자 권한 변경 실패:', error);
      toast.error('관리자 권한 변경에 실패했습니다');
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (filter === 'verified') return user.isVerified;
      if (filter === 'unverified') return !user.isVerified;
      return true;
    })
    .filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold">사용자 인증 관리</h1>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              대시보드로 돌아가기
            </button>
          </div>

          {/* 필터 및 검색 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="사용자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'verified' | 'unverified')}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 사용자</option>
              <option value="verified">인증된 사용자</option>
              <option value="unverified">미인증 사용자</option>
            </select>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">전체 사용자</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">인증된 사용자</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.isVerified).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">관리자</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.isAdmin).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">인증률</p>
              <p className="text-2xl font-bold text-green-600">
                {users.length > 0 
                  ? Math.round((users.filter(u => u.isVerified).length / users.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          {/* 사용자 목록 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">사용자</th>
                  <th className="text-left py-3 px-4">이메일</th>
                  <th className="text-center py-3 px-4">상태</th>
                  <th className="text-center py-3 px-4">팔로워</th>
                  <th className="text-center py-3 px-4">가입일</th>
                  <th className="text-center py-3 px-4">인증일</th>
                  <th className="text-center py-3 px-4">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.username[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{user.username}</span>
                            {user.isVerified && (
                              <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                            )}
                            {user.isAdmin && (
                              <ShieldCheckIcon className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.email || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.isVerified 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isVerified ? (
                          <>
                            <CheckCircleIcon className="w-3 h-3" />
                            인증됨
                          </>
                        ) : (
                          '미인증'
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {user.followers?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {formatDate(user.verifiedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {!user.isVerified ? (
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                          >
                            인증하기
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyUser(user._id, false)}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                          >
                            인증취소
                          </button>
                        )}
                        <button
                          onClick={() => handleMakeAdmin(user._id, !user.isAdmin)}
                          className={`px-3 py-1 text-white text-sm rounded ${
                            user.isAdmin 
                              ? 'bg-purple-500 hover:bg-purple-600'
                              : 'bg-gray-400 hover:bg-gray-500'
                          }`}
                        >
                          {user.isAdmin ? '관리자 해제' : '관리자 설정'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 인증 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">사용자 인증</h3>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">{selectedUser.username}</span>님을 인증하시겠습니까?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                인증 사유 (선택)
              </label>
              <textarea
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="예: 유명 맛집 블로거, 푸드 인플루언서 등"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setVerificationNote('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={() => handleVerifyUser(selectedUser._id, true)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                인증
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;