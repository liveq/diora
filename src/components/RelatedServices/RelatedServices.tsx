import React from 'react';
import './RelatedServices.css';

const RelatedServices: React.FC = () => {
  const allServices = [
    {
      id: 'plan',
      title: '도면 배치',
      subtitle: '평면도 그리기 & 가구 배치 플래너',
      englishTitle: 'Floor Plan Layout Designer',
      description: '디오라가 직접 개발한 무료 온라인 도면 배치 도구입니다. 아파트, 매장, 사무실, 카페 등 모든 공간의 평면도를 자유롭게 그리고 가구를 배치할 수 있습니다. 드래그 앤 드롭으로 쉽게 가구 배치, 평면도 그리기, 거리 측정까지! 상업용으로도 자유롭게 사용 가능하며, JPEG 파일로 다운로드할 수 있습니다.',
      features: [
        '🪑 가구 드래그 & 드롭 배치',
        '✏️ 평면도 그리기 (선, 사각형, 원, 펜)',
        '📏 거리 측정 & 치수 표시',
        '🎨 가구 색상 변경 (20가지)',
        '💾 배치안 저장/불러오기',
        '🔄 실행 취소/다시 실행',
        '📱 PC/모바일 모두 지원',
        '💰 100% 무료, 상업용 OK'
      ],
      useCases: '아파트 인테리어, 매장 레이아웃, 사무실 배치, 카페 디자인, 쇼룸 설계',
      url: 'https://plan.baal.co.kr',
      icon: '📐'
    },
    {
      id: 'baal',
      title: '바알',
      subtitle: '무료 운세 모음',
      englishTitle: 'Free Fortune Services',
      description: '다양한 무료 운세 및 심리 테스트 서비스를 제공합니다. 별자리, 혈액형, 타로, MBTI, 띠운세(12지신), 호르몬 테스트 등 12가지 운세와 심리 테스트를 한곳에서 즐기실 수 있습니다.',
      features: [
        '♈ 별자리 운세',
        '🩸 혈액형 운세',
        '🎴 타로 카드',
        '🧠 MBTI 운세',
        '🐰 띠운세 (12지신)',
        '⚗️ 호르몬 테스트',
        '📅 사주 (준비 중)',
        '🥠 포춘쿠키 (준비 중)',
        '9️⃣ 에니어그램 (준비 중)',
        '✋ 손금 (준비 중)',
        '🔢 수비학 (준비 중)',
        '💯 완전 무료'
      ],
      useCases: '별자리 궁합, 혈액형 분석, 타로 점, MBTI 운세, 띠운세, 심리 테스트',
      url: 'https://baal.co.kr',
      icon: '🔮'
    }
  ];

  // 바알 서비스는 아직 배포 준비 전이므로 숨김 처리
  const services = allServices.filter(service => service.id !== 'baal');

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="related-services" id="related-services">
      <div className="container">
        <h2 className="section-title">관련 서비스</h2>
        <p className="section-subtitle">
          디오라가 직접 개발하고 운영하는 각종 서비스들을 소개합니다
        </p>

        <div className="services-grid-related">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card-related animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCardClick(service.url)}
            >
              <div className="service-header">
                <h3 className="service-title-related">
                  <span className="service-icon-inline">{service.icon}</span>
                  {service.title}
                  <span className="service-subtitle-related">{service.subtitle}</span>
                </h3>
                <p className="service-english-title">{service.englishTitle}</p>
              </div>

              <p className="service-description-related">{service.description}</p>

              <div className="service-features">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>

              <div className="service-use-cases">
                <strong>활용 분야:</strong> {service.useCases}
              </div>

              <div className="service-footer">
                <span className="service-url">{service.url}</span>
                <button className="service-button">
                  무료로 사용하기 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;
