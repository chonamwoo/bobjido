import axios from 'axios';

// Admin 전용 axios 인스턴스
const adminAxios = axios.create({
  baseURL: 'http://localhost:8888',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - 모든 요청에 Admin 헤더 추가
adminAxios.interceptors.request.use(
  (config) => {
    // Admin 인증 헤더 추가
    config.headers['X-Admin-Auth'] = 'true';
    
    // Admin 토큰이 있으면 추가 (선택사항)
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 에러 처리
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Admin 권한 없음
      console.error('Admin authorization required');
      // 로그인 페이지로 리다이렉트 가능
    }
    return Promise.reject(error);
  }
);

export default adminAxios;