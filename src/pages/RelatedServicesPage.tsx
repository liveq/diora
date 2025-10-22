import React, { useEffect } from 'react';
import Header from '../components/Header/Header';
import RelatedServices from '../components/RelatedServices/RelatedServices';
import Footer from '../components/Footer/Footer';

const RelatedServicesPage: React.FC = () => {
  useEffect(() => {
    // 페이지 진입 시 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <RelatedServices />
      <Footer />
    </>
  );
};

export default RelatedServicesPage;
