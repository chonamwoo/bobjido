import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../utils/axios';

interface User {
  _id: string;
  userId: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  tasteProfile?: any;
  trustScore?: number;
  followerCount?: number;
  followingCount?: number;
  visitedRestaurantsCount?: number;
  password?: string;
  createdAt?: string;
  lastLogin?: string;
  onboardingCompleted?: boolean;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<void>;
  register: (userId: string, username: string, email: string, password: string, confirmPassword: string) => Promise<any>;
  logout: () => void;
  updateUser: (user: User) => void;
  updateFollowerCount: (count: number) => void;
  updateFollowingCount: (count: number) => void;
  incrementFollowers: () => void;
  decrementFollowers: () => void;
  incrementFollowing: () => void;
  decrementFollowing: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (loginId: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/api/auth/login', { loginId, password });
          const { data } = response.data;
          const { token, ...user } = data;
          
          // 카운트 정보가 없으면 기본값 추가
          const userWithCounts = {
            ...user,
            followerCount: user.followerCount ?? 3,
            followingCount: user.followingCount ?? 2,
            visitedRestaurantsCount: user.visitedRestaurantsCount ?? 56
          };
          
          set({ user: userWithCounts, token, isLoading: false });
          
          // Set axios default header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userId: string, username: string, email: string, password: string, confirmPassword: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/api/auth/register', {
            userId,
            username,
            email,
            password,
            confirmPassword,
          });
          
          const { data, requiresVerification } = response.data;
          
          // 이메일 인증이 필요한 경우
          if (requiresVerification) {
            set({ isLoading: false });
            return { requiresVerification, email };
          }
          
          // 인증이 필요 없는 경우 (소셜 로그인 등)
          const { token, ...user } = data;
          
          // 신규 가입자 기본 카운트 설정
          const userWithCounts = {
            ...user,
            followerCount: user.followerCount ?? 0,
            followingCount: user.followingCount ?? 0,
            visitedRestaurantsCount: user.visitedRestaurantsCount ?? 0
          };
          
          set({ user: userWithCounts, token, isLoading: false });
          
          // Set axios default header
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete axiosInstance.defaults.headers.common['Authorization'];
      },

      updateUser: (user: User) => {
        set({ user });
      },

      updateFollowerCount: (count: number) => {
        set((state) => ({
          user: state.user ? { ...state.user, followerCount: count } : null
        }));
      },

      updateFollowingCount: (count: number) => {
        set((state) => ({
          user: state.user ? { ...state.user, followingCount: count } : null
        }));
      },

      incrementFollowers: () => {
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            followerCount: (state.user.followerCount || 0) + 1 
          } : null
        }));
      },

      decrementFollowers: () => {
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            followerCount: Math.max((state.user.followerCount || 0) - 1, 0)
          } : null
        }));
      },

      incrementFollowing: () => {
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            followingCount: (state.user.followingCount || 0) + 1 
          } : null
        }));
      },

      decrementFollowing: () => {
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            followingCount: Math.max((state.user.followingCount || 0) - 1, 0)
          } : null
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);