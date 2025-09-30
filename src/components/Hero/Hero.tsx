import React, { useState } from 'react';
import ContactFormFirebase from '../ContactFormFirebase/ContactFormFirebase';
import './Hero.css';

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-part-1">작은{'\u00A0'}주문,</span>{' '}
            <span className="title-part-2">큰{'\u00A0'}가능성</span>
          </h1>
          <p className="hero-subtitle">
            1개부터{'\u00A0'}시작하는{'\u00A0'}맞춤{'\u00A0'}제작{'\u00A0'}서비스
          </p>
          <button className="hero-cta" onClick={openModal}>
            문의하기
          </button>
        </div>

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
                <ContactFormFirebase />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;