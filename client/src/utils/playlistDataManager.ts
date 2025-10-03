// 플레이리스트 데이터 중앙 관리 시스템
// 모든 플레이리스트의 조회수, 좋아요 등을 일관되게 관리

import { useState, useEffect } from 'react';

interface PlaylistStats {
  viewCount: number;
  likeCount: number;
  saveCount: number;
  lastViewed?: Date;
  isLiked?: boolean;
  isSaved?: boolean;
}

class PlaylistDataManager {
  private storageKey = 'bobmap_playlist_stats';

  // 플레이리스트 통계 가져오기
  private getStats(): Record<string, PlaylistStats> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  // 모든 통계 초기화
  clearAllStats(): void {
    localStorage.removeItem(this.storageKey);
    console.log('[PlaylistDataManager] All stats cleared');
    window.dispatchEvent(new CustomEvent('playlistStats:update', { detail: {} }));
  }

  // 플레이리스트 통계 저장
  private saveStats(stats: Record<string, PlaylistStats>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
    console.log(`[PlaylistDataManager] Stats saved to localStorage:`, stats);
    // 실시간 업데이트를 위한 이벤트 발생
    window.dispatchEvent(new CustomEvent('playlistStats:update', { detail: stats }));
    console.log(`[PlaylistDataManager] Event 'playlistStats:update' dispatched`);
  }

  // 특정 플레이리스트의 통계 가져오기
  getPlaylistStats(playlistId: string): PlaylistStats {
    const stats = this.getStats();

    // 초기값 설정 - 플레이리스트 ID에 따라 다른 기본값 설정
    if (!stats[playlistId]) {
      let initialStats: PlaylistStats = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };

      // 미슐랭, 백종원, 성시경 등 유명 플레이리스트는 초기값 설정
      if (playlistId === 'certified-1') { // 미슐랭 가이드
        initialStats.viewCount = 1523;
        initialStats.likeCount = 89;
        initialStats.saveCount = 45;
      } else if (playlistId === 'certified-2') { // 백종원의 골목식당
        initialStats.viewCount = 2341;
        initialStats.likeCount = 156;
        initialStats.saveCount = 78;
      } else if (playlistId === 'certified-3') { // 성시경 먹을텐데
        initialStats.viewCount = 1892;
        initialStats.likeCount = 123;
        initialStats.saveCount = 67;
      } else if (playlistId === 'certified-4') { // 수요미식회
        initialStats.viewCount = 987;
        initialStats.likeCount = 76;
        initialStats.saveCount = 34;
      } else if (playlistId === 'certified-5') { // 흑백요리사
        initialStats.viewCount = 3456;
        initialStats.likeCount = 234;
        initialStats.saveCount = 125;
      }

      stats[playlistId] = initialStats;
      this.saveStats(stats);
    }

    return stats[playlistId];
  }

  // 조회수 증가
  incrementViewCount(playlistId: string): void {
    console.log(`[PlaylistDataManager] incrementViewCount called for ${playlistId}`);
    const stats = this.getStats();
    if (!stats[playlistId]) {
      console.log(`[PlaylistDataManager] Creating new stats for ${playlistId}`);
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }

    // 마지막 조회 시간 체크 (동일 세션에서 중복 카운트 방지)
    const lastViewed = stats[playlistId].lastViewed;
    const now = new Date();

    // 10초 이내 재방문은 카운트하지 않음 (테스트를 위해 5분에서 10초로 변경)
    if (!lastViewed || (now.getTime() - new Date(lastViewed).getTime()) > 10 * 1000) {
      stats[playlistId].viewCount += 1;
      stats[playlistId].lastViewed = now;
      this.saveStats(stats);
      console.log(`[PlaylistDataManager] ✅ View count increased for ${playlistId}: ${stats[playlistId].viewCount}`);
    } else {
      const timeSinceLastView = (now.getTime() - new Date(lastViewed).getTime()) / 1000;
      console.log(`[PlaylistDataManager] ⏭️ Skipping view count for ${playlistId} (viewed ${timeSinceLastView}s ago)`);
    }
  }

  // 좋아요 카운트 증가
  incrementLikeCount(playlistId: string): void {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }
    stats[playlistId].likeCount += 1;
    stats[playlistId].isLiked = true;
    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Like count increased for ${playlistId}: ${stats[playlistId].likeCount}`);
  }

  // 좋아요 카운트 감소
  decrementLikeCount(playlistId: string): void {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }
    stats[playlistId].likeCount = Math.max(0, stats[playlistId].likeCount - 1);
    stats[playlistId].isLiked = false;
    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Like count decreased for ${playlistId}: ${stats[playlistId].likeCount}`);
  }

  // 저장 카운트 증가
  incrementSaveCount(playlistId: string): void {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }
    stats[playlistId].saveCount += 1;
    stats[playlistId].isSaved = true;
    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Save count increased for ${playlistId}: ${stats[playlistId].saveCount}`);
  }

  // 저장 카운트 감소
  decrementSaveCount(playlistId: string): void {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }
    stats[playlistId].saveCount = Math.max(0, stats[playlistId].saveCount - 1);
    stats[playlistId].isSaved = false;
    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Save count decreased for ${playlistId}: ${stats[playlistId].saveCount}`);
  }

  // 좋아요 토글
  toggleLike(playlistId: string): boolean {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }

    stats[playlistId].isLiked = !stats[playlistId].isLiked;

    if (stats[playlistId].isLiked) {
      stats[playlistId].likeCount += 1;
    } else {
      stats[playlistId].likeCount = Math.max(0, stats[playlistId].likeCount - 1);
    }

    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Like toggled for ${playlistId}: ${stats[playlistId].isLiked}, count: ${stats[playlistId].likeCount}`);
    return stats[playlistId].isLiked || false;
  }

  // 저장 토글
  toggleSave(playlistId: string): boolean {
    const stats = this.getStats();
    if (!stats[playlistId]) {
      stats[playlistId] = {
        viewCount: 0,
        likeCount: 0,
        saveCount: 0,
        isLiked: false,
        isSaved: false
      };
    }

    stats[playlistId].isSaved = !stats[playlistId].isSaved;

    if (stats[playlistId].isSaved) {
      stats[playlistId].saveCount += 1;
    } else {
      stats[playlistId].saveCount = Math.max(0, stats[playlistId].saveCount - 1);
    }

    this.saveStats(stats);
    console.log(`[PlaylistDataManager] Save toggled for ${playlistId}: ${stats[playlistId].isSaved}, count: ${stats[playlistId].saveCount}`);
    return stats[playlistId].isSaved || false;
  }

  // 플레이리스트 데이터와 통계 병합
  mergePlaylistWithStats(playlist: any): any {
    const stats = this.getPlaylistStats(playlist.id || playlist._id);

    return {
      ...playlist,
      viewCount: stats.viewCount,
      likeCount: stats.likeCount,
      saveCount: stats.saveCount,
      isLiked: stats.isLiked,
      isSaved: stats.isSaved
    };
  }

  // 여러 플레이리스트 데이터와 통계 병합
  mergePlaylists(playlists: any[]): any[] {
    return playlists.map(playlist => this.mergePlaylistWithStats(playlist));
  }

  // 통계 초기화 (디버깅용)
  resetStats(playlistId?: string): void {
    if (playlistId) {
      const stats = this.getStats();
      delete stats[playlistId];
      this.saveStats(stats);
      console.log(`[PlaylistDataManager] Stats reset for playlist ${playlistId}`);
    } else {
      localStorage.removeItem(this.storageKey);
      console.log(`[PlaylistDataManager] All stats reset`);
      // 이벤트 발생시켜서 UI 업데이트
      window.dispatchEvent(new CustomEvent('playlistStats:update', { detail: {} }));
    }
  }
}

// 싱글톤 인스턴스
export const playlistDataManager = new PlaylistDataManager();

// React Hook
export function usePlaylistStats(playlistId: string) {
  const [stats, setStats] = useState(playlistDataManager.getPlaylistStats(playlistId));

  useEffect(() => {
    const handleUpdate = () => {
      setStats(playlistDataManager.getPlaylistStats(playlistId));
    };

    window.addEventListener('playlistStats:update', handleUpdate);
    return () => window.removeEventListener('playlistStats:update', handleUpdate);
  }, [playlistId]);

  return stats;
}