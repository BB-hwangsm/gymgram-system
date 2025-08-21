// frontend/src/components/common/Navigation.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="nav">
      <div className="nav-content">
        <Link 
          to="/schedule" 
          className={`nav-btn ${isActive('/schedule') ? 'active' : ''}`}
        >
          <span>📅</span>
          스케줄
        </Link>
        <Link 
          to="/members" 
          className={`nav-btn ${isActive('/members') ? 'active' : ''}`}
        >
          <span>👥</span>
          회원
        </Link>
      </div>
    </div>
  );
};

export default Navigation;