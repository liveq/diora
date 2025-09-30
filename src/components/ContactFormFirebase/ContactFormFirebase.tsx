import React, { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { contactDatabase } from '../../firebaseContact';
import './ContactFormFirebase.css';

const ContactFormFirebase: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    let formattedValue = '';

    if (value.length <= 3) {
      formattedValue = value;
    } else if (value.length <= 7) {
      formattedValue = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length <= 11) {
      formattedValue = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }

    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiriesRef = ref(contactDatabase, 'inquiries');
      await push(inquiriesRef, {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      });

      setSubmitStatus('success');

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        content: ''
      });

      // 3초 후 모달 자동 닫기
      setTimeout(() => {
        setSubmitStatus('idle');
        const closeBtn = document.querySelector('.close-btn') as HTMLButtonElement;
        if (closeBtn) closeBtn.click();
      }, 3000);

    } catch (error) {
      console.error('문의 저장 실패:', error);
      setSubmitStatus('error');

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form id="contactForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            이름 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="담당자 성함을 입력해주세요"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            이메일 주소 <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="회신받으실 이메일을 입력해주세요"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            연락처 <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="연락 가능한 전화번호를 입력해주세요 (예: 010-1234-5678)"
            pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}|[0-9]{10,11}"
            value={formData.phone}
            onChange={handlePhoneChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">
            문의 내용 <span className="required">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            placeholder="문의하실 내용을 자세히 적어주세요"
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <p className="file-info">
          의뢰서, 작업지시서, 샘플 이미지 등의 파일은 <strong>dio@diora.co.kr</strong>로 별도 전송 부탁드립니다
        </p>

        <button type="submit" className="submit-btn" id="submitBtn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loading"></span> 접수 중...
            </>
          ) : (
            '문의 접수하기'
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="success-message" id="successMessage">
            ✅ 문의가 성공적으로 접수되었습니다!<br/>
            영업일 기준 24시간 이내 회신드리겠습니다.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="error-message" id="errorMessage">
            ❌ 문의 접수 중 오류가 발생했습니다.<br/>
            잠시 후 다시 시도해주세요.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactFormFirebase;