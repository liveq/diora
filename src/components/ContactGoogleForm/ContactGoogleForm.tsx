import React from 'react';
import './ContactGoogleForm.css';

const ContactGoogleForm: React.FC = () => {
  // DIORA 문의 폼 URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdTDJTciTgG9LAe-7vdEQMY3-7QiBt5RhO_utsQYeQLhcQs6Q/viewform?embedded=true";
  
  return (
    <section id="contact-google" className="contact-google">
      <div className="container">
        <h2 className="section-title">프로젝트 문의</h2>
        <p className="section-subtitle">
          비즈니스 성장을 위한 최적의 솔루션을 제안해드립니다
        </p>
        
        <div className="google-form-wrapper">
          <iframe 
            src={googleFormUrl}
            width="100%" 
            height="900" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            title="DIORA 문의 폼"
          >
            Loading…
          </iframe>
        </div>
        
        <div className="form-alternative">
          <p>폼이 보이지 않으시나요?</p>
          <a 
            href={googleFormUrl.replace('?embedded=true', '')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="form-link"
          >
            새 창에서 폼 열기 →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactGoogleForm;