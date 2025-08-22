import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../utils/axios';

interface User {
  _id: string;
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
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
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

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/api/auth/login', { email, password });
          const { token, ...user } = response.data;
          
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

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/api/auth/register', {
            username,
            email,
            password,
          });
          const { token, ...user } = response.data;
          
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