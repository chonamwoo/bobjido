// 로컬 스토리지 기반 실시간 동기화 유틸리티
// MongoDB 연결 문제 해결 전까지 임시로 사용

interface LikeData {
  playlistId: string;
  userId: string;
  liked: boolean;
  timestamp: number;
}

interface RestaurantLikeData {
  restaurantId: string;
  userId: string;
  liked: boolean;
  timestamp: number;
}

class SyncStorage {
  private static instance: SyncStorage;
  private listeners: Map<string, Set<Function>> = new Map();
  
  private constructor() {
    // storage 이벤트 리스너 등록 (다른 탭/윈도우에서의 변경사항 감지)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // 같은 탭에서의 변경사항도 감지하기 위한 커스텀 이벤트
    window.addEventListener('syncStorageUpdate', this.handleLocalUpdate.bind(this) as EventListener);
  }
  
  static getInstance(): SyncStorage {
    if (!SyncStorage.instance) {
      SyncStorage.instance = new SyncStorage();
    }
    return SyncStorage.instance;
  }
  
  // 플레이리스트 좋아요 상태 가져오기
  getPlaylistLikes(userId: string): Set<string> {
    const key = `likes_playlist_${userId}`;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const likes = JSON.parse(data);
        return new Set(likes);
      } catch (e) {
        console.error('Failed to parse likes data:', e);
      }
    }
    return new Set();
  }
  
  // 플레이리스트 좋아요 토글
  togglePlaylistLike(playlistId: string, userId: string): boolean {
    const key = `likes_playlist_${userId}`;
    const likes = this.getPlaylistLikes(userId);
    
    let isLiked: boolean;
    if (likes.has(playlistId)) {
      likes.delete(playlistId);
      isLiked = false;
    } else {
      likes.add(playlistId);
      isLiked = true;
    }
    
    // localStorage 업데이트
    localStorage.setItem(key, JSON.stringify(Array.from(likes)));
    
    // 전체 좋아요 카운트 업데이트
    this.updateLikeCount(`playlist_${playlistId}`, isLiked);
    
    // 같은 탭의 다른 컴포넌트에 알림
    this.notifyLocalUpdate(key, Array.from(likes));
    
    return isLiked;
  }
  
  // 레스토랑 좋아요 상태 가져오기
  getRestaurantLikes(userId: string): Set<string> {
    const key = `likes_restaurant_${userId}`;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const likes = JSON.parse(data);
        return new Set(likes);
      } catch (e) {
        console.error('Failed to parse likes data:', e);
      }
    }
    return new Set();
  }
  
  // 레스토랑 좋아요 토글
  toggleRestaurantLike(restaurantId: string, userId: string): boolean {
    const key = `likes_restaurant_${userId}`;
    const likes = this.getRestaurantLikes(userId);
    
    let isLiked: boolean;
    if (likes.has(restaurantId)) {
      likes.delete(restaurantId);
      isLiked = false;
    } else {
      likes.add(restaurantId);
      isLiked = true;
    }
    
    // localStorage 업데이트
    localStorage.setItem(key, JSON.stringify(Array.from(likes)));
    
    // 전체 좋아요 카운트 업데이트
    this.updateLikeCount(`restaurant_${restaurantId}`, isLiked);
    
    // 같은 탭의 다른 컴포넌트에 알림
    this.notifyLocalUpdate(key, Array.from(likes));
    
    return isLiked;
  }
  
  // 좋아요 총 개수 가져오기
  getLikeCount(itemId: string): number {
    const key = `like_count_${itemId}`;
    const count = localStorage.getItem(key);
    return count ? parseInt(count, 10) : 0;
  }
  
  // 좋아요 카운트 업데이트
  private updateLikeCount(itemId: string, increment: boolean) {
    const key = `like_count_${itemId}`;
    let count = this.getLikeCount(itemId);
    count = increment ? count + 1 : Math.max(0, count - 1);
    localStorage.setItem(key, count.toString());
    
    // 카운트 변경도 알림
    this.notifyLocalUpdate(key, count);
  }
  
  // 리스너 등록
  subscribe(key: string, callback: Function) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    
    // 언마운트 시 리스너 제거를 위한 함수 반환
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }
  
  // storage 이벤트 핸들러 (다른 탭/윈도우)
  private handleStorageChange(event: StorageEvent) {
    if (!event.key || !event.newValue) return;
    
    const listeners = this.listeners.get(event.key);
    if (listeners) {
      let value: any;
      try {
        value = JSON.parse(event.newValue);
      } catch {
        value = event.newValue;
      }
      
      listeners.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Error in storage listener:', error);
        }
      });
    }
  }
  
  // 커스텀 이벤트 핸들러 (같은 탭)
  private handleLocalUpdate(event: CustomEvent) {
    const { key, value } = event.detail;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(value);
        } catch (error) {
          console.error('Error in local update listener:', error);
        }
      });
    }
  }
  
  // 같은 탭의 다른 컴포넌트에 변경사항 알림
  private notifyLocalUpdate(key: string, value: any) {
    const event = new CustomEvent('syncStorageUpdate', {
      detail: { key, value }
    });
    window.dispatchEvent(event);
  }
  
  // 모든 좋아요 데이터 초기화 (테스트용)
  clearAllLikes(userId: string) {
    localStorage.removeItem(`likes_playlist_${userId}`);
    localStorage.removeItem(`likes_restaurant_${userId}`);
    
    // 모든 카운트도 초기화
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('like_count_')) {
        localStorage.removeItem(key);
      }
    });
    
    this.notifyLocalUpdate('clear_all', true);
  }
}

export const syncStorage = SyncStorage.getInstance();
export default syncStorage;