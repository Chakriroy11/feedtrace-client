import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu,
  ChevronRight,
  User 
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import your new hook

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive(); // 📱 Check for mobile
  const [isExpanded, setIsExpanded] = useState(false);

  const userName = localStorage.getItem('feedtrace_user_name') || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const menuItems = [
    { path: '/home', icon: <Home size={isMobile ? 24 : 22} />, label: 'Home' },
    { path: '/my-reviews', icon: <ShoppingBag size={isMobile ? 24 : 22} />, label: 'Reviews' },
    { path: '/profile', icon: <User size={isMobile ? 24 : 22} />, label: 'Profile' }, // Added to mobile bar
    { path: '/settings', icon: <Settings size={isMobile ? 24 : 22} />, label: 'Settings' },
  ];

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // --- 🎨 RESPONSIVE STYLES ---
  const containerStyle = {
    position: 'fixed',
    left: 0,
    bottom: isMobile ? 0 : 'auto',
    top: isMobile ? 'auto' : 0,
    width: isMobile ? '100%' : (isExpanded ? '260px' : '80px'),
    height: isMobile ? '70px' : '100vh',
    background: '#ffffff',
    borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
    borderTop: isMobile ? '1px solid #e2e8f0' : 'none',
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    padding: isMobile ? '0 10px' : '20px 15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1000,
    boxShadow: isMobile ? '0 -4px 20px rgba(0,0,0,0.05)' : (isExpanded ? '10px 0 30px rgba(0,0,0,0.05)' : 'none'),
    justifyContent: isMobile ? 'space-around' : 'flex-start'
  };

  return (
    <div 
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
      style={containerStyle}
    >
      {/* 1. HEADER (Only Desktop) */}
      {!isMobile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '15px', 
          marginBottom: '40px', paddingLeft: '5px', overflow: 'hidden' 
        }}>
          <div style={{
            width: '40px', height: '40px', 
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', 
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexShrink: 0
          }}>
            <Menu size={20} />
          </div>
          <h2 style={{
            margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '800',
            opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap'
          }}>FeedTrace</h2>
        </div>
      )}

      {/* 2. MENU ITEMS */}
      <nav style={{
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column', 
        gap: isMobile ? '0' : '8px', 
        flex: isMobile ? 'none' : 1,
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'space-around' : 'flex-start'
      }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center', 
                gap: isMobile ? '4px' : '15px', 
                padding: isMobile ? '8px' : '12px', 
                borderRadius: '10px',
                border: 'none',
                background: isActive && !isMobile ? '#eff6ff' : 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {item.icon}
              {(isExpanded || isMobile) && (
                <span style={{
                  fontSize: isMobile ? '10px' : '0.95rem',
                  fontWeight: '700',
                  opacity: isMobile ? 1 : (isExpanded ? 1 : 0),
                  transition: 'opacity 0.2s'
                }}>
                  {item.label.split(' ')[isMobile ? 0 : 0]} {/* Shorten label on mobile */}
                </span>
              )}
            </button>
          );
        })}

        {/* 📱 Mobile Logout (Small icon) */}
        {isMobile && (
          <button onClick={handleLogout} style={{ border: 'none', background: 'transparent', color: '#ef4444', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <LogOut size={24} />
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Exit</span>
          </button>
        )}
      </nav>

      {/* 3. PROFILE SECTION (Desktop Only) */}
      {!isMobile && (
        <div 
          onClick={() => navigate('/profile')}
          style={{
            marginTop: 'auto', marginBottom: '10px',
            padding: '10px', borderRadius: '12px', 
            background: isExpanded ? '#f8fafc' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
            transition: 'background 0.2s',
            border: isExpanded ? '1px solid #e2e8f0' : '1px solid transparent'
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', 
            background: '#dbeafe', color: '#1e40af', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: '700', flexShrink: 0
          }}>{userInitial}</div>
          {isExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
              <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#1e293b'}}>{userName}</span>
              <span style={{fontSize: '0.75rem', color: '#64748b'}}>Profile</span>
            </div>
          )}
        </div>
      )}
      
      {/* 4. LOGOUT BUTTON (Desktop Only) */}
      {!isMobile && (
        <button 
          onClick={handleLogout}
          style={{
            background: isExpanded ? '#fee2e2' : 'transparent',
            color: '#ef4444', border: 'none', borderRadius: '10px', padding: '12px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px',
            transition: 'background 0.2s'
          }}
        >
          <LogOut size={22} />
          {isExpanded && <span style={{fontWeight: '600'}}>Logout</span>}
        </button>
      )}
    </div>
  );
};

export default Sidebar;