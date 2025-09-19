import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-logo">DIORA</h3>
            <p className="footer-description">
              작은{'\u00A0'}주문도{'\u00A0'}큰{'\u00A0'}가능성이{'\u00A0'}됩니다,{'\u00A0'}일단{'\u00A0'}문의해보세요
            </p>
          </div>
          
          <div className="footer-contact">
            <h4 className="footer-title">Contact</h4>
            <p className="footer-text">이메일: dio@diora.co.kr</p>
            <p className="footer-text">영업시간: 평일 09:00 - 18:00</p>
            <p className="footer-text">주소: (06140) 서울특별시 강남구 봉은사로30길 68, 6층-S8호</p>
            <p className="footer-text">사업자번호: 247-25-01917</p>
            <p className="footer-text">상호: 디오라 (대표: 조상원)</p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-nav">
              <li><a href="#hero">홈</a></li>
              <li><a href="#services">서비스</a></li>
              <li><a href="#process">프로세스</a></li>
              <li><a href="/portfolio">포트폴리오</a></li>
              <li><a href="#about">회사소개</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">문의하기</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="privacy-notice">
            <p className="privacy-text">
              문의 시 수집되는 개인정보는 상담 목적으로만 사용되며, 동의 없이 제3자에게 제공되지 않습니다.
              <br />
              개인정보 수집·이용을 거부하실 수 있으나, 이 경우 상담 서비스 제공이 제한될 수 있습니다.
              <br />
              <strong>본 웹사이트는 무단 개인정보 수집을 금지하며, 자동화 프로그램(봇, 크롤러 등)을 통한 무차별적 접근 및 동의 없는 정보 수집 행위를 엄격히 금지합니다.</strong>
            </p>
          </div>
          <p className="copyright">
            © {currentYear} DIORA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;