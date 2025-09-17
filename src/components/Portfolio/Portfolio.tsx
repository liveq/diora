import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDragScroll } from '../../hooks/useDragScroll';
import './Portfolio.css';

interface PortfolioItem {
  id: string;
  category: string;
  thumbnailSrc: string;
  fullSrc: string;
  alt: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // 처음에 6개만 보여주기

  const location = useLocation();
  const navigate = useNavigate();
  const { dragMoved } = useDragScroll();

  const categories: CategoryInfo[] = useMemo(() => [
    { id: 'all', name: '전체', color: '#333333' },
    { id: 'search', name: '서칭', color: '#FF6B6B' },
    { id: 'goods', name: '굿즈', color: '#4ECDC4' },
    { id: 'apparel', name: '어패럴', color: '#45B7D1' },
    { id: 'pc', name: 'PC', color: '#96CEB4' }
  ], []);

  // URL 파라미터에서 카테고리 읽기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');

    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search, categories]);

  // 포트폴리오 이미지 로드 - 썸네일과 풀사이즈 구분
  useEffect(() => {
    const loadPortfolioItems = () => {
      const items: PortfolioItem[] = [];
      const imageCategories = ['search', 'goods', 'apparel', 'pc'];

      // WebP만 사용 (모든 최신 브라우저 지원)
      const format = 'webp';

      // 이미지 존재 여부를 체크하지 않고 바로 추가 (모든 이미지가 있다고 가정)
      for (const category of imageCategories) {
        for (let i = 1; i <= 6; i++) {
          const baseName = `${category}_${i}`;
          items.push({
            id: baseName,
            category,
            thumbnailSrc: `/portfolio/thumbnails/${category}/${baseName}.${format}`,
            fullSrc: `/portfolio/full/${category}/${baseName}.${format}`,
            alt: `${category} 포트폴리오 ${i}`
          });
        }
      }

      // 랜덤 순서로 섞기
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      setPortfolioItems(shuffledItems);
      setIsLoading(false);

      // 이미지 프리로딩 (백그라운드에서 미리 로드)
      const preloadImages = () => {
        shuffledItems.forEach((item, index) => {
          // 처음 6개는 이미 보이므로 7번째부터 프리로드
          if (index >= 6) {
            const img = new Image();
            img.src = item.thumbnailSrc;
          }
        });
      };

      // 0.3초 후 나머지 이미지 표시 & 프리로딩 시작
      setTimeout(() => {
        setVisibleCount(24);
        preloadImages();
      }, 300);
    };

    // 즉시 실행
    loadPortfolioItems();
  }, []);

  // 필터링된 아이템 업데이트
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, portfolioItems]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    // URL 업데이트
    if (categoryId === 'all') {
      navigate('/portfolio', { replace: true });
    } else {
      navigate(`/portfolio?category=${categoryId}`, { replace: true });
    }
  };

  const openLightbox = (item: PortfolioItem) => {
    setSelectedImage(item);
    const index = filteredItems.findIndex(i => i.id === item.id);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!filteredItems.length) return;

    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? filteredItems.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === filteredItems.length - 1 ? 0 : currentImageIndex + 1;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredItems[newIndex]);
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, filteredItems]);

  const randomizeOrder = () => {
    const shuffled = [...filteredItems].sort(() => Math.random() - 0.5);
    setFilteredItems(shuffled);
  };

  if (isLoading) {
    return (
      <div className="portfolio-loading">
        <div className="loading-spinner"></div>
        <p>포트폴리오를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="container">
        <div className="portfolio-header">
          <h1>포트폴리오</h1>
          <p className="portfolio-subtitle">
            DIORA의 다양한 프로젝트와 제작 사례를 확인해보세요
          </p>
        </div>

        <div className="portfolio-controls">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                style={{
                  '--category-color': category.color
                } as React.CSSProperties}
              >
                {category.name}
              </button>
            ))}
          </div>

          <button className="randomize-btn" onClick={randomizeOrder}>
            <span className="randomize-icon">🎲</span>
            랜덤 정렬
          </button>
        </div>

        <div className="portfolio-stats">
          <span className="stats-count">
            총 {filteredItems.length}개의 작품
          </span>
        </div>

        <div className="portfolio-grid">
          {filteredItems.slice(0, visibleCount).map(item => (
            <div
              key={item.id}
              className="portfolio-item"
              onClick={() => openLightbox(item)}
            >
              <div className="item-image-wrapper">
                <img
                  src={item.thumbnailSrc}
                  alt={item.alt}
                  className="item-image"
                  loading="lazy"
                />
                <div className="item-overlay">
                  <span className="overlay-icon">🔍</span>
                  <span className="overlay-text">자세히 보기</span>
                </div>
              </div>
              <div className="item-info">
                <span className="item-category">
                  {categories.find(cat => cat.id === item.category)?.name}
                </span>
              </div>
            </div>
          ))}
          {/* 스켈레톤 로더 */}
          {visibleCount < filteredItems.length && (
            [...Array(Math.min(6, filteredItems.length - visibleCount))].map((_, index) => (
              <div key={`skeleton-${index}`} className="portfolio-item skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
              </div>
            ))
          )}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-items">
            <p>해당 카테고리에 포트폴리오가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 라이트박스 모달 */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>

            {/* 이전/다음 네비게이션 */}
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              aria-label="이전 이미지"
            >
              ‹
            </button>

            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              aria-label="다음 이미지"
            >
              ›
            </button>

            <img
              src={selectedImage.fullSrc}
              alt={selectedImage.alt}
              className="lightbox-image"
            />

            <div className="lightbox-info">
              <h3>{selectedImage.alt}</h3>
              <span className="lightbox-category">
                {categories.find(cat => cat.id === selectedImage.category)?.name}
              </span>
              <span className="lightbox-counter">
                {currentImageIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;