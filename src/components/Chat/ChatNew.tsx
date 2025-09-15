import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { database, auth } from '../../firebase';
import { ref, push, onValue, serverTimestamp } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { startTelegramPolling, setActiveChat } from '../../services/telegramPolling';
import { SessionManager } from '../../services/sessionManager';
import { Message, SessionStatus } from '../../types/chat.types';
import { sendSessionNotification } from '../../services/telegramNotifications';

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('active');
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [isTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionManagerRef = useRef<SessionManager | null>(null);

  // 세션 매니저 초기화
  useEffect(() => {
    if (!sessionManagerRef.current) {
      sessionManagerRef.current = new SessionManager();
    }

    // beforeunload 이벤트 리스너
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sessionStatus === 'active' && chatId) {
        sessionManagerRef.current?.handleBeforeUnload();
        sendSessionNotification('closed', 'beforeunload', chatId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sessionManagerRef.current?.cleanup();
    };
  }, [sessionStatus, chatId]);

  // 채팅 초기화
  useEffect(() => {
    const initChat = async () => {
      if (!isOpen || chatId) return;

      try {
        // 익명 로그인
        const userCredential = await signInAnonymously(auth);
        const userId = userCredential.user.uid;

        // 기존 세션 확인
        const existingChatId = localStorage.getItem('dioraChatId');
        if (existingChatId) {
          // 이전 메시지 로드
          const messagesRef = ref(database, `chats/${existingChatId}/messages`);
          const snapshot = await new Promise<any>((resolve) => {
            onValue(messagesRef, resolve, { onlyOnce: true });
          });

          if (snapshot.val()) {
            const previousMsgs = Object.entries(snapshot.val()).map(([key, value]: [string, any]) => ({
              id: key,
              ...value
            }));
            setPreviousMessages(previousMsgs);
            setShowResumeDialog(true);
            return;
          }
        }

        // 새 세션 시작
        await startNewSession(userId);
      } catch (error) {
        console.error('채팅 초기화 실패:', error);
      }
    };

    initChat();
  }, [isOpen, chatId]);

  // 새 세션 시작
  const startNewSession = async (userId: string) => {
    if (!sessionManagerRef.current) return;

    const newChatId = await sessionManagerRef.current.initializeSession(userId);
    setChatId(newChatId);
    setSessionStatus('active');
    setActiveChat(newChatId);
    startTelegramPolling();

    // 환영 메시지
    const welcomeMessage: Message = {
      id: 'welcome',
      text: '안녕하세요! DIORA입니다. 무엇을 도와드릴까요?',
      sender: 'admin',
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);

    // 세션 시작 알림
    await sendSessionNotification('active', 'session_start', newChatId);
  };

  // 이전 세션 계속하기
  const continueSession = async () => {
    const existingChatId = localStorage.getItem('dioraChatId');
    if (!existingChatId || !sessionManagerRef.current) return;

    await sessionManagerRef.current.reopenSession(existingChatId);
    setChatId(existingChatId);
    setSessionStatus('reopened');
    setActiveChat(existingChatId);
    startTelegramPolling();
    setMessages(previousMessages);
    setShowResumeDialog(false);

    // 세션 재개 알림
    await sendSessionNotification('reopened', 'session_continue', existingChatId);
  };

  // 새 대화 시작
  const startNewChat = async () => {
    localStorage.removeItem('dioraChatId');
    setShowResumeDialog(false);
    setPreviousMessages([]);

    const userCredential = await signInAnonymously(auth);
    await startNewSession(userCredential.user.uid);
  };

  // 메시지 리스너
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setMessages(prev => [
          ...(prev.length > 0 && prev[0].id === 'welcome' ? [prev[0]] : []),
          ...messagesList.sort((a, b) => a.timestamp - b.timestamp)
        ]);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputText.trim() || !chatId) return;

    const messageData = {
      text: inputText,
      sender: 'customer',
      timestamp: serverTimestamp()
    };

    try {
      await push(ref(database, `chats/${chatId}/messages`), messageData);
      setInputText('');

      // 비활성 타이머 리셋
      sessionManagerRef.current?.resetInactivityTimer();

      // 텔레그램 알림
      await sendSessionNotification('message', inputText, chatId);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  // 대화 종료
  const handleEndChat = async () => {
    if (!chatId || !sessionManagerRef.current) return;

    await sessionManagerRef.current.closeSession('manual');
    await sendSessionNotification('closed', 'manual', chatId);

    setShowEndDialog(false);
    setIsOpen(false);
    setChatId(null);
    setMessages([]);
    localStorage.removeItem('dioraChatId');
  };

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        className="chat-floating-button"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <span className="chat-icon">💬</span>
        <span className="chat-badge">실시간 상담</span>
      </button>

      {/* 채팅창 */}
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>DIORA 실시간 상담</h3>
              <div className="chat-status-indicator">
                <span className={`chat-status-dot ${sessionStatus}`}></span>
                <span className="chat-status-text">
                  {sessionStatus === 'active' ? '온라인' :
                   sessionStatus === 'inactive' ? '비활성' :
                   sessionStatus === 'reopened' ? '재개됨' : '종료됨'}
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              {sessionStatus === 'active' && (
                <button
                  className="chat-end-session"
                  onClick={() => setShowEndDialog(true)}
                >
                  대화 종료
                </button>
              )}
              <button
                className="chat-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 세션 재개 다이얼로그 */}
          {showResumeDialog && (
            <div className="session-resume-banner">
              <div className="session-resume-content">
                <span className="session-resume-icon">💬</span>
                <div className="session-resume-text">
                  <h4>이전 대화가 있습니다</h4>
                  <p>이전 대화를 이어서 진행하시겠습니까?</p>
                </div>
              </div>
              <div className="session-resume-actions">
                <button
                  className="session-resume-btn session-resume-continue"
                  onClick={continueSession}
                >
                  이전 대화 계속하기
                </button>
                <button
                  className="session-resume-btn session-resume-new"
                  onClick={startNewChat}
                >
                  새 대화 시작
                </button>
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender}`}
              >
                <div className="chat-bubble">
                  {message.text}
                </div>
                <div className="chat-time">
                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : ''}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message admin">
                <div className="chat-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <textarea
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="메시지를 입력하세요..."
              rows={1}
            />
            <button
              className="chat-send"
              onClick={sendMessage}
              disabled={!inputText.trim()}
            >
              전송
            </button>
          </div>
        </div>
      )}

      {/* 대화 종료 확인 다이얼로그 */}
      {showEndDialog && (
        <div className="session-confirm-overlay" onClick={() => setShowEndDialog(false)}>
          <div className="session-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h4>대화를 종료하시겠습니까?</h4>
            <p>종료하시면 현재 대화 내용이 저장되고, 새로운 대화를 시작할 수 있습니다.</p>
            <div className="session-confirm-actions">
              <button
                className="session-confirm-cancel"
                onClick={() => setShowEndDialog(false)}
              >
                취소
              </button>
              <button
                className="session-confirm-end"
                onClick={handleEndChat}
              >
                대화 종료
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;