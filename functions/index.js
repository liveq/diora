const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

// 텔레그램 봇 설정
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// 텔레그램 메시지 전송 함수
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    console.log('텔레그램 전송 결과:', result);
    return result;
  } catch (error) {
    console.error('텔레그램 전송 실패:', error);
    throw error;
  }
}

// 새 메시지 감지 시 텔레그램 알림 전송
exports.onNewMessage = functions.database.ref('/chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    const messageData = snapshot.val();
    const chatId = context.params.chatId;
    const messageId = context.params.messageId;

    // 고객 메시지만 알림 전송 (관리자 메시지는 제외)
    if (messageData.sender !== 'customer') {
      return null;
    }

    // 텔레그램 메시지 형식
    const telegramMessage = `
🔔 <b>DIORA 새 채팅 메시지</b>

💬 <b>메시지:</b> ${messageData.text}
👤 <b>발신자:</b> 고객
🕐 <b>시간:</b> ${new Date().toLocaleString('ko-KR')}
🔗 <b>채팅 ID:</b> ${chatId}

📱 Firebase Console에서 채팅을 확인하세요.
    `.trim();

    try {
      await sendTelegramMessage(telegramMessage);
      console.log(`텔레그램 알림 전송 완료 - Chat: ${chatId}, Message: ${messageId}`);
      return null;
    } catch (error) {
      console.error('텔레그램 알림 전송 실패:', error);
      return null;
    }
  });

// 헬스체크 함수
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});