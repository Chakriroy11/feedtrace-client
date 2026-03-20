import React from 'react';
import { User, Mail, Bell, Shield, Lock, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  // Grab the basic info just to make the page look personalized!
  const userName = localStorage.getItem('feedtrace_user_name') || 'FeedTrace User';
  const userEmail = localStorage.getItem('feedtrace_user_email') || 'user@example.com';

  // The dummy save function
  const handleSave = (e) => {
    e.preventDefault();
    toast('Profile updates are disabled in this demo version.', {
      icon: '🔒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px', fontFamily: '"Inter", sans-serif' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#0f172a', fontWeight: '800' }}>Account Settings</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage your profile, security, and preferences.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* --- PERSONAL INFO (READ ONLY) --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Personal Information</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}><User size={16} style={{ marginBottom: '-3px', marginRight: '5px' }} /> Full Name</label>
              <input 
                type="text" 
                value={userName} 
                readOnly 
                style={readOnlyInputStyle} 
              />
            </div>
            <div>
              <label style={labelStyle}><Mail size={16} style={{ marginBottom: '-3px', marginRight: '5px' }} /> Email Address</label>
              <input 
                type="email" 
                value={userEmail} 
                readOnly 
                style={readOnlyInputStyle} 
              />
            </div>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', fontSize: '0.9rem' }}>
            <AlertCircle size={20} />
            To change your core account details, please contact FeedTrace Support.
          </div>
        </div>

        {/* --- PREFERENCES (STATIC UI) --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Notifications & Privacy</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%' }}><Bell size={20} color="#3b82f6" /></div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Review Status Alerts</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Get notified when the AI approves or rejects your bill.</div>
              </div>
            </div>
            {/* Visual Static Toggle (Always On) */}
            <div style={{ width: '44px', height: '24px', background: '#10b981', borderRadius: '30px', position: 'relative', cursor: 'not-allowed', opacity: 0.7 }}>
              <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#f5f3ff', padding: '10px', borderRadius: '50%' }}><Shield size={20} color="#8b5cf6" /></div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Public Profile</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow other users to see your verified reviews.</div>
              </div>
            </div>
            {/* Visual Static Toggle (Always On) */}
            <div style={{ width: '44px', height: '24px', background: '#10b981', borderRadius: '30px', position: 'relative', cursor: 'not-allowed', opacity: 0.7 }}>
              <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
            </div>
          </div>
        </div>

        {/* --- SECURITY (STATIC UI) --- */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>Security</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '50%' }}><Lock size={20} color="#d97706" /></div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#0f172a' }}>Password</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Last changed 30 days ago</div>
              </div>
            </div>
            <button type="button" onClick={handleSave} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#475569', cursor: 'pointer' }}>
              Update
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '20px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        >
          <Save size={20} /> Save Changes
        </button>

      </form>
    </div>
  );
};

// Styles
const cardStyle = { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const sectionHeader = { marginTop: 0, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', fontSize: '1.3rem', fontWeight: '800' };
const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px', color: '#475569' };
const readOnlyInputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', boxSizing: 'border-box', background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' };

export default Settings;