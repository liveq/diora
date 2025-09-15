import React, { useState, useEffect, useMemo } from 'react';
import { database, auth } from '../firebase';
import { ref, onValue, push, update } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import './AdminPage.css';
import { Chat, SessionStatus, Message } from '../types/chat.types';
import { sendSessionNotification } from '../services/telegramNotifications';
import { localStorageManager } from '../services/localStorageManager';

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | SessionStatus>('all');

  // 모든 채팅 불러오기 - Firebase 우선 사용
  useEffect(() => {
    // 익명 로그인 후 Firebase 리스너 설정
    const initializeAdmin = async () => {
      try {
        // 익명 로그인 (이미 로그인되어 있으면 기존 세션 사용)
        await signInAnonymously(auth);
        console.log('Admin authenticated successfully');
      } catch (error) {
        console.log('Auth error (may already be authenticated):', error);
      }

      // Firebase 리스너 (메인 데이터 소스)
      const chatsRef = ref(database, 'chats');
      const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatsList: Chat[] = Object.entries(data).map(([chatId, chatData]: [string, any]) => {
          const messages = chatData.messages ?
            Object.entries(chatData.messages).map(([msgId, msgData]: [string, any]) => ({
              id: msgId,
              ...msgData
            })).sort((a, b) => a.timestamp - b.timestamp) : [];

          return {
            id: chatId,
            info: chatData.info || {
              userId: '',
              startTime: 0,
              status: 'active' as SessionStatus,
              lastActivity: 0,
              sessionCount: 1
            },
            messages,
            statusHistory: chatData.statusHistory ?
              Object.entries(chatData.statusHistory).map(([histId, histData]: [string, any]) => ({
                id: histId,
                ...histData
              })) : []
          };
        }).sort((a, b) => (b.info.lastActivity || b.info.startTime || 0) - (a.info.lastActivity || a.info.startTime || 0));

        setChats(chatsList);

        // Firebase 데이터를 localStorage에도 백업
        chatsList.forEach(chat => {
          localStorageManager.saveChat(chat.id, chat.info, chat.messages);
        });
      } else {
        // Firebase에 데이터가 없으면 localStorage 확인
        const localChats = localStorageManager.getAllChats();
        if (localChats.length > 0) {
          setChats(localChats);
        } else {
          setChats([]);
        }
      }
    }, (error) => {
      console.error('Firebase error:', error);
      // Firebase 오류 시 localStorage 폴백
      const localChats = localStorageManager.getAllChats();
      setChats(localChats);
    });

    return () => {
      unsubscribe();
    };
    };

    initializeAdmin();
  }, []);

  // 상태별 채팅 그룹화
  const groupedChats = useMemo(() => {
    const groups = {
      all: chats,
      active: chats.filter(chat => chat.info.status === 'active'),
      inactive: chats.filter(chat => chat.info.status === 'inactive'),
      closed: chats.filter(chat => chat.info.status === 'closed'),
      reopened: chats.filter(chat => chat.info.status === 'reopened')
    };
    return groups;
  }, [chats]);

  // 현재 탭의 채팅 목록
  const currentChats = groupedChats[activeTab];

  // 관리자 답장 전송
  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    const messageData = {
      text: replyText,
      sender: 'admin',
      timestamp: Date.now()
    };

    try {
      // Firebase에 메시지 전송 (자동으로 리스너가 받아서 UI 업데이트)
      await push(ref(database, `chats/${selectedChat}/messages`), messageData);
      setReplyText('');
    } catch (error) {
      console.error('답장 전송 실패:', error);
      // 실패 시 localStorage에라도 저장
      const fallbackMessage: Message = {
        id: `admin_${Date.now()}`,
        text: messageData.text,
        sender: 'admin' as const,
        timestamp: messageData.timestamp
      };
      localStorageManager.addMessage(selectedChat, fallbackMessage);
    }
  };

  // 관리자가 채팅 종료
  const handleCloseChat = async (chatId: string) => {
    try {
      const updates = {
        [`chats/${chatId}/info/status`]: 'closed',
        [`chats/${chatId}/info/endTime`]: Date.now(),
        [`chats/${chatId}/info/closedBy`]: 'admin',
        [`chats/${chatId}/info/closeReason`]: 'admin_close'
      };

      await update(ref(database), updates);
      await sendSessionNotification('closed', 'admin_close', chatId);

      // 시스템 메시지 추가
      const systemMessage = {
        text: '관리자가 대화를 종료했습니다.',
        sender: 'system',
        timestamp: Date.now(),
        type: 'system_notification'
      };
      await push(ref(database, `chats/${chatId}/messages`), systemMessage);
    } catch (error) {
      console.error('채팅 종료 실패:', error);
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  // 상태별 아이콘과 색상
  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '🟡';
      case 'closed': return '🔴';
      case 'reopened': return '🟠';
      default: return '⚪';
    }
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '어제 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>DIORA 채팅 관리</h1>
        <div className="admin-stats">
          <span className="stat-item">
            <span className="stat-label">전체:</span>
            <span className="stat-value">{groupedChats.all.length}</span>
          </span>
          <span className="stat-item active">
            <span className="stat-label">활성:</span>
            <span className="stat-value">{groupedChats.active.length}</span>
          </span>
          <span className="stat-item inactive">
            <span className="stat-label">비활성:</span>
            <span className="stat-value">{groupedChats.inactive.length}</span>
          </span>
          <span className="stat-item closed">
            <span className="stat-label">종료:</span>
            <span className="stat-value">{groupedChats.closed.length}</span>
          </span>
          <span className="stat-item reopened">
            <span className="stat-label">재개:</span>
            <span className="stat-value">{groupedChats.reopened.length}</span>
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="admin-tabs">
        <div className="admin-tab-list">
          <button
            className={`admin-tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            전체
            <span className="admin-tab-badge">{groupedChats.all.length}</span>
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            🟢 활성
            <span className="admin-tab-badge">{groupedChats.active.length}</span>
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
            onClick={() => setActiveTab('inactive')}
          >
            🟡 비활성
            <span className="admin-tab-badge">{groupedChats.inactive.length}</span>
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            🔴 종료
            <span className="admin-tab-badge">{groupedChats.closed.length}</span>
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'reopened' ? 'active' : ''}`}
            onClick={() => setActiveTab('reopened')}
          >
            🟠 재개
            <span className="admin-tab-badge">{groupedChats.reopened.length}</span>
          </button>
        </div>
      </div>

      <div className="admin-layout">
        {/* 채팅 목록 */}
        <div className="chat-list">
          <div className="chat-list-header">
            <h3>{activeTab === 'all' ? '모든 대화' :
                activeTab === 'active' ? '진행 중인 대화' :
                activeTab === 'inactive' ? '비활성 대화' :
                activeTab === 'closed' ? '종료된 대화' : '재개된 대화'}</h3>
            <span className="chat-count">{currentChats.length}개</span>
          </div>

          {currentChats.length === 0 ? (
            <div className="no-chats">
              <p>표시할 대화가 없습니다</p>
            </div>
          ) : (
            currentChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="chat-item-header">
                  <div className="chat-item-id">
                    {getStatusIcon(chat.info.status)}
                    <strong>채팅 #{chat.id.slice(-8)}</strong>
                  </div>
                  <span className="chat-item-time">
                    {formatTime(chat.info.lastActivity || chat.info.startTime)}
                  </span>
                </div>

                <div className="chat-item-info">
                  <div className="chat-item-status">
                    <span className={`status-badge ${chat.info.status}`}>
                      {chat.info.status === 'active' ? '활성' :
                       chat.info.status === 'inactive' ? '비활성' :
                       chat.info.status === 'closed' ? '종료됨' : '재개됨'}
                    </span>
                    {chat.info.sessionCount > 1 && (
                      <span className="session-count-badge">
                        세션 {chat.info.sessionCount}
                      </span>
                    )}
                  </div>
                  <div className="last-message">
                    {chat.messages.length > 0 ?
                      `${chat.messages[chat.messages.length - 1].sender === 'customer' ? '고객' :
                        chat.messages[chat.messages.length - 1].sender === 'admin' ? '관리자' : '시스템'}:
                        ${chat.messages[chat.messages.length - 1].text}` :
                      '메시지 없음'
                    }
                  </div>
                  <div className="message-count">
                    메시지 {chat.messages.length}개
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 선택된 채팅 상세 */}
        {selectedChatData ? (
          <div className="chat-detail">
            <div className="chat-detail-header">
              <div className="chat-detail-title">
                <h3>채팅 #{selectedChat?.slice(-8)}</h3>
                <span className={`status-badge large ${selectedChatData.info.status}`}>
                  {getStatusIcon(selectedChatData.info.status)}
                  {selectedChatData.info.status === 'active' ? '활성' :
                   selectedChatData.info.status === 'inactive' ? '비활성' :
                   selectedChatData.info.status === 'closed' ? '종료됨' : '재개됨'}
                </span>
              </div>
              {selectedChatData.info.status === 'active' && (
                <button
                  className="btn-close-chat"
                  onClick={() => handleCloseChat(selectedChatData.id)}
                >
                  대화 종료
                </button>
              )}
            </div>

            <div className="chat-meta">
              <div className="meta-item">
                <span className="meta-label">시작 시간:</span>
                <span className="meta-value">
                  {selectedChatData.info.startTime ?
                    new Date(selectedChatData.info.startTime).toLocaleString('ko-KR') : '-'}
                </span>
              </div>
              {selectedChatData.info.endTime && (
                <div className="meta-item">
                  <span className="meta-label">종료 시간:</span>
                  <span className="meta-value">
                    {new Date(selectedChatData.info.endTime).toLocaleString('ko-KR')}
                  </span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">마지막 활동:</span>
                <span className="meta-value">
                  {selectedChatData.info.lastActivity ?
                    formatTime(selectedChatData.info.lastActivity) : '-'}
                </span>
              </div>
              {selectedChatData.info.closeReason && (
                <div className="meta-item">
                  <span className="meta-label">종료 사유:</span>
                  <span className="meta-value">
                    {selectedChatData.info.closeReason === 'manual' ? '고객 직접 종료' :
                     selectedChatData.info.closeReason === 'beforeunload' ? '브라우저 창 닫음' :
                     selectedChatData.info.closeReason === 'timeout' ? '비활성 타임아웃' :
                     selectedChatData.info.closeReason === 'admin_close' ? '관리자 종료' :
                     selectedChatData.info.closeReason}
                  </span>
                </div>
              )}
            </div>

            <div className="messages">
              {selectedChatData.messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sender}`}
                >
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {message.timestamp ? new Date(message.timestamp).toLocaleString('ko-KR') : ''}
                  </div>
                </div>
              ))}
            </div>

            {selectedChatData.info.status !== 'closed' && (
              <div className="reply-section">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  placeholder="관리자 답장을 입력하세요..."
                  rows={3}
                />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                >
                  답장 전송
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-selection">
            <p>채팅을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;