import React, { useEffect } from 'react';
import Header from '../components/Header/Header';
import Portfolio from '../components/Portfolio/Portfolio';
import Footer from '../components/Footer/Footer';

const PortfolioPage: React.FC = () => {
  useEffect(() => {
    // 페이지 진입 시 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <Portfolio />
      <Footer />
    </>
  );
};

export default PortfolioPage;