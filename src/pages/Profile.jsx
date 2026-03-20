import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Edit2, Check, X, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; 

const Profile = () => {
  const { isMobile } = useResponsive(); 
  const [isEditing, setIsEditing] = useState(false);
  
  // 🌟 Initialize state with basic storage info
  const [user, setUser] = useState({
    name: localStorage.getItem('feedtrace_user_name') || 'Guest User',
    email: localStorage.getItem('feedtrace_user_email') || 'user@example.com',
    role: 'Verified Buyer',
    joined: 'Jan 2026',
    bio: 'AI-Verified Reviewer',
    image: localStorage.getItem('feedtrace_user_image') || null 
  });

  useEffect(() => {
    // 🌟 Pull the full user object we saved during Login
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storedName = localStorage.getItem('feedtrace_user_name');
    const storedEmail = localStorage.getItem('feedtrace_user_email');
    const storedImage = localStorage.getItem('feedtrace_user_image');
    
    setUser(prev => ({
      ...prev,
      // 🌟 Check every possible place for the name and email
      name: storedName || storedUser.username || storedUser.name || prev.name,
      email: storedEmail || storedUser.email || prev.email,
      image: storedImage || prev.image || null 
    }));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error("Image too large. Max 1.5MB for profile photos.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // 💾 Persist to individual keys for quick access
    localStorage.setItem('feedtrace_user_name', user.name);
    localStorage.setItem('feedtrace_user_email', user.email);
    if (user.image) {
        localStorage.setItem('feedtrace_user_image', user.image);
    }
    
    // 💾 Sync with the main user object
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { 
      ...storedUser, 
      name: user.name, 
      username: user.name, 
      email: user.email 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setIsEditing(false);
    toast.success("Profile Updated Successfully!");
  };

  const handleCancel = () => {
    // Revert to last saved state in storage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(prev => ({
        ...prev,
        name: localStorage.getItem('feedtrace_user_name') || storedUser.name || prev.name,
        email: localStorage.getItem('feedtrace_user_email') || storedUser.email || prev.email,
        image: localStorage.getItem('feedtrace_user_image') || prev.image,
    }));
    setIsEditing(false);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      paddingBottom: isMobile ? '120px' : '40px',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* 1. HEADER */}
      <div style={{
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: isMobile ? '15px' : '0',
        marginBottom: '30px'
      }}>
        <div>
            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
            My <span style={{color: '#3b82f6'}}>Profile</span>
            </h2>
            <p style={{color: '#64748b', fontWeight: '500', marginTop: '5px'}}>Manage your identity and public presence.</p>
        </div>
        
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} style={editBtnStyle}>
            <Edit2 size={16}/> Edit Profile
          </button>
        ) : (
          <div style={{display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto'}}>
            <button onClick={handleCancel} style={{...cancelBtnStyle, flex: isMobile ? 1 : 'none'}}>
              <X size={16}/> Cancel
            </button>
            <button onClick={handleSave} style={{...saveBtnStyle, flex: isMobile ? 1 : 'none'}}>
              <Check size={16}/> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* 2. PROFILE CARD */}
      <div style={{ background: 'white', borderRadius: '28px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ height: isMobile ? '100px' : '160px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}></div>

        <div style={{ padding: isMobile ? '0 20px 30px' : '0 40px 40px', marginTop: isMobile ? '-45px' : '-60px' }}>
          
          <div style={{ marginBottom: '25px', position: 'relative', width: 'fit-content' }}>
            <div style={{ 
              width: isMobile ? '90px' : '120px', 
              height: isMobile ? '90px' : '120px', 
              borderRadius: '50%', 
              background: 'white', padding: '6px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {user.image ? (
                 <img src={user.image} alt="Profile" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                <div style={{ 
                    width: '100%', height: '100%', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                    color: '#3b82f6', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: '900'
                }}>
                    {user.name.charAt(0)}
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <input type="file" id="profile-image-upload" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
                <button 
                  onClick={() => document.getElementById('profile-image-upload').click()}
                  style={cameraIconStyle}>
                  <Camera size={18}/>
                </button>
              </>
            )}
          </div>

          <div style={{marginBottom: '35px'}}>
            {isEditing ? (
               <input 
                 type="text" name="name" value={user.name} onChange={handleChange}
                 style={nameInputStyle}
                 placeholder="Enter your name"
               />
            ) : (
               <h1 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: '900' }}>{user.name}</h1>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#10b981', padding: '6px 14px', borderRadius: '12px', width: 'fit-content', fontSize: '0.85rem', fontWeight: '900' }}>
               <Shield size={16} /> {user.role}
            </div>
          </div>

          {/* 3. DETAILS GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '20px' 
          }}>
            
            <div style={infoBoxStyle}>
              <Mail size={18} color="#94a3b8" />
              <div style={{width: '100%'}}>
                <span style={labelStyle}>Email Address</span>
                {isEditing ? (
                  <input type="email" name="email" value={user.email} onChange={handleChange} style={inputStyle} />
                ) : (
                  <span style={valueStyle}>{user.email}</span>
                )}
              </div>
            </div>

            <div style={infoBoxStyle}>
              <Calendar size={18} color="#94a3b8" />
              <div>
                <span style={labelStyle}>Joined FeedTrace</span>
                <span style={valueStyle}>{user.joined}</span>
              </div>
            </div>

            <div style={{...infoBoxStyle, gridColumn: isMobile ? 'auto' : '1 / -1'}}>
              <User size={18} color="#94a3b8" />
              <div style={{width: '100%'}}>
                <span style={labelStyle}>Bio / About Me</span>
                {isEditing ? (
                  <textarea 
                    name="bio" 
                    value={user.bio} 
                    onChange={handleChange} 
                    rows="3" 
                    style={{...inputStyle, resize: 'none', background: 'white'}} 
                    placeholder="Tell us about your shopping preferences..."
                  />
                ) : (
                  <span style={{...valueStyle, fontStyle: 'italic', color: '#64748b', fontWeight: '500', lineHeight: 1.5}}>{user.bio}</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const editBtnStyle = { padding: '12px 24px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: '800', cursor: 'pointer', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' };
const cancelBtnStyle = { padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#f1f5f9', fontWeight: '800', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.95rem' };
const saveBtnStyle = { padding: '12px 24px', borderRadius: '14px', border: 'none', background: '#3b82f6', fontWeight: '800', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.95rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' };
const infoBoxStyle = { display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' };
const valueStyle = { display: 'block', fontWeight: '800', color: '#1e293b', fontSize: '1rem', wordBreak: 'break-all' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', fontWeight: '600', color: '#1e293b' };
const nameInputStyle = { fontSize: '1.4rem', fontWeight: '900', color: '#0f172a', border: '2px solid #3b82f6', borderRadius: '14px', padding: '12px', width: '100%', marginBottom: '10px', outline: 'none' };
const cameraIconStyle = { position: 'absolute', bottom: '5px', right: '5px', background: '#0f172a', color: 'white', border: '4px solid white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };

export default Profile;