import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const AuthError: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({
    provider: '',
    message: '',
    solution: ''
  });

  useEffect(() => {
    const provider = searchParams.get('provider') || '';
    const error = searchParams.get('error') || 'unknown_error';

    let message = '';
    let solution = '';

    switch (provider) {
      case 'google':
        message = 'Google 로그인에 실패했습니다';
        solution = '브라우저의 쿠키와 팝업 차단을 해제하고 다시 시도해주세요.';
        break;
      case 'kakao':
        message = 'Kakao 로그인에 실패했습니다';
        solution = '브라우저 설정을 확인해주세요. 쿠키와 JavaScript가 활성화되어야 합니다.';
        break;
      case 'naver':
        message = 'Naver 로그인에 실패했습니다';
        solution = 'Naver 개발자 센터에서 앱 설정을 확인해주세요.';
        break;
      default:
        message = '소셜 로그인에 실패했습니다';
        solution = '잠시 후 다시 시도해주세요.';
    }

    // 특정 에러 메시지 처리
    if (error === 'popup_blocked') {
      solution = '팝업 차단을 해제하고 다시 시도해주세요.';
    } else if (error === 'cookies_disabled') {
      solution = '브라우저에서 쿠키를 활성화하고 다시 시도해주세요.';
    } else if (error === 'network_error') {
      solution = '네트워크 연결을 확인하고 다시 시도해주세요.';
    }

    setErrorDetails({ provider, message, solution });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center">
          {/* 에러 아이콘 */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
          </div>

          {/* 에러 메시지 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            로그인 실패
          </h2>
          <p className="text-gray-600 mb-6">
            {errorDetails.message}
          </p>

          {/* 해결 방법 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
            <p className="text-sm text-blue-700">
              <strong>해결 방법:</strong><br />
              {errorDetails.solution}
            </p>
          </div>

          {/* 브라우저 설정 가이드 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              브라우저 설정 확인사항:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>쿠키가 활성화되어 있는지 확인</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>팝업 차단이 해제되어 있는지 확인</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>JavaScript가 활성화되어 있는지 확인</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>시크릿/프라이빗 모드가 아닌지 확인</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              다시 시도하기
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              홈으로 돌아가기
            </button>
          </div>

          {/* 추가 도움말 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              계속 문제가 발생하면 일반 회원가입을 이용해주세요
            </p>
            <button
              onClick={() => navigate('/auth', { state: { defaultTab: 'register' } })}
              className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              일반 회원가입으로 가기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthError;