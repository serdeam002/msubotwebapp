// File: HeaderComponent.js
import React from 'react';

const HeaderComponent = ({ isLoggedIn, onLogout }) => {
  return (
    <header className='d-flex bg-primary justify-content-between'>
      <h1 className='ms-4 m-2 text-white fs-2'>MSUBOTREGISTERETION</h1>
      {isLoggedIn && (
        <button className='btn btn-danger m-2' onClick={onLogout}>Logout</button>
      )}
    </header>
  );
};

export default HeaderComponent;
