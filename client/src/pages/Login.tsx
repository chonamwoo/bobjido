import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('로그인되었습니다!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleKakaoLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    window.location.href = `${apiUrl}/api/auth/kakao`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">BobMap</span>
            </Link>
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              다시 오신 것을 환영해요!
            </h2>
            <p className="text-gray-600">
              맛집 여행을 계속해보세요
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="label">
                  이메일 주소
                </label>
                <input
                  {...register('email', {
                    required: '이메일을 입력하세요',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: '올바른 이메일 형식이 아닙니다',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className="input"
                  placeholder="맛집탐험가@example.com"
                />
                {errors.email && (
                  <p className="error-text">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: '비밀번호를 입력하세요',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input pr-12"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="error-text">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-secondary-700">
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary text-lg py-4 shadow-lg shadow-primary-500/25"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  로그인하는 중...
                </div>
              ) : (
                '로그인하기'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-secondary-500 font-medium">소셜 로그인</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-secondary-300 rounded-xl bg-white hover:bg-secondary-50 transition-colors"
              >
                <img
                  className="w-5 h-5 mr-3"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                />
                <span className="text-secondary-700 font-medium">구글</span>
              </button>
              <button
                type="button"
                onClick={handleKakaoLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-secondary-300 rounded-xl bg-white hover:bg-secondary-50 transition-colors"
              >
                <img
                  className="w-5 h-5 mr-3"
                  src="https://www.svgrepo.com/show/475647/kakao-color.svg"
                  alt="Kakao"
                />
                <span className="text-secondary-700 font-medium">카카오</span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-secondary-600">
                아직 계정이 없으신가요?{' '}
                <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  회원가입하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;