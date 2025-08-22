import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalPlaylists: number;
  totalRestaurants: number;
  activeUsers: number;
  todaySignups: number;
  todayPlaylists: number;
}

interface RecentUser {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  trustScore: number;
}

interface RecentPlaylist {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  likeCount: number;
  saveCount: number;
  createdBy: {
    username: string;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPlaylists: 0,
    totalRestaurants: 0,
    activeUsers: 0,
    todaySignups: 0,
    todayPlaylists: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<RecentPlaylist[]>([]);

  // Admin axios 인스턴스 생성
  const adminAxios = axios.create({
    baseURL: 'http://localhost:8888',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      'Content-Type': 'application/json'
    }
  });

  // Admin 권한 체크
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (!adminToken || !adminData) {
      navigate('/admin/login');
      toast.error('관리자 로그인이 필요합니다');
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/api/admin/dashboard');
      
      if (response.data) {
        setStats(response.data.stats || {
          totalUsers: 0,
          totalPlaylists: 0,
          totalRestaurants: 0,
          activeUsers: 0,
          todaySignups: 0,
          todayPlaylists: 0,
        });
        setRecentUsers(response.data.recentUsers || []);
        setRecentPlaylists(response.data.recentPlaylists || []);
      }
    } catch (error: any) {
      console.error('Dashboard load error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin/login');
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else {
        toast.error('대시보드 데이터를 불러오는데 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
    toast.success('로그아웃되었습니다');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <BuildingStorefrontIcon className="w-7 h-7 text-white" />
              </div>
              BobMap 관리자 대시보드
            </h1>
            <p className="text-gray-400 mt-2">
              서비스 현황을 한눈에 확인하세요
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            로그아웃
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <UserGroupIcon className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            <p className="text-sm text-gray-400">전체 사용자</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <DocumentDuplicateIcon className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.totalPlaylists}</p>
            <p className="text-sm text-gray-400">플레이리스트</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <BuildingStorefrontIcon className="w-8 h-8 text-orange-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.totalRestaurants}</p>
            <p className="text-sm text-gray-400">등록 맛집</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <ChartBarIcon className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
            <p className="text-sm text-gray-400">주간 활성</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <ClockIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.todaySignups}</p>
            <p className="text-sm text-gray-400">오늘 가입</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <DocumentDuplicateIcon className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-3xl font-bold text-white">{stats.todayPlaylists}</p>
            <p className="text-sm text-gray-400">오늘 생성</p>
          </motion.div>
        </div>

        {/* 최근 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최근 가입 사용자 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-6 h-6 text-blue-400" />
              최근 가입 사용자
            </h2>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{formatDate(user.createdAt)}</p>
                      <p className="text-xs text-yellow-400">신뢰도: {user.trustScore}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">최근 가입한 사용자가 없습니다</p>
              )}
            </div>
          </motion.div>

          {/* 최근 플레이리스트 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DocumentDuplicateIcon className="w-6 h-6 text-green-400" />
              최근 플레이리스트
            </h2>
            <div className="space-y-3">
              {recentPlaylists.length > 0 ? (
                recentPlaylists.map((playlist) => (
                  <div key={playlist._id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{playlist.title}</p>
                      <p className="text-sm text-gray-400">
                        {playlist.category} · by {playlist.createdBy?.username || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{formatDate(playlist.createdAt)}</p>
                      <div className="flex gap-2 text-xs">
                        <span className="text-red-400">♥ {playlist.likeCount}</span>
                        <span className="text-blue-400">⭐ {playlist.saveCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">최근 생성된 플레이리스트가 없습니다</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* 빠른 액션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => toast('사용자 관리 기능은 준비 중입니다', { icon: 'ℹ️' })}
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all transform hover:scale-105"
          >
            <UserGroupIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">사용자 관리</p>
          </button>

          <button
            onClick={() => toast('플레이리스트 관리 기능은 준비 중입니다', { icon: 'ℹ️' })}
            className="p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all transform hover:scale-105"
          >
            <DocumentDuplicateIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">플레이리스트 관리</p>
          </button>

          <button
            onClick={() => toast('맛집 관리 기능은 준비 중입니다', { icon: 'ℹ️' })}
            className="p-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl transition-all transform hover:scale-105"
          >
            <BuildingStorefrontIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">맛집 관리</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;