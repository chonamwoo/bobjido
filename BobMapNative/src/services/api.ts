import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api.config';

class ApiService {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem('token');
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('token', token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async register(username: string, email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    
    if (data.token) {
      await this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    await this.clearToken();
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  // Playlist endpoints
  async getPlaylists(page = 1, limit = 20) {
    return this.request(`/playlists?page=${page}&limit=${limit}`);
  }

  async getPlaylist(id: string) {
    return this.request(`/playlists/${id}`);
  }

  async createPlaylist(data: any) {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePlaylist(id: string) {
    return this.request(`/playlists/${id}/like`, {
      method: 'POST',
    });
  }

  async savePlaylist(id: string) {
    return this.request(`/playlists/${id}/save`, {
      method: 'POST',
    });
  }

  // Restaurant endpoints
  async searchRestaurants(query: string) {
    return this.request(`/restaurants/search?q=${encodeURIComponent(query)}`);
  }

  async getRestaurant(id: string) {
    return this.request(`/restaurants/${id}`);
  }

  async getNearbyRestaurants(lat: number, lng: number, radius = 1000) {
    return this.request(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Chat endpoints
  async getChats() {
    return this.request('/chat/list');
  }

  async getMessages(chatId: string) {
    return this.request(`/chat/${chatId}/messages`);
  }

  async sendMessage(chatId: string, content: string, type = 'text') {
    return this.request(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    });
  }

  // Follow endpoints
  async followUser(userId: string) {
    return this.request(`/social/follow/${userId}`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string) {
    return this.request(`/social/unfollow/${userId}`, {
      method: 'POST',
    });
  }
}

export default new ApiService();