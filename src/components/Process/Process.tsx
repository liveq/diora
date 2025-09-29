import React from 'react';
import './Process.css';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

const Process: React.FC = () => {
  const processSteps: ProcessStep[] = [
    {
      step: "01",
      title: "문의 접수",
      description: "홈페이지 문의 폼 또는 이메일로 요청사항을 보내주세요",
      icon: "📝"
    },
    {
      step: "02", 
      title: "상담 및 검토",
      description: "요청사항을 분석하고 가능 여부를 검토합니다",
      icon: "💬"
    },
    {
      step: "03",
      title: "견적 제공",
      description: "상세한 견적서와 예상 일정을 제공해드립니다",
      icon: "📊"
    },
    {
      step: "06",
      title: "납품 및 AS",
      description: "검수 후 안전하게 배송하고 AS를 제공합니다",
      icon: "📦"
    },
    {
      step: "05",
      title: "제작/소싱 진행",
      description: "진행 상황을 실시간으로 공유하며 작업을 진행합니다",
      icon: "⚙️"
    },
    {
      step: "04",
      title: "계약 및 착수",
      description: "계약 확정 후 즉시 작업에 착수합니다",
      icon: "✍️"
    }
  ];

  return (
    <section id="process" className="process">
      <div className="container">
        <h2 className="section-title">진행 프로세스</h2>
        <p className="section-subtitle">
          간단하고 체계적인 프로세스로 진행됩니다
        </p>
        
        <div className="process-grid">
          {processSteps.map((item, index) => (
            <div key={index} className="process-card">
              <div className="process-icon">{item.icon}</div>
              <div className="process-step">{item.step}</div>
              <h3 className="process-title">{item.title}</h3>
              <p className="process-description">{item.description}</p>
              {index < processSteps.length - 1 && (
                <div className="process-arrow">→</div>
              )}
            </div>
          ))}
        </div>

        <div className="process-timeline-mobile">
          {processSteps.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-icon">{item.icon}</span>
                <span className="timeline-step">{item.step}</span>
              </div>
              <div className="timeline-content">
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;