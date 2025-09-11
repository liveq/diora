import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';
import './AdminPage.css';

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'admin';
  timestamp: number;
}

interface Chat {
  id: string;
  info: {
    userId: string;
    startTime: number;
    status: string;
  };
  messages: Message[];
}

const AdminPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // 모든 채팅 불러오기
  useEffect(() => {
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
            info: chatData.info || {},
            messages
          };
        }).sort((a, b) => (b.info.startTime || 0) - (a.info.startTime || 0));
        
        setChats(chatsList);
      }
    });

    return () => unsubscribe();
  }, []);

  // 관리자 답장 전송
  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    const messageData = {
      text: replyText,
      sender: 'admin',
      timestamp: serverTimestamp()
    };

    try {
      await push(ref(database, `chats/${selectedChat}/messages`), messageData);
      setReplyText('');
    } catch (error) {
      console.error('답장 전송 실패:', error);
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="admin-container">
      <h1>DIORA 채팅 관리</h1>
      
      <div className="admin-layout">
        {/* 채팅 목록 */}
        <div className="chat-list">
          <h3>채팅 목록</h3>
          {chats.map(chat => (
            <div 
              key={chat.id}
              className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="chat-preview">
                <strong>채팅 #{chat.id.slice(-8)}</strong>
                <span className="time">
                  {chat.info.startTime ? new Date(chat.info.startTime).toLocaleString('ko-KR') : ''}
                </span>
              </div>
              <div className="last-message">
                {chat.messages.length > 0 ? 
                  `${chat.messages[chat.messages.length - 1].sender === 'customer' ? '고객' : '관리자'}: ${chat.messages[chat.messages.length - 1].text}` :
                  '메시지 없음'
                }
              </div>
              <div className="message-count">
                메시지 {chat.messages.length}개
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 채팅 */}
        {selectedChatData && (
          <div className="chat-detail">
            <div className="chat-header">
              <h3>채팅 #{selectedChat?.slice(-8)}</h3>
              <span className="status">
                상태: {selectedChatData.info.status || '활성'}
              </span>
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

            <div className="reply-section">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
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
          </div>
        )}

        {!selectedChat && (
          <div className="no-selection">
            <p>채팅을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;