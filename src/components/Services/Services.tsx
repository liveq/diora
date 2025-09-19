import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDragScroll } from '../../hooks/useDragScroll';
import './Services.css';

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  category: string;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const { dragMoved } = useDragScroll();

  const services: ServiceCard[] = [
    {
      icon: 'SEARCH',
      title: '맞춤 소싱 서비스',
      description: '구하기 어려운 희귀 부품,\n희귀\u00A0제품까지\u00A0전문\u00A0소싱',
      category: 'search'
    },
    {
      icon: 'GOODS',
      title: '맞춤 굿즈 제작',
      description: '소량부터 가능한 브랜드 굿즈,\n프로모션\u00A0아이템\u00A0제작',
      category: 'goods'
    },
    {
      icon: 'APPAREL',
      title: '단체복 OEM/ODM',
      description: '스타트업과 소상공인의 첫 제품을 만듭니다',
      category: 'apparel'
    },
    {
      icon: 'PC',
      title: '리퍼브 PC 전문',
      description: '최소 수량 제한 없이, 원하는 대로 제작합니다',
      category: 'pc'
    },
    {
      icon: 'FOOD',
      title: '식품관 김치 도매',
      description: 'HACCP 인증 시설에서 생산하는\n외식업계\u00A0전문\u00A0김치\u00A0납품',
      category: 'food'
    }
  ];

  const handleServiceClick = (category: string) => {
    // 드래그 중이었으면 클릭 무시 (FoodPage와 동일한 방식)
    if (dragMoved) return;

    if (category === 'food') {
      navigate('/food');
    } else {
      navigate(`/portfolio?category=${category}`);
    }
  };

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">주요 서비스</h2>
        <p className="section-subtitle">
          1개도{'\u00A0'}OK, 특별{'\u00A0'}요청도{'\u00A0'}OK
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card"
              onClick={() => handleServiceClick(service.category)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-overlay">
                <span className="overlay-text">포트폴리오 보기</span>
                <span className="overlay-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;