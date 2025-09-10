import React from 'react';
import Header from '../components/Header/Header';
import ContactGoogleForm from '../components/ContactGoogleForm/ContactGoogleForm';
import Footer from '../components/Footer/Footer';

const GoogleFormTest: React.FC = () => {
  return (
    <div className="google-form-test-page">
      <Header />
      <div style={{ paddingTop: '80px' }}>
        <ContactGoogleForm />
      </div>
      <Footer />
    </div>
  );
};

export default GoogleFormTest;