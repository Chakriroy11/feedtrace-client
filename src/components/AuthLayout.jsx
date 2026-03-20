import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../pages/Auth.css'; // This connects to your styling
import logoImg from '../assets/logo.jpg'; // Ensures the logo works

const AuthLayout = () => {
  const location = useLocation();
  // Check if we are on the signup page to trigger the zoom animation
  const isSignup = location.pathname === '/signup';

  return (
    <div className="auth-container">
      
      {/* LEFT SIDE: Persistent Image */}
      <div className="auth-left">
        <div className={`image-wrapper ${isSignup ? 'signup-mode' : 'login-mode'}`}>
          <img src={logoImg} alt="FeedTrace" className="auth-brand-img" />
        </div>
        <div className="overlay-gradient"></div>
      </div>

      {/* RIGHT SIDE: Dynamic Form Area */}
      <div className="auth-right">
        {/* The 'key' forces the form to animate in/out on route change */}
        <div key={location.pathname} className="fade-in-form">
          <Outlet />
        </div>
      </div>
      
    </div>
  );
};

export default AuthLayout;