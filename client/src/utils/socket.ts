import React from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    console.log('🔄 WebSocket 연결 중...');
    
    this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // 연결 성공
    this.socket.on('connect', () => {
      console.log('✅ WebSocket 연결 성공');
      this.reconnectAttempts = 0;
      
      // 사용자가 참여한 모든 채팅방에 입장
      this.socket?.emit('join_chats');
    });

    // 연결 실패
    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket 연결 실패:', error.message);
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        
        setTimeout(() => {
          this.socket?.connect();
        }, 2000 * this.reconnectAttempts);
      } else {
        toast.error('채팅 서버 연결에 실패했습니다.');
      }
    });

    // 연결 해제
    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket 연결 해제:', reason);
      
      if (reason === 'io server disconnect') {
        // 서버에서 연결을 끊은 경우 재연결
        this.socket?.connect();
      }
    });

    // 새 메시지 수신
    this.socket.on('new_message', (message) => {
      console.log('💬 새 메시지 수신:', message);
      
      // 커스텀 이벤트 발생 (React 컴포넌트에서 리스닝)
      window.dispatchEvent(new CustomEvent('new_message', { 
        detail: message 
      }));

      // 알림 표시 (현재 채팅방이 아닌 경우)
      if (!window.location.pathname.includes(`/chat/${message.chatId}`)) {
        toast.success(`${message.senderName}: ${message.content}`, {
          icon: '💬',
          duration: 4000
        });
      }
    });

    // 타이핑 상태
    this.socket.on('user_typing', (data) => {
      window.dispatchEvent(new CustomEvent('user_typing', { 
        detail: data 
      }));
    });

    // 메시지 읽음 상태
    this.socket.on('messages_read', (data) => {
      window.dispatchEvent(new CustomEvent('messages_read', { 
        detail: data 
      }));
    });

    // 매칭 알림
    this.socket.on('match_notification', (notification) => {
      console.log('💕 매칭 알림:', notification);
      
      const messages = {
        like: '님이 회원님을 좋아합니다!',
        superlike: '님이 회원님에게 슈퍼라이크를 보냈습니다! ⭐',
        match: '님과 매치되었습니다! 💕'
      };

      toast.success(
        `${notification.from.username}${messages[notification.type as keyof typeof messages]}`,
        {
          icon: notification.type === 'match' ? '💕' : '💖',
          duration: 6000
        }
      );

      // 매칭 이벤트 발생
      window.dispatchEvent(new CustomEvent('match_notification', { 
        detail: notification 
      }));
    });

    // 사용자 온라인/오프라인
    this.socket.on('user_online', (data) => {
      window.dispatchEvent(new CustomEvent('user_online', { 
        detail: data 
      }));
    });

    this.socket.on('user_offline', (data) => {
      window.dispatchEvent(new CustomEvent('user_offline', { 
        detail: data 
      }));
    });

    // 에러 처리
    this.socket.on('error', (error) => {
      console.error('Socket 에러:', error);
      toast.error(error.message || '연결 오류가 발생했습니다.');
    });
  }

  // 채팅방 입장
  joinChat(chatId: string) {
    this.socket?.emit('join_chat', chatId);
  }

  // 채팅방 나가기
  leaveChat(chatId: string) {
    this.socket?.emit('leave_chat', chatId);
  }

  // 메시지 전송
  sendMessage(chatId: string, content: string, type = 'text', restaurantData?: any) {
    this.socket?.emit('send_message', {
      chatId,
      content,
      type,
      restaurantData
    });
  }

  // 타이핑 시작
  startTyping(chatId: string) {
    this.socket?.emit('typing_start', chatId);
  }

  // 타이핑 중지
  stopTyping(chatId: string) {
    this.socket?.emit('typing_stop', chatId);
  }

  // 메시지 읽음 처리
  markMessagesRead(chatId: string) {
    this.socket?.emit('mark_messages_read', chatId);
  }

  // 매칭 알림 전송
  sendMatchNotification(targetUserId: string, type: string, message: string) {
    this.socket?.emit('send_match_notification', {
      targetUserId,
      type,
      message
    });
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    console.log('🔌 WebSocket 연결 해제');
  }

  // 소켓 인스턴스 반환
  getSocket(): Socket | null {
    return this.socket;
  }
}

// 싱글톤 패턴
export const socketManager = new SocketManager();

// React 훅으로 사용하기 위한 유틸리티
export const useSocket = () => {
  const { token } = useAuthStore();

  const connect = () => {
    if (token) {
      socketManager.connect(token);
    }
  };

  const disconnect = () => {
    socketManager.disconnect();
  };

  return {
    connect,
    disconnect,
    joinChat: socketManager.joinChat.bind(socketManager),
    leaveChat: socketManager.leaveChat.bind(socketManager),
    sendMessage: socketManager.sendMessage.bind(socketManager),
    startTyping: socketManager.startTyping.bind(socketManager),
    stopTyping: socketManager.stopTyping.bind(socketManager),
    markMessagesRead: socketManager.markMessagesRead.bind(socketManager),
    sendMatchNotification: socketManager.sendMatchNotification.bind(socketManager),
    isConnected: socketManager.isConnected.bind(socketManager)
  };
};

// 이벤트 리스너 훅
export const useSocketEvent = (eventName: string, handler: (data: any) => void) => {
  React.useEffect(() => {
    const handleEvent = (event: CustomEvent) => {
      handler(event.detail);
    };

    window.addEventListener(eventName, handleEvent as EventListener);
    
    return () => {
      window.removeEventListener(eventName, handleEvent as EventListener);
    };
  }, [eventName, handler]);
};

export default socketManager;