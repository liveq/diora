import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import GoogleFormTest from './pages/GoogleFormTest';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/ScrollToTop';
import Chat from './components/Chat/Chat';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Process />
      <About />
      <FAQ />
      <ContactGoogleFormCompact />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/google-form-test" element={<GoogleFormTest />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Chat />
      </div>
    </Router>
  );
}

export default App;
