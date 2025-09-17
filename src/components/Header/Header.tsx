import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // 포트폴리오 페이지에 있으면 홈으로 이동 후 스크롤
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navigateToPortfolio = () => {
    if (location.pathname === '/portfolio') {
      // 이미 포트폴리오 페이지에 있으면 페이지 상단으로 스크롤 후 새로고침
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate('/portfolio', { replace: false });
        window.location.reload();
      }, 300);
    } else {
      navigate('/portfolio');
    }
    setIsMenuOpen(false);
  };

  const navigateToFood = () => {
    if (location.pathname === '/food') {
      // 이미 식품관 페이지에 있으면 페이지 상단으로 스크롤 후 새로고침
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigate('/food', { replace: false });
        window.location.reload();
      }, 300);
    } else {
      navigate('/food');
    }
    setIsMenuOpen(false);
  };

  const navigateToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div
            className="logo"
            onClick={navigateToHome}
            style={{
              fontWeight: 900,
              fontSize: '36px',
              fontFamily: "'Noto Sans KR', sans-serif"
            }}
          >
            DIORA
          </div>
          
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <button onClick={() => scrollToSection('hero')} className="nav-link">
                홈
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection('services')} className="nav-link">
                서비스
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection('process')} className="nav-link">
                프로세스
              </button>
            </li>
            <li className="nav-item">
              <button onClick={navigateToPortfolio} className="nav-link">
                포트폴리오
              </button>
            </li>
            <li className="nav-item">
              <button onClick={navigateToFood} className="nav-link">
                식품관
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection('about')} className="nav-link">
                회사소개
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection('faq')} className="nav-link">
                FAQ
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => scrollToSection('contact-compact')} className="nav-link">
                문의하기
              </button>
            </li>
          </ul>
          
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;