import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css'; 
import logoImg from '../assets/logo.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server Error: Backend connection failed.");
      }

      const data = await res.json();

      if (res.ok) {
        const userData = data.user || data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        localStorage.setItem('feedtrace_user_name', userData.username || userData.name);
        
        toast.success(`Welcome back, ${userData.username || 'User'}!`);
        navigate('/home', { replace: true }); 
      } else {
        toast.error(data.error || "Invalid Email or Password");
      }
    } catch (err) { 
      console.error("Login Error:", err);
      toast.error(err.message || "Connection Error"); 
    }
    finally { setLoading(false); }
  };

  return (
    // 🌟 Using inline flex to force the 50/50 split regardless of CSS issues
    <div className="auth-container" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* --- LEFT SIDE: EXACT 50% --- */}
      <div className="auth-left" style={{ flex: '0 0 50%', height: '100%', padding: 0, margin: 0, overflow: 'hidden', position: 'relative' }}>
        <div className="image-wrapper login-mode" style={{ width: '100%', height: '100%' }}>
          <img 
            src={logoImg} 
            alt="FeedTrace" 
            className="auth-brand-img" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />
          <div className="overlay-text" style={{ position: 'absolute', bottom: '10%', left: '10%', zIndex: 2 }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: 0 }}>Welcome Back</h3>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>Sign in to explore verified product insights.</p>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: EXACT 50% --- */}
      <div className="auth-right" style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          
          <div className="auth-header">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b' }}>Sign In</h2>
            <p style={{ color: '#64748b' }}>Enter your <span>FeedTrace</span> credentials.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <Mail size={20} className="input-icon" color="#94a3b8" />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={handleChange} 
                autoComplete="email"
              />
            </div>
            
            <div className="input-group">
              <Lock size={20} className="input-icon" color="#94a3b8" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                required 
                value={formData.password}
                onChange={handleChange} 
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </div>
              ) : (
                <>
                  Sign In <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            New to FeedTrace? 
            <span 
              onClick={() => navigate('/signup')} 
              className="link-text"
              style={{ cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold', color: '#3b82f6' }}
            >
              Create Account
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;