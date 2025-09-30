import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ContactFormFirebase from '../components/ContactFormFirebase/ContactFormFirebase';
import { useDragScroll } from '../hooks/useDragScroll';
import './FoodPage.css';

const FoodPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentCategory, setCurrentCategory] = useState<'kimchi' | 'factory'>('kimchi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const { dragMoved } = useDragScroll();

  // 김치 제품 데이터
  // 실제 이미지: kimchi_1=포기김치, kimchi_2=파김치, kimchi_3=갓김치, kimchi_4=깍두기, kimchi_5=총각김치
  const kimchiProducts = [
    { id: 1, name: '포기김치', title: '포기김치', desc: '전통 방식으로 정성껏 담근 포기김치' },
    { id: 2, name: '파김치', title: '파김치', desc: '향긋한 쪽파로 만든 별미 파김치' },
    { id: 3, name: '갓김치', title: '갓김치', desc: '알싸한 돌산갓으로 만든 남도식 갓김치' },
    { id: 4, name: '깍두기', title: '깍두기', desc: '아삭한 무로 만든 시원한 깍두기' },
    { id: 5, name: '총각김치', title: '총각김치', desc: '시원한 알타리무로 만든 총각김치' }
  ];

  // 공장 이미지 데이터
  const factoryImages = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `생산 시설 ${i + 1}`,
    title: `생산 시설 ${i + 1}`,
    desc: 'HACCP 인증 청정 시설'
  }));

  const allImages = [
    ...kimchiProducts.map(p => ({ ...p, category: 'kimchi' as const })),
    ...factoryImages.map(f => ({ ...f, category: 'factory' as const }))
  ];

  const openModal = (category: 'kimchi' | 'factory', index: number) => {
    const categoryImages = category === 'kimchi' ? kimchiProducts : factoryImages;
    const globalIndex = category === 'kimchi' ? index : kimchiProducts.length + index;
    setSelectedImage(globalIndex);
    setCurrentCategory(category);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (selectedImage + 1) % allImages.length;
    } else {
      newIndex = selectedImage === 0 ? allImages.length - 1 : selectedImage - 1;
    }

    setSelectedImage(newIndex);
    setCurrentCategory(allImages[newIndex].category);
  };

  const openContactForm = () => {
    setIsContactFormOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactForm = () => {
    setIsContactFormOpen(false);
    document.body.style.overflow = 'unset';
  };

  const getImagePath = (category: 'kimchi' | 'factory', index: number, type: 'thumbnail' | 'full') => {
    const prefix = category === 'kimchi' ? 'kimchi' : 'factory';
    return `/portfolio/food/${type}/${prefix}_${index + 1}.webp`;
  };


  const handlePortfolioClick = (category: 'kimchi' | 'factory', index: number) => {
    // Prevent modal opening if user was dragging
    if (!dragMoved) {
      openModal(category, index);
    }
  };

  return (
    <>
      <Header />
      <div className="food-page">
        {/* 히어로 섹션 */}
        <section className="food-hero">
          <div className="container">
            <h1 className="hero-title">
              <span className="title-part-1">외식업계</span>{' '}
              <span className="title-part-2">김치 파트너</span>
            </h1>
            <p className="hero-subtitle">
              외식업체와 급식업체를 위한 안정적인 김치 공급 파트너<br />
              월 100톤 이상 생산 가능, 안정적인 물량 확보
            </p>
            <div className="hero-badges">
              <span className="badge">HACCP 인증</span>
              <span className="badge">콜드체인 시스템</span>
              <span className="badge">B2B 전문</span>
            </div>
            <button className="hero-cta" onClick={openContactForm}>
              문의하기
            </button>
          </div>
        </section>

        {/* 김치 포트폴리오 섹션 */}
        <section className="kimchi-section">
          <div className="container">
            <h2 className="section-title">정성으로 담근 5종 김치</h2>
            <p className="section-subtitle">
              외식업체 맞춤형 5종 김치, 안정적인 대량 공급 가능
            </p>

            <div className="kimchi-grid">
              {kimchiProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="portfolio-item"
                  onClick={() => handlePortfolioClick('kimchi', index)}
                >
                  <div className="portfolio-image">
                    <img
                      src={getImagePath('kimchi', index, 'thumbnail')}
                      alt={product.name}
                    />
                    <div className="portfolio-overlay">
                      <span className="overlay-text">자세히 보기</span>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 공장 시설 섹션 */}
        <section className="factory-section">
          <div className="container">
            <h2 className="section-title">생산 시설 및 품질 관리</h2>
            <p className="section-subtitle">
              전문 HACCP 인증 시설에서 위생적으로 생산됩니다
            </p>

            <div className="factory-grid">
              {factoryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="portfolio-item"
                  onClick={() => handlePortfolioClick('factory', index)}
                >
                  <div className="portfolio-image">
                    <img
                      src={getImagePath('factory', index, 'thumbnail')}
                      alt={image.title}
                    />
                    <div className="portfolio-overlay">
                      <span className="overlay-text">자세히 보기</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 클로징 섹션 */}
        <section className="closing-section">
          <div className="container">
            <h2 className="closing-title">
              업체 전용 견적을 받아보세요
            </h2>
            <p className="closing-subtitle">
              최소 주문량, 배송 주기, 맞춤 포장 등<br />
              귀사의 요구사항에 맞춰 견적을 제공합니다
            </p>
            <button className="hero-cta" onClick={openContactForm}>
              문의하기
            </button>
          </div>
        </section>

        {/* 라이트박스 모달 */}
        {isModalOpen && selectedImage !== null && (
          <div className="lightbox-overlay" onClick={closeModal}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeModal}>
                ✕
              </button>

              {/* 이전/다음 네비게이션 */}
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                aria-label="이전 이미지"
              >
                ‹
              </button>

              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                aria-label="다음 이미지"
              >
                ›
              </button>

              <img
                src={getImagePath(
                  allImages[selectedImage].category,
                  allImages[selectedImage].category === 'kimchi'
                    ? selectedImage
                    : selectedImage - kimchiProducts.length,
                  'full'
                )}
                alt={allImages[selectedImage].title}
                className="lightbox-image"
              />

              <div className="lightbox-info">
                <h3>{allImages[selectedImage].title}</h3>
                <span className="lightbox-category">
                  {allImages[selectedImage].desc}
                </span>
                <span className="lightbox-counter">
                  {selectedImage + 1} / {allImages.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form 모달 */}
        {isContactFormOpen && (
          <div className="form-modal" onClick={closeContactForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeContactForm} title="닫기">
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
      <Footer />
    </>
  );
};

export default FoodPage;