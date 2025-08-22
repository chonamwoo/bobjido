import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('AuthCallback: 콜백 처리 시작');
      console.log('AuthCallback: URL params:', window.location.href);
      
      const token = searchParams.get('token');
      const userString = searchParams.get('user');
      const error = searchParams.get('error');

      console.log('AuthCallback: token:', token);
      console.log('AuthCallback: userString:', userString);
      console.log('AuthCallback: error:', error);

      if (error) {
        console.error('AuthCallback: OAuth 에러:', error);
        toast.error('로그인에 실패했습니다: ' + error);
        navigate('/login');
        return;
      }

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          console.log('AuthCallback: 파싱된 사용자 정보:', user);
          
          // authStore에 직접 저장
          useAuthStore.setState({ token, user });
          
          // axios 헤더 설정
          const axios = (await import('../utils/axios')).default;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          console.log('AuthCallback: 로그인 성공');
          toast.success('로그인되었습니다!');
          navigate('/');
        } catch (error) {
          console.error('AuthCallback: 사용자 데이터 파싱 실패:', error);
          toast.error('로그인 처리 중 오류가 발생했습니다.');
          navigate('/login');
        }
      } else {
        console.error('AuthCallback: 토큰 또는 사용자 정보 없음');
        toast.error('로그인 정보가 없습니다.');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;