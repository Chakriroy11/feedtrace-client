import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Edit2, Check, X, Camera } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import the hook

const Profile = () => {
  const { isMobile } = useResponsive(); // 📱 Listen for screen size
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'user@example.com',
    role: 'Verified Buyer',
    joined: 'Jan 2026',
    bio: 'No bio added yet.',
    image: null 
  });

  useEffect(() => {
    const storedName = localStorage.getItem('feedtrace_user_name');
    const storedRole = localStorage.getItem('feedtrace_user_role');
    const storedEmail = localStorage.getItem('feedtrace_user_email'); 
    const storedImage = localStorage.getItem('feedtrace_user_image');
    
    if (storedName) {
      setUser(prev => ({
        ...prev,
        name: storedName,
        role: storedRole || 'User',
        email: storedEmail || 'user@example.com',
        image: storedImage || null 
      }));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size is too large. Please choose an image under 2MB.");
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
    localStorage.setItem('feedtrace_user_name', user.name);
    if (user.image) {
        localStorage.setItem('feedtrace_user_image', user.image);
    }
    setIsEditing(false);
    alert("✅ Profile Updated!");
  };

  const handleCancel = () => {
    const storedName = localStorage.getItem('feedtrace_user_name');
    const storedImage = localStorage.getItem('feedtrace_user_image');
    setUser(prev => ({
        ...prev,
        name: storedName || prev.name,
        image: storedImage || prev.image,
    }));
    setIsEditing(false);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      paddingBottom: isMobile ? '100px' : '40px' // Space for bottom navigation
    }}>
      
      {/* 1. RESPONSIVE HEADER */}
      <div style={{
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: isMobile ? '15px' : '0',
        marginBottom: '25px'
      }}>
        <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          My Profile
        </h2>
        
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
              <Check size={16}/> Save
            </button>
          </div>
        )}
      </div>

      {/* 2. CARD CONTAINER */}
      <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Banner Area */}
        <div style={{ height: isMobile ? '100px' : '140px', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}></div>

        {/* Profile Content */}
        <div style={{ padding: isMobile ? '0 20px 30px' : '0 30px 40px', marginTop: isMobile ? '-40px' : '-50px' }}>
          
          {/* Avatar Area */}
          <div style={{ marginBottom: '20px', position: 'relative', width: 'fit-content' }}>
            <div style={{ 
              width: isMobile ? '90px' : '110px', 
              height: isMobile ? '90px' : '110px', 
              borderRadius: '50%', 
              background: 'white', padding: '5px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {user.image ? (
                 <img src={user.image} alt="Profile" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
              ) : (
                <div style={{ 
                    width: '100%', height: '100%', borderRadius: '50%', 
                    background: '#f1f5f9', color: '#64748b', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: isMobile ? '2rem' : '3rem', fontWeight: 'bold'
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
                  style={{
                    position: 'absolute', bottom: '0px', right: '0px',
                    background: '#0f172a', color: 'white', border: 'none',
                    width: '32px', height: '32px', borderRadius: '50%',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                  <Camera size={16}/>
                </button>
              </>
            )}
          </div>

          {/* User Basic Info */}
          <div style={{marginBottom: '30px'}}>
            {isEditing ? (
               <input 
                 type="text" name="name" value={user.name} onChange={handleChange}
                 style={{
                   fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', 
                   border: '1px solid #cbd5e1', borderRadius: '12px', padding: '10px', width: '100%', marginBottom: '10px'
                 }}
               />
            ) : (
               <h1 style={{ margin: '0 0 5px', color: '#1e293b', fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '800' }}>{user.name}</h1>
            )}

            <p style={{ margin: 0, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '700' }}>
               <Shield size={16} /> {user.role}
            </p>
          </div>

          {/* 3. RESPONSIVE DETAILS GRID */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', // Single column on mobile
            gap: isMobile ? '12px' : '20px' 
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

            {/* Bio spans full width always */}
            <div style={{...infoBoxStyle, gridColumn: isMobile ? 'auto' : '1 / -1'}}>
              <User size={18} color="#94a3b8" />
              <div style={{width: '100%'}}>
                <span style={labelStyle}>Bio</span>
                {isEditing ? (
                  <textarea name="bio" value={user.bio} onChange={handleChange} rows="3" style={{...inputStyle, resize: 'none'}} />
                ) : (
                  <span style={{...valueStyle, fontStyle: 'italic', color: '#64748b', fontWeight: '500'}}>{user.bio}</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const editBtnStyle = { padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' };
const cancelBtnStyle = { padding: '10px 20px', borderRadius: '12px', border: '1px solid #fee2e2', background: '#fef2f2', fontWeight: '700', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.9rem' };
const saveBtnStyle = { padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#16a34a', fontWeight: '700', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '0.9rem' };
const infoBoxStyle = { display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' };
const labelStyle = { display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' };
const valueStyle = { display: 'block', fontWeight: '700', color: '#334155', fontSize: '0.95rem', wordBreak: 'break-all' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: 'white' };

export default Profile;