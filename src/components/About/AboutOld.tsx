import React from 'react';
import './About.css';

const About: React.FC = () => {
  const features = [
    {
      title: '소량 주문 전문성',
      description: '1개부터 소량 주문까지, 부담 없이 주문할 수 있습니다'
    },
    {
      title: '맞춤형 요청사항 해결',
      description: '일반적이지 않은 특별한 요청사항도 전문적으로 처리합니다'
    },
    {
      title: '맞춤형 솔루션',
      description: '고객의 정확한 니즈에 맞는 최적화된 서비스를 제공합니다'
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">소량{'\u00A0'}주문{'\u00A0'}전문{'\u00A0'}파트너</h2>
            <p className="about-description">
              DIORA는 소량{'\u00A0'}주문과 맞춤형{'\u00A0'}요청사항을 전문으로{'\u00A0'}처리하는{'\u00A0'}기업입니다. 
              다른{'\u00A0'}곳에서{'\u00A0'}진행처를{'\u00A0'}찾기{'\u00A0'}어려운{'\u00A0'}소량{'\u00A0'}주문이나{'\u00A0'}특별한{'\u00A0'}요청사항도{'\u00A0'}전문적으로{'\u00A0'}해결해드립니다.
            </p>
            
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="about-visual">
            <div className="visual-placeholder">
              <div className="visual-shape shape-1"></div>
              <div className="visual-shape shape-2"></div>
              <div className="visual-shape shape-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;