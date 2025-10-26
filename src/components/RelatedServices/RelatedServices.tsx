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
      id: 'split',
      title: '텍스트 분할기',
      subtitle: 'txt 파일 크기별 분할 도구',
      englishTitle: 'Text File Splitter',
      description: '대용량 텍스트 파일을 원하는 크기로 쉽게 나누는 온라인 도구입니다. 원본 파일은 브라우저에서만 처리되어 서버로 전송되지 않으며, 줄 단위로 분할하여 문장이 중간에 잘리지 않습니다. 개별 다운로드 또는 ZIP 파일로 한번에 다운로드할 수 있습니다.',
      features: [
        '📁 드래그 & 드롭 업로드',
        '⚙️ 크기 조절 (0.5MB ~ 5MB)',
        '📝 줄 단위 분할 (문장 안 잘림)',
        '💾 개별 파일 다운로드',
        '📦 ZIP 일괄 다운로드',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'ChatGPT·Claude·Gemini 등 AI 업로드, 이메일 첨부 크기 제한, 채팅 앱 긴 텍스트 나누기, 문서 읽기 쉽게 분할',
      url: 'https://split.baal.co.kr',
      icon: '✂️'
    },
    {
      id: 'pdf',
      title: 'PDF 변환',
      subtitle: 'PDF를 JPEG로 변환하거나 분할',
      englishTitle: 'PDF Converter Tool',
      description: 'PDF 파일을 고품질 JPEG 이미지로 변환하거나 여러 개의 작은 PDF로 분할하는 온라인 도구입니다. 브라우저에서만 처리되어 안전하며, 페이지 범위 선택, 품질 조절, 그레이스케일 변환 등 다양한 옵션을 제공합니다. 변환된 이미지나 분할된 PDF는 ZIP 파일로 한번에 다운로드할 수 있습니다.',
      features: [
        '📄 PDF → JPEG 변환 (최대 3개)',
        '✂️ PDF 분할 (균등/페이지/범위)',
        '🎨 품질 선택 (150/300 DPI)',
        '⚫ 그레이스케일 변환',
        '📦 ZIP 자동 다운로드',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'PPT 이미지 변환, 포스터 인쇄용 JPEG, 대용량 PDF 분할, 특정 페이지만 추출, 문서 공유용 분할',
      url: 'https://pdf.baal.co.kr',
      icon: '📄'
    },
    {
      id: 'compress',
      icon: '🗜️',
      title: '이미지 압축기',
      subtitle: '이미지 용량을 효과적으로 줄이기',
      englishTitle: 'IMAGE COMPRESSION TOOL',
      description: 'JPG, PNG, WebP 이미지 파일의 용량을 줄여주는 온라인 압축 도구입니다. 브라우저에서 바로 처리되어 안전하며, 품질을 조절하면서 최대 90%까지 용량을 줄일 수 있습니다. 탭 기반 UI로 여러 이미지를 동시에 압축하고, 원본과 압축본을 비교하며 최적의 품질을 찾을 수 있습니다.',
      features: [
        '🎚️ 품질 조절 (10-100%)',
        '📦 일괄 처리 (최대 100개)',
        '🔄 JPG/PNG/WebP 지원',
        '👀 실시간 미리보기',
        '📊 용량 절감률 표시',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '웹사이트 최적화, 이메일 첨부 용량 절감, SNS 업로드 속도 개선, 포트폴리오 경량화, 모바일 저장공간 확보',
      url: 'https://compress.baal.co.kr'
    },
    {
      id: 'qr',
      icon: '📱',
      title: 'QR 코드 생성기',
      subtitle: 'URL, 텍스트, 연락처를 QR로 변환',
      englishTitle: 'QR CODE GENERATOR',
      description: 'URL, 텍스트, 이메일, 전화번호, Wi-Fi 정보, vCard 등을 QR 코드로 변환하는 도구입니다. 색상 커스터마이징, 로고 삽입, 다양한 크기와 오류 수정 레벨 설정이 가능합니다. 생성된 QR 코드는 PNG 또는 SVG 형식으로 다운로드할 수 있으며, 고해상도 출력을 지원합니다.',
      features: [
        '🔗 7가지 타입 지원 (URL/텍스트/이메일/전화/SMS/Wi-Fi/vCard)',
        '🎨 색상 커스터마이징 (전경/배경)',
        '🖼️ 로고 이미지 삽입',
        '📏 크기 조절 (256-1024px)',
        '🛡️ 오류 수정 레벨 설정',
        '💾 PNG/SVG 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '명함 제작, 레스토랑 메뉴판, 이벤트 초대장, Wi-Fi 공유, 제품 포장, 전시회 안내, 연락처 교환',
      url: 'https://qr.baal.co.kr'
    },
    {
      id: 'resize',
      icon: '📏',
      title: '이미지 리사이즈',
      subtitle: '이미지 크기를 자유롭게 변경',
      englishTitle: 'IMAGE RESIZER TOOL',
      description: '이미지의 가로/세로 크기를 픽셀 단위로 정확하게 조절하는 도구입니다. 인스타그램, 유튜브, 페이스북 등 SNS 플랫폼별 최적 크기 프리셋을 제공하며, 비율을 유지하거나 자유롭게 변경할 수 있습니다. 여러 이미지를 한번에 동일한 크기로 변환하고 ZIP 파일로 다운로드할 수 있습니다.',
      features: [
        '📐 픽셀/비율 지정',
        '📱 SNS 프리셋 (인스타/유튜브/페이스북)',
        '🔄 비율 유지/자유 변경',
        '📦 일괄 처리 (최대 100개)',
        '👁️ 실시간 미리보기',
        '💾 ZIP 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'SNS 콘텐츠 제작, 썸네일 생성, 프로필 사진 조정, 상품 이미지 통일, 웹사이트 배너 제작, 이메일 서명 이미지',
      url: 'https://resize.baal.co.kr'
    },
    {
      id: 'json',
      icon: '{ }',
      title: 'JSON 포맷터',
      subtitle: 'JSON 데이터 정렬, 압축, 검증',
      englishTitle: 'JSON FORMATTER & VALIDATOR',
      description: 'JSON 데이터를 보기 좋게 정렬하거나 압축하고, 문법 오류를 실시간으로 검증하는 개발자 도구입니다. 트리뷰 모드로 계층 구조를 시각화하고, 에러 위치를 정확히 표시합니다. 대용량 JSON 파일도 빠르게 처리하며, 복사 한번으로 바로 사용할 수 있습니다.',
      features: [
        '✨ JSON 정렬 (Pretty Print)',
        '🗜️ JSON 압축 (Minify)',
        '✅ 실시간 문법 검증',
        '🌲 트리뷰 모드',
        '🔍 에러 위치 표시',
        '📋 원클릭 복사',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'API 응답 확인, 설정 파일 편집, 데이터 구조 분석, 디버깅, JSON 학습, 코드 리뷰, 문서 작성',
      url: 'https://json.baal.co.kr'
    },
    {
      id: 'convert',
      icon: '🔄',
      title: '이미지 변환기',
      subtitle: 'JPG, PNG, WebP 포맷 자유롭게 변환',
      englishTitle: 'IMAGE FORMAT CONVERTER',
      description: 'JPG, PNG, WebP 이미지 포맷을 상호 변환하는 도구입니다. 탭 기반 UI로 여러 파일을 동시에 처리하고, 투명 배경이 필요하면 PNG로, 웹 최적화가 필요하면 WebP로 쉽게 변환할 수 있습니다. 변환된 이미지는 개별 또는 ZIP 파일로 다운로드 가능하며, 품질 손실을 최소화합니다.',
      features: [
        '🔄 3포맷 지원 (JPG/PNG/WebP)',
        '📦 일괄 변환 (최대 100개)',
        '🎨 투명 배경 유지 (PNG)',
        '⚡ 빠른 처리 속도',
        '💾 개별/ZIP 다운로드',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '웹사이트 최적화 (WebP), 로고 투명 배경 (PNG), 사진 호환성 (JPG), 인쇄용 변환, SNS 업로드, 이메일 첨부',
      url: 'https://convert.baal.co.kr'
    },
    {
      id: 'upscale',
      icon: '✨',
      title: 'AI 이미지 업스케일러',
      subtitle: 'AI로 이미지 해상도를 2배 향상',
      englishTitle: 'AI IMAGE UPSCALER',
      description: '인공지능 기술로 이미지 해상도를 2배로 높여주는 도구입니다. 스피드 모드는 빠른 처리를, AI 모드는 최고 품질의 업스케일링을 제공합니다. 저해상도 사진, 오래된 이미지, 작은 로고를 선명하게 복원하여 고품질 이미지로 변환할 수 있습니다. 탭 기반 UI로 여러 이미지를 동시에 처리합니다.',
      features: [
        '🤖 AI 업스케일링 엔진',
        '⚡ 2가지 모드 (스피드/AI)',
        '📈 2배 해상도 향상',
        '🎨 선명도 복원',
        '📦 일괄 처리 지원',
        '💾 고품질 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '저해상도 사진 복원, 로고 확대, 인쇄용 이미지 준비, SNS 프로필 개선, 오래된 사진 선명화, 제품 이미지 품질 향상',
      url: 'https://upscale.baal.co.kr'
    },
    {
      id: 'color',
      icon: '🎨',
      title: '색상 변환기',
      subtitle: 'HEX, RGB, HSL 변환 및 팔레트 생성',
      englishTitle: 'COLOR CONVERTER & PALETTE GENERATOR',
      description: '색상 코드를 HEX, RGB, HSL 형식으로 상호 변환하고, 5가지 팔레트 규칙으로 조화로운 색상을 생성하는 도구입니다. 유사색, 보색, 삼각색, 사각색, 단색 팔레트를 자동으로 생성하며, WCAG 접근성 대비 검사로 텍스트 가독성을 확인할 수 있습니다. 디자이너와 개발자를 위한 필수 도구입니다.',
      features: [
        '🎨 3가지 포맷 변환 (HEX/RGB/HSL)',
        '🌈 5가지 팔레트 규칙',
        '✅ WCAG 접근성 검사',
        '📋 원클릭 복사',
        '🕐 색상 히스토리',
        '🎨 실시간 미리보기',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '웹 디자인, UI/UX 작업, 브랜딩 색상 선정, 접근성 검사, 색상 조합 찾기, CSS 코드 작성',
      url: 'https://color.baal.co.kr'
    },
    {
      id: 'base64',
      icon: '🔐',
      title: 'Base64 인코더/디코더',
      subtitle: '텍스트와 이미지를 Base64로 변환',
      englishTitle: 'BASE64 ENCODER/DECODER',
      description: '텍스트와 이미지를 Base64로 인코딩하거나 디코딩하는 개발자 도구입니다. UTF-8을 완벽하게 지원하여 한글, 이모지 등 모든 문자를 정확하게 변환합니다. URL-safe Base64 옵션으로 URL에 안전하게 사용할 수 있으며, 이미지를 Data URL로 변환하여 HTML/CSS에 직접 삽입할 수 있습니다.',
      features: [
        '📝 텍스트 모드 (인코딩/디코딩)',
        '🖼️ 이미지 모드 (Data URL)',
        '🌍 UTF-8 완벽 지원',
        '🔗 URL-safe 옵션',
        '📋 복사/다운로드',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'API 인증 토큰, 이미지 Data URL 생성, JSON 데이터 인코딩, 이메일 첨부파일, HTML 인라인 이미지, 개발 테스트',
      url: 'https://base64.baal.co.kr'
    },
    {
      id: 'regex',
      icon: '🔍',
      title: '정규식 테스터',
      subtitle: '정규표현식 실시간 테스트 및 매칭',
      englishTitle: 'REGEX TESTER & MATCHER',
      description: '정규표현식을 실시간으로 테스트하고 매칭 결과를 확인하는 개발자 도구입니다. 이메일, URL, 전화번호, 날짜, IP 주소 등 자주 사용하는 패턴 예제를 제공하며, 매칭된 부분을 색상으로 하이라이트하여 시각적으로 확인할 수 있습니다. 치환 기능과 캡처 그룹 표시를 지원합니다.',
      features: [
        '⚡ 실시간 테스트',
        '🎨 매칭 하이라이트',
        '🔄 치환 기능',
        '📚 예제 패턴 6가지',
        '🚩 플래그 지원 (g/i/m/s)',
        '💡 캡처 그룹 표시',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '데이터 검증, 문자열 파싱, 폼 유효성 검사, 로그 분석, 텍스트 치환, 정규식 학습',
      url: 'https://regex.baal.co.kr'
    },
    {
      id: 'hash',
      icon: '🔒',
      title: '해시 생성기',
      subtitle: 'MD5, SHA-1, SHA-256 해시 생성',
      englishTitle: 'HASH GENERATOR & VERIFIER',
      description: '텍스트와 파일을 MD5, SHA-1, SHA-256, SHA-384, SHA-512 해시로 변환하는 암호화 도구입니다. 파일 무결성 검증, 비밀번호 해싱, 데이터 검증에 사용할 수 있으며, 여러 알고리즘을 동시에 적용하여 결과를 비교할 수 있습니다. 대용량 파일도 안전하게 처리합니다.',
      features: [
        '🔐 5가지 알고리즘 지원',
        '📝 텍스트 해싱',
        '📁 파일 해싱 (최대 100MB)',
        '✅ 해시 검증/비교',
        '📋 원클릭 복사',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '파일 무결성 검증, 다운로드 확인, 비밀번호 해싱, 데이터 검증, 보안 테스트, 암호화 학습',
      url: 'https://hash.baal.co.kr'
    },
    {
      id: 'csv',
      icon: '📊',
      title: 'CSV 변환기',
      subtitle: 'CSV↔JSON↔Excel 상호 변환',
      englishTitle: 'CSV/JSON/EXCEL CONVERTER',
      description: 'CSV, JSON, Excel 파일을 상호 변환하는 데이터 처리 도구입니다. 구분자 선택, 인코딩 지정, 헤더 옵션을 지원하며, 실시간 미리보기로 변환 결과를 확인할 수 있습니다. 한글 Excel 호환성을 위한 BOM 추가, 다양한 인코딩 지원으로 데이터 깨짐을 방지합니다.',
      features: [
        '🔄 3포맷 상호 변환 (CSV/JSON/XLSX)',
        '📊 테이블 실시간 미리보기',
        '⚙️ 구분자 선택 (쉼표/탭/세미콜론/파이프)',
        '🌍 인코딩 지원 (UTF-8/EUC-KR)',
        '💾 다운로드 (CSV/JSON/XLSX)',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'Excel 데이터 변환, API 데이터 가공, 데이터베이스 import, 통계 분석, 데이터 정리, 시스템 연동',
      url: 'https://csv.baal.co.kr'
    },
    {
      id: 'md',
      icon: '✍️',
      title: '마크다운 에디터',
      subtitle: '실시간 마크다운 프리뷰 에디터',
      englishTitle: 'MARKDOWN EDITOR & PREVIEWER',
      description: '마크다운 문서를 작성하고 실시간으로 미리보기하는 온라인 에디터입니다. GitHub Flavored Markdown을 지원하며, 100개 이상의 프로그래밍 언어에 대한 코드 하이라이팅을 제공합니다. 작성한 문서를 Markdown 또는 스타일이 포함된 HTML 파일로 다운로드할 수 있습니다.',
      features: [
        '⚡ 실시간 프리뷰',
        '💻 코드 하이라이팅 (100+ 언어)',
        '⌨️ 단축키 지원',
        '📝 GitHub Flavored Markdown',
        '💾 MD/HTML 다운로드',
        '🛡️ XSS 보호',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: 'README 작성, 기술 문서 작성, 블로그 포스트, GitHub Wiki, 프로젝트 문서, 개발 노트',
      url: 'https://md.baal.co.kr'
    },
    {
      id: 'barcode',
      icon: '🔢',
      title: '바코드 생성기',
      subtitle: '6가지 바코드 형식 생성',
      englishTitle: 'BARCODE GENERATOR',
      description: 'CODE128, EAN-13, UPC-A, CODE39, ITF-14, CODE93 등 6가지 국제 표준 바코드를 생성하는 도구입니다. 입력 형식을 자동으로 검증하고, 크기와 색상을 자유롭게 커스터마이징할 수 있습니다. 생성된 바코드는 PNG 또는 SVG 형식으로 다운로드하여 상품 라벨, 재고 관리, 문서 관리 등에 바로 사용할 수 있습니다.',
      features: [
        '🔢 6가지 형식 (CODE128/EAN-13/UPC-A/CODE39/ITF-14/CODE93)',
        '✅ 입력 자동 검증',
        '🎨 색상 커스터마이징',
        '📏 크기/여백 조절',
        '💾 PNG/SVG 다운로드',
        '🔒 브라우저 내 처리 (안전)',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '상품 라벨 제작, 재고 관리, 문서 관리, 도서관 시스템, 티켓 발행, 물류 추적',
      url: 'https://barcode.baal.co.kr'
    },
    {
      id: 'watermark',
      icon: '💧',
      title: '워터마크 추가',
      subtitle: '텍스트/이미지 워터마크 삽입',
      englishTitle: 'WATERMARK TOOL',
      description: '이미지에 텍스트나 로고 이미지를 워터마크로 추가하는 도구입니다. 9가지 위치 중 선택하여 배치하고, 투명도와 회전 각도를 조절할 수 있습니다. 여러 이미지를 한번에 처리하고 ZIP 파일로 다운로드할 수 있어 대량의 사진에 저작권 표시를 추가할 때 유용합니다. 그림자 효과로 가독성을 높일 수 있습니다.',
      features: [
        '💧 텍스트/이미지 워터마크',
        '📍 9가지 위치 선택',
        '🎨 투명도/회전 조절',
        '✨ 그림자 효과',
        '📦 일괄 처리 (최대 20개)',
        '💾 ZIP 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '사진 저작권 보호, 포트폴리오 이미지, SNS 콘텐츠, 제품 이미지, 브랜드 로고 삽입, 미리보기 이미지',
      url: 'https://watermark.baal.co.kr'
    },
    {
      id: 'chart',
      icon: '📊',
      title: '차트 생성기',
      subtitle: '6가지 차트 타입 생성',
      englishTitle: 'CHART GENERATOR',
      description: '라인, 바, 파이, 도넛, 레이더, 폴라 차트 등 6가지 타입의 차트를 생성하는 시각화 도구입니다. CSV 파일을 업로드하거나 테이블에 직접 데이터를 입력할 수 있으며, 4가지 색상 팔레트와 범례 위치를 선택할 수 있습니다. 생성된 차트는 고해상도 PNG 이미지로 다운로드하여 프레젠테이션이나 보고서에 바로 사용할 수 있습니다.',
      features: [
        '📊 6가지 타입 (Line/Bar/Pie/Doughnut/Radar/Polar)',
        '📄 CSV 업로드',
        '📝 테이블 수동 입력',
        '🎨 4가지 색상 팔레트',
        '🎯 범례 위치 설정',
        '💾 PNG 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '데이터 시각화, 프레젠테이션 자료, 보고서 작성, 통계 분석, 비즈니스 리포트, 학술 논문',
      url: 'https://chart.baal.co.kr'
    },
    {
      id: 'bg',
      icon: '✂️',
      title: '배경 제거',
      subtitle: 'AI로 이미지 배경 자동 제거',
      englishTitle: 'AI BACKGROUND REMOVER',
      description: '인공지능 기술로 이미지의 배경을 자동으로 제거하는 도구입니다. API 키 없이 브라우저에서 바로 작동하며, 비교 슬라이더로 원본과 결과를 실시간으로 비교할 수 있습니다. 투명 배경으로 만들거나 흰색, 검정색, 회색, 골드색 배경을 선택할 수 있습니다. 제품 사진, 프로필 이미지, 디자인 소재 제작에 유용합니다.',
      features: [
        '🤖 AI 자동 제거 (API key 불필요)',
        '⚡ 브라우저 내 처리',
        '🔄 비교 슬라이더',
        '🎨 5가지 배경색 (투명/흰색/검정/회색/골드)',
        '📊 진행률 표시',
        '💾 PNG 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '제품 사진 편집, 프로필 이미지, 썸네일 제작, 디자인 소재, 온라인 쇼핑몰, SNS 콘텐츠',
      url: 'https://bg.baal.co.kr'
    },
    {
      id: 'ocr',
      icon: '📝',
      title: 'OCR 텍스트 추출',
      subtitle: '이미지에서 텍스트 자동 인식',
      englishTitle: 'OCR TEXT EXTRACTOR',
      description: '이미지에서 텍스트를 자동으로 인식하고 추출하는 OCR 도구입니다. API 키 없이 브라우저에서 바로 작동하며, 한국어+영어, 일본어, 중국어, 프랑스어, 독일어, 스페인어 등 8개 언어를 지원합니다. 인식된 텍스트의 정확도와 통계(단어, 문자, 줄 수)를 표시하며, 복사하거나 TXT 파일로 다운로드할 수 있습니다.',
      features: [
        '🔍 OCR 자동 인식 (API key 불필요)',
        '🌐 8개 언어 (한+영/영/일/중간/중번/프/독/스)',
        '📊 정확도/통계 표시',
        '👁️ 이미지 미리보기',
        '📋 텍스트 복사',
        '💾 TXT 다운로드',
        '🌐 다국어 지원 (한/영)',
        '💰 100% 무료'
      ],
      useCases: '스캔 문서 텍스트화, 명함 정보 추출, 책/노트 디지털화, 번역용 텍스트, 데이터 입력, 문서 아카이빙',
      url: 'https://ocr.baal.co.kr'
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
                  사용하기 →
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
