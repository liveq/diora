import { database } from '../firebase';
import { ref, push, serverTimestamp, onValue } from 'firebase/database';

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

let lastUpdateId = 0;
let currentChatId = null;

// 텔레그램에서 업데이트 가져오기
async function getTelegramUpdates() {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&limit=10`);
    const data = await response.json();
    
    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        
        if (update.message && update.message.text && 
            update.message.chat.id.toString() === ADMIN_CHAT_ID) {
          
          // 관리자 메시지를 Firebase에 저장
          await processAdminMessage(update.message.text);
        }
      }
    }
  } catch (error) {
    console.error('텔레그램 업데이트 가져오기 실패:', error);
  }
}

// 관리자 메시지 처리
async function processAdminMessage(messageText) {
  if (!currentChatId) {
    console.log('활성 채팅이 없습니다.');
    return;
  }

  const messageData = {
    text: messageText,
    sender: 'admin',
    timestamp: serverTimestamp()
  };

  try {
    await push(ref(database, `chats/${currentChatId}/messages`), messageData);
    console.log('관리자 답장 전송 완료:', messageText);
  } catch (error) {
    console.error('관리자 메시지 저장 실패:', error);
  }
}

// 활성 채팅 세션 감지
function watchActiveChat() {
  const chatsRef = ref(database, 'chats');
  onValue(chatsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const chatIds = Object.keys(data);
      const recentChatId = chatIds[chatIds.length - 1];
      
      // 최근 메시지가 있는 채팅을 활성 채팅으로 설정
      const recentChat = data[recentChatId];
      if (recentChat && recentChat.messages) {
        const messages = Object.values(recentChat.messages);
        const lastMessage = messages[messages.length - 1];
        
        // 최근 10분 이내의 메시지가 있으면 활성 채팅으로 간주
        const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
        if (lastMessage.timestamp > tenMinutesAgo) {
          currentChatId = recentChatId;
          console.log('활성 채팅 설정:', currentChatId);
        }
      }
    }
  });
}

// 폴링 시작
export function startTelegramPolling() {
  console.log('텔레그램 폴링 시작...');
  
  // 활성 채팅 감시 시작
  watchActiveChat();
  
  // 5초마다 텔레그램 업데이트 확인
  setInterval(getTelegramUpdates, 5000);
  
  // 즉시 한 번 실행
  getTelegramUpdates();
}

// 특정 채팅을 활성 채팅으로 설정
export function setActiveChat(chatId) {
  currentChatId = chatId;
  console.log('활성 채팅 수동 설정:', chatId);
}