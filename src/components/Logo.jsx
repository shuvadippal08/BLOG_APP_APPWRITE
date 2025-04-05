import React from 'react';
import logo from '../assets/logo.jpg'; // adjust path based on your folder structure

function Logo({ width = '100px' }) {
  return (
    <div>
      <img 
        src={logo}
        alt="Logo"
        style={{ width, height: 'auto' }} 
      />
    </div>
  );
}

export default Logo;
