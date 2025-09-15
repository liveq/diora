import React, { useState, useEffect } from 'react';
import AdminAuth from '../components/AdminAuth/AdminAuth';
import AdminPage from './AdminPage';

interface AdminPageSecureProps {}

const AdminPageSecure: React.FC<AdminPageSecureProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 인증 확인
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem('adminAuthenticated');
      const authExpiry = sessionStorage.getItem('authExpiry');

      if (authenticated && authExpiry && Date.now() < parseInt(authExpiry)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('authExpiry');
      }
    };

    checkAuth();
    // 1분마다 인증 상태 확인
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  // 인증 성공 핸들러
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // 인증되지 않았으면 인증 화면 표시
  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  // 인증되었으면 AdminPage 표시
  return <AdminPage />;
};

export default AdminPageSecure;