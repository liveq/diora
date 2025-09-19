# DIORA 웹사이트 반응형 시스템 재설계

## 개요

DIORA 웹사이트의 반응형 시스템을 표준화하고 개선하여 모든 디바이스에서 일관된 사용자 경험을 제공합니다.

## 표준화된 브레이크포인트 시스템

### 브레이크포인트 정의
```css
--bp-xs: 320px;   /* 소형 모바일 */
--bp-sm: 375px;   /* 일반 모바일 */
--bp-md: 414px;   /* 대형 모바일/폴드 */
--bp-lg: 768px;   /* 태블릿 */
--bp-xl: 1024px;  /* 데스크톱 */
--bp-xxl: 1200px; /* 대형 데스크톱 */
```

### 미디어쿼리 사용법
```css
/* 소형 모바일 (320px~374px) */
@media (max-width: 374px) { }

/* 일반 모바일 (375px~413px) */
@media (max-width: 413px) { }

/* 대형 모바일/폴드 (414px~767px) */
@media (max-width: 767px) { }

/* 태블릿 (768px~1023px) */
@media (max-width: 1023px) { }

/* 데스크톱 (1024px+) */
기본 스타일
```

## CSS 변수 시스템

### 스페이싱 시스템 (8px 기준)
```css
--spacing-xs: 4px;     /* 0.25rem */
--spacing-sm: 8px;     /* 0.5rem */
--spacing-md: 16px;    /* 1rem */
--spacing-lg: 24px;    /* 1.5rem */
--spacing-xl: 32px;    /* 2rem */
--spacing-2xl: 48px;   /* 3rem */
--spacing-3xl: 64px;   /* 4rem */
--spacing-4xl: 80px;   /* 5rem */
--spacing-5xl: 100px;  /* 6.25rem */
--spacing-6xl: 120px;  /* 7.5rem */
```

### 반응형 타이포그래피
```css
/* Desktop */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 28px;
--text-4xl: 32px;
--text-5xl: 36px;
--text-6xl: 48px;
```

자동 반응형 조정:
- 767px 이하: 기본 크기에서 10-15% 감소
- 413px 이하: 기본 크기에서 15-20% 감소
- 374px 이하: 기본 크기에서 20-30% 감소

### Z-Index 레이어 시스템
```css
--z-dropdown: 100;
--z-modal-backdrop: 1000;
--z-modal: 1001;
--z-floating-button: 9999;
--z-chat: 10000;
--z-tooltip: 10001;
--z-notification: 10002;
```

### 그림자 시스템
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-card: 0 5px 15px rgba(0, 0, 0, 0.08);
--shadow-card-hover: 0 15px 30px rgba(0, 0, 0, 0.15);
```

### 테두리 반지름
```css
--radius-sm: 4px;
--radius-base: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 50px;
```

### 전환 시간
```css
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;
--transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## 애니메이션 네이밍 컨벤션

모든 애니메이션은 `diora-` 접두사를 사용합니다:

### Fade 애니메이션
- `diora-fade-in`
- `diora-fade-out`

### Slide 애니메이션
- `diora-slide-up`
- `diora-slide-down`
- `diora-slide-in-left`
- `diora-slide-in-right`

### Scale 애니메이션
- `diora-scale-in`
- `diora-scale-out`

### 특수 애니메이션
- `diora-bounce-in`
- `diora-float`
- `diora-pulse`
- `diora-shake`
- `diora-bounce-x`
- `diora-rotate`
- `diora-typing`

## 컴포넌트별 개선사항

### Services 컴포넌트
- **데스크톱**: 3+2 그리드 레이아웃 (첫 줄 3개, 둘째 줄 2개 중앙 정렬)
- **태블릿**: 2x2 + 1 중앙 레이아웃
- **모바일**: 1열 세로 레이아웃
- 반응형 카드 패딩 및 아이콘 크기 조정

### Hero 컴포넌트
- 반응형 텍스트 줄바꿈 처리
- 작은 화면에서 부분별 줄바꿈 허용
- 모달 크기 및 패딩 반응형 조정
- CTA 버튼 크기 최적화

### Chat 컴포넌트
- **데스크톱/태블릿**: 고정 크기 플로팅 윈도우
- **모바일**: 전체 화면 모드
- 플로팅 버튼 위치 및 크기 반응형 조정
- 메시지 버블 크기 최적화

## 사용 가이드

### 1. 새 컴포넌트 개발 시
```css
/* 기본 스타일 */
.component {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-base);
  transition: all var(--transition-base);
}

/* 반응형 조정 */
@media (max-width: 767px) {
  .component {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
}

@media (max-width: 413px) {
  .component {
    padding: var(--spacing-sm);
  }
}
```

### 2. 애니메이션 적용
```css
.animated-element {
  animation: diora-slide-up var(--transition-base);
}

.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 3. 타이포그래피 사용
```css
.title {
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-size: var(--text-base);
  line-height: var(--line-height-relaxed);
}
```

## 파일 구조

```
src/
├── styles/
│   ├── variables.css          # 글로벌 변수 시스템
│   └── RESPONSIVE_SYSTEM.md   # 이 문서
├── App.css                    # 기본 스타일 (variables.css import)
└── components/
    ├── Services/Services.css  # 개선된 그리드 시스템
    ├── Hero/Hero.css         # 개선된 텍스트 처리
    └── Chat/Chat.css         # 개선된 반응형 대응
```

## 개발 체크리스트

### 새 컴포넌트 개발 시
- [ ] variables.css의 변수 사용
- [ ] 표준 브레이크포인트 적용
- [ ] 애니메이션 네이밍 컨벤션 준수
- [ ] 모든 디바이스에서 테스트
- [ ] 텍스트 오버플로우 처리

### 기존 컴포넌트 수정 시
- [ ] 하드코딩된 값을 변수로 교체
- [ ] 미디어쿼리 브레이크포인트 표준화
- [ ] 애니메이션 이름 통일
- [ ] Z-index 레이어 시스템 적용

## 브라우저 지원

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 성능 고려사항

1. CSS 변수는 런타임에 계산되므로 과도한 사용 주의
2. 애니메이션은 transform과 opacity 속성 우선 사용
3. 미디어쿼리는 모바일 퍼스트 접근법 권장
4. 불필요한 box-shadow 중복 방지

## 향후 개선 계획

1. CSS Grid와 Flexbox 혼합 사용 최적화
2. 다크 모드 지원을 위한 색상 변수 확장
3. 접근성(a11y) 고려한 반응형 개선
4. 성능 모니터링 및 최적화

## 문의 및 지원

반응형 시스템 관련 문의사항이나 개선 제안이 있으시면 개발팀에 문의해 주세요.