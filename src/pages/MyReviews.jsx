import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, CheckCircle, XCircle, ShieldCheck, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; 

const MyReviews = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); 
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 Logic: Check both key types for maximum compatibility
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = storedUser.username || storedUser.name || localStorage.getItem('feedtrace_user_name');

  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!userName) return;
      try {
        // 🚀 FIXED: Changed single quotes to backticks (`)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/all`);
        if (res.ok) {
          const allReviews = await res.json();
          // Filter products with case-insensitive and trimmed values
          const userReviews = Array.isArray(allReviews) 
            ? allReviews.filter(r => r.user?.trim() === userName?.trim() || r.email === storedUser.email)
            : [];
          
          userReviews.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
          setMyReviews(userReviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, [userName, storedUser.email]);

  const totalReviews = myReviews.length;
  const approvedCount = myReviews.filter(r => r.status === 'approved').length;
  const pendingCount = myReviews.filter(r => r.status === 'pending').length;
  const rejectedCount = myReviews.filter(r => r.status === 'rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} />, text: isMobile ? 'Verified' : 'Verified & Published' };
      case 'rejected':
        return { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} />, text: isMobile ? 'Flagged' : 'Flagged / Rejected' };
      default:
        return { color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={14} />, text: isMobile ? 'Pending' : 'AI Review Pending' };
    }
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 120px 10px' : '20px 20px 60px 20px' 
    }}>
      
      <button 
        onClick={() => navigate('/home')} 
        style={backBtnStyle}
      >
        <ArrowLeft size={18}/> {isMobile ? 'Home' : 'Back to Dashboard'}
      </button>

      <div style={{ marginBottom: isMobile ? '30px' : '45px' }}>
        <h1 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
          My <span style={{ color: '#3b82f6' }}>Contributions</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '500' }}>Manage your reviews and track your verified trust score.</p>
      </div>

      {/* --- STATS DASHBOARD --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
        gap: isMobile ? '12px' : '20px', 
        marginBottom: '40px' 
      }}>
        <StatCard title="Total" value={totalReviews} icon={<MessageSquare size={22} color="#3b82f6" />} />
        <StatCard title="Verified" value={approvedCount} icon={<ShieldCheck size={22} color="#10b981" />} />
        <StatCard title="Pending" value={pendingCount} icon={<Clock size={22} color="#f59e0b" />} />
        <StatCard title="Flagged" value={rejectedCount} icon={<AlertTriangle size={22} color="#ef4444" />} />
      </div>

      {/* --- REVIEWS LIST --- */}
      <div>
        <h2 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>Contribution History</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto' }} />
          </div>
        ) : myReviews.length === 0 ? (
          <div style={emptyStateStyle}>
            <MessageSquare size={50} color="#cbd5e1" style={{ marginBottom: '15px' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>No reviews yet</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Start contributing to build your Trust Score.</p>
            <button onClick={() => navigate('/home')} style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {myReviews.map((review) => {
              const badge = getStatusBadge(review.status);
              return (
                <div key={review._id} style={reviewCardStyle(badge.color)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 
                        style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0f172a', cursor: 'pointer', fontWeight: '800' }} 
                        onClick={() => navigate(`/product/${review.productId}`)}
                      >
                        {review.productName || 'Verified Product'}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                        {new Date(review.timestamp || review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      background: badge.bg, color: badge.color, 
                      padding: '6px 14px', borderRadius: '12px', 
                      fontSize: '0.75rem', fontWeight: '900', 
                      border: `1.5px solid ${badge.color}20`,
                      whiteSpace: 'nowrap'
                    }}>
                      {badge.icon} {badge.text}
                    </div>
                  </div>

                  {/* AI Insights & Rating Section */}
                  <div style={insightBoxStyle}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? "#f59e0b" : "transparent"} color={i < review.rating ? "#f59e0b" : "#e2e8f0"} />
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>
                      <ShieldCheck size={18} color="#3b82f6" /> AI Trust Score: 
                      <span style={{ color: review.trustScore >= 70 ? '#10b981' : review.trustScore < 40 ? '#ef4444' : '#f59e0b' }}>
                        {review.trustScore || 0}%
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', margin: '5px 0', fontWeight: '500' }}>
                    "{review.comment}"
                  </p>

                  {review.status === 'rejected' && (
                    <div style={rejectNoteStyle}>
                      <AlertTriangle size={16} /> 
                      <span><strong>AI Feedback:</strong> Bill authenticity couldn't be confirmed. Ensure the photo is clear.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS & STYLES ---
const StatCard = ({ title, value, icon }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '15px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{title}</div>
    </div>
  </div>
);

const backBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px', background: 'white', border: '1.5px solid #f1f5f9', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', color: '#64748b', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const emptyStateStyle = { background: 'white', padding: '60px 20px', borderRadius: '24px', textAlign: 'center', border: '2px dashed #e2e8f0' };
const reviewCardStyle = (borderColor) => ({ background: 'white', padding: '25px', borderRadius: '24px', border: '1.5px solid #f1f5f9', borderLeft: `6px solid ${borderColor}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '15px' });
const insightBoxStyle = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', background: '#f8fafc', padding: '15px', borderRadius: '16px', border: '1px solid #f1f5f9' };
const rejectNoteStyle = { fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '12px 15px', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '600' };

export default MyReviews;