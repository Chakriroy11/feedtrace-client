import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, CheckCircle, XCircle, ShieldCheck, MessageSquare, AlertTriangle } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import your hook

const MyReviews = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // 📱 Listen for screen size
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem('feedtrace_user_name');

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/reviews/all');
        if (res.ok) {
          const allReviews = await res.json();
          const userReviews = allReviews.filter(r => r.user === userName);
          userReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setMyReviews(userReviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReviews();
  }, [userName]);

  const totalReviews = myReviews.length;
  const approvedCount = myReviews.filter(r => r.status === 'approved').length;
  const pendingCount = myReviews.filter(r => r.status === 'pending').length;
  const rejectedCount = myReviews.filter(r => r.status === 'rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return { color: '#10b981', bg: '#dcfce7', icon: <CheckCircle size={16} />, text: isMobile ? 'Verified' : 'Verified & Published' };
      case 'rejected':
        return { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={16} />, text: isMobile ? 'Rejected' : 'Flagged / Rejected' };
      default:
        return { color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={16} />, text: isMobile ? 'Pending' : 'AI Review Pending' };
    }
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 100px 10px' : '20px 20px 60px 20px' 
    }}>
      
      <button 
        onClick={() => navigate('/home')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '20px' : '30px', background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', color: '#64748b', fontWeight: '600', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
      >
        <ArrowLeft size={18}/> {isMobile ? 'Home' : 'Back to Home'}
      </button>

      <div style={{ marginBottom: isMobile ? '25px' : '40px' }}>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>
          My <span style={{ color: '#3b82f6' }}>Contributions</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: isMobile ? '0.95rem' : '1.1rem' }}>Track your product reviews and AI Trust Scores.</p>
      </div>

      {/* --- STATS DASHBOARD: Responsive Grid --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
        gap: isMobile ? '12px' : '20px', 
        marginBottom: '40px' 
      }}>
        <StatCard isMobile={isMobile} title="Submitted" value={totalReviews} icon={<MessageSquare size={isMobile ? 20 : 24} color="#3b82f6" />} />
        <StatCard isMobile={isMobile} title="Verified" value={approvedCount} icon={<ShieldCheck size={isMobile ? 20 : 24} color="#10b981" />} />
        <StatCard isMobile={isMobile} title="Pending" value={pendingCount} icon={<Clock size={isMobile ? 20 : 24} color="#f59e0b" />} />
        <StatCard isMobile={isMobile} title="Rejected" value={rejectedCount} icon={<AlertTriangle size={isMobile ? 20 : 24} color="#ef4444" />} />
      </div>

      {/* --- REVIEWS LIST --- */}
      <div>
        <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: '#0f172a', marginBottom: '20px', fontWeight: '700' }}>Review History</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading...</div>
        ) : myReviews.length === 0 ? (
          <div style={{ background: 'white', padding: isMobile ? '40px 20px' : '60px 20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
            <MessageSquare size={40} color="#cbd5e1" style={{ marginBottom: '15px' }} />
            <p style={{ color: '#64748b', margin: 0 }}>You haven't submitted any reviews yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {myReviews.map((review) => {
              const badge = getStatusBadge(review.status);
              
              return (
                <div key={review._id} style={{ 
                  background: 'white', 
                  padding: isMobile ? '15px' : '25px', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  position: 'relative', 
                  overflow: 'hidden' 
                }}>
                  
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: badge.color }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 
                        style={{ margin: '0 0 4px 0', fontSize: isMobile ? '1rem' : '1.2rem', color: '#0f172a', cursor: 'pointer', fontWeight: '700' }} 
                        onClick={() => navigate(`/product/${review.productId}`)}
                      >
                        {review.productName || 'Product'}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
                        {new Date(review.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '5px', 
                      background: badge.bg, color: badge.color, 
                      padding: isMobile ? '4px 10px' : '6px 12px', 
                      borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', 
                      border: `1px solid ${badge.color}40`,
                      whiteSpace: 'nowrap'
                    }}>
                      {badge.icon} {badge.text}
                    </div>
                  </div>

                  {/* Trust Score & Rating */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row', 
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    gap: isMobile ? '8px' : '20px', 
                    background: '#f8fafc', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    border: '1px solid #f1f5f9' 
                  }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={isMobile ? 14 : 18} fill={i < review.rating ? "#f59e0b" : "transparent"} color={i < review.rating ? "#f59e0b" : "#cbd5e1"} />
                      ))}
                    </div>
                    
                    {!isMobile && <div style={{ height: '20px', width: '1px', background: '#cbd5e1' }}></div>}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>
                      <ShieldCheck size={16} color="#3b82f6" /> AI Trust: <span style={{ color: review.trustScore >= 70 ? '#10b981' : review.trustScore < 40 ? '#ef4444' : '#f59e0b' }}>{review.trustScore || 0}%</span>
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', margin: 0, fontStyle: 'italic', wordBreak: 'break-word' }}>
                    "{review.comment}"
                  </p>

                  {review.status === 'rejected' && (
                    <div style={{ fontSize: '0.8rem', color: '#ef4444', background: '#fef2f2', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                      <strong>Admin Note:</strong> Your review was flagged. This often happens if the bill image is unreadable or data mismatch was detected.
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

const StatCard = ({ title, value, icon, isMobile }) => (
  <div style={{ 
    background: 'white', 
    padding: isMobile ? '12px' : '20px', 
    borderRadius: '16px', 
    border: '1px solid #e2e8f0', 
    display: 'flex', 
    alignItems: 'center', 
    gap: isMobile ? '10px' : '15px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)' 
  }}>
    <div style={{ 
      background: '#f8fafc', 
      padding: isMobile ? '8px' : '12px', 
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
    </div>
  </div>
);

export default MyReviews;