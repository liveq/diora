import React, { useState, useEffect } from 'react';
import './AdminAuth.css';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // OTP 생성 및 Telegram 전송
  const generateAndSendOTP = async () => {
    setIsLoading(true);
    setError('');

    // 6자리 랜덤 OTP 생성
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    // 세션 스토리지에 OTP 저장 (5분 유효)
    sessionStorage.setItem('adminOtp', newOtp);
    sessionStorage.setItem('otpExpiry', (Date.now() + 5 * 60 * 1000).toString());

    // Telegram으로 OTP 전송
    try {
      const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
      const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        throw new Error('Telegram 설정이 없습니다');
      }

      const message = `🔐 DIORA 관리자 인증 코드\n\n인증 코드: ${newOtp}\n\n⏱ 5분 내에 입력하세요\n🚨 본인이 요청하지 않았다면 무시하세요`;

      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        }
      );

      if (!response.ok) {
        throw new Error('OTP 전송 실패');
      }

      setOtpSent(true);
      setIsLoading(false);
    } catch (err) {
      setError('OTP 전송 중 오류가 발생했습니다');
      setIsLoading(false);
      // 개발 모드에서는 콘솔에 OTP 표시
      console.log('Development OTP:', newOtp);
    }
  };

  // OTP 검증
  const verifyOTP = () => {
    const storedOtp = sessionStorage.getItem('adminOtp');
    const otpExpiry = sessionStorage.getItem('otpExpiry');

    if (!storedOtp || !otpExpiry) {
      setError('OTP를 먼저 요청하세요');
      return;
    }

    if (Date.now() > parseInt(otpExpiry)) {
      setError('OTP가 만료되었습니다. 다시 요청하세요');
      sessionStorage.removeItem('adminOtp');
      sessionStorage.removeItem('otpExpiry');
      return;
    }

    if (otp === storedOtp) {
      // 인증 성공
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('authExpiry', (Date.now() + 30 * 60 * 1000).toString()); // 30분 유효
      sessionStorage.removeItem('adminOtp');
      sessionStorage.removeItem('otpExpiry');
      onAuthSuccess();
    } else {
      setError('잘못된 인증 코드입니다');
    }
  };

  // 이미 인증되었는지 확인
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    const authExpiry = sessionStorage.getItem('authExpiry');

    if (isAuthenticated && authExpiry && Date.now() < parseInt(authExpiry)) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  return (
    <div className="admin-auth">
      <div className="auth-container">
        <h1>🔒 관리자 인증</h1>
        <p className="auth-description">
          관리자 페이지에 접속하려면 인증이 필요합니다.
        </p>

        {!otpSent ? (
          <div className="otp-request">
            <p>Telegram으로 인증 코드를 받으시겠습니까?</p>
            <button
              onClick={generateAndSendOTP}
              disabled={isLoading}
              className="otp-send-btn"
            >
              {isLoading ? '전송 중...' : '인증 코드 요청'}
            </button>
          </div>
        ) : (
          <div className="otp-verify">
            <p>Telegram으로 전송된 6자리 코드를 입력하세요</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="otp-input"
            />
            <button
              onClick={verifyOTP}
              disabled={otp.length !== 6}
              className="otp-verify-btn"
            >
              인증하기
            </button>
            <button
              onClick={generateAndSendOTP}
              className="otp-resend-btn"
              disabled={isLoading}
            >
              코드 재전송
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AdminAuth;