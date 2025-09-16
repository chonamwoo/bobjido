import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';

interface AuthFormData {
  userId?: string;
  username?: string;
  email?: string;
  loginId?: string;
  password: string;
  confirmPassword?: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthStore();
  // /register 경로로 접근하면 회원가입 모드로 시작
  const [isLoginMode, setIsLoginMode] = useState(location.pathname !== '/register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '', message: '' });
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  const from = location.state?.from?.pathname || '/';

  const {
    register: formRegister,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors
  } = useForm<AuthFormData>();

  const watchedUserId = watch('userId');
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  // 아이디 중복 체크
  const checkUserIdAvailability = async (userId: string) => {
    if (!userId || userId.length < 4) {
      setUserIdAvailable(null);
      return;
    }

    if (!/^[a-z0-9_]{4,20}$/.test(userId)) {
      setUserIdAvailable(false);
      setError('userId', { 
        type: 'manual', 
        message: '아이디는 4-20자의 영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다' 
      });
      return;
    }

    setCheckingUserId(true);
    try {
      const response = await axios.get(`/api/auth/check-userid/${userId}`);
      setUserIdAvailable(response.data.available);
      if (response.data.available) {
        clearErrors('userId');
      } else {
        setError('userId', { type: 'manual', message: response.data.message });
      }
    } catch (error) {
      console.error('아이디 중복 체크 실패:', error);
      setUserIdAvailable(null);
    }
    setCheckingUserId(false);
  };

  // 이메일 중복 체크
  const checkEmailAvailability = async (email: string) => {
    if (!email) {
      setEmailAvailable(null);
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email)) {
      setEmailAvailable(false);
      setError('email', { 
        type: 'manual', 
        message: '올바른 이메일 주소를 입력해주세요' 
      });
      return;
    }

    setCheckingEmail(true);
    try {
      const response = await axios.get(`/api/auth/check-email/${email}`);
      setEmailAvailable(response.data.available);
      if (response.data.available) {
        clearErrors('email');
      } else {
        setError('email', { type: 'manual', message: response.data.message });
      }
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
      setEmailAvailable(null);
    }
    setCheckingEmail(false);
  };

  // 경로 변경 시 모드 업데이트
  React.useEffect(() => {
    setIsLoginMode(location.pathname !== '/register');
  }, [location.pathname]);

  // 디바운스 처리
  React.useEffect(() => {
    if (!isLoginMode && watchedUserId) {
      const timer = setTimeout(() => {
        checkUserIdAvailability(watchedUserId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [watchedUserId, isLoginMode]);

  React.useEffect(() => {
    if (!isLoginMode && watchedEmail) {
      const timer = setTimeout(() => {
        checkEmailAvailability(watchedEmail);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [watchedEmail, isLoginMode]);

  // 비밀번호 강도 체크
  const checkPasswordStrength = (password: string) => {
    if (!password) return { score: 0, feedback: '', message: '' };
    
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

  // 비밀번호 변경 시 강도 체크
  React.useEffect(() => {
    if (watchedPassword && !isLoginMode) {
      setPasswordStrength(checkPasswordStrength(watchedPassword));
    }
  }, [watchedPassword, isLoginMode]);

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLoginMode) {
        // 로그인
        await login(data.loginId!, data.password);
        toast.success('로그인되었습니다!');
        navigate(from, { replace: true });
      } else {
        // 회원가입
        if (!userIdAvailable) {
          toast.error('아이디 중복 확인이 필요합니다');
          return;
        }
        if (!emailAvailable) {
          toast.error('이메일 중복 확인이 필요합니다');
          return;
        }
        if (data.password !== data.confirmPassword) {
          toast.error('비밀번호가 일치하지 않습니다');
          return;
        }
        
        await register(data.userId!, data.username!, data.email!, data.password, data.confirmPassword!);
        toast.success('회원가입이 완료되었습니다!');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || '오류가 발생했습니다');
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    reset();
    setUserIdAvailable(null);
    setEmailAvailable(null);
    setPasswordStrength({ score: 0, feedback: '', message: '' });
  };

  // OAuth 로그인
  const handleOAuthLogin = (provider: 'google' | 'kakao' | 'naver') => {
    window.location.href = `http://localhost:8888/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            BobMap
          </h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLoginMode ? '로그인' : '회원가입'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button
              onClick={switchMode}
              className="ml-1 font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              {isLoginMode ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {isLoginMode ? (
              // 로그인 폼
              <>
                <div>
                  <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                    아이디 또는 이메일
                  </label>
                  <input
                    {...formRegister('loginId', {
                      required: '아이디 또는 이메일을 입력하세요'
                    })}
                    type="text"
                    autoComplete="username"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="아이디 또는 이메일"
                  />
                  {errors.loginId && (
                    <p className="mt-1 text-sm text-red-600">{errors.loginId.message}</p>
                  )}
                </div>
              </>
            ) : (
              // 회원가입 폼
              <>
                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                    아이디 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...formRegister('userId', {
                        required: '아이디를 입력하세요',
                        minLength: {
                          value: 4,
                          message: '아이디는 4자 이상이어야 합니다'
                        },
                        maxLength: {
                          value: 20,
                          message: '아이디는 20자 이하여야 합니다'
                        },
                        pattern: {
                          value: /^[a-z0-9_]+$/,
                          message: '영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다'
                        }
                      })}
                      type="text"
                      autoComplete="username"
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="영문 소문자, 숫자, _ (4-20자)"
                    />
                    {checkingUserId && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    {!checkingUserId && userIdAvailable !== null && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {userIdAvailable ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
                  )}
                  {userIdAvailable === true && (
                    <p className="mt-1 text-sm text-green-600">사용 가능한 아이디입니다</p>
                  )}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    사용자명 (닉네임) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...formRegister('username', {
                      required: '사용자명을 입력하세요',
                      minLength: {
                        value: 2,
                        message: '사용자명은 2자 이상이어야 합니다'
                      },
                      maxLength: {
                        value: 30,
                        message: '사용자명은 30자 이하여야 합니다'
                      }
                    })}
                    type="text"
                    autoComplete="name"
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="표시될 이름 (2-30자)"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...formRegister('email', {
                        required: '이메일을 입력하세요',
                        pattern: {
                          value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/,
                          message: '올바른 이메일 주소를 입력하세요'
                        }
                      })}
                      type="email"
                      autoComplete="email"
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="example@email.com"
                    />
                    {checkingEmail && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-5 w-5 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                    {!checkingEmail && emailAvailable !== null && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {emailAvailable ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  {emailAvailable === true && (
                    <p className="mt-1 text-sm text-green-600">사용 가능한 이메일입니다</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  {...formRegister('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: {
                      value: 6,
                      message: '비밀번호는 6자 이상이어야 합니다'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="최소 6자 이상"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              
              {!isLoginMode && watchedPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score === 0 ? 'bg-gray-300' :
                          passwordStrength.score === 1 ? 'bg-red-500' :
                          passwordStrength.score === 2 ? 'bg-yellow-500' :
                          passwordStrength.score === 3 ? 'bg-blue-500' :
                          passwordStrength.score === 4 ? 'bg-green-500' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      passwordStrength.score === 0 ? 'text-gray-500' :
                      passwordStrength.score === 1 ? 'text-red-500' :
                      passwordStrength.score === 2 ? 'text-yellow-500' :
                      passwordStrength.score === 3 ? 'text-blue-500' :
                      passwordStrength.score === 4 ? 'text-green-500' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.message}
                    </span>
                  </div>
                  {passwordStrength.feedback && passwordStrength.score < 5 && (
                    <p className="mt-1 text-xs text-gray-500">{passwordStrength.feedback}</p>
                  )}
                </div>
              )}
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    {...formRegister('confirmPassword', {
                      required: '비밀번호를 다시 입력하세요',
                      validate: value => value === watchedPassword || '비밀번호가 일치하지 않습니다'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                {watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword && (
                  <p className="mt-1 text-sm text-green-600">비밀번호가 일치합니다</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || (!isLoginMode && (userIdAvailable === false || emailAvailable === false))}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? '처리중...' : (isLoginMode ? '로그인' : '회원가입')}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-orange-50 to-red-50 text-gray-500">
                  또는 간편 로그인
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 hidden sm:inline">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('kakao')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#FEE500] text-sm font-medium text-[#000000] hover:bg-[#FDD835] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#000000" d="M12 3c-5.5 0-10 3.58-10 8 0 2.83 1.85 5.32 4.64 6.74-.2.71-.76 2.73-.78 2.91-.03.26.1.5.34.58.08.03.17.04.25.04.17 0 .34-.05.47-.15.97-.74 3.55-2.72 4.35-3.37.56.08 1.14.12 1.73.12 5.5 0 10-3.58 10-8s-4.5-8-10-8z"/>
                </svg>
                <span className="ml-2 hidden sm:inline">Kakao</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('naver')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-[#03C75A] text-sm font-medium text-white hover:bg-[#02B550] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="white" d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                <span className="ml-2 hidden sm:inline">Naver</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;