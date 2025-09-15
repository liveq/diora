import React, { useState, useEffect } from 'react';
import './ContactGoogleFormCompact.css';

const ContactGoogleFormCompact: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdTDJTciTgG9LAe-7vdEQMY3-7QiBt5RhO_utsQYeQLhcQs6Q/viewform?embedded=true";
  
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    if (!isUserTyping) {
      setIsModalOpen(false);
      document.body.style.overflow = 'unset';
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUserTyping) {
        if (!isUserTyping) {
          setIsModalOpen(false);
          document.body.style.overflow = 'unset';
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen, isUserTyping]);

  // Track user typing in iframe (limited due to cross-origin)
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUserTyping) {
      closeModal();
    }
  };
  
  return (
    <section id="contact-compact" className="contact-compact">
      <div className="container">
        <h2 className="section-title">프로젝트 문의</h2>
        <p className="section-subtitle">
          소량이라도, 특별한{'\u00A0'}요청사항이라도, 일단{'\u00A0'}문의해보세요
        </p>
        
        <button className="contact-btn" onClick={openModal}>
          문의하기
        </button>
        
        {/* Beautiful Custom Modal */}
        {isModalOpen && (
          <div className="form-modal" onClick={handleModalClick}>
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal} title="닫기">
                ×
              </button>
              <div className="modal-header">
                <h2>프로젝트 문의</h2>
                <p>소량이라도, 특별한 요청사항이라도 문의해주세요</p>
              </div>
              <div className="modal-body">
                <div className="form-container">
                  <iframe 
                    src={googleFormUrl}
                    className="google-form-iframe"
                    title="DIORA 프로젝트 문의 폼"
                    onLoad={() => setIsUserTyping(false)}
                  >
                    <div className="fallback-content">
                      <h3>폼을 불러올 수 없습니다</h3>
                      <p>아래 링크를 클릭하여 문의 폼을 열어주세요:</p>
                      <a 
                        href={googleFormUrl.replace('?embedded=true', '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fallback-link"
                      >
                        문의 폼 열기
                      </a>
                    </div>
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactGoogleFormCompact;