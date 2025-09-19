import React from 'react';
import './About.css';
import SmartKoreanText from '../SmartKoreanText/SmartKoreanText';

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
            <h2 className="about-title">
              <SmartKoreanText text="소량 주문 전문 파트너" />
            </h2>
            <p className="about-description">
              <SmartKoreanText
                text="DIORA는 소량 주문과 맞춤형 요청사항을 전문으로 처리하는 기업입니다. 다른 곳에서 진행처를 찾기 어려운 소량 주문이나 특별한 요청사항도 전문적으로 해결해드립니다."
              />
            </p>

            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">✓</div>
                  <div className="feature-content">
                    <h4 className="feature-title">
                      <SmartKoreanText text={feature.title} />
                    </h4>
                    <p className="feature-description">
                      <SmartKoreanText text={feature.description} />
                    </p>
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