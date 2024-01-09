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
    const allowedRoutes = ['/', '/data'];  // รายการเส้นทางที่อนุญาต

    if (token) {
      setLoggedIn(true);

      // ถ้ามี token และผู้ใช้พยายามไปยังเส้นทางที่ไม่ได้รับอนุญาต, ให้ทำการ redirect ไปที่ /data
      if (!allowedRoutes.includes(currentLocation.pathname) || currentLocation.pathname === '/') {
        navigate('/data');
      }

    } else {
      setLoggedIn(false);

      // ถ้าไม่มี token และผู้ใช้ไม่ได้อยู่ที่เส้นทาง / หรือ /login, ให้ทำการ redirect ไปที่ /
      if (!allowedRoutes.includes(currentLocation.pathname)) {
        navigate('/');
      }
    }
  }, [navigate, currentLocation]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setLoggedIn(true);
    // Redirect ไปที่ /data หลังจาก login
    navigate('/data');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    // Redirect ไปที่ / หลังจาก logout
    navigate('/');
  };

  return (
    <div>
      <HeaderComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LoginComponent onLogin={handleLogin} />} />
        <Route path="/data" element={isLoggedIn ? <DataComponent /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
