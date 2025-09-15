import { SessionStatus } from '../types/chat.types';

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

// 세션 상태 변경 알림
export const sendSessionNotification = async (
  status: SessionStatus | 'message',
  reason: string,
  chatId?: string
): Promise<void> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('텔레그램 설정이 없습니다.');
    return;
  }

  let message = '';

  if (status === 'message') {
    // 일반 메시지 알림
    message = `
🔔 DIORA 새 채팅 메시지

💬 메시지: ${reason}
👤 발신자: 고객
🕐 시간: ${new Date().toLocaleString('ko-KR')}
📱 채팅 ID: ${chatId ? chatId.slice(-8) : 'N/A'}

📱 관리자 페이지에서 확인하세요.
    `.trim();
  } else {
    // 세션 상태 변경 알림
    const statusMessages: Record<string, string> = {
      active: '🟢 새 대화 시작',
      inactive: '🟡 대화 비활성화',
      closed: '🔴 대화 종료',
      reopened: '🟠 대화 재시작'
    };

    const reasonMessages: Record<string, string> = {
      session_start: '새로운 고객이 대화를 시작했습니다',
      session_continue: '고객이 이전 대화를 이어서 진행합니다',
      manual: '고객이 직접 대화를 종료했습니다',
      beforeunload: '고객이 브라우저 창을 닫았습니다',
      timeout: '비활성 상태로 인해 자동 종료되었습니다',
      admin_close: '관리자가 대화를 종료했습니다',
      inactivity_timeout: '30분간 활동이 없어 비활성화되었습니다'
    };

    message = `
🔔 DIORA 채팅 상태 변경

📊 상태: ${statusMessages[status] || status}
📝 사유: ${reasonMessages[reason] || reason}
🕐 시간: ${new Date().toLocaleString('ko-KR')}
💬 채팅 ID: #${chatId ? chatId.slice(-8) : 'N/A'}

${status === 'reopened' ? '📌 이전 대화를 확인하세요!' : ''}
${status === 'active' ? '🆕 새 고객 문의입니다!' : ''}

📱 관리자 페이지: /admin
    `.trim();
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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

    if (!response.ok) {
      const error = await response.json();
      console.error('텔레그램 알림 전송 실패:', error);
    }
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
};

// 관리자 답장 알림 (텔레그램으로)
export const sendAdminReplyNotification = async (
  chatId: string,
  adminMessage: string
): Promise<void> => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('텔레그램 설정이 없습니다.');
    return;
  }

  const message = `
📤 DIORA 관리자 답변

💬 답변: ${adminMessage}
👤 발신자: 관리자
🕐 시간: ${new Date().toLocaleString('ko-KR')}
📱 채팅 ID: ${chatId ? chatId.slice(-8) : 'N/A'}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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

    if (!response.ok) {
      const error = await response.json();
      console.error('텔레그램 알림 전송 실패:', error);
    }
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
};