import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { useResponsive } from './hooks/useResponsive';

// Pages & Components
import LandingPage from './pages/Landing'; 
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ReviewForm from './pages/ReviewForm';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import MyReviews from './pages/MyReviews';
import CategoryPage from './pages/CategoryPage';
import SubCategoryPage from './pages/SubCategoryPage'; 
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import Sidebar from './components/Sidebar';
import AdFooter from './components/AdFooter';

// --- THE GUARD COMPONENT ---
const ProtectedRoute = ({ children }) => {
  // We check storage directly inside the component every time it mounts
  const user = localStorage.getItem('feedtrace_user_name'); 
  const { isMobile } = useResponsive();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      minHeight: '100vh', 
      background: '#f8fafc' 
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: isMobile ? '0' : '80px', 
        padding: isMobile ? '20px 15px 100px 15px' : '40px', 
        transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column'      
      }}>
        <div style={{ flex: 1 }}>{children}</div>
        <div style={{ marginTop: '40px' }}><AdFooter /></div>
      </div>
    </div>
  );
};

function App() {
  // 🌟 NEW: State to track authentication status
  const [user, setUser] = useState(localStorage.getItem('feedtrace_user_name'));

  // 🌟 NEW: Listen for changes in storage (to handle login/logout immediately)
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem('feedtrace_user_name'));
    };

    window.addEventListener('storage', handleStorageChange);
    // Periodically check (useful for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <Toaster position="top-center" />
      
      <Routes>
        {/* Landing logic based on current user state */}
        <Route path="/" element={ user ? <Navigate to="/home" replace /> : <LandingPage /> } />
        
        {/* Pass user state to Login if needed, or just let it navigate */}
        <Route path="/login" element={ user ? <Navigate to="/home" replace /> : <Login /> } />
        <Route path="/signup" element={ user ? <Navigate to="/home" replace /> : <Signup /> } /> 

        {/* --- PROTECTED ROUTES --- */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:productId" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/product/:productId/review" element={<ProtectedRoute><ReviewForm /></ProtectedRoute>} />
        <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/category/:catId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/category/:catId/:subId" element={<ProtectedRoute><SubCategoryPage /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;