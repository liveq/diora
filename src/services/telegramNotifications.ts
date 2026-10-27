import { SessionStatus } from '../types/chat.types';

// 텔레그램 알림 — 토큰은 클라이언트에 두지 않는다.
// 브라우저는 같은 출처 프록시(/api/tg-send)로 text 만 보내고, 토큰/채팅ID 는 Pages 시크릿에만 존재.
async function post(text: string): Promise<void> {
  try {
    await fetch('/api/tg-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (error) {
    console.error('텔레그램 알림 오류:', error);
  }
}

// 세션 상태 변경 / 메시지 알림
export const sendSessionNotification = async (
  status: SessionStatus | 'message',
  reason: string,
  chatId?: string
): Promise<void> => {
  let message = '';

  if (status === 'message') {
    message = `
🔔 DIORA 새 채팅 메시지

💬 메시지: ${reason}
👤 발신자: 고객
🕐 시간: ${new Date().toLocaleString('ko-KR')}
📱 채팅 ID: ${chatId ? chatId.slice(-8) : 'N/A'}

📱 관리자 페이지에서 확인하세요.
    `.trim();
  } else {
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

  await post(message);
};

// 관리자 답장 알림
export const sendAdminReplyNotification = async (
  chatId: string,
  adminMessage: string
): Promise<void> => {
  const message = `
📤 DIORA 관리자 답변

💬 답변: ${adminMessage}
👤 발신자: 관리자
🕐 시간: ${new Date().toLocaleString('ko-KR')}
📱 채팅 ID: ${chatId ? chatId.slice(-8) : 'N/A'}
  `.trim();

  await post(message);
};
