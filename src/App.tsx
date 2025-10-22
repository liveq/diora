import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Process from './components/Process/Process';
import About from './components/About/About';
import FAQ from './components/FAQ/FAQ';
// import Contact from './components/Contact/Contact';
import ContactGoogleFormCompact from './components/ContactGoogleFormCompact/ContactGoogleFormCompact';
import Footer from './components/Footer/Footer';
import PortfolioPage from './pages/PortfolioPage';
import FoodPage from './pages/FoodPage';
import AdminPageSecure from './pages/AdminPageSecure';
import RelatedServicesPage from './pages/RelatedServicesPage';
import ScrollToTop from './components/ScrollToTop';
import Chat from './components/Chat/Chat';
import TopButton from './components/TopButton/TopButton';
import { useDragScroll } from './hooks/useDragScroll';

function HomePage() {
  const { dragMoved } = useDragScroll();

  // 새로고침 시 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <Header />
      <Hero />
      <Services />
      <Process />
      <About />
      <FAQ />
      <ContactGoogleFormCompact />
      <Footer />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isDiocsPage = location.pathname.toLowerCase() === '/diocs';

  console.log('Current path:', location.pathname);
  console.log('Is diocs page:', isDiocsPage);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/related-services" element={<RelatedServicesPage />} />
        <Route path="/diocs" element={<AdminPageSecure />} />
      </Routes>
      {/* /diocs 경로가 아닐 때만 Chat 컴포넌트와 TopButton 렌더링 */}
      {!isDiocsPage && <Chat />}
      {!isDiocsPage && <TopButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
