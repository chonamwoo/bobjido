import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8888';
    
    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupBaseListeners();
    console.log('Socket connecting to:', serverUrl);
  }

  private setupBaseListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.socket?.emit('join_chats');
      this.emit('socket_connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.emit('socket_disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.emit('socket_error', error);
    });

    // 사용자 온라인/오프라인 상태
    this.socket.on('user_online', (data: any) => {
      this.emit('user_online', data);
    });

    this.socket.on('user_offline', (data: any) => {
      this.emit('user_offline', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // 채팅 관련 메서드
  joinChat(chatId: string) {
    this.socket?.emit('join_chat', chatId);
  }

  leaveChat(chatId: string) {
    this.socket?.emit('leave_chat', chatId);
  }

  sendMessage(chatId: string, content: string, type: string = 'text', additionalData?: any) {
    this.socket?.emit('send_message', {
      chatId,
      content,
      type,
      ...additionalData
    });
  }

  markMessagesAsRead(chatId: string) {
    this.socket?.emit('mark_messages_read', chatId);
  }

  startTyping(chatId: string) {
    this.socket?.emit('typing_start', chatId);
  }

  stopTyping(chatId: string) {
    this.socket?.emit('typing_stop', chatId);
  }

  // 알림 관련 메서드
  sendFollowNotification(targetUserId: string) {
    this.socket?.emit('notification_follow', targetUserId);
  }

  sendPlaylistLikeNotification(playlistId: string, ownerId: string, playlistTitle: string) {
    this.socket?.emit('notification_playlist_like', {
      playlistId,
      ownerId,
      playlistTitle
    });
  }

  sendPlaylistSaveNotification(playlistId: string, ownerId: string, playlistTitle: string) {
    this.socket?.emit('notification_playlist_save', {
      playlistId,
      ownerId,
      playlistTitle
    });
  }

  sendNewPlaylistNotification(playlistId: string, playlistTitle: string) {
    this.socket?.emit('notification_new_playlist', {
      playlistId,
      playlistTitle
    });
  }

  markNotificationAsRead(notificationId: string) {
    this.socket?.emit('mark_notification_read', notificationId);
  }

  markAllNotificationsAsRead() {
    this.socket?.emit('mark_all_notifications_read');
  }

  getUnreadNotificationsCount() {
    this.socket?.emit('get_unread_notifications_count');
  }

  // 이벤트 리스너 관리
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    // 실제 소켓 이벤트 리스너 등록
    if (this.socket && !this.socket.hasListeners(event)) {
      this.socket.on(event, (data: any) => {
        this.emit(event, data);
      });
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const listeners = this.listeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  private emit(event: string, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();