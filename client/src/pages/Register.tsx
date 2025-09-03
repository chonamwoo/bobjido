import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface RegisterFormData {
  userId: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.userId, data.username, data.email, data.password, data.confirmPassword);
      toast.success('회원가입이 완료되었습니다!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  const handleGoogleRegister = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8890';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleKakaoRegister = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8890';
    window.location.href = `${apiUrl}/api/auth/kakao`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-rose-50 to-secondary-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-200/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="flex justify-center items-center space-x-3 mb-6 group">
              <div className="w-14 h-14 bg-gradient-to-r from-primary-400 to-rose-400 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 animate-glow">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-500 via-rose-400 to-secondary-500 bg-clip-text text-transparent">BobMap</span>
            </Link>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-rose-500 bg-clip-text text-transparent mb-3">회원가입</h2>
            <p className="text-gray-600 text-lg">나만의 맛집 플레이리스트를 만들어보세요 ✨</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="userId" className="form-label">
                아이디
              </label>
              <input
                id="userId"
                type="text"
                {...register('userId', {
                  required: '아이디를 입력해주세요',
                  minLength: {
                    value: 4,
                    message: '아이디는 4자 이상이어야 합니다',
                  },
                  maxLength: {
                    value: 20,
                    message: '아이디는 20자 이하여야 합니다',
                  },
                  pattern: {
                    value: /^[a-z0-9_]+$/,
                    message: '영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다',
                  },
                })}
                className="form-input"
                placeholder="영문 소문자, 숫자, _ (4-20자)"
              />
              {errors.userId && (
                <p className="error-text">{errors.userId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="form-label">
                닉네임
              </label>
              <input
                id="username"
                type="text"
                {...register('username', {
                  required: '닉네임을 입력해주세요',
                  minLength: {
                    value: 2,
                    message: '닉네임은 2자 이상이어야 합니다',
                  },
                  maxLength: {
                    value: 20,
                    message: '닉네임은 20자 이하여야 합니다',
                  },
                })}
                className="form-input"
                placeholder="닉네임을 입력하세요"
              />
              {errors.username && (
                <p className="error-text">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                이메일 주소
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '올바른 이메일 형식이 아닙니다',
                  },
                })}
                className="form-input"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: '비밀번호를 입력해주세요',
                    minLength: {
                      value: 8,
                      message: '비밀번호는 8자 이상이어야 합니다',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: '대소문자, 숫자, 특수문자를 포함해야 합니다',
                    },
                  })}
                  className="form-input pr-10"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-secondary-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-secondary-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: '비밀번호 확인을 입력해주세요',
                    validate: (value) =>
                      value === password || '비밀번호가 일치하지 않습니다',
                  })}
                  className="form-input pr-10"
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-secondary-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-secondary-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  {...register('agreeTerms', {
                    required: '이용약관과 개인정보처리방침에 동의해주세요',
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-secondary-900">
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    이용약관
                  </Link>
                  과{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    개인정보처리방침
                  </Link>
                  에 동의합니다
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="error-text">{errors.agreeTerms.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-primary-400 via-rose-400 to-secondary-400 text-white py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-primary-300/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      가입 중...
                    </>
                  ) : (
                    <>
                      회원가입
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-rose-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer group-hover:left-full transition-all duration-700"></div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full btn btn-outline flex items-center justify-center"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                구글로 시작
              </button>
              <button
                type="button"
                onClick={handleKakaoRegister}
                className="w-full btn btn-outline flex items-center justify-center"
              >
                <img
                  className="w-5 h-5 mr-2"
                  src="https://www.svgrepo.com/show/475647/kakao-color.svg"
                  alt="Kakao"
                />
                카카오로 시작
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;