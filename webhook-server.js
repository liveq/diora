const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, serverTimestamp } = require('firebase/database');

const app = express();
app.use(express.json());
app.use(cors());

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "diora-60d78.firebasestorage.app",
  messagingSenderId: "637738909685",
  appId: "1:637738909685:web:bb99ac6abcad74aa04b31b"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// 활성 채팅 세션 저장 (실제로는 Redis나 DB 사용해야 함)
let activeChats = new Map();

// 텔레그램 Webhook 엔드포인트
app.post('/webhook/telegram', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.text) {
      return res.status(200).json({ ok: true });
    }

    const adminChatId = process.env.TELEGRAM_CHAT_ID; // 관리자 텔레그램 chat_id
    
    // 관리자가 보낸 메시지인지 확인
    if (message.chat.id.toString() !== adminChatId) {
      return res.status(200).json({ ok: true });
    }

    // 최근 활성 채팅 세션 찾기 (간단한 방식)
    // 실제로는 더 정교한 세션 매칭이 필요
    const recentChatId = await getRecentChatId();
    
    if (!recentChatId) {
      // 활성 채팅이 없으면 무시
      return res.status(200).json({ ok: true });
    }

    // Firebase에 관리자 메시지 저장
    const messageData = {
      text: message.text,
      sender: 'admin',
      timestamp: serverTimestamp()
    };

    await push(ref(database, `chats/${recentChatId}/messages`), messageData);
    
    console.log(`관리자 답장 전송 완료: ${message.text}`);
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook 처리 실패:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 최근 활성 채팅 ID 가져오기
async function getRecentChatId() {
  // 간단한 구현: 가장 최근에 생성된 채팅 반환
  // 실제로는 Firebase에서 최근 메시지가 있는 채팅을 찾아야 함
  return new Promise((resolve) => {
    const { onValue } = require('firebase/database');
    const chatsRef = ref(database, 'chats');
    
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatIds = Object.keys(data);
        // 가장 최근 채팅 반환
        const recentChat = chatIds[chatIds.length - 1];
        resolve(recentChat);
      } else {
        resolve(null);
      }
    }, { onlyOnce: true });
  });
}

// 채팅 세션 등록 엔드포인트 (웹사이트에서 호출)
app.post('/api/register-chat', (req, res) => {
  const { chatId } = req.body;
  activeChats.set('current', chatId);
  res.json({ success: true });
});

// 서버 시작
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Webhook 서버가 포트 ${PORT}에서 실행 중입니다.`);
});

module.exports = app;