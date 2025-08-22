import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<ChangePasswordForm>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await axios.put('/api/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      reset();
      navigate('/settings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 shadow-xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
              <ShieldCheckIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">비밀번호 변경</h1>
              <p className="text-gray-600">계정 보안을 위해 정기적으로 비밀번호를 변경해주세요</p>
            </div>
          </div>

          {/* 보안 팁 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">🔒 안전한 비밀번호 만들기</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 최소 6자 이상, 권장 8자 이상</li>
              <li>• 영문 대/소문자, 숫자, 특수문자 조합</li>
              <li>• 개인정보(생일, 이름 등) 사용 금지</li>
              <li>• 다른 사이트와 동일한 비밀번호 사용 금지</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 현재 비밀번호 */}
            <div>
              <label htmlFor="currentPassword" className="label">
                현재 비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('currentPassword', {
                    required: '현재 비밀번호를 입력하세요'
                  })}
                  type="password"
                  className="input pl-10"
                  placeholder="현재 비밀번호 입력"
                />
              </div>
              {errors.currentPassword && (
                <p className="error-text">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label htmlFor="newPassword" className="label">
                새 비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('newPassword', {
                    required: '새 비밀번호를 입력하세요',
                    minLength: {
                      value: 6,
                      message: '비밀번호는 최소 6자 이상이어야 합니다'
                    },
                    pattern: {
                      value: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
                      message: '영문과 숫자를 포함해야 합니다'
                    }
                  })}
                  type="password"
                  className="input pl-10"
                  placeholder="새 비밀번호 입력 (최소 6자)"
                />
              </div>
              {errors.newPassword && (
                <p className="error-text">{errors.newPassword.message}</p>
              )}
              
              {/* 비밀번호 강도 표시 */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">비밀번호 강도</span>
                    <span className={
                      newPassword.length >= 12 ? 'text-green-600 font-medium' :
                      newPassword.length >= 8 ? 'text-yellow-600 font-medium' :
                      'text-red-600 font-medium'
                    }>
                      {newPassword.length >= 12 ? '강함' :
                       newPassword.length >= 8 ? '보통' : '약함'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        newPassword.length >= 12 ? 'bg-green-500 w-full' :
                        newPassword.length >= 8 ? 'bg-yellow-500 w-2/3' :
                        'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                새 비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: '비밀번호를 다시 입력하세요',
                    validate: value => value === newPassword || '비밀번호가 일치하지 않습니다'
                  })}
                  type="password"
                  className="input pl-10"
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn btn-primary py-3"
              >
                {isSubmitting ? '변경 중...' : '비밀번호 변경'}
              </button>
            </div>
          </form>

          {/* 추가 도움말 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">💡 팁:</span> 소셜 로그인(Google, Kakao)으로 가입한 경우,
              해당 서비스에서 비밀번호를 변경해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;