import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  ArrowLeftIcon,
  KeyIcon,
  EnvelopeIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      toast.error('새 비밀번호가 일치하지 않습니다');
      return;
    }

    setLoading(true);
    try {
      await axios.put('/api/users/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('비밀번호가 변경되었습니다');
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '비밀번호 변경 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete('/api/users/account');
      toast.success('계정이 삭제되었습니다');
      logout();
      navigate('/');
    } catch (error: any) {
      toast.error('계정 삭제 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="font-semibold">계정 설정</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* 설정 목록 */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* 계정 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="px-4 py-3 font-semibold border-b">계정 정보</h2>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <KeyIcon className="w-5 h-5 text-gray-600" />
              <span>비밀번호 변경</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-t"
          >
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <div>이메일</div>
                <div className="text-sm text-gray-500">{user?.email || '이메일 없음'}</div>
              </div>
            </div>
          </button>
        </div>

        {/* 알림 설정 섹션 */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="px-4 py-3 font-semibold border-b">알림 설정</h2>

          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span>푸시 알림</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>

        {/* 개인정보 보호 섹션 */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="px-4 py-3 font-semibold border-b">개인정보 보호</h2>

          <button
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
              <span>개인정보 처리방침</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* 계정 관리 섹션 */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="px-4 py-3 font-semibold border-b text-red-600">위험 구역</h2>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="flex items-center space-x-3">
              <TrashIcon className="w-5 h-5" />
              <span>계정 삭제</span>
            </div>
            <span className="text-red-400">›</span>
          </button>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? '변경 중...' : '변경'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 계정 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">계정 삭제</h2>
            <p className="text-gray-600 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
              모든 데이터가 영구적으로 삭제됩니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;