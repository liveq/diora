// 채팅 시스템 타입 정의
export type SessionStatus = 'active' | 'closed' | 'reopened' | 'inactive';
export type CloseReason = 'manual' | 'beforeunload' | 'timeout' | 'admin_close';
export type SenderType = 'customer' | 'admin' | 'system';

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp: number;
  type?: 'message' | 'status_change' | 'system_notification';
}

export interface ChatInfo {
  userId: string;
  startTime: number;
  endTime?: number;
  status: SessionStatus;
  lastActivity: number;
  userAgent?: string;
  sessionCount: number;
  closedBy?: 'customer' | 'admin' | 'system';
  closeReason?: CloseReason;
}

export interface StatusHistory {
  id: string;
  from: SessionStatus;
  to: SessionStatus;
  timestamp: number;
  reason: string;
  triggeredBy: 'customer' | 'admin' | 'system';
}

export interface Chat {
  id: string;
  info: ChatInfo;
  messages: Message[];
  statusHistory?: StatusHistory[];
}

export interface ChatSession {
  chatId: string | null;
  sessionStatus: SessionStatus;
  messages: Message[];
  isTyping: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}