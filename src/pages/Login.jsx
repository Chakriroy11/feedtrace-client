import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; 
import './Auth.css'; 
import logoImg from '../assets/logo.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); 
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 🌐 Points to your Render Backend
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (res.ok) {
        const userData = data.user || data;

        // 🔑 KEY FIX: App.jsx looks for 'feedtrace_user_name' to unlock ProtectedRoutes
        localStorage.setItem('feedtrace_user_name', userData.username || userData.name || "User");
        
        // 💾 Save supplementary data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        toast.success(`Welcome back!`);

        // 🚀 FORCE REFRESH: Ensures App.jsx re-renders and clears the login gate
        window.location.href = '/home'; 
      } else {
        toast.error(data.error || "Invalid Email or Password");
      }
    } catch (err) { 
      console.error("Login Error:", err);
      toast.error("Connection failed. Check your internet or backend status."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      width: '100vw', 
      height: '100vh',
      margin: 0,
      padding: 0,
      background: '#fff',
      overflow: 'hidden'
    }}>
      
      {/* --- LEFT: BRANDING IMAGE (50% Split) --- */}
      <div className="auth-left" style={{ 
        flex: isMobile ? '0 0 35%' : '0 0 50%', 
        height: isMobile ? '35vh' : '100vh',
        overflow: 'hidden'
      }}>
        <img 
          src={logoImg} 
          alt="FeedTrace" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* --- RIGHT: CENTERED FORM (50% Split) --- */}
      <div className="auth-right" style={{ 
        flex: isMobile ? '1' : '0 0 50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: isMobile ? '2.8rem' : '3.8rem', 
              fontWeight: '800', 
              background: 'linear-gradient(to right, #00AEEF, #6366f1)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.1'
            }}>
              Sign In
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Welcome back to <span style={{ color: '#FF7A00', fontWeight: '700' }}>FeedTrace</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={inputGroupStyle}>
              <Mail size={22} color="#94a3b8" />
              <input 
                type="email" name="email" placeholder="Email Address" required 
                onChange={handleChange} style={inputStyle} 
              />
            </div>
            
            <div style={inputGroupStyle}>
              <Lock size={22} color="#94a3b8" />
              <input 
                type="password" name="password" placeholder="Password" required 
                onChange={handleChange} style={inputStyle} 
              />
            </div>

            <button type="submit" disabled={loading} style={buttonStyle}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>Login <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '35px', color: '#64748b' }}>
            New to the platform? 
            <span 
              onClick={() => navigate('/signup')} 
              style={{ color: '#22c55e', fontWeight: '800', cursor: 'pointer', marginLeft: '8px' }}
            >
              Sign Up
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const inputGroupStyle = { display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', border: '1.5px solid #E2E8F0', padding: '18px 25px', borderRadius: '15px' };
const inputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1E293B' };
const buttonStyle = { 
  background: 'linear-gradient(90deg, #00AEEF 0%, #22c55e 100%)', 
  color: 'white', padding: '18px', border: 'none', borderRadius: '15px', 
  fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer', marginTop: '10px', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 174, 239, 0.2)' 
};

export default Login;