import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css'; 
import logoImg from '../assets/logo.jpg'; 

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 🛡️ ULTRA-SAFETY FALLBACK 🛡️
    const envUrl = import.meta.env.VITE_API_URL;
    const baseUrl = (envUrl && envUrl.length > 5 && !envUrl.includes('import.meta')) 
      ? envUrl 
      : 'https://feedtrace-api.onrender.com';

    // Remove any trailing slashes to prevent //api/auth/signup errors
    const cleanBaseUrl = baseUrl.replace(/\/$/, ''); 
    const apiUrl = `${cleanBaseUrl}/api/auth/signup`;
    
    console.log("🚀 Attempting Signup at:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Your backend might be waking up.");
      }

      const data = await res.json();
      
      if (res.ok) {
        toast.success("Account created! Redirecting to login...");
        
        // Pre-fill login for convenience
        localStorage.setItem('temp_signup_email', formData.email);
        
        setTimeout(() => {
          navigate('/login'); 
        }, 1500);
      } else {
        toast.error(data.error || "Signup failed. This email may already be registered.");
      }
    } catch (err) { 
      console.error("Signup Error:", err);
      toast.error(err.message || "Connection failed. Please wait 30s and try again."); 
    }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="image-wrapper signup-mode">
          <img src={logoImg} alt="FeedTrace" className="auth-brand-img" />
          <div className="overlay-text">
            <h3>Join our Community</h3>
            <p>Help us verify and review products for everyone.</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join <span style={{color: '#3b82f6', fontWeight: 'bold'}}>FeedTrace</span> today.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User size={20} className="input-icon"/>
              <input 
                type="text" name="username" placeholder="Full Name" required 
                value={formData.username} onChange={handleChange} autoComplete="name"
              />
            </div>

            <div className="input-group">
              <Mail size={20} className="input-icon"/>
              <input 
                type="email" name="email" placeholder="Email Address" required 
                value={formData.email} onChange={handleChange} autoComplete="email"
              />
            </div>
            
            <div className="input-group">
              <Lock size={20} className="input-icon"/>
              <input 
                type="password" name="password" placeholder="Create Password" required 
                value={formData.password} onChange={handleChange} autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-btn" style={{
              background: 'linear-gradient(90deg, #00AEEF 0%, #22c55e 100%)',
              color: 'white',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Account...
                </div>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer" style={{marginTop: '20px', textAlign: 'center'}}>
            Already have an account? 
            <span onClick={() => navigate('/login')} className="link-text" style={{ marginLeft: '5px', cursor: 'pointer', color: '#3b82f6', fontWeight: 'bold' }}>
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;