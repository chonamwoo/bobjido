import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import EmailVerification from '../components/EmailVerification';
import axios from 'axios';

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
  const { register: registerUser, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const password = watch('password');
  const userId = watch('userId');
  const email = watch('email');

  // 비밀번호 강도 체크
  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength(null);
    }
  }, [password, userId, email]);

  const checkPasswordStrength = async (pwd: string) => {
    try {
      const response = await axios.post('/api/auth/check-password-strength', {
        password: pwd,
        userId,
        email
      });
      setPasswordStrength(response.data);
    } catch (error) {
      // 비밀번호 강도 체크 API가 없으면 클라이언트에서 간단히 체크
      const hasUpperCase = /[A-Z]/.test(pwd);
      const hasLowerCase = /[a-z]/.test(pwd);
      const hasNumbers = /\d/.test(pwd);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
      const charTypes = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
      
      let strength = 'weak';
      if (pwd.length >= 8 && charTypes >= 2) strength = 'medium';
      if (pwd.length >= 10 && charTypes >= 3) strength = 'strong';
      
      setPasswordStrength({
        strength: { text: strength },
        details: { hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, length: pwd.length }
      });
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data.userId, data.username, data.email, data.password, data.confirmPassword);
      
      if (response?.requiresVerification) {
        setRegisteredEmail(data.email);
        setShowEmailVerification(true);
        toast.success('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
      } else {
        toast.success('회원가입이 완료되었습니다!');
        navigate('/');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // 비밀번호 검증 오류
        error.response.data.errors.forEach((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error.response?.data?.message || '회원가입에 실패했습니다.');
      }
    }
  };

  const handleEmailVerified = (token: string, userData: any) => {
    login(token, userData);
    toast.success('이메일 인증이 완료되었습니다!');
    navigate('/');
  };

  const handleGoogleRegister = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleKakaoRegister = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8888';
    window.location.href = `${apiUrl}/api/auth/kakao`;
  };

  // 이메일 인증 화면 표시
  if (showEmailVerification) {
    return (
      <EmailVerification
        email={registeredEmail}
        onVerified={handleEmailVerified}
        onBack={() => setShowEmailVerification(false)}
      />
    );
  }

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
                      message: '비밀번호는 최소 8자 이상이어야 합니다',
                    },
                    validate: {
                      strength: (value) => {
                        const hasUpperCase = /[A-Z]/.test(value);
                        const hasLowerCase = /[a-z]/.test(value);
                        const hasNumbers = /\d/.test(value);
                        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                        const charTypes = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
                        
                        if (charTypes < 3) {
                          return '대문자, 소문자, 숫자, 특수문자 중 최소 3가지를 포함해야 합니다';
                        }
                        
                        // 아이디와 유사성 체크
                        if (userId && value.toLowerCase().includes(userId.toLowerCase())) {
                          return '비밀번호에 아이디를 포함할 수 없습니다';
                        }
                        
                        return true;
                      }
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
              
              {/* 비밀번호 강도 표시 */}
              {password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">비밀번호 강도</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength.text === 'strong' ? 'text-green-600' :
                      passwordStrength.strength.text === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.strength.text === 'strong' ? '강함' :
                       passwordStrength.strength.text === 'medium' ? '보통' : '약함'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.strength.text === 'strong' ? 'bg-green-500 w-full' :
                        passwordStrength.strength.text === 'medium' ? 'bg-yellow-500 w-2/3' :
                        'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1">
                      {passwordStrength.details.hasUpperCase ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600">대문자 포함</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.details.hasLowerCase ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600">소문자 포함</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.details.hasNumbers ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600">숫자 포함</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.details.hasSpecialChar ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600">특수문자 포함</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.details.length >= 8 ? 
                        <CheckCircleIcon className="w-4 h-4 text-green-500" /> :
                        <XCircleIcon className="w-4 h-4 text-gray-400" />
                      }
                      <span className="text-xs text-gray-600">8자 이상</span>
                    </div>
                  </div>
                </div>
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