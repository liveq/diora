import React, { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '문의 내용을 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async () => {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            user_email: formData.email,
            user_phone: formData.phone,
            message: formData.message,
          },
          publicKey
        );
        return true;
      } catch (error) {
        console.error('Email send failed:', error);
        return false;
      }
    }
    return true; // EmailJS not configured, proceed without sending
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      const emailSent = await sendEmail();
      
      if (emailSent) {
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
          });
          setIsSubmitted(false);
        }, 3000);
      } else {
        alert('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">프로젝트 문의</h2>
        <p className="section-subtitle">
          소량이라도{'\u00A0'}특별한{'\u00A0'}요구라도, 비즈니스 성장을 위한 최적의{'\u00A0'}솔루션을 제안해드립니다
        </p>
        
        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="이름 *"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="이메일 *"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="연락처 *"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group full-width">
              <textarea
                name="message"
                placeholder="문의 내용 *"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? '전송 중...' : isSubmitted ? '전송 완료!' : '문의하기'}
            </button>
          </form>
        </div>
        
        {isSubmitted && (
          <div className="success-message">
            문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;