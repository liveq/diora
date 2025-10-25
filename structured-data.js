// 구조화된 데이터를 동적으로 삽입하는 스크립트
// index.html의 </body> 태그 앞에 <script src="structured-data.js"></script> 추가하면 작동

(function() {
  // 1. Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DIORA",
    "alternateName": "디오라",
    "url": "https://diora.co.kr",
    "logo": "https://diora.co.kr/logo512.png",
    "description": "소량 주문도 OK! 특수 요구사항 전문 해결사. 의류 OEM/ODM, 리퍼브 PC, 특수 소싱 서비스 제공",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "KR",
      "availableLanguage": ["Korean", "English"]
    }
  };

  // 2. Website SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DIORA",
    "url": "https://diora.co.kr",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://diora.co.kr/portfolio?category={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // 3. Service Catalog
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "맞춤 제작 서비스",
    "provider": {
      "@type": "Organization",
      "name": "DIORA"
    },
    "areaServed": {
      "@type": "Country",
      "name": "대한민국"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "DIORA 서비스",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "특수 검색/소싱",
            "description": "해외 희귀 부품, 단종 제품, 특수 재료 검색 및 소싱"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "소품/굿즈 제작",
            "description": "소량 맞춤 제작, 커스텀 굿즈, 프로모션 제품"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "의류 OEM/ODM",
            "description": "소량 의류 생산, 맞춤 디자인, 자체 브랜드 제작"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "리퍼브 PC",
            "description": "기업용 중고 PC, 맞춤 사양 구성, A/S 지원"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Food",
            "description": "김치 및 식품 납품, HACCP 인증 제품"
          }
        }
      ]
    }
  };

  // 4. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "최소 주문 수량이 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DIORA는 소량 주문 전문입니다. 1개부터 제작 가능하며, 고객님의 요구사항에 맞춰 유연하게 대응합니다."
        }
      },
      {
        "@type": "Question",
        "name": "견적은 어떻게 받나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "홈페이지 문의 폼을 통해 요청사항을 보내주시면, 24시간 내에 맞춤 견적을 제공해드립니다."
        }
      },
      {
        "@type": "Question",
        "name": "제작 기간은 얼마나 걸리나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "제품 종류와 수량에 따라 다르지만, 일반적으로 7-14일 정도 소요됩니다. 급한 경우 특급 제작도 가능합니다."
        }
      },
      {
        "@type": "Question",
        "name": "해외 배송도 가능한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, 전 세계 배송이 가능합니다. DHL, FedEx 등 국제 특송 서비스를 이용하여 안전하게 배송해드립니다."
        }
      }
    ]
  };

  // 스키마 삽입 함수
  function insertSchema(schema, id) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // 모든 스키마 삽입
  insertSchema(orgSchema, 'diora-org-schema');
  insertSchema(websiteSchema, 'diora-website-schema');
  insertSchema(serviceSchema, 'diora-service-schema');
  insertSchema(faqSchema, 'diora-faq-schema');

  console.log('DIORA 구조화된 데이터 로드 완료');
})();