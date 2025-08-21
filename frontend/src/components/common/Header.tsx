// frontend/src/components/common/Header.tsx

import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-logo">
          <div>
            <h1>💪 GymGram</h1>
            <div className="header-subtitle">헬스장 관리 시스템</div>
          </div>
        </div>
        
        <div className="flex gap-16">
          <div className="avatar avatar-md">
            <span>T</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;