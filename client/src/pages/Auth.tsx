import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface AuthFormData {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  
  const from = location.state?.from?.pathname || '/';

  const {
    register: formRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AuthFormData>();

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  // 비밀번호 강도 체크
  const checkPasswordStrength = (password: string) => {
    if (!password) return { score: 0, feedback: '' };
    
    let score = 0;
    const feedback = [];
    
    if (password.length >= 8) score++;
    else feedback.push('8자 이상');
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('대문자');
    
    if (/[a-z]/.test(password)) score++;
    else feedback.push('소문자');
    
    if (/[0-9]/.test(password)) score++;
    else feedback.push('숫자');
    
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('특수문자');
    
    const messages = {
      0: '매우 약함',
      1: '약함',
      2: '보통',
      3: '강함',
      4: '매우 강함',
      5: '완벽!'
    };
    
    return {
      score,
      feedback: feedback.length > 0 ? `추가 필요: ${feedback.join(', ')}` : '안전한 비밀번호입니다!',
      message: messages[score as keyof typeof messages]
    };
  };

  // 이메일에서 닉네임 생성
  const generateUsernameFromEmail = () => {
    if (watchedEmail) {
      const username = watchedEmail.split('@')[0];
      setValue('username', username);
    }
  };

  // 비밀번호 변경 시 강도 체크
  React.useEffect(() => {
    if (watchedPassword && !isLoginMode) {
      setPasswordStrength(checkPasswordStrength(watchedPassword));
    }
  }, [watchedPassword, isLoginMode]);

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLoginMode) {
        await login(data.email, data.password);
        toast.success('로그인되었습니다!');
      } else {
        await register(data.username!, data.email, data.password);
        toast.success('회원가입되었습니다!');
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || '요청에 실패했습니다.');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'kakao') => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    window.location.href = `${apiUrl}/api/auth/${provider}`;
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-neutral-100">
          <div className="text-center mb-8">
            <Link to="/" className="flex justify-center items-center space-x-3 mb-6">
              <img 
                src="/images/logo-icon.png" 
                alt="Bob's Map" 
                className="w-12 h-12 object-contain rounded-xl"
              />
              <span className="text-3xl font-bold text-primary-800">
                Bob's Map
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              {isLoginMode ? '다시 오신 것을 환영해요!' : '맛집 여행을 시작하세요!'}
            </h2>
            <p className="text-neutral-600">
              {isLoginMode ? '맛집 플레이리스트를 계속 만들어보세요' : '나만의 맛집 지도를 만들어보세요'}
            </p>
          </div>

          {/* 소셜 로그인 버튼 */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center px-4 py-3 border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 transition-all shadow-soft hover:shadow-medium"
            >
              <img
                className="w-5 h-5 mr-3"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
              />
              <span className="text-neutral-700 font-medium">
                구글로 {isLoginMode ? '로그인' : '시작하기'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              className="w-full flex items-center justify-center px-4 py-3 border border-yellow-400 rounded-lg transition-all shadow-soft hover:shadow-medium"
              style={{ backgroundColor: '#FEE500', borderColor: '#FACC15' }}
            >
              <div className="w-5 h-5 mr-3 bg-gray-900 rounded-sm flex items-center justify-center">
                <span className="text-yellow-400 text-xs font-bold">K</span>
              </div>
              <span className="text-gray-900 font-medium">
                카카오로 {isLoginMode ? '로그인' : '시작하기'}
              </span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500 font-medium">또는</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {!isLoginMode && (
              <div>
                <label htmlFor="username" className="label">
                  사용자명
                </label>
                <div className="relative">
                  <input
                    {...formRegister('username', {
                      required: isLoginMode ? false : '사용자명을 입력하세요',
                      minLength: {
                        value: 3,
                        message: '사용자명은 최소 3자 이상이어야 합니다',
                      },
                    })}
                    type="text"
                    className="input pr-24"
                    placeholder="맛집탐험가"
                  />
                  {watchedEmail && (
                    <button
                      type="button"
                      onClick={generateUsernameFromEmail}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
                    >
                      자동생성
                    </button>
                  )}
                </div>
                {errors.username && (
                  <p className="error-text">{errors.username.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label text-gray-900">
                이메일 주소
              </label>
              <input
                {...formRegister('email', {
                  required: '이메일을 입력하세요',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '올바른 이메일 형식이 아닙니다',
                  },
                })}
                type="email"
                autoComplete="email"
                className="input"
                placeholder="example@bobsmap.com"
              />
              {errors.email && (
                <p className="error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label text-gray-900">
                비밀번호
              </label>
              <div className="relative">
                <input
                  {...formRegister('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: isLoginMode ? undefined : {
                      value: 6,
                      message: '비밀번호는 최소 6자 이상이어야 합니다',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                  className="input pr-12"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
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
              
              {/* 비밀번호 강도 표시 (회원가입 모드에서만) */}
              {!isLoginMode && watchedPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">비밀번호 강도:</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength.score >= 4 ? 'text-green-600' :
                      passwordStrength.score >= 3 ? 'text-yellow-600' :
                      passwordStrength.score >= 2 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 4 ? 'bg-green-500' :
                        passwordStrength.score >= 3 ? 'bg-yellow-500' :
                        passwordStrength.score >= 2 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback && passwordStrength.score < 5 && (
                    <p className="text-sm text-neutral-600">
                      {passwordStrength.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 비밀번호 확인 (회원가입 모드에서만) */}
            {!isLoginMode && (
              <div>
                <label htmlFor="confirmPassword" className="label">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    {...formRegister('confirmPassword', {
                      required: '비밀번호 확인을 입력하세요',
                      validate: (value) => {
                        if (value !== watchedPassword) {
                          return '비밀번호가 일치하지 않습니다';
                        }
                        return true;
                      }
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="input pr-12"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="error-text">{errors.confirmPassword.message}</p>
                )}
                
                {/* 비밀번호 일치 표시 */}
                {watchedPassword && watchedConfirmPassword && (
                  <div className="mt-2 flex items-center">
                    {watchedPassword === watchedConfirmPassword ? (
                      <div className="flex items-center text-success">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">비밀번호가 일치합니다</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-error">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">비밀번호가 일치하지 않습니다</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-5 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 shadow-accent hover:shadow-accent-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  처리 중...
                </div>
              ) : (
                isLoginMode ? '로그인' : '회원가입'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
            >
              {isLoginMode ? (
                <>
                  아직 계정이 없으신가요? <span className="underline">회원가입하기</span>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요? <span className="underline">로그인하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;