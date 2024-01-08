// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginComponent from './component/LoginComponent';
import DataComponent from './component/DataComponent';
import HeaderComponent from './component/HeaderComponent';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();
  const currentLocation = useLocation();

  useEffect(() => {
    // Check for the presence of the token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);

      // If there is a token and the user tries to go to the login page, redirect to /data
      if (currentLocation.pathname === '/' || currentLocation.pathname === '/login') {
        navigate('/data');
      }
    }
  }, [navigate, currentLocation]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setLoggedIn(true);
    // Redirect to /data after login
    navigate('/data');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    // Redirect to /login after logout
    navigate('/');
  };

  return (
    <div>
      <HeaderComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LoginComponent onLogin={handleLogin} />} />
        <Route path="/data" element={isLoggedIn ? <DataComponent /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
