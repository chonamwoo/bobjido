import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 URL (개발 환경에서는 로컬 IP 사용)
// Windows에서는 ipconfig로 확인한 IP 주소 사용
// Mac에서는 ifconfig로 확인한 IP 주소 사용
const API_BASE_URL = 'http://172.20.10.4:8888/api'; // 로컬 IP 주소

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;