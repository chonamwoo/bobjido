import axios from 'axios';

// Create axios instance with default config
// API URL 설정 - 8888 포트 사용 (프로젝트 표준)
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8888';
console.log('=== Axios 설정 ===');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('baseURL:', baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000, // 30초로 증가 (파일 업로드 고려)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('=== Axios 요청 ===');
    console.log('Method:', config.method);
    console.log('URL:', config.url);
    console.log('Full URL:', `${config.baseURL}${config.url}`);
    
    // Add auth token if exists
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    
    // multipart/form-data 요청 시 Content-Type 헤더 제거 (브라우저가 자동 설정)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;