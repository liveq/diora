import React, { useState, useEffect } from 'react';
import './ContactGoogleFormCompact.css';
import './BenefitModal.css';

const ContactGoogleFormCompact: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [isPlatinumModalOpen, setIsPlatinumModalOpen] = useState(false);
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdTDJTciTgG9LAe-7vdEQMY3-7QiBt5RhO_utsQYeQLhcQs6Q/viewform?embedded=true";
  
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    if (!isUserTyping) {
      setIsModalOpen(false);
      document.body.style.overflow = 'unset';
    }
  };

  const openBenefitModal = () => {
    setIsBenefitModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeBenefitModal = () => {
    setIsBenefitModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openPlatinumModal = () => {
    setIsPlatinumModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closePlatinumModal = () => {
    setIsPlatinumModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openSamplePage = (packageType: string) => {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? '/samples/'
      : '/samples/';
    const url = `${baseUrl}sample_${packageType}_package.html`;
    window.open(url, '_blank');
  };

  const showPlatinumInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    openPlatinumModal();
  };

  const switchToGoogleForm = () => {
    closeBenefitModal();
    setTimeout(() => {
      openModal();
    }, 300);
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUserTyping) {
        if (!isUserTyping) {
          setIsModalOpen(false);
          document.body.style.overflow = 'unset';
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen, isUserTyping]);

  // Track user typing in iframe (limited due to cross-origin)
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUserTyping) {
      closeModal();
    }
  };
  
  return (
    <section id="contact-compact" className="contact-compact">
      <div className="container">
        <h2 className="section-title">프로젝트 문의</h2>
        <p className="section-subtitle">
          소량이라도, 특별한{'\u00A0'}요청사항이라도, 일단{'\u00A0'}문의해보세요
        </p>
        
        <div className="button-group">
          <button className="contact-btn" onClick={openModal}>
            문의하기
          </button>

          <button className="benefit-btn" onClick={openBenefitModal}>
            특별한 혜택
          </button>
        </div>
        
        {/* Beautiful Custom Modal */}
        {isModalOpen && (
          <div className="form-modal" onClick={handleModalClick}>
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal} title="닫기">
                ×
              </button>
              <div className="modal-header">
                <h2>프로젝트 문의</h2>
                <p>소량이라도, 특별한 요청사항이라도 문의해주세요</p>
              </div>
              <div className="modal-body">
                <div className="form-container">
                  <iframe 
                    src={googleFormUrl}
                    className="google-form-iframe"
                    title="DIORA 프로젝트 문의 폼"
                    onLoad={() => setIsUserTyping(false)}
                  >
                    <div className="fallback-content">
                      <h3>폼을 불러올 수 없습니다</h3>
                      <p>아래 링크를 클릭하여 문의 폼을 열어주세요:</p>
                      <a 
                        href={googleFormUrl.replace('?embedded=true', '')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fallback-link"
                      >
                        문의 폼 열기
                      </a>
                    </div>
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 특별한 혜택 모달 */}
        {isBenefitModalOpen && (
          <div className="benefit-modal show" onClick={(e) => {
            if (e.target === e.currentTarget) closeBenefitModal();
          }}>
            <div className="benefit-content">
              <button className="close-btn" onClick={closeBenefitModal}>×</button>

              <div className="benefit-header">
                <h2>디오라 파트너 전용 혜택</h2>
                <p>거래 파트너가 되시면 홈페이지를 무료로 제작해드립니다</p>
              </div>

              <div className="benefit-tiers">
                <div className="tier">
                  <button className="preview-btn" onClick={() => openSamplePage('basic')} title="샘플 보기">🔍</button>
                  <h3><span className="tier-dot" style={{color: '#4CAF50'}}>●</span> 기본 패키지</h3>
                  <ul>
                    <li title="스크롤로 모든 정보를 볼 수 있는 단일 페이지">원페이지 랜딩 사이트</li>
                    <li title="모든 기기에서 자동으로 레이아웃 조정">모바일 최적화</li>
                    <li title="Google Forms로 무료 문의 시스템 구축">기본 문의 폼 설치</li>
                    <li title="GitHub Pages 자동 HTTPS 제공">SSL 보안 인증서</li>
                    <li title="방문자 통계 및 트래픽 분석">구글 애널리틱스 연동</li>
                    <li title="GitHub Pages 완전 무료 호스팅">무료 호스팅 제공</li>
                  </ul>
                </div>

                <div className="tier">
                  <button className="preview-btn" onClick={() => openSamplePage('business')} title="샘플 보기">🔍</button>
                  <h3><span className="tier-dot" style={{color: '#2c5aa0'}}>●</span> 비즈니스 패키지</h3>
                  <ul>
                    <li title="기본 패키지의 모든 기능 포함">기본 패키지 모든 기능 +</li>
                    <li title="홈/소개/서비스/포트폴리오/문의 등 페이지 구성">최대 5페이지 구성</li>
                    <li title="제품 이미지 갤러리 및 포트폴리오 섹션">제품 갤러리 / 포트폴리오</li>
                    <li title="인스타그램, 유튜브 등 콘텐츠 자동 표시">SNS 연동
                      <img src="/icons/instagram.svg" alt="Instagram" style={{width: '16px', height: '16px', verticalAlign: 'middle', marginLeft: '5px'}} />
                      <img src="/icons/youtube.svg" alt="YouTube" style={{width: '16px', height: '16px', verticalAlign: 'middle', marginLeft: '3px'}} />
                      <img src="/icons/facebook.svg" alt="Facebook" style={{width: '16px', height: '16px', verticalAlign: 'middle', marginLeft: '3px'}} />
                      <img src="/icons/twitter.svg" alt="Twitter" style={{width: '16px', height: '16px', verticalAlign: 'middle', marginLeft: '3px'}} />
                    </li>
                    <li title="코딩 없이 콘텐츠 수정 가능한 관리 시스템">간단한 CMS 제공</li>
                    <li title="검색엔진 및 AI 검색 최적화">SEO & AEO 최적화</li>
                  </ul>
                </div>

                <div className="tier">
                  <button className="preview-btn" onClick={() => openSamplePage('premium')} title="샘플 보기">🔍</button>
                  <h3><span className="tier-dot" style={{color: '#B8860B'}}>●</span> 프리미엄 패키지</h3>
                  <ul>
                    <li title="비즈니스 패키지의 모든 기능 포함">비즈니스 패키지 모든 기능 +</li>
                    <li title="업종별 특화 기능 개발 (견적계산기 등)">맞춤형 기능 개발</li>
                    <li title="제품/주문/고객 통합 관리 시스템">관리자 페이지 제공</li>
                    <li title="채널톡 또는 텔레그램으로 실시간 고객 응대">실시간 상담 (채널톡/텔레그램)</li>
                    <li title="날짜/시간 선택 예약 접수 시스템">예약 시스템</li>
                  </ul>
                  <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0'}}>
                    <a href="#" onClick={showPlatinumInfo} style={{color: '#B8860B', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <span>더 강력한 기능이 필요하신가요?</span>
                      <span style={{fontSize: '16px'}}>→</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="info-note">
                <strong style={{fontSize: '16px', display: 'block', marginBottom: '12px'}}>💡 특별한 점</strong>
                <span style={{fontSize: '15px'}}>• 별도의 홈페이지 관리비 없음</span><br/>
                <span style={{fontSize: '15px'}}>• 지속적인 기술 지원 제공</span><br/>
                <span style={{fontSize: '15px'}}>• 제품 생산부터 홈페이지까지 원스톱 서비스</span><br/>
                <span style={{fontSize: '15px'}}>• 도메인 구매 시 전문 비즈니스 이메일 제공</span>
              </div>

              <div className="benefit-footer">
                <button className="btn-inquiry" onClick={switchToGoogleForm}>문의하기</button>
                <button className="btn-close" onClick={closeBenefitModal}>닫기</button>
              </div>
            </div>
          </div>
        )}

        {/* 플래티넘 모달 */}
        {isPlatinumModalOpen && (
          <div className="platinum-modal show" onClick={(e) => {
            if (e.target === e.currentTarget) closePlatinumModal();
          }}>
            <div className="platinum-content">
              <button className="platinum-close-btn" onClick={closePlatinumModal}>×</button>

              <div className="platinum-header">
                <h2>PLATINUM PACKAGE</h2>
                <p>완전한 디지털 비즈니스 생태계</p>
              </div>

              <div className="platinum-body">
                <div className="platinum-features">
                  <div className="platinum-feature">
                    <h3>프리미엄 포함 +</h3>
                    <ul>
                      <li title="프리미엄 패키지까지 모든 기능 포함">프리미엄까지의 모든 기능</li>
                      <li title="완전한 디지털 비즈니스 생태계 구축">완벽한 비즈니스 시스템</li>
                    </ul>
                  </div>

                  <div className="platinum-feature">
                    <h3>회원 & CRM</h3>
                    <ul>
                      <li title="Firebase Auth로 월 5만명까지 무료">회원가입/로그인 시스템</li>
                      <li title="구글/네이버/카카오 간편 로그인">소셜 로그인 연동</li>
                      <li title="Firebase로 고객 정보 체계적 관리">고객 데이터베이스 관리</li>
                      <li title="고객별 구매 내역 조회 및 분석">구매 이력 추적</li>
                    </ul>
                  </div>

                  <div className="platinum-feature">
                    <h3>데이터 분석</h3>
                    <ul>
                      <li title="Chart.js로 비즈니스 핵심 지표 시각화">실시간 대시보드</li>
                      <li title="GA4로 기간별 매출 및 트래픽 분석">매출/트래픽 분석</li>
                      <li title="Microsoft Clarity로 사용자 행동 분석">히트맵 & 세션 녹화</li>
                      <li title="주간/월간 자동 보고서 생성">맞춤형 리포트</li>
                    </ul>
                  </div>

                  <div className="platinum-feature">
                    <h3>자동화 시스템</h3>
                    <ul>
                      <li title="이메일 자동 발송 및 리타겟팅">마케팅 자동화</li>
                      <li title="Firebase로 실시간 재고 수량 관리">클라우드 재고관리</li>
                      <li title="주문→결제→배송 프로세스 자동화">주문 처리 자동화</li>
                      <li title="24시간 자동 응답 챗봇">AI 챗봇 (선택사항)</li>
                    </ul>
                  </div>
                </div>

                <button className="platinum-preview-btn" onClick={() => openSamplePage('platinum')}>
                  <span>🔍</span>
                  <span>플래티넘 시스템 미리보기</span>
                </button>

                <div className="platinum-note">
                  플래티넘 패키지는 단순한 홈페이지를 넘어 비즈니스의 디지털 전환을 완성합니다.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactGoogleFormCompact;