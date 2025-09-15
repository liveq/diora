import React, { useState, useEffect } from 'react';
import './TopButton.css';

const TopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼 표시/숨김
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`top-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      title="맨 위로"
    >
      ↑
    </button>
  );
};

export default TopButton;