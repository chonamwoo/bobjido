import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { EnvelopeIcon, KeyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordForm {
  email: string;
}

interface ResetPasswordForm {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
  } = useForm<ForgotPasswordForm>();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isSubmitting: isSubmittingReset },
    watch
  } = useForm<ResetPasswordForm>();

  const newPassword = watch('newPassword');

  const onSubmitEmail = async (data: ForgotPasswordForm) => {
    try {
      await axios.post('/api/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setStep('reset');
      toast.success('비밀번호 재설정 코드를 이메일로 전송했습니다.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || '이메일 전송에 실패했습니다.');
    }
  };

  const onSubmitReset = async (data: ResetPasswordForm) => {
    try {
      await axios.post('/api/auth/reset-password', {
        email,
        code: data.code,
        newPassword: data.newPassword
      });
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.response?.data?.message || '비밀번호 재설정에 실패했습니다.');
    }
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
            
            {step === 'email' ? (
              <>
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                  비밀번호 찾기
                </h2>
                <p className="text-gray-600">
                  가입한 이메일 주소를 입력하시면<br />
                  비밀번호 재설정 코드를 보내드립니다
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-2">
                  이메일을 확인하세요
                </h2>
                <p className="text-gray-600">
                  {email}로<br />
                  재설정 코드를 전송했습니다
                </p>
              </>
            )}
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-6">
              <div>
                <label htmlFor="email" className="label">
                  이메일 주소
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerEmail('email', {
                      required: '이메일을 입력하세요',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: '올바른 이메일 형식이 아닙니다',
                      },
                    })}
                    type="email"
                    className="input pl-10"
                    placeholder="example@bobmap.com"
                  />
                </div>
                {emailErrors.email && (
                  <p className="error-text">{emailErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingEmail}
                className="w-full btn btn-primary text-lg py-4 shadow-lg"
              >
                {isSubmittingEmail ? '전송 중...' : '재설정 코드 받기'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-6">
              <div>
                <label htmlFor="code" className="label">
                  재설정 코드 (6자리)
                </label>
                <input
                  {...registerReset('code', {
                    required: '재설정 코드를 입력하세요',
                    minLength: {
                      value: 6,
                      message: '6자리 코드를 입력하세요'
                    },
                    maxLength: {
                      value: 6,
                      message: '6자리 코드를 입력하세요'
                    }
                  })}
                  type="text"
                  className="input text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
                {resetErrors.code && (
                  <p className="error-text">{resetErrors.code.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="label">
                  새 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerReset('newPassword', {
                      required: '새 비밀번호를 입력하세요',
                      minLength: {
                        value: 6,
                        message: '비밀번호는 최소 6자 이상이어야 합니다'
                      }
                    })}
                    type="password"
                    className="input pl-10"
                    placeholder="새 비밀번호 입력"
                  />
                </div>
                {resetErrors.newPassword && (
                  <p className="error-text">{resetErrors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...registerReset('confirmPassword', {
                      required: '비밀번호를 다시 입력하세요',
                      validate: value => value === newPassword || '비밀번호가 일치하지 않습니다'
                    })}
                    type="password"
                    className="input pl-10"
                    placeholder="새 비밀번호 다시 입력"
                  />
                </div>
                {resetErrors.confirmPassword && (
                  <p className="error-text">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingReset}
                className="w-full btn btn-primary text-lg py-4 shadow-lg"
              >
                {isSubmittingReset ? '변경 중...' : '비밀번호 변경'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                이메일을 다시 입력하기
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              ← 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;