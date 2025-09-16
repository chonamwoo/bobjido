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
  ShieldCheckIcon,
  ArrowLeftIcon,
  SparklesIcon,
  HeartIcon,
  CogIcon,
  MapPinIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { useIsMobile } from '../hooks/useIsMobile';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const isMobile = useIsMobile();
  const isAdmin = user?.isAdmin || user?.username === 'Admin' || user?.email === 'admin@bobmap.com';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });
  const [naverConnected, setNaverConnected] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    autoSync: false,
    syncFrequency: 'daily'
  });

  // 프로필 정보 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put('/api/users/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('프로필이 업데이트되었습니다');
      // authStore 업데이트 - 헤더의 이름도 즉시 변경됨
      updateUser(data.user);
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
      toast.success('계정이 삭제되었습니다. 완전한 로그아웃을 위해 브라우저를 새로고침하세요.');
      // OAuth 세션 정리
      localStorage.clear();
      sessionStorage.clear();
      logout();
      // 브라우저 새로고침으로 모든 세션 정리
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
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
    <div className={`${isMobile ? 'p-4' : 'max-w-4xl mx-auto p-6'}`}>
      {/* 모바일 헤더 */}
      {isMobile && (
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 mr-2"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold">계정 설정</h1>
        </div>
      )}
      
      {/* 데스크톱 헤더 */}
      {!isMobile && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">계정 설정</h1>
          <p className="text-gray-600">프로필 정보와 계정 설정을 관리하세요</p>
        </div>
      )}

      {/* 빠른 액세스 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <SparklesIcon className="w-6 h-6 mr-3 text-gray-600" />
          <h2 className="text-xl font-semibold">맛집 관리</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 팔로잉 맛집 관리 - 모든 사용자 */}
          <button
            onClick={() => navigate('/my-following-restaurants')}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center">
              <HeartIcon className="w-8 h-8 text-purple-500 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">나의 팔로잉 맛집</h3>
                <p className="text-sm text-gray-600">내가 좋아하는 맛집 리스트 관리</p>
              </div>
            </div>
            <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          {/* 인증 맛집 관리 - 관리자만 */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/certified-restaurants')}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center">
                <CogIcon className="w-8 h-8 text-orange-500 mr-3" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">인증 맛집 관리</h3>
                  <p className="text-sm text-gray-600">미쉐린, 생활의 달인 등 (관리자)</p>
                </div>
              </div>
              <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          )}
        </div>

        {!isAdmin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 팁: 팔로잉 맛집을 추가하면 모바일 홈 화면의 "팔로잉" 탭에서 바로 확인할 수 있어요!
            </p>
          </div>
        )}
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

      {/* 네이버 MY플레이스 연동 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <MapPinIcon className="w-6 h-6 mr-3 text-green-600" />
          <h2 className="text-xl font-semibold">네이버 MY플레이스 연동</h2>
        </div>

        {!naverConnected ? (
          <div>
            <p className="text-gray-600 mb-6">
              네이버 MY플레이스에 저장한 맛집들을 BobMap으로 가져올 수 있습니다.
              연동하시면 자동으로 동기화됩니다.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">연동 시 혜택</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 네이버 MY플레이스의 모든 저장 장소 자동 가져오기</li>
                <li>• 주기적 자동 동기화 (새로 추가한 장소도 자동 반영)</li>
                <li>• 카테고리별 자동 분류</li>
                <li>• 중복 장소 자동 감지 및 제거</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/import/naver')}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-5 h-5" />
              네이버 계정 연동하기
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-800 font-semibold">연동 완료</span>
                <span className="text-sm text-green-600">
                  마지막 동기화: {new Date().toLocaleString('ko-KR')}
                </span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                네이버 MY플레이스와 연동되었습니다.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncSettings.autoSync}
                    onChange={(e) => setSyncSettings({
                      ...syncSettings,
                      autoSync: e.target.checked
                    })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">자동 동기화</p>
                    <p className="text-sm text-gray-600">
                      새로운 장소를 자동으로 가져옵니다
                    </p>
                  </div>
                </label>
              </div>

              {syncSettings.autoSync && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    동기화 주기
                  </label>
                  <select
                    value={syncSettings.syncFrequency}
                    onChange={(e) => setSyncSettings({
                      ...syncSettings,
                      syncFrequency: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="realtime">실시간</option>
                    <option value="hourly">매시간</option>
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/import/naver')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                수동 동기화
              </button>
              <button
                onClick={() => {
                  if (window.confirm('네이버 연동을 해제하시겠습니까?')) {
                    setNaverConnected(false);
                    toast.success('네이버 연동이 해제되었습니다.');
                  }
                }}
                className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                연동 해제
              </button>
            </div>
          </div>
        )}
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