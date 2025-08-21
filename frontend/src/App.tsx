// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import SchedulePage from './pages/SchedulePage';
import MembersPage from './pages/MembersPage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <Navigation />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/schedule" replace />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/members" element={<MembersPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;