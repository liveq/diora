import { database } from '../firebase';
import { ref, push, set, update, get } from 'firebase/database';
import { SessionStatus, CloseReason, ChatInfo } from '../types/chat.types';

export class SessionManager {
  private chatId: string | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30분
  private readonly HEARTBEAT_INTERVAL = 60 * 1000; // 1분

  // 세션 초기화
  async initializeSession(userId: string): Promise<string> {
    try {
      // localStorage에서 기존 채팅 ID 확인
      const existingChatId = localStorage.getItem('dioraChatId');

      if (existingChatId) {
        // 기존 세션 상태 확인
        const chatRef = ref(database, `chats/${existingChatId}/info`);
        const snapshot = await get(chatRef);
        const chatInfo = snapshot.val() as ChatInfo;

        if (chatInfo && chatInfo.status === 'closed') {
          // 종료된 세션이면 재개
          await this.reopenSession(existingChatId);
          return existingChatId;
        } else if (chatInfo && (chatInfo.status === 'active' || chatInfo.status === 'inactive')) {
          // 활성/비활성 세션이면 계속 사용
          this.chatId = existingChatId;
          this.startHeartbeat();
          this.resetInactivityTimer();
          return existingChatId;
        }
      }

      // 새 세션 생성
      const newChatRef = push(ref(database, 'chats'));
      const newChatId = newChatRef.key;

      if (newChatId) {
        const chatInfo = {
          userId,
          startTime: Date.now(),
          status: 'active',
          lastActivity: Date.now(),
          sessionCount: 1,
          userAgent: navigator.userAgent
        };

        await set(ref(database, `chats/${newChatId}/info`), chatInfo);

        // 상태 히스토리 초기화
        await this.addStatusHistory(newChatId, 'active', 'active', 'session_start', 'system');

        this.chatId = newChatId;
        localStorage.setItem('dioraChatId', newChatId);

        this.startHeartbeat();
        this.resetInactivityTimer();

        return newChatId;
      }

      throw new Error('Failed to create new chat session');
    } catch (error) {
      console.error('세션 초기화 실패:', error);
      throw error;
    }
  }

  // 세션 재개
  async reopenSession(chatId: string): Promise<void> {
    try {
      // 먼저 기존 세션 정보 가져오기
      const chatRef = ref(database, `chats/${chatId}/info`);
      const snapshot = await get(chatRef);
      const currentInfo = snapshot.val();
      const currentSessionCount = currentInfo?.sessionCount || 1;

      const updates: any = {
        [`chats/${chatId}/info/status`]: 'reopened',
        [`chats/${chatId}/info/sessionCount`]: currentSessionCount + 1,
        [`chats/${chatId}/info/lastActivity`]: Date.now()
      };

      await update(ref(database), updates);
      await this.addStatusHistory(chatId, 'closed', 'reopened', 'session_reopened', 'customer');

      this.chatId = chatId;
      localStorage.setItem('dioraChatId', chatId);

      this.startHeartbeat();
      this.resetInactivityTimer();

      // 시스템 메시지 추가
      await this.addSystemMessage(chatId, '이전 대화를 이어서 진행합니다.');
    } catch (error) {
      console.error('세션 재개 실패:', error);
      throw error;
    }
  }

  // 세션 상태 업데이트
  async updateSessionStatus(status: SessionStatus, reason?: string): Promise<void> {
    if (!this.chatId) return;

    try {
      const chatRef = ref(database, `chats/${this.chatId}/info`);
      const snapshot = await get(chatRef);
      const currentInfo = snapshot.val() as ChatInfo;

      const updates: any = {
        [`chats/${this.chatId}/info/status`]: status,
        [`chats/${this.chatId}/info/lastActivity`]: Date.now()
      };

      if (status === 'closed') {
        updates[`chats/${this.chatId}/info/endTime`] = Date.now();
        updates[`chats/${this.chatId}/info/closeReason`] = reason || 'manual';
        updates[`chats/${this.chatId}/info/closedBy`] = 'customer';
      }

      await update(ref(database), updates);
      await this.addStatusHistory(
        this.chatId,
        currentInfo.status,
        status,
        reason || 'status_change',
        'customer'
      );

      if (status === 'closed') {
        this.stopHeartbeat();
        this.clearInactivityTimer();
      }
    } catch (error) {
      console.error('세션 상태 업데이트 실패:', error);
      throw error;
    }
  }

  // 세션 종료
  async closeSession(reason: CloseReason): Promise<void> {
    if (!this.chatId) return;

    try {
      await this.updateSessionStatus('closed', reason);

      // 시스템 메시지 추가
      const reasonMessages: Record<CloseReason, string> = {
        manual: '대화가 종료되었습니다. 감사합니다.',
        beforeunload: '창이 닫혀 대화가 종료되었습니다.',
        timeout: '비활성 상태로 인해 대화가 자동 종료되었습니다.',
        admin_close: '관리자가 대화를 종료했습니다.'
      };

      await this.addSystemMessage(this.chatId, reasonMessages[reason]);

      // 필요 시 localStorage 클리어 (선택적)
      if (reason === 'manual') {
        localStorage.removeItem('dioraChatId');
      }
    } catch (error) {
      console.error('세션 종료 실패:', error);
      throw error;
    }
  }

  // 상태 히스토리 추가
  private async addStatusHistory(
    chatId: string,
    from: SessionStatus,
    to: SessionStatus,
    reason: string,
    triggeredBy: 'customer' | 'admin' | 'system'
  ): Promise<void> {
    const historyRef = push(ref(database, `chats/${chatId}/statusHistory`));
    await set(historyRef, {
      from,
      to,
      timestamp: Date.now(),
      reason,
      triggeredBy
    });
  }

  // 시스템 메시지 추가
  private async addSystemMessage(chatId: string, text: string): Promise<void> {
    const messageRef = push(ref(database, `chats/${chatId}/messages`));
    await set(messageRef, {
      text,
      sender: 'system',
      timestamp: Date.now(),
      type: 'system_notification'
    });
  }

  // 비활성 타이머 리셋
  resetInactivityTimer(): void {
    this.clearInactivityTimer();

    this.inactivityTimer = setTimeout(async () => {
      await this.updateSessionStatus('inactive', 'inactivity_timeout');
    }, this.INACTIVITY_TIMEOUT);
  }

  // 비활성 타이머 제거
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // 하트비트 시작
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(async () => {
      if (this.chatId) {
        await update(ref(database), {
          [`chats/${this.chatId}/info/lastActivity`]: Date.now()
        });
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  // 하트비트 중지
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // beforeunload 핸들러
  handleBeforeUnload = (): void => {
    if (this.chatId) {
      // Navigator.sendBeacon을 사용하여 비동기 없이 데이터 전송
      const data = JSON.stringify({
        chatId: this.chatId,
        status: 'closed',
        reason: 'beforeunload',
        timestamp: Date.now()
      });

      // Firebase REST API를 통한 직접 업데이트
      navigator.sendBeacon(
        `${process.env.REACT_APP_FIREBASE_DATABASE_URL}/chats/${this.chatId}/info/status.json`,
        data
      );
    }
  };

  // 현재 채팅 ID 반환
  getCurrentChatId(): string | null {
    return this.chatId;
  }

  // 클린업
  cleanup(): void {
    this.stopHeartbeat();
    this.clearInactivityTimer();
  }
}