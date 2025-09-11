import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Portfolio.css';

interface PortfolioItem {
  id: string;
  category: string;
  src: string;
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
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  const categories: CategoryInfo[] = [
    { id: 'all', name: '전체', color: '#333333' },
    { id: 'search', name: '서칭', color: '#FF6B6B' },
    { id: 'goods', name: '굿즈', color: '#4ECDC4' },
    { id: 'apparel', name: '어패럴', color: '#45B7D1' },
    { id: 'pc', name: 'PC', color: '#96CEB4' }
  ];

  // URL 파라미터에서 카테고리 읽기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && categories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search, categories]);

  // 포트폴리오 이미지 로드
  useEffect(() => {
    const loadPortfolioItems = () => {
      const items: PortfolioItem[] = [];
      const imageCategories = ['search', 'goods', 'apparel', 'pc'];
      
      imageCategories.forEach(category => {
        for (let i = 1; i <= 6; i++) {
          items.push({
            id: `${category}_${i}`,
            category,
            src: `/portfolio/${category}/${category}_${i}.svg`,
            alt: `${category} 포트폴리오 ${i}`
          });
        }
      });
      
      // 랜덤 순서로 섞기
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      setPortfolioItems(shuffledItems);
      setIsLoading(false);
    };

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
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

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
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="portfolio-item"
              onClick={() => openLightbox(item)}
            >
              <div className="item-image-wrapper">
                <img
                  src={item.src}
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
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h3>{selectedImage.alt}</h3>
              <span className="lightbox-category">
                {categories.find(cat => cat.id === selectedImage.category)?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;