// Chat Service - Handles both local and server chat operations
import axios from '../utils/axios';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location' | 'restaurant';
  restaurantData?: any;
  read: boolean;
}

interface Chat {
  id: string;
  type: 'personal' | 'group';
  name?: string;
  profileImage?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount: number;
  isOnline?: boolean;
  participants?: any[];
}

class ChatService {
  private pendingSync: any[] = [];

  async getChats(): Promise<Chat[]> {
    try {
      const response = await axios.get('/api/chat/list');
      if (response.data.success) {
        localStorage.setItem('mobile_chats_backup', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.log('서버에서 채팅 목록을 가져올 수 없어 로컬 데이터 사용');
    }
    
    const localChats = localStorage.getItem('mobile_chats_backup');
    return localChats ? JSON.parse(localChats) : [];
  }

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`/api/chat/${chatId}/messages`);
      if (response.data.success) {
        const messages = response.data.data || [];
        localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages));
        return messages;
      }
    } catch (error) {
      console.log('서버에서 메시지를 가져올 수 없어 로컬 데이터 사용');
    }
    
    // 로컬 데이터 반환 (없으면 빈 배열)
    const localMessages = localStorage.getItem(`messages_${chatId}`);
    return localMessages ? JSON.parse(localMessages) : [];
  }

  // 채팅방 생성
  async createChat(userId: string, userName: string, userImage?: string): Promise<{ chatId: string; chat: Chat }> {
    try {
      // 서버에 시도
      const response = await axios.post('/api/chat/create', {
        userId,
        type: 'personal'
      });

      if (response.data.success) {
        const chatId = response.data.data.chatId;
        
        // 채팅방 정보 가져오기
        const newChat: Chat = {
          id: chatId,
          type: 'personal',
          name: userName,
          profileImage: userImage || '/api/placeholder/100/100',
          lastMessage: '',
          timestamp: '방금',
          unreadCount: 0,
          isOnline: true,
          participants: [{ id: userId, username: userName, profileImage: userImage }]
        };
        
        // 서버 성공시 로컬에도 저장
        this.saveToLocal(newChat);
        
        // 새 채팅방의 빈 메시지 배열 초기화
        localStorage.setItem(`messages_${chatId}`, JSON.stringify([]));
        
        return { chatId, chat: newChat };
      }
    } catch (error) {
      console.log('서버 채팅방 생성 실패, 로컬에 저장', error);
      // 로컬 ID 생성
      const newChatId = `chat-${Date.now()}-${userId}`;
      const newChat: Chat = {
        id: newChatId,
        type: 'personal',
        name: userName,
        profileImage: userImage || '/api/placeholder/100/100',
        lastMessage: '',
        timestamp: '방금',
        unreadCount: 0,
        isOnline: true,
        participants: [{ id: userId, username: userName, profileImage: userImage }]
      };
      
      // 나중에 동기화할 수 있도록 대기열에 추가
      this.addToPendingSync('createChat', { userId, userName, userImage, localId: newChatId });
      
      // 로컬에 저장
      this.saveToLocal(newChat);
      
      // 새 채팅방의 빈 메시지 배열 초기화
      localStorage.setItem(`messages_${newChatId}`, JSON.stringify([]));
      
      return { chatId: newChatId, chat: newChat };
    }

    // 기본 에러 처리
    throw new Error('채팅방 생성에 실패했습니다');
  }

  // 메시지 전송
  async sendMessage(chatId: string, content: string, type: string = 'text'): Promise<Message> {
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      content,
      timestamp: new Date().toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: type as any,
      read: false
    };

    try {
      // 서버에 전송 시도
      const response = await axios.post(`/api/chat/${chatId}/messages`, {
        content,
        type
      });

      if (response.data.success) {
        message.id = response.data.data.id;
      }
    } catch (error) {
      console.log('서버 메시지 전송 실패, 로컬에 저장');
      // 나중에 동기화할 수 있도록 대기열에 추가
      this.addToPendingSync('sendMessage', { chatId, message });
    }

    // 로컬에 저장
    this.saveMessageLocal(chatId, message);
    return message;
  }

  // 로컬 저장 헬퍼
  private saveToLocal(chat: Chat) {
    const chats = this.getLocalChats();
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.unshift(chat);
    }
    
    localStorage.setItem('mobile_chats_backup', JSON.stringify(chats));
  }

  private saveMessageLocal(chatId: string, message: Message) {
    const messages = this.getLocalMessages(chatId);
    messages.push(message);
    localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages));
    
    // 채팅 목록도 업데이트
    const chats = this.getLocalChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex >= 0) {
      chats[chatIndex].lastMessage = message.content;
      chats[chatIndex].timestamp = message.timestamp;
      localStorage.setItem('mobile_chats_backup', JSON.stringify(chats));
    }
  }

  private getLocalChats(): Chat[] {
    const saved = localStorage.getItem('mobile_chats_backup');
    return saved ? JSON.parse(saved) : [];
  }

  private getLocalMessages(chatId: string): Message[] {
    const saved = localStorage.getItem(`messages_${chatId}`);
    return saved ? JSON.parse(saved) : [];
  }

  // 대기중인 동기화 작업 관리
  private addToPendingSync(action: string, data: any) {
    this.pendingSync.push({ action, data, timestamp: Date.now() });
    localStorage.setItem('pending_sync', JSON.stringify(this.pendingSync));
  }

  // 서버 연결 복구시 동기화
  async syncWithServer() {
    const pending = localStorage.getItem('pending_sync');
    if (!pending) return;

    const items = JSON.parse(pending);
    for (const item of items) {
      try {
        if (item.action === 'createChat') {
          await axios.post('/api/chat/create', {
            userId: item.data.userId,
            type: 'personal'
          });
        } else if (item.action === 'sendMessage') {
          await axios.post(`/api/chat/${item.data.chatId}/messages`, {
            content: item.data.message.content,
            type: item.data.message.type
          });
        }
      } catch (error) {
        console.log('동기화 실패:', error);
      }
    }
    
    // 성공적으로 동기화된 항목 제거
    localStorage.removeItem('pending_sync');
  }

  // 자동 응답 제거 - 실제 사용자 간 대화만 지원
}

export default new ChatService();