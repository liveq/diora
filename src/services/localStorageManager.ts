import { Chat, Message, ChatInfo, SessionStatus } from '../types/chat.types';

export class LocalStorageManager {
  private readonly CHATS_KEY = 'dioraChats';
  private readonly CURRENT_CHAT_KEY = 'dioraChatId';

  // 모든 채팅 가져오기
  getAllChats(): Chat[] {
    const chatsJson = localStorage.getItem(this.CHATS_KEY);
    if (!chatsJson) return [];

    try {
      const chats = JSON.parse(chatsJson);
      return Object.values(chats);
    } catch (error) {
      console.error('Failed to parse chats from localStorage:', error);
      return [];
    }
  }

  // 채팅 저장
  saveChat(chatId: string, chatInfo: ChatInfo, messages: Message[] = []): void {
    const chatsJson = localStorage.getItem(this.CHATS_KEY) || '{}';
    const chats = JSON.parse(chatsJson);

    chats[chatId] = {
      id: chatId,
      info: chatInfo,
      messages,
      statusHistory: []
    };

    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  // 채팅 정보 업데이트
  updateChatInfo(chatId: string, updates: Partial<ChatInfo>): void {
    const chatsJson = localStorage.getItem(this.CHATS_KEY) || '{}';
    const chats = JSON.parse(chatsJson);

    if (chats[chatId]) {
      chats[chatId].info = {
        ...chats[chatId].info,
        ...updates
      };
      localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
    }
  }

  // 메시지 추가
  addMessage(chatId: string, message: Message): void {
    const chatsJson = localStorage.getItem(this.CHATS_KEY) || '{}';
    const chats = JSON.parse(chatsJson);

    if (!chats[chatId]) {
      // 채팅이 없으면 새로 생성
      const newChatInfo: ChatInfo = {
        userId: 'anonymous',
        startTime: Date.now(),
        status: 'active' as SessionStatus,
        lastActivity: Date.now(),
        sessionCount: 1
      };
      chats[chatId] = {
        id: chatId,
        info: newChatInfo,
        messages: [message],
        statusHistory: []
      };
    } else {
      if (!chats[chatId].messages) {
        chats[chatId].messages = [];
      }
      chats[chatId].messages.push(message);
      // 마지막 활동 시간 업데이트
      chats[chatId].info.lastActivity = Date.now();
    }

    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  // 특정 채팅 가져오기
  getChat(chatId: string): Chat | null {
    const chatsJson = localStorage.getItem(this.CHATS_KEY) || '{}';
    const chats = JSON.parse(chatsJson);
    return chats[chatId] || null;
  }

  // 현재 채팅 ID 저장
  setCurrentChatId(chatId: string): void {
    localStorage.setItem(this.CURRENT_CHAT_KEY, chatId);
  }

  // 현재 채팅 ID 가져오기
  getCurrentChatId(): string | null {
    return localStorage.getItem(this.CURRENT_CHAT_KEY);
  }

  // 채팅 상태 업데이트
  updateChatStatus(chatId: string, status: SessionStatus, reason?: string): void {
    const updates: Partial<ChatInfo> = {
      status,
      lastActivity: Date.now()
    };

    if (status === 'closed') {
      updates.endTime = Date.now();
      updates.closeReason = (reason || 'manual') as any;
    }

    this.updateChatInfo(chatId, updates);
  }

  // 모든 채팅 데이터 초기화
  clearAllChats(): void {
    localStorage.removeItem(this.CHATS_KEY);
  }
}

export const localStorageManager = new LocalStorageManager();