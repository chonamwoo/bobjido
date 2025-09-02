// 로컬 스토리지를 활용한 데이터 관리 시스템
// MongoDB와 연동하기 전 임시 데이터 저장소

import { useState, useEffect } from 'react';

interface SavedRestaurant {
  restaurantId: string;
  savedAt: Date;
  notes?: string;
}

interface SavedPlaylist {
  playlistId: string;
  savedAt: Date;
}

interface GameResult {
  gameType: string;
  choices: any[];
  result: any;
  playedAt: Date;
}

interface VisitedRestaurant {
  restaurantId: string;
  visitDate: Date;
  category?: string;
  location?: string;
  rating?: number;
}

interface UserTasteAnalysis {
  favoriteCategories: { [category: string]: number };
  favoriteLocations: { [location: string]: number };
  visitFrequency: number;
  averageRating: number;
  tastePattern: 'adventurous' | 'traditional' | 'balanced' | 'casual' | 'gourmet';
}

interface UserData {
  savedRestaurants: SavedRestaurant[];
  savedPlaylists: SavedPlaylist[];
  likedRestaurants: string[];
  likedPlaylists: string[];
  visitedRestaurants: VisitedRestaurant[];
  reviews: Review[];
  gameResults: GameResult[];
  tasteProfile?: any;
  tasteAnalysis?: UserTasteAnalysis;
}

interface Review {
  restaurantId: string;
  rating: number;
  content: string;
  createdAt: Date;
}

class DataManager {
  private storageKey = 'bobmap_user_data';
  
  // 사용자 데이터 가져오기
  getUserData(): UserData {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      return JSON.parse(data);
    }
    
    // 초기 데이터 구조
    return {
      savedRestaurants: [],
      savedPlaylists: [],
      likedRestaurants: [],
      likedPlaylists: [],
      visitedRestaurants: [],
      reviews: [],
      gameResults: [],
      tasteProfile: null
    };
  }
  
  // 사용자 데이터 저장
  saveUserData(data: UserData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('dataManager:update', { detail: data }));
    // Also dispatch storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'));
  }
  
  // 맛집 저장
  saveRestaurant(restaurantId: string, notes?: string): void {
    const userData = this.getUserData();
    
    // 중복 체크
    const exists = userData.savedRestaurants.some(r => r.restaurantId === restaurantId);
    if (!exists) {
      userData.savedRestaurants.push({
        restaurantId,
        savedAt: new Date(),
        notes
      });
      this.saveUserData(userData);
      console.log(`Restaurant ${restaurantId} saved`);
    } else {
      console.log(`Restaurant ${restaurantId} already saved`);
    }
  }
  
  // 맛집 저장 취소
  unsaveRestaurant(restaurantId: string): void {
    const userData = this.getUserData();
    userData.savedRestaurants = userData.savedRestaurants.filter(
      r => r.restaurantId !== restaurantId
    );
    this.saveUserData(userData);
  }
  
  // 맛집 저장 여부 확인
  isRestaurantSaved(restaurantId: string): boolean {
    const userData = this.getUserData();
    return userData.savedRestaurants.some(r => r.restaurantId === restaurantId);
  }
  
  // 저장된 맛집 목록 가져오기
  getSavedRestaurants(): SavedRestaurant[] {
    const userData = this.getUserData();
    return userData.savedRestaurants;
  }
  
  // 플레이리스트 저장
  savePlaylist(playlistId: string): void {
    const userData = this.getUserData();
    
    const exists = userData.savedPlaylists.some(p => p.playlistId === playlistId);
    if (!exists) {
      userData.savedPlaylists.push({
        playlistId,
        savedAt: new Date()
      });
      this.saveUserData(userData);
      console.log(`Playlist ${playlistId} saved`);
    } else {
      console.log(`Playlist ${playlistId} already saved`);
    }
  }
  
  // 플레이리스트 저장 취소
  unsavePlaylist(playlistId: string): void {
    const userData = this.getUserData();
    userData.savedPlaylists = userData.savedPlaylists.filter(
      p => p.playlistId !== playlistId
    );
    this.saveUserData(userData);
  }
  
  // 플레이리스트 저장 여부 확인
  isPlaylistSaved(playlistId: string): boolean {
    const userData = this.getUserData();
    return userData.savedPlaylists.some(p => p.playlistId === playlistId);
  }
  
  // 저장된 플레이리스트 목록 가져오기
  getSavedPlaylists(): SavedPlaylist[] {
    const userData = this.getUserData();
    return userData.savedPlaylists;
  }
  
  // 좋아요 토글 (맛집)
  toggleRestaurantLike(restaurantId: string): boolean {
    const userData = this.getUserData();
    const index = userData.likedRestaurants.indexOf(restaurantId);
    
    if (index > -1) {
      userData.likedRestaurants.splice(index, 1);
      this.saveUserData(userData);
      return false;
    } else {
      userData.likedRestaurants.push(restaurantId);
      this.saveUserData(userData);
      return true;
    }
  }
  
  // 좋아요 여부 확인 (맛집)
  isRestaurantLiked(restaurantId: string): boolean {
    const userData = this.getUserData();
    return userData.likedRestaurants.includes(restaurantId);
  }
  
  // 좋아요 토글 (플레이리스트)
  togglePlaylistLike(playlistId: string): boolean {
    const userData = this.getUserData();
    const index = userData.likedPlaylists.indexOf(playlistId);
    
    if (index > -1) {
      userData.likedPlaylists.splice(index, 1);
      this.saveUserData(userData);
      return false;
    } else {
      userData.likedPlaylists.push(playlistId);
      this.saveUserData(userData);
      return true;
    }
  }
  
  // 좋아요 여부 확인 (플레이리스트)
  isPlaylistLiked(playlistId: string): boolean {
    const userData = this.getUserData();
    return userData.likedPlaylists.includes(playlistId);
  }
  
  // 방문한 맛집 추가 (개선된 버전)
  addVisitedRestaurant(restaurantId: string, category?: string, location?: string, rating?: number): void {
    const userData = this.getUserData();
    
    // Convert old format to new format if needed
    if (userData.visitedRestaurants && typeof userData.visitedRestaurants[0] === 'string') {
      userData.visitedRestaurants = (userData.visitedRestaurants as any[]).map(id => ({
        restaurantId: id,
        visitDate: new Date(),
        category: '',
        location: '',
        rating: 0
      }));
    }
    
    // Check if already visited
    const existingIndex = userData.visitedRestaurants.findIndex(
      (v: VisitedRestaurant) => v.restaurantId === restaurantId
    );
    
    if (existingIndex === -1) {
      // Add new visit
      userData.visitedRestaurants.push({
        restaurantId,
        visitDate: new Date(),
        category,
        location,
        rating
      });
    } else {
      // Update existing visit
      userData.visitedRestaurants[existingIndex] = {
        restaurantId,
        visitDate: new Date(),
        category: category || userData.visitedRestaurants[existingIndex].category,
        location: location || userData.visitedRestaurants[existingIndex].location,
        rating: rating || userData.visitedRestaurants[existingIndex].rating
      };
    }
    
    // Update taste analysis
    this.updateTasteAnalysis(userData);
    this.saveUserData(userData);
  }
  
  // 방문한 맛집 목록 가져오기
  getVisitedRestaurants(): VisitedRestaurant[] {
    const userData = this.getUserData();
    
    // Convert old format to new format if needed
    if (userData.visitedRestaurants && typeof userData.visitedRestaurants[0] === 'string') {
      return (userData.visitedRestaurants as any[]).map(id => ({
        restaurantId: id,
        visitDate: new Date(),
        category: '',
        location: '',
        rating: 0
      }));
    }
    
    return userData.visitedRestaurants as VisitedRestaurant[];
  }
  
  // 취향 분석 업데이트
  private updateTasteAnalysis(userData: UserData): void {
    const visits = userData.visitedRestaurants as VisitedRestaurant[];
    
    if (!visits || visits.length === 0) {
      return;
    }
    
    // Category frequency analysis
    const categoryCount: { [key: string]: number } = {};
    const locationCount: { [key: string]: number } = {};
    let totalRating = 0;
    let ratingCount = 0;
    
    visits.forEach(visit => {
      if (visit.category) {
        categoryCount[visit.category] = (categoryCount[visit.category] || 0) + 1;
      }
      if (visit.location) {
        locationCount[visit.location] = (locationCount[visit.location] || 0) + 1;
      }
      if (visit.rating) {
        totalRating += visit.rating;
        ratingCount++;
      }
    });
    
    // Determine taste pattern
    let tastePattern: UserTasteAnalysis['tastePattern'] = 'balanced';
    const uniqueCategories = Object.keys(categoryCount).length;
    const visitFrequency = visits.length;
    
    if (uniqueCategories > 5 && visitFrequency > 10) {
      tastePattern = 'adventurous';
    } else if (uniqueCategories <= 2) {
      tastePattern = 'traditional';
    } else if (ratingCount > 0 && totalRating / ratingCount >= 4.5) {
      tastePattern = 'gourmet';
    } else if (visitFrequency < 5) {
      tastePattern = 'casual';
    }
    
    userData.tasteAnalysis = {
      favoriteCategories: categoryCount,
      favoriteLocations: locationCount,
      visitFrequency: visitFrequency,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      tastePattern: tastePattern
    };
  }
  
  // 취향 분석 가져오기
  getTasteAnalysis(): UserTasteAnalysis | undefined {
    const userData = this.getUserData();
    
    // Update analysis if not present
    if (!userData.tasteAnalysis) {
      this.updateTasteAnalysis(userData);
      this.saveUserData(userData);
    }
    
    return userData.tasteAnalysis;
  }
  
  // 리뷰 추가
  addReview(restaurantId: string, rating: number, content: string): void {
    const userData = this.getUserData();
    userData.reviews.push({
      restaurantId,
      rating,
      content,
      createdAt: new Date()
    });
    this.saveUserData(userData);
  }
  
  // 특정 맛집의 리뷰 가져오기
  getRestaurantReviews(restaurantId: string): Review[] {
    const userData = this.getUserData();
    return userData.reviews.filter(r => r.restaurantId === restaurantId);
  }
  
  // 게임 결과 저장
  saveGameResult(gameType: string, choices: any[], result: any): void {
    const userData = this.getUserData();
    userData.gameResults.push({
      gameType,
      choices,
      result,
      playedAt: new Date()
    });
    
    // 취향 프로필 업데이트
    if (result.tasteProfile) {
      userData.tasteProfile = result.tasteProfile;
    }
    
    this.saveUserData(userData);
  }
  
  // 게임 결과 가져오기
  getGameResults(): GameResult[] {
    const userData = this.getUserData();
    return userData.gameResults || [];
  }
  
  // 취향 프로필 가져오기
  getTasteProfile(): any {
    const userData = this.getUserData();
    return userData.tasteProfile;
  }
  
  // 취향 프로필 업데이트
  updateTasteProfile(profile: any): void {
    const userData = this.getUserData();
    userData.tasteProfile = profile;
    this.saveUserData(userData);
  }
  
  // 모든 데이터 초기화
  clearAllData(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  // 데이터 내보내기 (백업)
  exportData(): string {
    const userData = this.getUserData();
    return JSON.stringify(userData, null, 2);
  }
  
  // 데이터 가져오기 (복원)
  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      this.saveUserData(data);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      throw new Error('잘못된 데이터 형식입니다.');
    }
  }
}

// 싱글톤 인스턴스
export const dataManager = new DataManager();

// Export new types
export type { VisitedRestaurant, UserTasteAnalysis };

// Hook for React components

export function useSavedRestaurants() {
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  useEffect(() => {
    // 저장된 데이터 가져오기
    const data = dataManager.getSavedRestaurants();
    setSavedRestaurants(data);
    
    // storage 이벤트 리스너 추가
    const handleStorageChange = () => {
      setSavedRestaurants(dataManager.getSavedRestaurants());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너
    const handleDataUpdate = () => {
      setSavedRestaurants(dataManager.getSavedRestaurants());
    };
    
    window.addEventListener('dataManager:update', handleDataUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataManager:update', handleDataUpdate);
    };
  }, [updateTrigger]);
  
  const saveRestaurant = (restaurantId: string, notes?: string) => {
    dataManager.saveRestaurant(restaurantId, notes);
    setSavedRestaurants(dataManager.getSavedRestaurants());
    setUpdateTrigger(prev => prev + 1);
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('dataManager:update'));
  };
  
  const unsaveRestaurant = (restaurantId: string) => {
    dataManager.unsaveRestaurant(restaurantId);
    setSavedRestaurants(dataManager.getSavedRestaurants());
    setUpdateTrigger(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('dataManager:update'));
  };
  
  const isSaved = (restaurantId: string) => {
    return dataManager.isRestaurantSaved(restaurantId);
  };
  
  return {
    savedRestaurants,
    saveRestaurant,
    unsaveRestaurant,
    isSaved
  };
}

export function useSavedPlaylists() {
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  useEffect(() => {
    // 저장된 데이터 가져오기
    const data = dataManager.getSavedPlaylists();
    setSavedPlaylists(data);
    
    // storage 이벤트 리스너 추가
    const handleStorageChange = () => {
      setSavedPlaylists(dataManager.getSavedPlaylists());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너
    const handleDataUpdate = () => {
      setSavedPlaylists(dataManager.getSavedPlaylists());
    };
    
    window.addEventListener('dataManager:update', handleDataUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataManager:update', handleDataUpdate);
    };
  }, [updateTrigger]);
  
  const savePlaylist = (playlistId: string) => {
    dataManager.savePlaylist(playlistId);
    setSavedPlaylists(dataManager.getSavedPlaylists());
    setUpdateTrigger(prev => prev + 1);
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('dataManager:update'));
  };
  
  const unsavePlaylist = (playlistId: string) => {
    dataManager.unsavePlaylist(playlistId);
    setSavedPlaylists(dataManager.getSavedPlaylists());
    setUpdateTrigger(prev => prev + 1);
    window.dispatchEvent(new CustomEvent('dataManager:update'));
  };
  
  const isSaved = (playlistId: string) => {
    return dataManager.isPlaylistSaved(playlistId);
  };
  
  return {
    savedPlaylists,
    savePlaylist,
    unsavePlaylist,
    isSaved
  };
}