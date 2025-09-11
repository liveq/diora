import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 라우트가 변경될 때마다 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;