import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface EmailVerificationProps {
  email: string;
  onVerified: (token: string, userData: any) => void;
  onBack?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onVerified,
  onBack 
}) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // 붙여넣기 처리
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...verificationCode];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setVerificationCode(newCode);
      
      // 마지막 입력된 인덱스로 포커스 이동
      const lastIndex = Math.min(index + pastedCode.length - 1, 5);
      inputRefs[lastIndex].current?.focus();
    } else {
      // 일반 입력
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // 다음 입력 필드로 자동 이동
      if (value && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
    
    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('6자리 인증 코드를 모두 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-email', {
        email,
        code
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerified(response.data.data.token, response.data.data);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '인증에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/resend-verification', {
        email
      });

      if (response.data.success) {
        setResendTimer(60); // 60초 대기
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '재발송에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4"
          >
            {success ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <Mail className="w-10 h-10 text-white" />
            )}
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {success ? '인증 완료!' : '이메일 인증'}
          </h2>
          
          {!success && (
            <p className="text-gray-600">
              <span className="font-medium">{email}</span>으로<br />
              발송된 6자리 코드를 입력해주세요
            </p>
          )}
        </div>

        {!success && (
          <>
            <div className="flex justify-center gap-2 mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loading || success}
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || verificationCode.join('').length !== 6}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-4"
            >
              {loading ? '확인 중...' : '인증하기'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                {resendTimer > 0 ? `${resendTimer}초 후 재발송` : '코드 재발송'}
              </button>
              
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-700"
                >
                  돌아가기
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 이메일이 오지 않았나요?
              </p>
              <ul className="text-xs text-blue-600 mt-2 space-y-1">
                <li>• 스팸 메일함을 확인해주세요</li>
                <li>• 이메일 주소가 정확한지 확인해주세요</li>
                <li>• 10분 이내에 입력해주세요</li>
              </ul>
            </div>
          </>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-4">
              이메일 인증이 완료되었습니다!<br />
              잠시 후 자동으로 이동합니다...
            </p>
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerification;