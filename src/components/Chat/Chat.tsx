import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { database, auth } from '../../firebase';
import { ref, push, onValue, serverTimestamp, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { startTelegramPolling, setActiveChat } from '../../services/telegramPolling';

// 텔레그램 알림 함수
const sendTelegramNotification = async (message: string) => {
  const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;
  
  const telegramMessage = `
🔔 DIORA 새 채팅 메시지

💬 메시지: ${message}
👤 발신자: 고객
🕐 시간: ${new Date().toLocaleString('ko-KR')}

📱 채팅을 확인하세요.
  `.trim();

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'HTML'
    })
  });

  return response.json();
};

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  timestamp: number;
}

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 익명 로그인 및 채팅 세션 초기화
  useEffect(() => {
    const initChat = async () => {
      try {
        // 익명 로그인
        const userCredential = await signInAnonymously(auth);
        const userId = userCredential.user.uid;
        
        // 채팅 세션 생성
        const newChatRef = push(ref(database, 'chats'));
        setChatId(newChatRef.key);
        
        // 텔레그램 폴링 시작
        startTelegramPolling();
        
        // 현재 채팅을 활성 채팅으로 설정
        if (newChatRef.key) {
          setActiveChat(newChatRef.key);
        }

        // 채팅 세션 정보 저장
        await set(ref(database, `chats/${newChatRef.key}/info`), {
          userId,
          startTime: serverTimestamp(),
          status: 'active'
        });

        // 환영 메시지
        const welcomeMessage: Message = {
          id: 'welcome',
          text: '안녕하세요! DIORA입니다. 무엇을 도와드릴까요?',
          sender: 'admin',
          timestamp: Date.now()
        };
        setMessages([welcomeMessage]);

      } catch (error) {
        console.error('Chat initialization error:', error);
      }
    };

    if (isOpen && !chatId) {
      initChat();
    }
  }, [isOpen, chatId]);

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
          prev[0], // 환영 메시지 유지
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
      
      // 텔레그램 알림 전송
      try {
        await sendTelegramNotification(inputText);
      } catch (error) {
        console.error('텔레그램 알림 실패:', error);
      }
      
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
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
              <span className="chat-status">● 온라인</span>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

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
            <input
              type="text"
              className="chat-input"
              placeholder="메시지를 입력하세요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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
    </>
  );
};

export default Chat;