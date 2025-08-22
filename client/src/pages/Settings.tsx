import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  // 프로필 정보 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put('/api/users/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('프로필이 업데이트되었습니다');
      // authStore 업데이트는 여기서 할 수 있음
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '업데이트에 실패했습니다');
    },
  });

  // 회원탈퇴
  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await axios.delete('/api/users/delete-account', {
        data: { password }
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('계정이 삭제되었습니다');
      logout();
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '계정 삭제에 실패했습니다');
    },
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(userInfo);
  };

  const handleDeleteAccount = () => {
    if (!deletePassword.trim()) {
      toast.error('비밀번호를 입력해주세요');
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  const isOAuthUser = user?.password?.startsWith('oauth-');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">계정 설정</h1>
        <p className="text-gray-600">프로필 정보와 계정 설정을 관리하세요</p>
      </div>

      {/* 프로필 정보 수정 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <UserCircleIcon className="w-6 h-6 mr-3 text-gray-600" />
          <h2 className="text-xl font-semibold">프로필 정보</h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사용자명
            </label>
            <input
              type="text"
              value={userInfo.username}
              onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="사용자명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자기소개
            </label>
            <textarea
              value={userInfo.bio}
              onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="자기소개를 입력하세요"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? '저장 중...' : '변경사항 저장'}
          </button>
        </form>
      </div>

      {/* 계정 보안 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <ShieldCheckIcon className="w-6 h-6 mr-3 text-gray-600" />
          <h2 className="text-xl font-semibold">계정 보안</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">로그인 방식</p>
              <p className="text-sm text-gray-600">
                {isOAuthUser ? '소셜 로그인 (Google/Kakao)' : '이메일/비밀번호'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">계정 생성일</p>
              <p className="text-sm text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">마지막 로그인</p>
              <p className="text-sm text-gray-600">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('ko-KR') : '정보 없음'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 위험 구역 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-400">
        <div className="flex items-center mb-6">
          <ExclamationTriangleIcon className="w-6 h-6 mr-3 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">위험 구역</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">계정 삭제</h3>
            <p className="text-sm text-red-600 mb-4">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 
              이 작업은 되돌릴 수 없습니다.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <TrashIcon className="w-4 h-4" />
              계정 삭제
            </button>
          </div>
        </div>
      </div>

      {/* 계정 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold">계정 삭제 확인</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 
              모든 맛집리스트, 리뷰, 팔로워/팔로잉 정보가 삭제됩니다.
            </p>

            {!isOAuthUser && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isOAuthUser && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  소셜 로그인 계정입니다. 비밀번호 확인 없이 삭제할 수 있습니다.
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending || (!isOAuthUser && !deletePassword.trim())}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteAccountMutation.isPending ? '삭제 중...' : '삭제 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;