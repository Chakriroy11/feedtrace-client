import React from 'react';
import { User, Mail, Bell, Shield, Lock, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; // 📱 Added for mobile compatibility

const Settings = () => {
  const { isMobile } = useResponsive();

  // 🌟 Logic: Pull full user object if available, otherwise fallback to individual keys
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = storedUser.username || storedUser.name || localStorage.getItem('feedtrace_user_name') || 'FeedTrace User';
  const userEmail = storedUser.email || localStorage.getItem('feedtrace_user_email') || 'user@example.com';

  const handleSave = (e) => {
    e.preventDefault();
    toast('Profile updates are currently managed via Support.', {
      icon: '🔒',
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        fontWeight: '600'
      },
    });
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      paddingBottom: isMobile ? '100px' : '60px', 
      fontFamily: '"Inter", sans-serif' 
    }}>
      
      <div style={{ marginBottom: '40px', textAlign: isMobile ? 'center' : 'left' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', margin: '0 0 10px 0', color: '#0f172a', fontWeight: '900', letterSpacing: '-1px' }}>
          Account Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
          Manage your profile, security, and preferences.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* --- PERSONAL INFO --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Personal Information</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={labelStyle}><User size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} /> Full Name</label>
              <input 
                type="text" 
                value={userName} 
                readOnly 
                style={readOnlyInputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}><Mail size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} /> Email Address</label>
              <input 
                type="email" 
                value={userEmail} 
                readOnly 
                style={readOnlyInputStyle} 
              />
            </div>
          </div>

          <div style={{ 
            background: '#fff7ed', 
            border: '1px solid #ffedd5', 
            padding: '15px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            color: '#c2410c', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <AlertCircle size={20} />
            To change core details, please contact FeedTrace Support.
          </div>
        </div>

        {/* --- NOTIFICATIONS --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Notifications & Privacy</h3>
          
          <div style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px' }}><Bell size={20} color="#3b82f6" /></div>
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>Review Status Alerts</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Notifications for AI bill verification.</div>
              </div>
            </div>
            <Toggle active />
          </div>

          <div style={{ ...rowStyle, borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '12px' }}><Shield size={20} color="#8b5cf6" /></div>
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>Public Profile</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Display your verified badges to others.</div>
              </div>
            </div>
            <Toggle active />
          </div>
        </div>

        {/* --- SECURITY --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Security</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '12px' }}><Lock size={20} color="#d97706" /></div>
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>Password</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Last changed recently</div>
              </div>
            </div>
            <button type="button" onClick={handleSave} style={updateBtnStyle}>
              Update
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          style={saveBtnStyle}
        >
          <Save size={20} /> Save Preferences
        </button>

      </form>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const Toggle = ({ active }) => (
  <div style={{ 
    width: '44px', height: '24px', 
    background: active ? '#10b981' : '#e2e8f0', 
    borderRadius: '30px', position: 'relative', cursor: 'pointer' 
  }}>
    <div style={{ 
      width: '18px', height: '18px', background: 'white', 
      borderRadius: '50%', position: 'absolute', 
      right: active ? '3px' : '23px', top: '3px',
      transition: 'all 0.2s ease'
    }}></div>
  </div>
);

// --- STYLES ---
const cardStyle = { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' };
const sectionHeader = { marginTop: 0, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px', fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: '#64748b', textTransform: 'uppercase' };
const readOnlyInputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', boxSizing: 'border-box', background: '#f8fafc', color: '#1e293b', fontWeight: '600', cursor: 'not-allowed' };
const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f5f9' };
const updateBtnStyle = { background: 'white', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', color: '#0f172a', cursor: 'pointer', fontSize: '0.9rem' };
const saveBtnStyle = { width: '100%', padding: '20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' };

export default Settings;