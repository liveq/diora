import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "최소 주문 수량이 있나요?",
      answer: "아니요, 최소 주문 수량 제한이 없습니다. 1개부터 주문 가능합니다. DIORA는 소량 주문 전문 파트너입니다."
    },
    {
      question: "견적은 어떻게 받을 수 있나요?",
      answer: "홈페이지 문의 폼을 작성해주시면, 영업일 기준 24시간 이내에 상세한 견적을 보내드립니다. 급한 건은 별도 표시해주세요."
    },
    {
      question: "제작 기간은 얼마나 걸리나요?",
      answer: "품목과 수량에 따라 다르지만, 일반적으로 의류는 7-14일, 리퍼브 PC는 3-7일, 특수 소싱은 제품에 따라 상이합니다.\n정확한 일정은 상담 시 안내드립니다."
    },
    {
      question: "해외 제품도 소싱 가능한가요?",
      answer: "네, 가능합니다. 일본, 미국, 유럽 등 전 세계 제품 소싱이 가능하며, 단종품이나 희귀 제품도 찾아드립니다."
    },
    {
      question: "샘플 제작이 가능한가요?",
      answer: "네, 가능합니다. 의류 및 굿즈 등 OEM,ODM 모두 샘플 제작 후 확인하시고 본 생산을 진행할 수 있습니다.\n샘플 비용은 별도 문의해주세요."
    },
    {
      question: "AS는 어떻게 받나요?",
      answer: "AS는 제품 특성에 따라 다르게 적용됩니다. 자세한 AS 정책은 계약 시 안내드립니다."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="section-title">자주 묻는 질문</h2>
        <p className="section-subtitle">
          궁금하신 점을 빠르게 확인하세요
        </p>
        
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;