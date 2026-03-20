import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { useResponsive } from './hooks/useResponsive'; // 🌟 Import the hook

// Pages
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

// Components
import Sidebar from './components/Sidebar';
import AdFooter from './components/AdFooter';

// --- THE GUARD COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('feedtrace_user_name'); 
  const { isMobile } = useResponsive(); // 📱 Listen for mobile screen

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
      minHeight: '100vh', 
      background: '#f8fafc' 
    }}>
      <Sidebar />
      
      <div style={{ 
        flex: 1, 
        // 🌟 DYNAMIC MARGIN: No left margin on mobile because sidebar is at the bottom
        marginLeft: isMobile ? '0' : '80px', 
        // 🌟 DYNAMIC PADDING: Less padding on mobile to save space
        padding: isMobile ? '20px 15px 100px 15px' : '40px', 
        transition: 'all 0.3s ease',
        display: 'flex',            
        flexDirection: 'column'      
      }}>
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* --- GLOBAL SPONSOR ADS --- */}
        <div style={{ marginTop: '40px' }}>
          <AdFooter />
        </div>
        
      </div>
    </div>
  );
};

function App() {
  const isAuthenticated = localStorage.getItem('feedtrace_user_name');

  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={
           isAuthenticated ? <Navigate to="/home" /> : <LandingPage />
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 

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